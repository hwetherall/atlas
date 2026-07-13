# Resolution log — the refinement loop

> Each cycle: risk pipeline classifies findings into ERRORS (research settles
> the claim today) and RISKS (only time settles it) → `npm run refine` researches
> each error's settle-test and adjudicates its proposed correction → a human
> curates the accepted diffs into lib/ledger.ts → the pipeline re-runs against
> the corrected ledger → resolved errors die.
>
> The loop STOPS mechanically (`risks/convergence.json`, thresholds in
> `scripts/risks-plan.mjs` CONVERGENCE): when web-reducible error mass falls
> below 5% of baseline YAM, or a cycle cuts total error mass by less than 25%.
> What remains is the TERMINAL REGISTER, two buckets: **escalated errors** —
> claims no web artifact settles, each named with the cheapest instrument that
> would (commission a report · buy data · expert calls · experiment) — and
> **risks** — claims only time settles, held with indicators and mitigations.

## Cycle 1 — 2026-07-08 · ledger rev 1 → rev 2

**Input:** 27 findings (from ledger rev `2428e977`, baseline TAM €320M · SAM €176M · YAM €5.28M).
**Classified:** 17 errors · 10 risks. All 17 errors researched (`risks/refine.review.md`).

**Verdicts:** 4 confirm · 3 adjust · 10 refute — the adjudicator held the line
where fresh evidence didn't support the proposed correction.

### Corrections applied (curated into lib/ledger.ts, rev 2)

| Fact | Was | Now | Why |
|---|---|---|---|
| `obtainableFactor` | 0.03 (band 1–5%) | **0.01** (band 0.5–3%) | The ledger's own cited benchmark (Prospeo) assigns **1% of SAM to Year 1** — 3%/5% are Years 2–3. The prior curation read the Year-2 figure as Year 1. Cross-checked by the Tractian comparable and the early-procurement mechanism. |
| `tamBase` | €320M (band 240–520) | **€300M** (band 240–360) | The €495M cross-check ceiling measured PDUs **+PSUs** — a broader category growing 21% vs intelligent-PDU 10–12% (IndexBox). Contaminated ceiling removed; maturity raised to triangulated. |
| `seg.enterprise` | 0.29, no band | 0.29 (band 0.24–0.30) | Value **confirmed**: NVIDIA's B300 reference architectures ship rack PDUs in both AC and DC variants — GPU growth is PDU-consuming, not PDU-skipping. Downside band covers dense busbar deployments. |

### Corrections deferred (flagged for cycle 2 curation)

- `cust.operator-large` → 0.32 and `seg.hyperscale` → 0.35 (both "adjust"): entangled
  with sum-to-1.00 redistribution across sibling shares, and each conflicts with a
  sibling refutation from the same pass. Need a donor-cell research pass before applying.
- `geo.CH` → 0.11 ("confirm"): its donor cell (`geo.NL`) was separately refuted — deferred
  pending reconciliation.

### Refuted corrections (current values stand)

10 proposed corrections died against fresh evidence — including three of the four
independent attacks on `tamBase` (only the cross-check contamination survived) and
the claims against `cust.oem`, `serviceableFactor`, and `geo.NL`.

### Headline movement

**Baseline: TAM €320M → €300M · SAM €176M → €165M · YAM €5.28M → €1.65M.**
The honest Year-1 number is roughly a third of the original — found by the system
attacking its own model, verified against sources, and applied by human curation.

## Cycle 2 — 2026-07-08 · run against ledger rev 2

**Input:** fresh hunt against the corrected ledger; digests included the 17
refine-* evidence groups from cycle 1. 45 hypotheses → 44 compiled → 32 survived
the judge → **20 errors · 12 risks** (baseline now TAM €300M · SAM €165M · YAM €1.65M).

### Convergence

- **The error mass collapsed.** Cycle 1's largest error carried E[loss] €2.53M;
  cycle 2's largest carries €0.57M — a 78% drop. Nothing re-proposes the
  corrected values: no hypothesis argues obtainableFactor back to 3%, and the
  tamBase attacks now bracket €300M from both sides (330 / 300 / 260) instead of
  pulling one direction.
- **The corrections held under adversarial re-attack.** The strongest hunter in
  the fleet, hunting the corrected ledger with fresh evidence, could not re-open
  the cycle-1 fixes — it could only argue at the margins.
- **The loop re-derived the deferred corrections independently.** Cycle 2's
  error list converges on exactly the share-mix items cycle 1 deferred:
  seg.hyperscale (three verdicts, 0.22–0.35), cust.operator-large (0.18–0.24,
  vs cycle 1's deferred 0.32), geo.CH → 0.13, geo.NL down. These now have
  multi-cycle triangulation and are ready to curate with a donor-cell decision.
- **The irreducible register emerged.** 12 risks remain, all time-settled:
  spec lock-in timing, EU Cyber Resilience Act, buyer security-audit gates,
  bundling, radio-review delay, construction lulls, return rates. This is the
  durable "monitor and mitigate" register.

### Decision point (cycle 3?)

Remaining error mass is small (top item €0.57M vs a €1.65M YAM). A cycle 3 would
mostly curate the share-mix redistribution — worthwhile, but with diminishing
returns vs cycles 1–2. Recommendation recorded in the session summary: stop
here for the demo; apply the multi-cycle-triangulated share corrections in the
next working session.
