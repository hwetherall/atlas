// ─────────────────────────────────────────────────────────────────────────────
// Risk pipeline — the plan. EVERY iteration knob lives here so tuning quality
// (after a review pass) never touches the harness in scripts/risks.mjs:
// lens briefs, quotas, the anti-genericity contract, banned genres, the gold
// exemplar, evidence-query counts, rubric anchors, kill thresholds, ranking.
//
// The pipeline's thesis: insight quality comes from a COMPILER, not a clever
// prompt. A risk that cannot name funnel-active ledger nodes and a
// machine-checkable perturbation is rejected before any human sees it.
// ─────────────────────────────────────────────────────────────────────────────

export const SEED = 1707; // judge shuffle seed — recorded in the manifest

export const COUNTS = {
  hypothesesPerLensMin: 4,
  hypothesesPerLensMax: 6,
  evidenceQueriesPerRisk: 3,
  exaResultsPerQuery: 5,
  evidenceItemsMax: 3, // attached per risk after adjudication
  emitTop: 15, // risks on the two boards; the rest go to the appendix
};

// ── How perturbations work (shown to hunters verbatim) ───────────────────────

export const PERTURBATION_SEMANTICS = `
HOW YOUR CLAIM BECOMES A NUMBER (the perturbation contract):
- You never state € impacts. You emit machine-readable ops; the engine computes
  ΔTAM/ΔSAM/ΔYAM by re-running the real funnel. Any € figure you write in prose
  will be stripped.
- Ops: {nodeId, op: "set"|"scale"|"add", value} rewrite one leaf's value;
  {nodeId, op: "exclude"} removes a dimension cell from the venture's reachable
  scope ("unavailable to us" — foreclosure), which is different from shrinking it.
- Ops apply in array order. Ratio nodes must stay inside [0,1]; tamBase must stay > 0.
- Only FUNNEL-ACTIVE nodes may be perturbed (marked in the ledger you receive).
  shape.cagr and shape.cr3 are context — a demand-pace or concentration risk must
  be translated into the funnel nodes it would actually move (tamBase level,
  serviceableFactor reach, obtainableFactor pace, or a share).
- Sibling shares are NOT re-normalized when you move one share (documented v1
  simplification). If you mean a mix-SHIFT, perturb multiple siblings; if you
  mean "this slice is smaller in absolute terms", one op is correct.
- Perturbing an assumption leaf overrides whatever the user set: your claim is
  about the world, not about their slider.
`.trim();

// ── Banned output (the genre filter, stated up front) ────────────────────────

export const BANNED_GENRES = [
  `"Find 2 customers to talk to and get an LOI" — an action item, not a risk. It names no node, no mechanism, no falsifier.`,
  `"Do research on customer buying behaviour" — a homework assignment any consultant could write for any company.`,
  `"Competition is strong / the market is concentrated" — the ledger already states CR3. Restating a fact is not a risk; the risk is a MECHANISM that concentration enables.`,
  `"The market may be smaller than expected" — the tamBase band (240–520) already says this. Only worth saying if you name WHICH derivation hop fails and WHY.`,
  `"Regulatory changes could impact the business" — name the instrument, the compliance artifact it requires, and the date it lands, or drop it.`,
  `"The band's low end might be true" with no new reason — the band is already in the model; you are paid for what is NOT in the model.`,
];

// Patterns Harry has explicitly rejected in past review passes. Append here
// after each review; they are injected next to BANNED_GENRES on the next hunt.
export const REJECTED_PATTERNS = [];

// ── The hunter contract (anti-genericity, schema-level) ──────────────────────

