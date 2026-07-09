// ─────────────────────────────────────────────────────────────────────────────
// Render the curated register (lib/risks.ts) from the pipeline's emitted
// risks/risks.json. Curation policy lives HERE (tier rule, ordering); the
// generated file is still reviewed by a human before it ships — this script
// makes each review start from a faithful, commented rendering rather than
// hand-copying JSON.
//
//   node scripts/risks-curate.mjs          # writes lib/risks.ts
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Default renders the LIVE register (risks/risks.json → lib/risks.ts). Pass
// --cycle1 to render the reconstructed cycle-1 snapshot against the frozen
// rev-1 ledger (risks/cycle1.json → lib/risksCycle1.ts) for the demo's
// "before" tabs.
const CYCLE1 = process.argv.includes("--cycle1");
const IN_FILE = CYCLE1 ? "cycle1.json" : "risks.json";
const OUT_FILE = CYCLE1 ? "risksCycle1.ts" : "risks.ts";
const LEDGER_IMPORT = CYCLE1 ? 'import { ledgerRev1 as ledger } from "@/lib/ledgerRev1";' : 'import { ledger } from "@/lib/ledger";';
const EXPORT_NAME = CYCLE1 ? "risksCycle1" : "risks";

const payload = JSON.parse(fs.readFileSync(path.join(ROOT, "risks", IN_FILE), "utf8"));

// Tier is a curated judgment: risks that attack the model's own construction
// are "rocks" — they hide inside numbers that look handled. (The judge's
// non-obviousness scores compressed to 3/4 and carry no tiering signal.)
const ROCK_CATEGORIES = new Set(["fact", "model-structure", "boundary"]);

const eur = (x) => `${x < 0 ? "−" : "+"}€${Math.abs(x).toFixed(2)}M`;

// Board-A order (expected YAM loss desc) — deterministic, matches the review doc.
const items = [...payload.risks].sort(
  (a, b) => b.expectedYamLoss - a.expectedYamLoss || a.risk.id.localeCompare(b.risk.id),
);

const lines = [];
lines.push(LEDGER_IMPORT);
lines.push(`import { validateRisks, type Risk } from "@/lib/riskSchema";`);
lines.push(``);
lines.push(`// ─────────────────────────────────────────────────────────────────────────────`);
lines.push(CYCLE1
  ? `// FROZEN SNAPSHOT — the CYCLE-1 register (pre-refinement), rendered by`
  : `// Curated risk register — rendered by scripts/risks-curate.mjs from the cached`);
if (CYCLE1) lines.push(`// scripts/risks-curate.mjs --cycle1 from risks/cycle1.json (reconstructed; see`);
if (CYCLE1) lines.push(`// scripts/risks-cycle1-reconstruct.mts). The demo's "before" register — never curate.`);
lines.push(`// generation pass (npm run risks, ${payload.generatedAt.slice(0, 10)}, ledger rev ${String(payload.ledgerRev).slice(0, 8)}).`);
lines.push(`//`);
lines.push(`// Raw drafts, LLM transcripts, Exa evidence and the kill-log live under`);
lines.push(`// risks/ — the audit trail every entry below cites. Every € impact is`);
lines.push(`// COMPUTED from the risk's perturbation ops by lib/riskCompute.ts; nothing`);
lines.push(`// numeric here is an LLM assertion.`);
lines.push(`//`);
lines.push(`// Curation policy:`);
lines.push(`// - All ${items.length} judge survivors kept (blind rubric + kill thresholds in`);
lines.push(`//   scripts/risks-plan.mjs; kills/merges recorded in risks/killlog.json).`);
lines.push(`// - Tier: fact | model-structure | boundary → "rock" (attacks the model's own`);
lines.push(`//   construction); competitive | execution | exogenous → "front-of-mind".`);
lines.push(`// - Order = expected YAM loss (p × |ΔYAM|) vs the baseline scenario, desc.`);
lines.push(`// ─────────────────────────────────────────────────────────────────────────────`);
lines.push(``);
lines.push(`const rawRisks: Risk[] = [`);

for (const item of items) {
  const r = { ...item.risk, tier: ROCK_CATEGORIES.has(item.risk.category) ? "rock" : "front-of-mind" };
  lines.push(
    `  // ${r.tier === "rock" ? "◆ rock" : "○ front-of-mind"} · lens: ${item.lens} · judge ${item.judge.total}/20 · ` +
      `E[ΔYAM] ${eur(-item.expectedYamLoss)} · engine ΔYAM ${eur(item.impact.dYam)} · evidence: ${r.evidenceStatus ?? "speculative"}`,
  );
  lines.push(`  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/${r.id}.json`);
  const json = JSON.stringify(r, null, 2)
    .split("\n")
    .map((l) => "  " + l)
    .join("\n");
  lines.push(json + ",");
  lines.push(``);
}
lines.push(`];`);
lines.push(``);
lines.push(`// Validated at module load — a malformed register throws here, at boot,`);
lines.push(`// with every issue listed (same doctrine as the ledger).`);
lines.push(`export const ${EXPORT_NAME}: Risk[] = validateRisks(rawRisks, ledger);`);
lines.push(``);

fs.writeFileSync(path.join(ROOT, "lib", OUT_FILE), lines.join("\n"));
console.log(`wrote lib/${OUT_FILE} (${items.length} risks)`);
