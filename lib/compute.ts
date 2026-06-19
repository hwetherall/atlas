import type { Confidence, Dimension, FactNode, Ledger, Scenario } from "@/lib/schema";
import { valuesOf } from "@/lib/dimensions";

// ─────────────────────────────────────────────────────────────────────────────
// §4 — Core computations. Pure, deterministic, no network, no LLM.
// A market size is a computation, never a number: TAM/SAM/YAM are DERIVED here
// from leaf facts, never hardcoded.
// ─────────────────────────────────────────────────────────────────────────────

export type Metric = "tam" | "sam" | "yam";

export interface EvalResult {
  tam: number;
  sam: number;
  yam: number;
  factors: {
    geography: number;
    segment: number;
    customerType: number;
    serviceable: number;
    obtainable: number;
  };
}

// Node ids of the two assumption leaves (the assumption levers).
export const SERVICEABLE_ID = "serviceableFactor";
export const OBTAINABLE_ID = "obtainableFactor";
export const TAM_BASE_ID = "tamBase";

function indexById(ledger: Ledger): Map<string, FactNode> {
  const map = new Map<string, FactNode>();
  for (const node of ledger) map.set(node.id, node);
  return map;
}

function nodeValue(byId: Map<string, FactNode>, id: string): number {
  const node = byId.get(id);
  if (!node) throw new Error(`compute: missing required node '${id}'`);
  return node.value;
}

/**
 * Scope factor for one filter dimension: the sum of the selected shares
 * (CLAUDE.md §3.2). All values selected → ~1.0; empty selection → 0.
 */
function scopeFactor(ledger: Ledger, dimension: Dimension, selected: string[]): number {
  const selectedSet = new Set(selected);
  let sum = 0;
  for (const node of ledger) {
    if (node.dimension === dimension && node.dimensionValue && selectedSet.has(node.dimensionValue)) {
      sum += node.value;
    }
  }
  return sum;
}

/** Effective assumption value: scenario override (by node id) or ledger default. */
function effectiveAssumption(byId: Map<string, FactNode>, scenario: Scenario, id: string): number {
  const override = scenario.assumptions[id];
  return override ?? nodeValue(byId, id);
}

/**
 * §4.1 — evaluate(ledger, scenario) → { tam, sam, yam, factors }.
 * Top-down multiplicative funnel (§3.2).
 */
export function evaluate(ledger: Ledger, scenario: Scenario): EvalResult {
  const byId = indexById(ledger);

  const geography = scopeFactor(ledger, "geography", scenario.geographies);
  const segment = scopeFactor(ledger, "segment", scenario.segments);
  const customerType = scopeFactor(ledger, "customerType", scenario.customerTypes);

  const tamBase = nodeValue(byId, TAM_BASE_ID);
  const serviceable = effectiveAssumption(byId, scenario, SERVICEABLE_ID);
  const obtainable = effectiveAssumption(byId, scenario, OBTAINABLE_ID);

  const tam = tamBase * geography * segment * customerType;
  const sam = tam * serviceable;
  const yam = sam * obtainable;

  return {
    tam,
    sam,
    yam,
    factors: { geography, segment, customerType, serviceable, obtainable },
  };
}

function metricOf(result: EvalResult, metric: Metric): number {
  return result[metric];
}

