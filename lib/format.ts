// Shared display formatting. Centralized so every surface renders money and
// ratios identically (CLAUDE.md §5 / plan Q4).

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
