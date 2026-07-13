// ─────────────────────────────────────────────────────────────────────────────
// Risk Engine — offline generation pipeline (runner).
//
// Hunts partner-grade market risks over the curated ledger + cached research
// corpus, verifies them against live Exa evidence, computes every € impact
// with the REAL engine (via scripts/risks-bridge.mts), judges them blind, and
// emits risks/risks.json + risks/risks.review.md. The demo app NEVER calls
// this at runtime — the curated register (lib/risks.ts) cites these artifacts.
//
//   npm run risks                      run stages whose output isn't cached
//   npm run risks -- --from=hunt       re-run hunt and everything after
//   npm run risks -- --only=judge      re-run exactly one stage from caches
//   npm run risks -- --force           re-run everything
//
// Stages: context → digest → hunt → compile → evidence → judge → emit.
// All quality knobs live in scripts/risks-plan.mjs — tune there, not here.
// Zero deps beyond zod (already a dependency): plain Node ESM, global fetch,
// keys read from .env.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  BANNED_GENRES,
  COUNTS,
  GOLD_EXEMPLAR,
  HUNTER_CONTRACT,
  LENSES,
  PERTURBATION_SEMANTICS,
  RANKING,
  REJECTED_PATTERNS,
  RUBRIC,
  SEED,
  SEMANTIC_DEDUP,
  STYLE,
  CLASSIFY_TEST,
} from "./risks-plan.mjs";
import {
  adjudicationSchema,
  classifySchema,
  digestSchema,
  familyPartitionSchema,
  huntBatchSchema,
  hypothesisSchema,
  jsonSchemaOf,
  mergeSchema,
  polishSchema,
  querySetSchema,
  scorecardSchema,
  synthesisSchema,
} from "./risks-schemas.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RISKS_DIR = path.join(ROOT, "risks");
const STAGES_DIR = path.join(RISKS_DIR, "stages");
const RAW_LLM_DIR = path.join(RISKS_DIR, "raw", "llm");
const RAW_EVIDENCE_DIR = path.join(RISKS_DIR, "raw", "evidence");
const RESEARCH_RAW_DIR = path.join(ROOT, "research", "raw");

const STAGE_ORDER = ["context", "digest", "hunt", "compile", "evidence", "judge", "polish", "classify", "emit"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (x) => crypto.createHash("sha256").update(typeof x === "string" ? x : JSON.stringify(x)).digest("hex");

// ── env + model preflight ─────────────────────────────────────────────────────

function readEnv() {
  const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const get = (name) => env.match(new RegExp(`^${name}=["']?([^"'\\r\\n]+)`, "m"))?.[1];
  const strip = (m) => m?.replace(/^~/, "");
  const cfg = {
    exaKey: get("EXA_API_KEY"),
    openrouterKey: get("OPENROUTER_API_KEY"),
    BASIC: strip(get("BASIC_MODEL")),
    SMART: strip(get("SMART_MODEL")),
    POWER: strip(get("POWER_MODEL")),
  };
  for (const [k, v] of Object.entries(cfg)) {
    if (!v) throw new Error(`${k} missing from .env`);
  }
  return cfg;
}

async function preflightModels(cfg) {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { authorization: `Bearer ${cfg.openrouterKey}` },
  });
  if (!res.ok) throw new Error(`OpenRouter /models ${res.status}: ${await res.text()}`);
  const { data } = await res.json();
  const ids = new Set(data.map((m) => m.id));
  const missing = ["BASIC", "SMART", "POWER"].filter((role) => !ids.has(cfg[role]));
  if (missing.length > 0) {
    const anthropic = data
      .map((m) => m.id)
      .filter((id) => id.startsWith("anthropic/"))
      .sort()
      .join("\n    ");
    throw new Error(
      `Model slug(s) not on OpenRouter: ${missing.map((r) => `${r}_MODEL=${cfg[r]}`).join(", ")}.\n` +
        `  Fix .env with live slugs. Available anthropic models:\n    ${anthropic}`,
    );
  }
}

// ── OpenRouter client (transcripts, retries, structured-output fallback) ──────

const usageByStage = {};
let callCounter = 0;

