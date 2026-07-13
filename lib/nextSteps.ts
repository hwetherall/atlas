import { ledger } from "@/lib/ledger";
import { risks } from "@/lib/risks";
import { validateMemos, type Memo } from "@/lib/nextStepsSchema";

// ─────────────────────────────────────────────────────────────────────────────
// Next Steps — the five memos (nextsteps.md). Five risks from the cycle-2
// register, one response each, executed by the Innovera toolkit
// (lib/toolkit.ts). Authored from the cached research pass under
// research/raw/nextsteps/ (report titles, prices and delivery terms are
// store-page facts from that cache, not guesses). Every € figure on the
// surface is engine-computed at render time — this file carries narrative
// and projection ops only.
//
// Status: the Delphi memo is the approved-template candidate (nextsteps.md
// §7 milestone 2); the other four are full-skeleton drafts pending their own
// research passes.
// ─────────────────────────────────────────────────────────────────────────────

const rawMemos: Memo[] = [
  // ── 1 · Daedalus — ACT ──────────────────────────────────────────────────────
  {
    riskId: "risk.structure-independence.frankfurt-cycle-lockout-year1",
    response: "act",
    headline: "The market won't wait for a tender that isn't coming",
    stakes: {
      narrative:
        "The Year-1 number assumes buyers arrive steadily and can be won inside twelve months. But the chosen corner of the market is a handful of Frankfurt and Amsterdam campus fit-outs whose electrical bill of materials was frozen at tender, in 2024–25. The capacity delivering during the venture's first year has, for sales purposes, already happened. Every quarter spent pitching new-build tenders is a quarter of the only selling year the model counts.",
      whenItBites: "Immediately — the exposure IS the first twelve months; it decays to zero as the year burns.",
      decisionExpiry: {
        label: "Before Year-1 go-to-market hiring and target lists are set — this quarter",
        why: "A retrofit pivot only pays if the account coverage, SKU kit and target list exist before the selling year is spent chasing locked tenders.",
      },
    },
    decision: {
      question:
        "Re-weight the Year-1 go-to-market from new-build tenders to brownfield retrofit and PDU swap-outs in standing Frankfurt and Amsterdam stock?",
      deadline: "This quarter, alongside Year-1 hiring decisions",
      defaultPath:
        "The plan keeps chasing new-build tenders whose electrical BoM was specified in 2024–25 — Year-1 revenue structurally arrives in Year 2 or 3.",
    },
    rationale: [
      {
        response: "act",
        verdict: "chosen",
        note: "No fact is missing — pipeline data already documents early spec-lock. Only the plan itself can change what the venture is exposed to.",
      },
      {
        response: "buy-information",
        verdict: "rejected",
        note: "A fit-out pipeline audit sharpens the number but doesn't open a single locked tender.",
      },
      {
        response: "expert",
        verdict: "rejected",
        note: "Procurement veterans would confirm the mechanism; confirmation moves no euros.",
      },
      {
        response: "monitor",
        verdict: "rejected",
        note: "Watching tender feeds while the window closes converts a risk into a result.",
      },
      {
        response: "ignore",
        verdict: "rejected",
        note: "This is the largest exposure on the corrected register.",
      },
    ],
    artifact: {
      kind: "daedalus",
      objective:
        "Make Year-1 revenue independent of the new-build tender cycle by winning the one sub-pool that transacts inside twelve months: retrofit and swap-outs in operating halls.",
      workstreams: [
        {
          name: "Retrofit SKU kit",
          detail:
            "Tool-less rails, DCIM migration adapters, and a swap-out install guide — remove every excuse an operating hall has to wait for its next build.",
        },
        {
          name: "Brownfield account coverage",
          detail:
            "Two retrofit-focused account executives; target list built from standing Frankfurt/Amsterdam stock (operating halls), not the construction pipeline.",
        },
        {
          name: "Second-source wedge",
          detail:
            "Map framework expiry dates and qualified-alternate slots at the large operators — retrofit pilots today become second-source positions when frameworks reopen.",
        },
      ],
      milestones: [
        { when: "Day 30", what: "Installed-base target list complete; retrofit BoM frozen" },
        { when: "Day 60", what: "First ten retrofit RFQs in flight" },
        { when: "Day 90", what: "First retrofit purchase order" },
        { when: "Day 180", what: "Retrofit ≥ 50% of qualified Year-1 pipeline" },
      ],
      resourcing: "Two AEs + 0.5 product engineer + channel ops support",
      budget: "≈ €250–400k incremental to the current plan",
      leadingIndicators: [
        "Retrofit RFQ→quote cycle under six weeks",
        "Swap-out win rate against incumbent renewal quotes",
        "Share of qualified pipeline sourced from standing stock vs construction pipeline",
      ],
      killCriteria: [
        "No retrofit purchase order by day 120",
        "Retrofit gross margin below the hardware-only floor two quarters running",
      ],
    },
    projection: {
      ops: [
        {
          nodeId: "obtainableFactor",
          low: 0.006,
          high: 0.03,
          note: "Retrofit demand transacts inside 12 months — the spec-lock worst case rises off the floor",
        },
      ],
      retirement: "mitigates",
      note: "The pivot doesn't change today's 1% estimate — it changes what happens if the spec-lock risk lands: the worst case rises from 0.4–0.5% toward the retrofit-backed floor, because part of Year-1 demand no longer waits for a tender.",
    },
    evidence: [
      {
        title: "Goodman, CPP Investments establish €8bn European data center platform",
        publisher: "DatacenterDynamics",
        url: "https://www.datacenterdynamics.com/en/news/goodman-cpp-investments-establish-8bn-european-data-center-plaform/",
        excerpt:
          "Four projects totalling 435MW of primary power and 282MW of IT load across Frankfurt, Amsterdam, and Paris — concentrating European take-up in a handful of flagship campuses.",
        date: "2025-12-23",
      },
      {
        title: "Data Center Construction Timeline: 18-36 Months, Phase by Phase",
        publisher: "Buildermuse",
        url: "https://buildermuse.com/commercial/data-center-construction-timeline-phase-by-phase/",
        excerpt:
          "40-60 week switchgear lead times and 18-36 month build cycles mean electrical BoM is specified far ahead of delivery.",
        date: "2026-06-04",
      },
    ],
    asOf: "2026-07-13",
  },

  // ── 2 · Mentor — SPEAK TO AN EXPERT ─────────────────────────────────────────
  {
    riskId: "risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window",
    response: "expert",
    headline: "One hour with a conformity assessor beats a quarter of guessing",
    stakes: {
      narrative:
        "The Cyber Resilience Act's dates are enacted law: reporting duties from 11 September 2026, full conformity from 11 December 2027 — both inside or touching the venture's entry window. What is NOT settled is judgment: whether remote-management PDUs land in the default class (self-declaration) or Annex III 'important' (notified body), and whether 2026 buyers will gate shortlists on CRA-readiness or accept a roadmap. Reading the regulation again will not answer either; someone who classifies connected infrastructure for a living will, in an hour.",
      whenItBites:
        "First tenders that write CRA/SBOM clauses — buyer front-running is already visible in 2026 bids.",
      decisionExpiry: {
        label: "Before design freeze on the launch firmware and certification plan",
        why: "The conformity route (self-declaration vs notified body) changes the artifact list and the test calendar; after design freeze, a wrong guess costs a re-spin.",
      },
    },
    decision: {
      question:
        "Book the CRA classification session and lock the conformity route before design freeze?",
      deadline: "Inside the month — assessor calendars and design freeze are both clocks",
      defaultPath:
        "The team guesses 'default class', builds to self-declaration, and discovers in a 2027 audit — or a lost 2026 bid — that a notified body was required all along.",
    },
    rationale: [
      {
        response: "expert",
        verdict: "chosen",
        note: "The open question is classification judgment, not data — a practitioner who has classified rack power under RED/MID/CRA decides this weekly.",
      },
      {
        response: "buy-information",
        verdict: "rejected",
        note: "No purchasable report rules on YOUR product's class; regulatory guides restate the regulation.",
      },
      {
        response: "monitor",
        verdict: "rejected",
        note: "Harmonized-standards progress is worth watching, but waiting doesn't decide the conformity route before design freeze.",
      },
      {
        response: "act",
        verdict: "rejected",
        note: "Building the full notified-body artifact stack 'just in case' costs two quarters against a question one call can settle.",
      },
      {
        response: "ignore",
        verdict: "rejected",
        note: "Enacted law with dates inside the entry window is the definition of non-ignorable.",
      },
    ],
    artifact: {
      kind: "mentor",
      profile: {
        name: "Dr. Anneke Vos",
        title: "EU Product Conformity & Cyber Resilience — Innovera Mentor Network",
        bio: "Former lead assessor at a German notified body; fifteen years certifying connected infrastructure — industrial controllers, smart metering, rack power — under RED, MID and now the CRA. Sat on the CEN/CENELEC JTC 13 working group drafting the CRA harmonized standards. (Profile illustrative: Mentor matches from the live network at engagement time.)",
        engagement: "1-hour advisory session, follow-up memo included · via Mentor",
      },
      agenda: [
        {
          question:
            "Does a remote-management rack PDU land in the CRA default class or Annex III 'important' under Implementing Regulation 2025/2392?",
          nodeId: "serviceableFactor",
          moves:
            "Default class keeps self-declaration open and 2026 shortlists reachable — serviceable share holds at 55%; Annex III cuts reachable demand until a notified body signs.",
        },
        {
          question:
            "If self-declaration (Module A) applies, which artifacts must exist at bid time — SBOM, PSIRT, secure-development file — and which can follow?",
          nodeId: "obtainableFactor",
          moves:
            "Artifacts-at-bid determines how many 2026 tenders the venture can answer — directly moves the Year-1 obtainable share.",
        },
        {
          question:
            "Are EU data-center buyers in 2026 gating shortlists on CRA-readiness, or accepting compliance roadmaps?",
          nodeId: "obtainableFactor",
          moves:
            "Roadmap-tolerant buyers keep the 1% Year-1 pace credible; certificate-gating buyers push it toward the risk's 0.6% floor.",
        },
        {
          question:
            "What sequencing of CE + TÜV + CRA testing avoids serializing the compliance calendar?",
          nodeId: "obtainableFactor",
          moves:
            "Parallel tracks protect the selling window the firmware-audit-gate risk already threatens.",
        },
        {
          question:
            "Which CRA harmonized standards will cite by mid-2026, and does slippage change the route?",
          nodeId: "serviceableFactor",
          moves:
            "Standards slippage raises the odds buyers demand third-party proof — an early-warning to hand Argus.",
        },
      ],
      deliverable:
        "A one-page conformity route memo — class, route, artifact list, test calendar — folded into the register within the week; the CRA risk's likelihood re-scored on an assessor's judgment instead of a founder's reading.",
    },
    projection: {
      ops: [],
      retirement: "settles",
      note: "The call doesn't move the funnel — it removes the scenario in which 2026 shortlists silently close. Answered either way, the CRA question stops being a register risk and becomes a line in the compliance plan.",
    },
    evidence: [
      {
        title: "Cyber Resilience Act (CRA) — DG CONNECT webinar slides",
        publisher: "ENISA / European Commission DG CONNECT",
        url: "https://certification.enisa.europa.eu/document/download/9d04238b-7f18-4575-a7dd-638afc92e019_en?filename=Slides_CRA_EUCC_webinar_June_2025.pdf",
        excerpt:
          "Entry into application: 11 December 2027 except for reporting obligations: 11 September 2026. In scope: 'products with digital elements'... network equipment... including their remote data processing solutions.",
      },
      {
        title: "CRA Product Classes: Implementing Regulation 2025/2392 Technical Descriptions",
        publisher: "Safeguard",
        url: "https://safeguard.sh/resources/blog/cra-implementing-regulation-2025-2392-product-classes",
        excerpt:
          "The default tier — roughly 90 per cent of products — permits self-assessment under conformity assessment Module A.",
        date: "2026-01-15",
      },
    ],
    asOf: "2026-07-13",
  },

  // ── 3 · Argus — MONITOR ─────────────────────────────────────────────────────
  {
    riskId: "risk.competitive-foreclosure.framework-agreements-close-first-buyer",
    response: "monitor",
    headline: "Nothing to buy, no one to ask — only time settles it. Argus watches.",
    stakes: {
      narrative:
        "The model prices large operators at 40% of spend and names them the first buyer. But operators of that size increasingly buy rack power through multi-year framework agreements — the Digital Realty–Schneider $373M supply capacity agreement is the template — which remove tenders from the market for their whole term. Whether most of that 40% is already locked is not knowable today from any report or call: the evidence is genuinely contested, and the settle-test is the next twelve months of tender behavior itself.",
      whenItBites:
        "Continuously across Year 1 — every framework renewal quietly shrinks the open market before any tender is lost.",
      decisionExpiry: {
        label: "No decision is due today — that is precisely why this is a watch, not a move",
        why: "Acting on a contested foreclosure claim would re-plan the beachhead around evidence that may dissolve; the cheap correct move is to instrument the question.",
      },
    },
    decision: {
      question:
        "Put the framework-foreclosure question under always-on watch, with re-pricing wired to the register?",
      deadline: "Argus live before the first Year-1 account plans are committed",
      defaultPath:
        "The team re-checks tender feeds when someone remembers to — and learns the beachhead was contract-foreclosed one lost quarter after the signals were public.",
    },
    rationale: [
      {
        response: "monitor",
        verdict: "chosen",
        note: "Only unfolding tender behavior settles this, and all three early warnings are machine-watchable public feeds — the archetypal Argus case.",
      },
      {
        response: "buy-information",
        verdict: "rejected",
        note: "No purchasable dataset states what fraction of operator rack-PDU spend is framework-locked; the cited deals cover UPS and switchgear, not PDUs.",
      },
      {
        response: "expert",
        verdict: "rejected",
        note: "Procurement leads can describe framework norms (worth folding into the Delphi/Mentor passes) but cannot reveal confidential term coverage.",
      },
      {
        response: "act",
        verdict: "rejected",
        note: "The second-source wedge is already a Daedalus workstream; re-planning the whole beachhead on contested evidence overreacts.",
      },
      {
        response: "ignore",
        verdict: "rejected",
        note: "€0.30M of expected Year-1 loss with a live mechanism is too big to accept unwatched.",
      },
    ],
    artifact: {
      kind: "argus",
      watch: [
        {
          signal: "Rack-power framework renewals naming CE operators",
          feed: "Schneider / Vertiv / Eaton press rooms · DatacenterDynamics procurement coverage · operator annual-report supplier notes",
          threshold: "Any CE major renewing a ≥3-year rack-power framework during the launch year",
          cadence: "Weekly sweep",
        },
        {
          signal: "Standalone rack-PDU lots in European tenders",
          feed: "TED (tenders.europa.eu) power-distribution CPV codes · national portals (DE: bund.de vergabe)",
          threshold: "Fewer than two standalone multi-vendor PDU lots per quarter across CE-7",
          cadence: "Weekly sweep",
        },
        {
          signal: "AVL qualification requirements at operator onboarding portals",
          feed: "Equinix / Digital Realty / NTT GDC supplier-registration portals",
          threshold: "Mandatory ISO 27001 or 12+ month qualification stated for electrical fit-out vendors",
          cadence: "Monthly check",
        },
      ],
      escalation:
        "Threshold trip → alert to the deal owner and automatic register re-price. Two trips in one quarter → convene the second-source wedge decision (Daedalus memo, workstream 3).",
      mockAlert: {
        label: "Simulated alert — what an Argus delivery looks like",
        feedItem:
          "Schneider Electric and Digital Realty announce $373M multi-year Supply Capacity Agreement covering UPS, low-voltage switchgear and prefabricated skids",
        source: "PR Newswire · 2025-11-19 (historical item, replayed as simulation)",
        tripped: "Framework-renewal signal — a CE-relevant major locking power-train spend for a multi-year term",
        effect:
          "Likelihood review 0.42 → 0.55 proposed; expected Year-1 loss on this risk re-prices €0.30M → €0.39M; the register re-ranks and the deal owner is paged.",
      },
    },
    projection: {
      ops: [],
      retirement: "none",
      note: "Monitoring doesn't move the model — it guarantees the model moves the day the world does. The value is latency: signals become re-priced exposure in hours, not quarters.",
    },
    evidence: [
      {
        title: "Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement",
        publisher: "PR Newswire / Schneider Electric",
        url: "https://www.prnewswire.com/news-releases/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-to-meet-rising-data-center-demand-302620427.html",
        excerpt:
          "The strategic shift to an SCA model provides guaranteed capacity... while preserving the flexibility needed for a dynamic, multi-vendor environment.",
        date: "2025-11-19",
      },
    ],
    asOf: "2026-07-13",
  },

  // ── 4 · Delphi — BUY INFORMATION (the template memo) ────────────────────────
  {
    riskId: "risk.definition-scopedown.band-top-contaminated-comparator",
    response: "buy-information",
    headline: "Buy the report before you re-argue the number",
    stakes: {
      narrative:
        "The model caps the market base at €360M — but the growth rate used to justify that ceiling came from a €8.5–9.5B power-and-cable-management report covering far more than rack PDUs, so the scope-down may have imported the very contamination it was meant to remove. Germany-alone forecasts and the upper global anchors point above the band. This is the rare register finding whose surprise may be UPSIDE: if the true base sits at €400M+, the Year-1 plan — certification scope, channel hires, contract-manufacturing volumes — is sized for the wrong market. And unlike every other finding, a purchasable dataset settles it outright.",
      whenItBites:
        "At the next planning gate — a mis-sized base compounds through certification scope, hiring and CM volume commitments before a single unit ships.",
      decisionExpiry: {
        label: "Before the Year-1 operating plan locks capacity and certification scope — the plan's first 6-month gate",
        why: "The report is worth €30M of resolved TAM uncertainty today; after capacity is committed, the same answer is trivia.",
      },
    },
    decision: {
      question:
        "Commission the directly-scoped EU rack-PDU dataset before the operating plan locks?",
      deadline: "This planning cycle — delivery is instant, the gate is not",
      defaultPath:
        "The €360M ceiling stays in the model unaudited, and the venture sizes certification, channel and capacity to a number that sits two contested hops from any primary source.",
    },
    rationale: [
      {
        response: "buy-information",
        verdict: "chosen",
        note: "A directly-scoped purchasable dataset exists — $4,000 against a €30M band question, delivered instantly. The cheapest instrument that settles the claim outright, in either direction.",
      },
      {
        response: "expert",
        verdict: "rejected",
        note: "An analyst call would be judgment layered on the same paywalled primary source — buy the source.",
      },
      {
        response: "monitor",
        verdict: "rejected",
        note: "Vendor earnings would eventually reveal the base, quarters after the operating plan needed it.",
      },
      {
        response: "act",
        verdict: "rejected",
        note: "Re-sizing capacity before knowing the base is exactly the mistake this finding flags; staged capacity options are the hedge, not the answer.",
      },
      {
        response: "ignore",
        verdict: "rejected",
        note: "The only finding with upside — €0.26M of expected loss understates it; ignoring forfeits the scenario where the market is €120M bigger than planned for.",
      },
    ],
    artifact: {
      kind: "delphi",
      options: [
        {
          title: "Rack PDUs Market in the European Union — Analysis, Forecast, Size, Trends and Insights",
          vendor: "IndexBox",
          scope: "EU-scoped rack-PDU base with country tables — the exact denominator the model needs",
          price: "$4,000 single-user (store-listed)",
          delivery: "Digital report, immediate",
          settles: ["tamBase", "geo.DE"],
          url: "https://www.indexbox.io/store/european-union-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
          note: "The ledger's own promotion path for tamBase — named in the risk's settle-test.",
        },
        {
          title: "Intelligent Rack PDUs Market in the European Union",
          vendor: "IndexBox",
          scope: "The intelligent-only subset of the same base",
          price: "$4,000 single-user (store-listed)",
          delivery: "Digital report, immediate",
          settles: ["tamBase"],
          url: "https://www.indexbox.io/store/european-union-intelligent-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
          note: "Bought together with the EU report, the same desk order also settles register finding #7 — 'base counts basic PDUs the venture cannot sell'.",
        },
        {
          title: "Rack PDU Market Tracker — 2025",
          vendor: "Omdia (Informa Tech)",
          scope: "Vendor shipment shares and market sizing — the concentration cross-check",
          price: "Omdia subscription · quote on access",
          delivery: "Tracker access on subscription",
          settles: ["tamBase", "shape.cr3"],
          url: "https://omdia.tech.informa.com/om129351/rack-pdu-market-tracker--2025",
          note: "Also re-sources the top-3 concentration figure the shape strip currently carries unsourced.",
        },
        {
          title: "Data Center Rack Power Distribution Unit (PDU) Market, 2026–2031",
          vendor: "Mordor Intelligence",
          scope: "Global base and CAGR — the outer anchor for the Europe share hop",
          price: "USD 4,750 single license (store-listed)",
          delivery: "PDF + data sheet, 24–72h; 3 months analyst support",
          settles: ["tamBase", "shape.cagr"],
          url: "https://www.mordorintelligence.com/industry-reports/data-center-rack-pdu-market",
          note: "The analyst-support window covers follow-up questions on the Europe split.",
        },
      ],
      recommendation:
        "Buy the IndexBox pair — EU Rack PDUs + EU Intelligent Rack PDUs, $8,000 total, immediate delivery. Directly scoped to the ledger's denominator, it settles this finding AND the intelligent-subset error in one order, and its country tables re-source the Germany share. Add the Omdia tracker only if a subscription already exists; hold Mordor as the global cross-check if the IndexBox figure lands outside the current band.",
    },
    projection: {
      ops: [
        {
          nodeId: "tamBase",
          low: 285,
          high: 315,
          confidence: "verified",
          note: "Report-grade precision: the band collapses from ±€60M to roughly ±5% around the published figure; confidence promotes to verified",
        },
      ],
      retirement: "settles",
      note: "The projection shows the certainty purchased, not the answer — the report may confirm €300M, or move the base (the risk's own hypothesis says €420M, +€120M of TAM). Either way the question dies: VOI on the market base goes to zero, and the register's biggest upside/downside coin-flip becomes a sourced fact.",
    },
    evidence: [
      {
        title: "Rack PDUs Market in the European Union — store listing",
        publisher: "IndexBox",
        url: "https://www.indexbox.io/store/european-union-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
        excerpt: "Single User License — limited to one named user: $4,000. Multi-User License (up to 5 named users): $5,600.",
      },
      {
        title: "Intelligent Rack PDUs Market in the European Union — store listing",
        publisher: "IndexBox",
        url: "https://www.indexbox.io/store/european-union-intelligent-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
        excerpt: "Intelligent Rack PDUs — Market Analysis, Forecast, Size, Trends and Insights: Single User License $4,000.",
      },
      {
        title: "Data Center Rack PDU Market — report page",
        publisher: "Mordor Intelligence",
        url: "https://www.mordorintelligence.com/industry-reports/data-center-rack-pdu-market",
        excerpt: "Single License USD 4,750 — PDF report & data sheet, delivered in 24–72 hrs of purchase, 3-months analyst support.",
      },
      {
        title: "Rack PDU Market Tracker — 2025",
        publisher: "Omdia",
        url: "https://omdia.tech.informa.com/om129351/rack-pdu-market-tracker--2025",
        excerpt: "Rack PDU Market Tracker – 2025. Become a client to gain access.",
      },
    ],
    asOf: "2026-07-13",
  },

  // ── 5 · Themis — IGNORE ─────────────────────────────────────────────────────
  {
    riskId: "risk.competitive-foreclosure.distributor-line-review-lockout",
    response: "ignore",
    headline: "Safely ignorable this year — and Argus has the watch",
    stakes: {
      narrative:
        "The distributor cell is 13% of the model, and the claim is that annual line reviews plus Legrand's ownership of both incumbent intelligent-PDU brands keep it shut for exactly the twelve months Year 1 measures. The mechanism is real — but the evidence is contested: three 2025–26 cases show European distributors onboarding new PDU vendors mid-cycle, and the Year-1 plan (see the Daedalus memo) routes around distribution entirely. The dangerous move here isn't the risk landing; it's burning scarce launch capacity fighting a gate the plan doesn't need opened.",
      whenItBites:
        "Only if the plan changes to lean on distribution in Year 1 — which it currently does not.",
      decisionExpiry: {
        label: "Revisit at Year-2 planning, or earlier if a trigger trips",
        why: "The next distributor line-review calendar is the natural re-entry point; before that, the acceptance costs nothing.",
      },
    },
    decision: {
      question: "Accept the distributor lockout for Year 1 — consciously, on the record, with tripwires?",
      deadline: "Now — acceptance is only worth something if it's written down before it's tested",
      defaultPath:
        "The risk lingers un-dispositioned on the register, and someone eventually spends a launch-quarter courting Rexel for a cell the plan never counted on.",
    },
    rationale: [
      {
        response: "ignore",
        verdict: "chosen",
        note: "Smallest exposure on the page, contested evidence, and the Year-1 plan already routes around the cell — acceptance with tripwires dominates.",
      },
      {
        response: "buy-information",
        verdict: "rejected",
        note: "A channel audit is real Delphi work — for the Year-2 entry decision, not for a cell Year 1 doesn't need.",
      },
      {
        response: "expert",
        verdict: "rejected",
        note: "A channel veteran would sharpen the review-calendar map; it still wouldn't change a plan that skips the channel.",
      },
      {
        response: "monitor",
        verdict: "rejected",
        note: "Full Argus instrumentation is overweight for €0.06M — the acceptance keeps two tripwires, which is monitoring at the right size.",
      },
      {
        response: "act",
        verdict: "rejected",
        note: "Private-label entry or review-cycle timing are Year-2 moves; acting now spends the launch on the wrong gate.",
      },
    ],
    artifact: {
      kind: "themis",
      acceptance:
        "The venture accepts distributor-channel foreclosure for the Year-1 horizon. The plan's revenue path (brownfield retrofit, direct) does not depend on distribution; the claim's own evidence is contested; and the cell re-opens at the next line-review calendar regardless of anything the venture does this year.",
      maxRegretNote:
        "Bounded by construction: if the cell stays fully shut, the forfeited Year-1 contribution is the distributor share of the funnel — about €0.21M of YAM at current levers (13% of €1.65M), against €0.06M expected. No tail beyond the cell itself.",
      revisitTriggers: [
        "A non-incumbent intelligent-PDU brand appears on a CE distributor line card (Rexel/Sonepar catalogs, Also/Ingram DC-infrastructure pages)",
        "Legrand announces exclusivity, rebate-tier or dual-brand bundling covering Raritan/Server Technology in EMEA",
      ],
      sunset: "Year-2 planning cycle — the acceptance expires with the next line-review calendar",
      signoff: "CRO owns the acceptance; Agent Argus owns the two tripwires",
    },
    projection: {
      ops: [],
      retirement: "bounds",
      note: "Acceptance retires nothing and pretends to retire nothing — it converts an unexamined exposure into a bounded, signed, tripwired decision. The model is unchanged; the organization isn't.",
    },
    evidence: [
      {
        title: "CMS Distribution expands its power and energy portfolio through a strategic partnership with Legrand",
        publisher: "CMS Distribution",
        url: "https://www.cmsdistribution.com/press-release/cms-distribution-expands-its-power-and-energy-portfolio-through-a-strategic-partnership-with-legrand",
        excerpt:
          "CMS already has an established relationship with Legrand as a distributor of Raritan... Raritan specialises in intelligent rack power distribution units (PDUs).",
        date: "2026-04-14",
      },
      {
        title: "Schleifenbauer Advanced PDUs Now Available at EDP Europe Distribution",
        publisher: "EDP Europe / Approved Business",
        url: "https://www.approvedbusiness.co.uk/articles/40679",
        excerpt: "EDP Europe is now an official distributor of Schleifenbauer's advanced, intelligent PDUs.",
        date: "2025-06-12",
      },
    ],
    asOf: "2026-07-13",
  },
];

export const memos: Memo[] = validateMemos(rawMemos, ledger, risks);
