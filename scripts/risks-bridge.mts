// ─────────────────────────────────────────────────────────────────────────────
// Risk pipeline ↔ engine bridge. Spawned by scripts/risks.mjs as
//
//   node --import ./scripts/risks-register.mjs scripts/risks-bridge.mts <cmd> [in] <out>
//
// so every € number the pipeline handles comes from the REAL engine
// (lib/compute.ts / lib/riskCompute.ts / lib/voi.ts) — the LLM never states
// impacts, and the pipeline never reimplements the math.
//
// Commands:
//   context <out.json>            the model-facing context pack (ledger slim,
//                                 affordance table, baseline, boundary, profile)
//   evaluate <in.json> <out.json> in: [{id, perturbation}] → per-item engine
//                                 impact or a validation error (for the repair loop)
//   voi <in.json> <out.json>      in: [nodeId] → informationValue per node
//   validate <in.json> <out.json> in: Risk[] → run lib/riskSchema.validateRisks
//                                 (the exact check the curated register boots with)
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs";
import { ledger } from "@/lib/ledger";
import { baselineScenario, evaluate } from "@/lib/compute";
import { informationValue } from "@/lib/voi";
import { riskImpact } from "@/lib/riskCompute";
import { isFunnelActive, validateRisks, type PerturbationOp } from "@/lib/riskSchema";
import { BOUNDARY_EXCLUSIONS } from "@/lib/boundary";
import { DIMENSION_VALUES } from "@/lib/dimensions";
import { BUSINESS_FIELDS, FOLLOWUP_QUESTIONS } from "@/lib/demoScript";
import type { FactNode } from "@/lib/schema";

const baseline = baselineScenario(ledger);

// ── context ──────────────────────────────────────────────────────────────────

function slimNode(n: FactNode) {
  return {
    id: n.id,
    label: n.label,
    kind: n.kind,
    value: n.value,
    unit: n.unit,
    confidence: n.confidence,
    maturity: n.maturity ?? null,
    dimension: n.dimension ?? null,
    dimensionValue: n.dimensionValue ?? null,
    sensitivityRange: n.sensitivityRange ?? null,
    funnelActive: isFunnelActive(n),
    derivation: n.derivation ?? null,
    provenance: n.provenance ?? null,
    // URLs stay in the repo's raw caches; excerpts are what prompts need.
    evidence: (n.evidence ?? []).map((e) => ({
      title: e.title,
      sourceType: e.sourceType,
      publisher: e.publisher ?? null,
      date: e.date ?? null,
      excerpt: e.excerpt ?? null,
      attached: e.attached,
    })),
  };
}

/** Band-edge impacts per funnel-active node — leverage without arithmetic. */
function affordances() {
  return ledger
    .filter((n) => isFunnelActive(n))
    .map((n) => {
      const swings = n.sensitivityRange
        ? (["low", "high"] as const).map((edge) => {
            const impact = riskImpact(ledger, baseline, {
              perturbation: [{ nodeId: n.id, op: "set", value: n.sensitivityRange![edge] }],
            });
            return {
              edge,
              value: n.sensitivityRange![edge],
              dTam: round(impact.dTam),
              dSam: round(impact.dSam),
              dYam: round(impact.dYam),
            };
          })
        : null;
      return {
        id: n.id,
        value: n.value,
        band: n.sensitivityRange ?? null,
        bandSwings: swings,
        informationValue: round(informationValue(ledger, baseline, n.id)),
      };
    });
}

function round(x: number): number {
  return Math.round(x * 1000) / 1000;
}

function contextPack() {
  return {
    ventureProfile: {
      fields: BUSINESS_FIELDS,
      followups: FOLLOWUP_QUESTIONS.map((q) => ({ question: q.question, answer: q.answer })),
    },
    baseline: evaluate(ledger, baseline),
    ledger: ledger.map(slimNode),
    affordances: affordances(),
    dimensions: DIMENSION_VALUES,
    boundaryExclusions: BOUNDARY_EXCLUSIONS,
  };
}

// ── evaluate ─────────────────────────────────────────────────────────────────

interface EvalItem {
  id: string;
  perturbation: PerturbationOp[];
}

function evaluateItems(items: EvalItem[]) {
  return items.map((item) => {
    // Domain-check via the real validator (wrapped in a minimal risk shell so
    // funnel-active / range / referential rules are the SAME ones the curated
    // register will face), then compute the impact with the real engine.
    try {
      validateRisks(
        [
          {
            id: item.id,
            title: item.id,
            narrative: "-",
            category: "fact",
            targetNodes: [...new Set(item.perturbation.map((p) => p.nodeId))],
            mechanism: "-",
            whyMissable: "-",
            falsifier: "-",
            likelihood: { value: 0.5, rationale: "-", basis: "judgment" },
            perturbation: item.perturbation,
            indicators: [{ signal: "-", updates: "increases" }],
            mitigations: [{ action: "-", type: "strategic" }],
            tier: "front-of-mind",
            resolution: "risk", // wrapper default — classification happens later, in its own stage
            asOf: "2026-01-01",
          },
        ],
        ledger,
      );
      const impact = riskImpact(ledger, baseline, { perturbation: item.perturbation });
      return {
        id: item.id,
        ok: true,
        impact: {
          base: impact.base,
          perturbed: impact.perturbed,
          dTam: impact.dTam,
          dSam: impact.dSam,
          dYam: impact.dYam,
        },
        noop:
          Math.abs(impact.dTam) < 1e-9 &&
          Math.abs(impact.dSam) < 1e-9 &&
          Math.abs(impact.dYam) < 1e-9,
      };
    } catch (err) {
      return { id: item.id, ok: false, error: (err as Error).message };
    }
  });
}

// ── voi ──────────────────────────────────────────────────────────────────────

function voiForNodes(nodeIds: string[]) {
  return nodeIds.map((id) => ({ id, informationValue: informationValue(ledger, baseline, id) }));
}

// ── main ─────────────────────────────────────────────────────────────────────

const [cmd, ...rest] = process.argv.slice(2);

function writeOut(outFile: string, payload: unknown) {
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2) + "\n");
}

switch (cmd) {
  case "context": {
    writeOut(rest[0], contextPack());
    break;
  }
  case "evaluate": {
    const items = JSON.parse(fs.readFileSync(rest[0], "utf8")) as EvalItem[];
    writeOut(rest[1], evaluateItems(items));
    break;
  }
  case "voi": {
    const ids = JSON.parse(fs.readFileSync(rest[0], "utf8")) as string[];
    writeOut(rest[1], voiForNodes(ids));
    break;
  }
  case "validate": {
    const raw = JSON.parse(fs.readFileSync(rest[0], "utf8"));
    try {
      validateRisks(raw, ledger);
      writeOut(rest[1], { ok: true });
    } catch (err) {
      writeOut(rest[1], { ok: false, error: (err as Error).message });
    }
    break;
  }
  default:
    console.error(`risks-bridge: unknown command '${cmd}'`);
    process.exit(1);
}