async function chat(cfg, stage, label, model, messages, opts = {}) {
  const { schema, schemaName, effort, maxTokens = 8000 } = opts;
  const body = {
    model,
    messages,
    max_tokens: maxTokens,
    ...(effort ? { reasoning: { effort } } : {}),
    ...(schema ? { response_format: { type: "json_schema", json_schema: jsonSchemaOf(schema, schemaName) } } : {}),
  };

  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    let res, text;
    try {
      res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${cfg.openrouterKey}` },
        body: JSON.stringify(body),
      });
      text = await res.text();
    } catch (err) {
      // ECONNRESET / stream terminated — retry like a 5xx.
      lastErr = new Error(`network error (${label}): ${String(err)}`);
      const wait = attempt === 0 ? 5000 : 20000;
      console.warn(`  ✕ network error (${label}) — retrying in ${wait / 1000}s…`);
      await sleep(wait);
      continue;
    }
    if (res.ok) {
      const data = JSON.parse(text);
      const content = data.choices?.[0]?.message?.content;
      const finish = data.choices?.[0]?.finish_reason;
      // Truncated JSON is silent data loss — never repair it; retry with a
      // bigger budget instead.
      if (finish === "length" && body.max_tokens < 32000) {
        body.max_tokens = Math.min(body.max_tokens * 2, 32000);
        console.warn(`  ↺ ${label}: hit max_tokens — retrying with ${body.max_tokens}`);
        lastErr = new Error(`completion truncated (finish: length)`);
        continue;
      }
      if (!content) {
        lastErr = new Error(`empty completion (finish: ${finish})`);
        continue;
      }
      const call = ++callCounter;
      const dir = path.join(RAW_LLM_DIR, stage);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, `${String(call).padStart(3, "0")}-${label}.json`),
        JSON.stringify(
          { model, promptSha256: sha(messages), messages, content, usage: data.usage ?? null, ts: new Date().toISOString() },
          null,
          2,
        ) + "\n",
      );
      const u = (usageByStage[stage] ??= { calls: 0, promptTokens: 0, completionTokens: 0 });
      u.calls += 1;
      u.promptTokens += data.usage?.prompt_tokens ?? 0;
      u.completionTokens += data.usage?.completion_tokens ?? 0;
      await sleep(500); // politeness between LLM calls
      return content;
    }
    // Some providers reject response_format / reasoning — drop and retry once each.
    if (res.status === 400 && body.response_format) {
      console.warn(`  400 with response_format (${label}) — retrying without`);
      delete body.response_format;
      continue;
    }
    if (res.status === 400 && body.reasoning) {
      console.warn(`  400 with reasoning (${label}) — retrying without`);
      delete body.reasoning;
      continue;
    }
    lastErr = new Error(`OpenRouter ${res.status} (${label}): ${text.slice(0, 400)}`);
    if (res.status === 429 || res.status >= 500) {
      const wait = attempt === 0 ? 5000 : 20000;
      console.warn(`  ${res.status} (${label}) — retrying in ${wait / 1000}s…`);
      await sleep(wait);
      continue;
    }
    throw lastErr;
  }
  throw lastErr ?? new Error(`OpenRouter failed (${label})`);
}

function parseJsonLoose(text) {
  const stripped = text.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object found in completion");
  return JSON.parse(stripped.slice(start, end + 1));
}

/** Chat → parse → Zod → one BASIC repair round-trip → throw. */
async function chatJson(cfg, stage, label, model, messages, schema, schemaName, opts = {}) {
  const content = await chat(cfg, stage, label, model, messages, { ...opts, schema, schemaName });
  try {
    return schema.parse(parseJsonLoose(content));
  } catch (err) {
    console.warn(`  ⚠ ${label}: invalid JSON (${String(err).slice(0, 120)}…) — repairing`);
    const repaired = await chat(
      cfg,
      stage,
      `${label}-repair`,
      cfg.BASIC,
      [
        {
          role: "user",
          content:
            `The following model output failed validation.\n\nOUTPUT:\n${content}\n\n` +
            `TARGET JSON SCHEMA (conform to this exactly):\n${JSON.stringify(jsonSchemaOf(schema, schemaName).schema)}\n\n` +
            `VALIDATION ERRORS:\n${String(err).slice(0, 2000)}\n\n` +
            `Return ONLY the corrected JSON object, preserving all content. No commentary.`,
        },
      ],
      { schema, schemaName, maxTokens: opts.maxTokens ?? 8000 },
    );
    return schema.parse(parseJsonLoose(repaired));
  }
}

// ── engine bridge ─────────────────────────────────────────────────────────────

function bridge(cmd, input) {
  fs.mkdirSync(STAGES_DIR, { recursive: true });
  const inFile = path.join(STAGES_DIR, `.bridge-${cmd}-in.json`);
  const outFile = path.join(STAGES_DIR, `.bridge-${cmd}-out.json`);
  const args = ["--no-warnings", "--import", "./scripts/risks-register.mjs", "scripts/risks-bridge.mts", cmd];
  if (input !== undefined) {
    fs.writeFileSync(inFile, JSON.stringify(input));
    args.push(inFile);
  }
  args.push(outFile);
  const proc = spawnSync("node", args, { cwd: ROOT, encoding: "utf8" });
  if (proc.status !== 0) throw new Error(`bridge ${cmd} failed:\n${proc.stderr}`);
  const out = JSON.parse(fs.readFileSync(outFile, "utf8"));
  fs.rmSync(inFile, { force: true });
  fs.rmSync(outFile, { force: true });
  return out;
}

// ── stage cache ───────────────────────────────────────────────────────────────

function stageFile(name) {
  return path.join(STAGES_DIR, `${name}.json`);
}

function writeStage(name, data, inputsHash) {
  fs.mkdirSync(path.dirname(stageFile(name)), { recursive: true });
  const tmp = stageFile(name) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify({ inputsHash, generatedAt: new Date().toISOString(), data }, null, 2) + "\n");
  fs.renameSync(tmp, stageFile(name));
}

function readStage(name) {
  const file = stageFile(name);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function requireStage(name) {
  const cached = readStage(name);
  if (!cached) throw new Error(`stage '${name}' has no cached output — run it first (npm run risks -- --only=${name})`);
  return cached.data;
}

// ── kill log ─────────────────────────────────────────────────────────────────
// Kills are persisted INSIDE each stage's output file (so --only reruns keep
// earlier stages' kills); emit aggregates them into risks/killlog.json.

function killInto(kills, stage, id, title, reason, extra = {}) {
  kills.push({ stage, id, title, reason, ...extra });
  console.log(`  ✗ killed ${id} — ${reason.slice(0, 100)}`);
}

function aggregateKills() {
  const kills = [];
  for (const name of ["03-compiled", "04-evidence", "05-judged"]) {
    const cached = readStage(name);
    if (cached?.data?.kills) kills.push(...cached.data.kills);
  }
  return kills;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(arr, seed) {
  const rng = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function jaccard(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  const inter = [...sa].filter((x) => sb.has(x)).length;
  return inter / (sa.size + sb.size - inter);
}

const eur = (x) =>
  `${x < 0 ? "−" : x > 0 ? "+" : ""}€${Math.abs(x) >= 100 ? Math.abs(x).toFixed(0) : Math.abs(x).toFixed(2)}M`;
const pct = (x) => `${Math.round(x * 100)}%`;

// ══ Stage 0 — context ═════════════════════════════════════════════════════════

function runContext() {
  console.log("● context — engine bridge");
  const pack = bridge("context");
  writeStage("00-context", pack, sha("context"));
}

// ══ Stage 1 — digest ══════════════════════════════════════════════════════════

function slimGroup(raw) {
  return {
    id: raw.id,
    feeds: raw.feeds,
    intent: raw.intent,
    queries: raw.queries.map((q) => ({
      query: q.query,
      results: q.results.map((r) => ({
        title: r.title,
        url: r.url,
        publishedDate: r.publishedDate,
        text: r.text,
      })),
    })),
  };
}

async function runDigest(cfg, force) {
  const ctx = requireStage("00-context");
  const groups = fs
    .readdirSync(RESEARCH_RAW_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(RESEARCH_RAW_DIR, f), "utf8")));
  console.log(`● digest — ${groups.length} groups (${cfg.BASIC})`);

  const digests = {};
  for (const raw of groups) {
    const name = `01-digest/${raw.id}`;
    const cached = readStage(name);
    if (cached && !force) {
      console.log(`  ○ ${raw.id} — cached`);
      digests[raw.id] = cached.data;
      continue;
    }
    console.log(`  → ${raw.id}`);
    const fedNodes = ctx.ledger.filter((n) => raw.feeds.includes(n.id));
    const result = await chatJson(
      cfg,
      "digest",
      raw.id,
      cfg.BASIC,
      [
        {
          role: "system",
          content:
            "You digest raw market-research search results into citable claim atoms for a risk-hunting pass over a market model. " +
            "Extract only what the text actually says — every excerpt must be verbatim. Numeric claims are worth more than qualitative ones.",
        },
        {
          role: "user",
          content:
            `THE CURATED LEDGER NODES THIS GROUP FEEDS (with their derivations — compare against them):\n` +
            `${JSON.stringify(fedNodes, null, 1)}\n\n` +
            `RAW SEARCH RESULTS (group '${raw.id}', intent: ${raw.intent}):\n${JSON.stringify(slimGroup(raw), null, 1)}\n\n` +
            `Emit JSON: { claims: [≤25 atomic claims with verbatim excerpts ≤300 chars, tags from ` +
            `structure|definition|substitution|demand|competition|regulation|base-rate|execution], ` +
            `tensions: [claims that CONTRADICT a curated node value/derivation, or each other — name the node ids], ` +
            `absences: [what the queries looked for and did NOT find — an unquantified market is information] }`,
        },
      ],
      digestSchema,
      "digest",
      { maxTokens: 12000 },
    );
    // Hard cap lives here (the wire schema can't carry maxItems); ids are
    // deterministic: <group>#c<n>.
    result.claims = result.claims.slice(0, 25).map((c, i) => ({ id: `${raw.id}#c${i}`, ...c }));
    writeStage(name, result, sha([raw.id, raw.queries?.length]));
    digests[raw.id] = result;
  }

  const synthName = "01-digest/_synthesis";
  if (!readStage(synthName) || force) {
    console.log(`  → cross-corpus synthesis (${cfg.SMART})`);
    const compact = Object.fromEntries(
      Object.entries(digests).map(([id, d]) => [
        id,
        { claims: d.claims.map((c) => `${c.id}: ${c.claim}`), tensions: d.tensions, absences: d.absences },
      ]),
    );
    const synthesis = await chatJson(
      cfg,
      "digest",
      "_synthesis",
      cfg.SMART,
      [
        {
          role: "system",
          content:
            "You synthesize per-group research digests into the cross-corpus tensions that matter for risk-hunting: " +
            "where the corpus disagrees with the curated model, where groups disagree with each other, and which absences are load-bearing.",
        },
        {
          role: "user",
          content:
            `THE CURATED LEDGER (values + derivations):\n${JSON.stringify(ctx.ledger, null, 1)}\n\n` +
            `PER-GROUP DIGESTS:\n${JSON.stringify(compact, null, 1)}\n\n` +
            `Emit JSON: { tensions: [≤25, each {text, nodes: [ledger ids], refs: [claim ids like "tam-base#c3"]}] } — ` +
            `ranked by how much the tension, if resolved against the model, would change TAM/SAM/YAM.`,
        },
      ],
      synthesisSchema,
      "synthesis",
      { maxTokens: 12000 },
    );
    synthesis.tensions = synthesis.tensions.slice(0, 25);
    writeStage(synthName, synthesis, sha(Object.keys(digests)));
  }
}

// ══ Stage 2 — hunt ════════════════════════════════════════════════════════════

