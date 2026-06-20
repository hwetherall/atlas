import type { Dimension, Ledger, Scenario } from "@/lib/schema";
import {
  evaluate,
  type Metric,
  OBTAINABLE_ID,
  SERVICEABLE_ID,
  TAM_BASE_ID,
} from "@/lib/compute";

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

const DIM_FIELD: Record<Dimension, "geographies" | "segments" | "customerTypes"> = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
};

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

  const field = DIM_FIELD[node.dimension];
  const selected = scenario[field];
  const isSelected = selected.includes(node.dimensionValue);
  const altSelected = isSelected
    ? selected.filter((v) => v !== node.dimensionValue)
    : [...selected, node.dimensionValue];

  const alt: Scenario = { ...scenario, [field]: altSelected };
  return evaluate(ledger, scenario)[metric] - evaluate(ledger, alt)[metric];
}
