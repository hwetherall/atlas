// ─────────────────────────────────────────────────────────────────────────────
// One-off forensic reconstruction of the CYCLE-1 register (risks/cycle1.json).
//
// Cycle 2 overwrote the emitted cycle-1 artifacts before anything was
// committed. Everything needed survives, though: per-risk caches and LLM
// transcripts accumulate by riskId (zero id collisions between cycles —
// verified), and the rev-1 ledger lives in git (lib/ledgerRev1.ts snapshot).
// Impacts are recomputed with the REAL engine against rev 1, so every €
// figure is exact, not remembered.
//
//   node --import ./scripts/risks-register.mjs scripts/risks-cycle1-reconstruct.mts
//
// Sources per cycle-1 riskId:
//   membership ..... classify transcripts with ts < 2026-07-08T20:00Z (27)
//   prose .......... risks/stages/06-polish/<id>.json (polished register)
//   classification . risks/stages/07-classify/<id>.json
//   scorecard ...... risks/stages/05-scores/<id>.json
//   hypothesis ..... risks/raw/llm/hunt/*.json with cycle-1 ts (perturbation,
//                    likelihood, indicators, mitigations, category, targets)
//   evidence ....... risks/raw/llm/evidence/*-adj-<id>.json with cycle-1 ts
//   impact ......... recomputed via lib/riskCompute against lib/ledgerRev1
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { ledgerRev1 } from "@/lib/ledgerRev1";
import { baselineScenario, evaluate } from "@/lib/compute";
import { riskImpact } from "@/lib/riskCompute";
import { validateRisks } from "@/lib/riskSchema";

const ROOT = process.cwd();
const CYCLE1_CUTOFF = "2026-07-08T20:00"; // UTC; cycle-1 artifacts are earlier
const baseline = baselineScenario(ledgerRev1);

const readJson = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));
const parseLoose = (text: string) => {
  const s = text.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
  return JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1));
};

// ── 1. membership: the 27 cycle-1 survivors ──────────────────────────────────
const classifyDir = path.join(ROOT, "risks", "raw", "llm", "classify");
const cycle1Ids: string[] = [];
for (const f of fs.readdirSync(classifyDir)) {
  const m = f.match(/^\d+-(risk\..+?)\.json$/);
  if (!m || m[1].endsWith("-repair")) continue;
  const t = readJson(path.join(classifyDir, f));
  if (t.ts < CYCLE1_CUTOFF && !cycle1Ids.includes(m[1])) cycle1Ids.push(m[1]);
}
console.log(`cycle-1 survivors: ${cycle1Ids.length}`);
if (cycle1Ids.length !== 27) throw new Error(`expected 27 cycle-1 survivors, found ${cycle1Ids.length}`);

// ── 2. hypotheses from cycle-1 hunt transcripts ───────────────────────────────
const huntDir = path.join(ROOT, "risks", "raw", "llm", "hunt");
const hypById = new Map<string, any>();
for (const f of fs.readdirSync(huntDir)) {
  const t = readJson(path.join(huntDir, f));
  if (t.ts >= "2026-07-08T12:00") continue; // cycle-1 hunts: Jul 8 ~04:00Z; cycle-2: 19:30Z+
  const lens = f.match(/^\d+-(.+)\.json$/)![1];
  const batch = parseLoose(t.content);
  for (const h of batch.hypotheses ?? []) {
    const riskId = `risk.${lens}.${h.id}`;
    if (!hypById.has(riskId)) hypById.set(riskId, { ...h, lens });
  }
}
console.log(`cycle-1 hypotheses recovered: ${hypById.size}`);

// ── 3. evidence adjudications (cycle-1 ts) ────────────────────────────────────
const evDir = path.join(ROOT, "risks", "raw", "llm", "evidence");
const adjById = new Map<string, any>();
for (const f of fs.readdirSync(evDir)) {
  const m = f.match(/^\d+-adj-(risk\..+?)(-repair)?\.json$/);
  if (!m) continue;
  const t = readJson(path.join(evDir, f));
  if (t.ts >= "2026-07-08T12:00") continue; // cycle-1 evidence: Jul 8 ~05-06Z
  // repairs supersede the original within the same cycle
  if (m[2] || !adjById.has(m[1])) adjById.set(m[1], parseLoose(t.content));
}

// ── 4. assemble ───────────────────────────────────────────────────────────────
const stage = (dir: string, id: string) =>
  readJson(path.join(ROOT, "risks", "stages", dir, `${id}.json`)).data;

const opsOf = (h: any) =>
  h.perturbation.map((p: any) => ({
    nodeId: p.nodeId,
    op: p.op,
    ...(p.value === null || p.value === undefined ? {} : { value: p.value }),
    ...(p.note ? { note: p.note } : {}),
  }));

const enriched = cycle1Ids.map((riskId) => {
  const h = hypById.get(riskId);
  if (!h) throw new Error(`no hunt hypothesis for ${riskId}`);
  const polish = stage("06-polish", riskId);
  const cls = stage("07-classify", riskId);
  const scorecard = stage("05-scores", riskId);
  const judgeTotal = Object.values(scorecard).reduce((s: number, d: any) => s + d.score, 0);
  const adj = adjById.get(riskId);

  // Replicate the evidence stage's bounded likelihood revision.
  let likelihood: any = { value: h.likelihood.value, basis: h.likelihood.basis };
  if (adj && adj.revisedLikelihood !== null && adj.revisedLikelihood !== undefined) {
    likelihood = {
      value: Math.max(h.likelihood.value - 0.2, Math.min(h.likelihood.value + 0.2, adj.revisedLikelihood)),
      basis: "evidence",
    };
  }

  const perturbation = opsOf(h);
  const impact = riskImpact(ledgerRev1, baseline, { perturbation });

  return {
    riskId,
    lens: h.lens,
    category: h.category,
    targetNodes: [...new Set([...h.targetNodes, ...perturbation.map((p: any) => p.nodeId)])],
    perturbation,
    polish,
    cls,
    scorecard,
    judgeTotal,
    likelihood: { ...likelihood, rationale: polish.likelihoodRationale },
    indicators: h.indicators,
    mitigations: h.mitigations,
    adj,
    impact,
    expectedYamLoss: likelihood.value * Math.abs(impact.dYam),
  };
});