export const HUNTER_CONTRACT = `
YOUR ROLE: You are the partner running a pre-mortem on this market model for a
paying client. The client's own team has already read every number in the
ledger, including every sensitivity band. Your reputation rests on surfacing
what THEY would not list: risks that look benign on the surface but could kill
the venture, argued mechanistically, anchored in the model.

HARD REQUIREMENTS — a hypothesis that misses any of these will be rejected by
a validator before any human reads it:
1. targetNodes: real ledger node ids; perturbation ops only on FUNNEL-ACTIVE nodes.
2. mechanism: at least 3 steps (trigger → propagation → model impact), EVERY
   step carrying refs — "ledger:<nodeId>", "digest:<group>#c<n>", or
   "profile:<field>". A step you cannot reference is a step you are guessing.
3. falsifier: the single concrete observation that would kill this risk. If you
   cannot name one, it is not a claim.
4. whyMissable: why a competent founder's own risk list omits this. "It's
   non-obvious" is not an argument; name the surface appearance that hides it.
5. likelihood: a probability with a basis ("evidence" | "base-rate" |
   "judgment") and a rationale. No naked numbers.
6. indicators: at least 2 observable early warnings, each with WHERE to watch
   (a named tender portal, an operator's capex call, a standards docket, a
   vendor's price list) and the reading that should trigger re-assessment.
7. mitigations: at least 2. Where the right move is to buy information, use
   type "information" and name the ledger node it de-risks (voiNodeId) — its
   value will be computed, not asserted.

QUOTAS (per lens): at least one hypothesis self-tagged expectedObviousness
"low", and at least one whose perturbation targets NONE of tamBase /
serviceableFactor / obtainableFactor — the tornado already covers those bands;
look past them.

MINE THE RESIDUALS: the highest-yield material is where sources disagree with
the curated value (the digests' "tensions"), where searches came back empty
(the digests' "absences" — an unquantified market is a risk, not a comfort),
where a derivation's crossCheck diverges from its primary method, and where a
precise-looking value carries maturity "needs-source".
`.trim();

// ── The gold exemplar — one fully-worked hypothesis at the target register ────

export const GOLD_EXEMPLAR = {
  id: "busway-hollowing-hyperscale",
  title: "Busway + OCP power shelves hollow out the hyperscale 44% from inside the scope boundary",
  narrative:
    "The model excludes busbars and power shelves as out-of-scope substitutes — a scoping footnote. But hyperscale is 44% of TAM, and it is precisely the segment whose new AI-density builds are moving power distribution from rack PDUs to overhead busway feeding OCP-style in-rack power shelves. If that architecture becomes the default for new CE hyperscale capacity, the largest slice of this TAM is not 'ours to win slowly' — it is structurally shrinking while the headline number stays flat. The exclusion list quietly became the market thesis.",
  category: "boundary",
  targetNodes: ["seg.hyperscale"],
  mechanism: [
    {
      step: "trigger",
      text: "New hyperscale AI-density builds adopt busway + in-rack DC power shelves instead of discrete rack PDUs",
      refs: ["digest:seg-mix#c?", "ledger:seg.hyperscale"],
    },
    {
      step: "propagation",
      text: "CE hyperscale capacity additions (the growth the 9% CAGR is made of) carry falling rack-PDU content per MW; replacement demand in legacy halls does not offset it",
      refs: ["ledger:shape.cagr", "digest:tam-base#c?"],
    },
    {
      step: "model-impact",
      text: "The hyperscale share of the rack-PDU market shrinks in absolute terms — seg.hyperscale 0.44 overstates the addressable slice for a new entrant's window",
      refs: ["ledger:seg.hyperscale"],
    },
  ],
  whyMissable:
    "Substitutes were explicitly considered and excluded — the boundary decision looks handled. The kill path is not 'we misjudged the boundary' but 'the boundary moved into the biggest segment while the TAM base year stayed put'.",
  expectedObviousness: "low",
  falsifier:
    "2025–26 CE hyperscale fit-out specs (or Schneider/Vertiv rack-power order mixes) showing intelligent rack PDUs holding share in new AI-density halls.",
  likelihood: {
    value: 0.35,
    rationale:
      "OCP power-shelf adoption is documented for AI racks, but CE colocation and enterprise retrofits (56% of TAM) keep buying rack PDUs; timing within a 12-month window is uncertain.",
    basis: "evidence",
  },
  perturbation: [{ nodeId: "seg.hyperscale", op: "set", value: 0.22, note: "≈half of the hyperscale slice migrates to busway/shelf architectures" }],
  indicators: [
    {
      signal: "Rack-power architecture specified in new CE hyperscale tenders (busway/shelf vs PDU)",
      where: "Frankfurt/Amsterdam data-center fit-out tenders; OCP regional summit deployment talks",
      threshold: "≥2 flagship CE builds specifying shelf-based distribution",
      updates: "increases",
    },
    {
      signal: "Incumbent rack-PDU revenue mix commentary (Vertiv/Schneider earnings)",
      where: "Quarterly earnings calls, rack-power product-line commentary",
      threshold: "PDU line flat while busway line grows double-digit",
      updates: "increases",
    },
  ],
  mitigations: [
    {
      action: "Commission a CE rack-power architecture survey across the 2026 hyperscale build pipeline",
      type: "information",
      voiNodeId: "seg.hyperscale",
    },
    {
      action: "Qualify the product line for colocation/enterprise retrofit first, where PDU form-factor is sticky",
      type: "strategic",
    },
  ],
};

