import { ledger } from "@/lib/ledger";
import { risks } from "@/lib/risks";
import { validateMemos, type Memo } from "@/lib/nextStepsSchema";

// ─────────────────────────────────────────────────────────────────────────────
// Next Steps — the five memos (nextsteps.md). Five risks from the cycle-2
// register, one response each, executed by the Innovera toolkit
// (lib/toolkit.ts — four tools; "ignore" is Accept & watch, run by Argus).
// Authored from the cached research passes under research/raw/nextsteps/
// (report titles, prices, audit timelines and cost bands are cache facts,
// not guesses; anything softer is worded as an estimate). Every € figure on
// the surface is engine-computed at render time — this file carries
// narrative and projection ops only.
//
// Rewritten 2026-07-15 per the walkthrough feedback (next-steps.md items
// 20–26): the Act memo moved to the security-audit gate (the slow-buyer-gate
// thread's endpoint), stakes restructured to assumption → reality →
// consequence → clock, language pass: guide, don't sell.
// ─────────────────────────────────────────────────────────────────────────────

const rawMemos: Memo[] = [
  // ── 1 · Julius — ACT ────────────────────────────────────────────────────────
  // The slow-buyer-gate thread lands here: flagged in cycle 1, refuted-but-
  // mechanism-confirmed by the loop, re-surfaced quantified in cycle 2 —
  // answered by starting the audit clock before buyers do.
  {
    riskId: "risk.execution-window.firmware-security-audit-gate",
    response: "act",
    headline: "Start the audit clock before the first RFQ does",
    tableLine:
      "Big buyers run their own security audit before you can quote — each one takes a quarter or two.",
    stakes: {
      assumption:
        "The model assumes that once the product carries CE and TÜV marks, large operators can buy it — and the Year-1 plan counts on those buyers.",
      reality:
        "Each large operator runs its own security prequalification before a vendor may seriously quote: signed firmware, a software bill of materials, a vulnerability-disclosure process, audit evidence. From first contact to approved-vendor status typically takes three to nine months — and for standard RFQs it must finish before you can bid.",
      consequence:
        "Started only when the first RFQ arrives, the audit eats one to two quarters of a twelve-month selling year. The Year-1 number assumes a window that, for the biggest buyers, is only half open.",
      clock: {
        whenItBites:
          "The day the first serious RFQ arrives with a security questionnaire attached — from then on, every unprepared week is selling time lost.",
        whyNow:
          "Buyer audits run about two quarters. To be quotable by the target first-PO date, the audit artifacts have to exist before procurement asks for them.",
      },
    },
    decision: {
      question: "Start operator security prequalification now, before the first RFQ forces it?",
      deadline: "This quarter — the artifacts take a quarter to build, the buyer audits two more",
      defaultPath:
        "Wait for the first security questionnaire, then scramble: the first PO slips roughly two quarters, and Year 1 sells in a half-open window.",
    },
    rationale: [
      {
        response: "act",
        verdict: "chosen",
        note: "The gate is real; the only lever the venture controls is when the clock starts. Starting it now runs the audits parallel to the sales ramp instead of ahead of it.",
      },
      {
        response: "buy-information",
        verdict: "rejected",
        note: "No purchasable report shortens another company's audit queue — the useful information (a mock audit) is the charter's own first workstream.",
      },
      {
        response: "expert",
        verdict: "rejected",
        note: "An assessor hour sharpens the artifact list — worth booking inside workstream 1 — but judgment alone moves no calendar.",
      },
      {
        response: "monitor",
        verdict: "rejected",
        note: "Argus already watches questionnaire density in early RFQs; watching a queue you are not in only measures the delay.",
      },
      {
        response: "ignore",
        verdict: "rejected",
        note: "Accepting means a 45% chance the selling year halves — the largest actionable exposure left on the register.",
      },
    ],
    artifact: {
      kind: "julius",
      objective:
        "Be an approved vendor at two named operators before the first serious RFQ closes — turn the security gate from a surprise serial delay into a scheduled, parallel track.",
      workstreams: [
        {
          name: "Audit-artifact build",
          detail:
            "The four items every operator questionnaire asks for first: a signed-firmware release pipeline, an SBOM per product line, a public vulnerability-disclosure / PSIRT process, and a development file mapped to IEC 62443-4-1. Built once, reused at every gate — including the CRA.",
        },
        {
          name: "Mock audit",
          detail:
            "Run the venture through two target operators' published supplier-security requirements with a third-party assessor before any real audit — size the true listing lead time per account and fix findings while no deal is waiting.",
        },
        {
          name: "Mid-market bridge",
          detail:
            "Sequence first revenue through lighter-gated buyers — mid-market colocation and enterprise — while the operator audits run, so the selling year is not hostage to the slowest gate.",
        },
      ],
      milestones: [
        { when: "Day 30", what: "PSIRT / disclosure policy public; SBOM generation in the build" },
        { when: "Day 60", what: "Firmware signing live in the release pipeline" },
        { when: "Day 90", what: "Mock audit round 1 complete; findings triaged" },
        { when: "Day 180", what: "Prequalification dossiers filed at both target operators" },
        { when: "Day 270", what: "Approved-vendor status at one or more targets" },
      ],
      resourcing: "0.5–1 FTE security lead + firmware engineering time + external assessor days",
      budget:
        "≈ €150–250k in year one (62443-aligned process, signing pipeline, assessor days — cache-benchmarked); the full 62443-4-1 certificate (≈ €60–150k more) only if a named buyer demands it",
      leadingIndicators: [
        "Weeks from questionnaire receipt to complete response (target: under two)",
        "Mock-audit findings burn-down between round 1 and round 2",
        "Share of qualified pipeline in accounts whose gate is passed — or not required",
      ],
      killCriteria: [
        "Two target operators confirm CE + TÜV suffices for listing (the risk's own falsifier) — stand down to an Argus watch",
        "Mock audit shows a 12-month-plus queue at both targets — re-point Year 1 at the mid-market bridge and revisit the operator plan",
      ],
    },
    projection: {
      ops: [],
      likelihoodAfter: 0.2,
      retirement: "mitigates",
      note: "Acting doesn't move today's funnel — it moves the chance the gate bites. Prequalification started now runs parallel to the sales ramp instead of serial ahead of it: the 45% likelihood falls toward 20%, and the register re-prices on that projected chance, not on hope.",
    },
    evidence: [
      {
        title: "Security Guideline Product Security Sourcing Guide",
        publisher: "NERC",
        url: "https://www.nerc.com/globalassets/who-we-are/standing-committees/rstc/scs/product-security-sourcing-guide.pdf",
        excerpt:
          "Vendor-Level Risk Management ... Product Vulnerability Disclosure ... — the formal vendor security prequalification artifacts critical-infrastructure buyers require.",
        date: "2023-12-07",
      },
      {
        title: "Supply Chain Product Assurance Playbook (Schneider Electric)",
        publisher: "NIST / Schneider Electric",
        url: "https://csrc.nist.gov/csrc/media/Presentations/2024/supply-chain-product-assurance-playbook/images-media/20240918-FINAL%20CG%20SE%20September%202024%20SSCA%20Presentation%20v2.pdf",
        excerpt:
          "SBOMs generated for all products starting January 2021 and every product release is compliant to ISA/IEC 62443-4-1... certified to 4-1 Maturity Level 4 — the incumbents already carry the artifacts a new entrant must build.",
        date: "2024-09-18",
      },
      {
        title: "IEC 62443 certification schemes — registration and audit pricing",
        publisher: "ISASecure",
        url: "https://isasecure.org/certification/iec-62443-csa-certification",
        excerpt:
          "Certification registration fees in the USD 7,500–12,500 range plus annual maintenance — third-party ICS security certification pricing for component vendors (cost band per the cached research pass).",
      },
      {
        title: "Bridging the Gap: Navigating the Harmonization of IEC 62443 and the EU Cyber Resilience Act",
        publisher: "exida",
        url: "https://www.exida.com/Blog/bridging-the-gap-navigating-the-harmonization-of-iec-62443-and-the-eu-cyber-resilience-act",
        excerpt:
          "A credible component certification under 62443-4-2 with development-process certification under 62443-4-1 is a six-figure investment for a mid-sized vendor — the same artifact stack the CRA will lean on.",
      },
    ],
    asOf: "2026-07-15",
  },

  // ── 2 · Egeria — SPEAK TO AN EXPERT ─────────────────────────────────────────
  {
    riskId: "risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window",
    response: "expert",
    headline: "One hour with a conformity assessor beats a quarter of guessing",
    tableLine:
      "EU law fixes the compliance dates; whether your PDU needs a third-party assessor is a judgment call no report makes.",
    stakes: {
      assumption:
        "The model assumes the product reaches EU buyers on self-declared CE conformity — the route the team can run on its own.",
      reality:
        "The Cyber Resilience Act is enacted law with dates inside the entry window: reporting duties from 11 September 2026, full conformity from 11 December 2027. What the regulation's text does not settle is whether a remote-management PDU lands in the default class (self-declaration) or Annex III 'important' — which forces a notified body into the calendar. Re-reading the regulation will not answer that; it is a classification judgment, and the people who make it professionally are assessors, not reports.",
      consequence:
        "Guess wrong toward self-declaration, and a 2027 audit — or a lost 2026 bid — discovers it mid-launch as a compliance-file re-spin. Guess wrong toward the notified body, and two quarters and six figures go into an assessment the product never needed.",
      clock: {
        whenItBites:
          "The first tenders writing CRA / SBOM clauses — buyer front-running is already visible in 2026 bids.",
        whyNow:
          "The conformity route changes the artifact list and the test calendar. After the launch-firmware design freeze, a wrong guess costs a re-spin instead of a meeting.",
      },
    },
    decision: {
      question:
        "Book the CRA classification session and lock the conformity route before design freeze?",
      deadline: "Inside the month — assessor calendars and design freeze are both clocks",
      defaultPath:
        "The team guesses 'default class', builds to self-declaration, and finds out in a 2027 audit — or a lost 2026 bid — that a notified body was required all along.",
    },
    rationale: [
      {
        response: "expert",
        verdict: "chosen",
        note: "The open question is classification judgment, not data — a practitioner who has classified rack power under RED, MID and now the CRA decides this weekly.",
      },
      {
        response: "buy-information",
        verdict: "rejected",
        note: "No purchasable report rules on YOUR product's class; regulatory guides restate the regulation the team has already read.",
      },
      {
        response: "monitor",
        verdict: "rejected",
        note: "Harmonised-standards progress is worth watching (Argus has the docket), but waiting does not decide the route before design freeze.",
      },
      {
        response: "act",
        verdict: "rejected",
        note: "Building the full notified-body artifact stack 'just in case' spends two quarters on a question one call can settle.",
      },
      {
        response: "ignore",
        verdict: "rejected",
        note: "Enacted law with dates inside the entry window is the definition of non-ignorable.",
      },
    ],
    artifact: {
      kind: "egeria",
      caseSummary: {
        known: "CRA dates and obligations are enacted EU law",
        unknown: "Default class or Annex III for a remote-management rack PDU?",
        consequence: "A wrong route burns two quarters or discovers a compliance gap mid-launch",
        action: "Get an assessor's classification judgment before firmware design freeze",
      },
      network: {
        benchSize: 1000,
        availability: "Advisory slots available this week",
      },
      profile: {
        name: "Dr. Anneke Vos",
        title: "Independent conformity strategist — EU product security",
        location: "Rotterdam, Netherlands",
        portrait: "/experts/anneke-vos.png",
        disclosure:
          "Illustrative demo profile — representative of experts available through the Egeria network.",
        background: [
          "Fifteen years at a German notified body, finishing as lead assessor for connected infrastructure — industrial controllers, smart metering, rack power",
          "Member of the CEN/CENELEC JTC 13 working group drafting the CRA harmonised standards (M/606 work programme)",
          "Ran RED and MID conformity programs for two European power-equipment manufacturers before going independent",
        ],
        expertise: [
          "CRA classification",
          "RED / MID conformity",
          "Notified-body audits",
          "CEN/CENELEC JTC 13",
          "Secure-development files",
        ],
        engagement: "1-hour advisory session · follow-up memo included · via Egeria",
      },
      matchReasons: [
        {
          label: "The exact judgment",
          proof:
            "Classifies connected industrial products under EU conformity routes — the question the regulation itself cannot answer for this PDU.",
        },
        {
          label: "The exact product context",
          proof:
            "Led notified-body assessments across connected infrastructure, including rack power and smart metering.",
        },
        {
          label: "The standards clock",
          proof:
            "Works inside the JTC 13 programme drafting the CRA harmonised standards the launch plan is waiting on.",
        },
      ],
      alternates: [
        {
          name: "Marek Lindqvist",
          title: "Former EUCC evaluation-lab director, now CRA notified-body advisor",
          location: "Munich, Germany",
          why: "Closest to the audit chair — if the session's answer is 'Annex III', he has run the assessments the product would face. The follow-up call, not the first one.",
        },
        {
          name: "Dr. Ilaria Benetti",
          title: "Product-security lead at a mid-size industrial power OEM",
          location: "Milan, Italy",
          why: "The practitioner's view: how a vendor this size actually sequenced CE, RED and CRA artifacts without serializing the calendar.",
        },
        {
          name: "Sofie Andersen",
          title: "Standards liaison, CRA requirements-mapping work",
          location: "Brussels, Belgium",
          why: "If the blocker turns out to be harmonised-standards timing rather than classification, she tracks the JTC 13 docket weekly.",
        },
      ],
      emailDraft: {
        to: "a.vos@egeria.innovera.network",
        subject: "CRA classification session — remote-management rack PDU",
        intro:
          "Dear Dr. Vos,\n\nWe are preparing an EU market entry for an intelligent rack PDU with remote management, and need a classification judgment under the Cyber Resilience Act before our firmware design freeze. Ahead of a session, the questions we would put to you:",
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
            "Parallel tracks protect the selling window the security-audit-gate risk already threatens.",
        },
        {
          question:
            "Which CRA harmonised standards will cite by mid-2026, and does slippage change the route?",
          nodeId: "serviceableFactor",
          moves:
            "Standards slippage raises the odds buyers demand third-party proof — an early warning that goes straight to Argus.",
        },
      ],
      deliverable:
        "A one-page conformity-route memo — class, route, artifact list, test calendar — folded into the register within the week; the CRA risk's likelihood re-scored on an assessor's judgment instead of a founder's reading.",
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
      {
        title: "CEN, CENELEC and ETSI Work Programme M/606 — Cyber Resilience Act",
        publisher: "CEN/CENELEC",
        url: "https://www.cencenelec.eu/media/CEN-CENELEC/News/Newsletters/2025/m_606_work_programme_final.pdf",
        excerpt:
          "M/606 — planning for standard development: the harmonised standards that will carry CRA presumption of conformity, deadlines running through 2026–2027.",
      },
      {
        title: "CRA Conformity Assessment: Notified Bodies vs Standards Gap",
        publisher: "CRA Facts",
        url: "https://cra-facts.com/blog/cra-conformity-assessment-notified-bodies-standards-gap",
        excerpt:
          "Notified-body designations are still being rolled out through 2026 — manufacturers must verify CRA notification via NANDO before relying on a body for third-party assessment.",
      },
    ],
    asOf: "2026-07-15",
  },

  // ── 3 · Argus — MONITOR ─────────────────────────────────────────────────────
  {
    riskId: "risk.competitive-foreclosure.framework-agreements-close-first-buyer",
    response: "monitor",
    headline: "Nothing to buy, no one to ask — only time settles it. Argus watches.",
    tableLine:
      "Big operators sign multi-year framework deals that quietly remove tenders from the market.",
    stakes: {
      assumption:
        "The model gives large operators 40% of buyer spend and names them the first buyer — an open market the venture can tender into.",
      reality:
        "Operators of that size increasingly buy rack power through multi-year framework agreements — the Digital Realty–Schneider $373M supply-capacity agreement is the template — which remove tenders from the market for their whole term. Whether most of that 40% is already locked is not knowable today from any report or call: the evidence is genuinely contested, and the settle-test is the next twelve months of tender behavior itself.",
      consequence:
        "If the frameworks have quietly closed the first-buyer pool, the Year-1 account plan is built on tenders that will never be published — and every lost quarter reads as slow sales rather than a foreclosed market.",
      clock: {
        whenItBites:
          "Continuously across Year 1 — every framework renewal quietly shrinks the open market before any tender is visibly lost.",
        whyNow:
          "No decision is due today — which is exactly why the correct move is to instrument the question before the account plans commit, not after.",
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
        note: "Procurement leads can describe framework norms, but cannot reveal confidential term coverage — the one number that matters.",
      },
      {
        response: "act",
        verdict: "rejected",
        note: "Re-planning the beachhead on contested evidence overreacts — the Julius charter's mid-market bridge already decorrelates first revenue from the slowest accounts.",
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
        "Threshold trip → alert to the deal owner and automatic register re-price. Two trips in one quarter → convene a first-buyer re-plan and pull the Julius charter's mid-market bridge forward.",
      alsoWatching: [
        {
          signal: "CRA harmonised-standards calendar and national implementing acts in the launch countries",
          feed: "EUR-Lex · CEN/CENELEC JTC 13 docket · Bundestag and Tweede Kamer legislative trackers — new legislation captured the day it is tabled",
        },
        {
          signal: "The Accept & watch memo's two tripwires (distributor line cards, Legrand exclusivity moves)",
          feed: "Rexel / Sonepar catalogs · Legrand EMEA announcements",
        },
        {
          signal: "Security-questionnaire density in early RFQs (the Julius charter's leading indicator)",
          feed: "The venture's own RFQ intake, logged weekly",
        },
      ],
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
    asOf: "2026-07-15",
  },

  // ── 4 · Delphi — BUY INFORMATION (the template memo) ────────────────────────
  {
    riskId: "risk.definition-scopedown.band-top-contaminated-comparator",
    response: "buy-information",
    headline: "Buy the report before you re-argue the number",
    tableLine:
      "The market-base ceiling rests on a report that measured a much bigger category — a purchasable dataset settles it.",
    stakes: {
      assumption:
        "The model caps the market base at €360M — the ceiling the whole funnel hangs from.",
      reality:
        "The growth rate used to justify that cap came from a €8.5–9.5B power-and-cable-management report covering far more than rack PDUs, so the scope-down may have imported the very contamination it was meant to remove. Germany-alone forecasts and the upper global anchors point above the band.",
      consequence:
        "If the true base sits at €400M+, certification scope, channel hires and contract-manufacturing volumes are being sized for the wrong market. This is the rare register finding whose surprise may be UPSIDE — and the only one a purchasable dataset settles outright.",
      clock: {
        whenItBites:
          "At the next planning gate — a mis-sized base compounds through certification scope, hiring and CM volume commitments before a single unit ships.",
        whyNow:
          "The report is worth €30M of resolved TAM uncertainty today; after capacity is committed, the same answer is trivia.",
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
          scope:
            "You'll learn the EU rack-PDU market size with country tables — the exact denominator the model needs, plus a re-sourced Germany share",
          price: "$4,000 single-user (store-listed)",
          delivery: "Digital report, immediate",
          settles: ["tamBase", "geo.DE"],
          url: "https://www.indexbox.io/store/european-union-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
          note: "The ledger's own promotion path for the market base — named in the risk's settle-test.",
        },
        {
          title: "Intelligent Rack PDUs Market in the European Union",
          vendor: "IndexBox",
          scope:
            "You'll learn how much of that base is intelligent PDUs — the slice the product actually sells into",
          price: "$4,000 single-user (store-listed)",
          delivery: "Digital report, immediate",
          settles: ["tamBase"],
          url: "https://www.indexbox.io/store/european-union-intelligent-rack-pdus-market-analysis-forecast-size-trends-and-insights/",
          note: "Bought together with the EU report, the same desk order also settles register finding #7 — 'base counts basic PDUs the venture cannot sell'.",
        },
        {
          title: "Rack PDU Market Tracker — 2025",
          vendor: "Omdia (Informa Tech)",
          scope:
            "You'll learn who ships how much — vendor shipment shares that cross-check the concentration figure",
          price: "Omdia subscription · quote on access",
          delivery: "Tracker access on subscription",
          settles: ["tamBase", "shape.cr3"],
          url: "https://omdia.tech.informa.com/om129351/rack-pdu-market-tracker--2025",
          note: "Also re-sources the top-3 concentration figure the shape strip currently carries unsourced.",
        },
        {
          title: "Data Center Rack Power Distribution Unit (PDU) Market, 2026–2031",
          vendor: "Mordor Intelligence",
          scope:
            "You'll learn the global base and growth rate — the outer anchor for the Europe share hop",
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
    asOf: "2026-07-15",
  },

  // ── 5 · Accept & watch (Argus-executed) — IGNORE ───────────────────────────
  {
    riskId: "risk.competitive-foreclosure.distributor-line-review-lockout",
    response: "ignore",
    headline: "Safely ignorable this year — and Argus has the watch",
    tableLine:
      "Distributors review their line cards once a year and the incumbent owns both big PDU brands — but Year 1 doesn't route through them.",
    stakes: {
      assumption:
        "The model counts the distributor cell at 13% of buyer spend — reachable like the rest of the funnel.",
      reality:
        "Annual line reviews plus Legrand's ownership of both incumbent intelligent-PDU brands may keep that cell shut for exactly the twelve months Year 1 measures. The evidence is contested — three 2025–26 cases show European distributors onboarding new PDU vendors mid-cycle.",
      consequence:
        "The danger is not the risk landing; it is burning scarce launch capacity fighting a gate the Year-1 plan does not need opened. Fully shut, the cell forfeits about €0.21M of Year-1 revenue at current levers — against €0.06M expected.",
      clock: {
        whenItBites:
          "Only if the plan changes to lean on distribution in Year 1 — which it currently does not.",
        whyNow:
          "Acceptance is only worth something if it is written down before it is tested; the next line-review calendar is the natural re-entry point.",
      },
    },
    decision: {
      question: "Accept the distributor lockout for Year 1 — consciously, on the record, with tripwires?",
      deadline: "Now — before anyone spends a launch-quarter courting a channel the plan never counted on",
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
      kind: "acceptance",
      acceptance:
        "The venture accepts distributor-channel foreclosure for the Year-1 horizon. The Year-1 revenue path is direct and does not depend on distribution; the claim's own evidence is contested; and the cell re-opens at the next line-review calendar regardless of anything the venture does this year.",
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
    asOf: "2026-07-15",
  },
];

export const memos: Memo[] = validateMemos(rawMemos, ledger, risks);