async function runHunt(cfg, force) {
  const ctx = requireStage("00-context");
  const synthesis = requireStage("01-digest/_synthesis");
  console.log(`● hunt — ${LENSES.length} lenses (${cfg.POWER}, reasoning: high)`);

  const contextBlock =
    `VENTURE PROFILE:\n${JSON.stringify(ctx.ventureProfile, null, 1)}\n\n` +
    `BASELINE (engine-computed): TAM €${ctx.baseline.tam}M · SAM €${ctx.baseline.sam}M · YAM €${ctx.baseline.yam.toFixed(2)}M\n\n` +
    `THE LEDGER (every node; funnelActive marks what your perturbations may touch):\n${JSON.stringify(ctx.ledger, null, 1)}\n\n` +
    `AFFORDANCES (engine-computed band-edge impacts + information value — leverage without arithmetic):\n${JSON.stringify(ctx.affordances, null, 1)}\n\n` +
    `BOUNDARY EXCLUSIONS (what the model deliberately leaves out):\n${JSON.stringify(ctx.boundaryExclusions, null, 1)}\n\n` +
    `CROSS-CORPUS TENSIONS (corpus vs model — prime hunting ground):\n${JSON.stringify(synthesis.tensions, null, 1)}`;

  for (const lens of LENSES) {
    const name = `02-hunt/${lens.id}`;
    if (readStage(name) && !force) {
      console.log(`  ○ ${lens.id} — cached`);
      continue;
    }
    console.log(`  → ${lens.id}`);
    const digestBlock = lens.digests
      .map((g) => {
        const d = readStage(`01-digest/${g}`);
        if (!d) return `(digest '${g}' missing)`;
        return `── digest: ${g} ──\n${JSON.stringify(d.data, null, 1)}`;
      })
      .join("\n\n");

    const banned = [...BANNED_GENRES, ...REJECTED_PATTERNS].map((b) => `- ${b}`).join("\n");
    const batch = await chatJson(
      cfg,
      "hunt",
      lens.id,
      cfg.POWER,
      [
        {
          role: "system",
          content:
            `${HUNTER_CONTRACT}\n\n${PERTURBATION_SEMANTICS}\n\nBANNED GENRES (emitting one of these wastes your slot):\n${banned}\n\n` +
            `GOLD EXEMPLAR (the target register — do NOT repeat its content):\n${JSON.stringify(GOLD_EXEMPLAR, null, 1)}`,
        },
        {
          role: "user",
          content:
            `${contextBlock}\n\n` +
            `YOUR LENS — ${lens.title}:\n${lens.brief}\n\nQUESTION STEMS:\n${lens.stems.map((s) => `- ${s}`).join("\n")}\n\n` +
            `LENS-MAPPED DIGESTS:\n${digestBlock}\n\n` +
            `Emit JSON: { hypotheses: [${COUNTS.hypothesesPerLensMin}–${COUNTS.hypothesesPerLensMax} hypotheses in the exemplar's exact shape] }. ` +
            `Quotas: ≥1 with expectedObviousness "low"; ≥1 whose perturbation targets none of tamBase/serviceableFactor/obtainableFactor.`,
        },
      ],
      huntBatchSchema,
      "hunt_batch",
      { effort: "high", maxTokens: 20000 },
    );
    writeStage(name, batch, sha([lens.id, lens.brief]));
  }
}

// ══ Stage 3 — compile ═════════════════════════════════════════════════════════

async function runCompile(cfg) {
  console.log("● compile — engine validation + impact");
  const kills = [];
  const hypotheses = [];
  for (const lens of LENSES) {
    const cached = readStage(`02-hunt/${lens.id}`);
    if (!cached) throw new Error(`hunt '${lens.id}' missing — run hunt first`);
    for (const h of cached.data.hypotheses) {
      let riskId = `risk.${lens.id}.${h.id}`;
      let n = 2;
      while (hypotheses.some((x) => x.riskId === riskId)) riskId = `risk.${lens.id}.${h.id}-${n++}`;
      hypotheses.push({ ...h, lens: lens.id, riskId });
    }
  }
  console.log(`  ${hypotheses.length} hypotheses from ${LENSES.length} lenses`);

  // Normalize op values (schema uses null; the engine expects undefined absent).
  const opsOf = (h) =>
    h.perturbation.map((p) => ({
      nodeId: p.nodeId,
      op: p.op,
      ...(p.value === null || p.value === undefined ? {} : { value: p.value }),
      ...(p.note ? { note: p.note } : {}),
    }));

  let results = bridge("evaluate", hypotheses.map((h) => ({ id: h.riskId, perturbation: opsOf(h) })));
  const byId = new Map(results.map((r) => [r.id, r]));

  // One repair round-trip for engine-rejected perturbations.
  const failed = hypotheses.filter((h) => !byId.get(h.riskId).ok);
  for (const h of failed) {
    const error = byId.get(h.riskId).error;
    console.log(`  ⚠ ${h.riskId}: ${error.split("\n")[0].slice(0, 90)}… — repair round-trip`);
    try {
      const repaired = await chatJson(
        cfg,
        "compile",
        `${h.riskId}-repair`,
        cfg.POWER,
        [
          {
            role: "system",
            content: `${PERTURBATION_SEMANTICS}\n\nFix the hypothesis's targetNodes/perturbation so it passes validation WITHOUT changing the claim's meaning. If the claim cannot be expressed against funnel-active nodes, translate it into the funnel nodes it would actually move.`,
          },
          {
            role: "user",
            content:
              `FUNNEL-ACTIVE NODES:\n${requireStage("00-context").ledger.filter((n) => n.funnelActive).map((n) => `${n.id} (${n.unit}, value ${n.value})`).join("\n")}\n\n` +
              `HYPOTHESIS:\n${JSON.stringify(h, null, 1)}\n\nVALIDATION ERROR:\n${error}\n\n` +
              `Emit the corrected hypothesis JSON (same shape).`,
          },
        ],
        hypothesisSchema,
        "hypothesis",
        { maxTokens: 8000 },
      );
      const [check] = bridge("evaluate", [{ id: h.riskId, perturbation: opsOf(repaired) }]);
      if (check.ok) {
        Object.assign(h, repaired, { riskId: h.riskId, lens: h.lens });
        byId.set(h.riskId, check);
      } else {
        killInto(kills, "compile", h.riskId, h.title, `repair failed: ${check.error.split("\n").slice(0, 2).join(" ")}`);
      }
    } catch (err) {
      killInto(kills, "compile", h.riskId, h.title, `repair errored: ${String(err).slice(0, 200)}`);
    }
  }

  const compiled = [];
  for (const h of hypotheses) {
    const r = byId.get(h.riskId);
    if (!r.ok) continue; // already killed
    if (r.noop) {
      killInto(kills, "compile", h.riskId, h.title, "perturbation is a no-op at the baseline scenario");
      continue;
    }
    compiled.push({ ...h, perturbation: opsOf(h), impact: r.impact });
  }
  console.log(`  ✓ ${compiled.length} compiled, ${hypotheses.length - compiled.length} killed`);
  writeStage("03-compiled", { risks: compiled, kills }, sha(hypotheses.map((h) => h.riskId)));
}

// ══ Stage 4 — evidence ════════════════════════════════════════════════════════

async function exaSearch(cfg, query, attempt = 0) {
  let res;
  try {
    res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": cfg.exaKey },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults: COUNTS.exaResultsPerQuery,
        contents: { text: { maxCharacters: 1500 } },
      }),
    });
  } catch (err) {
    if (attempt < 2) {
      console.warn(`  ✕ Exa network error — retrying in 5s…`);
      await sleep(5000);
      return exaSearch(cfg, query, attempt + 1);
    }
    throw err;
  }
  if (!res.ok) {
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      console.warn(`  Exa ${res.status} — retrying in 5s…`);
      await sleep(5000);
      return exaSearch(cfg, query, 1);
    }
    throw new Error(`Exa ${res.status} for "${query}": ${body}`);
  }
  const data = await res.json();
  return (data.results ?? []).map((r) => ({
    title: r.title ?? null,
    url: r.url,
    publishedDate: r.publishedDate ?? null,
    text: r.text ?? null,
  }));
}