// ── The 8 hunter lenses ───────────────────────────────────────────────────────
// Each lens = a distinct way of looking under rocks, tuned to THIS case.
// digests: which stage-1 digest groups the lens receives (all lenses also get
// the cross-corpus synthesis).

export const LENSES = [
  {
    id: "structure-independence",
    title: "The model lies about correlation",
    brief: `
The funnel multiplies scope factors as if geography × segment × customerType
were independent. The design doc admits this is an approximation and says
"where it's false it is itself a risk". Attack the joint distribution:
- DE = 0.50 of geography and hyperscale = 0.44 of segment. Multiplying assumes
  hyperscale's share is identical inside Germany — but German capacity is
  dominated by a few Frankfurt campuses whose owners procure on GLOBAL
  framework agreements. The venture's declared first target (profile: sell to
  Large operators first) may sit exactly in the cell that is least reachable.
- Denominator mixing: geography shares were apportioned on COLOCATION MW
  (Statista), but the segment axis includes enterprise on-prem. The geo weights
  are wrong for the enterprise slice by construction — which cells does that
  inflate?
Express intersection emptiness with 'exclude' ops or compound share sets; say
which cell is phantom and why.`.trim(),
    digests: ["geo-region-denominator", "seg-mix", "cust-mix"],
    stems: [
      "Which cell of the geography × segment × buyer cube is mostly phantom, and what fact makes it so?",
      "Where does the colo-MW denominator misprice a share that the funnel then multiplies?",
    ],
  },
  {
    id: "definition-scopedown",
    title: "Which hop of the derivation chain is rotten",
    brief: `
tamBase (€320M) is a 3-hop scope-down: global rack-PDU $2.81B (Grand View) ×
Europe ≈30% (inferred from "NA = 38%", not stated by any source) × CE-7 = 39.8%
of Europe COLO MW, with an FX hop. The crossCheck ceiling multiplies BIS's
€2.45B "PDUs + PSUs" by an unsourced "~55% PDU share". Each hop imports a
definition nobody has audited:
- Does Grand View's "rack PDU" include basic/metered-only units the venture
  doesn't sell, inflating the intelligent-PDU-relevant base?
- Is Europe 30%, or do corpus claims put it at 22–25%?
- Is CE per-MW PDU intensity actually equal to the Europe average (older stock,
  lower rack density)?
Name the hop, the imported definition, and the corrected value it implies.`.trim(),
    digests: ["tam-base", "tam-global-crosscheck", "geo-region-denominator"],
    stems: [
      "Which single definitional mismatch, if real, moves tamBase the most?",
      "What does the source actually count that the model assumes it doesn't (or vice versa)?",
    ],
  },
  {
    id: "boundary-substitution",
    title: "The excluded substitutes eat the biggest segment",
    brief: `
BOUNDARY_EXCLUSIONS removes busbars, busways and power shelves as out-of-scope.
But hyperscale is 44% of TAM and is precisely the segment moving to overhead
busway + OCP in-rack power shelves + high-voltage DC for AI-density racks;
liquid cooling changes the rack power envelope again. Hunt the ways the
boundary decision becomes the market thesis: which slice of the modeled market
is structurally migrating OUT of the product category during exactly the
venture's entry window? (The gold exemplar is from this lens — do not repeat
it; find the variants: colocation following hyperscale specs, liquid-cooling
retrofits, DC-native builds.)`.trim(),
    digests: ["tam-base", "seg-mix", "cr3-vendors"],
    stems: [
      "Which excluded substitute is growing INSIDE the modeled segments, and at what displacement rate?",
      "Whose roadmap (operator or incumbent vendor) makes the substitution self-fulfilling?",
    ],
  },
  {
    id: "demand-discontinuity",
    title: "The 12-month window opens onto a construction pause",
    brief: `
shape.cagr (9%) is trend consensus, but CE demand is spiky and gated: Dutch
grid congestion and the Amsterdam moratorium legacy, Frankfurt grid-connection
queues, German EnEfG efficiency mandates, AI capex digestion cycles. YAM is a
FIRST-12-MONTHS number: if 2026–27 CE capacity additions slip right, year-1
orders slip with them regardless of the 2030 trend. Remember: shape.cagr is
context, not funnel-active — a demand-pace risk must compile to tamBase (level)
and/or obtainableFactor (pace). Name the gating mechanism, the geography it
binds, and the slip it implies.`.trim(),
    digests: ["geo-DE", "geo-NL", "tam-global-crosscheck", "seg-mix"],
    stems: [
      "Which named grid/permitting/capex gate could push CE 2026 capacity additions right, and by how much?",
      "What makes year-1 demand lumpier than the CAGR suggests?",
    ],
  },
  {
    id: "competitive-foreclosure",
    title: "CR3 0.55 doesn't just compete — it forecloses",
    brief: `
Schneider (≈15.8% #1), Vertiv, Eaton — plus Legrand owning Raritan AND Server
Technology, the intelligent-PDU incumbents specifically. Concentration is in
the ledger; the RISK is the mechanisms it enables:
- Hyperscalers and large colos buy rack power on global/annual framework
  agreements a CE entrant cannot intercept locally → the venture's declared
  first buyer (profile: Large operators) may be contractually closed, not just
  competitive.
- Distributors run annual line reviews with exclusivity terms; an entrant
  arrives mid-cycle.
- Incumbents can bundle PDUs at near-zero margin inside busway + rack + cooling
  packages the entrant can't match.
Express foreclosure with 'exclude' ops on buyer cells or serviceableFactor /
obtainableFactor cuts; name the contractual instrument doing the closing.`.trim(),
    digests: ["cr3-vendors", "cust-mix", "obtainable-benchmark"],
    stems: [
      "Which buyer cell is closed by contract structure rather than by competition?",
      "What bundling or line-review mechanism prices the entrant out before a bake-off happens?",
    ],
  },
  {
    id: "regulatory-gauntlet",
    title: "Name the directive, date the delay",
    brief: `
An INTELLIGENT (networked) PDU is a product-with-digital-elements. On top of
LVD/EMC CE-marking, EN 62368-1 safety, RoHS/REACH: the EU Cyber Resilience Act
obligations land 2026–27 — inside or overlapping the venture's first 12 months.
German buyers add TÜV expectations; EN 50600 shapes the ecosystem; EnEfG
reporting spills onto vendors. The serviceableFactor evidence already admits
the cert stack "justifies <1.0 but doesn't quantify 0.55". Hunt risks with a
NAMED instrument, the compliance artifact it demands, and a date that
collides with the entry window. Compile to serviceableFactor (reach) and/or
obtainableFactor (timing).`.trim(),
    digests: ["serviceable-benchmark", "geo-DE"],
    stems: [
      "Which instrument's conformity clock, started today, ends after the YAM window closes?",
      "Which buyer-side procurement norm (not law) silently requires a cert the entrant lacks?",
    ],
  },
  {
    id: "base-rate-analogy",
    title: "What killed the reference class",
    brief: `
Outside view. The reference class: industrial entrants into data-center
infrastructure hardware (Asian PDU makers entering the EU channel, adjacent
industrial-electrical firms entering DC). Base rates the ledger gestures at
but doesn't price:
- Enterprise/DC hardware sales cycles run 12–18 months against a 12-month YAM
  window; certification alone runs 6–9.
- obtainableFactor 0.03 sits MID-band of generic SOM benchmarks that the node's
  own provenance admits are "not DC-hardware-specific". For a pre-launch
  entrant with zero installed base and no certs on day 0, the honest year-1
  number may be pilots ≈ 0.005–0.01.
- Distributor onboarding is an annual cycle (profile says horizon =
  Conservative ramp — is 0.03 actually conservative?).
Anchor every claim in a reference-class fact, not a vibe.`.trim(),
    digests: ["obtainable-benchmark", "serviceable-benchmark", "cr3-vendors"],
    stems: [
      "What is the base-rate year-1 share for a comparable entrant, and what made the successful ones different?",
      "Which step of the entry sequence (cert → listing → pilot → PO) doesn't fit inside 12 months?",
    ],
  },
  {
    id: "ledger-self-audit",
    title: "Strike the number a hostile diligence partner strikes first",
    brief: `
You get every digest's tensions and absences. Hunt CURATION risk — where the
ledger's own construction hides fragility:
- cust.* shares (40/25/22/13) are maturity "needs-source" internal estimates
  carrying two-decimal precision with almost no bands.
- The PL share: colo-MW vs installed-MW scopes diverge ~1.5×.
- CH looks self-operation-heavy; the 0.08 may import the wrong buyer structure.
- Normalizing shares to sum 1.00 launders scope mismatch across the axis.
Which single curated value, struck and rewritten from the corpus, most changes
the answer — and what does the corpus say it should be?`.trim(),
    digests: [
      "cust-mix",
      "geo-PL",
      "geo-alpine",
      "geo-CZ-other",
      "geo-region-denominator",
      "seg-edge-telecom",
    ],
    stems: [
      "Which needs-source value is doing load-bearing work, and what would a hostile reviewer replace it with?",
      "Where does normalization hide a scope mismatch between siblings?",
    ],
  },
  {
    id: "execution-window",
    title: "Pre-launch physics vs the Year-1 clock",
    brief: `
The venture is PRE-LAUNCH (profile: Stage = Pre-launch · first 12 months).
YAM assumes the year-1 machine exists on day 1. Hunt the sequencing risks
between the model's clock and the venture's:
- serviceableFactor bundles channel + regulatory reach as a static 0.55, but
  reach is BUILT during the same 12 months it is supposed to be harvested.
- A conservative ramp (profile answer) with a 2-quarter cert/listing delay
  doesn't scale YAM linearly — it can zero the first half.
- Intelligent PDUs need firmware/security update infrastructure buyers audit
  BEFORE listing; that gate precedes every sale and appears nowhere in the
  funnel.
Compile timing collapses to obtainableFactor; reach shortfalls to
serviceableFactor. Name the gate and its clock.`.trim(),
    digests: ["obtainable-benchmark", "serviceable-benchmark", "cust-mix"],
    stems: [
      "Which gate must open before the first PO, and how long does it historically take?",
      "What does 'conservative ramp' actually mean in months-to-first-revenue for this product class?",
    ],
  },
];

