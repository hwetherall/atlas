# Next Steps — the Innovera toolkit in action (design)

> Resolved design for the rebuilt tab 8, agreed 2026-07-13. Treat as settled;
> route new ideas here only via explicit revision. Sibling to CLAUDE.md (§5.7
> would be this surface) and ledger.md.

## 1. What this surface is

The **mitigate** leg of identify → quantify → mitigate — the tab executives
spend most of their time in. Five risks from the corrected register, each
answered by one of five responses, each response executed by a named tool in
the **Innovera subscription toolkit**. Not a storefront: no prices, no CTAs.
The framing is *"here is your risk, and here is the tool you already have
access to that handles it."* The deliverable reads as board-grade advice; the
toolkit is how the advice executes.

## 2. The toolkit (mythology suite — Atlas's own family)

| Response | Tool | Identity |
|---|---|---|
| Monitor | **Agent Argus** | the hundred-eyed watchman — always-on monitoring; alerts re-price the register |
| Buy information | **Delphi** | the oracle you consult — commissioned research & data desk |
| Speak to an expert | **Mentor** | Odysseus's advisor — the expert network |
| Act | **Daedalus** | the master builder — execution playbooks & venture programs |
| Ignore | **Themis** | right order — governance: acceptance memos, sign-offs, revisit triggers |

Argus additionally backs every "ignore" as the safety net. Tool identities
live in `lib/toolkit.ts` (id, name, epithet, one-line what-it-does).

## 3. The views — stepped, one per screen

View 0 **The campaign**: portfolio header (remaining exposure · retired if
executed · the de-risking curve over 90 days with dependencies) + the toolkit
strip + five rows doubling as navigation. Built AFTER the memo template is
approved (see §7).

Views 1–5 **memos**, prev/next + progress dots, ordered by live severity.
Every memo has the same seven-section skeleton so executives learn it once:

1. **The stakes** — narrative; computed panel (expected loss, band, share of
   remaining portfolio); *when it bites* and when the decision expires.
2. **The decision** — the single sentence to decide, the deadline, and the
   default path (what happens if you decide nothing).
3. **Why this response** — five-cell rationale strip scoring ALL responses
   against this risk; the chosen one carries the argument, the rejected four
   each get one honest line. This is what makes the taxonomy an instrument.
4. **The artifact** — the tool's deliverable, response-specific (§4).
5. **The model after** — engine-computed projection: funnel and bands if you
   execute, next to today's (`lib/projection.ts`, §5). Never asserted.
6. **The tool rail** — "Executes with: <tool>" + what the tool is.
7. **Evidence** — sources from the research pipeline, register style.

## 4. Artifacts by response

- **Delphi (buy-information)** — sourcing table: 2–4 real, purchasable
  reports/datasets (vendor · scope · price · delivery · which ledger nodes it
  settles), a recommendation, VOI per option, projected band-narrowing.
- **Mentor (expert)** — expert profile (fictional, stated) + call agenda:
  five questions, each mapped to the ledger node it settles and how the
  answer moves it; prep pack; the deliverable after the call.
- **Argus (monitor)** — watch spec (signal · feed · query · threshold ·
  cadence), escalation rules, and ONE static mock alert (clearly labeled
  simulation): feed item → tripped threshold → the register re-pricing.
- **Daedalus (act)** — initiative charter: objective, workstreams, 90-day
  milestones, resourcing & budget band, leading indicators, kill criteria,
  engine-computed payoff vs status quo.
- **Themis (ignore)** — acceptance memo: the case for accepting, max-regret
  bound (computed from the band), revisit triggers (Argus-watched), sunset
  date, sign-off line.

## 5. Engine — `lib/projection.ts` (pure, tested)

```
ProjectionOp = { nodeId, value?, low?, high?, confidence? }   // what executing changes
applyProjection(ledger, ops) → Ledger                          // clone, never mutate
projectAction(ledger, scenario, ops) → { before, after }       // tam/sam/yam + per-node voi/swing
```

"Retired exposure" for a memo = severity of its linked risk(s) before minus
after (rankRisks on the projected ledger). The campaign view sums these.
Same doctrine as everywhere: the € numbers on this surface are computed at
render time against current levers; the data files carry only *what changes*.

## 6. Research pipeline — grounded, no runtime network

- `scripts/nextsteps-plan.mjs` — per-memo query plans (Exa + Perplexity;
  Bright Data for portal scraping once the zone exists).
- `scripts/nextsteps-research.mjs` — runner, mirrors research.mjs: zero deps,
  caches slim raw JSON to `research/raw/nextsteps/<memo>-<group>.json`,
  `--only=` / `--force`. The demo app NEVER calls this at runtime.
- Authoring: Claude drafts memo content **in-session from the cache** (no
  OpenRouter dependency), citing cached sources; values that must be true
  (report prices, feeds, dates) come from the cache or are marked estimates.
- Data lands in `lib/nextSteps.ts`, validated by `lib/nextStepsSchema.ts`
  (zod, boot-time, same doctrine as the ledger and register).

## 7. Milestones & review gates

1. ✅ Design doc (this file), schema, projection engine + tests.
2. **Delphi memo** end-to-end (research → data → rendered) — REVIEW GATE:
   Harry approves the template before replication.
3. Remaining four memos (research + authoring), one by one.
4. View 0 campaign (portfolio rollup, curve, toolkit strip).
5. Design-language polish pass + browser walkthrough.

## 8. Non-goals

No pricing/commerce. No live network in the demo path. No real expert names
(Mentor profiles are fictional by design). No new chart library — curves are
hand-rolled SVG like the funnel.