async function runEvidence(cfg) {
  const { risks } = requireStage("03-compiled");
  const kills = [];
  console.log(`● evidence — ${risks.length} risks (query-gen ${cfg.BASIC} → Exa → adjudication ${cfg.SMART})`);
  fs.mkdirSync(RAW_EVIDENCE_DIR, { recursive: true });

  // 4a — falsifier-shaped query generation, batched.
  const querySets = new Map();
  for (let i = 0; i < risks.length; i += 5) {
    const batch = risks.slice(i, i + 5);
    const out = await chatJson(
      cfg,
      "evidence",
      `queries-${i / 5}`,
      cfg.BASIC,
      [
        {
          role: "system",
          content:
            "Generate web-search queries to verify or refute market-risk hypotheses. Queries must contain concrete entities " +
            "(directive names, vendor names, country + year), never topic words. Each risk gets one CONFIRMING query, one " +
            "FALSIFYING query (search for what would disconfirm — derived from the falsifier field), and one BASE-RATE/analog query where useful.",
        },
        {
          role: "user",
          content:
            `RISKS:\n${JSON.stringify(
              batch.map((r) => ({ riskId: r.riskId, title: r.title, claim: r.narrative, falsifier: r.falsifier })),
              null,
              1,
            )}\n\nEmit JSON: { items: [{riskId, queries: [{query, kind: confirming|falsifying|base-rate}]}] } — ${COUNTS.evidenceQueriesPerRisk} queries per risk.`,
        },
      ],
      querySetSchema,
      "query_set",
      { maxTokens: 4000 },
    );
    for (const item of out.items) querySets.set(item.riskId, item.queries);
  }

  // 4b — execute Exa, cached per risk (the resume point for interrupted runs).
  for (const risk of risks) {
    const rawFile = path.join(RAW_EVIDENCE_DIR, `${risk.riskId}.json`);
    if (fs.existsSync(rawFile)) continue;
    const queries = querySets.get(risk.riskId) ?? [];
    if (queries.length === 0) console.warn(`  ⚠ no queries generated for ${risk.riskId}`);
    console.log(`  → exa: ${risk.riskId} (${queries.length} queries)`);
    const executed = [];
    for (const q of queries) {
      const results = await exaSearch(cfg, q.query);
      executed.push({ query: q.query, kind: q.kind, results });
      await sleep(1200); // politeness / rate limits (research.mjs precedent)
    }
    fs.writeFileSync(
      rawFile,
      JSON.stringify({ riskId: risk.riskId, fetchedAt: new Date().toISOString(), queries: executed }, null, 2) + "\n",
    );
  }

  // 4c — adjudication, one call per risk.
  const adjudicated = [];
  for (const risk of risks) {
    const raw = JSON.parse(fs.readFileSync(path.join(RAW_EVIDENCE_DIR, `${risk.riskId}.json`), "utf8"));
    const flatResults = raw.queries.flatMap((q) => q.results);
    if (flatResults.length === 0) {
      adjudicated.push({ ...risk, evidenceStatus: "speculative", evidence: [], evidenceGap: true });
      continue;
    }
    console.log(`  → adjudicate: ${risk.riskId}`);
    const adj = await chatJson(
      cfg,
      "evidence",
      `adj-${risk.riskId}`,
      cfg.SMART,
      [
        {
          role: "system",
          content:
            "You adjudicate whether found evidence supports, contradicts, or is silent on a market-risk hypothesis. Every stance " +
            "needs a VERBATIM quote from the result text. Status: 'corroborated' = ≥1 independent source materially supports the " +
            "mechanism's key premise; 'refuted' = a LOAD-BEARING premise is directly contradicted by a strong source; 'contested' = " +
            "credible contradiction of a non-load-bearing link; 'speculative' = no signal either way (absence of coverage is NOT refutation). " +
            "You may revise the likelihood in a bounded way with a rationale; you may NOT change the perturbation or target nodes.",
        },
        {
          role: "user",
          content:
            `HYPOTHESIS:\n${JSON.stringify(
              {
                title: risk.title,
                narrative: risk.narrative,
                mechanism: risk.mechanism,
                falsifier: risk.falsifier,
                likelihood: risk.likelihood,
              },
              null,
              1,
            )}\n\nSEARCH RESULTS (grouped by query intent):\n${JSON.stringify(raw.queries.map((q) => ({ query: q.query, kind: q.kind, results: q.results })), null, 1)}\n\n` +
            `Emit JSON: { stances: [{url, stance, quote}], status, statusRationale, evidence: [≤${COUNTS.evidenceItemsMax} best items: {title, sourceType: industry-report|analyst-estimate|triangulation, publisher, date, excerpt, url}], revisedLikelihood (or null), revisionRationale (or null) }`,
        },
      ],
      adjudicationSchema,
      "adjudication",
      { maxTokens: 12000 },
    );
    if (adj.status === "refuted") {
      const killing = adj.stances.find((s) => s.stance === "contradicts");
      killInto(kills, "evidence", risk.riskId, risk.title, `refuted: ${adj.statusRationale}`, { quote: killing?.quote });
      continue;
    }
    // Bounded likelihood revision: clamp to ±0.2 of the hunter's prior.
    let likelihood = risk.likelihood;
    if (adj.revisedLikelihood !== null && adj.revisedLikelihood !== undefined) {
      const clamped = Math.max(risk.likelihood.value - 0.2, Math.min(risk.likelihood.value + 0.2, adj.revisedLikelihood));
      likelihood = {
        value: clamped,
        rationale: `${risk.likelihood.rationale} [evidence revision: ${adj.revisionRationale ?? "-"}]`,
        basis: "evidence",
        revisedFrom: risk.likelihood.value,
      };
    }
    adjudicated.push({
      ...risk,
      likelihood,
      evidenceStatus: adj.status,
      evidence: adj.evidence.slice(0, COUNTS.evidenceItemsMax).map((e) => ({ ...e, attached: true })),
      stances: adj.stances,
    });
  }
  console.log(`  ✓ ${adjudicated.length} adjudicated (${risks.length - adjudicated.length} refuted)`);
  writeStage("04-evidence", { risks: adjudicated, kills }, sha(risks.map((r) => r.riskId)));
}

// ══ Stage 5 — judge ═══════════════════════════════════════════════════════════