// ── Editorial style (the polish stage; also shown to hunters) ────────────────
// Harry's bar: "clarity and brevity are prized by me, and busy executives.
// Don't dumb it down, make it clearer." Clarity is precision, not softness.

export const STYLE = `
You are writing for a busy executive who will read 27 of these in one sitting.
Rules:
- TITLE: one idea, ≤ 75 characters, plain words. Name the thing and the
  direction it moves. Banned words: scope-down, denominator, normalization,
  launder, phantom, semantics, conflate, misallocation, apportion.
- NARRATIVE: 2–4 short sentences, in this shape: (1) what the model assumes,
  (2) what we found instead — keep the single most important number,
  (3) what it means for the Year-1 number. At most one number per sentence.
  No parentheticals, no em-dash chains, no nested clauses.
- MECHANISM steps: ≤ 12 words each, plain verbs, no jargon.
- WHY-MISSABLE and FALSIFIER: one sentence each.
- LIKELIHOOD RATIONALE: ≤ 2 sentences.
- Keep every fact, name, number and date that carries the argument; cut
  everything else. Never soften, hedge, or add new claims or numbers.

WORKED EXAMPLE of the target register:
BEFORE: "The obtainableFactor was 'triangulated' from generic SOM heuristics —
but the benchmark sources themselves disagree on what period the percentage
describes. Wise defines SOM as a 3–5-year capture window; Prospeo and IdeaPlan
frame 1–3 years. Applied to a single pre-launch year, the same literature
implies numbers an order of magnitude lower..."
AFTER: "The model says the venture can win 3% of its serviceable market in
Year 1. But the benchmarks that 3% comes from describe what companies capture
over 3–5 years, not 12 months. The one comparable hardware entrant we found
started far lower in its first year. If the clock is wrong, the Year-1 number
is several times too high."
`.trim();

