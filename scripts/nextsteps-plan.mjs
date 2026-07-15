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

  // ── act (Julius) — new Act memo (risk.execution-window.firmware-security-audit-gate)
  // Goal: ground the initiative charter — what operator security prequalification
  // actually requires, how long it takes, what the audit artifacts cost to build,
  // and whether mid-market buyers gate the same way (the sequencing workstream).
  {
    id: "act-operator-prequal",
    memo: "act",
    engine: "exa",
    query:
      "Equinix OR 'Digital Realty' OR NTT data center supplier vendor security qualification onboarding requirements networked hardware firmware",
  },
  {
    id: "act-prequal-synthesis",
    memo: "act",
    engine: "perplexity",
    query:
      "How do large data-center operators (Equinix, Digital Realty, NTT, Vantage) security-qualify vendors of networked electrical hardware (intelligent rack PDUs, metering, DCIM-connected devices) before purchase as of 2026? Specifically: what the vendor security assessment covers (firmware signing, SBOM, vulnerability disclosure / PSIRT, penetration test reports, IEC 62443 or ISO 27001 attestations), whether each operator runs its own assessment or accepts shared schemes, how long the process typically takes from first contact to approved-vendor status, and whether it must complete before a vendor can respond to an RFQ. Cite operator supplier/procurement pages and credible industry sources.",
  },
  {
    id: "act-artifact-costs",
    memo: "act",
    engine: "perplexity",
    query:
      "For a small industrial electronics manufacturer (~50-200 employees) selling networked devices, what does it cost and how long does it take in 2026 to stand up the security artifacts enterprise buyers demand: IEC 62443-4-1 certification of the development lifecycle, a signed-firmware / secure-boot release pipeline, an SBOM generation process, and a public PSIRT / coordinated vulnerability disclosure program? Give cost ranges in EUR or USD and typical durations in months for each, citing certification bodies (TÜV, exida, UL), tooling vendors, and industry benchmarks.",
  },
  {
    id: "act-midmarket-gating",
    memo: "act",
    engine: "exa",
    query:
      "mid-market colocation enterprise data center procurement vendor security assessment requirements networked PDU rack power purchase",
  },

  // ── egeria (expert memo, risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window)
  // Goal: ground the fictional expert profile + plausible alternates in the real
  // CRA conformity-assessment landscape (profiles stay fictional, nextsteps.md §8).
  {
    id: "egeria-assessor-landscape",
    memo: "egeria",
    engine: "exa",
    query:
      "EU Cyber Resilience Act notified body conformity assessment landscape 2026 harmonised standards CEN CENELEC JTC 13 products with digital elements",
  },
  {
    id: "egeria-cra-synthesis",
    memo: "egeria",
    engine: "perplexity",
    query:
      "As of mid-2026, who are the recognized experts and what are the institutions a hardware manufacturer would consult on EU Cyber Resilience Act (CRA) conformity for a networked electrical device (intelligent rack PDU): which notified bodies and certification firms (TÜV, Bureau Veritas, DEKRA, etc.) are building CRA conformity-assessment practices, what role CEN/CENELEC JTC 13 harmonised standards play and their expected timelines, how 'important product' classification is determined, and what a typical CRA readiness consultant's background looks like (standards-committee membership, notified-body experience, product security engineering). Cite official EU sources and the firms' own pages.",
  },
];