async function runJudge(cfg) {
  const { risks } = requireStage("04-evidence");
  const kills = [];
  console.log(`● judge — ${risks.length} risks, blind (${cfg.POWER}, reasoning: high, seed ${SEED})`);

  const rubricBlock = RUBRIC.dimensions
    .map((d) => `${d.key} (0–4)\n  0 = ${d.anchor0}\n  4 = ${d.anchor4}`)
    .join("\n");

  const scored = [];
  for (const risk of shuffled(risks, SEED)) {
    const blind = { ...risk };
    delete blind.lens; // judge never sees which lens produced it
    delete blind.riskId; // the id embeds the lens name — mask it too
    delete blind.impact; // judge scores the argument, not the € size
    // Scorecards are cached per (risk, rubric) so dedup/ranking iterations
    // don't re-pay POWER-model scoring calls. Rubric edits invalidate.
    const scoreCacheName = `05-scores/${risk.riskId}`;
    // Content in the hash: a same-id hypothesis from a NEW cycle with different
    // text must re-score, not inherit the old cycle's scorecard.
    const scoreHash = sha([risk.riskId, RUBRIC, risk.narrative, risk.mechanism]);
    const cachedScore = readStage(scoreCacheName);
    let scorecard;
    if (cachedScore && cachedScore.inputsHash === scoreHash) {
      console.log(`  ○ score: ${risk.riskId} — cached`);
      scorecard = scorecardSchema.parse(cachedScore.data);
    } else {
      console.log(`  → score: ${risk.riskId}`);
      scorecard = await chatJson(
      cfg,
      "judge",
      `score-${risk.riskId}`,
      cfg.POWER,
      [
        {
          role: "system",
          content:
            "You are a hostile review partner scoring a proposed market risk before it reaches a client. Score each rubric dimension " +
            "0–4 against the anchors. Every score needs a ≤2-sentence note citing the risk's OWN fields. Do not reward confident prose; " +
            "reward specificity, mechanism, and honesty about evidence.\n\nRUBRIC:\n" +
            rubricBlock +
            `\n\nCONTEXT: the client's team has already read the full market model, including every sensitivity band. ` +
            `"A number in the model might be at its band edge" is nonObviousness 0 unless a NEW reason is named.`,
        },
        {
          role: "user",
          content: `THE RISK:\n${JSON.stringify(blind, null, 1)}\n\nEmit JSON: {specificity: {score, note}, nonObviousness: {score, note}, mechanismDepth: {score, note}, evidenceQuality: {score, note}, decisionRelevance: {score, note}}`,
        },
      ],
      scorecardSchema,
      "scorecard",
      { effort: "high", maxTokens: 4000 },
      );
      writeStage(scoreCacheName, scorecard, scoreHash);
    }
    const total = Object.values(scorecard).reduce((s, d) => s + d.score, 0);
    const judge = { ...scorecard, total };
    if (
      scorecard.specificity.score <= RUBRIC.kill.specificityMax ||
      scorecard.mechanismDepth.score <= RUBRIC.kill.mechanismDepthMax ||
      total <= RUBRIC.kill.totalMax
    ) {
      killInto(kills, "judge", risk.riskId, risk.title, `scores: spec ${scorecard.specificity.score}, mech ${scorecard.mechanismDepth.score}, total ${total}/20`, { judge });
      continue;
    }
    scored.push({ ...risk, judge });
  }

  // Dedup pass 1: deterministic pre-cluster → one merge call per cluster.
  const clusters = [];
  const assigned = new Set();
  for (const a of scored) {
    if (assigned.has(a.riskId)) continue;
    const cluster = [a];
    assigned.add(a.riskId);
    for (const b of scored) {
      if (assigned.has(b.riskId)) continue;
      if (
        Math.sign(a.impact.dYam) === Math.sign(b.impact.dYam) &&
        jaccard(a.targetNodes, b.targetNodes) >= RUBRIC.dedupJaccard
      ) {
        cluster.push(b);
        assigned.add(b.riskId);
      }
    }
    clusters.push(cluster);
  }

  const survivors = [];
  for (const cluster of clusters) {
    if (cluster.length === 1) {
      survivors.push(cluster[0]);
      continue;
    }
    console.log(`  → dedup cluster (${cluster.length}): ${cluster.map((r) => r.riskId).join(", ")}`);
    survivors.push(...(await mergeCluster(cfg, cluster, kills, `merge-${cluster[0].riskId}`)));
  }

  // Dedup pass 2 — semantic: the Jaccard gate only meets risks that share
  // funnel nodes, but the same real-world mechanism gets encoded on DIFFERENT
  // nodes by different lenses (shrink obtainableFactor vs exclude the buyer
  // cell vs cut serviceableFactor). Partition the whole register by mechanism
  // (BASIC — a recognition task), then merge each family with the pass-1
  // machinery.
  const finalSurvivors = await semanticDedup(cfg, survivors, kills);

  console.log(`  ✓ ${finalSurvivors.length} survive the judge`);
  writeStage("05-judged", { risks: finalSurvivors, kills }, sha(risks.map((r) => r.riskId)));
}

/** One merge call over a cluster of suspected duplicates; returns survivors. */
async function mergeCluster(cfg, cluster, kills, label) {
  const merge = await chatJson(
    cfg,
    "judge",
    label,
    cfg.SMART,
    [
      {
        role: "system",
        content:
          "These risk write-ups are suspected duplicates, which does NOT make them the same risk — a funnel is coarse, so " +
          "mechanistically distinct risks (a certification clock, a grid-connection queue, a distributor line-review cycle) can all " +
          "compile to the same node. PARTITION the cluster into groups of TRUE duplicates: same underlying mechanism, same causal " +
          "story, such that presenting both to a client would read as repetition. Distinct risks come back as singleton groups " +
          "(absorbs: []). For a genuine duplicate group, pick the best exemplar (sharpest mechanism, best evidence) as keepId and " +
          "fold the absorbed write-ups' UNIQUE early-warning indicators into it. Over-merging destroys distinct insights — when in " +
          "doubt, keep them separate.",
      },
      {
        role: "user",
        content: `CLUSTER:\n${JSON.stringify(
          cluster.map((r) => ({ riskId: r.riskId, title: r.title, narrative: r.narrative, mechanism: r.mechanism, indicators: r.indicators, judgeTotal: r.judge.total })),
          null,
          1,
        )}\n\nEvery riskId must appear in exactly one group (as keepId or inside absorbs).\nEmit JSON: { rationale, groups: [{keepId, absorbs: [true-duplicate riskIds, [] if none], foldedIndicators: []}] }`,
      },
    ],
    mergeSchema,
    "merge",
    { maxTokens: 8000 },
  );
  const inCluster = new Map(cluster.map((r) => [r.riskId, r]));
  const resolved = new Set();
  const survivors = [];
  for (const group of merge.groups) {
    const keeper = inCluster.get(group.keepId);
    if (!keeper || resolved.has(keeper.riskId)) continue;
    resolved.add(keeper.riskId);
    const seenSignals = new Set(keeper.indicators.map((i) => i.signal));
    for (const ind of group.foldedIndicators) {
      if (!seenSignals.has(ind.signal)) keeper.indicators.push(ind);
    }
    for (const id of group.absorbs) {
      const absorbed = inCluster.get(id);
      if (!absorbed || resolved.has(id) || id === keeper.riskId) continue;
      resolved.add(id);
      killInto(kills, "judge", id, absorbed.title, `merged into ${keeper.riskId}: ${merge.rationale.slice(0, 120)}`, { mergedInto: keeper.riskId });
    }
    survivors.push(keeper);
  }
  // Anything the partition failed to mention survives untouched — losing a
  // scored risk to a malformed merge is worse than a possible duplicate.
  for (const r of cluster) {
    if (!resolved.has(r.riskId)) survivors.push(r);
  }
  return survivors;
}

/** Pass 2: global mechanism-level partition (BASIC) → per-family merges. */
async function semanticDedup(cfg, survivors, kills) {
  if (survivors.length < 2) return survivors;
  console.log(`  → semantic dedup — global partition over ${survivors.length} risks (${cfg.BASIC})`);
  const partition = await chatJson(
    cfg,
    "judge",
    "semantic-partition",
    cfg.BASIC,
    [
      { role: "system", content: SEMANTIC_DEDUP },
      {
        role: "user",
        content:
          `THE REGISTER:\n${JSON.stringify(
            survivors.map((r) => ({
              riskId: r.riskId,
              title: r.title,
              mechanism: r.mechanism.map((m) => m.text).join(" → "),
              narrative: r.narrative,
              targetNodes: r.targetNodes,
            })),
            null,
            1,
          )}\n\n` +
          `Emit JSON: { families: [{label, memberIds, rationale}] } — every riskId in exactly one family; singletons expected.`,
      },
    ],
    familyPartitionSchema,
    "family_partition",
    { maxTokens: 8000 },
  );

  // Code guarantees over the model's partition: unknown ids dropped,
  // double-assigned ids keep their first family, unmentioned ids survive as
  // singletons.
  const byId = new Map(survivors.map((r) => [r.riskId, r]));
  const seen = new Set();
  const families = [];
  for (const fam of partition.families) {
    const members = fam.memberIds.filter((id) => byId.has(id) && !seen.has(id));
    for (const id of members) seen.add(id);
    if (members.length > 0) families.push({ label: fam.label, members: members.map((id) => byId.get(id)) });
  }
  for (const r of survivors) {
    if (!seen.has(r.riskId)) families.push({ label: r.riskId, members: [r] });
  }

  const out = [];
  for (const fam of families) {
    if (fam.members.length === 1) {
      out.push(fam.members[0]);
      continue;
    }
    // Opposite-direction claims are different claims even when the mechanism
    // reads the same — split by ΔYAM sign before merging.
    const bySign = new Map();
    for (const r of fam.members) {
      const key = Math.sign(r.impact.dYam);
      if (!bySign.has(key)) bySign.set(key, []);
      bySign.get(key).push(r);
    }
    for (const [sign, group] of bySign) {
      if (group.length === 1) {
        out.push(group[0]);
        continue;
      }
      console.log(`  → semantic family '${fam.label}' (${group.length}): ${group.map((r) => r.riskId).join(", ")}`);
      const safeLabel = fam.label.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 60);
      out.push(...(await mergeCluster(cfg, group, kills, `family-${safeLabel}${sign > 0 ? "-up" : ""}`)));
    }
  }
  return out;
}

