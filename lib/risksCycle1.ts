import { ledgerRev1 as ledger } from "@/lib/ledgerRev1";
import { validateRisks, type Risk } from "@/lib/riskSchema";

// ─────────────────────────────────────────────────────────────────────────────
// FROZEN SNAPSHOT — the CYCLE-1 register (pre-refinement), rendered by
// scripts/risks-curate.mjs --cycle1 from risks/cycle1.json (reconstructed; see
// scripts/risks-cycle1-reconstruct.mts). The demo's "before" register — never curate.
// generation pass (npm run risks, 2026-07-08, ledger rev 2428e977).
//
// Raw drafts, LLM transcripts, Exa evidence and the kill-log live under
// risks/ — the audit trail every entry below cites. Every € impact is
// COMPUTED from the risk's perturbation ops by lib/riskCompute.ts; nothing
// numeric here is an LLM assertion.
//
// Curation policy:
// - All 27 judge survivors kept (blind rubric + kill thresholds in
//   scripts/risks-plan.mjs; kills/merges recorded in risks/killlog.json).
// - Tier: fact | model-structure | boundary → "rock" (attacks the model's own
//   construction); competitive | execution | exogenous → "front-of-mind".
// - Order = expected YAM loss (p × |ΔYAM|) vs the baseline scenario, desc.
// ─────────────────────────────────────────────────────────────────────────────