/** A scenario with all dimension values selected and default assumptions. */
export function baselineScenario(
  ledger: Ledger,
  overrides: Partial<Pick<Scenario, "id" | "label">> = {},
): Scenario {
  void ledger;
  return {
    id: overrides.id ?? "baseline",
    label: overrides.label ?? "Baseline (all segments & buyers)",
    geographies: valuesOf("geography"),
    segments: valuesOf("segment"),
    customerTypes: valuesOf("customerType"),
    assumptions: {},
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// §4.2 — delta(): sequential attribution in funnel order. Exact (telescopes
// to the total), order-dependent.
// ─────────────────────────────────────────────────────────────────────────────

export const DELTA_ORDER = [
  "geography",
  "segment",
  "customerType",
  "serviceable",
  "obtainable",
] as const;
export type DeltaFactor = (typeof DELTA_ORDER)[number];

export interface DeltaResult {
  total: number;
  byFactor: Record<DeltaFactor, number>;
}

// Swap a single factor of `state` from its current value to the scenario's.
function applyFactor(state: Scenario, scenario: Scenario, factor: DeltaFactor): void {
  switch (factor) {
    case "geography":
      state.geographies = [...scenario.geographies];
      break;
    case "segment":
      state.segments = [...scenario.segments];
      break;
    case "customerType":
      state.customerTypes = [...scenario.customerTypes];
      break;
    case "serviceable":
      setAssumption(state, scenario, SERVICEABLE_ID);
      break;
    case "obtainable":
      setAssumption(state, scenario, OBTAINABLE_ID);
      break;
  }
}

function setAssumption(state: Scenario, scenario: Scenario, id: string): void {
  if (id in scenario.assumptions) {
    state.assumptions[id] = scenario.assumptions[id];
  } else {
    // Revert to ledger default so the marginal contribution is measured against
    // the same effective value evaluate() would use.
    delete state.assumptions[id];
  }
}

/**
 * §4.2 — delta(ledger, baseline, scenario, metric) → { total, byFactor }.
 * sum(byFactor) === metric(scenario) − metric(baseline), exactly.
 */
export function delta(
  ledger: Ledger,
  baseline: Scenario,
  scenario: Scenario,
  metric: Metric,
): DeltaResult {
  const state = structuredClone(baseline);
  const baseMetric = metricOf(evaluate(ledger, baseline), metric);
  let prev = baseMetric;

  const byFactor = {} as Record<DeltaFactor, number>;
  for (const factor of DELTA_ORDER) {
    applyFactor(state, scenario, factor);
    const cur = metricOf(evaluate(ledger, state), metric);
    byFactor[factor] = cur - prev;
    prev = cur;
  }

  return { total: prev - baseMetric, byFactor };
}

// ─────────────────────────────────────────────────────────────────────────────
// §4.3 — sensitivity(): the tornado. For each leaf with a sensitivityRange,
// hold everything else at the scenario's values, set the leaf to low then high,
// recompute the metric, record the swing. Rank by max(|low|,|high|).
//
// v1 tornado leaves: tamBase, serviceableFactor, obtainableFactor, plus the
// SELECTED segment share and the SELECTED customer share. Perturbing a single
// share does NOT re-normalize the others (documented v1 simplification).
// ─────────────────────────────────────────────────────────────────────────────

export interface SwingBar {
  id: string;
  label: string;
  confidence: Confidence;
  base: number; // metric at the scenario's normal leaf value
  lowSwing: number; // metric(leaf=low) − base
  highSwing: number; // metric(leaf=high) − base
  lowValue: number; // the perturbed leaf value (low)
  highValue: number; // the perturbed leaf value (high)
  magnitude: number; // max(|lowSwing|, |highSwing|) — the rank key
}

// Is this leaf a v1 tornado candidate for the given scenario?
function isTornadoLeaf(node: FactNode, scenario: Scenario): boolean {
  if (!node.sensitivityRange) return false;
  // Undimensioned funnel leaves: always candidates.
  if (node.id === TAM_BASE_ID || node.id === SERVICEABLE_ID || node.id === OBTAINABLE_ID) {
    return true;
  }
  // Selected segment / customer shares (geography is not a v1 tornado leaf).
  if (node.dimension === "segment" && node.dimensionValue) {
    return scenario.segments.includes(node.dimensionValue);
  }
  if (node.dimension === "customerType" && node.dimensionValue) {
    return scenario.customerTypes.includes(node.dimensionValue);
  }
  return false;
}

// Evaluate `metric` with one leaf overridden to `value`, holding all else at
// the scenario's values.
function metricWithLeafOverride(
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
    return metricOf(evaluate(ledger, s), metric);
  }
  const perturbed: Ledger = ledger.map((n) => (n.id === node.id ? { ...n, value } : n));
  return metricOf(evaluate(perturbed, scenario), metric);
}

export function sensitivity(ledger: Ledger, scenario: Scenario, metric: Metric): SwingBar[] {
  const base = metricOf(evaluate(ledger, scenario), metric);

  const bars: SwingBar[] = [];
  for (const node of ledger) {
    if (!isTornadoLeaf(node, scenario)) continue;
    const { low, high } = node.sensitivityRange!;
    const lowSwing = metricWithLeafOverride(ledger, scenario, node, low, metric) - base;
    const highSwing = metricWithLeafOverride(ledger, scenario, node, high, metric) - base;
    bars.push({
      id: node.id,
      label: node.label,
      confidence: node.confidence,
      base,
      lowSwing,
      highSwing,
      lowValue: low,
      highValue: high,
      magnitude: Math.max(Math.abs(lowSwing), Math.abs(highSwing)),
    });
  }

  return bars.sort((a, b) => b.magnitude - a.magnitude);
}