// ══ Stage 6 — polish ══════════════════════════════════════════════════════════
// Executive-register rewrite of the prose fields. Content-preserving: refs,
// perturbations, likelihood values, evidence and scores are untouched — only
// the words change, under the STYLE contract in risks-plan.mjs.

async function runPolish(cfg) {
  const { risks, kills } = requireStage("05-judged");
  console.log(`● polish — ${risks.length} risks, executive register (${cfg.SMART})`);

  const polished = [];
  for (const risk of risks) {
    const cacheName = `06-polish/${risk.riskId}`;
    const source = {
      title: risk.title,
      narrative: risk.narrative,
      mechanism: risk.mechanism,
      whyMissable: risk.whyMissable,
      falsifier: risk.falsifier,
      likelihoodRationale: risk.likelihood.rationale,
    };
    const hash = sha([risk.riskId, STYLE, source]);
    const cached = readStage(cacheName);
    let out;
    if (cached && cached.inputsHash === hash) {
      console.log(`  ○ ${risk.riskId} — cached`);
      out = polishSchema.parse(cached.data);
    } else {
      console.log(`  → ${risk.riskId}`);
      out = await chatJson(
        cfg,
        "polish",
        risk.riskId,
        cfg.SMART,
        [
          {
            role: "system",
            content:
              `You are the editor on a risk report. Rewrite the prose fields of one risk to the target register below. ` +
              `You are rewriting WORDS, not content: keep every load-bearing fact, name, number and date; never add claims; ` +
              `keep each mechanism step's "step" type and copy its "refs" array VERBATIM.\n\n${STYLE}`,
          },
          {
            role: "user",
            content:
              `THE RISK (context, do not rewrite): perturbation ${JSON.stringify(risk.perturbation)}, ` +
              `likelihood ${risk.likelihood.value}, category ${risk.category}\n\n` +
              `FIELDS TO REWRITE:\n${JSON.stringify(source, null, 1)}\n\n` +
              `Emit JSON: { title, narrative, mechanism: [{step, text, refs}], whyMissable, falsifier, likelihoodRationale }`,
          },
        ],
        polishSchema,
        "polish",
        { maxTokens: 4000 },
      );
      // Refs are the audit trail — a rewrite that drops them is rejected.
      const before = risk.mechanism.map((m) => m.refs.join(",")).join("|");
      const after = out.mechanism.map((m) => m.refs.join(",")).join("|");
      if (before !== after || out.mechanism.length !== risk.mechanism.length) {
        console.warn(`  ⚠ ${risk.riskId}: refs changed in rewrite — keeping original mechanism`);
        out.mechanism = risk.mechanism;
      }
      writeStage(cacheName, out, hash);
    }
    polished.push({
      ...risk,
      title: out.title,
      narrative: out.narrative,
      mechanism: out.mechanism,
      whyMissable: out.whyMissable,
      falsifier: out.falsifier,
      likelihood: { ...risk.likelihood, rationale: out.likelihoodRationale },
    });
  }
  writeStage("06-polished", { risks: polished, kills: kills ?? [] }, sha(risks.map((r) => r.riskId)));
}

// ══ Stage 7 — classify ════════════════════════════════════════════════════════
// The reducible/irreducible split: ERRORS are claims a research artifact would
// settle today — they feed the fact-bank refinement loop with a proposed
// correction; RISKS are claims only time settles — they stay on the register.

async function runClassify(cfg) {
  const { risks, kills } = requireStage("06-polished");
  const ctx = requireStage("00-context");
  console.log(`● classify — ${risks.length} risks, errors vs risks (${cfg.SMART})`);

  const classified = [];
  for (const risk of risks) {
    const cacheName = `07-classify/${risk.riskId}`;
    const hash = sha([risk.riskId, CLASSIFY_TEST, risk.narrative, risk.falsifier]);
    const cached = readStage(cacheName);
    let out;
    if (cached && cached.inputsHash === hash) {
      console.log(`  ○ ${risk.riskId} — cached`);
      out = classifySchema.parse(cached.data);
    } else {
      console.log(`  → ${risk.riskId}`);
      const targetNodes = ctx.ledger.filter((n) => risk.targetNodes.includes(n.id));
      out = await chatJson(
        cfg,
        "classify",
        risk.riskId,
        cfg.SMART,
        [
          { role: "system", content: CLASSIFY_TEST },
          {
            role: "user",
            content:
              `THE CLAIM:\n${JSON.stringify(
                {
                  title: risk.title,
                  narrative: risk.narrative,
                  mechanism: risk.mechanism,
                  falsifier: risk.falsifier,
                  category: risk.category,
                  evidence: risk.evidence ?? [],
                },
                null,
                1,
              )}\n\nTHE LEDGER FACTS IT TARGETS (current values, derivations, bands):\n${JSON.stringify(targetNodes, null, 1)}\n\n` +
              `Emit JSON: { resolution: "error"|"risk", settleTest, proposedCorrection: {nodeId, value, low, high, rationale} or null, researchQueries: [{query, kind}] ([] for risks) }`,
          },
        ],
        classifySchema,
        "classify",
        { maxTokens: 3000 },
      );
      // A correction must target a real node; otherwise demote to flag-only.
      if (out.proposedCorrection && !ctx.ledger.some((n) => n.id === out.proposedCorrection.nodeId)) {
        console.warn(
          `  ⚠ ${risk.riskId}: correction targets unknown node '${out.proposedCorrection.nodeId}' — dropping correction`,
        );
        out.proposedCorrection = null;
      }
      writeStage(cacheName, out, hash);
    }
    classified.push({
      ...risk,
      resolution: out.resolution,
      settleTest: out.settleTest,
      proposedCorrection: out.proposedCorrection,
      researchQueries: out.researchQueries,
    });
  }
  const errors = classified.filter((r) => r.resolution === "error").length;
  console.log(`  ✓ ${errors} errors (→ refinement loop), ${classified.length - errors} risks`);
  writeStage("07-classified", { risks: classified, kills: kills ?? [] }, sha(risks.map((r) => r.riskId)));
}

// ══ Stage 8 — emit ════════════════════════════════════════════════════════════

function gitLedgerRev() {
  const proc = spawnSync("git", ["log", "-1", "--format=%H", "--", "lib/ledger.ts"], { cwd: ROOT, encoding: "utf8" });
  return proc.status === 0 ? proc.stdout.trim() : null;
}

