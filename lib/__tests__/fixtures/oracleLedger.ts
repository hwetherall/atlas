import { type FactNode, type Ledger, validateLedger } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Frozen pre-research illustrative ledger — the §10 engine oracle.
//
// NEVER EDIT. This is a verbatim snapshot of lib/ledger.ts as of the last
// illustrative seed (CLAUDE.md §10). The engine tests (compute / graph /
// contribution / voi) pin exact numbers against it so the live ledger can be
// re-curated with real research values without breaking the correctness gate.
// (No validateSkillRefs here — the oracle is deliberately decoupled from the
// skills registry.)
// ─────────────────────────────────────────────────────────────────────────────

const AS_OF = "2026-06-19";

const rawLedger: FactNode[] = [
  // ── tamBase — secondary hero / top value-of-information (full treatment) ────
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
    skillId: "tam-base-sizing",
    maturity: "single-source",
    derivation: {
      method: "Bottom-up installed base × ASP",
      expression: "CE_racks × PDU_attach_rate × ASP ≈ €1,200M",
    },
    provenance: {
      rationale:
        "One market report, no triangulation yet → widest band, top value-of-information.",
      promotionPath: "Triangulate against a revenue-based sizing → narrow band, verified.",
    },
    evidence: [
      {
        title: "[source TBD] — CE rack-PDU market sizing",
        sourceType: "industry-report",
        attached: true,
        excerpt: "Region-wide rack-PDU revenue ≈ €1.2B (all segments).",
      },
      {
        title: "Revenue-based cross-check",
        sourceType: "pending",
        attached: false,
        excerpt:
          "A second sizing method would triangulate the base and shrink the ±25% band.",
      },
    ],
  },

  // ── geography shares (sum = 1.00) ──────────────────────────────────────────
  // geo.DE — full hero treatment (the exact target the inspector mock was built against).
  {
    id: "geo.DE",
    label: "Germany",
    kind: "estimated",
    value: 0.28,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "DE",
    sensitivityRange: { low: 0.24, high: 0.31 },
    skillId: "geo-share-triangulation",
    maturity: "triangulated",
    derivation: {
      method: "Top-down capacity apportionment",
      expression: "DE_capacity (2.1 GW) ÷ CE_capacity (7.5 GW) = 0.28",
      crossCheck: "GDP-weighted: 0.27 (within 5% band)",
    },
    provenance: {
      rationale: "Single capacity source; GDP cross-check agrees → inferred.",
      promotionPath:
        "Attach a second independent capacity source within 5% → verified.",
    },
    evidence: [
      {
        title: "DCD Intelligence — CE data-centre power report",
        sourceType: "industry-report",
        publisher: "DCD Intelligence",
        date: "2025-11",
        excerpt:
          "German installed rack capacity ≈ 2.1 GW, the largest national base in the region.",
        attached: true,
      },
      {
        title: "VentureX profile — competitor & footprint table",
        sourceType: "internal",
        date: AS_OF,
        excerpt: "Corroborates DE as the dominant CE footprint.",
        attached: true,
      },
      {
        title: "Second independent capacity source",
        sourceType: "pending",
        excerpt: "Corroborating this lifts confidence inferred → verified.",
        attached: false,
      },
    ],
  },
  { id: "geo.NL", label: "Netherlands", kind: "estimated", value: 0.13, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "NL", skillId: "geo-share-triangulation", maturity: "single-source", provenance: { rationale: "Capacity-apportioned from one source; GDP cross-check pending → inferred." } },
  { id: "geo.PL", label: "Poland", kind: "estimated", value: 0.12, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "PL", skillId: "geo-share-triangulation", maturity: "single-source", provenance: { rationale: "Capacity-apportioned from one source; fast-growing base adds uncertainty → inferred." } },
  { id: "geo.CH", label: "Switzerland", kind: "estimated", value: 0.07, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "CH", skillId: "geo-share-triangulation", maturity: "single-source", provenance: { rationale: "Small base apportioned from one capacity source → inferred." } },
  { id: "geo.CZ", label: "Czechia", kind: "estimated", value: 0.06, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "CZ", skillId: "geo-share-triangulation", maturity: "single-source", provenance: { rationale: "Small base apportioned from one capacity source → inferred." } },
  { id: "geo.AT", label: "Austria", kind: "estimated", value: 0.05, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "AT", skillId: "geo-share-triangulation", maturity: "single-source", provenance: { rationale: "Small base apportioned from one capacity source → inferred." } },
  { id: "geo.other", label: "Other CE", kind: "estimated", value: 0.29, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "other", skillId: "geo-share-triangulation", maturity: "needs-source", provenance: { rationale: "Residual bucket — sum of un-itemised markets, no direct source → inferred." } },

  // ── segment (application) shares (sum = 1.00) ──────────────────────────────
  { id: "seg.hyperscale", label: "Hyperscale", kind: "estimated", value: 0.34, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "hyperscale", sensitivityRange: { low: 0.29, high: 0.39 }, skillId: "segment-decomposition", maturity: "triangulated", provenance: { rationale: "Build-out pipeline + analyst split agree on the largest segment → inferred." } },
  { id: "seg.colocation", label: "Colocation", kind: "estimated", value: 0.27, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "colocation", skillId: "segment-decomposition", maturity: "single-source", provenance: { rationale: "Decomposed from the build-out pipeline; one analyst split → inferred." } },
  { id: "seg.enterprise", label: "Enterprise", kind: "estimated", value: 0.24, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "enterprise", skillId: "segment-decomposition", maturity: "single-source", provenance: { rationale: "Decomposed from the build-out pipeline; one analyst split → inferred." } },
  { id: "seg.edge", label: "Edge", kind: "estimated", value: 0.09, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "edge", sensitivityRange: { low: 0.06, high: 0.13 }, skillId: "segment-decomposition", maturity: "single-source", provenance: { rationale: "Thin, fast-moving segment — wide band, one source → inferred." } },
  { id: "seg.telecom", label: "Telecom", kind: "estimated", value: 0.06, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "segment", dimensionValue: "telecom", skillId: "segment-decomposition", maturity: "needs-source", provenance: { rationale: "Smallest segment; estimated from pipeline residual → inferred." } },

  // ── customer-type (buyer profile) shares (sum = 1.00) ──────────────────────
  { id: "cust.operator-large", label: "Large operators", kind: "estimated", value: 0.4, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "operator-large", sensitivityRange: { low: 0.33, high: 0.47 }, skillId: "buyer-mix-survey", maturity: "triangulated", provenance: { rationale: "Channel structure + deal-size data agree on the dominant buyer → inferred." } },
  { id: "cust.operator-mid", label: "Mid / enterprise", kind: "estimated", value: 0.25, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "operator-mid", skillId: "buyer-mix-survey", maturity: "single-source", provenance: { rationale: "Weighted from procurement-spend share, one source → inferred." } },
  { id: "cust.oem", label: "OEM / integrator", kind: "estimated", value: 0.22, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "oem-integrator", skillId: "buyer-mix-survey", maturity: "single-source", provenance: { rationale: "Weighted from procurement-spend share, one source → inferred." } },
  { id: "cust.distributor", label: "Distributor", kind: "estimated", value: 0.13, unit: "ratio", confidence: "inferred", asOf: AS_OF, dimension: "customerType", dimensionValue: "distributor", skillId: "buyer-mix-survey", maturity: "needs-source", provenance: { rationale: "Indirect channel — hardest to attribute spend, no field cross-check → inferred." } },

  // ── funnel factors (assumption leaves — assumption levers) ─────────────────
  { id: "serviceableFactor", label: "Serviceable share of TAM", kind: "assumption", value: 0.55, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { note: "channel + regulatory reach" }, sensitivityRange: { low: 0.45, high: 0.65 }, skillId: "serviceability-model", maturity: "single-source", provenance: { rationale: "Assumption leaf — channel + regulatory reach, no field validation yet → inferred." } },
  { id: "obtainableFactor", label: "Year-1 obtainable share of SAM", kind: "assumption", value: 0.06, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { note: "year-1 win-rate × ramp × capacity" }, sensitivityRange: { low: 0.03, high: 0.1 }, skillId: "year1-obtainable-model", maturity: "needs-source", provenance: { rationale: "Assumption leaf — win-rate is the deepest unknown; widest funnel band → inferred." } },

  // ── shape (display + risk) ─────────────────────────────────────────────────
  { id: "shape.cagr", label: "Market CAGR (2025–2030)", kind: "extracted", value: 0.11, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { title: "[source TBD]" }, skillId: "cagr-projection", maturity: "single-source", provenance: { rationale: "Fitted to one historical series + an analyst forecast → inferred." } },
  { id: "shape.cr3", label: "Top-3 supplier concentration", kind: "extracted", value: 0.62, unit: "ratio", confidence: "inferred", asOf: AS_OF, source: { title: "VentureX competitor table" }, skillId: "competitor-concentration", maturity: "single-source", provenance: { rationale: "Consumed from the VentureX competitor table; one share source → inferred." } },
];

export const oracleLedger: Ledger = validateLedger(rawLedger);
