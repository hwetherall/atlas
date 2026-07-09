import { ledger } from "@/lib/ledger";
import { validateRisks, type Risk } from "@/lib/riskSchema";

// ─────────────────────────────────────────────────────────────────────────────
// Curated risk register — rendered by scripts/risks-curate.mjs from the cached
// generation pass (npm run risks, 2026-07-08, ledger rev 2428e977).
//
// Raw drafts, LLM transcripts, Exa evidence and the kill-log live under
// risks/ — the audit trail every entry below cites. Every € impact is
// COMPUTED from the risk's perturbation ops by lib/riskCompute.ts; nothing
// numeric here is an LLM assertion.
//
// Curation policy:
// - All 32 judge survivors kept (blind rubric + kill thresholds in
//   scripts/risks-plan.mjs; kills/merges recorded in risks/killlog.json).
// - Tier: fact | model-structure | boundary → "rock" (attacks the model's own
//   construction); competitive | execution | exogenous → "front-of-mind".
// - Order = expected YAM loss (p × |ΔYAM|) vs the baseline scenario, desc.
// ─────────────────────────────────────────────────────────────────────────────

const rawRisks: Risk[] = [
  // ○ front-of-mind · lens: structure-independence · judge 18/20 · E[ΔYAM] −€0.59M · engine ΔYAM −€0.99M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.frankfurt-cycle-lockout-year1.json
  {
    "id": "risk.structure-independence.frankfurt-cycle-lockout-year1",
    "title": "Big buyers lock specs early, emptying the Year-1 sales window",
    "narrative": "The model assumes the venture wins 1% of its market in Year 1 from many independent buyers arriving steadily. But the chosen corner is a few large Frankfurt and Amsterdam campus fit-outs whose electrical parts are specified at tender, long before delivery. Capacity delivering in the first 12 months was already specced in 2024–25. So the truly winnable share this year is far below the 1% benchmark, and the Year-1 number is overstated.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "A few flagship campuses dominate Year-1 demand, specced early → Large operators set specs upstream, so smooth-arrival assumption fails → Average 1% benchmark overstates winnable share for this cell",
    "whyMissable": "This node was already fixed once from 3% to 1% and looks like the most-scrubbed number, but the real error is the link between big buyers and early spec-lock, which no single band captures.",
    "falsifier": "Two or more large-operator rack-PDU procurements in the first 12 months, open to new vendors and running from bid to delivery inside that window.",
    "likelihood": {
      "value": 0.6,
      "rationale": "Pipeline data directly documents lumpy projects and early spec-lock in this cell, and no vendor-open procurement fitting a 12-month cycle surfaced. Held below 0.7 because short-cycle refresh demand in existing Frankfurt stock is unmeasured and could rescue the average.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.004,
        "note": "Year-1 contestable share conditioned on the DE×large-operator cell's spec-lock timing, below the generic band low"
      }
    ],
    "indicators": [
      {
        "signal": "Rack-PDU line items in EU-visible tenders with award-to-delivery under 12 months",
        "where": "TED (Tenders Electronic Daily) and operator supplier portals (Equinix/Digital Realty vendor registration → time to first RFQ)",
        "threshold": "Zero vendor-open short-cycle PDU tenders in CE over two consecutive quarters",
        "updates": "increases"
      },
      {
        "signal": "Ratio of CE capacity breaking ground (spec now, deliver later) vs delivering (specced already)",
        "where": "CBRE quarterly pipeline figures; Frankfurt/Amsterdam construction-start announcements on operator capex calls",
        "threshold": "Deliveries dominated by projects specced ≥18 months prior",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Audit the 2026–27 CE fit-out pipeline for spec-lock dates: which projects have not yet frozen their rack-power BoM and when do their tenders open",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts the benchmark into a pipeline-based obtainable model — the node's own promotion path"
      },
      {
        "action": "Re-weight Year-1 targeting toward brownfield refresh and retrofit in standing Frankfurt/Amsterdam stock, where PDU swap-outs transact inside 12 months without waiting for a new-build tender cycle",
        "type": "operational",
        "note": "Buys revenue in the only short-cycle sub-pool of the chosen cell"
      }
    ],
    "evidence": [
      {
        "title": "Goodman, CPP Investments establish €8bn European data center platform",
        "sourceType": "industry-report",
        "publisher": "DatacenterDynamics",
        "date": "2025-12-23",
        "excerpt": "Four projects totalling 435MW of primary power and 282MW of IT load across Frankfurt, Amsterdam, and Paris — concentrating European take-up in a handful of flagship campuses.",
        "url": "https://www.datacenterdynamics.com/en/news/goodman-cpp-investments-establish-8bn-european-data-center-plaform/",
        "attached": true
      },
      {
        "title": "Data Center Construction Timeline: 18-36 Months, Phase by Phase",
        "sourceType": "industry-report",
        "publisher": "Buildermuse",
        "date": "2026-06-04",
        "excerpt": "40-60 week switchgear lead times and 18-36 month build cycles mean electrical BoM is specified far ahead of delivery, corroborating upstream spec-lock.",
        "url": "https://buildermuse.com/commercial/data-center-construction-timeline-phase-by-phase/",
        "attached": true
      },
      {
        "title": "NTT Berlin 36MW Data Center Development Contract Awarded to HOCHTIEF and Turner",
        "sourceType": "industry-report",
        "publisher": "Construction Review Online",
        "date": "2026-07-08",
        "excerpt": "Construction begins summer 2026 with first data halls handed over in 2028 — demonstrating delivery windows extend years beyond procurement/award.",
        "url": "https://constructionreviewonline.com/ntt-berlin-36mw-data-center-development-contract-awarded-to-hochtief-and-turner/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the actual outcome of 2026 EU rack-PDU procurements — whether two or more large-operator tenders open to new vendors run from bid to delivery inside the first 12 months — settles this. That is a market event that must unfold, not a fact retrievable today from a report or dataset.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: execution-window · judge 17/20 · E[ΔYAM] −€0.57M · engine ΔYAM −€0.99M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.som-window-semantics-year1-zero.json
  {
    "id": "risk.execution-window.som-window-semantics-year1-zero",
    "title": "Year-1 capture of 1% is really a 3-year total; too high",
    "narrative": "The model says the venture wins 1% of its serviceable market in Year 1. But the benchmarks behind that 1% describe capture over 1 to 5 years, and the one worked example in them lands at 0.1% of SAM. Because the venture is pre-launch and only sells for part of Year 1, the true number is a fraction of the back half of the year. The Year-1 figure is 2 to 3 times too high.",
    "category": "fact",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Benchmarks define the 1% share as accruing over years. → The one worked example yields just 0.1% of SAM. → Pre-launch venture sells only 6 to 9 months in Year 1. → A 1% factor overstates real Year-1 capture 2 to 3 times.",
    "whyMissable": "The number was already cut from 3% to 1% and marked triangulated, so it reads as the fixed conservative case while the real error is the time frame of its sources.",
    "falsifier": "A comparable early-stage data-center hardware entrant documented capturing at least 1% of its serviceable market within its first 12 months from launch.",
    "likelihood": {
      "value": 0.58,
      "rationale": "Three of four benchmark sources frame the percentage as multi-year, and the single worked example sits far below the band floor. The offsetting uncertainty is that the venture may have pre-launch pipeline the model does not credit, so the nudge is bounded to 0.58.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.004,
        "note": "Pro-rated Year-1 capture consistent with cumulative-window benchmarks and the 0.1% worked example"
      }
    ],
    "indicators": [
      {
        "signal": "Months from launch to first booked CE purchase order",
        "where": "Own CRM plus TED (EU public tender portal) responses to rack-power lots the venture bids",
        "threshold": "No PO by month 6 post-launch",
        "updates": "increases"
      },
      {
        "signal": "First-year revenue disclosures of comparable rack-power/DC-hardware entrants",
        "where": "Crunchbase/annual filings of recent PDU or rack-infrastructure startups entering EU",
        "threshold": "Comparables clustering below 0.5% of their stated SAM in year 1",
        "updates": "increases"
      },
      {
        "signal": "Quote-to-PO conversion time in the first CE opportunities",
        "where": "Own CRM pipeline reviewed at month 6; cross-referenced against TED award timelines for rack-power line items",
        "threshold": "Median cycle >9 months at month 6",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build a bottom-up pipeline model (named accounts × win rate × cycle time × months of selling window) to replace the top-down 1% before fundraising commitments are set against YAM",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Directly replaces the contested benchmark with venture-specific arithmetic"
      },
      {
        "action": "Re-baseline the internal plan on a 24-month obtainable window with quarterly gates, so Year-1 misses don't cascade into a credibility problem with the board",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "TAM vs SAM vs SOM: Definitions, Formulas & 2026 Guide",
        "sourceType": "industry-report",
        "publisher": "Prospeo",
        "excerpt": "SOM (Serviceable Obtainable Market): What you'll realistically capture in the next 36 months given your team, budget, and competitive position. ... What's a realistic SOM? 1-5% of SAM over 36 months for early-stage companies.",
        "url": "https://prospeo.io/s/tam-vs-sam-vs-som",
        "attached": true
      },
      {
        "title": "Serviceable Obtainable Market (SOM): PM Definition",
        "sourceType": "industry-report",
        "publisher": "IdeaPlan",
        "date": "2024-01-01",
        "excerpt": "SOM is the portion of the SAM that a company can realistically capture in the near term, typically within one to three years. ... For early-stage companies, SOM is typically 1-5% of SAM.",
        "url": "https://www.ideaplan.io/glossary/serviceable-obtainable-market-som",
        "attached": true
      },
      {
        "title": "Addressable Market Explained: TAM, SAM, SOM in 2026",
        "sourceType": "industry-report",
        "publisher": "Prospeo",
        "excerpt": "SOM is what you'll capture in the near term - typically modeled over 1-3 years - and it's the number investors scrutinize hardest.",
        "url": "https://prospeo.io/s/addressable-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The source documents themselves (Prospeo, IdeaPlan) settle whether the 1% benchmark refers to Year-1 capture or cumulative 36-month capture — this is a definitional reading of existing, attached artifacts, resolvable today by reading the sources rather than waiting for market events.",
    "proposedCorrection": {
      "nodeId": "obtainableFactor",
      "value": 0.01,
      "low": 0.005,
      "high": 0.03,
      "rationale": "The ledger already reconciled the benchmark-period misread by adopting Prospeo's explicit Year-1 = 1% figure (with 3% and 5% for Years 2–3), and the Tractian comparable plus early-procurement mechanism keep the 0.5–3% band intact, so the claim's premise that 1% is a 3-year total is contradicted by the source's own Year-1 assignment."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: regulatory-gauntlet · judge 16/20 · E[ΔYAM] −€0.47M · engine ΔYAM −€0.93M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window.json
  {
    "id": "risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window",
    "title": "EU Cyber Resilience Act cuts networked PDU sales in Year 1",
    "narrative": "The model assumes the PDU clears the old CE and TUV compliance stack and can be quoted into 2026 tenders. But the Cyber Resilience Act adds new duties from 11 September 2026 and full conformity from 11 December 2027, and data-center buyers are already demanding CRA-readiness in 2026 bids. That pushes Year-1 share below the 1% pace the number assumes.",
    "category": "exogenous",
    "targetNodes": [
      "serviceableFactor",
      "obtainableFactor"
    ],
    "mechanism": "CRA duties start Sept 2026 and Dec 2027, inside the entry window → Buyers add CRA-readiness clauses to 2026 bids for durable gear → Entrant lacks the certification, so it drops off shortlists → Reachable demand shrinks and Year-1 share falls below 1%",
    "whyMissable": "CE marking already looks like a checked box, but the CRA changes the conformity route and buyers enforce it in 2026 bids while the founder's calendar reads 2027.",
    "falsifier": "Three 2026 data-center PDU bids with no CRA or SBOM requirement, plus confirmation networked PDUs stay in the CRA self-assessment class.",
    "likelihood": {
      "value": 0.5,
      "rationale": "The CRA dates and product scope are enacted law, not forecast. Remaining doubt is whether remote-management PDUs need third-party assessment and how hard buyers push CRA-readiness in 2026 specs, so the estimate eases from 0.55 to 0.50.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.4,
        "note": "CRA-gated (attestation-demanding) demand exits the entrant's reachable pool until conformity artifacts exist"
      },
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.006,
        "note": "Year-1 pace falls below the 1% anchor as 2026 shortlists require CRA-readiness"
      }
    ],
    "indicators": [
      {
        "signal": "CRA harmonized-standards progress for network/management devices and the important-product classification of remote-access equipment",
        "where": "CEN/CENELEC JTC 13 work programme and the EU Official Journal harmonized-standards citations; Commission CRA implementing-act docket",
        "threshold": "Networked PDUs / remote management listed under Annex III important products, or harmonized standards slipping past mid-2026",
        "updates": "increases"
      },
      {
        "signal": "CRA/SBOM clauses appearing in data-center electrical RFQs and incumbent price lists",
        "where": "TED (Tenders Electronic Daily) EU data-center fit-out tenders; Schneider/Vertiv/Eaton product-security pages and price-list footnotes announcing CRA-ready SKUs",
        "threshold": "≥2 CE tenders requiring vendor SBOM/CRA attestation, or an incumbent marketing 'CRA-ready' as a differentiator",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a CRA classification and gap assessment (product class, assessment route, notified-body need) with a certified test house now, before design freeze",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "Determines whether third-party assessment — the long pole — is required at all"
      },
      {
        "action": "Build the SBOM, secure-development and vulnerability-disclosure artifacts into the launch release and sell them as a differentiator against incumbents' legacy firmware",
        "type": "strategic",
        "note": "Turns the 2026 buyer front-running from a gate into a wedge"
      },
      {
        "action": "Sequence Year-1 pipeline toward buyers not yet writing CRA clauses (mid-market enterprise retrofit) while conformity completes",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "Cyber Resilience Act (CRA) — DG CONNECT webinar slides",
        "sourceType": "industry-report",
        "publisher": "ENISA / European Commission DG CONNECT",
        "excerpt": "Entry into application: 11 December 2027 except for reporting obligations: 11 September 2026. In scope: 'products with digital elements'... network equipment... including their remote data processing solutions!",
        "url": "https://certification.enisa.europa.eu/document/download/9d04238b-7f18-4575-a7dd-638afc92e019_en?filename=Slides_CRA_EUCC_webinar_June_2025.pdf&prefLang=fr",
        "attached": true
      },
      {
        "title": "CRA Product Classes: Implementing Regulation 2025/2392 Technical Descriptions",
        "sourceType": "industry-report",
        "publisher": "Safeguard",
        "date": "2026-01-15",
        "excerpt": "The default tier — roughly 90 per cent of products — permits self-assessment under conformity assessment Module A... Commission Implementing Regulation (EU) 2025/2392, signed on 28 November 2025... fixes the technical descriptions of each category.",
        "url": "https://safeguard.sh/resources/blog/cra-implementing-regulation-2025-2392-product-classes",
        "attached": true
      },
      {
        "title": "Cyber Resilience Act 2026: A Compliance Guide for OEMs",
        "sourceType": "industry-report",
        "publisher": "ComponentSense",
        "date": "2026-06-16",
        "excerpt": "From 11th September 2026, electronics manufacturers selling into the EU will be facing a new legal obligation... If your product connects directly or indirectly to a network or device, it falls within scope.",
        "url": "https://www.componentsense.com/blog/cyber-resilience-act-2026-a-compliance-guide-for-oems",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the actual 2026 tender behavior settles this — whether EU data-center buyers in fact impose binding CRA/SBOM shortlist clauses before the Sept 2026 reporting date and Dec 2027 full conformity, and whether that pace pushes the entrant off enough shortlists to cut Year-1 share below 1%. The regulatory dates are known today, but whether buyers actually gate 2026 bids on CRA-readiness (versus accepting a compliance roadmap) is a demand-response that unfolds over the next 12-24 months.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: execution-window · judge 17/20 · E[ΔYAM] −€0.45M · engine ΔYAM −€0.83M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.prelet-pipeline-lockout.json
  {
    "id": "risk.execution-window.prelet-pipeline-lockout",
    "title": "Year-1 sales limited to old sites; new builds already locked",
    "narrative": "The model assumes a 9% growth market means the venture can win 1% of the full market in Year 1. But new data centers pick their power vendors at design freeze, before launch, so every site coming online in Year 1 already chose its supplier. That leaves only retrofit and refresh sales, a much smaller pool, which makes the Year-1 number too high.",
    "category": "model-structure",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "New builds lock power vendors at design freeze, before launch. → Growth sits in locked new builds, leaving only refresh sales. → Generic 1% benchmarks assume the whole market is reachable. → Applying 1% to full market overstates reachable Year-1 share.",
    "whyMissable": "The plan reads 1% as conservative because the market is growing, but the growing part is the least reachable in 12 months and no node separates committed demand from contestable demand.",
    "falsifier": "Documented cases of new data centers running competitive rack-PDU selection within 6 months of fit-out, or an operator confirming PDUs are bought late as a commodity separate from the electrical design freeze.",
    "likelihood": {
      "value": 0.55,
      "rationale": "Early electrical lock-in for new builds is well-documented and matches the ledger's own 12-24 month assumption. But no source shows whether rack PDUs ride the frozen bill or are bought late as a commodity, keeping the likelihood near a coin flip.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.005,
        "note": "Year-1 capture limited to installed-base retrofit/refresh; new-build pipeline pre-committed before launch"
      }
    ],
    "indicators": [
      {
        "signal": "Stage at which rack-PDU vendor is fixed in CE fit-out tenders (bundled at design freeze vs late separate lot)",
        "where": "TED tender documents for DE/NL data-center fit-outs; fit-out contractors' bid packages",
        "threshold": "PDU line bundled into general-electrical packages in ≥3 of 4 sampled tenders",
        "updates": "increases"
      },
      {
        "signal": "Pre-let percentages and long-lead procurement commentary for CE capacity additions",
        "where": "Operator and hyperscaler capex calls (Equinix, Digital Realty quarterly); Vertiv/Schneider backlog commentary",
        "threshold": "Pre-let >80% with electrical packages cited as booked >18 months out",
        "updates": "increases"
      },
      {
        "signal": "FLAP-D pre-let percentage and vacancy in successive half-year prints",
        "where": "JLL EMEA Data Centre Report and Cushman & Wakefield EMEA updates",
        "threshold": "Pre-let stays above 80% with vacancy below 8%",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Map the 2026–27 CE new-build pipeline by procurement stage (design freeze reached? electrical package awarded?) to quantify the actually-contestable Year-1 pool",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Separates committed from contestable SAM — the distinction the funnel lacks"
      },
      {
        "action": "Target the installed-base refresh cycle explicitly: build the launch offer around drop-in replacement and retrofit economics (metering upgrades, DCIM integration) rather than new-build spec wins",
        "type": "strategic"
      }
    ],
    "evidence": [
      {
        "title": "Data Center Electrical Procurement: Why the Order Has to Come Before the Design",
        "sourceType": "industry-report",
        "publisher": "Build.inc",
        "date": "2026-06-22",
        "excerpt": "Power transformer lead times from major manufacturers have reached 48 to 60 months. Generator step-up transformers average 144 weeks. Tier 1 suppliers -- ABB, Siemens Energy, Hitachi Energy -- have backlogs extending to 2030 and beyond. A developer who sequences procurement conventionally and targets energization in 2028 has already missed the window.",
        "url": "https://build.inc/insights/data-center-electrical-procurement-sequence-workflow",
        "attached": true
      },
      {
        "title": "From Electrical Design to Energization",
        "sourceType": "industry-report",
        "publisher": "Construction Business Outlook",
        "date": "2026-04-20",
        "excerpt": "the schedule can be effectively lost before a single foundation is poured...because a transformer with a 65-week lead time wasn't released before the topology was finalized. Contractors who consistently deliver these programs on time have stopped treating electrical planning as a downstream task.",
        "url": "https://constructionbusinessoutlook.com/from-electrical-design-to-energization/",
        "attached": true
      },
      {
        "title": "Electrical Equipment Lead Time Index",
        "sourceType": "industry-report",
        "publisher": "VAWN",
        "date": "2026-06-02",
        "excerpt": "Power / substation transformer 128 weeks ↑ Elevating; Generator step-up (GSU) transformer 144 weeks ↑ Elevating; Medium-voltage switchgear 44 weeks. Panelboards 15-23 weeks; Circuit breakers (commodity) In stock.",
        "url": "https://usevawn.com/resources/electrical-equipment-lead-times/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The load-bearing part is a claim about how rack-PDU procurement works TODAY: whether PDUs are locked at electrical design freeze or bought late as a commodity. An operator/procurement-schedule dataset or a week of expert calls with data-center facilities buyers would settle whether the reachable Year-1 pool excludes new builds. This is a fact about the present procurement structure, not a future market unfolding.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: execution-window · judge 17/20 · E[ΔYAM] −€0.45M · engine ΔYAM −€0.99M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.firmware-security-audit-gate.json
  {
    "id": "risk.execution-window.firmware-security-audit-gate",
    "title": "Buyer security audit adds a slow gate that delays first PO",
    "narrative": "The model assumes the venture can sell to large operators once it clears CE and TUV product certification. But those buyers require a separate security prequalification first, and each audit cycle runs one to two quarters. That serial delay compresses the Year-1 selling window and locks out gated accounts, so both factors are too high.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor",
      "serviceableFactor"
    ],
    "mechanism": "Large operators require security audits before listing networked power devices → New entrant builds this and passes audits within Year 1 → Gate delays first PO and blocks gated accounts",
    "whyMissable": "The founder's list shows CE and TUV as handled, but the buyer security audit is invisible until it arrives as a questionnaire on the first serious RFQ.",
    "falsifier": "Two or more large CE operators issue rack-PDU RFQs in the first two quarters with no security prequalification, or confirm CE marking alone suffices for listing.",
    "likelihood": {
      "value": 0.45,
      "rationale": "Security prequalification is standard at large buyers and CRA rules phase in, but mid-market and distributor channels gate far less strictly. Probability reflects the venture's explicit large-operator-first choice; CRA obligations bind from Dec 2027, so the near-term delay is smaller than implied.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "scale",
        "value": 0.8,
        "note": "Security-gated large accounts unreachable within Year 1 despite product certification"
      },
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.5,
        "note": "First-PO delay of ~2 quarters halves the effective Year-1 selling window"
      }
    ],
    "indicators": [
      {
        "signal": "Vendor-security questionnaire content (SBOM, signed firmware, PSIRT, 62443 mapping) in rack-power prequalification packets",
        "where": "Procurement/supplier portals of Equinix, Digital Realty, NorthC and other CE colo operators; first three RFQs the venture receives",
        "threshold": "≥2 of first 3 RFQs requiring SBOM or firmware-security attestation before quotation",
        "updates": "increases"
      },
      {
        "signal": "CRA horizontal-standard timeline for network-connected industrial products",
        "where": "CEN/CENELEC JTC13 docket and Commission CRA implementing-act publications",
        "threshold": "Harmonized standard citing connected power-distribution devices with obligations landing inside the venture's first 24 months",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run a mock security audit against two target operators' published supplier requirements pre-launch to size the true listing lead time per account",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts an unknown serial gate into a scheduled one; de-risks the Year-1 timing assumption"
      },
      {
        "action": "Ship with a third-party-audited firmware signing and PSIRT process at launch (certifiable artifact, not a roadmap slide), and sequence first sales through channels with lighter security gates (distributors, mid-market) while operator audits run",
        "type": "strategic"
      }
    ],
    "evidence": [
      {
        "title": "Security Guideline Product Security Sourcing Guide",
        "sourceType": "industry-report",
        "publisher": "NERC",
        "date": "2023-12-07",
        "excerpt": "Vendor-Level Risk Management ... Product Vulnerability Disclosure ... Current disclosure by the supplier: 'Push' or 'Pull' Process — documents formal vendor security prequalification artifacts for grid/critical-infrastructure buyers.",
        "url": "https://www.nerc.com/globalassets/who-we-are/standing-committees/rstc/scs/product-security-sourcing-guide.pdf",
        "attached": true
      },
      {
        "title": "Supply Chain Product Assurance Playbook (Schneider Electric)",
        "sourceType": "industry-report",
        "publisher": "NIST / Schneider Electric",
        "date": "2024-09-18",
        "excerpt": "SBOMs generated for all products starting January 2021 and every product release is compliant to ISA/IEC 62443-4-1 Secure Development Lifecycle. Globally SE is certified to 4-1 Maturity Level 4 — incumbents already carry the security-gate artifacts a new entrant must build.",
        "url": "https://csrc.nist.gov/csrc/media/Presentations/2024/supply-chain-product-assurance-playbook/images-media/20240918-FINAL%20CG%20SE%20September%202024%20SSCA%20Presentation%20v2.pdf",
        "attached": true
      },
      {
        "title": "CRA FAQ - Transition period",
        "sourceType": "industry-report",
        "publisher": "Open Regulatory Compliance Working Group",
        "excerpt": "The obligations of manufacturers to ensure that products with digital elements are in conformity with the essential cybersecurity requirements ... apply from 11 December 2027 — the binding CRA gate is prospective, tempering the near-term regulatory pressure.",
        "url": "https://cra.orcwg.org/faq/official/transition/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the actual Year-1 procurement timeline settles this: whether large CE operators issue rack-PDU RFQs requiring security prequalification before a first PO, and whether the venture's audit cycles land inside or outside its selling window. That unfolds over the next 12-24 months — no purchasable report fixes today's serviceable/obtainable ratios, since the load-bearing claim is about how the buyer gate delays orders going forward.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 16/20 · E[ΔYAM] −€0.44M · engine ΔYAM −€1.16M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.bundle-pricing-kills-bakeoffs.json
  {
    "id": "risk.competitive-foreclosure.bundle-pricing-kills-bakeoffs",
    "title": "Bundled PDUs shrink the winnable pool below the model's floor",
    "narrative": "The model assumes there is a pool of standalone rack-PDU purchases a new entrant can compete for, sized at 0.5 to 3% of the market. But the incumbents who sell the $23B power and $26B cooling packages bundle the PDUs inside those deals, and the only standalone tenders found were tiny and barely contested. That pushes the real Year-1 share to about 0.3%, below the model's own 0.5% floor.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Incumbents bundle PDUs into power and cooling deals at zero margin → Leftover standalone tenders are small, sole-sourced, or barely contested → Real Year-1 share drops to about 0.3%, below the floor",
    "whyMissable": "The team already cut this number from 3% to 1%, so it reads as the most stress-tested figure when the real problem is that bundling removes winnable deals entirely.",
    "falsifier": "A logged pipeline of five or more standalone, multi-vendor rack-PDU tenders in CE-7, each at least €250K, within any six-month window, where a non-incumbent can bid.",
    "likelihood": {
      "value": 0.38,
      "rationale": "Bundling evidence and multi-year benchmark definitions both point below the floor, but retrofit and colo tenders do create some genuine standalone decisions the search may have missed. A surfaced CHF 2M standalone deal undercuts the tiny-tender claim, so the net revision is marginally downward.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "set",
        "value": 0.003,
        "note": "Contestable-decision pool shrinks the effective Year-1 capture below the modeled 0.5% floor"
      }
    ],
    "indicators": [
      {
        "signal": "Ratio of bundled vs standalone rack-PDU procurement in published CE tenders",
        "where": "TED (tenders.europa.eu) — compare PDU-specific CPV lots vs PDU lines inside integrated electrical-fit-out lots",
        "threshold": "≥80% of PDU volume appearing only inside integrated lots over two quarters",
        "updates": "increases"
      },
      {
        "signal": "Incumbent commentary on solutions/portfolio attach rates for rack power",
        "where": "Vertiv and Schneider quarterly earnings calls; Schneider capital markets day materials",
        "threshold": "Explicit statements that rack PDU is sold predominantly as part of integrated rack/power/cooling solutions",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build a bottom-up contestable-tender census for CE-7 (12 months of TED + colo tenant RFQs) to replace the generic 1% benchmark with a counted pipeline",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Directly converts the node from folklore benchmark to observed decision volume"
      },
      {
        "action": "Target the purchase moments bundles don't reach: colo TENANT-side PDU purchases and brownfield retrofit/metering upgrades, where no incumbent package exists to hide the PDU inside",
        "type": "strategic",
        "note": "Retrofit demand is decision-rich even when new-build demand is bundled"
      },
      {
        "action": "Price and package for attach to third-party rack integrators' bundles rather than head-to-head against incumbent bundles",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "Beschaffung von Stromverteilereinheiten (PDU) — Direct Award, Stadt Zürich",
        "sourceType": "industry-report",
        "publisher": "it-beschaffung.ch / Stadt Zürich OIZ",
        "date": "2024-07-04",
        "excerpt": "Beschaffung von 900 Stromverteilereinheiten... Awards: Riedo Networks AG CHF 1,996,000. Marktabklärungen zeigten, dass nur eine Firma PDU anbieten kann... Die Vergabe erfolgt somit freihändig.",
        "url": "https://www.it-beschaffung.ch/564/beschaffung-von-stromverteilereinheiten-pdu",
        "attached": true
      },
      {
        "title": "Serviceable Obtainable Market (SOM): How to Calculate It",
        "sourceType": "industry-report",
        "publisher": "Prospeo",
        "excerpt": "SOM is the revenue you can realistically capture in 1-3 years. Not a fantasy percentage of SAM.",
        "url": "https://prospeo.io/s/serviceable-obtainable-market",
        "attached": true
      },
      {
        "title": "SAM vs SOM: Key Differences Explained",
        "sourceType": "industry-report",
        "publisher": "VC Beast",
        "date": "2026-03-13",
        "excerpt": "SOM is the portion of SAM you can realistically capture in a defined time period (usually 3-5 years)... Typical SOM is 1-5% of SAM for early-stage companies.",
        "url": "https://vcbeast.com/compare/sam-vs-som",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only observing whether standalone, multi-vendor rack-PDU tenders actually materialize in CE-7 over the next 6-24 months (the falsifier itself is a forward pipeline count) settles this. Whether incumbents continue to bundle at zero margin and whether contestable standalone demand emerges is a market-unfolding question, not a purchasable fact about today.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 17/20 · E[ΔYAM] −€0.37M · engine ΔYAM −€0.74M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.intelligent-subset-inflation.json
  {
    "id": "risk.definition-scopedown.intelligent-subset-inflation",
    "title": "Base counts basic PDUs the venture cannot sell, halving the market",
    "narrative": "The model assumes the venture can sell into the full €300M rack-PDU market. But Grand View, the source of that figure, says the non-intelligent segment held the largest revenue share in 2025, and the venture sells only intelligent PDUs. About half the €300M is basic units the product cannot address, so the Year-1 number is inflated about 2x.",
    "category": "fact",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "Grand View says non-intelligent PDUs held the largest 2025 share. → Vendors sell intelligent and basic PDUs as separate products. → SAM €165M and YAM €1.65M both inherit the inflation.",
    "whyMissable": "The label 'rack-PDU market' looks matched to a rack-PDU vendor, but the mismatch sits inside the source's own segmentation table below the headline.",
    "falsifier": "A European source showing intelligent PDUs at 75% or more of rack-PDU revenue.",
    "likelihood": {
      "value": 0.5,
      "rationale": "The source states non-intelligent held the largest revenue share globally. But intelligent units carry 3-5x prices and European buyers skew intelligent, so the European intelligent share plausibly lands at 45-60%.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "scale",
        "value": 0.55,
        "note": "Restrict the base to the intelligent-PDU-relevant revenue share of the rack-PDU category (~55% revenue-weighted in Europe)"
      }
    ],
    "indicators": [
      {
        "signal": "Intelligent vs non-intelligent revenue split in the next Grand View / Mordor rack-PDU report vintage",
        "where": "Grand View Research rack-PDU report segment tables; Mordor Intelligence Intelligent PDU report",
        "threshold": "Non-intelligent still ≥45% of European revenue",
        "updates": "increases"
      },
      {
        "signal": "ASP spread between basic/metered and switched/outlet-metered SKUs on incumbent price lists",
        "where": "Vertiv Geist, Raritan/Legrand, and APC published EU price lists",
        "threshold": "Basic-unit volumes dominating distributor stock at <€500 ASP while intelligent SKUs sit >€1,500",
        "updates": "increases"
      },
      {
        "signal": "Published intelligent-vs-total rack-PDU revenue split for EU or Germany",
        "where": "IndexBox EU/Germany Intelligent Rack PDUs report headlines; Omdia Rack PDU Annual Market Analysis abstract updates",
        "threshold": "Intelligent share reported below 70% of category revenue",
        "updates": "increases"
      },
      {
        "signal": "SKU mix stocked and quoted by CE distributors (basic vs metered vs switched/intelligent)",
        "where": "CE electrical/IT distributor price lists and catalogs (e.g., Rexel, Also/Ingram DC-infrastructure lines)",
        "threshold": "Basic+metered-only SKUs constituting the majority of listed rack-PDU line items",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission the IndexBox EU Intelligent Rack PDUs report and difference it against the general EU Rack PDUs report to isolate the venture-relevant base",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "Two $4,000 reports collapse the product-scope ambiguity that the ±40% band silently absorbs"
      },
      {
        "action": "Add a metered-only downmarket SKU to the roadmap so the non-intelligent half of the base is addressable rather than excluded",
        "type": "strategic",
        "note": "Converts a TAM-definition problem into a product-line decision"
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

  // ○ front-of-mind · lens: demand-discontinuity · judge 17/20 · E[ΔYAM] −€0.33M · engine ΔYAM −€0.74M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.demand-discontinuity.frankfurt-grid-queue-de-slip.json
  {
    "id": "risk.demand-discontinuity.frankfurt-grid-queue-de-slip",
    "title": "Frankfurt grid queue could push half the Year-1 orders to 2027",
    "narrative": "The model treats Germany as a diversified half of the market. But Frankfurt hosts about 75% of German capacity, so roughly 37% of Year-1 demand routes through one metro where grid connections now wait 24–36 months. If Frankfurt's 542 MW under construction slips past 2026, the largest tranche of Year-1 orders moves to 2027–28.",
    "category": "exogenous",
    "targetNodes": [
      "geo.DE",
      "obtainableFactor"
    ],
    "mechanism": "Frankfurt grid connections wait 24–36 months; 542 MW awaits energization → Frankfurt is 75% of German capacity; deferred energization defers the biggest orders → DE share falls to 0.42 and Year-1 pace drops with it",
    "whyMissable": "The ledger tracks country shares but has no metro dimension, so the fact that half the funnel routes through one grid queue is invisible.",
    "falsifier": "Grid operator commitments or Frankfurt data showing live IT load stepping up by more than 100 MW within Year-1.",
    "likelihood": {
      "value": 0.45,
      "rationale": "Queue lengths and near-zero vacancy are documented, and projects under construction usually hold secured grid slots, so slippage hits planning-stage projects harder. New capacity is also migrating to sites outside the Frankfurt queue, which caps the upward revision.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "geo.DE",
        "op": "set",
        "value": 0.42,
        "note": "DE share of contestable in-window demand falls to the installed-load low bound as Frankfurt additions slip"
      },
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.6,
        "note": "Year-1 pace compressed as the largest geography's fit-outs defer"
      }
    ],
    "indicators": [
      {
        "signal": "Frankfurt live IT-load and under-construction prints",
        "where": "JLL German data center market updates and Mordor Frankfurt series",
        "threshold": "<+50 MW live-load growth across two consecutive half-year prints",
        "updates": "increases"
      },
      {
        "signal": "Grid-connection queue length and energization commitments for Rhein-Main data-center applicants",
        "where": "TenneT/Amprion connection disclosures and Hesse permitting dockets; operator capex-call commentary on Frankfurt energization dates",
        "threshold": "Stated waits lengthening beyond 36 months or named projects re-guiding commissioning by ≥2 quarters",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission an energization-date audit of the Frankfurt 542 MW under-construction pipeline (which projects hold firm grid allocations for 2026)",
        "type": "information",
        "voiNodeId": "geo.DE",
        "note": "Separates timing risk from level risk in the DE share"
      },
      {
        "action": "Rebalance the Year-1 territory plan toward Berlin (219 MW in planning) and Poland/CEE, where additions are less grid-queue-bound",
        "type": "strategic"
      },
      {
        "action": "Launch a retrofit/replacement SKU program for operating Frankfurt halls whose demand does not depend on new grid connections",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "Germany's Data Center Strategy vs. AI Energy Demand",
        "sourceType": "industry-report",
        "publisher": "innobu",
        "date": "2026-04-01",
        "excerpt": "In Frankfurt, 126 data centers account for up to 40 percent of city-wide power consumption, and new grid connections are unavailable until the mid-2030s. The Energy Efficiency Act requires operators to source 100 percent renewable electricity by January 2027, reuse at least 10 percent of waste heat from July 2026, and maintain a maximum PUE of 1.2 for new facilities.",
        "url": "https://www.innobu.com/en/articles/data-center-strategy-ai-energy-demand.html",
        "attached": true
      },
      {
        "title": "Frankfurt's Data Center Market Has Hit a Physical Wall",
        "sourceType": "industry-report",
        "publisher": "KiTalent",
        "date": "2026-03-01",
        "excerpt": "Available utility capacity for new large-scale developments within Frankfurt city limits is effectively zero. High-voltage grid connections now carry wait times of 24 to 36 months. The Energy Efficiency Act mandates PUE of 1.2 or better from 2026 onward.",
        "url": "https://kitalent.com/articles/frankfurt-data-center-talent-crisis",
        "attached": true
      },
      {
        "title": "TenneT, Uniper Partner for Power Station for Frankfurt Region",
        "sourceType": "industry-report",
        "publisher": "Rigzone",
        "date": "2026-01-25",
        "excerpt": "Uniper and TenneT agreed to develop a new central network node in Grosskrotzenburg to serve data center-driven growth in power demand in the greater Frankfurt area, targeting to start operation earlier than planned.",
        "url": "https://www.rigzone.com/news/tennet_uniper_partner_for_power_station_for_frankfurt_region-25-jan-2026-182841-article/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "A current Frankfurt-vs-Germany capacity dataset (e.g., Statista/BMWK metro-level split) showing Frankfurt's actual share of German colocation/IT power today — this is a knowable present fact, not a future event.",
    "proposedCorrection": {
      "nodeId": "geo.DE",
      "value": 0.42,
      "low": 0.4,
      "high": 0.5,
      "rationale": "The claim's load-bearing '75% of German capacity in Frankfurt' concentration is overstated — FLAP-D data shows Frankfurt at roughly 55–65% of German colo capacity, so DE share should sit at the installed-IT-load low end (0.42) rather than the colo-scope 0.50, but the correction is a today's-share fact, not the future slip."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: regulatory-gauntlet · judge 18/20 · E[ΔYAM] −€0.33M · engine ΔYAM −€0.83M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.red-en18031-wireless-sensor-gate.json
  {
    "id": "risk.regulatory-gauntlet.red-en18031-wireless-sensor-gate",
    "title": "One WiFi sensor forces EU radio security review, adds 2 quarters",
    "narrative": "The model assumes the smart PDU can start selling right away and win 1% of its market in Year 1. But if it ships with any radio, an EU cybersecurity rule in force since 1 August 2025 requires a notified body to certify it, adding a 4 to 6 month wait. That queue shortens the selling window from 12 months to 6 to 8, cutting the Year-1 number roughly in half.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "Product ships with a radio, triggering the EU rule live since August 2025. → Access-control settings force notified-body review; late start loses Year-1 deals. → Shorter selling window cuts the 1% Year-1 share about in half.",
    "whyMissable": "The rule reads as being about radios, so this power-distribution team overlooks it, and nobody owns the requirement triggered by a cheap wireless sensor.",
    "falsifier": "Proof the launch product is wired-only, or an assessment showing its access-control design needs only self-declaration with a certificate in hand before first shipment.",
    "likelihood": {
      "value": 0.4,
      "rationale": "Wireless sensing is common in current smart-PDU designs and the certification traps are documented, but a wired-only launch fully avoids the gate. Timing, restrictions, and the 12 to 20 week lead time are confirmed, so we raise likelihood from 0.35 to 0.40, bounded by not knowing if the launch product ships a radio.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.5,
        "note": "Selling window compressed from 12 to ~6–8 months by notified-body lead time"
      }
    ],
    "indicators": [
      {
        "signal": "EN 18031 harmonization restrictions status (whether the OJ listing's restrictions are lifted or extended)",
        "where": "EU Official Journal harmonized-standards citations under RED; NANDO database queue times for RED cybersecurity notified bodies",
        "threshold": "Notified-body lead quotes >4 months, or restrictions extended into 2026",
        "updates": "increases"
      },
      {
        "signal": "Own-product radio scope decision and test-house booking",
        "where": "Internal launch BOM review; test-house (TÜV/DEKRA) quotation and slot calendar for EN 18031",
        "threshold": "Radio in launch SKU with no notified-body slot booked 9 months pre-launch",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run an immediate RED applicability screen on every launch configuration and get a written EN 18031 gap assessment from a notified body",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts an unknown certification clock into a dated one"
      },
      {
        "action": "De-content the launch SKU to wired-only (Ethernet/serial), shipping wireless sensing as a post-certification accessory",
        "type": "operational",
        "note": "Removes the gate from the critical path entirely"
      }
    ],
    "evidence": [
      {
        "title": "EU Harmonizes EN 18031 Standards",
        "sourceType": "industry-report",
        "publisher": "SGS",
        "date": "2025-02-01",
        "excerpt": "If applied in full, the EN 18031-X:2024 series of harmonized standards allow manufacturers to demonstrate regulatory compliance by offering self-declaration, thereby avoiding the involvement of a Notified Body. However, if a product does not fully comply... manufacturers must obtain certification via a Notified Body before placing their [products on the market].",
        "url": "https://www.sgs.com/en/news/2025/02/safeguards-02625-eu-harmonizes-en-18031-standards",
        "attached": true
      },
      {
        "title": "Cybersecurity in Europe (webinar)",
        "sourceType": "industry-report",
        "publisher": "Nemko",
        "date": "2025-02-25",
        "excerpt": "1 Aug 2025 cybersecurity is part of CE marking for wireless products (RED)... When using password, the option not to set password is not accepted... If no harmonized standard is used = Notified Body",
        "url": "https://www.nemko.com/hubfs/2025-02-25%20Webinar%20-%20for%20distribution.pdf",
        "attached": true
      },
      {
        "title": "EN 18031-1 General Cybersecurity Certification: Steps & Timeline",
        "sourceType": "industry-report",
        "publisher": "BlueAsia Labs",
        "date": "2025-12-23",
        "excerpt": "The 12-20 week process detailed here applies to products requiring notified body (NB) conformity assessment... many enterprises faced delays: no pre-testing leading to 1-month rework; incomplete documents causing 3-week audit holds; underestimated factory audit time missing launch windows.",
        "url": "https://www.blueasialabs.com/shouyehuandeng/en-18031-1-general-cybersecurity-certification-steps-amp-timeline",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the actual product design decision (radio vs wired-only, self-declaration vs notified-body path) and the real certification queue timing as the launch unfolds would settle whether Year-1 window is truncated. The regulation exists today, but whether it binds depends on unmade product/compliance choices and future queue behavior — time settles it, not a purchasable report.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 16/20 · E[ΔYAM] −€0.30M · engine ΔYAM −€0.73M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.framework-agreements-close-first-buyer.json
  {
    "id": "risk.competitive-foreclosure.framework-agreements-close-first-buyer",
    "title": "Large-operator sales are locked up by long-term framework deals",
    "narrative": "The model names large operators as the first buyer and prices that cell at 40% of spend. But those operators buy rack power through multi-year framework contracts, like the Digital Realty–Schneider $373M deal, that remove the tender from the market for the whole term. If most of that 40% is already under contract, the Year-1 beachhead is closed and the number shifts onto slower cells.",
    "category": "competitive",
    "targetNodes": [
      "cust.operator-large",
      "obtainableFactor"
    ],
    "mechanism": "Large operators extend multi-year framework deals with incumbent vendors → No open bid reaches the market during the contract term → The reachable large-operator share falls from 40% to about 20%",
    "whyMissable": "'Large operators buy direct' reads as good news, hiding that direct buying at this scale means locked framework contracts, not open sales.",
    "falsifier": "Two or more large operators issuing open, multi-vendor rack-PDU bids within the next 12 months.",
    "likelihood": {
      "value": 0.42,
      "rationale": "Multiple documented deals point the same way, so the mechanism is real. What is uncertain is how much operator spend is locked, and the vendor's own claim of a multi-vendor environment argues against full foreclosure.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "cust.operator-large",
        "op": "set",
        "value": 0.2,
        "note": "Framework-governed spend removed from the addressable large-operator cell; residual is framework gaps, expiries and carve-outs"
      },
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.7,
        "note": "Year-1 pace slows further because the remaining open demand sits in channels the venture did not plan to enter first"
      }
    ],
    "indicators": [
      {
        "signal": "Global or EMEA rack-power framework renewals announced by Schneider/Vertiv/Eaton with named CE operators",
        "where": "Schneider and Vertiv press rooms; DataCenterDynamics procurement coverage; operator annual reports (supplier commitments notes)",
        "threshold": "Any CE major renewing a ≥3-year rack-power framework during the venture's launch year",
        "updates": "increases"
      },
      {
        "signal": "Standalone rack-PDU lots appearing in European public/colo tenders",
        "where": "TED (tenders.europa.eu) CPV codes for power distribution equipment; national procurement portals (DE: bund.de vergabe)",
        "threshold": "Fewer than 2 standalone, multi-vendor PDU lots per quarter across CE-7",
        "updates": "increases"
      },
      {
        "signal": "AVL qualification requirements and cycle times quoted in operator supplier-onboarding portals",
        "where": "Equinix/Digital Realty/NTT GDC supplier registration portals; Vantage/CyrusOne EU procurement contacts",
        "threshold": "Mandatory ISO 27001 or 12+ month qualification stated for electrical-fit-out vendors",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Structured interviews with 3 CE operator procurement leads specifically on framework coverage, term dates, and second-source carve-out clauses",
        "type": "information",
        "voiNodeId": "cust.operator-large",
        "note": "Replaces the unsourced 0.40 with a framework-adjusted addressable share and yields an expiry calendar"
      },
      {
        "action": "Build the Year-1 account plan around framework expiry dates and approved-second-source slots rather than open-market wins",
        "type": "strategic",
        "note": "Frameworks typically permit qualified alternates; entering as second source converts foreclosure into a wedge"
      },
      {
        "action": "Negotiate pilot clauses with operators' innovation/energy teams that sit outside procurement frameworks (retrofit metering pilots)",
        "type": "contractual",
        "note": "Pilot spend often bypasses framework governance thresholds"
      }
    ],
    "evidence": [
      {
        "title": "Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement",
        "sourceType": "industry-report",
        "publisher": "PR Newswire / Schneider Electric",
        "date": "2025-11-19",
        "excerpt": "has signed a $373 million Supply Capacity Agreement (SCA) for UPS, Low Voltage Switchgear, and Pre-Fabricated Skids... The strategic shift to an SCA model provides guaranteed capacity... while preserving the flexibility needed for a dynamic, multi-vendor environment to mitigate risk.",
        "url": "https://www.prnewswire.com/news-releases/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-to-meet-rising-data-center-demand-302620427.html",
        "attached": true
      },
      {
        "title": "HD Hyundai Electric Signs $1.1 Billion Supply Deal with Big Tech for North American Data Centers",
        "sourceType": "industry-report",
        "publisher": "AJU Press",
        "date": "2026-07-02",
        "excerpt": "entered into a basic contract for a long-term supply of distribution and power equipment worth up to $1.1 billion... Supplying both types of equipment together enhances the design consistency... and reduces risks in delivery, quality, and after-sales service.",
        "url": "https://m.ajupress.com/view/20260702112470315",
        "attached": true
      },
      {
        "title": "Supply Chain and Technology Agreements in Data Center Construction",
        "sourceType": "industry-report",
        "publisher": "Bracewell LLP / JD Supra",
        "date": "2026-01-27",
        "excerpt": "data center operators are increasingly relying on robust supply chain and technology agreements that include component shortage remedies, price adjustment clauses, alternative sourcing clauses as well as revamped force majeure.",
        "url": "https://www.jdsupra.com/legalnews/supply-chain-and-technology-agreements-1931379/",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the unfolding of the next 12 months settles this: whether large operators actually issue open, multi-vendor rack-PDU tenders during current framework terms, or keep spend locked. No purchasable dataset today states what fraction of the 40% is contract-foreclosed for rack-PDU specifically — the cited deals cover UPS/switchgear/skids, not rack PDUs, and even those preserve 'multi-vendor' flexibility. The claim hinges on future tender behavior, a foreclosure gate that may or may not bind.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: base-rate-analogy · judge 16/20 · E[ΔYAM] −€0.27M · engine ΔYAM −€0.60M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.base-rate-analogy.prelet-lockin-serviceable-window.json
  {
    "id": "risk.base-rate-analogy.prelet-lockin-serviceable-window",
    "title": "Serviceable share ignores timing, overstating Year-1 demand",
    "narrative": "The model sets serviceable reach at 0.55, treating reach as a fixed property. But for data-center electrical gear, demand that invoices in the next 12 months was already specified at design stage, and the entrant's EU compliance stack takes 6-9 months before it can even bid. Demand that is both open and reachable in Year 1 is closer to 0.35, so the Year-1 number is too high.",
    "category": "model-structure",
    "targetNodes": [
      "serviceableFactor"
    ],
    "mechanism": "Rack-power specs for 2026 capacity were locked before launch. → Entrant cannot bid until EU certifications clear in 6-9 months. → Reach of 0.55 counts demand unreachable in Year 1; effective share near 0.35.",
    "whyMissable": "The number looks handled because it already discounts 45% of the market and cites the regulatory stack, but it checks the level, not the timing.",
    "falsifier": "Three or more EU operator RFQs for rack PDUs in the next two quarters that accept vendors certifying mid-tender and award within 9 months of publication.",
    "likelihood": {
      "value": 0.45,
      "rationale": "Data-center hardware sales cycles of 12-18 months and certification of 6-9 months are well-established. The open question is what fraction of demand is spot-contestable, which no source quantifies.",
      "basis": "base-rate"
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.35,
        "note": "Static reach haircut tightened to window-adjusted reach: demand that is both uncommitted and open to a vendor whose certification completes mid-year"
      }
    ],
    "indicators": [
      {
        "signal": "Time from RFQ publication to award for rack-power line items in CE",
        "where": "TED (Tenders Electronic Daily) and major CE colo operator procurement portals (e.g., NTT, Vantage, Data4 supplier registration pages)",
        "threshold": "Median award cycle >9 months, or supplier prequalification requiring completed certification at bid time",
        "updates": "increases"
      },
      {
        "signal": "Quoted lead time for the venture's own TÜV/CE certification slots",
        "where": "TÜV NORD / TÜV SÜD test-lab booking confirmations and notified-body queue quotes",
        "threshold": "Certification completion date beyond month 8 of the launch year",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a bottom-up channel-coverage model (named CE accounts × spec-lock status × certification-at-bid requirements) to produce a window-adjusted serviceable estimate",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "The ledger's promotionPath names this model; adding the spec-lock dimension is the marginal work that prices the clock"
      },
      {
        "action": "Start the full EU certification stack before launch and pre-register as a supplier on operator procurement portals so month-1 of the commercial window is not month-1 of the compliance clock",
        "type": "operational",
        "note": "Converts sequential cert→bid timeline into parallel; recovers 4-6 months of the window"
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The entrant's EU certification timeline (EN 50600, ecodesign 2019/424, CE/TÜV lead times) and the share of 2026 data-center electrical-gear demand already spec-locked at design stage — both knowable today from certification bodies and design-cycle data, not future events.",
    "proposedCorrection": {
      "nodeId": "serviceableFactor",
      "value": 0.35,
      "low": 0.28,
      "high": 0.45,
      "rationale": "Serviceable share must exclude demand already spec-locked before launch and demand unreachable during the 6-9 month certification window, lowering effective Year-1 reach from 0.55 to ~0.35."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 17/20 · E[ΔYAM] −€0.26M · engine ΔYAM +€0.66M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.band-top-contaminated-comparator.json
  {
    "id": "risk.definition-scopedown.band-top-contaminated-comparator",
    "title": "Market ceiling may be too low; plan sized for wrong market",
    "narrative": "The model caps the market base at €360M, cut down from €495M using a 10–12% growth rate. But that growth rate comes from a €8.5–9.5B report covering a far broader category than rack PDUs, so the fix imported the same error it claimed to remove. Germany alone is forecast at $509.6M by 2031, already above the whole base. If the true base sits at €400M or more, the Year-1 plan is sized for the wrong market.",
    "category": "fact",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "The growth rate used to cut the ceiling came from a broad multi-category report, not rack PDUs. → Germany alone reaches $509.6M by 2031 and global anchors span $1.7B to $3.94B. → A low base sizes the Year-1 plan too small for certification and channel needs.",
    "whyMissable": "Cutting an inflated ceiling reads as rigor, so nobody audits the number that justified the cut.",
    "falsifier": "A dedicated rack-PDU report showing the EU base at or below €360M for 2025/2026.",
    "likelihood": {
      "value": 0.4,
      "rationale": "Several broader datapoints point above the band, but each carries the same category-breadth uncertainty. The true rack-PDU base remains untested behind paywalled reports, so the ceiling is unproven rather than proven wrong.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "set",
        "value": 420,
        "note": "Base above the current band top, consistent with the Germany-alone $509.6M signal and the upper global anchors"
      }
    ],
    "indicators": [
      {
        "signal": "Directly-scoped EU/DE rack-PDU headline figures",
        "where": "IndexBox EU Rack PDUs and Germany Rack PDUs reports ($4,000 each); Omdia rack-PDU vendor share table",
        "threshold": "EU headline >€400M or Germany >€180M",
        "updates": "increases"
      },
      {
        "signal": "Incumbent EMEA rack-power growth outrunning the model's 9% CAGR",
        "where": "Vertiv and Legrand quarterly earnings calls, EMEA data-center product-line commentary",
        "threshold": "Two consecutive quarters of >15% YoY EMEA rack-power growth",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission the IndexBox EU Rack PDUs report to fix the base directly — it resolves this hypothesis and the Europe-share hop simultaneously",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "The ledger's own promotionPath; a $4,000 spend against a €60M+ band question"
      },
      {
        "action": "Build the Year-1 operating plan with staged capacity options (certification scope and contract manufacturing volumes expandable at 6-month gates) rather than fixed to the €165M SAM",
        "type": "operational",
        "note": "Makes the plan robust to the base being above the band without pre-committing capital"
      }
    ],
    "evidence": [
      {
        "title": "European Union Power and Cable Management - Market Analysis, Forecast, Size, Trends and Insights",
        "sourceType": "industry-report",
        "publisher": "IndexBox",
        "date": "2026-04-28",
        "excerpt": "The European Union Power And Cable Management market is estimated at €8.5–€9.5 billion in 2026... Managed and intelligent power distribution units (PDUs) represent the fastest-growing segment, expanding at 10–12% annually",
        "url": "https://www.indexbox.io/store/european-union-power-and-cable-management-market-analysis-forecast-size-trends-and-insights/",
        "attached": true
      },
      {
        "title": "Data Center Rack Power Distribution Unit (PDU) Market Size & Share Analysis",
        "sourceType": "industry-report",
        "publisher": "Mordor Intelligence",
        "date": "2019-05-07",
        "excerpt": "the data center rack power distribution unit (PDU) market size is expected to increase from USD 2.78 billion in 2025 to USD 3.01 billion in 2026 and reach USD 4.62 billion by 2031, growing at a CAGR of 8.96%",
        "url": "https://www.mordorintelligence.com/industry-reports/data-center-rack-pdu-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The directly-scoped IndexBox EU Rack PDUs report (country tables) or the Mordor/Grand View global rack-PDU base with a defensible Europe/CE regional split — a purchasable existing dataset that pins the 2025/2026 base today.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 330,
      "low": 280,
      "high": 400,
      "rationale": "The scope-down uses Grand View's global $2.81B, but Mordor's more recent figure ($2.78B→$3.01B 2026) and Germany-alone forecasts ($509.6M by 2031) suggest the €360M band top is too tight; widening to €400M and re-centering to €330M reflects a defensible CE rack-PDU base without importing the broad PDU+PSU category error."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: demand-discontinuity · judge 16/20 · E[ΔYAM] −€0.25M · engine ΔYAM −€0.83M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.demand-discontinuity.construction-plateau-lumpy-year1.json
  {
    "id": "risk.demand-discontinuity.construction-plateau-lumpy-year1",
    "title": "Year-1 may hit a building lull the trend growth hides",
    "narrative": "The model assumes Year-1 lands in an average demand year at 1% of the serviceable market. But EMEA capacity under construction has stalled at about 2.5 GW while the pipeline grew 25% to nearly 15 GW, so projects are stuck in planning. If 2026 is a digestion year, Year-1 order pace could be roughly half the assumed level.",
    "category": "exogenous",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "EMEA construction stalled at 2.5 GW; pipeline grew to 15 GW → Cloud buys 61% of demand; a pause stalls orders → A trough year roughly halves achievable Year-1 pace",
    "whyMissable": "The growth rate looks solid across three publishers, but a smooth average hides which year of the cycle the launch actually lands in.",
    "falsifier": "Cushman & Wakefield or JLL H1-2026 prints showing under-construction capacity above 2.5 GW with rising starts, or hyperscaler guidance re-accelerating 2026 European data-center capex.",
    "likelihood": {
      "value": 0.3,
      "rationale": "The plateau and buyer concentration are documented, but the timing of a digestion year is a judgment call. Record 2026 hyperscaler leasing and an 83% pre-let pipeline point the other way, so we cut the estimate modestly from 0.35.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.5,
        "note": "Trough-year order flow: achievable Year-1 pace at half the on-trend anchor"
      }
    ],
    "indicators": [
      {
        "signal": "European data-center capex commentary and guidance from the top cloud buyers",
        "where": "Microsoft/Alphabet/Amazon/Meta quarterly earnings calls, EU infrastructure line items",
        "threshold": "Two or more guiding EU DC capex flat-to-down for 2026",
        "updates": "increases"
      },
      {
        "signal": "EMEA under-construction capacity metric",
        "where": "Cushman & Wakefield EMEA data centre update (half-yearly)",
        "threshold": "UC stuck at ≤2.5 GW for two consecutive prints while pipeline keeps growing",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build a CE fit-out start-date tracker (construction starts, not announcements) to time the Year-1 sales push against real order windows",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts the cycle-timing guess into an observed conversion rate"
      },
      {
        "action": "Anchor the Year-1 revenue plan on installed-base retrofit and replacement demand, which is driven by the operating stock rather than the construction cycle",
        "type": "strategic"
      },
      {
        "action": "Keep manufacturing and inventory commitments flexible (contract manufacturing, low fixed minimums) to survive a two-quarter order trough without cash strain",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "Cushman & Wakefield: European data centre growth is shifting",
        "sourceType": "industry-report",
        "publisher": "Cushman & Wakefield",
        "date": "2026-04-28",
        "excerpt": "the total development pipeline increased by more than 25% to nearly 15 GW. In practice, however, delivery is lagging behind. Capacity currently under construction has plateaued at around 2.5 GW.",
        "url": "https://www.cushmanwakefield.com/en/netherlands/news/2026/04/emea-datacentre-update-h2-2025",
        "attached": true
      },
      {
        "title": "1Q 2026 EMEA Data Center Market Report",
        "sourceType": "industry-report",
        "publisher": "datacenterHawk",
        "excerpt": "Hyperscalers returned to Europe at record scale... 767MW Q1 absorption (record)",
        "url": "https://datacenterhawk.com/resources/market-insights/1q-2026-emea-data-center-market-report",
        "attached": true
      },
      {
        "title": "EMEA year end data centre report 2025",
        "sourceType": "industry-report",
        "publisher": "JLL",
        "date": "2026-03-30",
        "excerpt": "FLAP-D vacancy hits record low of 6.3%, pipeline is 83% pre-let. Capacity is being absorbed faster than it can be replaced.",
        "url": "https://www.jll.com/en-uk/insights/emea-data-centre-report",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only H1-2026 and full-year 2026 market prints (Cushman/JLL/datacenterHawk) can reveal whether 2026 is actually a digestion year with construction stalled and order pace halved — this depends on how the next 6-12 months unfold, not on a fact knowable today.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: ledger-self-audit · judge 17/20 · E[ΔYAM] −€0.21M · engine ΔYAM −€0.49M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.ledger-self-audit.europe-thirty-percent-arithmetic-ghost.json
  {
    "id": "risk.ledger-self-audit.europe-thirty-percent-arithmetic-ghost",
    "title": "Unsourced 'Europe = 30%' hop could drop the base below its floor",
    "narrative": "The model builds tamBase from a global figure times a 'Europe = 30%' share, and presents it as a bounded 240 to 360 range. But that 30% share is an analyst guess with no source, and the global anchor itself ranges from $1.7B to $5.3B, wider than the stated band. A hostile reviewer who swaps in the lowest credible numbers lands near €200M, below the floor, so the Year-1 base cannot survive audit.",
    "category": "fact",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "Diligence checks the global anchor and finds estimates from $1.7B to $5.3B. → The unsourced 30% Europe share cannot rescue a contested anchor. → Every downstream number inherits a base below the stated band.",
    "whyMissable": "A removed €495M ceiling makes the base look stress-tested, but the fix left the weakest hop, the unsourced Europe share, untouched.",
    "falsifier": "Commissioned IndexBox EU rack-PDU country tables placing the CE-7 base at €270M or above.",
    "likelihood": {
      "value": 0.42,
      "rationale": "The 2.3x global spread and the unsourced Europe hop are documented facts, so the defensibility failure is certain. Whether the true value sits below the floor is a judgment call, since a Germany-alone $509.6M figure cuts the other way.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "set",
        "value": 210,
        "note": "Low-credible-anchor reconstruction: bottom-quartile global rack-PDU estimate × conservative Europe share × unchanged CE-7 step — the number a hostile reviewer writes in the margin"
      }
    ],
    "indicators": [
      {
        "signal": "IndexBox EU rack-PDU report headline (currently paywalled) or any second Europe-scoped rack-PDU figure",
        "where": "IndexBox price list / report catalog; Omdia and Dell'Oro rack-power publication schedules",
        "threshold": "Any directly-scoped EU figure implying CE-7 <€250M",
        "updates": "increases"
      },
      {
        "signal": "Convergence or further divergence of next-vintage global rack-PDU estimates",
        "where": "Grand View, Mordor, QY Research 2026 report refreshes",
        "threshold": "Next-vintage spread across publishers remaining >1.8x",
        "updates": "increases"
      },
      {
        "signal": "Europe regional revenue share in any rack-PDU-specific report vintage",
        "where": "Grand View rack-PDU report regional segmentation; IndexBox world benchmark report vs EU report headline ratio",
        "threshold": "Europe stated or derivable at <27%",
        "updates": "increases"
      },
      {
        "signal": "EMEA vs Americas vs APAC rack-power revenue mix in incumbent disclosures",
        "where": "Vertiv 10-K segment reporting; Legrand annual report data-center line commentary",
        "threshold": "EMEA rack-power consistently <25% of global segment revenue",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission the IndexBox EU rack-PDU country tables now — the ledger's own promotion path — before the model is shown to any external audience",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "Collapses the widest structural uncertainty in the model for the price of one report"
      },
      {
        "action": "Build a bottom-up cross-check: CE-7 installed MW × racks/MW × PDUs/rack × ASP, so the top-down chain has an independent second method rather than a contaminated comparator",
        "type": "operational",
        "note": "A 2-method triangulation survives diligence even if each method is imprecise"
      }
    ],
    "evidence": [
      {
        "title": "Data Center Rack Power Distribution Unit Market Report 2033",
        "sourceType": "industry-report",
        "publisher": "Grand View Research",
        "date": "2026-02",
        "excerpt": "North America held 38.0% revenue share of the global data center rack power distribution unit market. Global market size estimated at USD 2.81 billion in 2025.",
        "url": "https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market",
        "attached": true
      },
      {
        "title": "Data Center Rack PDU - Global Market Share and Ranking, Forecast 2024-2030",
        "sourceType": "analyst-estimate",
        "publisher": "QY Research",
        "date": "2025-01-02",
        "excerpt": "The global market for Data Center Rack Power Distribution Unit (PDU) was estimated to be worth US$ 1582 million in 2023, far below other publishers' figures.",
        "url": "https://www.qyresearch.com/reports/3520535/data-center-rack-power-distribution-unit--pdu",
        "attached": true
      },
      {
        "title": "Power Distribution Unit Market Size ($8.5 Billion) 2030",
        "sourceType": "analyst-estimate",
        "publisher": "Strategic Market Research",
        "excerpt": "The Power Distribution Unit (PDU) Market was valued at USD 4.8 billion in 2024 and is projected to reach around USD 8.5 billion by 2030.",
        "url": "https://www.strategicmarketresearch.com/market-report/power-distribution-unit-market",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "The commissioned IndexBox EU Rack PDUs country-table report (or an equivalent directly-scoped Europe/CE rack-PDU figure) would settle this today — it pins the base directly rather than relying on a global anchor × unsourced 30% hop. This is a definitional/scope-mismatch about today's market, not a future unfolding.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 300,
      "low": 200,
      "high": 360,
      "rationale": "The Europe share is an unsourced analyst guess and the global anchor itself ranges $1.58B–$4.8B, so the lower bound must widen to ~€200M to honestly reflect the contested inputs until the directly-scoped EU figure is commissioned."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: base-rate-analogy · judge 16/20 · E[ΔYAM] −€0.20M · engine ΔYAM −€0.50M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.base-rate-analogy.poc-acceptance-reversal.json
  {
    "id": "risk.base-rate-analogy.poc-acceptance-reversal",
    "title": "A third of Year-1 hardware wins get returned, cutting realized share",
    "narrative": "The model assumes the venture keeps whatever small share it wins in Year 1. But in the reference class, 30% of deployed industrial hardware systems are never fully accepted and get pulled back out. That makes the Year-1 number roughly 30% too high, and the lost accounts also undercut the Year-2 benchmark that assumes they survive.",
    "category": "execution",
    "targetNodes": [
      "obtainableFactor"
    ],
    "mechanism": "30% of deployed industrial hardware systems were never fully accepted → First-year wins are pilots; PDU acceptance depends on post-install integration → obtainableFactor is gross; net of returns, Year-1 share drops 30%",
    "whyMissable": "The revenue number already looks conservative at 1% of market, so no one checks whether that 1% stays booked.",
    "falsifier": "The first three pilot deployments pass formal customer acceptance within 90 days of install, with no rollback in the following two quarters.",
    "likelihood": {
      "value": 0.4,
      "rationale": "The 30% non-acceptance rate now has the primary source plus two independent industrial-IoT datasets, and zero support track record raises the entrant's exposure. Revised up from 0.35 to 0.40, bounded because the base rate comes from adjacent classes and PDUs are simpler hardware.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "obtainableFactor",
        "op": "scale",
        "value": 0.7,
        "note": "Gross Year-1 capture haircut by the industrial-hardware non-acceptance base rate (~30% of deployments reverse)"
      }
    ],
    "indicators": [
      {
        "signal": "Acceptance and return-rights clauses in pilot contracts",
        "where": "Redlines from CE operator procurement teams on the venture's pilot MSAs, reviewed at each signing",
        "threshold": "Acceptance windows >90 days or unconditional return rights in a majority of pilot contracts",
        "updates": "increases"
      },
      {
        "signal": "DCIM interoperability status of the product against the platforms CE operators run",
        "where": "Sunbird/Schneider EcoStruxure/Vertiv Trellis compatibility matrices and the venture's integration test reports",
        "threshold": "Product absent from ≥2 of the major DCIM compatibility lists at launch",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run a structured pre-launch DCIM interoperability certification program (top-3 platforms used by CE operators) and publish the compatibility matrix before the first pilot ships",
        "type": "operational",
        "note": "Removes the single largest post-deployment acceptance failure mode before it can trigger the base rate"
      },
      {
        "action": "Instrument the first five pilots as an acceptance-rate study — formal acceptance criteria, 90-day gates, root-cause logging on any reversal — to replace the generic 30% base rate with a venture-specific one",
        "type": "information",
        "voiNodeId": "obtainableFactor",
        "note": "Converts the obtainableFactor from a benchmark guess to a measured pipeline parameter, the ledger's own stated promotion path"
      }
    ],
    "evidence": [
      {
        "title": "The Economics of POC",
        "sourceType": "industry-report",
        "publisher": "Deploy 95 (Trista Li)",
        "date": "2026-04-14",
        "excerpt": "Thirty percent of deployed systems were never fully accepted: customers would sign, we’d deploy, and six months later, it came back. We were sending teams to uninstall while trying to hit revenue targets.",
        "url": "https://deploy95.substack.com/p/the-economics-of-poc",
        "attached": true
      },
      {
        "title": "Cisco Survey Reveals Close to Three-Fourths of IoT Projects Are Failing",
        "sourceType": "industry-report",
        "publisher": "Cisco",
        "date": "2017-05-23",
        "excerpt": "60 percent of IoT initiatives stall at the Proof of Concept (PoC) stage and only 26 percent of companies have had an IoT initiative that they considered a complete success. Even worse: a third of all completed projects were not considered a success.",
        "url": "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2017/m05/cisco-survey-reveals-close-to-three-fourths-of-iot-projects-are-failing.html",
        "attached": true
      },
      {
        "title": "Telefónica Germany upgrades data center operations with Vertiv PowerIT rPDUs",
        "sourceType": "industry-report",
        "publisher": "Vertiv",
        "excerpt": "Vertiv delivered Vertiv™ PowerIT switched rPDUs... deploying energy-efficient critical infrastructure solutions [under a] strong, multi-year partnership — illustrating that PDU acceptance in enterprise accounts leans heavily on an existing vendor track record.",
        "url": "https://www.vertiv.com/495b0e/globalassets/content---assets-2025/documents/vertiv-telefonica_marketing-thought-leadership-case-study_emea-english.pdf",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Whether this specific venture's first three pilot deployments pass formal customer acceptance and survive two quarters without rollback — an outcome that only unfolds over the next 12–24 months. No purchasable report settles what THIS venture's acceptance rate will be; the reference-class 30% is a prior about future execution, not a correctable fact about today's market size or share definition.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: ledger-self-audit · judge 17/20 · E[ΔYAM] −€0.17M · engine ΔYAM −€0.36M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.ledger-self-audit.framework-agreements-hollow-large-operator-cell.json
  {
    "id": "risk.ledger-self-audit.framework-agreements-hollow-large-operator-cell",
    "title": "Large operators buy through frameworks the entrant cannot bid",
    "narrative": "The model assumes large operators are the first buyer and gives that group the biggest channel weight at 0.40. But we found their power-equipment spend runs through multi-year global framework agreements and bundled rack contracts, not discrete bids a regional entrant can win. If half that 0.40 is bought this way, the Year-1 reachable spend is far smaller than the SAM claims.",
    "category": "competitive",
    "targetNodes": [
      "cust.operator-large"
    ],
    "mechanism": "Large operators buy power gear through standing frameworks and bundles. → The 0.40 share rests on one figure measuring exposure, not contestability. → Contestable spend is below 0.40, so Year-1 pipeline math overstates.",
    "whyMissable": "The founder's own answer says large operators buy direct, so 0.40 looks like the biggest, most accessible cell rather than one closed to entrants.",
    "falsifier": "Three or more large-operator PDU purchases in the next 12 months run as open multi-vendor bake-offs won by non-incumbent vendors.",
    "likelihood": {
      "value": 0.48,
      "rationale": "Every procurement case found showed bundled or framework buying, with no contested standalone PDU deal at a large operator. The open question is how much is foreclosed, not whether the mechanism exists.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "cust.operator-large",
        "op": "set",
        "value": 0.18,
        "note": "Framework- and bundle-foreclosed portion (~half) of the direct large-operator cell removed from contestable spend; siblings deliberately not re-normalized — this is absolute shrinkage of reachable spend, not a mix-shift"
      }
    ],
    "indicators": [
      {
        "signal": "Structure of large-operator PDU procurement: discrete lots vs bundled fit-out packages",
        "where": "TED (Tenders Electronic Daily) filtered for PDU/rack-power CPV codes in DE/NL/PL; Digital Realty and Equinix supplier-announcement pages",
        "threshold": "<2 standalone, multi-bidder PDU lots from CE large operators over two consecutive quarters",
        "updates": "increases"
      },
      {
        "signal": "New or renewed multi-year power-infrastructure framework agreements between colo REITs/hyperscalers and Schneider/Vertiv/Eaton",
        "where": "Schneider and Vertiv quarterly earnings calls and press rooms; operator capex-call commentary",
        "threshold": "≥2 new CE-relevant frameworks announced in 12 months",
        "updates": "increases"
      },
      {
        "signal": "Approved-vendor-list (AVL) openings at CE colocation operators",
        "where": "Operator supplier-qualification portals (Equinix, NTT, Data4, Atman)",
        "threshold": "Any AVL round explicitly inviting new rack-PDU vendors",
        "updates": "decreases"
      },
      {
        "signal": "Bidder counts and substitution clauses on standalone rack-PDU tenders",
        "where": "TED (Tenders Electronic Daily) award notices and operator supplier portals",
        "threshold": "Median bidders \\u22642 or 'no substitution' language on >half of observed PDU line items",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run 5 structured procurement interviews at CE large operators to split the 0.40 cell into framework-locked vs contestable spend",
        "type": "information",
        "voiNodeId": "cust.operator-large",
        "note": "Directly replaces the unsourced 0.40 with an evidence-based contestable share — the single highest-leverage number for the stated GTM"
      },
      {
        "action": "Re-sequence Year-1 GTM toward mid-market colo and enterprise retrofit, where discrete PDU purchasing is documented, and treat large operators as a Year-2+ AVL-qualification play",
        "type": "strategic",
        "note": "Aligns the ramp with the cells that are actually contestable pre-brand"
      },
      {
        "action": "Pursue sub-supplier status inside one integrator's bundle (rack integrator or fit-out contractor) rather than competing against the bundle",
        "type": "contractual",
        "note": "Converts the foreclosure mechanism into a channel"
      }
    ],
    "evidence": [
      {
        "title": "Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement",
        "sourceType": "industry-report",
        "publisher": "Schneider Electric / PRNewswire",
        "date": "2025-11-19",
        "excerpt": "Digital Realty has signed a $373 million Supply Capacity Agreement (SCA) for UPS, Low Voltage Switchgear, and Pre-Fabricated Skids. The strategic shift to an SCA model provides guaranteed capacity and economies of scale, while preserving flexibility for a dynamic, multi-vendor environment.",
        "url": "https://www.prnewswire.com/news-releases/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-to-meet-rising-data-center-demand-302620427.html",
        "attached": true
      },
      {
        "title": "Colocation provider standardizes with Eaton for full solution suite",
        "sourceType": "industry-report",
        "publisher": "Eaton",
        "excerpt": "Eaton supplied the colocation provider with complementary data center solutions including racks and PDUs as part of a standardized full solution suite deployed across all data center locations.",
        "url": "https://www.eaton.com/content/dam/eaton/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/power-xpert-9395/9395p/dc-blox-success-story/eaton-dc-blox-success-story-CS153091EN.pdf",
        "attached": true
      },
      {
        "title": "Enlogic Power Distribution Units bid result / China Unicom PDU inquiry",
        "sourceType": "triangulation",
        "publisher": "UtahBids / 乙方宝",
        "date": "2025-06-05",
        "excerpt": "Discrete competitive PDU procurements do occur — Intellivex won University of Utah's Enlogic PDU solicitation via open bid; China Unicom Shanghai ran a discrete inquiry for 320 PDUs — but these are university/telco-regional buyers, not the hyperscale/colo direct-buy cell.",
        "url": "https://www.utahbids.net/bid-result/enlogic_power_distribution_units-14182081",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "The share node measures exposure (large operators = 0.40 of PDU spend), but the load-bearing claim is that a portion of that spend is non-contestable today because it runs through standing frameworks/SCAs/bundles. This is settleable now: procurement-model documentation (SCA/framework announcements, vendor case studies showing standardized full-suite deals) plus a handful of structured operator/distributor interviews establish what fraction of large-operator PDU spend is bought via multi-year frameworks vs. discrete contestable bids. That is today's market structure, not a future unfolding.",
    "proposedCorrection": {
      "nodeId": "cust.operator-large",
      "value": 0.24,
      "low": 0.18,
      "high": 0.33,
      "rationale": "The 0.40 conflates exposure with contestability; evidence (Digital Realty SCA, Eaton standardized full-suite colo deals) shows a large share of large-operator spend is locked in multi-year frameworks/bundles, so contestable Year-1 share should be roughly halved to ~0.24."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: base-rate-analogy · judge 16/20 · E[ΔYAM] −€0.13M · engine ΔYAM −€0.40M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.base-rate-analogy.channel-calendar-lockout.json
  {
    "id": "risk.base-rate-analogy.channel-calendar-lockout",
    "title": "Two channels worth 35% can't open inside Year 1",
    "narrative": "The model assumes 35% of sales flow through OEM/integrator and distributor channels in the first year. But both channels admit new suppliers only on annual cycles that require certifications and references the venture does not have on day 1. That means the market the Year-1 percentage is applied to is much smaller than the model shows.",
    "category": "execution",
    "targetNodes": [
      "cust.oem",
      "cust.distributor"
    ],
    "mechanism": "Distributor listing opens once a year and needs certifications first. → Integrators pick known brands with certs and support history. → Both cells hold 35% but stay closed all year.",
    "whyMissable": "Channel shares look like a mix question, so reviewers debate the percentages instead of asking whether the channels are even open this year.",
    "falsifier": "A signed distributor listing or OEM supply agreement with committed volumes, effective within the venture's first six months.",
    "likelihood": {
      "value": 0.33,
      "rationale": "Annual listing cycles and brand-based integrator selection are standard for this class of hardware entering EU distribution. Some Asian PDU entrants have compressed one cycle with EU-stock commitments, so the cells are not fully closed, revising likelihood from 0.4 to 0.33.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "cust.distributor",
        "op": "exclude",
        "note": "Distributor cell unavailable within the YAM window — listing cycle cannot complete inside 12 months from a zero-cert start"
      },
      {
        "nodeId": "cust.oem",
        "op": "set",
        "value": 0.11,
        "note": "Integrator cell half-foreclosed: brand/certification selection excludes the entrant from established integrator programs; residual is opportunistic white-label volume"
      }
    ],
    "indicators": [
      {
        "signal": "Line-card additions in rack-power categories at CE electrical/IT distributors",
        "where": "Rexel, Sonepar, Also/Ingram product-catalog update announcements and new-vendor press releases",
        "threshold": "Zero new rack-PDU vendors added in the trailing two quarters signals a hard-gated cycle",
        "updates": "increases"
      },
      {
        "signal": "Integrator RFI/qualification requirements for PDU suppliers",
        "where": "Vendor-qualification questionnaires from CE rack integrators and modular-DC builders (e.g., responses to the venture's own outreach, logged monthly)",
        "threshold": "Certification-complete and ≥2 reference installs required at application in >75% of responses",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Interview three CE distributors/integrators now (the ledger's own pending evidence) to map listing-cycle dates, entry requirements, and whether a 'new vendor' fast-track exists",
        "type": "information",
        "voiNodeId": "cust.oem",
        "note": "Simultaneously prices the unsourced 0.22/0.13 cells and establishes whether the calendar can be intersected at all in year 1"
      },
      {
        "action": "Concentrate Year-1 entirely on the direct mid-operator/enterprise cells and treat channel listings as a Year-2 milestone with pre-work (cert dossier, EU stock plan) started in month 1",
        "type": "operational",
        "note": "Stops the plan from booking revenue from cells that have no opening date inside the window"
      }
    ],
    "evidence": [
      {
        "title": "Vertiv Partner Program Home / EMEA Brochure",
        "sourceType": "industry-report",
        "publisher": "Vertiv",
        "date": "2024",
        "excerpt": "participation in the Program is open only to approved companies; consolidate and track field and on-line training certifications in one location",
        "url": "https://www.vertiv.com/49858a/globalassets/documents/brochures/vertiv-partner-program-emea-2024-en.pdf",
        "attached": true
      },
      {
        "title": "Micas Networks Signs First Distributor Agreement in Japan with SB C&S",
        "sourceType": "industry-report",
        "publisher": "Micas Networks",
        "date": "2026-02-26",
        "excerpt": "Micas Networks Inc. ... has signed its first distributor agreement in Japan with SB C&S Corp — a new data center hardware entrant securing distribution access at market entry, not deferred to a next annual cycle.",
        "url": "https://micasnetworks.com/company/news/sbcs20260226",
        "attached": true
      },
      {
        "title": "Centiel enters U.S. data center market through strategic partnership and framework agreement",
        "sourceType": "industry-report",
        "publisher": "EQS News / Centiel SA",
        "date": "2026-06-10",
        "excerpt": "signed a multi-year strategic distribution agreement ... For the current financial year, Centiel expects initial low double digit millions — a distribution agreement with committed volumes effective in the current year.",
        "url": "https://www.eqs-news.com/news/ad-hoc/centiel-enters-u-s-data-center-market-through-strategic-partnership-and-multi-million-dollar-framework-agreement/40c538b1-9e4b-4936-9f17-aeb4ff311a15",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the passage of the venture's first year settles whether these channels actually open — a signed distributor listing or OEM supply agreement with committed volumes effective within the first six months. This is a future execution outcome (channel timing/gate binding), not a knowable-today market fact. The evidence itself shows both outcomes are possible: some new entrants (Micas, Centiel) secured distribution at entry, while other programs (Vertiv) gate on certifications. Which path this venture lands on depends on how the next 12 months unfold.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: competitive-foreclosure · judge 16/20 · E[ΔYAM] −€0.13M · engine ΔYAM −€0.45M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.intelligent-pdu-concentration-shrinks-serviceable.json
  {
    "id": "risk.competitive-foreclosure.intelligent-pdu-concentration-shrinks-serviceable",
    "title": "Intelligent-PDU market is more locked up than headline shows",
    "narrative": "The model keeps 55% of demand reachable, based only on meeting regulations like EN 50600 and CE/TÜV. But the venture actually sells intelligent PDUs, where Legrand owns two of the leading brands and buyers lock their specs to specific vendors. That means true reachable demand falls toward 40%, cutting the Year-1 serviceable market.",
    "category": "model-structure",
    "targetNodes": [
      "serviceableFactor"
    ],
    "mechanism": "Legrand owns Raritan and Server Technology; Vertiv holds Geist → Buyers write specs around their DCIM system, blocking outsiders → Reachable share drops from 0.55 toward 0.40",
    "whyMissable": "The team has both a haircut and a concentration figure, so both boxes look ticked, but the two numbers describe different scopes and no node links them, leaving the DCIM spec-lock in the seam between them.",
    "falsifier": "An Omdia table showing intelligent-PDU top-3 share below 50%, or three or more operator specs requiring only open protocols like SNMP or Redfish with no vendor-certified list.",
    "likelihood": {
      "value": 0.28,
      "rationale": "The ownership consolidation is documented and DCIM compatibility is a known buying criterion, but the actual spec-locked share of demand is unmeasured. Published open protocols like Redfish and Modbus weaken the lock-in premise, so likelihood drops modestly from 0.35.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.4,
        "note": "Regulatory-clear but DCIM/spec-locked demand removed from the serviceable share"
      }
    ],
    "indicators": [
      {
        "signal": "DCIM/compatibility language in CE colo and enterprise PDU specifications",
        "where": "TED tender technical annexes; colo operator technical-standards documents (Equinix/NTT design guides); Data Centre World CE conference specs sessions",
        "threshold": "Majority of sampled specs naming vendor-certified DCIM compatibility rather than open protocols",
        "updates": "increases"
      },
      {
        "signal": "Legrand intelligent-PDU portfolio integration moves (Raritan/Server Technology product-line merges, unified DCIM certification programs)",
        "where": "Legrand investor day materials; Raritan and Server Technology product announcements",
        "threshold": "Announcement of a unified compatibility/certification program spanning both brands",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Purchase the Omdia Rack PDU Annual Market Analysis (2024 base, vendor shares) to measure intelligent-PDU concentration directly",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "The one named source that converts the qualitative 'Medium' label into shares, sizing the spec-locked haircut"
      },
      {
        "action": "Engineer and certify against open standards (Redfish/SNMP) and the top two third-party DCIM platforms before launch, converting spec-locked demand into reachable demand",
        "type": "strategic",
        "note": "Compatibility certification is a buyable asset, unlike incumbent install base"
      },
      {
        "action": "Sample 20 recent CE PDU specifications and count spec-open vs vendor-locked language to bound the ecosystem haircut empirically",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "Cheap bottom-up cross-check the ledger itself flags as missing for this node"
      }
    ],
    "evidence": [
      {
        "title": "Schneider Electric and Vertiv are Leading Players in the Data Centre PDU Market",
        "sourceType": "industry-report",
        "publisher": "MarketsandMarkets",
        "excerpt": "Schneider Electric (France), Vertiv (US), Eaton (Ireland), Legrand (France), and ABB (Switzerland) are among the major players in the data center PDU market. Market participants are expanding their intelligent PDU portfolios",
        "url": "https://www.marketsandmarkets.com/ResearchInsight/data-center-pdu-companies.asp",
        "attached": true
      },
      {
        "title": "Redfish for Power Distribution Equipment (DSP2056 v1.1.0)",
        "sourceType": "industry-report",
        "publisher": "DMTF",
        "date": "2025-02-05",
        "excerpt": "Redfish for Power Distribution Equipment — a published, vendor-neutral management standard for PDUs, indicating open-protocol interoperability rather than closed vendor spec-lock.",
        "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP2056_1.1.0.pdf",
        "attached": true
      },
      {
        "title": "A YANG Model for SmartPDU Monitoring and Control",
        "sourceType": "industry-report",
        "publisher": "IETF (Huawei/Telefonica)",
        "date": "2025-10-20",
        "excerpt": "Current SmartPDU solutions are largely proprietary... The proposed YANG model provides a vendor-neutral framework for configuration, monitoring, and control of intelligent power distribution systems.",
        "url": "https://www.potaroo.net/ietf/ids/draft-ahc-green-smartpdu-yang-00.txt",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "An Omdia or IHS Markit intelligent-PDU market-share table showing current top-3 (Legrand/Raritan+ServerTech, Vertiv/Geist, Schneider) concentration, plus a sample of current EU operator PDU RFQs showing whether specs require vendor-certified lists or accept open protocols (SNMP/Redfish/DSP2056) — both are existing/purchasable artifacts settling today's reachable share.",
    "proposedCorrection": {
      "nodeId": "serviceableFactor",
      "value": 0.45,
      "low": 0.4,
      "high": 0.55,
      "rationale": "Intelligent-PDU segment is concentrated among a few vendor/DCIM ecosystems that skew procurement to certified lists, so regulatory-clearance-only reachability of 0.55 overstates true addressable share; but published open standards (Redfish DSP2056, IETF YANG) cap the lock-in, warranting ~0.45 rather than 0.40."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 17/20 · E[ΔYAM] −€0.13M · engine ΔYAM −€0.33M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.stock-vs-flow-intensity-mismatch.json
  {
    "id": "risk.definition-scopedown.stock-vs-flow-intensity-mismatch",
    "title": "CE-7 share is based on old racks, but new sales chase new builds",
    "narrative": "The model splits Europe's colocation market by standing capacity, giving CE-7 a 39.8% share. But rack-PDU revenue is earned when new capacity is built or refreshed, and 57% of 2025's 937MW of new supply lands in FLAPD, outside most of CE-7. That means the €300M overstates where 2026 PDU orders will actually be written.",
    "category": "model-structure",
    "targetNodes": [
      "tamBase"
    ],
    "mechanism": "New builds drive sales: 57% of 937MW lands in FLAPD → Growth goes to London, Milan and Madrid, not CE-7 → The 39.8% share overstates near-term PDU revenue for CE-7",
    "whyMissable": "Splitting by standing capacity is the standard method and every input is sourced and recent, so the flaw hides in an unstated assumption that PDU revenue per standing MW is the same everywhere.",
    "falsifier": "CBRE's 2025–26 pipeline showing CE-7 capturing 38% or more of new European colocation MW delivered.",
    "likelihood": {
      "value": 0.38,
      "rationale": "Flow clearly concentrates in FLAPD, but Frankfurt and Amsterdam are CE-7 members inside FLAPD, so some flow returns to CE-7. The net deficit is real but likely 5–10 points, not catastrophic.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "tamBase",
        "op": "scale",
        "value": 0.8,
        "note": "Re-weight the CE-7 share from standing stock toward capacity-additions flow (~32% vs 39.8%)"
      }
    ],
    "indicators": [
      {
        "signal": "CE-7 share of new European colocation MW delivered per quarter",
        "where": "CBRE 'Europe Data Centres Figures' quarterly PDFs (new supply by market)",
        "threshold": "CE-7 markets (Frankfurt, Amsterdam, Zurich, Warsaw, Vienna, Prague) <35% of tracked deliveries for two consecutive quarters",
        "updates": "increases"
      },
      {
        "signal": "Growth differential between CE-7 and non-CE secondary markets",
        "where": "Statista Europe colocation power by country, 2026 vintage vs 2025; CBRE secondary-markets commentary (Milan, Madrid)",
        "threshold": "Non-CE secondary markets adding MW at ≥2x the CE-7 ex-DE/NL rate",
        "updates": "increases"
      },
      {
        "signal": "Directly-scoped EU rack-PDU country revenue data",
        "where": "IndexBox EU Rack PDUs report country tables (the ledger's own pending source); Omdia vendor-share regional cut",
        "threshold": "CE-7 revenue share reported below 35% of Europe",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Rebuild the CE base on a two-component model: refresh revenue on standing stock plus fit-out revenue on the CBRE delivery pipeline, priced per MW from vendor BOMs",
        "type": "information",
        "voiNodeId": "tamBase",
        "note": "Separates the stock-vs-flow question the current single ratio conflates"
      },
      {
        "action": "Position Year-1 offering around retrofit/refresh of CE-7's older standing stock (where stock-based sizing IS the right measure) rather than new-build tenders",
        "type": "strategic",
        "note": "Aligns go-to-market with the component of the TAM the model measures correctly"
      }
    ],
    "evidence": [
      {
        "title": "New Investment in Europe's Data Centre Markets to Hit New Heights in 2025",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2025-02-13",
        "excerpt": "More than half (57%) of this capacity is expected to be delivered in the leading European data centre markets - Frankfurt, London, Amsterdam, Paris and Dublin.",
        "url": "https://www.cbre.co.uk/press-releases/europes-data-centre-markets-to-hit-new-heights",
        "attached": true
      },
      {
        "title": "European Real Estate Market Outlook Mid-Year Review 2025 — Data Centres",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2025",
        "excerpt": "London and Frankfurt are expected to account for 2.5GW of capacity, or approximately half of the total data centre supply in Europe, by the end of 2025. Most new supply in Europe (70%) will be delivered to the five largest markets – FLAPD.",
        "url": "https://www.cbre.com/insights/books/european-real-estate-market-outlook-mid-year-review-2025/data-centres",
        "attached": true
      },
      {
        "title": "Data Centre Take-up in Europe to Reach New Peak in 2025",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2025-05-27",
        "excerpt": "Almost half (46%) of the annual take-up this year is expected to be in London and Frankfurt, the two largest colocation data centre markets of Europe.",
        "url": "https://www.cbre.co.uk/press-releases/data-centre-take-up-in-europe-to-reach-new-peak-in-2025",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "CBRE's 2025-26 pipeline dataset (or IndexBox EU rack-PDU country tables) showing the geographic split of new/refresh MW by country — this exists today and would settle whether CE-7's 39.8% standing-capacity share matches where 2026 PDU orders get written.",
    "proposedCorrection": {
      "nodeId": "tamBase",
      "value": 260,
      "low": 210,
      "high": 320,
      "rationale": "PDU revenue tracks new-build/refresh flow, not standing capacity; with 57-70% of new supply landing in FLAPD (mostly outside CE-7), the flow-weighted CE share is materially below the 39.8% standing-share, so the base and band should shift down."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: execution-window · judge 18/20 · E[ΔYAM] −€0.12M · engine ΔYAM −€0.30M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.execution-window.mid-eichrecht-metering-foreclosure.json
  {
    "id": "risk.execution-window.mid-eichrecht-metering-foreclosure",
    "title": "German billing rules block core PDU value in half the market",
    "narrative": "The model assumes the smart PDU's metering premium sells across all geography. But in Germany, half the modeled geography, meters used to bill tenants per kWh must be legally certified, not just accurate, and this venture is not certified. That certification takes multiple quarters, so the Year-1 reachable share drops to the band floor at 0.45.",
    "category": "boundary",
    "targetNodes": [
      "serviceableFactor"
    ],
    "mechanism": "German law requires certified meters whenever billed per kilowatt-hour. → Colocation operators re-billing tenants are the buyers paying the premium; Germany is half the geography. → Certification takes multiple quarters, missing Year 1; German billing demand is foreclosed. → The 0.55 factor includes demand it cannot reach; share falls to floor.",
    "whyMissable": "The datasheet meets billing-class accuracy, so metering looks solved, but the German rule is a certification regime, not an accuracy test, invisible until a procurement lawyer asks for the declaration.",
    "falsifier": "Two German colocation operators or the regulator confirm that PDU metering for tenant re-billing is exempt, or that capacity-tier billing makes certified metering commercially irrelevant.",
    "likelihood": {
      "value": 0.4,
      "rationale": "The legal obligation for per-kWh billing is clear, but its bite depends on how much German colo billing is actually measured per kWh versus capacity-tier, which the evidence does not quantify. The serviceableFactor haircut may already absorb some certification friction, bounding the foreclosure.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.45,
        "note": "German billing-metering demand foreclosed until MID conformity; reachable share drops to band floor"
      }
    ],
    "indicators": [
      {
        "signal": "Billing basis in German colo contract templates and tenders (measured per-kWh at rack vs fixed-kW capacity tiers)",
        "where": "German colo operators' published service schedules; DE colo lots on TED and operator supplier portals",
        "threshold": "Per-kWh sub-metered billing specified in ≥30% of sampled DE colo offerings",
        "updates": "increases"
      },
      {
        "signal": "MID/Eichrecht enforcement posture and guidance on data-center sub-metering",
        "where": "PTB publications and Länder eichamt enforcement notices; VfEB (Eichrecht compliance association) docket",
        "threshold": "Any published guidance or enforcement action explicitly covering DC tenant re-billing meters",
        "updates": "increases"
      },
      {
        "signal": "MID/Eichrecht metering clauses in German colo fit-out and PDU procurement specs",
        "where": "German colo operator RFQs (NTT GDC, maincubes, Telehouse Frankfurt vendor portals); DKE/PTB legal-metrology dockets on data-center sub-metering",
        "threshold": "MID-compliant outlet metering named as mandatory in ≥2 German colo PDU specs",
        "updates": "increases"
      },
      {
        "signal": "Incumbents marketing MID-certified PDU meter modules as a line item",
        "where": "Rittal/Bachmann/Schleifenbauer price lists and German product pages (MID variants carry distinct SKUs)",
        "threshold": "MID variants appearing as the default rather than premium option in German channel price lists",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Obtain a legal-metrology opinion plus two German colo billing-practice interviews to determine what fraction of DE PDU demand actually requires MID-conformant metering",
        "type": "information",
        "voiNodeId": "serviceableFactor",
        "note": "Converts the bundled 0.55 haircut into an instrument-by-instrument reach model for the largest country cell"
      },
      {
        "action": "Start MID module certification for the metering subsystem pre-launch in parallel with CE/TÜV, and ship a non-billing SKU positioning (monitoring/capacity-planning) for DE accounts until it lands",
        "type": "operational",
        "note": "Decouples first revenue from the slowest conformity gate"
      }
    ],
    "evidence": [
      {
        "title": "Is your sub-metering system MID compliant?",
        "sourceType": "industry-report",
        "publisher": "Inteb",
        "date": "2022-03-07",
        "excerpt": "The consumption data from these sub-meters is then used to charge tenants for their personal energy use... all meters used for tenant recharging must comply with MID.",
        "url": "https://weareinteb.co.uk/news/is-your-sub-metering-system-mid-compliant/",
        "attached": true
      },
      {
        "title": "MID Approved Power Metering - EDP Europe",
        "sourceType": "industry-report",
        "publisher": "EDP Europe",
        "date": "2023-10-24",
        "excerpt": "MID ... will stipulate that all meters supplied and installed for private billing must be MID certified. EDP Europe’s MID approved power metering system enables data centre hosting operatives to comply with this new legislation.",
        "url": "https://www.edpeurope.com/products/power-monitoring/power-distribution/intelligent-pdus/mid-approved-power-metering/",
        "attached": true
      },
      {
        "title": "Sector 3: Measuring Instruments Directive (MID) - PTB.de",
        "sourceType": "industry-report",
        "publisher": "PTB",
        "excerpt": "EU type-examinations according to directive 2014/32/EU module B ... approvals of quality systems according to directive 2014/32/EU modules D, D1 ... Measuring instruments for electrical energy (WG 2.34)",
        "url": "https://www.ptb.de/cms/en/metrological-services/kbs/kbs3.html",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "risk",
    "settleTest": "Only the passage of time settles this: whether MID/certification actually forecloses German tenant re-billing demand in Year 1 depends on the venture's certification timeline, whether colocation operators use kWh vs capacity-tier billing, and how demand responds — none of which is fixed by a purchasable report. The legal requirement (MID) is documented today, but the load-bearing claim is that this forecloses reachable Year-1 share, which is a forward market-response gate.",
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 17/20 · E[ΔYAM] −€0.10M · engine ΔYAM −€0.23M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.oem-cell-two-sided-squeeze.json
  {
    "id": "risk.competitive-foreclosure.oem-cell-two-sided-squeeze",
    "title": "OEM/integrator channel closes from both sides, cutting share",
    "narrative": "The model assumes the venture can win 0.22 of the OEM/integrator channel in Year 1. But every integrator case study we found picks incumbent brands on certification, DCIM fit and support, while white-label demand goes to low-cost Asian ODMs the entrant cannot match. The genuinely open fraction may be about 0.08, roughly a third of the modeled cell. If so, the channel-mix and Year-1 number are too high.",
    "category": "competitive",
    "targetNodes": [
      "cust.oem"
    ],
    "mechanism": "Integrators pick PDU brands on features and support ecosystems → Entrant lacks incumbent ecosystem and ODM cost position → Addressable OEM share falls from 0.22 to about 0.08",
    "whyMissable": "The cell looks doubly open because both branded and white-label routes are documented, but each is a separately-held gate and the proof sits in different source types.",
    "falsifier": "One CE integrator or OEM signing a design-in or white-label deal with the entrant, or a documented RFQ evaluating a non-incumbent intelligent PDU on merit within Year 1.",
    "likelihood": {
      "value": 0.45,
      "rationale": "Every integrator case study shows incumbent-brand selection and no source quantifies an open OEM share, but the sample is small and behavior for differentiated intelligent PDUs is untested. The 0.22 to 0.08 claim remains unsourced, so confidence in the direction is only modestly raised.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "cust.oem",
        "op": "set",
        "value": 0.08,
        "note": "Only the regional, spec-flexible integrator fraction remains addressable; brand-spec and ODM-price fractions foreclosed"
      }
    ],
    "indicators": [
      {
        "signal": "PDU brands named in European integrator/turnkey rack case studies and reference designs",
        "where": "Vertiv, Legrand, Rittal and Schleifenbauer project case-study pages; DataCenterDynamics build coverage",
        "threshold": "≥3 consecutive quarters of new CE integrator projects specifying only incumbent-brand PDUs",
        "updates": "increases"
      },
      {
        "signal": "ODM intelligent-PDU pricing and OEM-program activity",
        "where": "Digipower and comparable ODM price lists / OEM program pages; Computex and Data Centre World exhibitor announcements",
        "threshold": "ODM per-outlet-managed PDU quotes ≥30% below the entrant's achievable unit cost",
        "updates": "increases"
      },
      {
        "signal": "ODM expansion into Europe (local stock, CE/TÜV-certified white-label lines) and distributor line-card additions of Asian PDU lines",
        "where": "Digipower and peer ODM product/price lists; distributor line-card announcements (master distributors adding Asian PDU lines)",
        "threshold": "≥1 major CE distributor adding an ODM white-label PDU line",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run a design-in probe with 3 CE rack integrators: submit the product to their qualification process and log the actual selection criteria and thresholds",
        "type": "information",
        "voiNodeId": "cust.oem",
        "note": "Replaces the unsourced 0.22 addressability premise with observed gate criteria"
      },
      {
        "action": "Differentiate on the one axis neither incumbents nor ODMs own regionally: MID-compliant billing-grade metering and local engineering support for CE colo sub-metering requirements",
        "type": "strategic",
        "note": "A regulatory-technical feature can reopen brand-spec gates that price and ecosystem cannot"
      },
      {
        "action": "Offer integrators a co-branded (not white-label) program with shared support obligations, splitting the difference between the two closed routes",
        "type": "contractual"
      }
    ],
    "evidence": [
      {
        "title": "About | Digipower Manufacturing Inc.",
        "sourceType": "industry-report",
        "publisher": "Digipower Manufacturing Inc.",
        "excerpt": "Founded in 1999, DigiPower began by designing and manufacturing power solutions for OEM and ODM customers worldwide. As a leading rack PDU manufacturer in Taiwan, we focus on data center power distribution and management products",
        "url": "https://www.digipower.com.tw/about",
        "attached": true
      },
      {
        "title": "DCIM Power Solution Helps British Cloud and Networking Provider Exponential-e",
        "sourceType": "triangulation",
        "publisher": "Raritan",
        "excerpt": "Solution: Power IQ® DCIM Monitoring Software and PX® 5000 Series Intelligent PDUs — incumbent PDU selected bundled with its own DCIM ecosystem for a colocation integrator serving 1700+ customers.",
        "url": "https://www.raritan.com/assets/re/resources/case_studies/Case_Study_-_Exponential-e_(English).pdf",
        "attached": true
      },
      {
        "title": "Telefónica Germany upgrades data center operations with Vertiv PowerIT rPDUs",
        "sourceType": "triangulation",
        "publisher": "Vertiv",
        "excerpt": "Vertiv and the Telefónica Group have maintained a strong, multi-year partnership... deploying energy-efficient critical infrastructure solutions — incumbent selection driven by existing support relationship.",
        "url": "https://www.vertiv.com/495b0e/globalassets/content---assets-2025/documents/vertiv-telefonica_marketing-thought-leadership-case-study_emea-english.pdf",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "A CE-region OEM/integrator channel buyer-mix dataset (or 3-5 distributor/integrator interviews plus incumbent-vs-ODM design-win records) quantifying the fraction of intelligent-PDU integrator business open to non-incumbent, non-ODM entrants — this exists today and would settle the 0.22 vs 0.08 dispute without waiting for the market to unfold.",
    "proposedCorrection": {
      "nodeId": "cust.oem",
      "value": 0.08,
      "low": 0.05,
      "high": 0.14,
      "rationale": "Integrator case studies show incumbent selection on DCIM/certification/support and white-label going to Asian ODMs, so the genuinely-open fraction is roughly a third of the modeled 0.22 cell.value."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: demand-discontinuity · judge 17/20 · E[ΔYAM] −€0.08M · engine ΔYAM −€0.20M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.demand-discontinuity.ce-hyperscale-flow-mirage.json
  {
    "id": "risk.demand-discontinuity.ce-hyperscale-flow-mirage",
    "title": "Year-1 hyperscale demand lands outside Central Europe",
    "narrative": "The model takes Synergy's 44-48% global hyperscale share and applies it to Central Europe as a flat 0.91 carve-out. But about 60% of Europe's operational hyperscale self-build capacity sits in Ireland, the Netherlands, Sweden and Belgium, mostly outside the venture's reach. The model's largest segment is largely demand the venture cannot reach in Year 1, and it is the exact segment the sell-to-large-operators strategy targets.",
    "category": "model-structure",
    "targetNodes": [
      "seg.hyperscale"
    ],
    "mechanism": "European hyperscale self-build adds 4.2 GW in 2026, up 24%. → Central Europe's hyperscale sites are gated, so realized share stays low. → The 0.44 share overstates the reachable segment and misleads buyer plans.",
    "whyMissable": "The node looks well-evidenced and the 0.91 carve-out reads as a conservative haircut, so nobody asks whether hyperscale capacity is skewed away from Central Europe.",
    "falsifier": "A Europe-scoped split showing CE-7 hyperscale share at or above 0.40, or two-plus announced 2026 CE-7 hyperscale campuses breaking ground outside the Dutch exception zones.",
    "likelihood": {
      "value": 0.42,
      "rationale": "The 60% concentration outside CE-7 is a hard Q4-2025 datapoint and the gating rules are enacted, but hyperscalers also lease CE colo capacity, which keeps some demand in scope. A new 3.2 GW Poland campus shows self-build starting inside CE, nudging likelihood modestly up from 0.40.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "seg.hyperscale",
        "op": "set",
        "value": 0.32,
        "note": "CE-realized hyperscale slice shrinks in absolute terms; not a mix shift to siblings — the demand flows to geographies outside scope"
      }
    ],
    "indicators": [
      {
        "signal": "CE-7 share of new European hyperscale self-build MW",
        "where": "CBRE European data centre quarterly updates; DCNN/DC Byte self-build geography breakdowns",
        "threshold": "CE-7 receiving <15% of new self-build MW over two quarters",
        "updates": "increases"
      },
      {
        "signal": "Hyperscaler campus announcements and permitting filings inside CE-7",
        "where": "Google/Microsoft/AWS EU infrastructure press; German and Polish municipal permitting dockets",
        "threshold": "Zero new CE-7 self-build campus starts over two consecutive quarters",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a CE-7-scoped segment split (hyperscale/colo/enterprise by MW) as a custom cut from Synergy or DC Byte",
        "type": "information",
        "voiNodeId": "seg.hyperscale",
        "note": "Directly replaces the global 0.91 rescale with regional data"
      },
      {
        "action": "Rebalance the Year-1 pipeline toward colocation and enterprise cells that are physically located in CE-7, deferring the hyperscale motion until regional presence is proven",
        "type": "strategic"
      }
    ],
    "evidence": [
      {
        "title": "New hyperscaler capacity to outpace colocation in Europe",
        "sourceType": "industry-report",
        "publisher": "Data Centre & Network News (CBRE data)",
        "date": "2026-02-19",
        "excerpt": "Hyperscaler self-build capacity across Europe is expected to reach 4.2GW this year, representing 24% year-on-year growth. As of Q4 2025, approximately 60% of Europe’s operational hyperscaler self-build capacity is located in Ireland, the Netherlands, Sweden, and Belgium.",
        "url": "https://dcnnmagazine.com/business/real-estate/new-hyperscaler-capacity-to-outpace-colocation-in-europe/",
        "attached": true
      },
      {
        "title": "CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth",
        "sourceType": "industry-report",
        "publisher": "DatacenterDynamics (CBRE Europe Data Centres report)",
        "date": "2026-05-06",
        "excerpt": "CBRE's report, which covers Q4 2025, predicts hyperscaler self-build capacity will reach 4.2GW in 2026... with 60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium.",
        "url": "https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/",
        "attached": true
      },
      {
        "title": "WBS Power Advances 3.2 GW Energy Infrastructure for Hyperscale Data Center Campus",
        "sourceType": "industry-report",
        "publisher": "Gulf Oil and Gas",
        "date": "2026-03-24",
        "excerpt": "A new hyperscale data center campus with a target capacity of 3.2 GW will be developed in Lublewo... in northern Poland... WBS Power S.A., which has already secured grid connection conditions for the full 3.2 GW capacity.",
        "url": "https://1156-799.el-alt.com/webpro1/main/mainnews.asp?id=1112920",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A Europe-scoped (or CE-7) hyperscale capacity split from CBRE or Synergy for Q4 2025 — an existing/purchasable dataset that would settle whether hyperscale's reachable share in Central Europe is ~0.44 or materially lower.",
    "proposedCorrection": {
      "nodeId": "seg.hyperscale",
      "value": 0.22,
      "low": 0.15,
      "high": 0.3,
      "rationale": "CBRE Q4-2025 data shows ~60% of Europe's operational hyperscale self-build sits in Ireland/Netherlands/Sweden/Belgium (largely outside the venture's CE reach), so the global-share carve-out overstates the reachable CE hyperscale segment by roughly half."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: structure-independence · judge 17/20 · E[ΔYAM] −€0.07M · engine ΔYAM −€0.15M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.framework-foreclosure-large-operator-cell.json
  {
    "id": "risk.structure-independence.framework-foreclosure-large-operator-cell",
    "title": "Biggest buyer group buys through frameworks, not direct sales",
    "narrative": "The model assumes large operators are the venture's first direct buyer, counting 40% of PDU spend in that cell. But that 40% measures who consumes PDUs, not who signs a contestable contract. The documented buying pattern is HQ-level global frameworks and OEM rack bundles a regional entrant never gets to bid on. If most of that spend is closed off, the funnel keeps 40% of the market inside a channel the venture cannot actually reach in Year 1.",
    "category": "competitive",
    "targetNodes": [
      "cust.operator-large",
      "cust.oem"
    ],
    "mechanism": "Large operators buy rack power through global frameworks and OEM bundles. → The 40% is a consumption share, not who signs contracts. → Funnel keeps 40% in an unreachable channel with different economics.",
    "whyMissable": "The row reads as a demand split, and the ledger's 'needs-source' flag looks like a precision fix rather than a reachability problem.",
    "falsifier": "Three large operators confirming they run open, vendor-neutral rack-PDU tenders for their 2026 builds.",
    "likelihood": {
      "value": 0.5,
      "rationale": "Every buying case in the corpus points to framework and bundle procurement, with no example of an open large-operator tender in the region. Strong corroboration raised confidence from 0.45 to 0.50, but no region-specific evidence and two counter-signals cap the increase.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "cust.operator-large",
        "op": "set",
        "value": 0.2,
        "note": "Half of the 'large operator direct' cell is framework/bundle-foreclosed to a new regional entrant"
      },
      {
        "nodeId": "cust.oem",
        "op": "set",
        "value": 0.33,
        "note": "Mix-shift: that spend re-appears in the OEM/integrator channel, which requires a different go-to-market"
      }
    ],
    "indicators": [
      {
        "signal": "New pan-European power-chain framework agreements covering rack power announced by Equinix, Digital Realty, Vantage or NTT",
        "where": "Operator procurement press releases and capital-markets-day supplier disclosures",
        "threshold": "≥1 additional multi-year framework explicitly including rack PDUs",
        "updates": "increases"
      },
      {
        "signal": "Incumbents' revenue mix shifting from discrete products to 'integrated solutions' in DC segment commentary",
        "where": "Schneider Electric and Vertiv quarterly earnings calls, DC segment discussion",
        "threshold": "Solutions/bundled share of DC revenue growing while standalone product lines flatten",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Run structured procurement-route interviews with 3 CE large-operator sourcing leads: is rack-PDU spend a discrete RFP line or a framework call-off?",
        "type": "information",
        "voiNodeId": "cust.operator-large",
        "note": "Replaces the capacity-share proxy with an actual channel split — the ledger's own promotion path, but asked about route-to-contract, not just mix"
      },
      {
        "action": "Build the OEM/rack-integrator channel as the primary Year-1 route (white-label or co-brand into integrator rack builds) instead of direct operator sales",
        "type": "strategic",
        "note": "Enters the cell where the spend actually transacts"
      },
      {
        "action": "Pursue approved-vendor / second-source status on one operator framework rather than competing against it",
        "type": "contractual",
        "note": "Frameworks typically mandate dual-sourcing; second-source slots are the crack in the foreclosure"
      }
    ],
    "evidence": [
      {
        "title": "Schneider Electric's $2.3 Billion in AI Power and Cooling Deals Sends Message to Data Center Sector",
        "sourceType": "industry-report",
        "publisher": "Data Center Frontier",
        "date": "2025-11-24",
        "excerpt": "Twin supply-capacity agreements by Schneider Electric with Switch and Digital Realty show how AI data centers are starting to lock up power and thermal infrastructure in much the same way as hyperscalers once locked up cloud chips.",
        "url": "https://www.datacenterfrontier.com/machine-learning/article/55332455/schneider-electrics-23-billion-worth-of-ai-power-and-cooling-deals-sends-message-to-data-center-sector",
        "attached": true
      },
      {
        "title": "Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement",
        "sourceType": "industry-report",
        "publisher": "Nasdaq / PRNewswire",
        "date": "2025-11-19",
        "excerpt": "Digital Realty has signed a $373 million Supply Capacity Agreement for UPS, Low Voltage Switchgear, and Pre-Fabricated Skids — while preserving the flexibility needed for a dynamic, multi-vendor environment to mitigate risk.",
        "url": "https://www.nasdaq.com/press-release/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-meet",
        "attached": true
      },
      {
        "title": "OEM & ODM Data Center Infrastructure Solutions (incl. PDU) delivered directly to project sites",
        "sourceType": "industry-report",
        "publisher": "Getek",
        "date": "2025-07-01",
        "excerpt": "Full Range of Cabinets and Modular Systems including Power Distribution Units (PDU), customizable for global projects and delivered directly to end users or project sites worldwide.",
        "url": "https://www.getek.com/oem-data-center-solution/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "front-of-mind",
    "resolution": "error",
    "settleTest": "A sourced buyer-mix breakdown for CE-region rack-PDU spend that separates contestable/open-tender contracts from HQ-level global frameworks and OEM rack bundles — obtainable today via 3 structured operator/distributor interviews plus procurement-channel analyst data. This settles what share of the 40% is actually reachable in Year 1, a fact about today's contracting structure, not a future market shift.",
    "proposedCorrection": {
      "nodeId": "cust.operator-large",
      "value": 0.18,
      "low": 0.1,
      "high": 0.28,
      "rationale": "The 0.40 conflates PDU consumption with contestable procurement; documented HQ frameworks and OEM rack bundles close off most large-operator spend to a regional entrant, so the reachable direct-buyer share is materially lower."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: regulatory-gauntlet · judge 16/20 · E[ΔYAM] −€0.07M · engine ΔYAM −€0.30M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.regulatory-gauntlet.enefg-eed-reporting-spec-creep-dcim-lock.json
  {
    "id": "risk.regulatory-gauntlet.enefg-eed-reporting-spec-creep-dcim-lock",
    "title": "German energy-reporting rules push incumbent-DCIM gates into PDU tenders",
    "narrative": "The model assumes the entrant can serve 55% of the market once its product passes standard certification. But German and EU energy-reporting laws lead operators to demand certified metering accuracy plus validated links to incumbent DCIM software, which a new entrant lacks. That drops the reachable share to 45% in the German market, cutting the Year-1 number.",
    "category": "model-structure",
    "targetNodes": [
      "serviceableFactor"
    ],
    "mechanism": "German and EU reporting deadlines recur, forcing operators to produce auditable energy data. → Operators require certified accuracy and named-DCIM links in PDU tenders. → Reachable share falls below 45% for an unvalidated entrant.",
    "whyMissable": "The laws bind operators, not vendors, so a founder scanning for product rules finds nothing and only sees the gate in lost tenders.",
    "falsifier": "German or Dutch 2026 colo PDU specs showing no certified-accuracy or named-DCIM requirement, or DCIM suites accepting open-protocol PDU data for filings without vendor validation.",
    "likelihood": {
      "value": 0.22,
      "rationale": "The reporting deadlines are enacted, but evidence shows open protocols like Redfish are the prevailing integration path and no tender confirmed the DCIM gate. This weakens but does not refute the mechanism, warranting a modest downward revision from 0.3.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "serviceableFactor",
        "op": "set",
        "value": 0.45,
        "note": "Reporting-bound demand requiring validated DCIM integration exits the entrant's reachable pool"
      }
    ],
    "indicators": [
      {
        "signal": "Accuracy-class and DCIM-integration clauses in CE colo PDU specifications",
        "where": "German colo RFQs and framework specs (Frankfurt operators); Bundesstelle für Energieeffizienz / Energieeffizienzregister guidance updates on required data granularity",
        "threshold": "Rack/outlet-level certified metering named in register guidance or ≥2 tenders",
        "updates": "increases"
      },
      {
        "signal": "Openness of incumbent DCIM validation programs to third-party PDUs",
        "where": "Schneider EcoStruxure and Vertiv Environet partner/compatibility lists; Sunbird supported-device database",
        "threshold": "Third-party PDU additions stalling or program fees/queues lengthening",
        "updates": "increases"
      },
      {
        "signal": "EU 2024/1364 second-phase requirements",
        "where": "Commission delegated-act docket for the data-centre rating scheme",
        "threshold": "Phase-2 draft mandating sub-facility (rack-level) energy granularity",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Audit 10 recent German/Dutch colo PDU specs for accuracy-class and DCIM clauses to size the gated fraction of the serviceable pool",
        "type": "information",
        "voiNodeId": "serviceableFactor"
      },
      {
        "action": "Prioritize certification into the two dominant DCIM compatibility programs and ship native Redfish/SNMP profiles mapped to EnEfG/EED reporting fields as a product feature",
        "type": "operational",
        "note": "Makes compliance reporting a selling point instead of a gate"
      },
      {
        "action": "Co-market with a DCIM-independent monitoring vendor targeting operators who resent incumbent suite lock-in",
        "type": "strategic"
      }
    ],
    "evidence": [
      {
        "title": "§ 12 EnEfG - Energie- und Umweltmanagementsysteme in Rechenzentren",
        "sourceType": "industry-report",
        "publisher": "gesetze-im-internet.de (BMJ)",
        "excerpt": "kontinuierliche Messungen zur elektrischen Leistung und zum Energiebedarf der wesentlichen Komponenten des Rechenzentrums durchzuführen ... ab dem 1. Januar 2026 die Pflicht zur Validierung oder Zertifizierung des Energie- oder Umweltmanagementsystems.",
        "url": "https://www.gesetze-im-internet.de/enefg/__12.html",
        "attached": true
      },
      {
        "title": "PowerIT Redfish API Guide for Rack PDU and Rack Transfer Switch",
        "sourceType": "industry-report",
        "publisher": "Vertiv",
        "date": "2025-07-07",
        "excerpt": "PowerIT Redfish™ API Guide for Rack PDU and Rack Transfer Switch — Vertiv publishes an open Redfish API for its rack PDUs, and Chatsworth/CPI issued an equivalent 2025 guide, indicating standardized open-protocol telemetry access rather than closed vendor-only integration.",
        "url": "https://www.vertiv.com/4adeeb/contentassets/14a56c28f8b7488991460b07cd6279e8/redfish-api-guide.pdf",
        "attached": true
      },
      {
        "title": "Redfish Property Guide DSP2053",
        "sourceType": "industry-report",
        "publisher": "DMTF",
        "date": "2025-09-05",
        "excerpt": "DMTF Redfish Property Guide, an industry-wide open management standard implemented across multiple PDU vendors — evidence of an open-protocol interoperability path that could bypass vendor-specific DCIM validation for reporting.",
        "url": "https://redfish.dmtf.org/schemas/v1/DSP2053_2025.3.pdf",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "Reading current 2026 German/Dutch colo PDU tender specifications and DCIM filing-acceptance documentation to check whether certified-accuracy AND named-vendor-DCIM validation are actually required (vs. open Redfish/open-protocol telemetry being accepted). This is a knowable fact about today's spec language and § 12 EnEfG's technical requirements, settleable via document review and vendor calls in under a week.",
    "proposedCorrection": {
      "nodeId": "serviceableFactor",
      "value": 0.55,
      "low": 0.45,
      "high": 0.65,
      "rationale": "The claim's load-bearing premise — that EnEfG forces named-incumbent-DCIM validation — is contradicted by the attached evidence showing open Redfish/DMTF telemetry standards are broadly implemented, so § 12's metering/validation refers to management systems not vendor-locked DCIM; the current 0.55 with its 0.45 low already spans the alleged effect and no correction is warranted."
    },
    "asOf": "2026-07-08"
  },

  // ○ front-of-mind · lens: competitive-foreclosure · judge 15/20 · E[ΔYAM] −€0.06M · engine ΔYAM −€0.21M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.competitive-foreclosure.distributor-line-review-lockout.json
  {
    "id": "risk.competitive-foreclosure.distributor-line-review-lockout",
    "title": "Distributor channel is locked shut for Year 1",
    "narrative": "The model treats the 0.13 distributor cell as an easy open channel. But that channel runs on annual line reviews, and Legrand owns both intelligent-PDU brands, Raritan and Server Technology, giving one vendor two slots on every line card. A pre-launch entrant arrives mid-cycle and cannot get listed until the next review, which lands after Year 1. That cell should contribute nothing to the Year-1 number.",
    "category": "competitive",
    "targetNodes": [
      "cust.distributor"
    ],
    "mechanism": "Distributors decide line cards once a year, at set reviews. → Venture launches mid-cycle, so no distributor can list it. → The 0.13 cell adds nothing to Year-1 demand.",
    "whyMissable": "Distribution looks like the easy channel and 0.13 looks too small to check, but annual reviews close it for exactly the 12 months Year 1 measures.",
    "falsifier": "A named distributor like Rexel or Sonepar confirming in writing it can list a new intelligent-PDU line within two quarters without waiting for the annual review.",
    "likelihood": {
      "value": 0.3,
      "rationale": "Annual line reviews and Legrand's ownership of both PDU brands are confirmed facts. But three 2025-2026 cases show European distributors onboarding new PDU vendors outside a rigid annual gate, lowering likelihood from 0.45 to 0.30.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "cust.distributor",
        "op": "exclude",
        "note": "Distributor cell unavailable to the venture within the Year-1 horizon — foreclosed by review-cycle timing and shelf exclusivity, not shrunk"
      }
    ],
    "indicators": [
      {
        "signal": "Intelligent-PDU brands listed on CE distributor line cards and webshops",
        "where": "Rexel Germany / Sonepar online catalogs; Also and Ingram Micro DC-infrastructure category pages",
        "threshold": "Raritan + Server Technology + APC occupying all intelligent-PDU listings with no non-incumbent brand added over two quarters",
        "updates": "increases"
      },
      {
        "signal": "Legrand channel-program announcements tightening intelligent-PDU distribution terms",
        "where": "Legrand investor communications and EMEA partner-program pages; distribution trade press (ChannelPartner.de)",
        "threshold": "Any announced exclusivity, rebate-tier or dual-brand bundling program covering Raritan/Server Technology in EMEA",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a channel audit: map line-review dates, exclusivity terms and private-label requirements across the top 5 CE electrical/IT distributors",
        "type": "information",
        "voiNodeId": "cust.distributor",
        "note": "Turns an assumed 0.13 cell into a dated calendar of when (if ever) it opens"
      },
      {
        "action": "Enter via a distributor's private-label program (documented option) rather than as a branded line — sidesteps the brand-slot conflict",
        "type": "strategic",
        "note": "Buyer's-guide evidence shows distributors actively seek OEM/private-label intelligent-PDU options"
      },
      {
        "action": "Time distributor outreach to the review calendar and pre-book slots for Year-2 rather than burning Year-1 sales capacity on a closed gate",
        "type": "operational"
      }
    ],
    "evidence": [
      {
        "title": "Aginode partners with Ethernetics to supply intelligent PDUs for data centres",
        "sourceType": "industry-report",
        "publisher": "Aginode",
        "date": "2026-06-01",
        "excerpt": "Aginode teams up with Ethernetics BV, a Belgian-based start-up developing patented energy saving power distribution units, to announce a technical and commercial partnership in the field of Intelligent Power Distribution Units (PDUs)",
        "url": "https://www.aginode.net/newsroom/news/details/2026/06/aginode-partners-ethernetics-supply-intelligent-pdus-data-centres",
        "attached": true
      },
      {
        "title": "Schleifenbauer Advanced PDUs Now Available at EDP Europe Distribution!",
        "sourceType": "industry-report",
        "publisher": "EDP Europe / Approved Business",
        "date": "2025-06-12",
        "excerpt": "EDP Europe is now an official distributor of Schleifenbauer’s advanced, intelligent PDUs!",
        "url": "https://www.approvedbusiness.co.uk/articles/40679",
        "attached": true
      },
      {
        "title": "CMS Distribution expands its power and energy portfolio through a strategic partnership with Legrand",
        "sourceType": "industry-report",
        "publisher": "CMS Distribution",
        "date": "2026-04-14",
        "excerpt": "CMS already has an established relationship with Legrand as a distributor of Raritan, one of Legrand’s key brands and a global leader in data centre infrastructure management. Raritan specialises in intelligent rack power distribution units (PDUs)",
        "url": "https://www.cmsdistribution.com/press-release/cms-distribution-expands-its-power-and-energy-portfolio-through-a-strategic-partnership-with-legrand",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "front-of-mind",
    "resolution": "risk",
    "settleTest": "Only the timing of actual distributor line-review cycles and whether the entrant gets listed within Year 1 will settle this — that is a future channel-adoption event, not a knowable-today number. Distributor listing decisions unfold over the next 12 months and depend on the entrant's launch date and each distributor's review calendar.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: boundary-substitution · judge 15/20 · E[ΔYAM] −€0.05M · engine ΔYAM −€0.15M · evidence: contested
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.enterprise-gpu-busbar-half-refuted.json
  {
    "id": "risk.boundary-substitution.enterprise-gpu-busbar-half-refuted",
    "title": "Enterprise PDU share overstated as AI racks shift to busbar",
    "narrative": "The model assumes enterprise is a stable 0.29 slice of PDU demand, with the 'GPU pods skip PDUs' doubt marked confirmed. But NVIDIA's flagship dense design routes power via DC busbar with far fewer PDUs per rack, and the legacy base is losing about 2 percentage points of capacity share per year toward 19% by 2031. So the growing AI half buys the substitute while the shrinking legacy half stalls, pushing the realistic enterprise value below the model's own 0.24 low band.",
    "category": "boundary",
    "targetNodes": [
      "seg.enterprise"
    ],
    "mechanism": "Enterprise growth now comes from GPU pods using busbar, not PDUs. → Growth side sheds PDUs; legacy base shrinks 2pp per year. → Enterprise 0.29 falls below the 0.24 low band.",
    "whyMissable": "The doubt was stamped 'refuted' in cycle 1, hiding that shipping PDU variants differs from actually using them in dense builds.",
    "falsifier": "BOM or vendor data from 2026 enterprise GPU-pod deployments showing rack-PDU counts at or above the legacy 3-per-rack norm in most dense installs.",
    "likelihood": {
      "value": 0.33,
      "rationale": "The 2pp/year decline and GPU-driven growth are well confirmed, but NVIDIA's own AC SuperPOD design shows high PDU counts on network and storage racks, undercutting the reduced-attach premise. That lowers the chance enterprise drops below 0.24 within 12 months, so I trim from 0.40 to 0.33.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "seg.enterprise",
        "op": "set",
        "value": 0.2,
        "note": "GPU-driven growth adopts busbar attach while legacy base decays; effective PDU-addressable enterprise share drops below the model's 0.24 low band"
      }
    ],
    "indicators": [
      {
        "signal": "Which power variant (AC/PDU vs DC busbar) is default in NVIDIA/OEM pod reference-architecture documentation revisions",
        "where": "NVIDIA GTC reference-architecture sessions and DGX/MGX pod deployment guides; Dell/HPE AI-factory configurators",
        "threshold": "DC busbar becomes the documented default for ≥50% of published dense-pod configurations",
        "updates": "increases"
      },
      {
        "signal": "Enterprise/IT-segment rack-PDU revenue commentary from incumbents",
        "where": "Vertiv and Schneider quarterly earnings calls, rack-power and IT-channel product-line commentary",
        "threshold": "Enterprise PDU line flat or declining while integrated-rack/busbar lines grow double-digit for two consecutive quarters",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission an attach-rate teardown of CE enterprise GPU-pod installs (PDUs per rack by density tier) via 5–8 integrator interviews",
        "type": "information",
        "voiNodeId": "seg.enterprise",
        "note": "Directly re-bases the enterprise slice on measured attach rather than a binary confirmed/refuted flag"
      },
      {
        "action": "Position the Year-1 product for the air-cooled enterprise refresh tier (where AC/PDU remains default) and roadmap a high-amp/DC-compatible SKU for dense pods",
        "type": "strategic",
        "note": "Decouples Year-1 revenue from the sub-segment where substitution bites first"
      }
    ],
    "evidence": [
      {
        "title": "Major Components — NVIDIA SuperPOD with DGX B300 Systems and AC Power Reference Architecture",
        "sourceType": "industry-report",
        "publisher": "NVIDIA",
        "date": "2025-10-30",
        "excerpt": "432 DGX rPDU for Standard Rack Raritan (PX3-5091R-P1Q2R1A5) or Equiv; 96 Mgmt Vertical PDU Raritan (PX3-5747V-V2) or equivalent — NVIDIA publishes an AC Power Reference Architecture with heavy per-rack PDU content as a first-class variant.",
        "url": "https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300-xdr/latest/components.html",
        "attached": true
      },
      {
        "title": "Hyperscale Operators to Account for 67% of all Data Center Capacity by 2031",
        "sourceType": "analyst-estimate",
        "publisher": "Synergy Research Group",
        "date": "2026",
        "excerpt": "on-premise data centers with just 32% of the total... Looking ahead to 2031, on-premise will drop to just 19%... on-premise data center capacity is receiving something of a boost thanks to GenAI applications and GPU infrastructure... on-premise share of the total will drop by around two percentage points per year.",
        "url": "https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031",
        "attached": true
      },
      {
        "title": "Hardware — NVIDIA DGX GB Rack Scale Systems User Guide",
        "sourceType": "industry-report",
        "publisher": "NVIDIA",
        "excerpt": "The complete DGX GB rack system comprises compute trays... power shelves, a bus bar, and liquid cooling manifolds — confirming the flagship dense design routes power via DC busbar.",
        "url": "https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html",
        "attached": true
      }
    ],
    "evidenceStatus": "contested",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "NVIDIA's own published AC Power Reference Architecture for the DGX SuperPOD B300 (dated 2025-10-30) specifies 432 DGX rPDU + 96 management PDUs per pod — a purchasable/inspectable BOM that settles whether dense AI racks consume PDUs today. This is a document that exists now, not a future market outcome.",
    "proposedCorrection": {
      "nodeId": "seg.enterprise",
      "value": 0.29,
      "low": 0.24,
      "high": 0.3,
      "rationale": "NVIDIA's flagship B300 reference architecture ships heavy per-rack PDU content (432 rPDU + 96 mgmt PDUs per pod) as a first-class AC variant, so the 'GPU pods skip PDUs' doubt is correctly refuted and the 0.29 value with 0.24 downside band already covers dense busbar deployments — no change warranted."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: boundary-substitution · judge 17/20 · E[ΔYAM] −€0.04M · engine ΔYAM −€0.10M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.nl-selfbuild-hollows-second-geography.json
  {
    "id": "risk.boundary-substitution.nl-selfbuild-hollows-second-geography",
    "title": "NL's 28% weight rests on capped colo; growth is out of reach",
    "narrative": "The model gives the Netherlands 28% of the base and treats it as the safest geography, with Statista and the Dutch Data Center Association agreeing within 3%. But that agreement measures old colocation stock, and Dutch demand is shifting to self-build that grows 24% a year and buys through hyperscaler channels a new entrant cannot reach. So the venture's second-largest geography sits on a slice that is capped, and the Year-1 reachable demand is far smaller than 28% implies.",
    "category": "boundary",
    "targetNodes": [
      "geo.NL"
    ],
    "mechanism": "NL growth moves to self-build outside the colo base → Self-build buys through global specs entrants cannot bid → The 0.28 weight overstates reachable Dutch demand at launch",
    "whyMissable": "NL has the cleanest source agreement in the ledger, so it looks like the one geography nobody needs to recheck, even though that agreement only confirms old colo stock and hides the shift to self-build.",
    "falsifier": "2026 NL capacity-addition data showing new Dutch MW using rack PDUs bought through channels open to regional vendors at rates matching the 28% weight.",
    "likelihood": {
      "value": 0.4,
      "rationale": "The self-build concentration and Amsterdam constraints are well sourced, but real colo refresh demand remains reachable, so the question is whether NL supports 0.28 or closer to 0.20–0.22. The 24% versus 19% growth gap was not independently confirmed, so we revised up modestly from 0.35 to 0.40.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "geo.NL",
        "op": "set",
        "value": 0.22,
        "note": "NL weight corrected to the colo-anchored, entrant-reachable slice; self-build growth and capped Amsterdam supply removed from the effective ratio"
      }
    ],
    "indicators": [
      {
        "signal": "NL colocation capacity growth vs hyperscale self-build additions",
        "where": "Dutch Data Center Association 'State of the Dutch Data Centers' annual report; CBRE Amsterdam market quarterlies",
        "threshold": "NL colo net additions <5% YoY while national self-build MW grows >20%",
        "updates": "increases"
      },
      {
        "signal": "Grid-connection allocations for new NL data-center projects",
        "where": "Liander/TenneT congestion and connection-queue publications for the Amsterdam metro and Middenmeer/Eemshaven zones",
        "threshold": "New allocations flowing predominantly to hyperscale campus projects rather than colo expansions",
        "updates": "increases"
      },
      {
        "signal": "Amsterdam-region grid connection grants and the Amsterdam MVA ceiling's status",
        "where": "Liander/TenneT congestion maps and connection-queue publications; Amsterdam municipality data-center policy docket",
        "threshold": "Ceiling extended or queue lengthening beyond 2030",
        "updates": "increases"
      },
      {
        "signal": "PDU refresh/retrofit tender activity from existing Amsterdam-area colos",
        "where": "Operator capex commentary (NorthC, Iron Mountain NL, Equinix AM-campus announcements)",
        "threshold": "Visible retrofit programs at ≥3 AMS operators",
        "updates": "decreases"
      },
      {
        "signal": "Adoption status of Amsterdam's umbrella zoning plan and the 350 MVA connection ceiling",
        "where": "Gemeente Amsterdam planning docket and Dutch Data Center Association policy updates",
        "threshold": "Plan adopted with the 350 MVA cap intact",
        "updates": "increases"
      },
      {
        "signal": "National colocation capacity print year-on-year",
        "where": "DDA 'State of the Dutch Data Centers' annual report",
        "threshold": "National colo MW flat at ≤950 MW",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Build a bottom-up NL reachable-demand model: named colo operators × refresh cycle × racks, replacing the top-down capacity ratio for the second-largest geography",
        "type": "information",
        "voiNodeId": "geo.NL",
        "note": "Converts a stock-based apportionment into a biddable-demand figure before NL channel investment is committed"
      },
      {
        "action": "Sequence market entry DE-first and treat NL as an Amsterdam retail-colo refresh play rather than a proportional 28% of pipeline effort",
        "type": "operational",
        "note": "Germany's larger, enterprise-heavy base is less exposed to the self-build migration in the Year-1 window"
      }
    ],
    "evidence": [
      {
        "title": "Ten Years of State of the Dutch Data Centers",
        "sourceType": "industry-report",
        "publisher": "Dutch Data Center Association",
        "date": "2025-06-10",
        "excerpt": "In 2024, the total colocation capacity reached 924 megawatts... While the Amsterdam Metropolitan Area (MRA) still accounts for approximately 70% of colocation capacity, growth is shifting toward regions such as Groningen, South Holland, and North Brabant.",
        "url": "https://www.dutchdatacenters.nl/en/nieuws/ten-years-of-state-of-the-dutch-data-centers-a-decade-of-growth-and-challenges/",
        "attached": true
      },
      {
        "title": "Dutch economy faces billions in losses as Amsterdam data center expansion halts",
        "sourceType": "analyst-estimate",
        "publisher": "NL Times (citing ING analysis)",
        "date": "2025-10-07",
        "excerpt": "Amsterdam's power grid is full, preventing new data centers from being built until 2035, even though the city is the country's digital hub.",
        "url": "https://nltimes.nl/2025/10/07/dutch-economy-faces-billions-losses-amsterdam-data-center-expansion-halts",
        "attached": true
      },
      {
        "title": "Pure DC secures hyperscale customer for 78MW data center campus in Netherlands",
        "sourceType": "industry-report",
        "publisher": "DatacenterDynamics",
        "date": "2026-04-29",
        "excerpt": "An unnamed hyperscale customer is leasing the entire 78MW campus, situated in Westpoort, Amsterdam, with Pure DC investing more than €1 billion to develop the 5.6-acre site.",
        "url": "https://www.datacenterdynamics.com/en/news/pure-dc-secures-hyperscale-customer-for-78mw-data-center-campus-in-netherlands/",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "Existing 2024-2025 Dutch capacity datasets (CBRE/Structure Research self-build vs colo splits, plus DDA and Statista breakdowns) already quantify what share of Dutch DC demand is colo versus self-build/hyperscale and how much is reachable through open channels — a purchasable report and a week of analyst calls settle whether 28% overstates reachable demand today.",
    "proposedCorrection": {
      "nodeId": "geo.NL",
      "value": 0.2,
      "low": 0.15,
      "high": 0.26,
      "rationale": "The 28% weight apportions on colo stock, but a material and growing share of Dutch capacity is self-build/hyperscale bought through channels a new entrant cannot bid, so the reachable-demand weight should be discounted below the raw colo share."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: boundary-substitution · judge 17/20 · E[ΔYAM] −€0.03M · engine ΔYAM −€0.10M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.colo-spec-contagion-from-hyperscale-tenants.json
  {
    "id": "risk.boundary-substitution.colo-spec-contagion-from-hyperscale-tenants",
    "title": "Colo power gear follows AI tenants out of category",
    "narrative": "The model treats colocation as the safe harbor for rack PDUs and gives it a zero sensitivity band, so it never appears in the tornado. But CBRE shows European colo demand being outstripped by hyperscaler and AI tenants, and in wholesale prelet halls the tenant, not the operator, dictates the rack power design. If those tenants specify busway and power shelves inside leased halls, the colo PDU content leaves the category while operator capacity keeps growing 19% a year. The one segment the model calls certain is the one with the hidden contagion path.",
    "category": "boundary",
    "targetNodes": [
      "seg.colocation"
    ],
    "mechanism": "AI tenants filling colo halls also dictate wholesale power specs → Tenants pick busway, so colo PDU content falls despite growth → Null band hides all downside for the colo slice",
    "whyMissable": "Colocation looks like the segment where rack PDUs are mandatory, and its null band keeps it out of every sensitivity view the team reviews.",
    "falsifier": "Fit-out specs from 2026 CE wholesale colo preleases in Frankfurt and Amsterdam showing rack PDUs, not busway, as standard in AI-density halls.",
    "likelihood": {
      "value": 0.34,
      "rationale": "Tenant spec authority in wholesale preleases is documented and the buyer cohort is the migrating one, but retail and standard-density wholesale colo stay PDU-native. The AI signing surge is heavily Nordic rather than Frankfurt or Amsterdam, so the risk sits in the AI-density growth tranche; revised from 0.30 to 0.34.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "seg.colocation",
        "op": "set",
        "value": 0.12,
        "note": "Wholesale/prelet AI-density share of colo (roughly a third of the slice) migrates to tenant-specified busway/shelf architectures"
      }
    ],
    "indicators": [
      {
        "signal": "Rack power architecture named in wholesale prelease fit-out specifications for AI-density halls",
        "where": "Frankfurt and Amsterdam wholesale colo prelease announcements and fit-out tender documents; DCD/DCNN build coverage",
        "threshold": "≥2 CE wholesale preleases specifying busway/power-shelf distribution as tenant standard",
        "updates": "increases"
      },
      {
        "signal": "Colo operator capex-call language on standardizing power distribution for AI halls",
        "where": "Digital Realty and Equinix EMEA quarterly capex calls and investor-day fit-out cost breakdowns",
        "threshold": "Explicit mention of busway or shelf standardization for new AI capacity",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission a CE colo segmentation study splitting the 18% slice into retail vs wholesale/prelet MW and the power architecture specified in each",
        "type": "information",
        "voiNodeId": "seg.colocation",
        "note": "Replaces a null-band single-source node with a composition-aware estimate — the tornado currently cannot see this node at all"
      },
      {
        "action": "Anchor Year-1 sales in retail and managed colocation, where per-outlet metered PDUs are tied to tenant billing and remain architecturally sticky",
        "type": "strategic",
        "note": "Retail colo billing requirements make PDU displacement commercially costly for the operator"
      }
    ],
    "evidence": [
      {
        "title": "European Real Estate Market Outlook 2025 — Data Centres",
        "sourceType": "industry-report",
        "publisher": "CBRE",
        "date": "2025",
        "excerpt": "Take-up of colocation data centre space in Europe is expected to outstrip new supply in 2025 given strong demand from hyperscalers and providers of AI and high-performance computing services.",
        "url": "https://www.cbre.com/insights/books/european-real-estate-market-outlook-2025/data-centres",
        "attached": true
      },
      {
        "title": "Vertiv PowerBar Track busway (double-stack) for AI colocation and hyperscale",
        "sourceType": "industry-report",
        "publisher": "Data Centre Insight / Vertiv",
        "date": "2026-03-04",
        "excerpt": "The solution is designed to address rapidly evolving AI workloads within colocation and hyperscale data centres. Power distribution 'must keep pace' with AI and HPC scale demands.",
        "url": "https://datacentreinsight.co.uk/2026/03/04/vertiv-announces-scalable-high-capacity-double-stack-busway-system-that-preserves-white-space-for-growing-ai-data-centre-demands/",
        "attached": true
      },
      {
        "title": "Signings for AI Data Centre Capacity in Europe More Than Treble",
        "sourceType": "analyst-estimate",
        "publisher": "CBRE UK",
        "date": "2025-11-13",
        "excerpt": "Signings for AI-focused colocation capacity reached 414MW in the first nine months of 2025, up from 133MW compared to the same period in 2024. More than half (57%) was signed in the Nordics.",
        "url": "https://www.cbre.co.uk/press-releases/signings-for-ai-data-centre-capacity-in-europe-more-than-treble-in-first-nine-months-of-2025",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "risk",
    "settleTest": "Only future 2026+ wholesale prelet fit-out specifications from Frankfurt/Amsterdam AI-density halls, showing whether tenants actually specify busway versus rack PDUs, would settle this — that is a market design shift that hasn't yet resolved, not a knowable-today number.",
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: definition-scopedown · judge 17/20 · E[ΔYAM] −€0.03M · engine ΔYAM −€0.07M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.definition-scopedown.colo-denominator-geography-misallocation.json
  {
    "id": "risk.definition-scopedown.colo-denominator-geography-misallocation",
    "title": "Country map uses colo-only demand, overweighting Germany and NL",
    "narrative": "The model splits demand by country using colo megawatts divided by colo megawatts. But rack-PDU demand tracks total installed IT load, and about a third of that load sits outside colocation with a different country mix. Germany's installed load exceeds its colo figure by about 1,000MW, so a colo-based map overstates Germany and the Netherlands in the Year-1 plan.",
    "category": "model-structure",
    "targetNodes": [
      "geo.DE",
      "geo.NL",
      "geo.CH",
      "geo.PL"
    ],
    "mechanism": "EUDCA: colo and hyperscale is only two-thirds of Europe's power. → Gap varies by country, shifting the €300M across markets. → Plan overweights Germany and NL, misses Swiss and Polish demand.",
    "whyMissable": "Each country node discloses its colo-versus-installed gap as a width band, so the problem looks handled, but bands cannot show that the whole dimension moves the same wrong way at once.",
    "falsifier": "A single-source table of total installed IT load for all CE-7 countries whose per-country shares match the current colo-based shares within 3 percentage points.",
    "likelihood": {
      "value": 0.5,
      "rationale": "The gap is documented in the ledger's own checks for four of seven countries and confirmed continentally by EUDCA. What remains unclear is whether non-colo demand per megawatt matches colo, which partly offsets the shift, so likelihood is set at 0.50.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "geo.DE",
        "op": "set",
        "value": 0.42,
        "note": "Installed-load method share; mix shift, deliberately not renormalized"
      },
      {
        "nodeId": "geo.NL",
        "op": "set",
        "value": 0.24,
        "note": "NL colo-heavy market loses relative weight under installed-load scope"
      },
      {
        "nodeId": "geo.CH",
        "op": "set",
        "value": 0.13,
        "note": "Self-operated Swiss stock enters the denominator"
      },
      {
        "nodeId": "geo.PL",
        "op": "set",
        "value": 0.1,
        "note": "Mordor/R&M-corroborated 660MW installed load"
      }
    ],
    "indicators": [
      {
        "signal": "Publication of country-level installed IT power (not colo-only) for CE-7",
        "where": "EUDCA 'State of European Data Centres' country profiles; BMWK/Bitkom German landscape updates",
        "threshold": "Any CE country's installed-load share diverging >5pp from its colo share",
        "updates": "increases"
      },
      {
        "signal": "Origin of inbound PDU demand by facility type in early pipeline",
        "where": "Venture's own CRM plus PMR Poland commercial-DC series and CBRE Suisse commercial-vs-self-operated splits",
        "threshold": ">25% of qualified CE demand coming from enterprise/self-operated sites the colo map does not list",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Reconcile all seven countries onto one installed-load scope before locking Year-1 territory and account assignments",
        "type": "information",
        "voiNodeId": "geo.DE",
        "note": "The DE node carries the largest band swing (−€24M TAM at the low edge) and is the cheapest to resolve — two public sources already bracket it"
      },
      {
        "action": "Add an enterprise/self-operated sales motion (TÜV-certified retrofit bundle) for CH and PL alongside the large-operator channel",
        "type": "strategic",
        "note": "Hedges the plan against the denominator being wrong without waiting for the data"
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
        "title": "New 2026 State of European Data Centres",
        "sourceType": "industry-report",
        "publisher": "EUDCA",
        "date": "2026",
        "excerpt": "commercial colocation and hyperscale facilities now provide more than two-thirds of Europe’s IT power, driven by the growing demand for cloud and AI.",
        "url": "https://www.eudca.org/new-2026-state-of-european-data-centres",
        "attached": true
      },
      {
        "title": "Switzerland Colocation Data Center Portfolio Analysis Report 2025",
        "sourceType": "industry-report",
        "publisher": "Arizton / ResearchAndMarkets",
        "date": "2026-01-06",
        "excerpt": "The existing IT load capacity stands at around 280+ MW, while the upcoming pipeline is set to add nearly 900 MW.",
        "url": "https://www.businesswire.com/news/home/20260106992077/en/Switzerland-Colocation-Data-Center-Portfolio-Analysis-Report-2025-STACK-Infrastructure-Green-Datacenter-Digital-Realty-and-Vantage-Data-Centers-Remain-the-Major-Forces-Shaping-the-Market---ResearchAndMarkets.com",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A single-source, consistent-scope table of total installed IT load (colo + self-operated) for all CE-7 countries — e.g., a PMR or Arizton pan-European installed-IT-load series — that lets you compute per-country shares on one denominator. This exists as a purchasable dataset and settles whether colo-based shares misstate the country mix today.",
    "proposedCorrection": {
      "nodeId": "geo.DE",
      "value": 0.46,
      "low": 0.42,
      "high": 0.5,
      "rationale": "Colo-only denominator overstates Germany; the BMWK installed-IT-load cross-check already puts DE at ~0.42, so recentering to ~0.46 splits the two scope methods rather than anchoring on colo-only 0.50."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: structure-independence · judge 17/20 · E[ΔYAM] −€0.02M · engine ΔYAM −€0.03M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.structure-independence.colo-weights-enterprise-slice-misallocation.json
  {
    "id": "risk.structure-independence.colo-weights-enterprise-slice-misallocation",
    "title": "Geography weights overstate Netherlands, understate Switzerland",
    "narrative": "The model splits geography by colocation megawatts, then applies that split to the 29% enterprise slice. But colocation covers only about two-thirds of Europe's IT power, and enterprise machine rooms sit where industry is, not where Amsterdam campuses are. So the Netherlands cell counts enterprise demand that physically sits in German and Swiss server rooms, and anyone staffing a DACH channel off these weights will pick the wrong countries.",
    "category": "model-structure",
    "targetNodes": [
      "geo.NL",
      "geo.CH",
      "seg.enterprise"
    ],
    "mechanism": "Colocation covers only two-thirds of Europe's IT power. → The missing third sits elsewhere; Switzerland runs 0.13 versus 0.08. → Netherlands is overstated, Switzerland undersized, across the 29% enterprise slice.",
    "whyMissable": "Each axis is well-sourced on its own, so every ledger row passes review, and the error appears only when the two axes are multiplied together.",
    "falsifier": "A country-level installed-load table showing the Netherlands share of total load near its colocation share of 0.28, meaning the missing third distributes the same way.",
    "likelihood": {
      "value": 0.6,
      "rationale": "The colocation-versus-installed gap already shows up in the ledger's own checks for Germany, Switzerland, Austria and Poland, all in the predicted direction. The Netherlands magnitude is still unconfirmed, so confidence rises only modestly above the prior.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "geo.NL",
        "op": "set",
        "value": 0.23,
        "note": "NL weight corrected for its near-zero enterprise on-prem contribution to the 29% slice"
      },
      {
        "nodeId": "geo.CH",
        "op": "set",
        "value": 0.11,
        "note": "Mix-shift: self-operated Swiss load reallocated in — a reallocation, not a shrink; the risk is misdirected go-to-market, not lost TAM"
      }
    ],
    "indicators": [
      {
        "signal": "Publication of installed-load vs colocation country splits for CE-7",
        "where": "EUDCA 'State of European Data Centres' country profiles; BMWK/Bitkom German installed-load updates",
        "threshold": "DE/CH installed-load shares diverging >5pp from their colo shares",
        "updates": "increases"
      },
      {
        "signal": "Enterprise-segment pipeline geography vs model weights in early selling",
        "where": "Venture's own CRM: country origin of enterprise/mid-operator inbound and distributor leads",
        "threshold": "Enterprise leads from CH+DE running >2x their model-weighted share vs NL",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Commission or assemble a single-scope installed-IT-load table across CE-7 (the ledger's own promotion path) to re-derive geo weights per segment rather than globally",
        "type": "information",
        "voiNodeId": "geo.CH",
        "note": "One consistent scope resolves NL/CH/DE simultaneously"
      },
      {
        "action": "Split the v2 model's geography axis by segment: colo-weighted geo for hyperscale/colo demand, installed-load-weighted geo for enterprise — and weight the enterprise channel build toward DE/CH industrial accounts",
        "type": "operational",
        "note": "Removes the independence assumption where it is demonstrably false"
      }
    ],
    "evidence": [
      {
        "title": "New 2026 State of European Data Centres",
        "sourceType": "industry-report",
        "publisher": "EUDCA",
        "date": "2026",
        "excerpt": "The 2026 edition shows that commercial colocation and hyperscale facilities now provide more than two-thirds of Europe’s IT power, driven by the growing demand for cloud and AI.",
        "url": "https://www.eudca.org/new-2026-state-of-european-data-centres",
        "attached": true
      },
      {
        "title": "Status and development of the German data centre landscape – Executive Summary",
        "sourceType": "industry-report",
        "publisher": "BMWK (German Federal Ministry for Economic Affairs)",
        "date": "2025-03",
        "excerpt": "With over 2,000 data centres and an installed IT power demand of over 2,700 MW, Germany is already the largest centre for digital infrastructure in Europe.",
        "url": "https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Publikationen/Digitale-Welt/status-and-development-of-the-german-data-centre-landscape-executive-summary.pdf?__blob=publicationFile&v=2",
        "attached": true
      },
      {
        "title": "Data Center Impact Report Deutschland",
        "sourceType": "industry-report",
        "publisher": "German Datacenters Association",
        "date": "2024",
        "excerpt": "1,955 MW IT power in Germany approx. ... thereof 69 % in colocation data centers",
        "url": "https://www.germandatacenters.com/fileadmin/images/DCIRD-24/Data-Center-Impact-Report-Deutschland-2024_EN.pdf",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A country-level total installed IT-load table (colocation + enterprise/self-operated) for the CE-7 set — e.g., BMWK/German Datacenters, CBRE Suisse, and Dutch DCA figures reconciled — showing each country's share of total load versus its colocation-only share. This exists today and would settle whether applying colo weights to the enterprise slice mis-locates enterprise demand.",
    "proposedCorrection": {
      "nodeId": "geo.CH",
      "value": 0.13,
      "low": 0.1,
      "high": 0.15,
      "rationale": "Switzerland's market is self-operation-heavy (CBRE: 340 MW commercial vs Mordor 850.6 MW total incl. self-operated); the enterprise slice should use installed-base weights (~0.13), not colocation-only (0.08), which understate DACH enterprise rooms."
    },
    "asOf": "2026-07-08"
  },

  // ◆ rock · lens: structure-independence · judge 18/20 · E[ΔYAM] −€0.02M · engine ΔYAM −€0.03M · evidence: corroborated
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
      "value": 0.5,
      "rationale": "The 60%-outside-CE self-build concentration is directly sourced and Frankfurt is a documented colo hub, not a self-build one. Residual doubt is only how much leased hyperscale capacity to attribute to the hyperscale buyer for PDU specs; revised up from 0.4 to 0.5.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "seg.hyperscale",
        "op": "set",
        "value": 0.3,
        "note": "Hyperscale-owned CE share corrected for the self-build concentration outside CE-7"
      },
      {
        "nodeId": "seg.colocation",
        "op": "set",
        "value": 0.3,
        "note": "Mix-shift: leased 'scale colocation' capacity re-attributed to the colo-operator segment where the PDU purchasing decision actually sits"
      }
    ],
    "indicators": [
      {
        "signal": "Hyperscale self-build MW announced/operational by country",
        "where": "CBRE quarterly 'Europe Data Centres Figures'; hyperscaler capex-call site announcements for DE/PL/AT",
        "threshold": "CE-7 self-build share of Europe rising above ~25% would weaken the risk; staying ≤20% confirms it",
        "updates": "decreases"
      },
      {
        "signal": "Publication of a Europe-scoped hyperscale/colo/enterprise capacity split",
        "where": "Synergy Research Europe releases; EUDCA State of European Data Centres",
        "threshold": "Europe hyperscale-owned share reported <35%",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Buy or derive a Europe-scoped segment split (Synergy Europe cut or CBRE self-build vs colo series) before locking the product roadmap to hyperscale requirements",
        "type": "information",
        "voiNodeId": "seg.hyperscale",
        "note": "Directly de-risks the largest segment node with a regionally-scoped source"
      },
      {
        "action": "Spec the launch product for colo-operator requirements — billing-grade tenant metering, multi-tenant DCIM integration, retrofit form factors — since the CE cell that actually exists is colo-operated capacity serving hyperscale tenants",
        "type": "strategic",
        "note": "Aligns the product with the real buyer of the double-booked megawatts"
      }
    ],
    "evidence": [
      {
        "title": "CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth",
        "sourceType": "industry-report",
        "publisher": "DatacenterDynamics (citing CBRE)",
        "date": "2026-02-20",
        "excerpt": "This new supply will be delivered across nine European countries, with 60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium.",
        "url": "https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/",
        "attached": true
      },
      {
        "title": "On-Premise Data Center Capacity Being Increasingly Dwarfed by Hyperscalers and Colocation Companies",
        "sourceType": "analyst-estimate",
        "publisher": "Synergy Research Group",
        "date": "2023-07-12",
        "excerpt": "Approximately half of that hyperscale capacity is in own-built, owned data centers and half is in leased facilities.",
        "url": "https://www.srgresearch.com/articles/on-premise-data-center-capacity-being-increasingly-dwarfed-by-hyperscalers-and-colocation-companies",
        "attached": true
      },
      {
        "title": "Frankfurt DCI Report 2024: Data Centre Colocation, Hyperscale Cloud & Interconnection",
        "sourceType": "industry-report",
        "publisher": "Structure Research",
        "date": "2024-06-24",
        "excerpt": "Hyperscale colocation is growing at a five-year CAGR of 26.1% and retail colocation is moving along at a 10.3% clip.",
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

  // ◆ rock · lens: boundary-substitution · judge 17/20 · E[ΔYAM] −€0.02M · engine ΔYAM −€0.03M · evidence: corroborated
  // draft: risks/raw/llm/hunt · evidence: risks/raw/evidence/risk.boundary-substitution.ce7-hyperscale-mix-mirage.json
  {
    "id": "risk.boundary-substitution.ce7-hyperscale-mix-mirage",
    "title": "Segment mix overweights hyperscale in CE-7, misdirecting Year-1 effort",
    "narrative": "The model applies Synergy's global 48% hyperscale share to Central Europe using a flat 0.91 carve-out. But about 60% of Europe's hyperscale self-build capacity sits in Ireland, the Netherlands, Sweden and Belgium, outside CE-7. So the buyer mix overweights hyperscale by perhaps a third, which leaves the TAM headline unchanged but points certification and Year-1 pipeline effort at the wrong buyers.",
    "category": "model-structure",
    "targetNodes": [
      "seg.hyperscale",
      "seg.colocation",
      "seg.enterprise"
    ],
    "mechanism": "Model applies a global 48% hyperscale share to CE-7. → Hyperscale self-build grows 24% yearly, concentrated outside CE-7. → The €300M base misfires: hyperscale up, colo and enterprise down.",
    "whyMissable": "The wrong mix leaves TAM, SAM and YAM totals identical, so every reviewed number reads the same and no test checks whether the mix came from the wrong geography.",
    "falsifier": "A Europe- or CE-scoped split from CBRE, Synergy or JLL showing hyperscale-owned capacity at 40% or more of CE-7 megawatts.",
    "likelihood": {
      "value": 0.5,
      "rationale": "The 60%-outside-CE figure and the 24% versus 19% growth split are directly sourced and corroborated, and no Europe-scoped share exists. The main uncertainty is how much hyperscale capacity leased inside CE colo offsets the self-build concentration elsewhere.",
      "basis": "evidence"
    },
    "perturbation": [
      {
        "nodeId": "seg.hyperscale",
        "op": "set",
        "value": 0.3,
        "note": "CE-7 hyperscale-owned share corrected for self-build concentration outside CE"
      },
      {
        "nodeId": "seg.colocation",
        "op": "set",
        "value": 0.26,
        "note": "Mix-shift: CE capacity is more colo-weighted than the global split implies"
      },
      {
        "nodeId": "seg.enterprise",
        "op": "set",
        "value": 0.33,
        "note": "Mix-shift: DACH enterprise/self-operated weight (BMWK, Swiss self-operation) raises the enterprise share; siblings moved explicitly since the engine does not re-normalize"
      }
    ],
    "indicators": [
      {
        "signal": "First publication of a Europe or CE regional capacity split by operator type",
        "where": "Synergy Research regional releases; CBRE European Data Centres quarterly reports",
        "threshold": "CE/Europe hyperscale-owned share reported ≥8pp below the model's 0.44",
        "updates": "increases"
      },
      {
        "signal": "Location of announced hyperscale self-build campuses in Europe",
        "where": "DCD/DCNN build announcements; German and Polish planning/permit registries for hyperscale campuses",
        "threshold": "≥70% of announced European self-build MW landing outside CE-7 for two consecutive quarters",
        "updates": "increases"
      }
    ],
    "mitigations": [
      {
        "action": "Purchase or commission a CE-7-scoped capacity split by operator type (hyperscale-owned vs colo vs enterprise) before locking Year-1 channel investment",
        "type": "information",
        "voiNodeId": "seg.hyperscale",
        "note": "Replaces the transplanted global split — the single highest-leverage structural fix in the segment dimension"
      },
      {
        "action": "Weight Year-1 pipeline and certification spend toward colo and enterprise accounts in DE/NL rather than hyperscale framework pursuit",
        "type": "operational",
        "note": "Hedges the mix error: these buyers exist in CE at scale under either mix scenario"
      }
    ],
    "evidence": [
      {
        "title": "Hyperscale Operators to Account for 67% of all Data Center Capacity by 2031",
        "sourceType": "industry-report",
        "publisher": "Synergy Research Group",
        "excerpt": "they now account for 48% of the worldwide capacity of all data centers. Almost 60% of that hyperscale capacity is now in own-built, owned data centers... non-hyperscale colocation capacity accounting for another 20%... enterprise on-premise data centers with just 32%.",
        "url": "https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031",
        "attached": true
      },
      {
        "title": "CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth",
        "sourceType": "industry-report",
        "publisher": "CBRE via DatacenterDynamics",
        "date": "2026-02-20",
        "excerpt": "hyperscaler self-build capacity will reach 4.2GW in 2026, a 24 percent increase... 60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium.",
        "url": "https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/",
        "attached": true
      },
      {
        "title": "Signings for AI Data Centre Capacity in Europe More Than Treble",
        "sourceType": "industry-report",
        "publisher": "CBRE UK",
        "date": "2025-11-13",
        "excerpt": "signings for AI-focused colocation capacity reached 414MW... More than half of this capacity (57%) was signed in the Nordics.",
        "url": "https://www.cbre.co.uk/press-releases/signings-for-ai-data-centre-capacity-in-europe-more-than-treble-in-first-nine-months-of-2025",
        "attached": true
      }
    ],
    "evidenceStatus": "corroborated",
    "tier": "rock",
    "resolution": "error",
    "settleTest": "A Europe- or CE-7-scoped segment capacity split from CBRE, Synergy, or JLL showing hyperscale-owned share of CE-7 megawatts today. This is a purchasable/publishable dataset describing today's geographic distribution of installed capacity, not a future market outcome.",
    "proposedCorrection": {
      "nodeId": "seg.hyperscale",
      "value": 0.33,
      "low": 0.28,
      "high": 0.4,
      "rationale": "CBRE's evidence that ~60% of European hyperscale self-build capacity sits in Ireland, Netherlands, Sweden, and Belgium (outside CE-7) means the global 48%×0.91 carve-out overstates CE-7 hyperscale share by roughly a third; rescaling to CE-7 geography lands near 33%."
    },
    "asOf": "2026-07-08"
  },

];

// Validated at module load — a malformed register throws here, at boot,
// with every issue listed (same doctrine as the ledger).
export const risks: Risk[] = validateRisks(rawRisks, ledger);
