import { type FactNode, type Ledger, validateLedger } from "@/lib/schema";
import { validateSkillRefs } from "@/lib/skills";

// ─────────────────────────────────────────────────────────────────────────────
// Curated ledger — sourced via the cached Exa research pass (npm run research,
// 2026-07-06). Raw search results are checked in under research/raw/ as the
// audit trail; every evidence entry below cites a result cached there.
//
// Curation policy: values are real where a public source states them; where no
// public number exists at our scope, the value is an honest triangulated
// estimate — kind/confidence/maturity say which is which, and every node's
// derivation documents the full scope-down chain (USD→EUR @0.92, Jul 2026;
// global → Europe → CE-7). Shares are normalized to sum exactly 1.00 per
// dimension. The engine's §10 oracle lives in
// lib/__tests__/fixtures/oracleLedger.ts and is NOT affected by curation.
//
// Case: anonymized industrial entrant into the Central Europe rack-PDU market.
// CE-7 = DE, NL, PL, CH, CZ, AT + other CE (HU, RO, SK, SI, HR, BG).
// ─────────────────────────────────────────────────────────────────────────────

const AS_OF = "2026-07-06";

const rawLedger: FactNode[] = [
  // ── tamBase — the scope-down anchor / top value-of-information ─────────────
  {
    id: "tamBase",
    label: "Central Europe rack-PDU market, all segments/buyers",
    kind: "estimated",
    value: 320,
    unit: "EUR_M",
    confidence: "inferred",
    asOf: AS_OF,
    sensitivityRange: { low: 240, high: 520 },
    skillId: "tam-base-sizing",
    maturity: "single-source",
    derivation: {
      method: "Top-down scope-down from the global rack-PDU base",
      expression:
        "Global rack-PDU $2.81B (Grand View, 2025) × Europe ≈ 30% [est.; NA = 38% per same source] ≈ $843M ≈ €775M @0.92 (Jul 2026) × CE-7 = 39.8% of Europe colo MW (Statista 2025) ≈ €310M → curated €320M",
      crossCheck:
        "Europe DC PDUs+PSUs $2.45B 2024 (BIS/R&M, broader scope) × ~55% PDU share × 39.8% CE ≈ €495M — sets the high end of the band",
    },
    provenance: {
      rationale:
        "No public Europe- or CE-scoped rack-PDU figure exists; both sizing chains are scope-downs from adjacent scopes → wide band, top value-of-information.",
      promotionPath:
        "Commission the IndexBox EU Rack PDUs report (country tables) to pin the EU base directly.",
    },
    evidence: [
      {
        title: "Data Center Rack PDU Market Size | Industry Report, 2033",
        sourceType: "industry-report",
        publisher: "Grand View Research",
        date: "2025",
        url: "https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market",
        excerpt:
          "The global data center rack power distribution unit market size was estimated at USD 2.81 billion in 2025 and is projected to reach USD 5.87 billion by 2033... North America held 38.0% revenue share.",
        attached: true,
      },
      {
        title: "Europe Data Center PDUs and PSUs Market 2025–2035",
        sourceType: "industry-report",
        publisher: "Research and Markets / BIS Research",
        date: "2025",
        url: "https://www.researchandmarkets.com/reports/6108485/europe-data-center-power-distribution-units",
        excerpt:
          "The Europe data center PDUs and PSUs market is projected to reach $20.05 billion by 2035 from $2.45 billion in 2024 — a broader category (PDUs + PSUs) used as the cross-check ceiling.",
        attached: true,
      },
      {
        title: "IndexBox — Rack PDUs Market in the European Union (country tables)",
        sourceType: "pending",
        publisher: "IndexBox",
        url: "https://www.indexbox.io/store/european-union-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
        excerpt:
          "The directly-scoped EU rack-PDU report exists but its headline figure is paywalled — commissioning it would collapse the ±40% band.",
        attached: false,
      },
    ],
  },

  // ── geography shares (sum = 1.00) — colo-capacity-apportioned ──────────────
  // Primary method: per-country colocation IT power (Statista 2025, one
  // consistent table). Cross-check: installed-IT-load method (Mordor/BMWK).
  {
    id: "geo.DE",
    label: "Germany",
    kind: "estimated",
    value: 0.5,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "DE",
    sensitivityRange: { low: 0.42, high: 0.53 },
    skillId: "geo-share-triangulation",
    maturity: "triangulated",
    derivation: {
      method: "Top-down capacity apportionment",
      expression:
        "DE colo 1,737 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.503 → 0.50 (normalized)",
      crossCheck: "Installed-IT-load method (BMWK >2,700 MW ÷ CE-7 installed) → 0.42 — sets the low end",
    },
    provenance: {
      rationale: "Two independent capacity methods bracket 0.42–0.53; colo-scope figure is primary → inferred.",
      promotionPath: "Reconcile colo vs total-installed scopes with one 2025 vendor-revenue split → verified.",
    },
    evidence: [
      {
        title: "Europe colocation data center IT power supply by country, 2024–2031",
        sourceType: "industry-report",
        publisher: "Statista",
        date: "2026-02-06",
        url: "https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/",
        excerpt:
          "Germany 1,737 MW of colocation and scale-colocation IT power in 2025 — the largest CE base (NL 951, CH 274, PL 228, CZ 79, AT 68).",
        attached: true,
      },
      {
        title: "Status and development of the German data centre landscape",
        sourceType: "industry-report",
        publisher: "BMWK (Federal Ministry for Economic Affairs)",
        date: "2025-03",
        url: "https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Publikationen/Digitale-Welt/status-and-development-of-the-german-data-centre-landscape-executive-summary.pdf?__blob=publicationFile&v=2",
        excerpt:
          "With over 2,000 data centres and an installed IT power demand of over 2,700 MW, Germany is already the largest centre for digital infrastructure in Europe.",
        attached: true,
      },
    ],
  },
  {
    id: "geo.NL",
    label: "Netherlands",
    kind: "estimated",
    value: 0.28,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "NL",
    sensitivityRange: { low: 0.24, high: 0.31 },
    skillId: "geo-share-triangulation",
    maturity: "triangulated",
    derivation: {
      method: "Top-down capacity apportionment",
      expression: "NL colo 951 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.276 → 0.28 (normalized)",
      crossCheck: "Dutch Data Center Association: national colo 924 MW (2024) — consistent scale",
    },
    provenance: {
      rationale: "Statista and the national association agree within ~3% → inferred, triangulated.",
    },
    evidence: [
      {
        title: "Europe colocation data center IT power supply by country, 2024–2031",
        sourceType: "industry-report",
        publisher: "Statista",
        date: "2026-02-06",
        url: "https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/",
        excerpt: "Netherlands 951 MW of colocation and scale-colocation IT power in 2025.",
        attached: true,
      },
      {
        title: "Ten years of State of the Dutch Data Centers",
        sourceType: "industry-report",
        publisher: "Dutch Data Center Association",
        date: "2024",
        url: "https://www.dutchdatacenters.nl/en/nieuws/ten-years-of-state-of-the-dutch-data-centers-a-decade-of-growth-and-challenges/",
        excerpt:
          "In 2024, the total colocation capacity reached 924 megawatts... the Amsterdam Metropolitan Area still accounts for approximately 70% of colocation capacity.",
        attached: true,
      },
    ],
  },
  {
    id: "geo.PL",
    label: "Poland",
    kind: "estimated",
    value: 0.07,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "PL",
    sensitivityRange: { low: 0.06, high: 0.1 },
    skillId: "geo-share-triangulation",
    maturity: "single-source",
    derivation: {
      method: "Top-down capacity apportionment",
      expression: "PL colo 228 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.066 → 0.07 (normalized)",
      crossCheck: "Installed-IT-load method (Mordor 660 MW, 2025) → ~0.10 — scopes diverge, band widened",
    },
    provenance: {
      rationale: "Colo vs installed-load scopes diverge ~1.5x for the fast-growing Polish base → inferred, wide band.",
      promotionPath: "Adopt one scope (PMR commercial-DC series) across all CE countries → narrow band.",
    },
    evidence: [
      {
        title: "Europe colocation data center IT power supply by country, 2024–2031",
        sourceType: "industry-report",
        publisher: "Statista",
        date: "2026-02-06",
        url: "https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/",
        excerpt: "Poland 228 MW of colocation and scale-colocation IT power in 2025.",
        attached: true,
      },
      {
        title: "Poland Data Center Market — size & installed IT load",
        sourceType: "industry-report",
        publisher: "Mordor Intelligence",
        date: "2025",
        url: "https://www.mordorintelligence.com/industry-reports/poland-data-center-market",
        excerpt: "Base Year Market Size (2025): 660 megawatt installed IT load, growing to 998.34 MW by 2030 (7.28% CAGR).",
        attached: true,
      },
    ],
  },
  {
    id: "geo.CH",
    label: "Switzerland",
    kind: "estimated",
    value: 0.08,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "CH",
    sensitivityRange: { low: 0.07, high: 0.13 },
    skillId: "geo-share-triangulation",
    maturity: "single-source",
    derivation: {
      method: "Top-down capacity apportionment",
      expression: "CH colo 274 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.079 → 0.08 (normalized)",
      crossCheck: "Installed-base method (Mordor 850.6 MW incl. self-operated) → ~0.13 — Swiss market is self-operation-heavy",
    },
    provenance: {
      rationale: "Large self-operated share (CBRE Suisse: 340 MW commercial only) makes scope choice decisive → inferred, wide band.",
    },
    evidence: [
      {
        title: "Europe colocation data center IT power supply by country, 2024–2031",
        sourceType: "industry-report",
        publisher: "Statista",
        date: "2026-02-06",
        url: "https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/",
        excerpt: "Switzerland 274 MW of colocation and scale-colocation IT power in 2025.",
        attached: true,
      },
      {
        title: "CBRE Suisse — Swiss data-center market capacity",
        sourceType: "analyst-estimate",
        publisher: "CBRE Suisse",
        date: "2026",
        url: "https://www.europesays.com/ch-fr/205273/",
        excerpt:
          "Commercial capacity (excluding self-operated infrastructure) is 340 MW across 121 sites; ~61% (209 MW) concentrated in the Zurich region.",
        attached: true,
      },
    ],
  },
  {
    id: "geo.CZ",
    label: "Czechia",
    kind: "estimated",
    value: 0.02,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "CZ",
    skillId: "geo-share-triangulation",
    maturity: "triangulated",
    derivation: {
      method: "Top-down capacity apportionment",
      expression: "CZ colo 79 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.023 → 0.02 (normalized)",
      crossCheck: "Installed-load method (Mordor 152.67 MW) → 0.024 — methods agree",
    },
    provenance: {
      rationale: "Both capacity methods land at ~0.02 → inferred, triangulated.",
    },
    evidence: [
      {
        title: "Czechia Data Center Market — volume",
        sourceType: "industry-report",
        publisher: "Mordor Intelligence",
        date: "2025",
        url: "https://www.mordorintelligence.com/industry-reports/czechia-data-center-market",
        excerpt: "The Czechia data center market size stood at 152.67 MW in 2025 and is forecast to reach 183.47 MW by 2030.",
        attached: true,
      },
    ],
  },
  {
    id: "geo.AT",
    label: "Austria",
    kind: "estimated",
    value: 0.02,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "AT",
    skillId: "geo-share-triangulation",
    maturity: "single-source",
    derivation: {
      method: "Top-down capacity apportionment",
      expression: "AT colo 68 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.020 → 0.02 (normalized)",
      crossCheck: "Installed-base method (Mordor 207 MW) → 0.033 — scopes diverge",
    },
    provenance: {
      rationale: "Colo vs installed scopes diverge (Vienna hosts >80% of national capacity) → inferred.",
    },
    evidence: [
      {
        title: "Austria Data Center Market — volume",
        sourceType: "industry-report",
        publisher: "Mordor Intelligence",
        date: "2025",
        url: "https://www.mordorintelligence.com/industry-reports/austria-data-center-market",
        excerpt: "Base Year Market Size (2025): 207 megawatt installed base, reaching 342.54 MW by 2031 (8.94% CAGR).",
        attached: true,
      },
    ],
  },
  {
    id: "geo.other",
    label: "Other CE",
    kind: "estimated",
    value: 0.03,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "geography",
    dimensionValue: "other",
    skillId: "geo-share-triangulation",
    maturity: "needs-source",
    derivation: {
      method: "Residual bucket",
      expression:
        "HU 18 + RO 27 + SK 14 + SI 6 + HR 17 + BG 32 = 114 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.033 → 0.03 (residual, normalized)",
    },
    provenance: {
      rationale: "Sum of small itemised markets from one source; fast CEE growth (Romania +40% of upcoming CEE capacity) adds uncertainty.",
      promotionPath: "Break out RO/HU explicitly once either exceeds ~5% of the CE base.",
    },
    evidence: [
      {
        title: "Europe colocation data center IT power supply by country, 2024–2031",
        sourceType: "industry-report",
        publisher: "Statista",
        date: "2026-02-06",
        url: "https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/",
        excerpt: "Hungary 18, Romania 27, Slovakia 14, Slovenia 6, Croatia 17, Bulgaria 32 MW of colocation IT power in 2025.",
        attached: true,
      },
    ],
  },

  // ── segment (application) shares (sum = 1.00) ──────────────────────────────
  // Anchored on Synergy Research's global capacity split (hyperscale 48 / colo
  // 20 / on-prem 32, end-2025), rescaled ×0.91 to carve out edge + telecom,
  // which have no public share-of-total figures.
  {
    id: "seg.hyperscale",
    label: "Hyperscale",
    kind: "estimated",
    value: 0.44,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "segment",
    dimensionValue: "hyperscale",
    sensitivityRange: { low: 0.4, high: 0.48 },
    skillId: "segment-decomposition",
    maturity: "triangulated",
    derivation: {
      method: "Capacity-split rescaling",
      expression: "Synergy end-2025 hyperscale 48% × 0.91 (edge+telecom carve-out) = 0.44",
      crossCheck: "Synergy Q1-2025 vintage: 44% — brackets the band",
    },
    provenance: {
      rationale: "Multiple Synergy vintages (41→48% through 2025) agree on trajectory; global split applied to CE → inferred.",
      promotionPath: "Replace with a Europe-scoped capacity split when CBRE/Synergy publish one.",
    },
    evidence: [
      {
        title: "Hyperscale operators to account for 67% of all data center capacity by 2031",
        sourceType: "industry-report",
        publisher: "Synergy Research Group",
        date: "2026",
        url: "https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031",
        excerpt:
          "They now account for 48% of the worldwide capacity of all data centers... non-hyperscale colocation capacity accounting for another 20%... leaves enterprise on-premise data centers with just 32%.",
        attached: true,
      },
      {
        title: "Hyperscale operators and colocation continue to drive huge changes",
        sourceType: "industry-report",
        publisher: "Synergy Research Group",
        date: "2025-06-24",
        url: "https://www.srgresearch.com/articles/hyperscale-operators-and-colocation-continue-to-drive-huge-changes-in-data-center-capacity-trends",
        excerpt: "They now account for 44% of the worldwide capacity of all data centers (Q1 2025 vintage).",
        attached: true,
      },
    ],
  },
  {
    id: "seg.colocation",
    label: "Colocation",
    kind: "estimated",
    value: 0.18,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "segment",
    dimensionValue: "colocation",
    skillId: "segment-decomposition",
    maturity: "single-source",
    derivation: {
      method: "Capacity-split rescaling",
      expression: "Synergy end-2025 non-hyperscale colocation 20% × 0.91 = 0.18",
    },
    provenance: {
      rationale: "Single publisher's capacity series (20–22% across vintages), global scope applied to CE → inferred.",
    },
    evidence: [
      {
        title: "Hyperscale operators to account for 67% of all data center capacity by 2031",
        sourceType: "industry-report",
        publisher: "Synergy Research Group",
        date: "2026",
        url: "https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031",
        excerpt: "Non-hyperscale colocation capacity accounting for another 20% of total capacity (end-2025).",
        attached: true,
      },
    ],
  },
  {
    id: "seg.enterprise",
    label: "Enterprise",
    kind: "estimated",
    value: 0.29,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "segment",
    dimensionValue: "enterprise",
    skillId: "segment-decomposition",
    maturity: "single-source",
    derivation: {
      method: "Capacity-split rescaling",
      expression: "Synergy end-2025 enterprise on-premise 32% × 0.91 = 0.29",
    },
    provenance: {
      rationale: "Single publisher's series (declining 37→32% through 2025); on-prem PDU refresh demand may lag capacity share → inferred.",
    },
    evidence: [
      {
        title: "Hyperscale operators to account for 67% of all data center capacity by 2031",
        sourceType: "industry-report",
        publisher: "Synergy Research Group",
        date: "2026",
        url: "https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031",
        excerpt:
          "That leaves enterprise on-premise data centers with just 32% of the total — down from 56% in 2018, heading to 19% by 2031.",
        attached: true,
      },
    ],
  },
  {
    id: "seg.edge",
    label: "Edge",
    kind: "estimated",
    value: 0.05,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "segment",
    dimensionValue: "edge",
    sensitivityRange: { low: 0.03, high: 0.08 },
    skillId: "segment-decomposition",
    maturity: "needs-source",
    derivation: {
      method: "Carve-out estimate",
      expression:
        "No public edge-share-of-total figure; edge market ≈ $12–19B absolute (GVR/Mordor 2024-25) vs total DC market → ~5% carve-out",
    },
    provenance: {
      rationale: "Edge is sized in absolute $ only (never as % of total DC) across all cached sources → widest relative band.",
      promotionPath: "Derive edge share from a single-source pair (edge $ ÷ total DC $) at matching vintages.",
    },
    evidence: [
      {
        title: "Edge Data Center Market Size | Industry Report",
        sourceType: "analyst-estimate",
        publisher: "Grand View Research",
        date: "2024",
        url: "https://www.grandviewresearch.com/industry-analysis/edge-data-center-market-report",
        excerpt: "Edge data center market sized at $12.36B (2024) in absolute terms — no share-of-total-DC figure published.",
        attached: true,
      },
    ],
  },
  {
    id: "seg.telecom",
    label: "Telecom",
    kind: "estimated",
    value: 0.04,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "segment",
    dimensionValue: "telecom",
    skillId: "segment-decomposition",
    maturity: "needs-source",
    derivation: {
      method: "Carve-out estimate",
      expression:
        "No clean telecom share exists (FMI's 34.6% conflates IT & telecom on the power sub-market); telecom central-office PDU demand estimated at ~4% carve-out",
    },
    provenance: {
      rationale: "Smallest segment; the only cached figure conflates IT with telecom → estimate pending a clean split.",
      promotionPath: "Source a telecom-only share from an operator-capex breakdown.",
    },
    evidence: [
      {
        title: "Telecom power systems market context",
        sourceType: "analyst-estimate",
        publisher: "Dataintelo",
        date: "2025",
        url: "https://dataintelo.com/report/telecom-power-systems-market",
        excerpt: "Telecom power infrastructure sized separately from data-center power; no telecom-share-of-DC-market figure published.",
        attached: true,
      },
    ],
  },

  // ── customer-type (buyer profile) shares (sum = 1.00) ──────────────────────
  // No public channel-mix percentages exist for DC power equipment (confirmed
  // across the cached channel-structure sources) — these are internal estimates
  // from qualitative channel structure, flagged needs-source until interviews.
  {
    id: "cust.operator-large",
    label: "Large operators",
    kind: "estimated",
    value: 0.4,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "customerType",
    dimensionValue: "operator-large",
    sensitivityRange: { low: 0.33, high: 0.47 },
    skillId: "buyer-mix-survey",
    maturity: "needs-source",
    derivation: {
      method: "Qualitative channel triangulation",
      expression:
        "Hyperscale+colo ≈ 62% of capacity (Synergy) and large operators buy direct → dominant buyer ≈ 0.40 of PDU spend",
    },
    provenance: {
      rationale: "Report segmentations name the channels (direct/OEM/distributor) but publish no percentages → internal estimate.",
      promotionPath: "Validate buyer mix with 3 CE operator/distributor interviews.",
    },
    evidence: [
      {
        title: "Data center growth driving power equipment sales",
        sourceType: "analyst-estimate",
        publisher: "Alexander Group",
        date: "2026-06-19",
        url: "https://www.alexandergroup.com/",
        excerpt:
          "One leading supplier reported data centers as its biggest growth driver, accounting for 30% of orders in 2025 — qualitative channel context only.",
        attached: true,
      },
      {
        title: "CE operator & distributor interviews",
        sourceType: "pending",
        excerpt: "Three structured interviews would replace this qualitative split with a sourced one.",
        attached: false,
      },
    ],
  },
  {
    id: "cust.operator-mid",
    label: "Mid / enterprise",
    kind: "estimated",
    value: 0.25,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "customerType",
    dimensionValue: "operator-mid",
    skillId: "buyer-mix-survey",
    maturity: "needs-source",
    provenance: {
      rationale: "Mirrors the enterprise capacity share (Synergy 32% × partial direct purchasing); no public channel split → internal estimate.",
      promotionPath: "Validate buyer mix with 3 CE operator/distributor interviews.",
    },
  },
  {
    id: "cust.oem",
    label: "OEM / integrator",
    kind: "estimated",
    value: 0.22,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "customerType",
    dimensionValue: "oem-integrator",
    skillId: "buyer-mix-survey",
    maturity: "needs-source",
    provenance: {
      rationale: "OEM/ODM white-label supply is well documented qualitatively (rack-integrator channel) but unquantified → internal estimate.",
      promotionPath: "Validate buyer mix with 3 CE operator/distributor interviews.",
    },
  },
  {
    id: "cust.distributor",
    label: "Distributor",
    kind: "estimated",
    value: 0.13,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    dimension: "customerType",
    dimensionValue: "distributor",
    skillId: "buyer-mix-survey",
    maturity: "needs-source",
    provenance: {
      rationale: "Master-distributor models exist (documented qualitatively) but indirect share is unquantified → internal estimate.",
      promotionPath: "Validate buyer mix with 3 CE operator/distributor interviews.",
    },
  },

  // ── funnel factors (assumption leaves — assumption levers) ─────────────────
  {
    id: "serviceableFactor",
    label: "Serviceable share of TAM",
    kind: "assumption",
    value: 0.55,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    source: { note: "channel + regulatory reach" },
    sensitivityRange: { low: 0.45, high: 0.65 },
    skillId: "serviceability-model",
    maturity: "needs-source",
    derivation: {
      method: "Reachability assumption",
      expression:
        "No public SAM/TAM benchmark for B2B hardware exists; EU cert stack (EN 50600, ecodesign 2019/424, CE/TÜV) justifies < 1.0 but doesn't quantify 0.55",
    },
    provenance: {
      rationale: "Assumption leaf — channel + regulatory reach; EU certification barriers documented qualitatively only.",
      promotionPath: "Bottom-up channel-coverage model (named accounts × reachable share) → sourced serviceable %.",
    },
    evidence: [
      {
        title: "EU ecodesign requirements for servers and data storage (2019/424)",
        sourceType: "industry-report",
        publisher: "EUR-Lex",
        date: "2019",
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A02019R0424-20210501",
        excerpt:
          "EU ecodesign and certification requirements gate which demand is regulatory-clear for a new entrant — the qualitative basis of the serviceable haircut.",
        attached: true,
      },
    ],
  },
  {
    id: "obtainableFactor",
    label: "Year-1 obtainable share of SAM",
    kind: "assumption",
    value: 0.03,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    source: { note: "year-1 win-rate × ramp × capacity" },
    sensitivityRange: { low: 0.01, high: 0.05 },
    skillId: "year1-obtainable-model",
    maturity: "triangulated",
    derivation: {
      method: "Benchmark anchoring",
      expression:
        "Year-1 SOM benchmarks: 1% of SAM (Prospeo); early-stage range 1–5% (IdeaPlan) → curated 3% mid-band",
      crossCheck: "Prior 6% assumption sat above every year-1 benchmark found — revised down",
    },
    provenance: {
      rationale: "Two independent benchmark sources agree on 1–5%, but both are generic (not DC-hardware-specific) → inferred.",
      promotionPath: "Replace with pipeline-based model once first CE deals close (win-rate × cycle time × capacity).",
    },
    evidence: [
      {
        title: "Addressable markets — SOM benchmarks",
        sourceType: "analyst-estimate",
        publisher: "Prospeo",
        url: "https://prospeo.io/s/addressable-markets",
        excerpt:
          "SOM benchmarks that won't get you laughed out of the room: 1% of SAM in Year 1, 3% in Year 2, 5% in Year 3.",
        attached: true,
      },
      {
        title: "Serviceable Obtainable Market (SOM) — early-stage ranges",
        sourceType: "analyst-estimate",
        publisher: "IdeaPlan",
        date: "2024",
        url: "https://www.ideaplan.io/glossary/serviceable-obtainable-market-som",
        excerpt:
          "For early-stage companies, SOM is typically 1-5% of SAM. For growing companies with product-market fit, SOM can reach 10-20% of SAM.",
        attached: true,
      },
    ],
  },

  // ── shape (display + risk) ─────────────────────────────────────────────────
  {
    id: "shape.cagr",
    label: "Market CAGR (2025–2030)",
    kind: "estimated",
    value: 0.09,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    skillId: "cagr-projection",
    maturity: "triangulated",
    derivation: {
      method: "Cross-source consensus",
      expression:
        "Global rack-PDU: 9.7% (GVR 2026-33), 8.96% (Mordor 2026-31); EU rack panels 5–8%, Eastern Europe 9–12% (IndexBox) → consensus 9%",
    },
    provenance: {
      rationale: "Three independent publishers bracket 8–10% for rack-PDU; CE mixes slower EU + faster CEE growth → inferred.",
    },
    evidence: [
      {
        title: "Data Center Rack PDU Market — growth forecast",
        sourceType: "industry-report",
        publisher: "Grand View Research",
        date: "2025",
        url: "https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market",
        excerpt: "Growing at a CAGR of 9.7% from 2026 to 2033.",
        attached: true,
      },
      {
        title: "Data Center Rack PDU Market — size & share analysis",
        sourceType: "industry-report",
        publisher: "Mordor Intelligence",
        date: "2025",
        url: "https://www.mordorintelligence.com/industry-reports/data-center-rack-pdu-market",
        excerpt: "Reach USD 4.62 billion by 2031, growing at a CAGR of 8.96% over 2026-2031.",
        attached: true,
      },
      {
        title: "Eastern Europe Rack Power Distribution Panels — growth",
        sourceType: "industry-report",
        publisher: "IndexBox",
        date: "2026",
        url: "https://www.indexbox.io/store/eastern-europe-rack-power-distribution-panels-market-analysis-forecast-size-trends-and-insights/",
        excerpt:
          "Expanding at a compound annual rate of 9–12% between 2026 and 2035, driven by rapid data centre construction in Poland, Romania, and the Baltic states.",
        attached: true,
      },
    ],
  },
  {
    id: "shape.cr3",
    label: "Top-3 supplier concentration",
    kind: "estimated",
    value: 0.55,
    unit: "ratio",
    confidence: "inferred",
    asOf: AS_OF,
    skillId: "competitor-concentration",
    maturity: "needs-source",
    derivation: {
      method: "Leader-share extrapolation",
      expression:
        "Only hard datapoint: #1 vendor (APC/Schneider) at 15.8%; top-3 identities consistent (Schneider, Vertiv, Eaton); 'medium/semi-consolidated' concentration → CR3 ≈ 0.55 (est. 0.45–0.65)",
    },
    provenance: {
      rationale: "No published CR3 for rack-PDU; concentration described only qualitatively across all cached sources → estimate.",
      promotionPath: "Obtain the Omdia rack-PDU vendor-share table (2024 base) for a sourced CR3.",
    },
    evidence: [
      {
        title: "Data Center Rack PDU Market — competitive landscape",
        sourceType: "analyst-estimate",
        publisher: "Dataintelo",
        date: "2025",
        url: "https://dataintelo.com/report/data-center-rack-power-distribution-unit-pdu-market",
        excerpt: "APC by Schneider Electric led competitive landscape with 15.8% market share.",
        attached: true,
      },
      {
        title: "Data Center Rack PDU Market — key players",
        sourceType: "industry-report",
        publisher: "Mordor Intelligence",
        date: "2025",
        url: "https://www.mordorintelligence.com/industry-reports/data-center-rack-pdu-market/companies",
        excerpt:
          "Key players: Schneider Electric SE, Vertiv Group Corp., Eaton Corporation plc, ABB Ltd, Legrand SA. Market concentration: Medium.",
        attached: true,
      },
      {
        title: "Omdia rack-PDU vendor share table",
        sourceType: "pending",
        excerpt: "A vendor-share table (2024 base) would replace this extrapolation with a sourced CR3.",
        attached: false,
      },
    ],
  },
];

// Validated at module load — a malformed ledger throws here, at boot.
export const ledger: Ledger = validateLedger(rawLedger);

// Every skillId on a node must resolve to a real skill — throws at boot on a typo.
validateSkillRefs(ledger);
