import type { Dimension, FactNode, Scenario } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// §3.3 — Lever dimensions: the selectable values + display labels.
//
// The lever identifier is the `dimensionValue` (e.g. 'oem-integrator'), NOT the
// ledger node id (e.g. 'cust.oem'). Scenarios reference dimensionValues.
//
// Orthogonality is mandatory: Segment = application, Customer Type = buyer
// profile. They intersect, they do not nest. No value appears under two
// dimensions (enforced by a test).
// ─────────────────────────────────────────────────────────────────────────────

export interface DimensionValue {
  value: string; // the dimensionValue id used in scenarios + ledger nodes
  label: string; // human-readable display label
}

export const GEOGRAPHIES: DimensionValue[] = [
  { value: "DE", label: "Germany" },
  { value: "NL", label: "Netherlands" },
  { value: "PL", label: "Poland" },
  { value: "CH", label: "Switzerland" },
  { value: "CZ", label: "Czechia" },
  { value: "AT", label: "Austria" },
  { value: "other", label: "Other CE" },
];

export const SEGMENTS: DimensionValue[] = [
  { value: "hyperscale", label: "Hyperscale" },
  { value: "colocation", label: "Colocation" },
  { value: "enterprise", label: "Enterprise" },
  { value: "edge", label: "Edge" },
  { value: "telecom", label: "Telecom" },
];

export const CUSTOMER_TYPES: DimensionValue[] = [
  { value: "operator-large", label: "Large operators" },
  { value: "operator-mid", label: "Mid / enterprise" },
  { value: "oem-integrator", label: "OEM / integrator" },
  { value: "distributor", label: "Distributor" },
];

export const DIMENSION_VALUES: Record<Dimension, DimensionValue[]> = {
  geography: GEOGRAPHIES,
  segment: SEGMENTS,
  customerType: CUSTOMER_TYPES,
};

export const DIMENSION_LABELS: Record<Dimension, string> = {
  geography: "Geography",
  segment: "Segment",
  customerType: "Customer Type",
};

/** All selectable values for a dimension (the baseline = everything selected). */
export function valuesOf(dimension: Dimension): string[] {
  return DIMENSION_VALUES[dimension].map((d) => d.value);
}

/** Human label for a dimension value; falls back to the raw value. */
export function labelFor(dimension: Dimension, value: string): string {
  return (
    DIMENSION_VALUES[dimension].find((d) => d.value === value)?.label ?? value
  );
}

/** Scenario field that holds the selected values of a dimension. */
export const DIMENSION_FIELD: Record<
  Dimension,
  "geographies" | "segments" | "customerTypes"
> = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
};

/**
 * A filter leaf is excluded when its dimensionValue is not in the scenario's
 * selection for its dimension. Non-dimensional nodes are never excluded.
 */
export function isExcluded(node: FactNode, scenario: Scenario): boolean {
  if (!node.dimension || !node.dimensionValue) return false;
  return !scenario[DIMENSION_FIELD[node.dimension]].includes(node.dimensionValue);
}
