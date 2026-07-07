// Shared display formatting. Centralized so every surface renders money and
// ratios identically (CLAUDE.md §5 / plan Q4).

import type { FactNode } from "@/lib/schema";

const MINUS = "−"; // typographic minus, matches the design doc

/**
 * Format a EUR value expressed in millions.
 * - |value| ≥ 100 → 0 decimal places (€1,200M)
 * - |value| < 100 → 2 decimal places (€31.10M)
 * - signed: prefix + / − for use in deltas (−€336M, +€12.50M)
 */
export function formatEUR(value: number, opts: { signed?: boolean } = {}): string {
  const abs = Math.abs(value);
  const dp = abs >= 100 ? 0 : 2;
  const body = `€${abs.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}M`;

  if (opts.signed) {
    return `${value < 0 ? MINUS : "+"}${body}`;
  }
  return value < 0 ? `${MINUS}${body}` : body;
}

/** Format a 0–1 ratio as a percentage. */
export function formatPct(ratio: number, dp = 0): string {
  return `${(ratio * 100).toFixed(dp)}%`;
}

function formatUnitValue(unit: string, v: number): string {
  if (unit === "EUR_M") return formatEUR(v);
  if (unit === "ratio") return formatPct(v, v < 0.1 ? 1 : 0);
  return `${v}`;
}

/** A node's value in its own unit (€M / % / raw with unit suffix). */
export function formatNodeValue(node: Pick<FactNode, "value" | "unit">): string {
  if (node.unit === "EUR_M") return formatEUR(node.value);
  if (node.unit === "ratio") return formatPct(node.value, node.value < 0.1 ? 1 : 0);
  return `${node.value} ${node.unit}`;
}

/** A node's plausible band as "low – high" in its own unit; "—" without one. */
export function formatNodeBand(
  node: Pick<FactNode, "unit" | "sensitivityRange">,
): string {
  if (!node.sensitivityRange) return "—";
  const { low, high } = node.sensitivityRange;
  return `${formatUnitValue(node.unit, low)} – ${formatUnitValue(node.unit, high)}`;
}
