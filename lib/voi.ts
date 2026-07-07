import type { Confidence, FactNode, Ledger, Scenario } from "@/lib/schema";
import { evaluate, type Metric } from "@/lib/compute";

// ─────────────────────────────────────────────────────────────────────────────
// ledger.md §6.3 — Value of information (Pedram's framework, per fact).
//
//   informationValue = swing€ × uncertainty
//
//   swing€      = the node's plausible-band impact on TAM (0 if no band)
//   uncertainty = 1 − confidenceWeight (verified→0, inferred→0.5, unknown→0.8)
//
// Higher = "verify this next." Drives the ledger's "Riskiest first" sort (§7).
//
// NOTE: swing€ is computed PER-NODE here, directly — deliberately NOT read from
// compute.ts `sensitivity()`. sensitivity()'s v1 tornado set excludes geography
// leaves, so reading it would score geo.DE at 0 and break the §6.3 acceptance
// (geo.DE, now banded, must outrank any band-less leaf). The perturbation here
// mirrors sensitivity()'s primitive (no re-normalization of sibling shares).
// ─────────────────────────────────────────────────────────────────────────────

const UNCERTAINTY: Record<Confidence, number> = {
  verified: 0,
  inferred: 0.5,
  unknown: 0.8,
};

// `metric` with one leaf overridden to `value`, holding all else at the scenario.
function metricWithLeaf(
  ledger: Ledger,
  scenario: Scenario,
  node: FactNode,
  value: number,
  metric: Metric,
): number {
  if (node.kind === "assumption") {
    const s: Scenario = {
      ...scenario,
      assumptions: { ...scenario.assumptions, [node.id]: value },
    };
    return evaluate(ledger, s)[metric];
  }
  const perturbed: Ledger = ledger.map((n) => (n.id === node.id ? { ...n, value } : n));
  return evaluate(perturbed, scenario)[metric];
}

/**
 * The node's plausible-band swing on `metric` (€M / ratio). 0 if it has no band.
 * The base/assumption metric cards use the metric the leaf actually drives
 * (tamBase → TAM, serviceableFactor → SAM, obtainableFactor → YAM).
 */
export function bandSwing(
  ledger: Ledger,
  scenario: Scenario,
  id: string,
  metric: Metric,
): number {
  const node = ledger.find((n) => n.id === id);
  if (!node || !node.sensitivityRange) return 0;
  const base = evaluate(ledger, scenario)[metric];
  const low = metricWithLeaf(ledger, scenario, node, node.sensitivityRange.low, metric);
  const high = metricWithLeaf(ledger, scenario, node, node.sensitivityRange.high, metric);
  return Math.max(Math.abs(low - base), Math.abs(high - base));
}

/** Convenience: the node's plausible-band swing on TAM (the VOI driver). */
export function swingTam(ledger: Ledger, scenario: Scenario, id: string): number {
  return bandSwing(ledger, scenario, id, "tam");
}

export function informationValue(ledger: Ledger, scenario: Scenario, id: string): number {
  const node = ledger.find((n) => n.id === id);
  if (!node) return 0;
  return swingTam(ledger, scenario, id) * UNCERTAINTY[node.confidence];
}

export type VoiBucket = "High" | "Med" | "Low";

/** Bucket a node's information value against the ledger max (display tiering). */
export function voiBucket(voi: number, maxVoi: number): VoiBucket {
  if (maxVoi <= 0) return "Low";
  const r = voi / maxVoi;
  if (r >= 0.5) return "High";
  if (r >= 0.15) return "Med";
  return "Low";
}
