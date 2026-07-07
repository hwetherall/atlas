import type { FactNode, Ledger, Scenario } from "@/lib/schema";
import {
  evaluate,
  type Metric,
  OBTAINABLE_ID,
  SERVICEABLE_ID,
  TAM_BASE_ID,
} from "@/lib/compute";
import { DIMENSION_FIELD } from "@/lib/dimensions";
import { bandSwing } from "@/lib/voi";
import { formatEUR } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// ledger.md §6.2 — Marginal contribution: the "it moves" number.
//
// Pure, read-only. The per-node analog of a tornado leaf swing (CLAUDE.md §4.3):
// "flip one filter value, hold the rest, see how much the metric changes."
//
//   filter leaf value v in dimension D:
//     cur = m(scenario); alt = scenario with v toggled; return cur − m(alt)
//
// Positive = v is currently adding that much to the metric. When v is excluded
// the result is negative and the inspector frames it as "+€X if included".
//
// Base/assumption leaves (tamBase, serviceableFactor, obtainableFactor) have no
// on/off, so they return 0 — the inspector shows their band swing instead.
// ─────────────────────────────────────────────────────────────────────────────

export function marginalContribution(
  ledger: Ledger,
  scenario: Scenario,
  id: string,
  metric: Metric,
): number {
  const node = ledger.find((n) => n.id === id);
  if (!node) return 0;

  // No on/off for the base or the assumption factors.
  if (id === TAM_BASE_ID || id === SERVICEABLE_ID || id === OBTAINABLE_ID) return 0;
  if (!node.dimension || !node.dimensionValue) return 0;

  const field = DIMENSION_FIELD[node.dimension];
  const selected = scenario[field];
  const isSelected = selected.includes(node.dimensionValue);
  const altSelected = isSelected
    ? selected.filter((v) => v !== node.dimensionValue)
    : [...selected, node.dimensionValue];

  const alt: Scenario = { ...scenario, [field]: altSelected };
  return evaluate(ledger, scenario)[metric] - evaluate(ledger, alt)[metric];
}

export type ContributionMode = "included" | "excluded" | "band" | "none";

export interface ContributionMeasure {
  amount: number; // €M — signed for "included", positive magnitude otherwise
  metric: Metric;
  mode: ContributionMode;
}

/**
 * Numeric form of a node's live contribution — drives the fact-bank impact
 * bars and the display strings below. Filter leaves measure marginal
 * contribution to TAM; base/assumption leaves measure their band swing on the
 * metric they actually drive (tamBase → TAM, serviceable → SAM, obtainable →
 * YAM).
 */
export function contributionMeasure(
  ledger: Ledger,
  scenario: Scenario,
  node: FactNode,
): ContributionMeasure {
  if (node.dimension && node.dimensionValue) {
    const selected = scenario[DIMENSION_FIELD[node.dimension]].includes(node.dimensionValue);
    const c = marginalContribution(ledger, scenario, node.id, "tam");
    return selected
      ? { amount: c, metric: "tam", mode: "included" }
      : { amount: Math.abs(c), metric: "tam", mode: "excluded" };
  }
  const metric: Metric =
    node.id === SERVICEABLE_ID ? "sam" : node.id === OBTAINABLE_ID ? "yam" : "tam";
  const sw = bandSwing(ledger, scenario, node.id, metric);
  return sw > 0
    ? { amount: sw, metric, mode: "band" }
    : { amount: 0, metric, mode: "none" };
}

/**
 * Display form of `contributionMeasure`, shared by the inspector's metric card
 * and the fact-bank table cell so both always render the same number.
 */
export function contributionDisplay(
  ledger: Ledger,
  scenario: Scenario,
  node: FactNode,
): { value: string; sub: string } {
  const m = contributionMeasure(ledger, scenario, node);
  switch (m.mode) {
    case "included":
      return { value: formatEUR(m.amount, { signed: true }), sub: `of ${m.metric.toUpperCase()} today` };
    case "excluded":
      return { value: `+${formatEUR(m.amount)}`, sub: "if included" };
    case "band":
      return { value: `±${formatEUR(m.amount)}`, sub: `possible swing on ${m.metric.toUpperCase()}` };
    case "none":
      return { value: "—", sub: "no range estimated yet" };
  }
}