// ── The settle-it test (the classify stage) ──────────────────────────────────
// Splits the register into ERRORS (reducible: the model's number is wrong
// today, research fixes it) and RISKS (irreducible for now: the world hasn't
// decided; you monitor and mitigate). Errors feed the fact-bank refinement
// loop; risks stay on the register.

export const CLASSIFY_TEST = `
THE TEST: Name the artifact that would SETTLE this claim — not inform it,
settle it. If a purchasable report, an existing dataset, or a week of expert
calls would settle it, the claim is an ERROR: our model of the world is wrong
today and research fixes it. If only time settles it (a market shift that
hasn't happened, a rival's response, a demand gate that may or may not bind),
it is a RISK.

Guidance:
- "The number is X, not Y" claims about TODAY's market are errors
  (market size, shares, definitions, scope mismatches, benchmark misuse).
- Claims about how the next 12–24 months UNFOLD are risks
  (substitution pace, foreclosure, construction slips, price responses).
- Mixed claims: classify by the load-bearing part. If correcting today's
  number removes most of the expected loss, it is an error.
- For an ERROR, propose the concrete correction the evidence implies
  (nodeId, corrected value, band, one-sentence rationale) and 2 targeted
  research queries (one confirming, one falsifying) with concrete entities.
- Do NOT propose corrections for risks; their perturbation already expresses
  the scenario.
`.trim();

