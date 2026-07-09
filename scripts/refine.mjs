// ─────────────────────────────────────────────────────────────────────────────
// Refinement loop — one command per cycle (npm run refine).
//
// Takes the ERRORS the risk pipeline classified (claims a research artifact
// would settle today), runs their targeted Exa queries, adjudicates each
// proposed correction against the fresh evidence, and emits:
//
//   risks/refine.review.md    the human curation doc: old value → suggested
//                             value per fact, with verbatim evidence
//   risks/refine.json         machine-readable ledger diffs + verdicts
//   research/raw/refine-*.json  raw evidence, SAME shape as the research pass
//                             (so next cycle's digest stage consumes it natively)
//
// Values still never auto-flow: a human applies the diffs to lib/ledger.ts,
// then re-runs the risk pipeline (npm run risks -- --from=context) so resolved
// errors die against the corrected ledger. Repeat until only true risks remain.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsonSchemaOf, refineVerdictSchema } from "./risks-schemas.mjs";
import { STYLE } from "./risks-plan.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RISKS_DIR = path.join(ROOT, "risks");
const RESEARCH_RAW_DIR = path.join(ROOT, "research", "raw");
const RAW_LLM_DIR = path.join(RISKS_DIR, "raw", "llm", "refine");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readEnv() {
  const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const get = (name) => env.match(new RegExp(`^${name}=["']?([^"'\\r\\n]+)`, "m"))?.[1];
  const cfg = {
    exaKey: get("EXA_API_KEY"),
    openrouterKey: get("OPENROUTER_API_KEY"),
    SMART: get("SMART_MODEL")?.replace(/^~/, ""),
  };
  for (const [k, v] of Object.entries(cfg)) if (!v) throw new Error(`${k} missing from .env`);
  return cfg;
}

async function exaSearch(cfg, query, attempt = 0) {
  let res;
  try {
    res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": cfg.exaKey },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults: 6,
        contents: { text: { maxCharacters: 1500 } },
      }),
    });
  } catch (err) {
    if (attempt < 2) {
      await sleep(5000);
      return exaSearch(cfg, query, attempt + 1);
    }
    throw err;
  }
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await sleep(5000);
      return exaSearch(cfg, query, attempt + 1);
    }
    throw new Error(`Exa ${res.status} for "${query}": ${await res.text()}`);
  }
  const data = await res.json();
  return (data.results ?? []).map((r) => ({
    title: r.title ?? null,
    url: r.url,
    publishedDate: r.publishedDate ?? null,
    text: r.text ?? null,
  }));
}