function toRiskCore(r, tier, asOf) {
  return {
    id: r.riskId,
    title: r.title,
    narrative: r.narrative,
    category: r.category,
    targetNodes: [...new Set([...r.targetNodes, ...r.perturbation.map((p) => p.nodeId)])],
    mechanism: r.mechanism.map((m) => m.text).join(" → "),
    whyMissable: r.whyMissable,
    falsifier: r.falsifier,
    likelihood: { value: r.likelihood.value, rationale: r.likelihood.rationale, basis: r.likelihood.basis },
    perturbation: r.perturbation,
    indicators: r.indicators.map((i) => ({
      signal: i.signal,
      ...(i.where ? { where: i.where } : {}),
      ...(i.threshold ? { threshold: i.threshold } : {}),
      updates: i.updates,
    })),
    mitigations: r.mitigations.map((m) => ({
      action: m.action,
      type: m.type,
      ...(m.voiNodeId ? { voiNodeId: m.voiNodeId } : {}),
      ...(m.note ? { note: m.note } : {}),
    })),
    // lib/schema.ts evidenceSchema uses .optional() — strip the stage schemas' nulls.
    ...(r.evidence?.length
      ? {
          evidence: r.evidence.map((e) => ({
            title: e.title,
            sourceType: e.sourceType,
            ...(e.publisher ? { publisher: e.publisher } : {}),
            ...(e.date ? { date: e.date } : {}),
            ...(e.excerpt ? { excerpt: e.excerpt } : {}),
            ...(e.url ? { url: e.url } : {}),
            attached: true,
          })),
        }
      : {}),
    ...(r.evidenceStatus ? { evidenceStatus: r.evidenceStatus === "refuted" ? "contested" : r.evidenceStatus } : {}),
    tier,
    resolution: r.resolution,
    ...(r.settleTest ? { settleTest: r.settleTest } : {}),
    ...(r.proposedCorrection
      ? {
          proposedCorrection: {
            nodeId: r.proposedCorrection.nodeId,
            value: r.proposedCorrection.value,
            ...(r.proposedCorrection.low !== null && r.proposedCorrection.low !== undefined
              ? { low: r.proposedCorrection.low }
              : {}),
            ...(r.proposedCorrection.high !== null && r.proposedCorrection.high !== undefined
              ? { high: r.proposedCorrection.high }
              : {}),
            rationale: r.proposedCorrection.rationale,
          },
        }
      : {}),
    asOf,
  };
}