// ── The judge rubric (blind scoring, 0–4 per dimension) ──────────────────────

export const RUBRIC = {
  dimensions: [
    {
      key: "specificity",
      label: "Specificity",
      anchor0: `"The market may be smaller than expected" — no nodes, no numbers, no actors.`,
      anchor4: `Names ledger nodes, values, actors, instruments and dates: "CRA conformity for networked PDUs lands 2026-27, inside the 12-month YAM window, gating cust.operator-large listings".`,
    },
    {
      key: "nonObviousness",
      label: "Non-obviousness",
      anchor0: `Restates something already IN the model ("tamBase band low end could be true", "CR3 is high").`,
      anchor4: `A competent founder who read the whole ledger would still not have it on their list; the surface appearance actively hides it.`,
    },
    {
      key: "mechanismDepth",
      label: "Mechanism depth",
      anchor0: `Asserted correlation; hand-waved hop ("regulation could delay things").`,
      anchor4: `Every link referenced and independently plausible; the causal chain would survive a hostile partner asking "why?" at each arrow.`,
    },
    {
      key: "evidenceQuality",
      label: "Evidence quality",
      anchor0: `A load-bearing premise is directly contradicted by a strong source.`,
      anchor4: `≥2 independent corroborating sources on the key premise. (A speculative-but-well-argued prior with honest absence-of-data scores 2, not 0.)`,
    },
    {
      key: "decisionRelevance",
      label: "Decision relevance",
      anchor0: `Changes nothing the venture would do this year.`,
      anchor4: `Changes sequencing or spend in the next two quarters, and is monitorable via the stated indicators.`,
    },
  ],
  // Kill if ANY of these hold (logged to the kill-log, never silent):
  kill: { specificityMax: 1, mechanismDepthMax: 1, totalMax: 9 },
  // Dedup pre-clustering: same-sign ΔYAM + targetNodes Jaccard ≥ threshold.
  dedupJaccard: 0.5,
};

