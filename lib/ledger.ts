import { type FactNode, type Ledger, validateLedger } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// §10 — Illustrative seed ledger.
//
// [ILLUSTRATIVE] All numeric values below are placeholders to make the engine
// buildable and testable. The STRUCTURE is canonical; the VALUES are not.
// Replacing them with real, sourced figures (from the VentureX profile + a
// market-sizing research run) is a separate, non-blocking research pass.
//
// Case: anonymized industrial entrant into the Central Europe rack-PDU market.
// ─────────────────────────────────────────────────────────────────────────────

const AS_OF = "2026-06-19";

const rawLedger: FactNode[] = [
  {
    id: "tamBase",
    label: "Central Europe rack-PDU market, all segments/buyers",
    kind: "extracted",
    value: 1200,
    unit: "EUR_M",
    confidence: "inferred",
    asOf: AS_OF,
    source: { title: "[source TBD]" },
    sensitivityRange: { low: 900, high: 1500 },
  },

  // geography shares (sum = 1.00)
  { id: "geo.DE", label: "Germany", kind: "estimated", value: 0.28, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "DE" },
  { id: "geo.NL", label: "Netherlands", kind: "estimated", value: 0.13, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "NL" },
  { id: "geo.PL", label: "Poland", kind: "estimated", value: 0.12, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "PL" },
  { id: "geo.CH", label: "Switzerland", kind: "estimated", value: 0.07, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "CH" },
  { id: "geo.CZ", label: "Czechia", kind: "estimated", value: 0.06, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "CZ" },
  { id: "geo.AT", label: "Austria", kind: "estimated", value: 0.05, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "AT" },
  { id: "geo.other", label: "Other CE", kind: "estimated", value: 0.29, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "other" },

  // segment (application) shares (sum = 1.00)
  { id: "seg.hyperscale", label: "Hyperscale", kind: "estimated", value: 0.34, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "hyperscale", sensitivityRange: { low: 0.29, high: 0.39 } },
  { id: "seg.colocation", label: "Colocation", kind: "estimated", value: 0.27, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "colocation" },
  { id: "seg.enterprise", label: "Enterprise", kind: "estimated", value: 0.24, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "enterprise" },
  { id: "seg.edge", label: "Edge", kind: "estimated", value: 0.09, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "edge", sensitivityRange: { low: 0.06, high: 0.13 } },
  { id: "seg.telecom", label: "Telecom", kind: "estimated", value: 0.06, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "telecom" },

  // customer-type (buyer profile) shares (sum = 1.00)
  { id: "cust.operator-large", label: "Large operators", kind: "estimated", value: 0.4, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "operator-large", sensitivityRange: { low: 0.33, high: 0.47 } },
  { id: "cust.operator-mid", label: "Mid / enterprise", kind: "estimated", value: 0.25, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "operator-mid" },
  { id: "cust.oem", label: "OEM / integrator", kind: "estimated", value: 0.22, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "oem-integrator" },
  { id: "cust.distributor", label: "Distributor", kind: "estimated", value: 0.13, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "distributor" },

  // funnel factors (assumption leaves — assumption levers)
  { id: "serviceableFactor", label: "Serviceable share of TAM", kind: "assumption", value: 0.55, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { note: "channel + regulatory reach" }, sensitivityRange: { low: 0.45, high: 0.65 } },
  { id: "obtainableFactor", label: "Year-1 obtainable share of SAM", kind: "assumption", value: 0.06, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { note: "year-1 win-rate × ramp × capacity" }, sensitivityRange: { low: 0.03, high: 0.1 } },

  // shape (display + risk)
  { id: "shape.cagr", label: "Market CAGR (2025–2030)", kind: "extracted", value: 0.11, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { title: "[source TBD]" } },
  { id: "shape.cr3", label: "Top-3 supplier concentration", kind: "extracted", value: 0.62, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { title: "VentureX competitor table" } },
];

// Validated at module load — a malformed ledger throws here, at boot.
export const ledger: Ledger = validateLedger(rawLedger);