function runEmit(cfg) {
  const { risks } = requireStage("07-classified");
  console.log(`● emit — ${risks.length} risks → boards, review doc, manifest`);
  const kills = aggregateKills();
  const asOf = new Date().toISOString().slice(0, 10);

  const enriched = risks.map((r) => ({
    ...r,
    expectedYamLoss: r.likelihood.value * Math.abs(r.impact.dYam),
  }));
  const maxLoss = Math.max(...enriched.map((r) => r.expectedYamLoss), 1e-9);
  for (const r of enriched) {
    r.insightScore = (r.judge.total / 20) * (r.expectedYamLoss / maxLoss);
    r.tier = r.judge.nonObviousness.score >= RANKING.rockNonObviousness ? "rock" : "front-of-mind";
  }

  // Errors (reducible — the refinement loop's queue) leave the risk boards.
  const errorItems = enriched
    .filter((r) => r.resolution === "error")
    .sort((a, b) => b.expectedYamLoss - a.expectedYamLoss || a.riskId.localeCompare(b.riskId));
  const riskItems = enriched.filter((r) => r.resolution !== "error");

  const boardA = [...riskItems].sort((a, b) => b.expectedYamLoss - a.expectedYamLoss || a.riskId.localeCompare(b.riskId));
  const boardB = riskItems
    .filter((r) => r.tier === "rock")
    .sort((a, b) => b.insightScore - a.insightScore || a.riskId.localeCompare(b.riskId));

  const onBoards = new Set(
    [...errorItems, ...boardA.slice(0, COUNTS.emitTop), ...boardB].map((r) => r.riskId),
  );
  const appendix = enriched.filter((r) => !onBoards.has(r.riskId)).map((r) => r.riskId);

  // Fix information mitigations whose voiNodeId is missing (schema tolerance):
  // demote to strategic rather than inventing a node.
  for (const r of enriched) {
    r.mitigations = r.mitigations.map((m) =>
      m.type === "information" && !m.voiNodeId ? { ...m, type: "strategic" } : m,
    );
  }

  // The register contract check — the SAME validator lib/risks.ts boots with.
  const cores = enriched.map((r) => toRiskCore(r, r.tier, asOf));
  const validation = bridge("validate", cores);
  if (!validation.ok) {
    throw new Error(`emitted risks fail the register contract:\n${validation.error}`);
  }

  // Mitigation VOI (engine bridge) for the review doc.
  const voiNodeIds = [...new Set(cores.flatMap((c) => c.mitigations.flatMap((m) => (m.voiNodeId ? [m.voiNodeId] : []))))];
  const voi = Object.fromEntries(bridge("voi", voiNodeIds).map((v) => [v.id, v.informationValue]));

  const payload = {
    generatedAt: new Date().toISOString(),
    ledgerRev: gitLedgerRev(),
    baseline: requireStage("00-context").baseline,
    boards: {
      errors: errorItems.map((r) => r.riskId),
      a: boardA.slice(0, COUNTS.emitTop).map((r) => r.riskId),
      b: boardB.map((r) => r.riskId),
    },
    appendix,
    risks: enriched.map((r, i) => ({
      risk: cores[i],
      impact: r.impact,
      judge: r.judge,
      lens: r.lens,
      expectedYamLoss: r.expectedYamLoss,
      insightScore: r.insightScore,
      evidenceGap: r.evidenceGap ?? false,
      mechanismSteps: r.mechanism,
      stances: r.stances ?? [],
    })),
  };
  fs.writeFileSync(path.join(RISKS_DIR, "risks.json"), JSON.stringify(payload, null, 2) + "\n");
  fs.writeFileSync(path.join(RISKS_DIR, "killlog.json"), JSON.stringify(kills, null, 2) + "\n");
  fs.writeFileSync(
    path.join(RISKS_DIR, "manifest.json"),
    JSON.stringify(
      {
        runId: sha(new Date().toISOString()).slice(0, 12),
        generatedAt: new Date().toISOString(),
        models: { BASIC: cfg.BASIC, SMART: cfg.SMART, POWER: cfg.POWER },
        judgeShuffleSeed: SEED,
        ledgerRev: gitLedgerRev(),
        usageByStage,
        counts: { emitted: enriched.length, errors: errorItems.length, boardA: payload.boards.a.length, boardB: payload.boards.b.length, killed: kills.length },
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(path.join(RISKS_DIR, "risks.review.md"), renderReview(payload, voi, kills));
  console.log(`  ✓ risks/risks.json (${enriched.length}) · risks.review.md · manifest.json · killlog.json (${kills.length})`);
}

// ── review doc ────────────────────────────────────────────────────────────────

function renderReview(payload, voi, kills) {
  const byId = new Map(payload.risks.map((r) => [r.risk.id, r]));
  const b = payload.baseline;
  const lines = [];
  const push = (...xs) => lines.push(...xs, "");

  push(
    `# Risk review — ${payload.generatedAt.slice(0, 10)}`,
    "",
    `Baseline: **TAM €${b.tam}M · SAM €${b.sam}M · YAM €${b.yam.toFixed(2)}M** · ledger rev \`${payload.ledgerRev?.slice(0, 8) ?? "?"}\` · ${payload.risks.length} risks emitted`,
    "",
    `> Every € figure below is engine-computed from the risk's perturbation ops — the models never stated an impact.`,
  );

  const boardTable = (ids, scoreLabel, scoreOf) => {
    const rows = ids.map((id, i) => {
      const r = byId.get(id);
      return `| ${i + 1} | ${r.risk.title} | ${r.risk.category} | ${pct(r.risk.likelihood.value)} | ${eur(r.impact.dYam)} | ${eur(r.impact.dTam)} | ${scoreOf(r)} | ${r.risk.evidenceStatus ?? "-"}${r.evidenceGap ? " ⚠no-hits" : ""} |`;
    });
    return [
      `| # | Risk | Category | p | ΔYAM | ΔTAM | ${scoreLabel} | Evidence |`,
      `|---|---|---|---|---|---|---|---|`,
      ...rows,
    ].join("\n");
  };

  if (payload.boards.errors?.length) {
    push(
      `## Fix the model first — errors, not risks`,
      `Claims a research artifact would settle today. Each carries a proposed correction for the refinement loop (\`npm run refine\`); they leave the risk boards.`,
      "",
      [
        `| # | Error | Target fact | Proposed correction | E[loss] | Evidence |`,
        `|---|---|---|---|---|---|`,
        ...payload.boards.errors.map((id, i) => {
          const r = byId.get(id);
          const c = r.risk.proposedCorrection;
          const node = c ? c.nodeId : r.risk.targetNodes[0];
          const fix = c ? `${c.nodeId}: → ${c.value}${c.low !== undefined ? ` (band ${c.low}–${c.high})` : ""}` : "flag only";
          return `| ${i + 1} | ${r.risk.title} | ${node} | ${fix} | ${eur(-r.expectedYamLoss)} | ${r.risk.evidenceStatus ?? "-"} |`;
        }),
      ].join("\n"),
    );
  }

  push(
    `## Board A — the risks you've probably thought of`,
    `Ranked by expected YAM loss (p × |ΔYAM|).`,
    "",
    boardTable(payload.boards.a, "E[loss]", (r) => eur(-r.expectedYamLoss)),
  );
  push(
    `## Board B — the rocks`,
    `Non-obviousness ≥ ${RANKING.rockNonObviousness}/4, ranked by insight-weighted severity. This is the deliverable's headline.`,
    "",
    boardTable(payload.boards.b, "Insight", (r) => r.insightScore.toFixed(2)),
  );

  push(`---`, ``, `## Risk cards`);
  const cardOrder = [
    ...new Set([...(payload.boards.errors ?? []), ...payload.boards.b, ...payload.boards.a]),
  ];
  for (const id of cardOrder) {
    const r = byId.get(id);
    const c = r.risk;
    push(
      `### ${c.title}`,
      "",
      `\`${c.id}\` · **${c.tier}** · ${c.category} · lens: ${r.lens} · p=${pct(c.likelihood.value)} (${c.likelihood.basis}) · judge ${r.judge.total}/20`,
      "",
      c.narrative,
      "",
      `**Impact (engine):** TAM ${eur(r.impact.base.tam)} → ${eur(r.impact.perturbed.tam)} (${eur(r.impact.dTam)}) · YAM ${r.impact.base.yam.toFixed(2)} → ${r.impact.perturbed.yam.toFixed(2)} (${eur(r.impact.dYam)}) · E[YAM loss] ${eur(-r.expectedYamLoss)}`,
      "",
      `**Perturbation:** ${c.perturbation.map((p) => `${p.op} ${p.nodeId}${p.value !== undefined ? ` → ${p.value}` : ""}${p.note ? ` (${p.note})` : ""}`).join(" · ")}`,
      "",
      `**Mechanism:**`,
      ...r.mechanismSteps.map((m) => `- *${m.step}*: ${m.text} \`[${m.refs.join(", ")}]\``),
      "",
      `**Why missable:** ${c.whyMissable}`,
      "",
      `**Falsifier:** ${c.falsifier}`,
      "",
      `**Classification:** ${c.resolution === "error" ? "ERROR — research settles it" : "RISK — only time settles it"}${c.settleTest ? ` · settle test: ${c.settleTest}` : ""}${c.proposedCorrection ? `\n\n**Proposed correction:** \`${c.proposedCorrection.nodeId}\` → ${c.proposedCorrection.value}${c.proposedCorrection.low !== undefined ? ` (band ${c.proposedCorrection.low}–${c.proposedCorrection.high})` : ""} — ${c.proposedCorrection.rationale}` : ""}`,
      "",
      `**Likelihood rationale:** ${c.likelihood.rationale}`,
      "",
      `**Early warnings:**`,
      ...c.indicators.map((i) => `- ${i.signal}${i.where ? ` — watch: ${i.where}` : ""}${i.threshold ? ` — trigger: ${i.threshold}` : ""} (${i.updates} p)`),
      "",
      `**Mitigations:**`,
      ...c.mitigations.map(
        (m) =>
          `- [${m.type}] ${m.action}${m.voiNodeId ? ` — VOI(${m.voiNodeId}) = €${(voi[m.voiNodeId] ?? 0).toFixed(1)}M` : ""}`,
      ),
      "",
      c.evidence?.length
        ? [`**Evidence (${c.evidenceStatus}):**`, ...c.evidence.map((e) => `- [${e.sourceType}] ${e.title}${e.publisher ? ` — ${e.publisher}` : ""}${e.url ? ` — ${e.url}` : ""}\n  > ${e.excerpt}`)].join("\n")
        : `**Evidence:** none found (${c.evidenceStatus ?? "speculative"}) — flagged, not killed.`,
      "",
      `**Judge scorecard:** ${RUBRIC.dimensions.map((d) => `${d.key} ${r.judge[d.key].score}/4`).join(" · ")}`,
      ...RUBRIC.dimensions.map((d) => `- *${d.key}*: ${r.judge[d.key].note}`),
      "",
      `*Provenance: raw evidence \`risks/raw/evidence/${c.id}.json\` · transcripts \`risks/raw/llm/\`*`,
      "",
      `---`,
    );
  }

  if (payload.appendix.length > 0) {
    push(
      `## Appendix — below the line`,
      "",
      ...payload.appendix.map((id) => {
        const r = byId.get(id);
        return `- ${r.risk.title} (\`${id}\`, judge ${r.judge.total}/20, E[loss] ${eur(-r.expectedYamLoss)})`;
      }),
    );
  }

  push(
    `## Kill log — review for false negatives`,
    "",
    `| Stage | Risk | Reason |`,
    `|---|---|---|`,
    ...kills.map((k) => `| ${k.stage} | ${k.title ?? k.id} | ${String(k.reason).replaceAll("|", "·").slice(0, 160)} |`),
  );

  return lines.join("\n");
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const only = args.find((a) => a.startsWith("--only="))?.slice(7).split(",").map((s) => s.trim());
  const from = args.find((a) => a.startsWith("--from="))?.slice(7);

  if (only?.some((s) => !STAGE_ORDER.includes(s))) throw new Error(`unknown stage in --only (valid: ${STAGE_ORDER.join(", ")})`);
  if (from && !STAGE_ORDER.includes(from)) throw new Error(`unknown stage in --from (valid: ${STAGE_ORDER.join(", ")})`);

  const stageOutputs = {
    context: "00-context",
    digest: "01-digest/_synthesis",
    hunt: `02-hunt/${LENSES[LENSES.length - 1].id}`,
    compile: "03-compiled",
    evidence: "04-evidence",
    judge: "05-judged",
    polish: "06-polished",
    classify: "07-classified",
    emit: null, // always re-emittable
  };

  let runSet;
  if (only) {
    runSet = new Set(only);
  } else if (from) {
    runSet = new Set(STAGE_ORDER.slice(STAGE_ORDER.indexOf(from)));
  } else if (force) {
    runSet = new Set(STAGE_ORDER);
  } else {
    // Default: first stage with no cached output, plus everything after it.
    const firstMissing = STAGE_ORDER.findIndex(
      (s) => stageOutputs[s] === null || !readStage(stageOutputs[s]),
    );
    runSet = new Set(STAGE_ORDER.slice(firstMissing === -1 ? STAGE_ORDER.length - 1 : firstMissing));
  }

  console.log(`Risk pipeline — stages: ${STAGE_ORDER.filter((s) => runSet.has(s)).join(" → ")}`);
  const cfg = readEnv();
  const needsLlm = ["digest", "hunt", "compile", "evidence", "judge", "polish", "classify"].some((s) => runSet.has(s));
  if (needsLlm) {
    await preflightModels(cfg);
    console.log(`Models — BASIC ${cfg.BASIC} · SMART ${cfg.SMART} · POWER ${cfg.POWER}`);
  }
  fs.mkdirSync(STAGES_DIR, { recursive: true });

  const stageForce = force || Boolean(only) || Boolean(from); // --only/--from mean "re-run these stages"
  if (runSet.has("context")) runContext();
  if (runSet.has("digest")) await runDigest(cfg, stageForce);
  if (runSet.has("hunt")) await runHunt(cfg, stageForce);
  if (runSet.has("compile")) await runCompile(cfg);
  if (runSet.has("evidence")) await runEvidence(cfg);
  if (runSet.has("judge")) await runJudge(cfg);
  if (runSet.has("polish")) await runPolish(cfg);
  if (runSet.has("classify")) await runClassify(cfg);
  if (runSet.has("emit")) runEmit(cfg);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
