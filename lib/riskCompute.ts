import { evaluate, type EvalResult, type Metric } from "@/lib/compute";
import { DIMENSION_FIELD } from "@/lib/dimensions";
import { informationValue } from "@/lib/voi";
import type { Ledger, Scenario } from "@/lib/schema";
import type { Mitigation, PerturbationOp, Risk } from "@/lib/riskSchema";

// ─────────────────────────────────────────────────────────────────────────────
// Risk Engine §2 — perturbation → engine. Pure, deterministic, no network.
//
// Generalizes the leaf-override primitive that compute.ts (tornado) and
// voi.ts already use privately: assumption leaves override via the scenario,
// every other leaf via a ledger clone. compute.ts itself is untouched.
//
// Impact is SCENARIO-RELATIVE: callers pass the current scenario, so risk
// exposure follows scope — deselect Germany and a DE-targeted risk's severity
// collapses. Sibling shares are NOT re-normalized (documented v1 caveat,
// same as the tornado).
// ─────────────────────────────────────────────────────────────────────────────

export interface RiskWorld {
  ledger: Ledger;
  scenario: Scenario;
}

/**
 * Compile a perturbation into the world where the risk has materialized.
 * Ops apply in array order. For assumption leaves the op reads the EFFECTIVE
 * value (scenario override ?? ledger default) and writes the result into the
 * scenario — a risk's `set` beats the user's slider, a `scale` scales
 * whatever the user currently believes. Never mutates its inputs.
 */
export function applyPerturbation(
  ledger: Ledger,
  scenario: Scenario,
  ops: PerturbationOp[],
): RiskWorld {
  let nextLedger = ledger;
  let nextScenario: Scenario = {
    ...scenario,
    geographies: [...scenario.geographies],
    segments: [...scenario.segments],
    customerTypes: [...scenario.customerTypes],
    assumptions: { ...scenario.assumptions },
  };

  for (const op of ops) {
    const node = nextLedger.find((n) => n.id === op.nodeId);
    if (!node) throw new Error(`riskCompute: unknown node '${op.nodeId}'`);

    if (op.op === "exclude") {
      if (!node.dimension || !node.dimensionValue) {
        throw new Error(`riskCompute: '${op.nodeId}' has no dimension to exclude from`);
      }
      const field = DIMENSION_FIELD[node.dimension];
      nextScenario = {
        ...nextScenario,
        [field]: nextScenario[field].filter((v) => v !== node.dimensionValue),
      };
      continue;
    }

    if (node.kind === "assumption") {
      const current = nextScenario.assumptions[node.id] ?? node.value;
      nextScenario.assumptions[node.id] = nextValue(current, op);
    } else {
      nextLedger = nextLedger.map((n) =>
        n.id === node.id ? { ...n, value: nextValue(n.value, op) } : n,
      );
    }
  }

  return { ledger: nextLedger, scenario: nextScenario };
}

function nextValue(current: number, op: PerturbationOp): number {
  switch (op.op) {
    case "set":
      return op.value!;
    case "scale":
      return current * op.value!;
    case "add":
      return current + op.value!;
    default:
      throw new Error(`riskCompute: op '${op.op}' carries no value`);
  }
}

export interface RiskImpact {
  base: EvalResult; // evaluate(ledger, scenario)
  perturbed: EvalResult; // evaluate under the risk's world
  dTam: number; // perturbed − base, €M
  dSam: number;
  dYam: number;
}

/** The engine-computed impact of a risk materializing, vs the given scenario. */
export function riskImpact(
  ledger: Ledger,
  scenario: Scenario,
  risk: Pick<Risk, "perturbation">,
): RiskImpact {
  const base = evaluate(ledger, scenario);
  const world = applyPerturbation(ledger, scenario, risk.perturbation);
  const perturbed = evaluate(world.ledger, world.scenario);
  return {
    base,
    perturbed,
    dTam: perturbed.tam - base.tam,
    dSam: perturbed.sam - base.sam,
    dYam: perturbed.yam - base.yam,
  };
}

/** severity = likelihood × |Δmetric| — expected loss on the bottom line. */
export function riskSeverity(
  likelihood: number,
  impact: RiskImpact,
  metric: Metric = "yam",
): number {
  const delta = { tam: impact.dTam, sam: impact.dSam, yam: impact.dYam }[metric];
  return likelihood * Math.abs(delta);
}

export interface RankedRisk {
  risk: Risk;
  impact: RiskImpact;
  severity: number;
}

/** The register, ranked by severity desc; deterministic ties broken by id. */
export function rankRisks(
  ledger: Ledger,
  scenario: Scenario,
  risks: Risk[],
  metric: Metric = "yam",
): RankedRisk[] {
  return risks
    .map((risk) => {
      const impact = riskImpact(ledger, scenario, risk);
      return { risk, impact, severity: riskSeverity(risk.likelihood.value, impact, metric) };
    })
    .sort((a, b) => b.severity - a.severity || a.risk.id.localeCompare(b.risk.id));
}

/**
 * The computable value of an information mitigation: what resolving its
 * target fact is worth (lib/voi.ts, unchanged). Null for act-type mitigations.
 */
export function mitigationVoi(
  ledger: Ledger,
  scenario: Scenario,
  mitigation: Mitigation,
): number | null {
  if (mitigation.type !== "information" || !mitigation.voiNodeId) return null;
  return informationValue(ledger, scenario, mitigation.voiNodeId);
}