export const RANKING = {
  // Board B ("the rocks") requires judge nonObviousness ≥ this:
  rockNonObviousness: 3,
  // insightScore = (judgeTotal / 20) × (expectedYamLoss / max expectedYamLoss)
};

// ── Semantic dedup (judge stage, pass 2) ─────────────────────────────────────
// The Jaccard pre-cluster only meets risks that share funnel nodes — but the
// same real-world mechanism gets encoded on DIFFERENT nodes by different
// lenses (one perturbs obtainableFactor, one excludes cust.operator-large,
// one scales serviceableFactor). This pass reads the whole register at once
// and partitions by underlying mechanism, ignoring node encoding. Runs on the
// BASIC model: it is a recognition task, not a generation task.

export const SEMANTIC_DEDUP = `
You are deduplicating a register of market-risk write-ups before it reaches a
client. Partition ALL entries into FAMILIES by their underlying real-world
mechanism — the causal story about the world, NOT which model nodes they
perturb. The same mechanism is often encoded against different nodes (one
write-up shrinks the obtainable share, another excludes a buyer cell, a third
cuts the serviceable factor): if a reader would say "this is the same point
again", they are one family.

A FAMILY means: same trigger, same causal chain, same thing a client would do
about it. Sharing a theme is NOT enough — "framework agreements lock out the
entrant" and "framework agreements mean the buyer cell is smaller than
counted" are the same family; "distributor line reviews are slow" is a
different family even though both are about channel access.

Rules:
- Every entry id appears in EXACTLY ONE family. Singleton families are the
  expected common case.
- When in doubt, keep entries separate — over-merging destroys distinct
  insights; under-merging only costs a little repetition.
- Give each family a short kebab-case label naming the mechanism.
`.trim();

// ── Refinement-loop convergence (scripts/refine.mjs) ─────────────────────────
// The loop's mechanical stop rule. Each refine pass appends a cycle record to
// risks/convergence.json; the loop STOPS when either holds, leaving a terminal
// register of escalated errors (need an instrument beyond web research) and
// true risks (monitor + mitigate).

export const CONVERGENCE = {
  // Stop when web-reducible error mass (Σ E[YAM loss] over confirm/adjust
  // verdicts) falls below this share of baseline YAM:
  reducibleFloorShareOfYam: 0.05,
  // Stop when a cycle cut total error mass by less than this vs the previous
  // cycle (the loop has plateaued):
  massDropFloor: 0.25,
};
