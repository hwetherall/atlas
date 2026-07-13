// ─────────────────────────────────────────────────────────────────────────────
// Next Steps research plan — query groups per memo (nextsteps.md §6).
//
// Each group is one cached artifact under research/raw/nextsteps/<id>.json.
// engine: "exa" (search, slim results) | "perplexity" (cited synthesis).
// Groups are added memo-by-memo as each memo enters authoring; the runner
// only executes groups not yet cached (--only= / --force to override).
// ─────────────────────────────────────────────────────────────────────────────

export const NEXTSTEPS_PLAN = [
  // ── delphi — buy-information memo (risk.definition-scopedown.band-top-contaminated-comparator)
  // Goal: a real sourcing table — purchasable reports/datasets that pin the EU
  // rack-PDU base (tamBase), with vendor, scope, price, delivery.
  {
    id: "delphi-indexbox",
    memo: "delphi",
    engine: "exa",
    query:
      "IndexBox 'EU Rack PDUs' OR 'Europe rack PDU' market report price single user license",
  },
  {
    id: "delphi-mordor",
    memo: "delphi",
    engine: "exa",
    query:
      "Mordor Intelligence data center rack PDU market report 2026 license price",
  },
  {
    id: "delphi-grandview",
    memo: "delphi",
    engine: "exa",
    query:
      "Grand View Research rack power distribution unit PDU market report price single user",
  },
  {
    id: "delphi-omdia-delloro",
    memo: "delphi",
    engine: "exa",
    query:
      "Omdia OR Dell'Oro rack PDU data center power distribution market share report subscription",
  },
  {
    id: "delphi-price-synthesis",
    memo: "delphi",
    engine: "perplexity",
    query:
      "Which purchasable market research reports cover the European or global data-center rack PDU (power distribution unit) market as of 2026? For each: publisher, exact report title, listed single-user license price in USD or EUR, geographic scope (global / Europe / Germany), whether it breaks out intelligent vs basic PDUs, and publication date. Include IndexBox, Mordor Intelligence, Grand View Research, MarketsandMarkets, and any Omdia or Dell'Oro coverage. Only reports that can actually be bought today; cite the store pages.",
  },
];