// ── 5. cores + boards (mirrors runEmit) ───────────────────────────────────────
const ROCK_CATEGORIES = new Set(["fact", "model-structure", "boundary"]);
const maxLoss = Math.max(...enriched.map((r) => r.expectedYamLoss), 1e-9);

const items = enriched.map((r) => {
  const resolution = r.cls.resolution;
  const tier = ROCK_CATEGORIES.has(r.category) ? "rock" : "front-of-mind";
  const evidenceStatus = r.adj ? (r.adj.status === "refuted" ? "contested" : r.adj.status) : "speculative";
  const core = {
    id: r.riskId,
    title: r.polish.title,
    narrative: r.polish.narrative,
    category: r.category,
    targetNodes: r.targetNodes,
    mechanism: r.polish.mechanism.map((m: any) => m.text).join(" → "),
    whyMissable: r.polish.whyMissable,
    falsifier: r.polish.falsifier,
    likelihood: r.likelihood,
    perturbation: r.perturbation,
    indicators: r.indicators.map((i: any) => ({
      signal: i.signal,
      ...(i.where ? { where: i.where } : {}),
      ...(i.threshold ? { threshold: i.threshold } : {}),
      updates: i.updates,
    })),
    mitigations: r.mitigations.map((m: any) =>
      m.type === "information" && !m.voiNodeId
        ? { action: m.action, type: "strategic", ...(m.note ? { note: m.note } : {}) }
        : {
            action: m.action,
            type: m.type,
            ...(m.voiNodeId ? { voiNodeId: m.voiNodeId } : {}),
            ...(m.note ? { note: m.note } : {}),
          },
    ),
    ...(r.adj?.evidence?.length
      ? {
          evidence: r.adj.evidence.slice(0, 3).map((e: any) => ({
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
    evidenceStatus,
    tier,
    resolution,
    ...(r.cls.settleTest ? { settleTest: r.cls.settleTest } : {}),
    ...(r.cls.proposedCorrection && resolution === "error"
      ? {
          proposedCorrection: {
            nodeId: r.cls.proposedCorrection.nodeId,
            value: r.cls.proposedCorrection.value,
            ...(r.cls.proposedCorrection.low !== null ? { low: r.cls.proposedCorrection.low } : {}),
            ...(r.cls.proposedCorrection.high !== null ? { high: r.cls.proposedCorrection.high } : {}),
            rationale: r.cls.proposedCorrection.rationale,
          },
        }
      : {}),
    asOf: "2026-07-08",
  };
  return { core, r };
});

validateRisks(items.map((x) => x.core), ledgerRev1); // throws on any defect

const errors = items.filter((x) => x.core.resolution === "error").sort((a, b) => b.r.expectedYamLoss - a.r.expectedYamLoss);
const riskItems = items.filter((x) => x.core.resolution !== "error");
const boardA = [...riskItems].sort((a, b) => b.r.expectedYamLoss - a.r.expectedYamLoss);
const boardB = riskItems.filter((x) => x.core.tier === "rock").sort(
  (a, b) => (b.r.judgeTotal / 20) * (b.r.expectedYamLoss / maxLoss) - (a.r.judgeTotal / 20) * (a.r.expectedYamLoss / maxLoss),
);

const payload = {
  generatedAt: "2026-07-08T18:30:00.000Z",
  reconstructed: true,
  reconstructionNote:
    "Cycle-1 register rebuilt from per-risk caches + LLM transcripts after cycle 2 overwrote the emitted artifacts; impacts recomputed against lib/ledgerRev1.ts. See scripts/risks-cycle1-reconstruct.mts.",
  ledgerRev: "2428e9778e2e1a3a0000000000000000rev1",
  baseline: evaluate(ledgerRev1, baseline),
  boards: {
    errors: errors.map((x) => x.core.id),
    a: boardA.map((x) => x.core.id),
    b: boardB.map((x) => x.core.id),
  },
  appendix: [],
  risks: items.map(({ core, r }) => ({
    risk: core,
    impact: r.impact,
    judge: { ...r.scorecard, total: r.judgeTotal },
    lens: r.lens,
    expectedYamLoss: r.expectedYamLoss,
    insightScore: (r.judgeTotal / 20) * (r.expectedYamLoss / maxLoss),
    evidenceGap: !r.adj,
    mechanismSteps: r.polish.mechanism,
    stances: r.adj?.stances ?? [],
  })),
};

fs.writeFileSync(path.join(ROOT, "risks", "cycle1.json"), JSON.stringify(payload, null, 2) + "\n");
console.log(
  `✓ risks/cycle1.json — ${items.length} findings (${errors.length} errors, ${riskItems.length} risks), baseline TAM ${payload.baseline.tam} YAM ${payload.baseline.yam.toFixed(2)}`,
);
