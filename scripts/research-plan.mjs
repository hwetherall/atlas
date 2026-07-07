// ─────────────────────────────────────────────────────────────────────────────
// QUERY_PLAN — the checked-in research plan for the cached Exa pass.
//
// Each group produces one research/raw/<id>.json file and feeds one or more
// ledger fact ids. Values are NEVER taken from here — this only says what we
// went looking for. Curation (picking values + evidence into lib/ledger.ts)
// is a human step over the cached results.
//
// Run: npm run research            (skips groups already cached)
//      npm run research -- --only=tam-base,cr3-vendors
//      npm run research -- --force
// ─────────────────────────────────────────────────────────────────────────────

export const QUERY_PLAN = [
  {
    id: "tam-base",
    feeds: ["tamBase"],
    intent: "Headline €/$ figure for the Europe rack-PDU market (scope-down anchor for CE-7).",
    queries: [
      "Europe rack PDU market size million 2025 report",
      "EU rack power distribution units market revenue IndexBox",
      "Europe data center PDU market size forecast 2025 2035",
    ],
  },
  {
    id: "tam-global-crosscheck",
    feeds: ["tamBase", "shape.cagr"],
    intent: "Global rack-PDU market size + CAGR for the scope-down chain and growth cross-check.",
    queries: [
      "global rack PDU market size billion USD CAGR forecast",
      "intelligent PDU market size data center 2025 2030",
    ],
  },
  {
    id: "geo-DE",
    feeds: ["geo.DE"],
    intent: "Germany data-center capacity/market proxy (largest CE base).",
    queries: [
      "Germany data center market size capacity MW 2025",
      "Frankfurt FLAP-D data center capacity megawatts market",
    ],
  },
  {
    id: "geo-NL",
    feeds: ["geo.NL"],
    intent: "Netherlands data-center capacity proxy.",
    queries: ["Netherlands Amsterdam data center market capacity MW 2025"],
  },
  {
    id: "geo-PL",
    feeds: ["geo.PL"],
    intent: "Poland data-center capacity proxy (fast-growing).",
    queries: ["Poland data center market size growth Warsaw capacity MW"],
  },
  {
    id: "geo-alpine",
    feeds: ["geo.CH", "geo.AT"],
    intent: "Switzerland + Austria data-center capacity proxies.",
    queries: [
      "Switzerland Zurich data center market capacity MW",
      "Austria Vienna data center market size capacity",
    ],
  },
  {
    id: "geo-CZ-other",
    feeds: ["geo.CZ", "geo.other"],
    intent: "Czechia proxy + residual CEE bucket by country.",
    queries: [
      "Czech Republic Prague data center market capacity",
      "Central Eastern Europe data center market by country Hungary Romania Slovakia",
    ],
  },
  {
    id: "geo-region-denominator",
    feeds: ["geo.DE", "geo.NL", "geo.PL", "geo.CH", "geo.CZ", "geo.AT", "geo.other"],
    intent: "One consistent Europe per-country capacity table to normalise geography shares.",
    queries: [
      "Europe data center capacity by country 2025 CBRE report MW",
      "European data center markets country comparison operational IT load",
    ],
  },
  {
    id: "seg-mix",
    feeds: ["seg.hyperscale", "seg.colocation", "seg.enterprise"],
    intent: "Hyperscale vs colocation vs enterprise share of the data-center market.",
    queries: [
      "data center market share hyperscale colocation enterprise percentage split",
      "Europe colocation vs hyperscale capacity share 2025",
    ],
  },
  {
    id: "seg-edge-telecom",
    feeds: ["seg.edge", "seg.telecom"],
    intent: "Edge and telecom shares of the data-center market (thin segments).",
    queries: [
      "edge data center market share percent of total data center market",
      "telecom central office data center power infrastructure market size share",
    ],
  },
  {
    id: "cust-mix",
    feeds: ["cust.operator-large", "cust.operator-mid", "cust.oem", "cust.distributor"],
    intent: "Channel structure for DC power equipment — buyer-mix triangulation (hardest group).",
    queries: [
      "data center power equipment sales channel direct OEM distributor share",
      "PDU procurement colocation operator OEM integrator channel structure",
    ],
  },
  {
    id: "serviceable-benchmark",
    feeds: ["serviceableFactor"],
    intent: "SAM-as-share-of-TAM benchmarks + market-entry/regulatory reach evidence.",
    queries: [
      "serviceable addressable market SAM percentage of TAM B2B hardware benchmark",
      "data center equipment vendor certification requirements Europe market entry barriers",
    ],
  },
  {
    id: "obtainable-benchmark",
    feeds: ["obtainableFactor"],
    intent: "Year-1 obtainable-share benchmarks for a new B2B hardware entrant.",
    queries: [
      "new entrant first year market share benchmark B2B industrial hardware",
      "serviceable obtainable market SOM typical percentage year one startup",
    ],
  },
  {
    id: "cr3-vendors",
    feeds: ["shape.cr3"],
    intent: "Top-vendor concentration in the rack-PDU market (Vertiv / Schneider / Eaton / ABB / Legrand).",
    queries: [
      "rack PDU market share Vertiv Schneider Electric Eaton ABB Legrand",
      "PDU market competitive landscape top vendors concentration",
    ],
  },
];