async function chatJson(cfg, label, messages, schema, schemaName) {
  const body = {
    model: cfg.SMART,
    messages,
    max_tokens: 6000,
    response_format: { type: "json_schema", json_schema: jsonSchemaOf(schema, schemaName) },
  };
  for (let attempt = 0; attempt < 3; attempt++) {
    let res, text;
    try {
      res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${cfg.openrouterKey}` },
        body: JSON.stringify(body),
      });
      text = await res.text();
    } catch {
      await sleep(5000);
      continue;
    }
    if (res.status === 400 && body.response_format) {
      delete body.response_format;
      continue;
    }
    if (!res.ok) {
      if (res.status === 429 || res.status >= 500) {
        await sleep(attempt === 0 ? 5000 : 20000);
        continue;
      }
      throw new Error(`OpenRouter ${res.status} (${label}): ${text.slice(0, 300)}`);
    }
    const content = JSON.parse(text).choices?.[0]?.message?.content;
    if (!content) continue;
    fs.mkdirSync(RAW_LLM_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(RAW_LLM_DIR, `${label}.json`),
      JSON.stringify({ model: cfg.SMART, messages, content, ts: new Date().toISOString() }, null, 2) + "\n",
    );
    const stripped = content.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
    const parsed = JSON.parse(stripped.slice(stripped.indexOf("{"), stripped.lastIndexOf("}") + 1));
    await sleep(500);
    return schema.parse(parsed);
  }
  throw new Error(`refine: LLM call failed (${label})`);
}

const eur = (x) => `${x < 0 ? "−" : "+"}€${Math.abs(x).toFixed(2)}M`;

async function main() {
  const cfg = readEnv();
  const classified = JSON.parse(
    fs.readFileSync(path.join(RISKS_DIR, "stages", "07-classified.json"), "utf8"),
  ).data.risks;
  const payload = JSON.parse(fs.readFileSync(path.join(RISKS_DIR, "risks.json"), "utf8"));
  const lossById = new Map(payload.risks.map((r) => [r.risk.id, r.expectedYamLoss]));
  const ledger = JSON.parse(
    fs.readFileSync(path.join(RISKS_DIR, "stages", "00-context.json"), "utf8"),
  ).data.ledger;
  const nodeById = new Map(ledger.map((n) => [n.id, n]));

  // Errors, VOI-ranked (expected loss): research money goes to the biggest fix first.
  const errors = classified
    .filter((r) => r.resolution === "error")
    .sort((a, b) => (lossById.get(b.riskId) ?? 0) - (lossById.get(a.riskId) ?? 0));
  console.log(`Refinement pass — ${errors.length} errors, ranked by expected loss (${cfg.SMART})`);

  const results = [];
  for (const error of errors) {
    const queries = error.researchQueries ?? [];
    const rawFile = path.join(RESEARCH_RAW_DIR, `refine-${error.riskId.replace(/^risk\./, "")}.json`);

    // 1 — targeted research, cached in the research-pass shape.
    let raw;
    if (fs.existsSync(rawFile)) {
      console.log(`  ○ ${error.riskId} — research cached`);
      raw = JSON.parse(fs.readFileSync(rawFile, "utf8"));
    } else {
      console.log(`  → ${error.riskId} (${queries.length} queries)`);
      const executed = [];
      for (const q of queries) {
        const results_ = await exaSearch(cfg, q.query);
        executed.push({ query: q.query, kind: q.kind, results: results_ });
        await sleep(1200); // politeness (research.mjs precedent)
      }
      raw = {
        id: `refine-${error.riskId.replace(/^risk\./, "")}`,
        feeds: error.targetNodes,
        intent: error.settleTest ?? error.title,
        fetchedAt: new Date().toISOString(),
        queries: executed,
      };
      fs.mkdirSync(RESEARCH_RAW_DIR, { recursive: true });
      fs.writeFileSync(rawFile, JSON.stringify(raw, null, 2) + "\n");
    }

    // 2 — adjudicate the proposed correction against the fresh evidence.
    const node = error.proposedCorrection ? nodeById.get(error.proposedCorrection.nodeId) : null;
    console.log(`  → adjudicate: ${error.riskId}`);
    const verdict = await chatJson(
      cfg,
      `verdict-${error.riskId}`,
      [
        {
          role: "system",
          content:
            "You adjudicate a proposed correction to one fact in a market model, against fresh search results. " +
            "Verdict: 'confirm' = evidence supports the proposed value (you may fine-tune it); 'adjust' = the fact IS wrong " +
            "but the right value differs from the proposal — give it; 'refute' = the current ledger value stands. " +
            "Every evidence item needs a verbatim excerpt. Final value/band must follow from cited evidence, not the proposal's authority.\n\n" +
            STYLE,
        },
        {
          role: "user",
          content:
            `THE CLAIMED ERROR:\n${JSON.stringify(
              { title: error.title, narrative: error.narrative, settleTest: error.settleTest },
              null,
              1,
            )}\n\nCURRENT LEDGER FACT:\n${JSON.stringify(node ?? error.targetNodes, null, 1)}\n\n` +
            `PROPOSED CORRECTION:\n${JSON.stringify(error.proposedCorrection, null, 1)}\n\n` +
            `FRESH SEARCH RESULTS:\n${JSON.stringify(raw.queries, null, 1)}\n\n` +
            `Emit JSON: { verdict, value, low, high, rationale, evidence: [≤3 {title, sourceType, publisher, date, excerpt, url}] }`,
        },
      ],
      refineVerdictSchema,
      "refine_verdict",
    );

    results.push({
      riskId: error.riskId,
      title: error.title,
      nodeId: error.proposedCorrection?.nodeId ?? error.targetNodes[0],
      currentValue: node?.value ?? null,
      proposed: error.proposedCorrection,
      verdict,
      expectedYamLoss: lossById.get(error.riskId) ?? 0,
      rawFile: path.relative(ROOT, rawFile),
    });
    console.log(`    ${verdict.verdict}${verdict.value !== null ? ` → ${verdict.value}` : ""}`);
  }

  // 3 — emit the curation doc + machine-readable diffs.
  fs.writeFileSync(
    path.join(RISKS_DIR, "refine.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2) + "\n",
  );

  const lines = [];
  const push = (...xs) => lines.push(...xs, "");
  push(
    `# Refinement pass — ${new Date().toISOString().slice(0, 10)}`,
    "",
    `${results.length} model errors researched, ranked by expected Year-1 loss. Apply accepted diffs to lib/ledger.ts (values never auto-flow), then re-run \`npm run risks -- --from=context\`.`,
  );
  push(
    `| # | Fact | Current | Suggested | Verdict | E[loss] |`,
    `|---|---|---|---|---|---|`,
    ...results.map((r, i) => {
      const v = r.verdict;
      const suggested = v.verdict === "refute" ? "keep current" : `${v.value}${v.low !== null ? ` (band ${v.low}–${v.high})` : ""}`;
      return `| ${i + 1} | ${r.nodeId} | ${r.currentValue} | ${suggested} | ${v.verdict} | ${eur(-r.expectedYamLoss)} |`;
    }),
  );
  for (const r of results) {
    push(
      `## ${r.title}`,
      "",
      `\`${r.riskId}\` · fact \`${r.nodeId}\` · current **${r.currentValue}** · pipeline proposed **${r.proposed?.value ?? "flag only"}** · verdict **${r.verdict.verdict}**${r.verdict.value !== null ? ` → **${r.verdict.value}**${r.verdict.low !== null ? ` (band ${r.verdict.low}–${r.verdict.high})` : ""}` : ""}`,
      "",
      r.verdict.rationale,
      "",
      ...r.verdict.evidence.map(
        (e) => `- [${e.sourceType}] ${e.title}${e.publisher ? ` — ${e.publisher}` : ""} — ${e.url}\n  > ${e.excerpt}`,
      ),
      "",
      `*Raw evidence: \`${r.rawFile}\`*`,
      "",
      `---`,
    );
  }
  fs.writeFileSync(path.join(RISKS_DIR, "refine.review.md"), lines.join("\n"));
  console.log(`✓ risks/refine.review.md · risks/refine.json (${results.length} verdicts)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