const rawRisks: Risk[] = [
  // ◆ rock · lens: execution-window · judge 18/20 · E[ΔYAM] −€2.53M · engine ΔYAM −€4.22M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.som-window-semantics-mismatch.json
  {
    "id": "risk.execution-window.som-window-semantics-mismatch",
    "title": "Year-1 market share is set by a 3-5 year benchmark, too high",
    "narrative": "The model says the venture wins 3% of its serviceable market in Year 1. But the benchmarks behind that 3% describe what companies capture over 1 to 5 years, and the one real comparable entrant, Tractian, started at about 0.1% of its market. Read at a 12-month grain, the Year-1 number is roughly 5 times too high.",
    "category": "model-structure",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "The 3% benchmark describes 1 to 5 year windows, not 12 months → Real first-year shares fall to 0.1%, far below the 1% floor → A 3% rate overstates Year-1 revenue by about 5 times",
    "whyMissable": "The number was already cut from 6% to 3% and labelled well-sourced, so it looks conservative, but the real flaw is the mismatched time window no sensitivity band shows.",
    "falsifier": "Any named comparable industrial B2B entrant with documented first-year revenue at or above 1% of its stated market.",
    "likelihood": {
      "value": 0.6,
      "basis": "evidence",
      "rationale": "Every source measuring a real first year, including Tractian, sits far below 1%, and no sector-specific Year-1 benchmark supports 3%. AI-driven demand growth could lift new-entrant win rates above these analogues."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.006,
        "note": "Year-1 obtainable re-anchored on first-period analogues rather than multi-year SOM heuristics"
      }
    ],
    "indicators": [
      {
        "signal": "Months from launch to first paid PO for new rack-power/DC-hardware entrants in EMEA",
        "where": "Press releases and case studies of recent PDU/rack-power market entrants; Data Centre Dynamics vendor-launch coverage",
        "threshold": ">9 months median to first PO",
        "updates": "increases"
      },
      {
        "signal": "Time for a new vendor to appear on CE electrical-distributor line cards after launch",
        "where": "Rexel, Sonepar and regional CE distributor published line cards / new-vendor announcements",
        "threshold": ">2 quarters to first listing",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Replace the percentage heuristic with a capacity-based bottom-up model (named accounts × win rate × sales-cycle length × deployment capacity) before committing the Year-1 plan",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Prospeo itself recommends this over the percentage heuristic; the digests confirm no one has instantiated it for DC hardware"
      },
      {
        "action": "Structure Year-1 targets and cash plan around a 0.5–1% obtainable case, treating 3% as upside rather than base",
        "type": "operational",
        "note": "Prevents the ramp-dependent hiring and inventory commitments that make an overstated YAM fatal rather than embarrassing"
      }
    ],
    "evidence": [
      {
        "title": "Calculating market size with TAM, SAM and SOM for startups",
        "sourceType": "industry-report",
        "publisher": "Wise",
        "date": "2026-01-21",
        "excerpt": "Serviceable Obtainable Market (SOM): The realistic share of SAM you expect to capture in the next three to five years, accounting for competition and your execution capacity.",
        "url": "https://wise.com/gb/blog/tam-sam-vs-som",
        "attached": true
      },
      {
        "title": "Tractian: How Two Sons of Factory Engineers Built a $32M Business",
        "sourceType": "triangulation",
        "publisher": "Solopreneur",
        "date": "2026-05-30",
        "excerpt": "The company grew from $200K to $32M in revenue over four years and serves more than 1,000 plants... Market $14.9 млрд.",
        "url": "https://solopreneuro.com/en/ideas/tractian-maintenance-ai",
        "attached": true
      },
      {
        "title": "What is SOM? | Angel Investors Network Glossary",
        "sourceType": "industry-report",
        "publisher": "Angel Investors Network",
        "excerpt": "the portion of the Serviceable Addressable Market that a company can realistically capture within a specific timeframe, typically 3-5 years",
        "url": "https://angelinvestorsnetwork.com/glossary/serviceable-obtainable-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The ledger's own cited source (Prospeo) states 1% of SAM in Year 1, 3% in Year 2, 5% in Year 3 — a static, verifiable definitional fact. Reading the existing benchmark documents settles whether 3% is a Year-1 or Year-2/3 figure today; no future event is needed.",
    "proposedCorrection": {
      "nodeId": "obtainableFactor",
      "value": 0.01,
      "low": 0.001,
      "high": 0.03,
      "rationale": "The cited Prospeo benchmark explicitly assigns 1% to Year 1 (3% is the Year-2 figure), and the one real comparable entrant (Tractian) started near 0.1%, so the Year-1 share should anchor at ~1% with a band spanning the observed 0.1% low to the 3% ceiling."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 17/20 · E[ΔYAM] −€2.42M · engine ΔYAM −€4.40M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.bundling-eliminates-bakeoffs-year1.json
  {
    "id": "risk.competitive-foreclosure.bundling-eliminates-bakeoffs-year1",
    "title": "Rivals bundle PDUs, so the head-to-head bake-off rarely happens",
    "narrative": "The model assumes the venture wins 3% of its market in Year 1 because buyers run a fair PDU contest it can enter. But the biggest datapoint we found, a real hardware entrant, started near 0.001% of its market, far below the assumed band. If most growth is sold inside vendor bundles with no separate contest, the Year-1 number is several times too high.",
    "category": "competitive",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Big vendors sell PDUs inside larger integrated packages at near-zero margin → New builds buy bundled, so standalone contests exist mainly in retrofits → Limited to standalone contests, real Year-1 pace cuts the number by five-sixths",
    "whyMissable": "The 3% looks safe because it was already cut from 6% and sits between two cited benchmarks, but both benchmarks are generic startup rules that never ask how often a standalone PDU contest occurs.",
    "falsifier": "In the first two quarters, at least two operator opportunities reach a standalone PDU bake-off, or a bottom-up pipeline model independently supports 3% of the market within 12 months.",
    "likelihood": {
      "value": 0.55,
      "basis": "evidence",
      "rationale": "Every concrete Year-1 datapoint sits far below the 1–5% band and bundle-selling is standard, but standalone tenders do still appear. These offset, so likelihood holds at 0.55."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.005,
        "note": "Year-1 pace re-anchored to observed hardware-entrant base rates on the standalone-evaluation slice, not the generic 1–5% heuristic"
      }
    ],
    "indicators": [
      {
        "signal": "Fraction of addressable Year-1 opportunities where rack PDUs are specified standalone vs inside an integrated fit-out package",
        "where": "CE colo/enterprise fit-out tender documents and the venture's CRM opportunity coding",
        "threshold": "<30% of qualified opportunities are standalone PDU purchases",
        "updates": "increases"
      },
      {
        "signal": "Incumbent commentary on integrated-solution attach rates and rack-system bundling",
        "where": "Vertiv and Schneider quarterly earnings calls; product-launch materials for integrated rack/power-train offerings",
        "threshold": "Explicit strategy statements on selling rack power as part of integrated systems, with PDUs positioned as an attach line",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Replace the percentage heuristic with a capacity model built from the first 90 days of CE outreach: standalone-RFQ density × win rate × cycle time × fulfillment capacity",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "The corpus explicitly recommends this method over percentage heuristics; 90 days of pipeline data converts the node from folklore to measurement"
      },
      {
        "action": "Target retrofit and replacement RFQs — where PDUs are bought standalone and bundle pricing has no leverage — as the entire Year-1 focus",
        "type": "operational"
      },
      {
        "action": "Get spec'd as the named alternate PDU in integrator and consulting-engineer BOM templates, so bundled deals carry an entry point",
        "type": "strategic"
      }
    ],
    "evidence": [
      {
        "title": "Vertiv 360AI High Density Reference Design #026",
        "sourceType": "industry-report",
        "publisher": "Vertiv",
        "excerpt": "Room/Row PDU 600kVA PDU, 4 per POD; UPS for IT 1200kVA UPS, 4 per both PODs; Busway 400A busway, 8 per POD — PDU specified as one embedded line inside an integrated AI power+cooling package.",
        "url": "https://www.vertiv.com/48ea2a/globalassets/documents/brochures/vertiv-360ai-reference-design-026.pdf",
        "attached": true
      },
      {
        "title": "EcoStruxure Reference Design 48 — Modular Data Center All-in-One AI Solution",
        "sourceType": "industry-report",
        "publisher": "Schneider Electric",
        "excerpt": "High-performance power system that integrates switchboard, UPS with Li-Ion battery cabinets, PDUs... featuring Galaxy VXL UPS and NetShelter Advanced Rack and PDUs — PDUs bundled within the integrated fit-out.",
        "url": "https://download.schneider-electric.com/files?p_Doc_Ref=RD48DSR0_EN&p_File_Name=Modular+Data+Center+AI+Reference+Design+EU+FINAL.pdf&p_enDocType=Application+Notes",
        "attached": true
      },
      {
        "title": "Bid Results on Enlogic Power Distribution Units (University of Utah)",
        "sourceType": "triangulation",
        "publisher": "UtahBids",
        "date": "2025-06-05",
        "excerpt": "University seeking a supplier to provide a specific make and model of server rack PDUs — a real standalone PDU procurement, showing bake-offs do occur outside bundles, mostly in enterprise/retrofit sockets.",
        "url": "https://www.utahbids.net/bid-result/enlogic_power_distribution_units-14182081",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "No purchasable report or dataset says what fraction of THIS venture's addressable Year-1 flow arrives bundled vs. as a standalone contest — tender records prove bake-offs exist, but the bundled share of the venture's own pipeline only reveals itself deal by deal through the first selling year. Until then the right response is to watch the standalone-RFQ density indicator and steer the plan toward retrofit sockets, not to re-research the number.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: structure-independence · judge 17/20 · E[ΔYAM] −€2.32M · engine ΔYAM −€3.87M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.year1-obtainable-correlated-with-slowest-cell.json
  {
    "id": "risk.structure-independence.year1-obtainable-correlated-with-slowest-cell",
    "title": "Selling to slow large operators cuts Year-1 capture tenfold",
    "narrative": "The model says the venture wins 3% of its serviceable market in Year 1, spread evenly across buyers. But the venture has chosen to focus Year 1 on large operators, the slowest buyers, whose qualification cycle runs longer than the 12-month horizon. Comparable hardware entrants started near 0.001% of the market in their first year. That points to a Year-1 revenue number roughly ten times too high.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Year-1 plan targets large operators held by incumbents with qualification gates → The 3% rests on generic SOM benchmarks ignoring these buyers' cycle length → Focused on the slowest buyers, Year-1 revenue is overstated tenfold",
    "whyMissable": "The factor was already cut from 6% to 3%, so the assumption looks double-checked, but that revision never addressed how the buyer choice slows the pace.",
    "falsifier": "A documented case of a new rack-PDU or comparable hardware entrant closing 3% of a regional market within 12 months selling direct to large operators, or the venture's first order completing in under 6 months.",
    "likelihood": {
      "value": 0.6,
      "basis": "evidence",
      "rationale": "Independent benchmarks show multi-year capture windows and hardware entrants near 0.001% of market, plus documented incumbent lock at large accounts, all pointing below the 1% floor for this buyer strategy. Benchmarks treating 3% as a Year-2 figure slightly recalibrate the framing but leave the prior 0.6 unchanged."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.008,
        "note": "Year-1 capture when pipeline is concentrated in qualification-gated large accounts; below the model's 0.01 band floor"
      }
    ],
    "indicators": [
      {
        "signal": "Elapsed time and stage-gates in the venture's first large-operator qualification processes",
        "where": "Own CRM pipeline plus operator supplier-registration portals (Equinix/DLR vendor onboarding)",
        "threshold": "First qualification not complete within 6 months of launch",
        "updates": "increases"
      },
      {
        "signal": "DC fit-out and framework tender award cycles for rack power in CE",
        "where": "TED (tenders.europa.eu) award notices vs publication dates for data-centre electrical packages",
        "threshold": "Median publication-to-award >9 months",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Interview three CE operators on PDU vendor-qualification timelines and pilot-to-PO conversion, and rebuild obtainableFactor as win-rate × cycle-time × capacity per buyer cell",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "The node's own promotion path, executed before launch rather than after"
      },
      {
        "action": "Route Year-1 revenue through distributor and OEM cells in parallel so first-year cash is decorrelated from large-account qualification cycles",
        "type": "strategic",
        "note": "Master-distributor and white-label channels are documented and faster-cycle"
      }
    ],
    "evidence": [
      {
        "title": "NVIDIA Supply Chain Certification",
        "sourceType": "industry-report",
        "publisher": "Grokipedia",
        "excerpt": "Central to this certification framework are the Recommended Vendor List (RVL) and Approved Vendor List (AVL), which serve as key tools for validating and qualifying vendors for specific hardware components, such as cooling distribution units (CDUs)",
        "url": "https://grokipedia.com/page/NVIDIA_Supply_Chain_Certification",
        "attached": true
      },
      {
        "title": "Addressable Markets: TAM, SAM & SOM Guide (2026)",
        "sourceType": "industry-report",
        "publisher": "Prospeo",
        "excerpt": "SOM benchmarks that won't get you laughed out of the room: 1% of SAM in Year 1, 3% in Year 2, 5% in Year 3.",
        "url": "https://prospeo.io/s/addressable-markets",
        "attached": true
      },
      {
        "title": "How to Calculate SOM Step-by-Step Guide",
        "sourceType": "industry-report",
        "publisher": "Profitjets",
        "date": "2026-04-03",
        "excerpt": "the number changes when your hiring plan, pipeline creation, win rate, deal size, or sales cycle changes",
        "url": "https://profitjets.com/blog/how-to-calculate-som/",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "The venture's actual sales cycle documentation for large-operator qualification (AVL/RVL gating timelines) plus a benchmark dataset of first-year market capture for comparable DC-hardware entrants selling direct to large operators — all knowable today, not dependent on future market unfolding.",
    "proposedCorrection": {
      "nodeId": "obtainableFactor",
      "value": 0.005,
      "low": 0.001,
      "high": 0.01,
      "rationale": "Generic SOM benchmarks (1–5%) ignore that large-operator qualification cycles (NVIDIA AVL/RVL) exceed the 12-month horizon; a hardware-specific Year-1 capture for the slowest buyers is closer to 0.1–1%, so the 3% mid-band should be revised down ~5–10x."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: base-rate-analogy · judge 17/20 · E[ΔYAM] −€1.94M · engine ΔYAM −€3.52M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.base-rate-analogy.fragmented-incumbency-price-response.json
  {
    "id": "risk.base-rate-analogy.fragmented-incumbency-price-response",
    "title": "Many scaled rivals plus import price floor push Year-1 share to floor",
    "narrative": "The model assumes the entrant can win 0.03 of its obtainable share in Year 1, drawn from a single 15.8% Schneider datapoint. But the evidence shows five to seven co-equal scaled vendors and 60–70% import dependence in Eastern Europe setting a low price floor. That structure means more players able to price-match any pilot win, and the model prices their response at zero. This pins Year-1 obtainable share at the 0.01 floor, not the 0.03 mid.",
    "category": "competitive",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "First bids meet 5–7 scaled incumbents and a low import price floor → Incumbents discount and bundle inside accounts; model sets response to zero → Lower win-rates cut Year-1 share to 0.01 floor, not 0.03 mid",
    "whyMissable": "'Medium concentration' reads as a friendly middle, but fragmentation among scaled incumbents means more rivals able to price-match any niche the entrant opens.",
    "falsifier": "Entrant win-rate at least 30% across the first 10 contested bids, with no material price concession beyond plan.",
    "likelihood": {
      "value": 0.55,
      "basis": "evidence",
      "rationale": "Incumbent in-account price defense is near-universal for new entrants, and the corpus documents the multi-incumbent structure and import price floor. The offset is that intelligent-PDU differentiation sometimes escapes pure price competition, so the leap to the 0.01 floor stays partly inferential."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.01,
        "note": "Contested-bid win-rates and stretched cycles pin Year-1 capture at the band floor"
      }
    ],
    "indicators": [
      {
        "signal": "Targeted rebate and promo activity on incumbent intelligent-PDU lines",
        "where": "Schneider/Vertiv/Eaton distributor price lists and channel rebate programs in Germany and the Netherlands",
        "threshold": "Targeted discounts >10% on intelligent-PDU SKUs appearing after the entrant's first public wins",
        "updates": "increases"
      },
      {
        "signal": "Loss-reason distribution in competitive bids",
        "where": "The venture's CRM bid post-mortems, reviewed quarterly",
        "threshold": ">50% of losses citing incumbent price match or bundle pricing",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Obtain the Omdia rack-PDU vendor-share table (2024 base) to establish which incumbents' share is actually contestable in CE and where the field is thinnest",
        "type": "information",
        "voiNodeId": "shape.cr3",
        "note": "Turns the extrapolated CR3 into a sourced map of contestable share before pipeline is committed"
      },
      {
        "action": "Position on an attribute the fragmented field cannot quickly price-match — e.g., firmware security certification, native DCIM/telemetry integration — and anchor pricing to that attribute rather than to the import floor",
        "type": "strategic",
        "note": "Escapes the bundle-and-discount response pattern that kills price-positioned entrants"
      },
      {
        "action": "Lock a multi-year exclusive distribution agreement in one geography (e.g., Poland, where import dependence is highest) to secure a defended channel before incumbents respond",
        "type": "contractual",
        "note": "Creates one protected revenue lane insensitive to in-account incumbent defense"
      }
    ],
    "evidence": [
      {
        "title": "Data Center PDU Market Size, Share, Latest Trends & Growth Analysis, 2025-2032",
        "sourceType": "industry-report",
        "publisher": "MarketsandMarkets",
        "excerpt": "Schneider Electric (France), Eaton (Ireland), Vertiv Group Corp. (US), Legrand (France), ABB (Switzerland), nVent (UK) — listed as market snapshot leading players, confirming a broad multi-incumbent field rather than a tight oligopoly.",
        "url": "https://www.marketsandmarkets.com/Market-Reports/data-center-pdu-market-183927907.html",
        "attached": true
      },
      {
        "title": "Rack Power Distribution Panels Market in Eastern Europe",
        "sourceType": "industry-report",
        "publisher": "IndexBox",
        "date": "2026-06-05",
        "excerpt": "Import dependence remains high at 60–70% of total supply, with finished panels and critical components sourced externally — corroborating the low-cost import price floor in the faster-growing eastern geographies.",
        "url": "https://www.indexbox.io/store/eastern-europe-rack-power-distribution-panels-market-analysis-forecast-size-trends-and-insights/",
        "attached": true
      },
      {
        "title": "Analysis of Entrant and Incumbent Bidding in Public Procurement Auctions",
        "sourceType": "analyst-estimate",
        "publisher": "FinanzArchiv Public Finance Analysis",
        "date": "2018-12-18",
        "excerpt": "More than half of the entrants cannot survive in the public procurement market and cannot win more than one auction — reference-class support for depressed entrant win-rates.",
        "url": "https://doi.org/10.1628/fa-2019-0002",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the outcome of the first 10 contested bids — actual entrant win-rate and observed incumbent price concessions — would settle whether Year-1 obtainable share lands at the 0.01 floor. No purchasable report resolves how incumbents will respond to this specific entrant's pilots; that requires time to unfold. The claim's own falsifier (30% win-rate across first 10 bids, no material concession) is a future market observation, not a present fact.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: demand-discontinuity · judge 17/20 · E[ΔYAM] −€1.94M · engine ΔYAM −€3.87M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.demand-discontinuity.prelet-pipeline-lockout.json
  {
    "id": "risk.demand-discontinuity.prelet-pipeline-lockout",
    "title": "Most Year-1 rack-PDU orders are already awarded to rivals",
    "narrative": "The model assumes the venture can win 3% of its serviceable market in Year 1, as if the order book were open. But 83% of the near-term data-center pipeline is already pre-let, and in those builds the rack-PDU choice is locked at design, 12 to 24 months before commissioning. That leaves only replacement and spot buys, a flow under 1% of the market, so the Year-1 number is several times too high.",
    "category": "model-structure",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Vacancy hits record low 6.3%, pipeline is 83% pre-let. → Large operators buy power on multi-year deals with incumbents. → Pre-let lockout cuts reachable Year-1 demand below the band.",
    "whyMissable": "3% sits in the middle of published Year-1 benchmarks, so it reads as conservative, hiding that most of that sliver was awarded before launch day.",
    "falsifier": "Two or more CE fit-out tenders with 2026 delivery where the rack-PDU line is still open to new vendors and the venture can bid.",
    "likelihood": {
      "value": 0.5,
      "basis": "evidence",
      "rationale": "The 83% pre-let and 6.3% vacancy figures are now confirmed by JLL and other sources, strengthening the trigger. Uncertainty remains on how much replacement demand in the installed base survives, so full lockout is unlikely but material compression is probable."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.008,
        "note": "Year-1 orderable flow limited to replacement, change orders, and un-spec'd white-space — below the modeled 1–5% band for reasons the band does not contemplate"
      }
    ],
    "indicators": [
      {
        "signal": "Share of CE fit-out RFQs where rack-PDU vendor is open vs pre-specified",
        "where": "TED (EU tender portal) and operator supplier portals (Equinix, NTT, Data4 RFQ postings)",
        "threshold": "<20% of 2026-delivery RFQs with open PDU line items",
        "updates": "increases"
      },
      {
        "signal": "Pre-let ratio of the FLAP-D and CE pipeline",
        "where": "JLL EMEA data centre report (semi-annual)",
        "threshold": "Pre-let staying ≥80% through 2026",
        "updates": "increases"
      },
      {
        "signal": "Incumbent backlog commentary on rack power",
        "where": "Vertiv and Schneider quarterly earnings calls",
        "threshold": "Backlog coverage extending beyond 12 months",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run structured interviews with 3 CE colo/hyperscale procurement leads specifically on WHEN in the build cycle PDU vendors are locked and what share of spend is spot-purchased",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts the 1–5% generic benchmark into a flow-based, CE-specific obtainable model"
      },
      {
        "action": "Re-aim the Year-1 motion at replacement/retrofit and white-space expansion in operating colo halls, where PDU purchasing is not gated by pre-let frameworks",
        "type": "strategic",
        "note": "Sells into the only genuinely open segment of the Year-1 flow"
      }
    ],
    "evidence": [
      {
        "title": "EMEA year end data centre report 2025",
        "sourceType": "industry-report",
        "publisher": "JLL",
        "date": "2026-03-30",
        "excerpt": "FLAP-D vacancy hits record low of 6.3%, pipeline is 83% pre-let. Capacity is being absorbed faster than it can be replaced. Pre-commitment is now the only viable route to securing meaningful capacity across Europe.",
        "url": "https://www.jll.com/en-uk/insights/emea-data-centre-report",
        "attached": true
      },
      {
        "title": "Data centre vacancy hits record low as demand outstrips supply",
        "sourceType": "triangulation",
        "publisher": "Estates Gazette",
        "date": "2026-04-09",
        "excerpt": "around 83% of space currently under construction already pre-let... pre-leasing now the primary route to securing capacity... large occupiers increasingly forced to commit to space well ahead of delivery.",
        "url": "https://www.estatesgazette.co.uk/news/data-centre-vacancy-hits-record-low-as-demand-outstrips-supply/",
        "attached": true
      },
      {
        "title": "Supply Chain and Technology Agreements in Data Center Construction",
        "sourceType": "industry-report",
        "publisher": "Bracewell LLP / JDSupra",
        "date": "2026-01-27",
        "excerpt": "data center operators are increasingly relying on robust supply chain and technology agreements that include component shortage remedies, price adjustment clauses, alternative sourcing clauses",
        "url": "https://www.jdsupra.com/legalnews/supply-chain-and-technology-agreements-1931379/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A structural fact settles this: what share of near-term DC pipeline is pre-let (JLL/EG confirm 83%) and whether rack-PDU is design-locked at that point. These are knowable today from industry reports and vendor specification-timing data — no future event needed. The claim asserts today's reachable flow is <1%, a correction to the obtainableFactor derivation.",
    "proposedCorrection": {
      "nodeId": "obtainableFactor",
      "value": 0.01,
      "low": 0.005,
      "high": 0.02,
      "rationale": "With 83% of pipeline pre-let and rack-PDU locked at design 12-24mo out, Year-1 reachable demand collapses to replacement/spot flow (~1% of SAM), so the generic 3% mid-band benchmark overstates obtainable share for a design-locked hardware market."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: execution-window · judge 16/20 · E[ΔYAM] −€1.27M · engine ΔYAM −€2.64M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.compliance-serialization-zeroes-h1.json
  {
    "id": "risk.execution-window.compliance-serialization-zeroes-h1",
    "title": "EU compliance delays could erase first-half revenue",
    "narrative": "The model assumes the venture can sell from day 1 of a 12-month window. But we found the product must first clear a stack of EU compliance gates that run one after another before it can quote. A two-quarter delay does not cut the Year-1 number in half evenly. It deletes the front of the ramp, where revenue compounds.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "EU entry needs more gates than the model lists: CE, RoHS, WEEE, EORI, plus 2024 rules. → Each gate must clear before quoting; the delay eats the best half. → Year-1 share halves or worse versus the assumed 0.03.",
    "whyMissable": "Compliance shows up as a fixed reduction inside serviceableFactor, so a timing delay looks like a discount already priced in.",
    "falsifier": "A complete dated compliance dossier plus one distributor or operator listing before the Year-1 clock starts.",
    "likelihood": {
      "value": 0.48,
      "basis": "evidence",
      "rationale": "First-time EU entry for networked hardware routinely takes 2–4 quarters, and this pre-launch venture shows no such artifacts yet. But CE for a non-wireless PDU can clear in 2–12 weeks, so a full two-quarter slip is less certain than a one-quarter erosion."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.5,
        "note": "Two quarters of the Year-1 window consumed by serialized cert/registration/listing before first PO"
      }
    ],
    "indicators": [
      {
        "signal": "WEEE producer-registration processing time for new foreign entrants in Germany",
        "where": "stiftung EAR (stiftung-ear.de) published processing notes and applicant guidance",
        "threshold": ">10 weeks from application to registration number",
        "updates": "increases"
      },
      {
        "signal": "Test-slot lead times for LVD/EMC certification of power distribution hardware",
        "where": "TÜV Rheinland / TÜV Nord lab booking lead-time notices to vendors",
        "threshold": ">8 weeks to first available slot",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a compliance-gap audit mapping every required artifact (per target country incl. non-EU Switzerland) to a dated critical path, before finalizing the Year-1 revenue plan",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts an unmodelled schedule risk into a plannable critical path; directly de-risks the Year-1 capture assumption"
      },
      {
        "action": "Start certification and national registrations in parallel now, pre-launch, treating the cert dossier as a launch gate rather than a post-launch task",
        "type": "operational",
        "note": "Moves the serialization out of the harvest window entirely"
      },
      {
        "action": "Contract a fulfilled-by-distributor arrangement where an established CE distributor's registrations (WEEE/EORI) cover initial shipments",
        "type": "contractual",
        "note": "Rents another firm's compliance stack for the first two quarters"
      }
    ],
    "evidence": [
      {
        "title": "Which obligations do producers of electrical and electronic equipment have?",
        "sourceType": "industry-report",
        "publisher": "stiftung elektro-altgeräte register",
        "excerpt": "Before you can sell electrical and electronic equipment in Germany, you have to be registered as a producer at the authority stiftung ear... If you have to be registered as a foreign company... you need to have a so-called authorised representative.",
        "url": "https://www.stiftung-ear.de/en/topic-areas/find-out-your-obligation-as-a-producer/which-obligations-do-producers-of-electrical-and-electronic-equipment-have/",
        "attached": true
      },
      {
        "title": "Full Process & Lead Time of EU CE Certification",
        "sourceType": "industry-report",
        "publisher": "Blue Asia Labs",
        "date": "2026-05-28",
        "excerpt": "EMC + LVD: AC-powered regular products. LVD takes 2 ~ 4 working days for long-term operation tests. Total lead time: 2 ~ 3 weeks.",
        "url": "https://www.blueasialabs.com/shouyehuandeng/full-process-amp-lead-time-of-eu-ce-certification",
        "attached": true
      },
      {
        "title": "Pre-Shipment Compliance Review for Importer of Record",
        "sourceType": "industry-report",
        "publisher": "TFTIOR",
        "date": "2026-05-21",
        "excerpt": "A product that looks secondary in a procurement list can be the product that stops the shipment... the issue date of a Declaration of Conformity matters. A declaration issued after shipment departure may not cleanly evidence compliance at the time of import.",
        "url": "https://tftior.com/pre-shipment-compliance-review-ior/",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the passage of the Year-1 clock reveals whether the compliance gates actually delay first quoting by two quarters and how much front-loaded revenue is lost — the timing of gate clearance versus the sales ramp is an unfolding execution event, not a knowable-today fact. A compliance dossier could confirm gate existence but not settle whether the ramp is deleted, which depends on future sequencing and market response.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: demand-discontinuity · judge 19/20 · E[ΔYAM] −€1.19M · engine ΔYAM −€2.64M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.demand-discontinuity.grid-queue-construction-pause.json
  {
    "id": "risk.demand-discontinuity.grid-queue-construction-pause",
    "title": "German and Dutch grid queues stall the venture's Year-1 deliveries",
    "narrative": "The model assumes demand grows at a steady 9% and treats Year-1 orders as if they follow that trend. But 78% of the target market sits in Germany and the Netherlands, where new capacity is stuck: Frankfurt faces 24–36-month grid-connection waits and Amsterdam caps new connections at 350 MVA until 2030. Orders land when sites get power, not when the trend rises. If 2026 energizations slip, Year-1 orders slip with them.",
    "category": "exogenous",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Frankfurt grid waits run 24–36 months; Amsterdam caps connections at 350 MVA → Germany and Netherlands are 78% of demand; Frankfurt dominates German base → The 9% trend is a 2030 figure; delayed power cuts Year-1 orders",
    "whyMissable": "Grid congestion is a known headline that looks priced in, but the model uses a smooth 9% trend and a generic benchmark that capture none of it.",
    "falsifier": "H1-2026 evidence that Frankfurt and Amsterdam energizations convert on schedule, with under-construction capacity going live at or above the prior year's rate.",
    "likelihood": {
      "value": 0.45,
      "basis": "evidence",
      "rationale": "Queue lengths and the 2.5 GW construction plateau are documented in current reporting. Some 2026 deliveries hold secured connections, such as Pure DC's 100 MVA substation in Amsterdam, so a partial rather than total slip is most likely."
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.5,
        "note": "Roughly half of window-period fit-out milestones in DE/NL slip beyond the 12-month YAM horizon"
      }
    ],
    "indicators": [
      {
        "signal": "Grid-connection queue length and new-connection moratoria in the Frankfurt region",
        "where": "TenneT/Amprion grid development and connection-request disclosures; Hessen regional planning dockets",
        "threshold": "Queue quotes lengthening beyond 36 months or a formal connection pause",
        "updates": "increases"
      },
      {
        "signal": "Under-construction → live conversion rate in Amsterdam and Frankfurt",
        "where": "JLL German data center market updates; Cushman & Wakefield EMEA data centre update (H1 2026)",
        "threshold": "Live-capacity additions <15% YoY in either hub",
        "updates": "increases"
      },
      {
        "signal": "Finalization of Amsterdam's umbrella zoning plan connection cap",
        "where": "Gemeente Amsterdam zoning consultation docket; DC Byte Amsterdam market page",
        "threshold": "350 MVA cap adopted as drafted",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build a named-project delivery calendar for the 2026–27 DE/NL fit-out pipeline (project, MW, energization date, GC/electrical contractor) and re-derive Year-1 obtainable from it",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Replaces the generic 1–5% band with an energization-gated pipeline model"
      },
      {
        "action": "Add a second sales beachhead in a non-grid-gated CE market (Warsaw, Vienna) to hedge the DE/NL delivery trough",
        "type": "operational",
        "note": "Poland's additions are growing fastest and are not FLAP-D-queue-bound"
      },
      {
        "action": "Offer stock-and-ship replacement SKUs with short lead times to capture demand that decouples from new-build energization",
        "type": "strategic",
        "note": "Replacement demand in live halls is the segment least exposed to grid gates"
      }
    ],
    "evidence": [
      {
        "title": "Cushman & Wakefield: European data centre growth is shifting",
        "sourceType": "industry-report",
        "publisher": "Cushman & Wakefield",
        "date": "2026-04-28",
        "excerpt": "Amsterdam, with 852 MW of operational capacity, has less room for further expansion... Capacity currently under construction has plateaued at around 2.5 GW. Across Europe, the explanation is often the same: power shortages, limited grid connections and lengthy permitting",
        "url": "https://www.cushmanwakefield.com/en/netherlands/news/2026/04/emea-datacentre-update-h2-2025",
        "attached": true
      },
      {
        "title": "Data center grid connection lead times by market 2025",
        "sourceType": "industry-report",
        "publisher": "Statista",
        "date": "2026-01-06",
        "excerpt": "As of 2025, the average lead time for data centers to be connected to the power grid in both Amsterdam and Tokyo was 10 years, the longest of any major market. Frankfurt: 7 years.",
        "url": "https://www.statista.com/statistics/1651131/data-center-grid-connection-lead-times-by-market/",
        "attached": true
      },
      {
        "title": "Frankfurt at the Limit: Power Shortages Slow the Data Center Boom",
        "sourceType": "industry-report",
        "publisher": "igor'sLAB",
        "date": "2026-03-19",
        "excerpt": "The energy provider Mainova estimates that high-capacity new connections on a large scale will not be possible again until the mid-2030s.",
        "url": "https://www.igorslab.de/en/frankfurt-at-its-limit-power-shortages-are-slowing-the-boom-in-data-centers/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only H1-2026 actuals on whether Frankfurt and Amsterdam energizations convert on schedule (under-construction MW going live at or above prior-year rate) would settle whether Year-1 orders slip — this is a future demand gate that hasn't bound yet, not a mis-stated current number.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: execution-window · judge 16/20 · E[ΔYAM] −€1.06M · engine ΔYAM −€1.92M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.serviceable-reach-is-flow-not-stock.json
  {
    "id": "risk.execution-window.serviceable-reach-is-flow-not-stock",
    "title": "Year-1 reach is two countries, not 55% of the market",
    "narrative": "The model assumes the venture can serve 55% of its market in Year 1. But that reach must be built during the same 12 months, and the only outside analogues we found sit near 12%, not 45–65%. A realistic first-year footprint of Germany plus the Netherlands through one distributor is closer to 30–35% of the market than 55%.",
    "category": "model-structure",
    "targetNodes": [
      "serviceableFactor",
      "geo.CH"
    ],
    "mechanism": "The 55% is a guess; every outside figure sits far lower → Reach must be built country by country during Year 1 → Year-1 share drops toward two countries, shrinking the revenue base",
    "whyMissable": "The 55% carries a wide band that looks like honest uncertainty, but for a pre-launch venture the true Year-1 value starts near zero and ramps.",
    "falsifier": "Signed distribution deals and completed registrations covering at least 55% of the market within the first quarter after launch.",
    "likelihood": {
      "value": 0.55,
      "basis": "evidence",
      "rationale": "No outside evidence supports 45–65% reach for any comparable vendor, and the certs, channel and support behind that reach do not exist before launch. A single pan-regional distributor deal could cover several countries at once, which keeps this from rating higher."
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.35,
        "note": "Year-1 realistic footprint: DE+NL via one distributor plus partial direct coverage; CH and CEE tail unbuilt"
      }
    ],
    "indicators": [
      {
        "signal": "Count and geographic coverage of signed CE distribution agreements at launch",
        "where": "Vendor's own channel announcements cross-checked against Rexel/Sonepar and regional CE distributor line cards",
        "threshold": "<2 countries covered by signed agreements at launch",
        "updates": "increases"
      },
      {
        "signal": "Swiss conformity path status for the product (non-EU, post-MRA friction for networked electrical equipment)",
        "where": "Swiss authorized-representative and conformity guidance (SECO / Swissmem publications) plus the vendor's own compliance roadmap",
        "threshold": "No Swiss authorized rep appointed by launch",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build the bottom-up channel-coverage model (named accounts × reachable share per country) that the node's own promotion path calls for, and re-derive serviceableFactor from it",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "The single highest-value replacement of an unanchored assumption in the SAM step"
      },
      {
        "action": "Prioritize one pan-CE master distributor with existing DE/NL/PL coverage over country-by-country channel building",
        "type": "strategic",
        "note": "Buys multi-country reach as one contract instead of five"
      },
      {
        "action": "Defer Switzerland and the CEE tail out of the Year-1 plan explicitly, and rebase the YAM on the DE/NL footprint",
        "type": "operational",
        "note": "Aligns the model's reach with the venture's actual Year-1 build plan"
      }
    ],
    "evidence": [
      {
        "title": "Serviceable Obtainable Market (SOM): How to Calculate It",
        "sourceType": "industry-report",
        "publisher": "Prospeo",
        "excerpt": "SOM is the revenue you can realistically capture in 1-3 years. Not a fantasy percentage of SAM. Not a top-down slice of a Gartner number.",
        "url": "https://prospeo.io/s/serviceable-obtainable-market",
        "attached": true
      },
      {
        "title": "GTM Strategy Statistics & Benchmarks 2024",
        "sourceType": "industry-report",
        "publisher": "The Starr Conspiracy",
        "date": "2026-04-21",
        "excerpt": "Only 23% of B2B companies achieve their first-year revenue targets after product launch, according to a 2024 study by SiriusDecisions analyzing 847 tech companies.",
        "url": "https://www.thestarrconspiracy.com/insights/benchmarks/go-to-market-strategy-benchmarks",
        "attached": true
      },
      {
        "title": "Memphasys seals exclusive Thailand Felix deal, lifting FY2026 contracted revenue",
        "sourceType": "triangulation",
        "publisher": "TipRanks",
        "date": "2026-07-01",
        "excerpt": "Memphasys has signed an exclusive three-year distribution agreement... in Thailand... combined with its recently signed Vietnam deal — illustrating that pre-launch distribution reach is built one country at a time.",
        "url": "https://www.tipranks.com/news/company-announcements/memphasys-seals-exclusive-thailand-felix-deal-lifting-fy2026-contracted-revenue",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A bottom-up channel-coverage map settles this today: named distributors × countries they cover × registration and certification timelines, laid against the venture's own launch plan. That artifact — buildable in a week from distributor line cards, conformity-path guidance and the venture's channel term sheets — fixes what share of the market is actually reachable in the first 12 months. No future event needs to unfold; the 55% is a mis-stated present-day number, not a bet on how the year goes.",
    "proposedCorrection": {
      "nodeId": "serviceableFactor",
      "value": 0.35,
      "low": 0.3,
      "high": 0.45,
      "rationale": "A realistic Year-1 footprint of Germany plus the Netherlands through one distributor covers ~30–35% of the market, not 55%; a pan-CE master distributor with existing DE/NL/PL coverage could lift that toward 45%, which sets the band top. The 55% describes reach the venture might eventually build, not reach it starts the year with."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: structure-independence · judge 17/20 · E[ΔYAM] −€0.89M · engine ΔYAM −€2.11M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.global-framework-forecloses-large-operator-cell.json
  {
    "id": "risk.structure-independence.global-framework-forecloses-large-operator-cell",
    "title": "Big-operator sales locked up by global contracts, out of reach",
    "narrative": "The model gives large operators 40% of buyer spend and plans to sell to them first. But hyperscalers and pan-European colos like Equinix and Digital Realty pick rack-PDU vendors through global contracts signed at headquarters on multi-year cycles. A Central European regional team cannot reach that spend in 12 months, so the Year-1 pipeline is built on buyers the venture cannot access.",
    "category": "competitive",
    "targetNodes": [
      "cust.operator-large"
    ],
    "mechanism": "Big operators buy PDUs through global vendor lists and contracts. → The 40% share rests on one supplier's order stat, not channel data. → This buyer cell is closed, yet the first-sale strategy targets it.",
    "whyMissable": "Selling to big operators first looks like the safe, high-credibility move, and the wide uncertainty band hides that the share can be exactly 40% and still zero for a regional entrant.",
    "falsifier": "Two or more Central European large operators confirming country-level PDU sourcing power, plus a documented case of a new vendor entering their approved list via a regional pilot within 12 months.",
    "likelihood": {
      "value": 0.42,
      "basis": "evidence",
      "rationale": "Global procurement at top hyperscale and colo accounts is well documented, and the trigger is strongly supported. But regional CE colos like Greenergy do buy PDUs through local partners and switch vendors, so the cell is not uniformly closed; net small downward adjustment."
    },
    "perturbation": [
      {
        "nodeId": "cust.operator-large",
        "op": "exclude",
        "note": "Foreclosure, not shrinkage: the large-operator cell exists in the market but is unavailable to a CE regional entrant in the model's horizon"
      }
    ],
    "indicators": [
      {
        "signal": "Vendor-qualification and supplier-registration requirements for rack power at pan-European colos",
        "where": "Equinix and Digital Realty supplier/procurement portals; framework tender notices on TED (tenders.europa.eu) for DC fit-outs",
        "threshold": "PDU category listed only under global framework agreements with no regional qualification path",
        "updates": "increases"
      },
      {
        "signal": "Where incumbent PDU wins at large accounts are booked",
        "where": "Vertiv and Schneider quarterly earnings calls, commentary on hyperscale framework awards",
        "threshold": "Rack-power growth attributed predominantly to global framework expansions rather than regional project wins",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run three structured CE operator/distributor procurement interviews specifically probing local vs HQ sourcing authority for rack PDUs (the node's own promotion path)",
        "type": "information",
        "voiNodeId": "cust.operator-large",
        "note": "Directly tests reachability of the 0.40 cell before GTM spend commits to it"
      },
      {
        "action": "Open a parallel OEM/white-label route via rack integrators, which is documented as an existing channel and does not require AVL entry",
        "type": "strategic",
        "note": "Digipower/GETEK-style OEM supply reaches large-operator racks without winning the framework"
      }
    ],
    "evidence": [
      {
        "title": "Vertiv Partner Program EMEA — Major Customers list",
        "sourceType": "industry-report",
        "publisher": "Vertiv",
        "excerpt": "MAJOR CUSTOMERS Alibaba, Alstom, America Movil, AT&T, China Mobile, Equinix, Ericsson, Reliance, Siemens, Telefonica, Tencent, Verizon and Vodafone",
        "url": "https://www.vertiv.com/49858a/globalassets/documents/brochures/vertiv-partner-program-emea-2024-en.pdf",
        "attached": true
      },
      {
        "title": "Global Data Center Supplier Risk Management (Google/Achilles)",
        "sourceType": "industry-report",
        "publisher": "Achilles",
        "date": "2026-03-06",
        "excerpt": "Google's Data Center Construction Program team uses Achilles to scale its global data center construction program... streamlines supplier intake, prequalification, and risk visibility, enabling faster, data-driven procurement decisions",
        "url": "https://www.achilles.com/industry-insights/google/",
        "attached": true
      },
      {
        "title": "Greenergy and A-Kaabel deploy Vertiv rack PDUs in Estonia",
        "sourceType": "industry-report",
        "publisher": "Vertiv",
        "excerpt": "Now Estonia's leading colocation provider, Greenergy targets HPC and AI customers with IT loads exceeding 10 MW... Supporting this evolution is A-Kaabel OÜ... an authorized sales and service partner for Vertiv in Estonia.",
        "url": "https://www.vertiv.com/48ebb0/globalassets/documents/case-studies/vertiv-greenergy-cs-en-emea-web.pdf",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "Procurement-scope documentation for Central European operators (hyperscaler/colo country teams) showing whether rack-PDU vendor selection happens at global HQ vs. regional level, plus the share of the '40% large-operator' cell that is actually globally-contracted and unreachable in 12 months. This is knowable today from published vendor lists, procurement portals (e.g., Achilles), and a handful of operator/distributor interviews — no time needs to pass.",
    "proposedCorrection": {
      "nodeId": "cust.operator-large",
      "value": 0.25,
      "low": 0.18,
      "high": 0.33,
      "rationale": "The 0.40 figure conflates all large-operator PDU spend with reachable spend; the globally-contracted hyperscale/pan-EU colo portion (Equinix, Digital Realty, hyperscalers on Achilles-style global lists) is not addressable by a CE regional team in Year 1, so the accessible large-operator cell should be marked down to the regionally-sourced remainder."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: regulatory-gauntlet · judge 15/20 · E[ΔYAM] −€0.87M · engine ΔYAM −€2.29M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.cra-conformity-clock.json
  {
    "id": "risk.regulatory-gauntlet.cra-conformity-clock",
    "title": "EU Cyber Resilience Act could block Year-1 tenders with big operators",
    "narrative": "The model assumes a networked PDU sells like any CE-marked product, backed by EN 50600, ecodesign 2019/424 and CE/TÜV. But the Cyber Resilience Act covers this product too, its reporting duties start 11 September 2026 inside the first year, and large operators are already writing CRA clauses into 2026 tenders. A pre-launch entrant cannot show a credible CRA file that fast, so both reachable demand and Year-1 pace are overstated.",
    "category": "exogenous",
    "targetNodes": [
      "serviceableFactor",
      "obtainableFactor"
    ],
    "mechanism": "CRA covers networked PDUs: reporting from Sep 2026, conformity from Dec 2027. → Large operators demand CRA readiness in 2026 tenders, screening out the entrant. → Cert stack omits CRA, so reach and Year-1 pace look too high.",
    "whyMissable": "The CRA reads like another CE marking and its Dec 2027 deadline sits outside the year, so it gets filed under later, while buyers actually ask 12 to 18 months early.",
    "falsifier": "A sample of 2026 large-operator power tenders with no CRA or SBOM clauses, plus proof the PDU is default class with self-assessment and a file completable before launch.",
    "likelihood": {
      "value": 0.38,
      "basis": "evidence",
      "rationale": "The dates and product scope are enacted law, so the trigger is solid. But severity depends on the PDU being a higher risk class needing scarce notified bodies, and roughly 90% of products self-assess, so the screen-out is weaker than claimed; nudge down from 0.45."
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "scale",
        "value": 0.85,
        "note": "CRA-gated demand (security-clause frameworks) drops out of the reachable set until the conformity file closes"
      },
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.02,
        "note": "tender cycles extend while CRA evidence is assembled; Year-1 pace slows below the 3% mid-band"
      }
    ],
    "indicators": [
      {
        "signal": "CRA/SBOM/secure-development clauses appearing in operator rack-power procurement",
        "where": "TED (Tenders Electronic Daily) notices; supplier-requirement pages of Equinix/NTT/Vantage/Data4 procurement portals",
        "threshold": "≥2 CE operator RFPs requiring SBOM delivery or CRA conformity declaration before Dec 2026",
        "updates": "increases"
      },
      {
        "signal": "Publication status of CRA harmonized standards (CEN/CENELEC JTC 13 work programme)",
        "where": "OJEU harmonized-standards listings; CEN/CENELEC JTC 13 docket",
        "threshold": "hENs for horizontal CRA requirements slipping past mid-2026, forcing notified-body routes",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a CRA classification and gap assessment (default vs important-product class, self-assessment vs notified-body route) for the PDU's connectivity stack",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "determines whether the conformity clock even fits the entry window"
      },
      {
        "action": "Stand up SBOM generation and an IEC 62443-4-1-aligned secure development lifecycle now, and pre-book a notified-body assessment slot before the 2026 queue forms",
        "type": "operational"
      },
      {
        "action": "Sequence first sales through an OEM/integrator whose CRA-compliant product wrapper covers the integrated PDU while the entrant's own file matures",
        "type": "strategic"
      }
    ],
    "evidence": [
      {
        "title": "CRA Product Classification: Default, Important, Critical",
        "sourceType": "industry-report",
        "publisher": "CRA Evidence",
        "date": "2026-05-08",
        "excerpt": "Default products can usually use internal control, based on Module A. ... about 90% of products fall into the Default category.",
        "url": "https://craevidence.com/cra-compliance/product-classification",
        "attached": true
      },
      {
        "title": "What Are CRA Harmonised Standards? Status and Tracker",
        "sourceType": "industry-report",
        "publisher": "CRA Evidence",
        "date": "2026-06-04",
        "excerpt": "No CRA harmonised standard is published in the Official Journal yet (as of 4 June 2026), so the Article 27 presumption of conformity is not available for any product category.",
        "url": "https://craevidence.com/cra-compliance/harmonised-standards-status",
        "attached": true
      },
      {
        "title": "EU Cyber Resilience Act: CRA Compliance Guide 2026",
        "sourceType": "industry-report",
        "publisher": "Cloudsmith",
        "date": "2026-06-11",
        "excerpt": "On September 11, 2026, vulnerability reporting obligations go live... December 11, 2027, is the full compliance deadline, covering all remaining CRA software requirements, including SBOMs, secure-by-design, CE marking, and technical documentation for any new product placed on the EU market.",
        "url": "https://cloudsmith.com/blog/the-eu-cyber-resilience-act-what-engineering-teams-need-to-do-to-be-compliant",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "The load-bearing claim is that 2026 large-operator tenders will actually carry binding CRA/SBOM screening clauses that exclude a pre-launch entrant, and that this depresses Year-1 pace. Whether tenders adopt such clauses and whether they bind is a behavior that unfolds over the next 12–24 months — no purchasable dataset today settles how operators will write and enforce 2026 procurement terms. The CRA legal timeline (Sep 2026 reporting, Dec 2027 conformity) is knowable, but the demand-gate binding is a future market response, not a present-state number.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: regulatory-gauntlet · judge 17/20 · E[ΔYAM] −€0.86M · engine ΔYAM −€1.57M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.per-country-access-stack.json
  {
    "id": "risk.regulatory-gauntlet.per-country-access-stack",
    "title": "Per-country registrations delay sales, cutting Year-1 reach",
    "narrative": "The model assumes the venture can reach 45% of its serviceable market in Year 1. But each country needs registrations done before the first legal sale, and Germany's WEEE setup alone takes 2 to 4 months. Because these steps run one after another, several countries stay unreachable for part of the year, pushing Year-1 reach below the low edge and dropping Switzerland out entirely.",
    "category": "fact",
    "targetNodes": [
      "serviceableFactor",
      "geo.CH"
    ],
    "mechanism": "Each country needs registrations done before any legal sale. → Registrations run in sequence, so reachable countries grow slowly across 12 months. → Year-1 reach drops below the band edge and Switzerland falls out.",
    "whyMissable": "Each registration is a cheap form, so none lands on a risk list built around big items, and the real damage only shows when the compliance schedule meets the sales plan.",
    "falsifier": "A counsel-built timeline showing all CE-7 registrations, including Swiss setup, can finish in parallel within 90 days before launch.",
    "likelihood": {
      "value": 0.55,
      "basis": "evidence",
      "rationale": "The registrations are legally required and their lead times are documented facts, and hardware entrants routinely underestimate this sequencing. The only real doubt is whether the venture has quietly already started them."
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.42,
        "note": "serialized country access holds Year-1 reach below the band's low edge"
      },
      {
        "nodeId": "geo.CH",
        "op": "exclude",
        "note": "Swiss non-EU compliance setup defers CH to Year 2 — foreclosed from this venture's Year-1 scope, not shrunk"
      }
    ],
    "indicators": [
      {
        "signal": "stiftung EAR registration processing times and backlog",
        "where": "stiftung EAR portal and published registration statistics",
        "threshold": "processing exceeding 3 months for new B2B registrants",
        "updates": "increases"
      },
      {
        "signal": "Whether incumbents maintain distinct Swiss-compliance SKUs and importer structures",
        "where": "Bachmann/Rittal/Vertiv Swiss price lists and Swiss distributor catalogues",
        "threshold": "separate CH SKUs/importer-of-record arrangements visible at ≥2 incumbents",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a country-by-country market-access memo (registrations, lead times, dependencies) for the CE-7 and convert it into a bottom-up reachable-share model — the node's own promotion path",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "replaces the unanchored 0.55 with a dated, per-country reach schedule"
      },
      {
        "action": "File DE and NL registrations immediately (covering 0.78 of the funnel) and deliberately sequence CH/PL to Year 2",
        "type": "operational"
      },
      {
        "action": "Contract an EU authorized-representative/importer-of-record service to parallelize the remaining country stacks",
        "type": "contractual"
      }
    ],
    "evidence": [
      {
        "title": "Wie lange dauert die Registrierung? (stiftung EAR WEEE)",
        "sourceType": "industry-report",
        "publisher": "Elektrogesetz.de",
        "date": "2019-09-17",
        "excerpt": "Von der Beantragung bis zur Erteilung einer WEEE-Registrierung durch die Stiftung EAR, vergehen weiterhin „mehrere Monate“... etwa 8 bis 10 Wochen... First in, first out; keine beschleunigte Bearbeitung.",
        "url": "https://www.elektrogesetz.de/wie-lange-dauert-die-registrierung/",
        "attached": true
      },
      {
        "title": "EPR-Nummer in Deutschland beantragen: Schritt fuer Schritt",
        "sourceType": "industry-report",
        "publisher": "Koorvi",
        "date": "2026-06-19",
        "excerpt": "In Deutschland sind es in Wahrheit drei verschiedene Register, drei Nummern und zwei Behoerden... bevor dein erstes Produkt in Deutschland in Verkehr geht.",
        "url": "https://www.koorvi.com/de/blog/epr-nummer-beantragen-deutschland",
        "attached": true
      },
      {
        "title": "WEEE Schweiz / SENS eRecycling",
        "sourceType": "industry-report",
        "publisher": "take-e-way / Stiftung SENS",
        "date": "2021-06-29",
        "excerpt": "Die Stiftung SENS organisiert in der Schweiz die Entsorgung von elektronischen Haushaltsgeräten — separate importer/recycling regime for non-EU Switzerland.",
        "url": "https://www.take-e-way.de/news/weee-schweiz-oeffentliche-liste-der-nicht-systemteilnehmer/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "risk",
    "settleTest": "Only the actual sequencing and completion of CE-7 registrations over the launch year settles this — a counsel-built timeline showing whether registrations run in parallel within 90 days or serially over 12 months is a forward-looking commitment that hasn't happened yet. The registration durations are known facts, but the Year-1 reach outcome depends on how the venture executes the process, which unfolds over time.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 15/20 · E[ΔYAM] −€0.83M · engine ΔYAM −€2.06M · evidence: speculative
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.distributor-line-review-lockout.json
  {
    "id": "risk.competitive-foreclosure.distributor-line-review-lockout",
    "title": "Distributor channel is locked shut for Year 1",
    "narrative": "The model treats the 0.13 distributor cell as an easy open channel. But that channel runs on annual line reviews, and Legrand owns both intelligent-PDU brands, Raritan and Server Technology, giving one vendor two slots on every line card. A pre-launch entrant arrives mid-cycle and cannot get listed until the next review, which lands after Year 1. That cell should contribute nothing to the Year-1 number.",
    "category": "execution",
    "targetNodes": [
      "cust.distributor",
      "obtainableFactor"
    ],
    "mechanism": "Distributors decide line cards once a year, at set reviews. → Venture launches mid-cycle, so no distributor can list it. → The 0.13 cell adds nothing to Year-1 demand.",
    "whyMissable": "Distribution looks like the easy channel and 0.13 looks too small to check, but annual reviews close it for exactly the 12 months Year 1 measures.",
    "falsifier": "A named distributor like Rexel or Sonepar confirming in writing it can list a new intelligent-PDU line within two quarters without waiting for the annual review.",
    "likelihood": {
      "value": 0.4,
      "basis": "base-rate",
      "rationale": "Annual line reviews and Legrand's ownership of both PDU brands are confirmed facts. But three 2025-2026 cases show European distributors onboarding new PDU vendors outside a rigid annual gate, lowering likelihood from 0.45 to 0.30."
    },
    "perturbation": [
      {
        "nodeId": "cust.distributor",
        "op": "exclude",
        "note": "Distributor cell closed until next line-review cycle — outside the Year-1 window"
      },
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.7,
        "note": "Distribution-routed mid-market deals slip beyond Year 1, dragging the blended ramp below the 3% mid-band"
      }
    ],
    "indicators": [
      {
        "signal": "Rack-power category composition on published line cards of the top-5 CE power/IT-infrastructure distributors",
        "where": "Distributor line cards and published price lists (vendor pages of major CE electrical and IT distribution groups)",
        "threshold": "Category shows incumbent line + a private-label option in ≥4 of 5 line cards — both slots filled",
        "updates": "increases"
      },
      {
        "signal": "Response pattern to the venture's distribution inquiries",
        "where": "Venture's own channel-recruitment log across first 2 quarters",
        "threshold": "≥3 distributors respond 'category filled, revisit at next annual review'",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Map the line-review calendars, exclusivity terms and private-label arrangements of the top-5 CE distributors before committing the channel plan",
        "type": "information",
        "voiNodeId": "cust.distributor",
        "note": "Replaces an unevidenced 0.13 cell with a dated channel-opening schedule"
      },
      {
        "action": "Bridge Year 1 with a direct/rep-model sales motion and e-commerce for the mid-market, deferring distribution to the first open review cycle",
        "type": "operational"
      },
      {
        "action": "Offer a non-exclusive, high-margin category slot to a challenger distributor seeking differentiation from the incumbent-locked majors",
        "type": "contractual",
        "note": "Margin, not volume, is the currency that opens a mid-cycle slot"
      }
    ],
    "evidenceStatus": "speculative",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the timing of actual distributor line-review cycles and whether the entrant gets listed within Year 1 will settle this — that is a future channel-adoption event, not a knowable-today number. Distributor listing decisions unfold over the next 12 months and depend on the entrant's launch date and each distributor's review calendar.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 17/20 · E[ΔYAM] −€0.67M · engine ΔYAM −€1.58M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.intelligent-subset-inflation.json
  {
    "id": "risk.definition-scopedown.intelligent-subset-inflation",
    "title": "Base counts basic PDUs the venture cannot sell, halving the market",
    "narrative": "The model assumes the venture can sell into the full €300M rack-PDU market. But Grand View, the source of that figure, says the non-intelligent segment held the largest revenue share in 2025, and the venture sells only intelligent PDUs. About half the €300M is basic units the product cannot address, so the Year-1 number is inflated about 2x.",
    "category": "boundary",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "Grand View says non-intelligent PDUs held the largest 2025 share. → Vendors sell intelligent and basic PDUs as separate products. → SAM €165M and YAM €1.65M both inherit the inflation.",
    "whyMissable": "The label 'rack-PDU market' looks matched to a rack-PDU vendor, but the mismatch sits inside the source's own segmentation table below the headline.",
    "falsifier": "A European source showing intelligent PDUs at 75% or more of rack-PDU revenue.",
    "likelihood": {
      "value": 0.42,
      "basis": "evidence",
      "rationale": "The source states non-intelligent held the largest revenue share globally. But intelligent units carry 3-5x prices and European buyers skew intelligent, so the European intelligent share plausibly lands at 45-60%."
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "scale",
        "value": 0.7,
        "note": "Restrict the base to the CE intelligent-PDU slice (~70% of the all-class headline)"
      }
    ],
    "indicators": [
      {
        "signal": "SKU mix (basic/metered vs switched/intelligent) in CE distributor catalogs and price lists",
        "where": "Rittal, Bachmann, and CE master-distributor (e.g., Also/Ingram DC-infrastructure) published price lists",
        "threshold": "Basic+metered SKUs >40% of listed rack-PDU line items in DE/PL catalogs",
        "updates": "increases"
      },
      {
        "signal": "PDU class specified in German and Polish colocation fit-out tenders",
        "where": "Frankfurt colo tender documents; Polish public-sector DC procurement portal (platformazakupowa)",
        "threshold": "≥half of tenders specifying metered-only or basic PDUs",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Obtain the Omdia Rack PDU tracker with product-class sub-segmentation to pin the intelligent share of EU revenue",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "Directly measures the venture-relevant slice instead of the all-class headline"
      },
      {
        "action": "Add a metered mid-tier SKU to the launch line so the addressable base spans the metered+intelligent classes rather than intelligent-only",
        "type": "strategic",
        "note": "Widens product scope to match the sized market instead of shrinking the market to match the product"
      }
    ],
    "evidence": [
      {
        "title": "Intelligent PDU",
        "sourceType": "industry-report",
        "publisher": "Global Industry Analysts",
        "date": "2025-10-01",
        "excerpt": "The global market for Intelligent PDU estimated at US$2.1 Billion in the year 2024... Within Europe, Germany is forecast to grow at approximately 5.2% CAGR.",
        "url": "https://www.marketresearch.com/Global-Industry-Analysts-v1039/Intelligent-PDU-42596267/",
        "attached": true
      },
      {
        "title": "Rack Power Distribution Panels Market in Eastern Europe",
        "sourceType": "industry-report",
        "publisher": "IndexBox",
        "date": "2026-06-05",
        "excerpt": "Import dependence remains high at 60–70% of total supply, with finished panels and critical",
        "url": "https://www.indexbox.io/store/eastern-europe-rack-power-distribution-panels-market-analysis-forecast-size-trends-and-insights/",
        "attached": true
      },
      {
        "title": "Rack PDU Market Tracker – 2025",
        "sourceType": "industry-report",
        "publisher": "Omdia",
        "date": "2025-08-27",
        "excerpt": "This is the annual update to the Rack PDU Tracker, including updated forecasts and vendor shares. It uses 2024 as a base year and forecasts to 2030.",
        "url": "https://omdia.tech.informa.com/om129351/rack-pdu-market-tracker--2025",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The Grand View (or IndexBox EU) rack-PDU report's segment split table showing intelligent vs. basic/non-intelligent revenue share for 2025 — a purchasable existing dataset that directly settles what fraction of the €300M is addressable.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 150,
      "low": 120,
      "high": 210,
      "rationale": "If the venture sells only intelligent PDUs and non-intelligent held the largest 2025 share, the addressable base is roughly half the all-segment €300M figure, so the funnel base should reflect the intelligent-only segment."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 17/20 · E[ΔYAM] −€0.60M · engine ΔYAM −€1.16M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.oem-cell-odm-price-foreclosure.json
  {
    "id": "risk.competitive-foreclosure.oem-cell-odm-price-foreclosure",
    "title": "OEM/integrator channel is owned by cheaper Asian ODMs",
    "narrative": "The model books 22% of PDU spend to the OEM/integrator channel as if it were open to win. But that channel is where Taiwanese and Chinese ODMs like Digipower and GETEKnet already sell white-label PDUs at cost points a Central European manufacturer cannot match. Integrator deals are decided on unit cost, so this spend is out of reach on day one. Counting it overstates the serviceable market.",
    "category": "competitive",
    "targetNodes": [
      "cust.oem"
    ],
    "mechanism": "Asian ODMs already supply OEM/integrator PDUs as white-label goods. → Integrators buy on lowest cost; the entrant cannot match ODM prices. → The 22% cell is priced out, inflating serviceable spend.",
    "whyMissable": "The label 'OEM/integrator' reads like home turf for a manufacturer, hiding that it is where cheaper ODM rivals set the price.",
    "falsifier": "Quotes showing the venture can price within 10–15% of ODM white-label at integrator volumes, or an integrator win awarded on features rather than cost.",
    "likelihood": {
      "value": 0.52,
      "basis": "evidence",
      "rationale": "The ODM white-label channel is directly documented in the corpus, and the entrant's cost disadvantage is a robust pattern. But some integrators pay premiums for EU origin and short lead times, keeping likelihood near the prior with a slight uptick."
    },
    "perturbation": [
      {
        "nodeId": "cust.oem",
        "op": "exclude",
        "note": "OEM/integrator cell foreclosed by ODM cost structure — unavailable to a CE industrial entrant, not merely competitive"
      }
    ],
    "indicators": [
      {
        "signal": "ASP gap between ODM-listed intelligent PDUs and the venture's target price at integrator volumes",
        "where": "ODM published price lists and B2B marketplace listings (Digipower, GETEKnet, Alibaba-listed smart-PDU lines) vs the venture's cost model",
        "threshold": "ODM intelligent-PDU ASPs ≥30% below the venture's achievable price at 500+ unit volumes",
        "updates": "increases"
      },
      {
        "signal": "Basis-of-award in rack-integrator RFQs (price vs features/origin/compliance)",
        "where": "Integrator RFQ responses and OCP marketplace/integrated-rack product listings specifying PDU sourcing",
        "threshold": "≥2 of first 3 integrator RFQs decided on unit price with white-label requirement",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a teardown and landed-cost benchmark of 3 leading ODM intelligent PDUs against the venture's BOM before building any OEM-channel revenue into the plan",
        "type": "information",
        "voiNodeId": "cust.oem",
        "note": "Directly tests whether the 0.22 cell is priced in or out of reach"
      },
      {
        "action": "Reposition for the OEM channel only where EU-manufacture matters: compliance-sensitive, short-lead-time, and sovereignty-driven builds — conceding commodity white-label volume",
        "type": "strategic"
      },
      {
        "action": "Explore becoming the EU-based second source for one ODM-dependent integrator facing supply-chain or customs-origin pressure",
        "type": "contractual",
        "note": "Import dependence creates a narrow contractual wedge into an otherwise closed cell"
      }
    ],
    "evidence": [
      {
        "title": "OEM PDU Power Distribution Unit Solution",
        "sourceType": "industry-report",
        "publisher": "GETEKnet (Ningbo Geteknet Telecom Equipment)",
        "date": "2025-09-25",
        "excerpt": "GETEKnet is a leading OEM manufacturer and supplier of PDU... All data center PDUs are designed and manufactured under strict quality control and comply with international CE and RoHS certifications. Price changes against quantity. OEM / ODM is available.",
        "url": "https://www.getek.com/oem-pdu-power-distribution-unit-solution/",
        "attached": true
      },
      {
        "title": "The Rise of White-Label Servers: Can SMEs Reduce Their TCO Through the OCP Standard?",
        "sourceType": "industry-report",
        "publisher": "ZKKR Technology",
        "date": "2021-11-12",
        "excerpt": "Cloud computing giants... have significantly boosted their global market share... by directly sourcing white-label servers through the ODM model... in 2024, Taiwan, China, accounted for 81% of global white-label server shipments.",
        "url": "https://www.zkkrtech.com/news_detail/4.html",
        "attached": true
      },
      {
        "title": "Panduit wins prestigious Data Centre Solutions Technology Award",
        "sourceType": "industry-report",
        "publisher": "MSP Channel / Digitalisation World",
        "date": "2025-05-30",
        "excerpt": "The award went to the Panduit G6 Power Distribution Unit... underlines the best-in-class, low profile form factor and enhanced onboard intelligence required in the latest iterations of data centre compute cabinets.",
        "url": "https://www.msp-channel.com/news/69994/panduit-wins-prestigious-data-centre-solutions-technology-award",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "A channel share study or set of CE distributor/operator interviews quantifying what fraction of PDU spend actually flows through OEM/integrator white-label channels contestable by a regional manufacturer — this is a knowable fact about today's channel structure, not a future event.",
    "proposedCorrection": {
      "nodeId": "cust.oem",
      "value": 0.05,
      "low": 0,
      "high": 0.1,
      "rationale": "If the OEM/integrator channel is structurally locked to low-cost Asian ODMs on unit cost, most of the 22% is not serviceable for a Central European entrant, so the addressable slice should be marked down to a small cost-insensitive/feature-driven residual."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 16/20 · E[ΔYAM] −€0.53M · engine ΔYAM −€1.06M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.europe-share-arithmetic-ghost.json
  {
    "id": "risk.definition-scopedown.europe-share-arithmetic-ghost",
    "title": "Europe's PDU share is likely 24%, not the 30% assumed",
    "narrative": "The model builds its €320M chain by taking 30% of GVR's $2.81B global figure as Europe's share. But no source states that 30%, and the regional data points lower: the US alone is $579.7M of a $2.1B market, about 28% for one country. If Europe is closer to 24%, the Year-1 number and everything below it shrinks.",
    "category": "fact",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "The 30% Europe share is unsourced; GVR gives only 38% for North America → US alone is 28% of the global market, and Germany grows at half the global rate → Europe at 24% shrinks the whole chain and SAM/YAM proportionally",
    "whyMissable": "The 30% hop looks sourced because it sits beside a real Grand View citation, but that citation only covers the 38% North America share.",
    "falsifier": "Any primary source stating Europe's rack-PDU revenue share at 28% or higher, such as the Omdia Rack PDU Annual Tracker regional table.",
    "likelihood": {
      "value": 0.5,
      "basis": "evidence",
      "rationale": "Every regional datapoint in the corpus points below 30% for Europe, so the direction is evidenced. But no source directly measures Europe's rack-PDU share, so the exact 24% figure stays unobserved."
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "scale",
        "value": 0.8,
        "note": "Europe share 30% → ~24% of the global rack-PDU base"
      }
    ],
    "indicators": [
      {
        "signal": "Regional revenue split in the next Omdia Rack PDU Annual Market Analysis or GVR report edition",
        "where": "Omdia rack-PDU tracker (2025 update) regional tables; Grand View Research report refresh",
        "threshold": "Europe stated at <27% of global rack-PDU revenue",
        "updates": "increases"
      },
      {
        "signal": "EMEA vs Americas revenue mix for rack-power product lines in incumbent segment reporting",
        "where": "Vertiv 10-K segment disclosures; Legrand universe-by-region commentary in annual results",
        "threshold": "EMEA rack-power growth persistently below Americas by >4pp",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission the IndexBox EU Rack PDUs report ($4,000) to replace the inferred Europe share with a directly-scoped EU headline figure",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "Named in the ledger as the promotion path; collapses the unsourced 30% hop entirely"
      },
      {
        "action": "Rebuild tamBase bottom-up from CE energized MW × PDUs-per-rack × ASP, bypassing the global-share hop altogether",
        "type": "operational",
        "note": "A capacity-intensity build needs no regional revenue share and cross-checks the top-down chain"
      }
    ],
    "evidence": [
      {
        "title": "Data Center Rack Power Distribution Unit Market Report 2033",
        "sourceType": "industry-report",
        "publisher": "Grand View Research",
        "excerpt": "North America held 38.0% revenue share of the global data center rack power distribution unit market. ... Asia Pacific: Fastest grow[ing]",
        "url": "https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market",
        "attached": true
      },
      {
        "title": "Intelligent PDU — Global Strategic Business Report",
        "sourceType": "analyst-estimate",
        "publisher": "Global Industry Analysts",
        "date": "2025-10-01",
        "excerpt": "The Intelligent PDU market in the U.S. is estimated at US$579.7 Million in the year 2024. ... Within Europe, Germany is forecast to grow at approximately 5.2% CAGR.",
        "url": "https://www.marketresearch.com/Global-Industry-Analysts-v1039/Intelligent-PDU-42596267/",
        "attached": true
      },
      {
        "title": "Intelligent PDU Market Size, Share & 2030 Trends Report",
        "sourceType": "industry-report",
        "publisher": "Mordor Intelligence",
        "date": "2025-08-06",
        "excerpt": "Fastest Growing Market | Asia Pacific | ... Largest Market | North America",
        "url": "https://www.mordorintelligence.com/industry-reports/intelligent-pdu-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A primary regional revenue table for the data-center rack-PDU market (e.g., GVR's own regional breakdown, Omdia Rack PDU Annual Tracker, or the IndexBox EU Rack PDUs report) stating Europe's share of the global rack-PDU base as of 2025. This is a purchasable/existing dataset that fixes today's number, not something only time reveals.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 256,
      "low": 205,
      "high": 416,
      "rationale": "Applying a 24% Europe share (vs. the unsourced 30%) to the $2.81B global base scales the €320M chain and its band down by ~0.8× to ~€256M."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: competitive-foreclosure · judge 16/20 · E[ΔYAM] −€0.49M · engine ΔYAM −€1.63M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.legrand-dual-brand-intelligent-pdu-lock.json
  {
    "id": "risk.competitive-foreclosure.legrand-dual-brand-intelligent-pdu-lock",
    "title": "One owner controls two top PDU brands, shrinking reachable market",
    "narrative": "The model assumes the top three vendors hold 55% of the market, treating Raritan and Server Technology as separate rivals. But Legrand owns both, and in the intelligent-PDU market this venture targets, that gives one owner the two pioneer brands whose monitoring is wired into operators' systems. Swapping a PDU means re-integrating that monitoring layer, so incumbents keep renewals. This pushes the truly serviceable fraction below the model's 0.45 low edge, cutting the Year-1 number.",
    "category": "fact",
    "targetNodes": [
      "serviceableFactor"
    ],
    "mechanism": "Vendor lists show Raritan and Server Technology as separate; Legrand owns both. → PDUs plug into monitoring stacks, so replacements renew with the incumbent. → Adding integration lock drops serviceable fraction below the 0.45 low edge.",
    "whyMissable": "The vendor lists name the two Legrand brands separately, and the serviceable haircut was framed as regulatory only, so the software-integration lock never made the list.",
    "falsifier": "An Omdia 2025 table showing intelligent-PDU concentration at or below the whole-market level, or operator interviews confirming open protocols make mixing vendors routine.",
    "likelihood": {
      "value": 0.3,
      "basis": "evidence",
      "rationale": "Legrand's dual-brand ownership is confirmed and DCIM stickiness is well documented, but the locked share of replacement demand is unquantified. Open standards like Redfish and SNMP counter the magnitude, so confidence is modest at 0.30."
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.38,
        "note": "Regulatory haircut plus DCIM/API integration-locked replacement sockets removed from reachable scope — below the model's 0.45 low edge"
      }
    ],
    "indicators": [
      {
        "signal": "Integration requirements in CE retrofit/replacement RFQs (incumbent-compatible APIs or named DCIM suites specified as mandatory)",
        "where": "CE colocation and enterprise retrofit tender documents; DCIM vendor compatibility matrices",
        "threshold": "≥50% of retrofit RFQs specify compatibility with an incumbent's management ecosystem as a hard requirement",
        "updates": "increases"
      },
      {
        "signal": "Legrand commentary on Raritan + Server Technology portfolio consolidation and cross-sell/renewal rates in the data-center segment",
        "where": "Legrand capital-markets day and quarterly earnings calls, data-center division commentary",
        "threshold": "Explicit claims of installed-base renewal advantage or unified intelligent-PDU platform strategy",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Acquire the Omdia rack-PDU vendor-share table (2024 base) to establish the true intelligent-PDU sub-market concentration and the size of the incumbent-locked installed base",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "The named promotion path for the CR3 estimate also directly sizes the integration-locked haircut on serviceable share"
      },
      {
        "action": "Ship with native Redfish/SNMP plus certified integrations for the top-3 DCIM suites before launch, so incumbent-ecosystem compatibility is a checkbox rather than a disqualifier",
        "type": "operational"
      },
      {
        "action": "Target greenfield mid-market and colocation builds where no DCIM standard is entrenched, and lead with the management layer rather than the hardware",
        "type": "strategic",
        "note": "Where the stack is not yet chosen, the lock works for whoever arrives first"
      }
    ],
    "evidence": [
      {
        "title": "Legrand, North and Central America Expands Data Power and Control Capabilities with the Acquisition of Server Technology, Inc.",
        "sourceType": "industry-report",
        "publisher": "Legrand",
        "date": "2017-11-02",
        "excerpt": "Server Technology will become part of LNCA’s Data Center Power and Control division, which also includes Raritan. Both the Server Technology and Raritan businesses will continue to operate independently.",
        "url": "https://www.legrand.us/about-us/newsroom/press/legrand-acquires-server-technology",
        "attached": true
      },
      {
        "title": "Protocol Diversity in Data Centers: DCIM Solutions",
        "sourceType": "industry-report",
        "publisher": "Modius, Inc.",
        "date": "2024-12-17",
        "excerpt": "DCIM normalizes data across protocols and vendors into a unified, real-time operational view... Vendor-locked tools fragment visibility across systems.",
        "url": "https://modius.com/blog/simplifying-data-center-operations-how-modius-opendata-tackles-protocol-diversity/",
        "attached": true
      },
      {
        "title": "Intelligent PDU Market Size, Share & 2030 Trends Report",
        "sourceType": "analyst-estimate",
        "publisher": "Mordor Intelligence",
        "date": "2025-08-06",
        "excerpt": "Market Concentration | Medium — intelligent PDU market USD 3.52 billion in 2025.",
        "url": "https://www.mordorintelligence.com/industry-reports/intelligent-pdu-market",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "An Omdia or Mordor intelligent-PDU vendor-share table showing Legrand-owned Raritan + Server Technology combined share, plus the top-3 concentration measured on the intelligent-PDU segment specifically — an existing purchasable dataset that settles today's concentration figure.",
    "proposedCorrection": {
      "nodeId": "serviceableFactor",
      "value": 0.4,
      "low": 0.3,
      "high": 0.5,
      "rationale": "Consolidating Raritan and Server Technology under one owner raises effective top-vendor concentration and adds monitoring-integration switching costs, lowering the reachable serviceable fraction below the current 0.45 low edge."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: ledger-self-audit · judge 18/20 · E[ΔYAM] −€0.48M · engine ΔYAM −€1.06M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.ledger-self-audit.statista-scale-colo-scope-inflation.json
  {
    "id": "risk.ledger-self-audit.statista-scale-colo-scope-inflation",
    "title": "One vendor's colo definition inflates the European market base",
    "narrative": "The model builds every geography and the 39.8% Central-Europe share of tamBase from a single Statista series. But adding up Statista's 2024 country figures gives about 7.6GW, more than CBRE's 5.8GW for all of Europe. If that series counts capacity that isn't really there, tamBase is sized too high.",
    "category": "fact",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "Statista's country colo figures use an unverified, unmatched scope → PMR data shows the region roughly five times smaller → Fixing the scope shrinks the Central-Europe slice and tamBase",
    "whyMissable": "Each geography carries a cross-check, but every check uses a different scope, and forcing the shares to add to one hides any error in the absolute level.",
    "falsifier": "A second vendor such as DC Byte or CBRE reproducing Statista's per-country 2025 colocation MW within about 15% under an identical definition.",
    "likelihood": {
      "value": 0.45,
      "basis": "evidence",
      "rationale": "CBRE's figures confirm the sum exceeds the total, and Statista's own note admits 'scale colocation' includes powered shells that would not buy racks as modeled. It stays below certainty because no source reproduces per-country MW under one definition to pin the tamBase impact."
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "scale",
        "value": 0.8,
        "note": "CE-of-Europe factor recomputed on a CBRE-consistent colocation scope; geo shares left intact since normalization absorbs the per-country error"
      }
    ],
    "indicators": [
      {
        "signal": "CBRE Europe Data Centres quarterly country/market supply figures vs Statista's same-year per-country values",
        "where": "CBRE 'Europe Data Centres Figures' quarterly PDF releases (Frankfurt, Amsterdam, Warsaw, Zurich, Vienna market pages)",
        "threshold": "CBRE country supply persistently <60% of Statista's figure for the same country and year",
        "updates": "increases"
      },
      {
        "signal": "Country-level MW tables from the gated EUDCA 'State of European Data Centres 2026' report",
        "where": "EUDCA report release and member briefings",
        "threshold": "EUDCA CE country totals implying CE-7 <30% of Europe on a consistent scope",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Purchase one scope-consistent second dataset (DC Byte or CBRE country series) and recompute the CE-of-Europe factor and all seven geo shares from a single definition",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "One dataset fixes both the hidden multiplier in tamBase and the geo axis simultaneously — highest structural VOI per euro after the IndexBox report"
      },
      {
        "action": "Rebuild the TAM bottom-up from energized (not contracted) MW × rack count per MW × PDU €/rack, making the capacity-class assumption explicit instead of inherited",
        "type": "operational",
        "note": "Immunizes the model against any vendor's colo/scale-colo/self-build definition drift"
      }
    ],
    "evidence": [
      {
        "title": "Colocation data center investment Europe 2031 (methodology note defining scale colocation)",
        "sourceType": "industry-report",
        "publisher": "Statista",
        "date": "2026-02-06",
        "excerpt": "The source defines scale colocation data centers as \"very large facilities that are built-to-scale and/or powered shells by colocation data center operators; typically, 20 MW.\"",
        "url": "https://www.statista.com/statistics/1659983/colocation-data-center-investment-europe/",
        "attached": true
      },
      {
        "title": "Europe Data Centres Figures Q4 2024",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2025-02",
        "excerpt": "4,726MW European colocation supply 470MW European colocation availability 341MW European colocation take-up",
        "url": "https://assoimmobiliare-be.afterpixel.com/app/uploads/2025/02/Europe-Data-Centres-Figures-Q4-2024.pdf",
        "attached": true
      },
      {
        "title": "European Data Centres Overview",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2024-07-22",
        "excerpt": "5.8GW Data centre capacity expected across Europe by the end of 2024",
        "url": "https://www.cbre.com/insights/reports/european-data-centres-overview",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "Cross-vendor reconciliation of European colocation MW today: CBRE Q4 2024 (4,726MW operational / 5.8GW year-end) vs. summed Statista 2024 country figures (~7.6GW) under a matched scope definition. This is a purchasable/existing-dataset comparison that settles whether the Statista series double-counts or uses an incompatible scope — no time needs to pass.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 245,
      "low": 180,
      "high": 400,
      "rationale": "Statista's ~7.6GW European base overstates CBRE's ~5.8GW by ~1.3x, so the Central-Europe MW share and the resulting rack-PDU base should be scaled down by roughly that factor (320→~245), with the band shifted down correspondingly."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 17/20 · E[ΔYAM] −€0.34M · engine ΔYAM −€0.66M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.crosscheck-ceiling-contamination.json
  {
    "id": "risk.definition-scopedown.crosscheck-ceiling-contamination",
    "title": "The €495M cross-check ceiling measures a rival market, not ours",
    "narrative": "The model uses a €495M ceiling to justify the top of its market band, worth an extra €3.3M in Year 1. But that figure grows at 21% a year, while every rack-PDU source shows 5.4 to 9.8%. That fast growth belongs to a substitute technology the model is supposed to exclude, so the band's upside is not real.",
    "category": "model-structure",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "The €495M ceiling base grows 21.23% yearly, far above rack-PDU rates. → Extra growth comes from the excluded power-shelf substitute; the 55% share is unsourced. → The real range is €240 to 320; the €520 edge is false upside.",
    "whyMissable": "The cross-check is labeled as broader scope, so its wide band reads as honest uncertainty rather than a different market at one edge.",
    "falsifier": "BIS/R&M segmentation showing the PDU-only segment at 55% or more of the category and growing 10% CAGR or less.",
    "likelihood": {
      "value": 0.52,
      "basis": "evidence",
      "rationale": "The growth mismatch is arithmetic and visible in the cited excerpts, and the 55% share is admitted as unsourced. The open question is how much of the excess growth is substitute revenue versus report optimism, raising likelihood from 0.45 to 0.52."
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "set",
        "value": 280,
        "note": "Recentre on the primary scope-down chain after discarding the contaminated €495M ceiling; effective distribution 240–320"
      }
    ],
    "indicators": [
      {
        "signal": "Sub-segment split (PDU vs PSU/power shelf) and per-segment CAGRs in the BIS Europe report sample pages or ToC",
        "where": "Research and Markets / giiresearch listing pages for the Europe PDUs+PSUs report; BIS Research sample-request materials",
        "threshold": "PSU/shelf sub-segment shown growing >20% while PDU sub-segment grows <10%",
        "updates": "increases"
      },
      {
        "signal": "Divergence between broad 'data center PDU' category growth and rack-PDU-only growth across publisher updates",
        "where": "MarketsAndMarkets Data Center PDU report refreshes vs Mordor/GVR rack-PDU-only refreshes",
        "threshold": "Broad-scope CAGR remaining ≥2x rack-PDU-only CAGR in 2026 editions",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Buy the BIS Europe PDUs+PSUs report's segmentation tables (or sample pages) to decompose the 21.23% growth and either validate or retire the €495M ceiling",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "Cheapest way to determine whether the band's upside exists at all"
      },
      {
        "action": "Size the Year-1 operating plan (inventory commitments, hires) against the primary-chain band 240–320, treating anything above 320 as unfunded upside",
        "type": "operational",
        "note": "Removes the contaminated edge from capital decisions without waiting for the report"
      }
    ],
    "evidence": [
      {
        "title": "Europe Data Center Power Distribution Units and Power Supply Units Market — 2025-2035",
        "sourceType": "industry-report",
        "publisher": "BIS Research (via GII Research)",
        "date": "2025-07-14",
        "excerpt": "The Europe data center PDUs and PSUs market is projected to reach $20,056.7 million by 2035 from $2,455.7 million in 2024, growing at a CAGR of 21.23% during the forecast period 2025-2035.",
        "url": "https://www.giiresearch.com/report/bis1769473-europe-data-center-power-distribution-units-power.html",
        "attached": true
      },
      {
        "title": "Data Center PDUs & PSUs Market to Reach $73,376.5 Mn by 2035",
        "sourceType": "industry-report",
        "publisher": "BIS Research",
        "date": "2025-09-08",
        "excerpt": "PSUs convert and regulate electricity for IT hardware, including AC/DC and DC/DC converters, voltage regulator modules (VRMs), and hot-swap modules — indicating the category bundles DC-power/substitute layers beyond rack PDUs.",
        "url": "https://bisresearch.com/insights/data-center-power-distribution-units-and-power-supply-units-market-to-reach-73376-mn-dollar-by-2035",
        "attached": true
      },
      {
        "title": "Rack-Level DC Power Shelf & OCP Power Architecture growth benchmarks",
        "sourceType": "triangulation",
        "publisher": "ResearchIntelo / DataIntelo / MarketsandMarkets",
        "date": "2025-10-01",
        "excerpt": "Rack-Level DC Power Shelf 10.5% CAGR; OCP ORv3 13.1% CAGR; OCP rack 21.0% CAGR — substitute/DC-power architectures grow far above the 5.4–9.8% rack-PDU-only band, consistent with the 21.23% category signature.",
        "url": "https://researchintelo.com/report/rack-level-dc-power-shelf-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "BIS/R&M segmentation of the Europe DC PDUs+PSUs $2.45B category showing the rack-PDU-only sub-segment share and its CAGR — a purchasable report line that settles whether the €495M cross-check measures rack-PDU or the broader PDU+PSU/DC-power category today.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 300,
      "low": 240,
      "high": 360,
      "rationale": "The €495M ceiling derives from a broader PDU+PSU category growing 21.23% (substitute/DC-power layers included), not rack-PDU-only which grows 5.4–9.8%; removing that scope-mismatched ceiling lowers the band top from €520 to ~€360 anchored on the directly-scoped rack-PDU scope-down (€310–320)."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: regulatory-gauntlet · judge 17/20 · E[ΔYAM] −€0.30M · engine ΔYAM −€0.95M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.eichrecht-metering-foreclosure.json
  {
    "id": "risk.regulatory-gauntlet.eichrecht-metering-foreclosure",
    "title": "German metering law blocks the PDU's billing feature in its biggest market",
    "narrative": "The model assumes the PDU's per-outlet metering can be sold across Germany, which is half the funnel. But in Germany any meter whose reading becomes an invoice must be certified under a separate metering law, and the entrant lacks that certification. That demotes its metering to indicative only and cuts reach in the German half, so the Year-1 number is too high.",
    "category": "boundary",
    "targetNodes": [
      "serviceableFactor",
      "geo.DE"
    ],
    "mechanism": "German colo billing on measured kWh needs legally-verified meters; the PDU lacks certification → Germany is half the funnel; certified rivals win the metered-billing use case → Reach is overstated; certification takes 12 to 18 months, past Year 1",
    "whyMissable": "The team checked product-safety and energy law but missed metering law, which only bites once the meter reading becomes an invoice.",
    "falsifier": "German colo specs and billing interviews showing tenant power is billed at facility feed meters, with PDU metering treated as informational only.",
    "likelihood": {
      "value": 0.32,
      "basis": "evidence",
      "rationale": "The legal requirement is certain; the open question is how much German colo billing rides on PDU-level metering versus upstream branch meters. Evidence confirms the legal rule but suggests billing often sits at branch level, so the likelihood stays near the prior with a slight uptick."
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "scale",
        "value": 0.82,
        "note": "billing-grade metered deployments in DE (and DE-influenced procurement in AT/CH) drop out of the Year-1 reachable set"
      }
    ],
    "indicators": [
      {
        "signal": "'Eichrechtskonform'/MID-certified metering requirements appearing in DE colo fit-out RFQs",
        "where": "TED notices; Frankfurt/Berlin colocation fit-out RFQs and operator technical specifications",
        "threshold": "metering-certification clauses in ≥2 DE colo tenders",
        "updates": "increases"
      },
      {
        "signal": "Incumbent PDU vendors marketing legally-certified metering options",
        "where": "Bachmann, Rittal, Legrand/Raritan German price lists and datasheets",
        "threshold": "≥2 major vendors adding MID/Eichrecht-certified metering SKUs",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a legal-metrology opinion plus 5 structured interviews on DE colo billing practice (where in the power chain is the invoice anchored?)",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "cheap, fast, and decisive for whether the foreclosure is real"
      },
      {
        "action": "Reposition outlet metering as capacity-management/DCIM telemetry (not billing) and partner with a certified branch-meter vendor for billing use cases",
        "type": "strategic"
      },
      {
        "action": "Start the PTB/notified-body type-examination path in parallel with launch so the billing-grade SKU lands in Year 2",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "Messung für Abrechnung – Planungskompendium Energieverteilung (Schneider Electric)",
        "sourceType": "industry-report",
        "publisher": "Schneider Electric / electrical-installation.org",
        "excerpt": "In Deutschland sind Seit 1. Januar 2015 das Mess- und Eichgesetz (MessEG) und die Mess- und Eichverordnung (MessEV) in Kraft ... Sie sind von allen Verwendern von Messgeräten zu beachten, die Messgeräte im geschäftlichen ... Verkehr ... verwenden.",
        "url": "https://de.electrical-installation.org/dewiki/Messung_f%C3%BCr_Abrechnung",
        "attached": true
      },
      {
        "title": "Zwischenzähler für Strom",
        "sourceType": "industry-report",
        "publisher": "Bau Szene",
        "date": "2025-12-16",
        "excerpt": "Wer Strom gegen Geld abrechnet, muss zwingend einen geeichten Zähler verwenden (MID-Konformität). Ungenaue oder abgelaufene Zähler sind für Abrechnungen unzulässig.",
        "url": "https://bau-szene.de/zwischenzahler-fur-strom/",
        "attached": true
      },
      {
        "title": "Data Center Sub Metering: Precise Multi-Tenant Billing",
        "sourceType": "industry-report",
        "publisher": "matismart.com",
        "date": "2026-06-03",
        "excerpt": "By placing measurement modules at the RPP or inside the busway tap-off boxes, you can track the exact kWh consumption of each tenant. Consequently, your finance team can generate accurate, usage-based invoices.",
        "url": "https://matismart.com/data-center-sub-metering-precise-multi-tenant-billing/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "German colo billing practice: whether tenant power is invoiced at facility-feed/RPP MID-certified meters with PDU metering treated as informational — settleable today via German colo billing specs, MessEG/MID applicability docs, and a handful of operator billing interviews.",
    "proposedCorrection": {
      "nodeId": "serviceableFactor",
      "value": 0.45,
      "low": 0.38,
      "high": 0.55,
      "rationale": "If measured-kWh billing in Germany legally requires MID/MessEG-certified meters the entrant lacks, the metered-billing use case in the German half (~50% of funnel) is unreachable in Year 1, lowering the serviceable share from 0.55 toward the low end."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: boundary-substitution · judge 18/20 · E[ΔYAM] −€0.25M · engine ΔYAM −€0.63M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.large-operator-channel-forecloses-to-odm.json
  {
    "id": "risk.boundary-substitution.large-operator-channel-forecloses-to-odm",
    "title": "Large operators are buying whole racks, not the PDUs we sell",
    "narrative": "The model assumes the venture sells PDUs direct to large operators, its biggest buyer at a 0.40 weight. But large operators now buy AI-density capacity as whole racks from integrators, where the PDU is just a line item locked to incumbents under multi-year deals. That demand moves to a channel the venture cannot sell through, so the Year-1 direct-sale pool is overstated.",
    "category": "competitive",
    "targetNodes": [
      "cust.operator-large"
    ],
    "mechanism": "Large operators now buy AI capacity as integrated racks, not separate PDUs. → Rack PDU slots go to incumbents like Schneider under long deals. → The 0.40 direct-sale pool is partly unreachable, so it overstates Year-1.",
    "whyMissable": "The team will try to verify whether 0.40 is the right number, but the real issue is that the line between buying PDUs direct and buying whole racks is moving during the entry window, so even a correct 2025 split is soon wrong.",
    "falsifier": "Procurement records from 2–3 large operators showing PDUs still tendered as a discrete direct-purchase line, operator-selected, for their 2026–27 capacity including AI-density halls.",
    "likelihood": {
      "value": 0.4,
      "basis": "evidence",
      "rationale": "Integrated-rack buying is documented for hyperscale AI and the buyer-mix has no evidence to resist the shift. But European colo operators still run discrete PDU bids, so migration is real but not total within 12 months."
    },
    "perturbation": [
      {
        "nodeId": "cust.operator-large",
        "op": "set",
        "value": 0.28,
        "note": "Portion of large-operator PDU spend relocates into integrator BOMs foreclosed to a new entrant — absolute shrink of the directly-winnable pool, below the ledger's 0.33 band floor"
      }
    ],
    "indicators": [
      {
        "signal": "Procurement structure in large-operator capacity programs (discrete PDU RFQs vs integrated rack packages)",
        "where": "TED (EU tender platform) for operator framework agreements; Equinix/Digital Realty/NTT procurement supplier-onboarding portals and capex call commentary",
        "threshold": "A major CE operator consolidating rack power into an integrated-rack or fit-out-contractor package for the first time",
        "updates": "increases"
      },
      {
        "signal": "ODM/integrator rack-scale revenue and PDU white-label announcements",
        "where": "OCP Global Summit sponsor/deployment talks; Foxconn/Quanta/Wiwynn investor updates on rack-scale system revenue; Legrand/Vertiv OEM-agreement press releases",
        "threshold": "Rack-scale integrated systems revenue at major ODMs growing >30% YoY with named European deployments",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run the 3 planned CE operator/distributor interviews with an explicit procurement-structure module: what share of 2026-27 PDU spend is discrete RFQ vs integrator BOM, and who signs off the vendor",
        "type": "information",
        "voiNodeId": "cust.operator-large",
        "note": "Upgrades the ledger's existing promotion path from 'validate the split' to 'validate the split and its direction of travel'"
      },
      {
        "action": "Open a parallel OEM/integrator qualification track (design-in with one rack integrator serving CE colo builds) so the relocating demand remains reachable",
        "type": "strategic",
        "note": "Hedges the Year-1 direct motion; cust.oem is 0.22 of the buyer mix and currently has no channel plan against it"
      },
      {
        "action": "Negotiate evaluation MOUs with 2 large operators that name the venture's PDU as an approved alternate in their fit-out contractor specs",
        "type": "contractual",
        "note": "Keeps the venture spec-listed even where purchasing is delegated to integrators"
      }
    ],
    "evidence": [
      {
        "title": "Schneider Electric and Foxconn announce strategic collaboration to accelerate next-generation AI data centers",
        "sourceType": "industry-report",
        "publisher": "Schneider Electric / GlobeNewswire",
        "date": "2026-06-15",
        "excerpt": "brings together Foxconn’s unmatched expertise in advanced compute platforms, AI rack integration, and global manufacturing with Schneider Electric’s leadership in power systems... to deliver integrated, ready-to-deploy solutions",
        "url": "https://www.globenewswire.com/news-release/2026/06/15/3311506/0/en/Schneider-Electric-and-Hon-Hai-Technology-Group-Foxconn-announce-strategic-collaboration-to-accelerate-next-generation-AI-data-centers.html",
        "attached": true
      },
      {
        "title": "Wiwynn: The Heavy Metal Behind AI",
        "sourceType": "analyst-estimate",
        "publisher": "Silba Deep Dives",
        "date": "2026-01-31",
        "excerpt": "The hyperscalers... had stopped shopping for branded boxes. They wanted stripped-down designs, tuned to their specific workloads and priced without the markup",
        "url": "https://silbadeepdives.substack.com/p/6669-wiwynn-the-heavy-metal-behind",
        "attached": true
      },
      {
        "title": "Jarvis Ki Inferenz tender — Rack Infrastructure including PDU and CDU",
        "sourceType": "industry-report",
        "publisher": "Forschungszentrum Jülich / GlobalTenders",
        "date": "2026-07-01",
        "excerpt": "Rack Infrastructure, Including Power Distribution Units (Pdu) And Cooling Distribution Units (Cdu) Optimized For The Offered It Equipment",
        "url": "https://www.globaltenders.com/tender-detail/jarvis-eine-zentrale-plattform-f%C3%BCr-ki-infer-b3IRfCnbzDpiNXn3",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "Procurement records or channel-mix data from 2–3 large operators showing what share of their 2026–27 PDU spend (including AI-density halls) is tendered as discrete, operator-selected direct-purchase lines versus embedded in integrator/incumbent rack deals. This is a purchasable/knowable fact about today's channel structure, not a future event.",
    "proposedCorrection": {
      "nodeId": "cust.operator-large",
      "value": 0.28,
      "low": 0.2,
      "high": 0.36,
      "rationale": "If a material share of large-operator AI-density capacity is bought as integrated racks with PDU slots locked to incumbents, the reachable direct-sale pool is smaller than the 0.40 derived from 'large operators buy direct.'"
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: regulatory-gauntlet · judge 16/20 · E[ΔYAM] −€0.24M · engine ΔYAM −€0.63M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.nis2-avl-gate-large-operators.json
  {
    "id": "risk.regulatory-gauntlet.nis2-avl-gate-large-operators",
    "title": "EU security rules gate large operators, cutting Year-1 channel",
    "narrative": "The model assumes large operators are the first channel, worth 40% of the buyer mix. But under NIS2, in force in Germany, these operators must demand ISO 27001 and IEC 62443 proof from vendors, and a pre-launch entrant holds none of it. So the reachable large-operator slice in Year 1 is far smaller than 40%.",
    "category": "execution",
    "targetNodes": [
      "cust.operator-large"
    ],
    "mechanism": "NIS2 makes large operators demand vendor security certifications for networked gear. → Uncertified new entrant fails approved-vendor onboarding, sales shift to integrators. → Reachable large-operator share in Year 1 is well below 40%.",
    "whyMissable": "NIS2 regulates operators not vendors, so it never shows on a vendor checklist and arrives as a procurement questionnaire after two quarters are gone.",
    "falsifier": "Onboarding documents from two or more large operators showing rack-power vendors admitted on self-declaration without ISO 27001 or IEC 62443.",
    "likelihood": {
      "value": 0.38,
      "basis": "evidence",
      "rationale": "Large regulated buyers in finance, telecom and energy have all turned their own compliance duties into supplier certification demands, and NIS2 makes operators the next case. Direct evidence (STACK) shows some onboarding runs on self-declaration, so a slight downward nudge applies."
    },
    "perturbation": [
      {
        "nodeId": "cust.operator-large",
        "op": "set",
        "value": 0.28,
        "note": "the certified-AVL-gated portion of large-operator PDU spend is unreachable for an uncertified entrant in the entry window — absolute shrink of this slice, not a mix shift"
      }
    ],
    "indicators": [
      {
        "signal": "Security-certification prerequisites in operator supplier-registration portals",
        "where": "Equinix/NTT/Vantage/Data4 supplier onboarding portals; TED procurement notices for DC fit-outs",
        "threshold": "ISO 27001 or IEC 62443 listed as mandatory for connected facility equipment",
        "updates": "increases"
      },
      {
        "signal": "National NIS2 transposition guidance explicitly covering facility/OT equipment supply chains",
        "where": "BSI (Germany) NIS2 guidance dockets; NCSC-NL publications",
        "threshold": "guidance naming power/facility equipment vendors within supply-chain risk scope",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run the 3 structured CE operator/distributor procurement interviews already named as this node's promotion path, specifically probing AVL security prerequisites",
        "type": "information",
        "voiNodeId": "cust.operator-large",
        "note": "replaces the unsourced 0.40 with a gate-adjusted, sourced buyer mix"
      },
      {
        "action": "Enter Year 1 via OEM/integrator channel whose certifications and AVL status wrap the product; treat direct large-operator sales as a Year-2 motion",
        "type": "strategic"
      },
      {
        "action": "Begin a scope-limited ISO 27001 certification (product development and vulnerability handling) immediately — 9–12 months lead time means starting now or missing the window",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "NIS2 Article 21(2)(d) Is Changing Your B2B Contracts: A Supplier's Guide",
        "sourceType": "industry-report",
        "publisher": "NIS2-Templates.com",
        "date": "2026-05-27",
        "excerpt": "Your EU customer just sent a security addendum and a 30-question cybersecurity questionnaire... suddenly someone is asking whether you have ISO 27001 certification and a 24-hour incident notification procedure.",
        "url": "https://www.nis-2-templates.com/for-suppliers/",
        "attached": true
      },
      {
        "title": "Declaration for Critical Vendors",
        "sourceType": "industry-report",
        "publisher": "STACK Infrastructure",
        "date": "2024-02",
        "excerpt": "The purpose of the declaration is to gather relevant information regarding potential Critical Vendors considered by STACK Infrastructure... We kindly ask you to fill in this form and return it together with documentation requested",
        "url": "https://www.stackinfra.com/wp-content/uploads/2022/02/Declaration-for-Critical-Vendors.pdf",
        "attached": true
      },
      {
        "title": "Cyber Rules for Essential and Important Entities Take Effect in Germany (NIS2 Implementing Law)",
        "sourceType": "industry-report",
        "publisher": "Mayer Brown",
        "date": "2025-12-15",
        "excerpt": "The national law implementing the NIS2 Directive in Germany entered into force on 6 December 2025. In-scope entities... require timely action.",
        "url": "https://www.mayerbrown.com/en/insights/publications/2025/12/cyber-rules-for-essential-and-important-entities-take-effect-in-germany-nis2-implementing-law",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only observing how large operators actually onboard an uncertified pre-launch entrant over Year 1 settles this — whether they enforce ISO 27001/IEC 62443 as a hard gate or admit on self-declaration/conditional waivers. NIS2 being in force today does not settle vendor onboarding behavior, which unfolds through each operator's procurement response over the coming 12-24 months.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: demand-discontinuity · judge 18/20 · E[ΔYAM] −€0.13M · engine ΔYAM −€0.21M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.demand-discontinuity.stock-flow-geo-misprice.json
  {
    "id": "risk.demand-discontinuity.stock-flow-geo-misprice",
    "title": "NL geo share too high: Dutch ban redirects new-build revenue",
    "narrative": "The model sets the Netherlands at 28% of geographic share, based on a 2025 installed-capacity snapshot. But a pre-launch entrant sells into new build-outs, and since early 2024 the Netherlands bans new hyperscale data centres outside two municipalities. Weighting Year-1 sales at a 0.28 NL share points the venture at the geography commissioning the least new capacity, so the Year-1 number is skewed toward the wrong market.",
    "category": "model-structure",
    "targetNodes": [
      "geo.NL",
      "geo.PL",
      "geo.other"
    ],
    "mechanism": "Since early 2024 the Netherlands bans new large hyperscale sites. → New fit-out flow shifts to Germany, Poland and CEE instead. → Year-1 demand tracks new capacity, so NL's 0.28 overstates it.",
    "whyMissable": "The NL node looks safest because two sources agree within 3%, but both measure standing stock, which is the wrong quantity for a Year-1 revenue model.",
    "falsifier": "DDA's 2026 State of the Dutch Data Centers showing NL colocation additions at or above 28% of total CE-7 additions for the year.",
    "likelihood": {
      "value": 0.62,
      "basis": "evidence",
      "rationale": "The ban, the Amsterdam connection cap, and Cushman & Wakefield's investment-shifting statement are all in force today, so the direction is clear. DDA 2026 shows NL growth trailing the European average, though the two exempt municipalities and retrofit keep some NL flow alive."
    },
    "perturbation": [
      {
        "nodeId": "geo.NL",
        "op": "set",
        "value": 0.18,
        "note": "NL flow share well below its stock share given the ban and connection cap"
      },
      {
        "nodeId": "geo.PL",
        "op": "set",
        "value": 0.11,
        "note": "Poland absorbs a larger share of window-period additions"
      },
      {
        "nodeId": "geo.other",
        "op": "set",
        "value": 0.05,
        "note": "CEE tail (esp. Romania) takes redirected flow; net effect is a modest TAM haircut plus a mix shift"
      }
    ],
    "indicators": [
      {
        "signal": "NL colocation capacity additions vs CE-7 additions",
        "where": "Dutch Data Center Association annual State of the Dutch Data Centers report",
        "threshold": "NL additions <15% of CE-7 additions in 2026",
        "updates": "increases"
      },
      {
        "signal": "Exemption-zone activity (Eemshaven, Agriport) vs rest-of-NL permitting",
        "where": "Het Hogeland / Hollands Kroon municipal permit registers; DC Byte Amsterdam market updates",
        "threshold": "No new non-exempt NL hyperscale permits granted in 2026",
        "updates": "increases"
      },
      {
        "signal": "Poland/CEE commissioning announcements",
        "where": "PMR Poland data-center market updates; Atman/Data4/Vantage Warsaw press releases",
        "threshold": "≥100 MW of new CE-east commissionings announced for 2026–27",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Rebuild the geography weights on a 2026–27 additions basis (announced commissioning MW per country) instead of installed stock, and re-run the funnel",
        "type": "information",
        "voiNodeId": "geo.NL",
        "note": "One analyst-week using DC Byte/C&W pipeline data; directly re-prices the NL/PL/CEE mix"
      },
      {
        "action": "Sequence go-to-market coverage Frankfurt-first, Warsaw-second, and treat NL as a retrofit-only territory in Year 1",
        "type": "strategic",
        "note": "Aligns scarce launch resources with where PDUs will actually be ordered in the window"
      }
    ],
    "evidence": [
      {
        "title": "Challenges in the Dutch Data Center Market",
        "sourceType": "industry-report",
        "publisher": "Greenberg Traurig LLP",
        "date": "2024-03",
        "excerpt": "an amendment of the decree...that entered into force on 1 January 2024, no hyperscale data centers are [permitted]",
        "url": "https://www.gtlaw.com/en/insights/2024/3/challenges-in-the-dutch-data-center-market",
        "attached": true
      },
      {
        "title": "DDA: stroomvoorziening bepaalt tempo Nederlandse datacentergroei",
        "sourceType": "industry-report",
        "publisher": "MSP Business (citing DDA State of the Dutch Data Centers 2026)",
        "date": "2026-06-08",
        "excerpt": "Tot 2031 verwacht de DDA een gemiddelde jaarlijkse groei van twaalf procent, naar 2,8 gigawatt. Die groei blijft desondanks achter bij het Europese gemiddelde.",
        "url": "https://mspbusiness.com/markt-en-strategie/dda-stroomvoorziening-bepaalt-tempo-nederlandse-datacentergroei/",
        "attached": true
      },
      {
        "title": "Why Flexibility Has Become Key to Success in EMEA Data Centre Markets",
        "sourceType": "industry-report",
        "publisher": "DC Byte",
        "date": "2026-06-04",
        "excerpt": "Pipeline across major markets has slowed down...The major beneficiaries of this shift have been emerging markets, such as the Nordics, Southern Europe and the Middle East",
        "url": "https://www.dcbyte.com/news-blogs/why-flexibility-has-become-key-to-success-in-emea-data-centre-markets/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "risk",
    "settleTest": "The DDA 2026 State of the Dutch Data Centers colocation-additions-by-year figure — i.e., NL's share of CE-7 NEW colo capacity commissioned during Year-1 — which only exists after the year unfolds; the current 0.28 is correctly derived from a 2025 installed-capacity snapshot, so the dispute is about future flow, not today's stock.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: boundary-substitution · judge 17/20 · E[ΔYAM] −€0.12M · engine ΔYAM −€0.37M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.nl-selfbuild-hotspot-hollows-geo.json
  {
    "id": "risk.boundary-substitution.nl-selfbuild-hotspot-hollows-geo",
    "title": "Netherlands weight overcounts megawatts that buy the fewest PDUs",
    "narrative": "The model splits the market by colo megawatts, assuming every megawatt buys the same amount of PDU. But CBRE puts about 60% of Europe's hyperscaler self-build capacity in Ireland, the Netherlands, Sweden and Belgium, and the Netherlands is the only CE-7 country on that list. These self-build halls are where busway and power-shelf designs replace discrete PDUs. That makes the 0.28 Netherlands weight too high in PDU-euro terms, and the error sits in the second-largest geography.",
    "category": "boundary",
    "targetNodes": [
      "geo.NL"
    ],
    "mechanism": "CBRE: ~60% of Europe's hyperscaler self-build sits in NL and three others → Self-build halls and Amsterdam colo buy far fewer discrete PDUs per megawatt → NL's 0.28 rests on megawatt count, overstating its PDU-euro share",
    "whyMissable": "The geography nodes look well-sourced with tight bands, but the flaw is in the megawatt-based method, not the counts, so an auditor would verify the megawatts and move on.",
    "falsifier": "Vendor or fit-out data showing Netherlands rack-PDU revenue per colo megawatt in line with the CE average.",
    "likelihood": {
      "value": 0.32,
      "basis": "evidence",
      "rationale": "CBRE directly confirms the self-build concentration including the Netherlands, and self-build halls are documented to use fewer discrete PDUs. Offsetting this, Amsterdam still holds a large enterprise colo base and Dutch grid limits slow how fast the mix can shift within 12 months."
    },
    "perturbation": [
      {
        "nodeId": "geo.NL",
        "op": "set",
        "value": 0.21,
        "note": "NL slice smaller in absolute PDU-euro terms — self-build and hyperscale-leased MW discounted for lower PDU content; not a mix-shift to other countries"
      }
    ],
    "indicators": [
      {
        "signal": "Rack-power architecture in new Amsterdam-region and North Holland build permits and fit-out tenders",
        "where": "TenderNed (Dutch national tender portal); Dutch Data Center Association 'State of the Dutch Data Centers' annual report",
        "threshold": "≥2 new NL builds specifying busway/shelf distribution as base design",
        "updates": "increases"
      },
      {
        "signal": "NL share of European hyperscaler self-build pipeline",
        "where": "CBRE European Data Centres quarterly; hyperscaler capex disclosures naming Dutch sites (Microsoft Middenmeer, Google Eemshaven expansions)",
        "threshold": "NL self-build capacity additions exceeding NL colo additions in a calendar year",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Obtain a per-country PDU-intensity read (PDU revenue per colo MW for DE vs NL) via distributor interviews or an Omdia custom cut, replacing MW-only apportionment",
        "type": "information",
        "voiNodeId": "geo.NL",
        "note": "Tests the euros-per-MW-constant assumption underlying the entire geo layer, not just NL"
      },
      {
        "action": "Weight Year-1 go-to-market toward Germany and Switzerland, whose capacity mix (colo/enterprise-heavy, self-operation-heavy) is structurally more PDU-native",
        "type": "strategic",
        "note": "Reallocates scarce pre-launch sales capacity away from the substitution-leading geography"
      }
    ],
    "evidence": [
      {
        "title": "New Hyperscaler Self-Build Capacity Growth to Outpace Colocation Supply Growth in Europe",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2026-02-19",
        "excerpt": "As of Q4 2025, approximately 60% of Europe’s operational hyperscaler self-build capacity is located in Ireland, the Netherlands, Sweden and Belgium... hyperscaler self-build capacity across Europe is expected to reach 4.2GW this year, representing 24% year-on-year growth.",
        "url": "https://www.cbre.co.uk/press-releases/new-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-in-europe",
        "attached": true
      },
      {
        "title": "Pure DC secures hyperscale customer for 78MW data center campus in Netherlands",
        "sourceType": "industry-report",
        "publisher": "DataCenterDynamics",
        "date": "2025-12-16",
        "excerpt": "An unnamed hyperscale customer is leasing the entire 78MW campus, situated in Westpoort, Amsterdam... signed 2025's largest standalone hyperscale data center lease in Europe.",
        "url": "https://www.datacenterdynamics.com/en/news/pure-dc-secures-hyperscale-customer-for-78mw-data-center-campus-in-netherlands/",
        "attached": true
      },
      {
        "title": "Netherlands Data Center Colocation Market Size Databook Q2 2026",
        "sourceType": "analyst-estimate",
        "publisher": "ResearchAndMarkets",
        "excerpt": "The Amsterdam metropolitan area moratorium on new large-scale data center development remains substantially in force through 2025... continuing to redirect investment. Operators are developing in the Middenmeer area (Hollands Kroon), Rotterdam, and other places.",
        "url": "https://www.researchandmarkets.com/reports/6233880/netherlands-data-center-colocation-market-size",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "Vendor rack-PDU revenue per colo megawatt for the Netherlands vs CE-7 average (from PDU vendor country splits like Vertiv/Legrand/Schneider or a colo fit-out BOM dataset) — a purchasable/obtainable dataset that would confirm today whether NL's PDU-euro intensity per MW differs from average.",
    "proposedCorrection": {
      "nodeId": "geo.NL",
      "value": 0.24,
      "low": 0.2,
      "high": 0.28,
      "rationale": "NL's 0.28 rests on raw colo-MW share, but a disproportionate share of hyperscaler self-build/busway halls in NL buys fewer discrete PDUs per MW, so the PDU-euro weight should be scaled down toward the low end of its current band."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: boundary-substitution · judge 18/20 · E[ΔYAM] −€0.11M · engine ΔYAM −€0.32M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.colo-follows-hyperscale-spec.json
  {
    "id": "risk.boundary-substitution.colo-follows-hyperscale-spec",
    "title": "Wholesale colocation buys what its hyperscale tenants tell it to",
    "narrative": "The model treats colocation as an independent segment worth 0.18 that buys PDUs and hedges against hyperscale substitution. But CBRE reports European colo take-up is driven by hyperscalers leasing wholesale capacity, where the tenant sets the rack-power spec. If those tenants standardize on busway and power-shelf fit-outs, the colo slice's PDU content falls while its share stays fixed, overstating the Year-1 number.",
    "category": "boundary",
    "targetNodes": [
      "seg.colocation"
    ],
    "mechanism": "CBRE says colo growth comes from hyperscale and AI tenants → Wholesale tenants set busway rack specs; landlords fit to spec → seg.colocation's 0.18 has no sensitivity band for falling PDU content",
    "whyMissable": "Founders point to colocation as the hedge against hyperscale risk, but in the growing wholesale part the hyperscale tenant, not the landlord, chooses the rack power.",
    "falsifier": "Fit-out specs or tenant BOMs from 2026 wholesale colo deals in Frankfurt or Amsterdam showing rack PDUs at retail-colo rates.",
    "likelihood": {
      "value": 0.34,
      "basis": "evidence",
      "rationale": "CBRE documents hyperscale-driven colo absorption in Europe, and tenant-specified fit-out is standard in wholesale leases. But retail and enterprise colo stay PDU-native, capping how much of the 0.18 slice converts within 12 months."
    },
    "perturbation": [
      {
        "nodeId": "seg.colocation",
        "op": "set",
        "value": 0.12,
        "note": "Wholesale hyperscale-leased suites (~1/3 of the colo slice) adopt tenant busway/shelf specs; retail colo stays PDU-native"
      }
    ],
    "indicators": [
      {
        "signal": "Rack-power architecture named in wholesale colo fit-out specs and tenant technical requirements",
        "where": "TED (EU tenders electronic daily) and TenderNed for NL/DE data-center fit-out packages; Equinix and Digital Realty capex/earnings calls (xScale / hyperscale JV commentary)",
        "threshold": "≥2 CE wholesale deals where tenant spec mandates busway or shelf-based distribution in leased suites",
        "updates": "increases"
      },
      {
        "signal": "Colo landlords marketing 'OCP-ready' or shelf-compatible white space in CE",
        "where": "Dutch Data Center Association annual report; Frankfurt operator (e.g., NTT, CyrusOne, Vantage) product announcements and OCP Regional Summit EMEA talks",
        "threshold": "First CE colo operator advertising OCP-ready suites as standard product",
        "updates": "increases"
      },
      {
        "signal": "Retail vs wholesale mix in CE colo absorption",
        "where": "CBRE European Data Centres quarterly reports",
        "threshold": "Wholesale/hyperscale-leased share of CE take-up exceeding ~60%",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Interview 5 CE wholesale colo design/fit-out leads on who specifies rack power in leased suites and what share of 2026 pipeline is tenant-specified",
        "type": "information",
        "voiNodeId": "seg.colocation",
        "note": "Directly replaces the unbanded single-source 0.18 with a spec-controlled vs landlord-controlled split"
      },
      {
        "action": "Position the product for retail colo and enterprise-tenant suites first, with an explicit OCP-compatible roadmap (shelf-integrated metering module) to follow tenant specs rather than fight them",
        "type": "strategic",
        "note": "Converts the substitution wave into an adjacency rather than a foreclosure"
      }
    ],
    "evidence": [
      {
        "title": "Data Centre Take-up in Europe to Reach New Peak in 2025",
        "sourceType": "industry-report",
        "publisher": "CBRE UK",
        "date": "2025-05-27",
        "excerpt": "Hyperscaler requirements have multiplied which has led to the development of larger, wholesale facilities across Europe that are often single let. As a result, facilities of unprecedented size are expected to be built in Europe this year.",
        "url": "https://www.cbre.co.uk/press-releases/data-centre-take-up-in-europe-to-reach-new-peak-in-2025",
        "attached": true
      },
      {
        "title": "Amsterdam Data Center | Ardent Data Centers",
        "sourceType": "triangulation",
        "publisher": "Northern Data / Ardent",
        "excerpt": "Our AI-Ready Compute Suite, AMS1, is a 6 MW vendor-agnostic data hall designed for Bring-Your-Own-Server and racks... Access to a 6 MW suite with dual-fed overhead busway (150+ kW per rack).",
        "url": "https://northerndata.de/amsterdam-ardent-data-centers",
        "attached": true
      },
      {
        "title": "CBRE European Real Estate Market Outlook 2025 - Data Centres",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "excerpt": "Take-up of colocation data centre space in Europe is expected to outstrip new supply in 2025 given strong demand from hyperscalers and providers of AI and high‑performance computing services.",
        "url": "https://www.cbre.com/insights/books/european-real-estate-market-outlook-2025/data-centres",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "risk",
    "settleTest": "The load-bearing claim is that 2026 wholesale colo fit-outs will standardize on busway/power-shelf and drop PDU content below the model's assumption. Only actual 2026 tenant BOMs and fit-out specs from Frankfurt/Amsterdam wholesale deals — which do not yet exist — would settle whether PDU content falls; the segment share itself (0.18) is a defensible today-value backed by Synergy's series.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: boundary-substitution · judge 16/20 · E[ΔYAM] −€0.10M · engine ΔYAM −€0.42M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.enterprise-gpu-pods-skip-pdus.json
  {
    "id": "risk.boundary-substitution.enterprise-gpu-pods-skip-pdus",
    "title": "Enterprise growth ships as GPU racks that skip PDUs",
    "narrative": "The model treats the whole enterprise segment, 29% of the market, as PDU-buying legacy halls on slow refresh cycles. But Synergy says enterprise capacity was flat for years and is only growing now because of GPU infrastructure, and that growth arrives as pre-built GPU racks with in-rack power, not field PDUs. The legacy stock that actually buys PDUs is declining two points a year toward 19% by 2031. Booking all 0.29 as PDU-addressable overstates the Year-1 enterprise number.",
    "category": "model-structure",
    "targetNodes": [
      "seg.enterprise"
    ],
    "mechanism": "Synergy: enterprise growth now comes only from GPU capacity → GPU racks ship pre-built with power shelves, skipping PDUs; legacy PDU stock falls to 19% by 2031 → Counting all 0.29 as PDU-addressable overstates the sellable Year-1 slice",
    "whyMissable": "The enterprise share looks like a boring, declining number, yet its stable 0.29 is propped up by GPU racks that never buy the product.",
    "falsifier": "Enterprise refresh data showing rack PDUs attached to new AI GPU deployments at rates like general IT racks.",
    "likelihood": {
      "value": 0.24,
      "basis": "evidence",
      "rationale": "Synergy's GPU-growth claim and the 2-point yearly decline are sourced, but NVIDIA's reference design ships a traditional PDU variant and analysts tie PDU demand to AI density. Lowered toward that contradicting evidence, but not to the floor since the legacy-versus-pod split and the power-shelf option remain real."
    },
    "perturbation": [
      {
        "nodeId": "seg.enterprise",
        "op": "set",
        "value": 0.21,
        "note": "GPU-pod increment (~1/4 of the enterprise slice) carries no discrete PDU content; legacy refresh continues its documented decline"
      }
    ],
    "indicators": [
      {
        "signal": "Form factor of enterprise AI infrastructure orders (integrated rack-scale systems vs component builds)",
        "where": "Dell/HPE/Lenovo quarterly earnings — AI server segment commentary on rack-scale vs unit shipments; NVIDIA reference-design partner announcements",
        "threshold": "Rack-scale integrated systems exceeding ~50% of enterprise AI infrastructure revenue mix",
        "updates": "increases"
      },
      {
        "signal": "PDU attach rate in CE enterprise channel sell-through",
        "where": "CE IT distribution (also/ALSO, Ingram Micro) product-category reporting; Schneider/Vertiv earnings commentary on enterprise vs cloud PDU demand",
        "threshold": "Enterprise PDU line flat-to-down while enterprise AI server line grows double-digit",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a decomposition of CE enterprise capacity additions into legacy-refresh vs pre-integrated AI-pod capacity (analyst inquiry with Synergy/Omdia plus 5 CIO interviews)",
        "type": "information",
        "voiNodeId": "seg.enterprise",
        "note": "Splits the 0.29 into PDU-addressable and non-addressable components"
      },
      {
        "action": "Target the enterprise refresh cycle explicitly (retrofit-friendly form factors, drop-in replacement for installed Schneider/Vertiv units) rather than new-build AI capacity",
        "type": "strategic",
        "note": "Aligns Year-1 pipeline with the segment component that verifiably buys PDUs"
      }
    ],
    "evidence": [
      {
        "title": "DGX SuperPOD B300 AC Power Reference Architecture",
        "sourceType": "industry-report",
        "publisher": "NVIDIA",
        "date": "2025-10-30",
        "excerpt": "This Reference Architecture is focused on traditional PDU and AC powered EIA racks... Figure 2 shows 72 x NVIDIA DGX B300 PS systems in standard racks each with three (3) 2U rack PDUs for maximum redundancy. DGX SuperPOD with DGX B300 systems is also available for more dense DB Busbar solutions as well.",
        "url": "https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300-xdr/latest/dgx-superpod-architecture.html",
        "attached": true
      },
      {
        "title": "The World's Total Data Center Capacity is Shifting Rapidly to Hyperscale Operators",
        "sourceType": "industry-report",
        "publisher": "Synergy Research Group",
        "date": "2025-06-24",
        "excerpt": "After a sustained period of essentially no growth, on-premise data center capacity is receiving something of a boost thanks to GenAI applications and GPU infrastructure. Nonetheless, on-premise share of the total will drop.",
        "url": "https://www.srgresearch.com/articles/the-worlds-total-data-center-capacity-is-shifting-rapidly-to-hyperscale-operators",
        "attached": true
      },
      {
        "title": "Data Center Rack PDU Market Report 2033",
        "sourceType": "analyst-estimate",
        "publisher": "Grand View Research",
        "excerpt": "The growth of high-performance computing (HPC), artificial intelligence (AI), and GPU-intensive workloads is driving demand for data center rack power distribution unit market.",
        "url": "https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "NVIDIA's own DGX SuperPOD B300 Reference Architecture (dated 2025-10-30) shows the flagship GPU deployment shipping in standard EIA racks with three 2U rack PDUs each — a purchasable/published artifact that directly settles whether GPU racks skip PDUs today. Combined with the Grand View PDU market report attributing growth to AI/GPU workloads, the load-bearing premise ('GPU growth arrives PDU-less') is falsified now, not over time.",
    "proposedCorrection": {
      "nodeId": "seg.enterprise",
      "value": 0.29,
      "low": 0.24,
      "high": 0.29,
      "rationale": "The claim's mechanism (GPU racks skip PDUs) is contradicted by NVIDIA's B300 reference architecture using rack PDUs, so the full 0.29 remains defensible as PDU-addressable; only a modest downside band reflects residual busbar/DB-mix uncertainty rather than the claimed structural haircut."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: structure-independence · judge 18/20 · E[ΔYAM] −€0.06M · engine ΔYAM −€0.11M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.ce-hyperscale-global-split-mirage.json
  {
    "id": "risk.structure-independence.ce-hyperscale-global-split-mirage",
    "title": "Germany hyperscale-owned share is far below the 44% we assumed",
    "narrative": "The model spreads Synergy's global 48% hyperscale share flat onto Central Europe. But about 60% of Europe's hyperscaler self-build sits in Ireland, the Netherlands, Sweden and Belgium, three of which are outside CE-7. So the implied German hyperscale cell, roughly 22% of the market, mostly does not exist as hyperscale-owned sites, and the Year-1 beachhead is much smaller.",
    "category": "model-structure",
    "targetNodes": [
      "seg.hyperscale",
      "seg.colocation"
    ],
    "mechanism": "Synergy's 48% hyperscale share is global, not regional. → In CE-7 hyperscale demand is leased, counted twice with colo. → Real buyer is the colo operator, needing colo-grade product.",
    "whyMissable": "The node looks solid because it was triangulated across Synergy vintages into a tight band, but the error is geographic, not numeric, and no band on a global figure catches a regional composition mistake.",
    "falsifier": "A Europe- or CE-scoped split from Synergy, CBRE or JLL showing hyperscale-owned capacity at 40% or more of CE-7 total.",
    "likelihood": {
      "value": 0.58,
      "basis": "evidence",
      "rationale": "The 60%-outside-CE self-build concentration is directly sourced and Frankfurt is a documented colo hub, not a self-build one. Residual doubt is only how much leased hyperscale capacity to attribute to the hyperscale buyer for PDU specs; revised up from 0.4 to 0.5."
    },
    "perturbation": [
      {
        "nodeId": "seg.hyperscale",
        "op": "set",
        "value": 0.28,
        "note": "CE hyperscale-owned share far below global 0.44; self-build concentrated outside CE-7"
      },
      {
        "nodeId": "seg.colocation",
        "op": "set",
        "value": 0.32,
        "note": "Mix-shift: the displaced weight lands in colocation, per CBRE's European ordering"
      }
    ],
    "indicators": [
      {
        "signal": "Europe hyperscale self-build vs colocation GW split, updated quarterly",
        "where": "CBRE 'Europe Data Centres' quarterly figures report; DCD coverage of CBRE releases",
        "threshold": "CE-7 hyperscale self-build share reported <30% of CE capacity",
        "updates": "increases"
      },
      {
        "signal": "Country-level ownership mix (colocation/hyperscale/enterprise) for DE and NL",
        "where": "EUDCA 'State of European Data Centres' annual report country tables",
        "threshold": "Germany capacity shown as majority colocation-operated",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a CE-scoped ownership split (hyperscale-owned vs colo vs enterprise MW for the CE-7) before locking segment-weighted GTM targets",
        "type": "information",
        "voiNodeId": "seg.hyperscale",
        "note": "Replaces the rescaled global split with an observed regional quantity"
      },
      {
        "action": "Build the launch spec and reference designs around colocation operators and their fit-out integrators rather than hyperscaler direct accounts",
        "type": "strategic",
        "note": "Aligns product qualification with the segment that actually dominates CE"
      }
    ],
    "evidence": [
      {
        "title": "CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth",
        "sourceType": "industry-report",
        "publisher": "DatacenterDynamics / CBRE",
        "date": "2026-02-20",
        "excerpt": "60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium... The colocation segment is expected to remain about 50 percent larger than the self-build segment at the end of 2026.",
        "url": "https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/",
        "attached": true
      },
      {
        "title": "Data Centres in Europe: Starting the Year on a High Note",
        "sourceType": "industry-report",
        "publisher": "CBRE Research",
        "date": "2023-02",
        "excerpt": "CBRE exclusively tracks third-party carrier neutral colocation data centres across Europe... Hyperscalers / cloud service providers responsible for the huge volume of take up across Europe.",
        "url": "https://www.dutchdatacenters.nl/wp-content/uploads/2023/03/CBRE-Europe-Data-Centres-Overview-KSE23.pdf",
        "attached": true
      },
      {
        "title": "Frankfurt DCI Report 2024",
        "sourceType": "industry-report",
        "publisher": "Structure Research",
        "date": "2024-06-24",
        "excerpt": "Hyperscale clouds have built out significant footprints... Hyperscale colocation is growing at a five-year CAGR of 26.1% and retail colocation is moving along at a 10.3% clip.",
        "url": "https://www.structureresearch.net/product/frankfurt-dci-report-2024-data-centre-colocation-hyperscale-cloud-interconnection/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A Europe- or CE-7-scoped hyperscale ownership/capacity split from Synergy, CBRE or JLL showing what share of CE-7 (or Germany) data center capacity is hyperscale-owned self-build vs leased colocation — a purchasable regional report that exists today and settles the number.",
    "proposedCorrection": {
      "nodeId": "seg.hyperscale",
      "value": 0.22,
      "low": 0.15,
      "high": 0.3,
      "rationale": "CBRE data shows 60% of Europe's hyperscale self-build sits in Ireland, Netherlands, Sweden, Belgium (mostly outside CE-7) and Synergy notes ~half of hyperscale capacity is leased not owned, so the German/CE-7 hyperscale-owned cell is far below the flat-applied global 44%."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: structure-independence · judge 18/20 · E[ΔYAM] −€0.04M · engine ΔYAM −€0.05M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.colo-denominator-mispricing-enterprise-geography.json
  {
    "id": "risk.structure-independence.colo-denominator-mispricing-enterprise-geography",
    "title": "Colo-based geo weights inflate NL, hide Swiss and German demand",
    "narrative": "The model splits each country's share using colocation data. But 29% of the market is enterprise on-premise, which colocation data does not count. Switzerland's real installed base is about 3x its colo figure, and Germany's load exceeds 2,700 MW versus a 1,737 MW colo figure, while the Dutch weight reflects the Amsterdam colo hub. As a result, country order, channel plans and SAM are wrong for a third of the market.",
    "category": "model-structure",
    "targetNodes": [
      "geo.NL",
      "geo.CH"
    ],
    "mechanism": "All geo weights come from one colocation table that misreports countries. → Colo data excludes the 29% enterprise on-premise market it should weight. → NL is overweighted, Switzerland understated, and 29% of TAM lands in wrong countries.",
    "whyMissable": "NL looks like the best-sourced node because Statista and the Dutch association agree within 3%, but both use colocation scope, so the agreement certifies the wrong measure.",
    "falsifier": "A total-installed-load country split for CE-7 that reproduces the colo weights within a few points, with NL near 0.28 and CH near 0.08.",
    "likelihood": {
      "value": 0.68,
      "basis": "evidence",
      "rationale": "The ledger already shows CH at 0.08 versus 0.13 and DE at 0.42 versus 0.53 by scope, and the bias follows directly from the documented definitions. Both anchors are now confirmed by strong sources, though the final SAM and sequencing impact still rests on unverified modeling assumptions."
    },
    "perturbation": [
      {
        "nodeId": "geo.NL",
        "op": "set",
        "value": 0.23,
        "note": "Blended weight once the enterprise slice is apportioned on installed load instead of Amsterdam colo MW"
      },
      {
        "nodeId": "geo.CH",
        "op": "set",
        "value": 0.12,
        "note": "Self-operated Swiss capacity re-enters the weighting for the enterprise slice"
      }
    ],
    "indicators": [
      {
        "signal": "National installed-IT-load figures published alongside colo figures",
        "where": "BMWK German data-centre landscape updates; CBRE Suisse commercial vs self-operated capacity reports",
        "threshold": "Installed-load country shares diverging >5pp from the model's colo-based shares",
        "updates": "increases"
      },
      {
        "signal": "Statista vs CBRE scope reconciliation for 2025/2026 vintages",
        "where": "CBRE Europe Data Centres quarterly vs Statista colocation-by-country table updates",
        "threshold": "Gap between summed Statista country colo and CBRE European totals persisting or widening",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build a dual-denominator geo split: colo MW weights for the hyperscale/colo cells, installed-IT-load weights for the enterprise cells, and recompute the cube",
        "type": "information",
        "voiNodeId": "geo.CH",
        "note": "Cheap desk exercise with sources already in the ledger (BMWK, CBRE Suisse, Mordor installed-base)"
      },
      {
        "action": "Sequence country entry per segment rather than per blended geo weight — e.g., CH/DE for enterprise retrofit, NL for colo — instead of one country ranking for all segments",
        "type": "operational",
        "note": "Prevents the blended weights from steering channel investment into phantom cells"
      }
    ],
    "evidence": [
      {
        "title": "Status and development of the German data centre landscape – Executive Summary",
        "sourceType": "industry-report",
        "publisher": "BMWK (Federal Ministry for Economic Affairs and Climate Action)",
        "date": "2025-03",
        "excerpt": "With over 2,000 data centres and an installed IT power demand of over 2,700 MW, Germany is already the largest centre for digital infrastructure in Europe.",
        "url": "https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Publikationen/Digitale-Welt/status-and-development-of-the-german-data-centre-landscape-executive-summary.pdf?__blob=publicationFile&v=2",
        "attached": true
      },
      {
        "title": "CBRE Suisse: latest Swiss data centre market figures",
        "sourceType": "industry-report",
        "publisher": "CBRE Switzerland (via europesays.com)",
        "date": "2026-07-05",
        "excerpt": "La capacité actuellement disponible sur le marché suisse des datacenters, hors infrastructures exploitées pour compte propre, s’élève à 340 MW — colocation figures explicitly exclude self-operated capacity.",
        "url": "https://www.europesays.com/ch-fr/205273/",
        "attached": true
      },
      {
        "title": "Switzerland Data Center Market Size & Growth to 2031",
        "sourceType": "analyst-estimate",
        "publisher": "Mordor Intelligence",
        "date": "2023-05-18",
        "excerpt": "Base Year Market Size (2025) | 850.60 megawatt — installed base far exceeds the ~274 MW Statista colocation figure for Switzerland.",
        "url": "https://www.mordorintelligence.com/industry-reports/switzerland-data-center-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A total-installed-load (colo + enterprise on-premise + self-operated) country split for CE-7 with published MW figures per country (BMWK for DE, CBRE/Mordor for CH, DDA for NL) — an existing/purchasable dataset that fixes the denominator scope today.",
    "proposedCorrection": {
      "nodeId": "geo.CH",
      "value": 0.11,
      "low": 0.08,
      "high": 0.14,
      "rationale": "Switzerland is self-operation-heavy (Mordor 850.6 MW installed vs 274 MW colo; CBRE 340 MW commercial only), so a total-installed-load denominator raises CH from 0.08 toward ~0.11-0.13, and correspondingly deflates the Amsterdam-hub-inflated NL weight."
    },
    "asOf": "2026-07-08"
  },

];

// Validated at module load — a malformed register throws here, at boot,
// with every issue listed (same doctrine as the ledger).
export const risksCycle1: Risk[] = validateRisks(rawRisks, ledger);
