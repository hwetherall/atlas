# Risk review — 2026-07-08

Baseline: **TAM €300M · SAM €165M · YAM €1.65M** · ledger rev `2428e977` · 32 risks emitted

> Every € figure below is engine-computed from the risk's perturbation ops — the models never stated an impact.

## Fix the model first — errors, not risks
Claims a research artifact would settle today. Each carries a proposed correction for the refinement loop (`npm run refine`); they leave the risk boards.

| # | Error | Target fact | Proposed correction | E[loss] | Evidence |
|---|---|---|---|---|---|
| 1 | Year-1 capture of 1% is really a 3-year total; too high | obtainableFactor | obtainableFactor: → 0.01 (band 0.005–0.03) | −€0.57M | corroborated |
| 2 | Year-1 sales limited to old sites; new builds already locked | obtainableFactor | flag only | −€0.45M | corroborated |
| 3 | Base counts basic PDUs the venture cannot sell, halving the market | tamBase | tamBase: → 150 (band 120–210) | −€0.37M | corroborated |
| 4 | Frankfurt grid queue could push half the Year-1 orders to 2027 | geo.DE | geo.DE: → 0.42 (band 0.4–0.5) | −€0.33M | corroborated |
| 5 | Serviceable share ignores timing, overstating Year-1 demand | serviceableFactor | serviceableFactor: → 0.35 (band 0.28–0.45) | −€0.27M | corroborated |
| 6 | Market ceiling may be too low; plan sized for wrong market | tamBase | tamBase: → 330 (band 280–400) | −€0.26M | corroborated |
| 7 | Unsourced 'Europe = 30%' hop could drop the base below its floor | tamBase | tamBase: → 300 (band 200–360) | −€0.21M | corroborated |
| 8 | Large operators buy through frameworks the entrant cannot bid | cust.operator-large | cust.operator-large: → 0.24 (band 0.18–0.33) | −€0.17M | corroborated |
| 9 | Intelligent-PDU market is more locked up than headline shows | serviceableFactor | serviceableFactor: → 0.45 (band 0.4–0.55) | −€0.13M | contested |
| 10 | CE-7 share is based on old racks, but new sales chase new builds | tamBase | tamBase: → 260 (band 210–320) | −€0.13M | corroborated |
| 11 | OEM/integrator channel closes from both sides, cutting share | cust.oem | cust.oem: → 0.08 (band 0.05–0.14) | −€0.10M | corroborated |
| 12 | Year-1 hyperscale demand lands outside Central Europe | seg.hyperscale | seg.hyperscale: → 0.22 (band 0.15–0.3) | −€0.08M | corroborated |
| 13 | Biggest buyer group buys through frameworks, not direct sales | cust.operator-large | cust.operator-large: → 0.18 (band 0.1–0.28) | −€0.07M | corroborated |
| 14 | German energy-reporting rules push incumbent-DCIM gates into PDU tenders | serviceableFactor | serviceableFactor: → 0.55 (band 0.45–0.65) | −€0.07M | contested |
| 15 | Enterprise PDU share overstated as AI racks shift to busbar | seg.enterprise | seg.enterprise: → 0.29 (band 0.24–0.3) | −€0.05M | contested |
| 16 | NL's 28% weight rests on capped colo; growth is out of reach | geo.NL | geo.NL: → 0.2 (band 0.15–0.26) | −€0.04M | corroborated |
| 17 | Country map uses colo-only demand, overweighting Germany and NL | geo.DE | geo.DE: → 0.46 (band 0.42–0.5) | −€0.03M | corroborated |
| 18 | Geography weights overstate Netherlands, understate Switzerland | geo.CH | geo.CH: → 0.13 (band 0.1–0.15) | −€0.02M | corroborated |
| 19 | Germany hyperscale-owned share is far below the 44% we assumed | seg.hyperscale | seg.hyperscale: → 0.22 (band 0.15–0.3) | −€0.02M | corroborated |
| 20 | Segment mix overweights hyperscale in CE-7, misdirecting Year-1 effort | seg.hyperscale | seg.hyperscale: → 0.33 (band 0.28–0.4) | −€0.02M | corroborated |

## Board A — the risks you've probably thought of
Ranked by expected YAM loss (p × |ΔYAM|).

| # | Risk | Category | p | ΔYAM | ΔTAM | E[loss] | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Big buyers lock specs early, emptying the Year-1 sales window | execution | 60% | −€0.99M | €0.00M | −€0.59M | corroborated |
| 2 | EU Cyber Resilience Act cuts networked PDU sales in Year 1 | exogenous | 50% | −€0.93M | €0.00M | −€0.47M | corroborated |
| 3 | Buyer security audit adds a slow gate that delays first PO | execution | 45% | −€0.99M | €0.00M | −€0.45M | corroborated |
| 4 | Bundled PDUs shrink the winnable pool below the model's floor | execution | 38% | −€1.16M | €0.00M | −€0.44M | contested |
| 5 | One WiFi sensor forces EU radio security review, adds 2 quarters | execution | 40% | −€0.83M | €0.00M | −€0.33M | corroborated |
| 6 | Large-operator sales are locked up by long-term framework deals | competitive | 42% | −€0.73M | −€60.00M | −€0.30M | contested |
| 7 | Year-1 may hit a building lull the trend growth hides | exogenous | 30% | −€0.83M | €0.00M | −€0.25M | contested |
| 8 | A third of Year-1 hardware wins get returned, cutting realized share | execution | 40% | −€0.50M | €0.00M | −€0.20M | corroborated |
| 9 | Two channels worth 35% can't open inside Year 1 | execution | 33% | −€0.40M | −€72.00M | −€0.13M | contested |
| 10 | German billing rules block core PDU value in half the market | boundary | 40% | −€0.30M | €0.00M | −€0.12M | corroborated |
| 11 | Distributor channel is locked shut for Year 1 | competitive | 30% | −€0.21M | −€39.00M | −€0.06M | contested |
| 12 | Colo power gear follows AI tenants out of category | boundary | 34% | −€0.10M | −€18.00M | −€0.03M | corroborated |

## Board B — the rocks
Non-obviousness ≥ 3/4, ranked by insight-weighted severity. This is the deliverable's headline.

| # | Risk | Category | p | ΔYAM | ΔTAM | Insight | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Big buyers lock specs early, emptying the Year-1 sales window | execution | 60% | −€0.99M | €0.00M | 0.90 | corroborated |
| 2 | Buyer security audit adds a slow gate that delays first PO | execution | 45% | −€0.99M | €0.00M | 0.64 | corroborated |
| 3 | EU Cyber Resilience Act cuts networked PDU sales in Year 1 | exogenous | 50% | −€0.93M | €0.00M | 0.63 | corroborated |
| 4 | Bundled PDUs shrink the winnable pool below the model's floor | execution | 38% | −€1.16M | €0.00M | 0.59 | contested |
| 5 | One WiFi sensor forces EU radio security review, adds 2 quarters | execution | 40% | −€0.83M | €0.00M | 0.50 | corroborated |
| 6 | Large-operator sales are locked up by long-term framework deals | competitive | 42% | −€0.73M | −€60.00M | 0.41 | contested |
| 7 | Year-1 may hit a building lull the trend growth hides | exogenous | 30% | −€0.83M | €0.00M | 0.33 | contested |
| 8 | A third of Year-1 hardware wins get returned, cutting realized share | execution | 40% | −€0.50M | €0.00M | 0.27 | corroborated |
| 9 | German billing rules block core PDU value in half the market | boundary | 40% | −€0.30M | €0.00M | 0.18 | corroborated |
| 10 | Two channels worth 35% can't open inside Year 1 | execution | 33% | −€0.40M | −€72.00M | 0.18 | contested |
| 11 | Distributor channel is locked shut for Year 1 | competitive | 30% | −€0.21M | −€39.00M | 0.08 | contested |
| 12 | Colo power gear follows AI tenants out of category | boundary | 34% | −€0.10M | −€18.00M | 0.05 | corroborated |

---

## Risk cards

### Year-1 capture of 1% is really a 3-year total; too high

`risk.execution-window.som-window-semantics-year1-zero` · **rock** · fact · lens: execution-window · p=58% (evidence) · judge 17/20

The model says the venture wins 1% of its serviceable market in Year 1. But the benchmarks behind that 1% describe capture over 1 to 5 years, and the one worked example in them lands at 0.1% of SAM. Because the venture is pre-launch and only sells for part of Year 1, the true number is a fraction of the back half of the year. The Year-1 figure is 2 to 3 times too high.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.66 (−€0.99M) · E[YAM loss] −€0.57M

**Perturbation:** set obtainableFactor → 0.004 (Pro-rated Year-1 capture consistent with cumulative-window benchmarks and the 0.1% worked example)

**Mechanism:**
- *trigger*: Benchmarks define the 1% share as accruing over years. `[digest:obtainable-benchmark#c1, digest:obtainable-benchmark#c5, digest:obtainable-benchmark#c6, ledger:obtainableFactor]`
- *propagation*: The one worked example yields just 0.1% of SAM. `[digest:obtainable-benchmark#c7, digest:obtainable-benchmark#c10]`
- *propagation*: Pre-launch venture sells only 6 to 9 months in Year 1. `[profile:Stage, profile:What obtainable horizon should Year-1 (YAM) assume?]`
- *model-impact*: A 1% factor overstates real Year-1 capture 2 to 3 times. `[ledger:obtainableFactor]`

**Why missable:** The number was already cut from 3% to 1% and marked triangulated, so it reads as the fixed conservative case while the real error is the time frame of its sources.

**Falsifier:** A comparable early-stage data-center hardware entrant documented capturing at least 1% of its serviceable market within its first 12 months from launch.

**Classification:** ERROR — research settles it · settle test: The source documents themselves (Prospeo, IdeaPlan) settle whether the 1% benchmark refers to Year-1 capture or cumulative 36-month capture — this is a definitional reading of existing, attached artifacts, resolvable today by reading the sources rather than waiting for market events.

**Proposed correction:** `obtainableFactor` → 0.01 (band 0.005–0.03) — The ledger already reconciled the benchmark-period misread by adopting Prospeo's explicit Year-1 = 1% figure (with 3% and 5% for Years 2–3), and the Tractian comparable plus early-procurement mechanism keep the 0.5–3% band intact, so the claim's premise that 1% is a 3-year total is contradicted by the source's own Year-1 assignment.

**Likelihood rationale:** Three of four benchmark sources frame the percentage as multi-year, and the single worked example sits far below the band floor. The offsetting uncertainty is that the venture may have pre-launch pipeline the model does not credit, so the nudge is bounded to 0.58.

**Early warnings:**
- Months from launch to first booked CE purchase order — watch: Own CRM plus TED (EU public tender portal) responses to rack-power lots the venture bids — trigger: No PO by month 6 post-launch (increases p)
- First-year revenue disclosures of comparable rack-power/DC-hardware entrants — watch: Crunchbase/annual filings of recent PDU or rack-infrastructure startups entering EU — trigger: Comparables clustering below 0.5% of their stated SAM in year 1 (increases p)
- Quote-to-PO conversion time in the first CE opportunities — watch: Own CRM pipeline reviewed at month 6; cross-referenced against TED award timelines for rack-power line items — trigger: Median cycle >9 months at month 6 (increases p)

**Mitigations:**
- [information] Build a bottom-up pipeline model (named accounts × win rate × cycle time × months of selling window) to replace the top-down 1% before fundraising commitments are set against YAM — VOI(obtainableFactor) = €0.0M
- [operational] Re-baseline the internal plan on a 24-month obtainable window with quarterly gates, so Year-1 misses don't cascade into a credibility problem with the board

**Evidence (corroborated):**
- [industry-report] TAM vs SAM vs SOM: Definitions, Formulas & 2026 Guide — Prospeo — https://prospeo.io/s/tam-vs-sam-vs-som
  > SOM (Serviceable Obtainable Market): What you'll realistically capture in the next 36 months given your team, budget, and competitive position. ... What's a realistic SOM? 1-5% of SAM over 36 months for early-stage companies.
- [industry-report] Serviceable Obtainable Market (SOM): PM Definition — IdeaPlan — https://www.ideaplan.io/glossary/serviceable-obtainable-market-som
  > SOM is the portion of the SAM that a company can realistically capture in the near term, typically within one to three years. ... For early-stage companies, SOM is typically 1-5% of SAM.
- [industry-report] Addressable Market Explained: TAM, SAM, SOM in 2026 — Prospeo — https://prospeo.io/s/addressable-market
  > SOM is what you'll capture in the near term - typically modeled over 1-3 years - and it's the number investors scrutinize hardest.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (obtainableFactor), the contested value (1% Year-1 vs 0.5% floor vs 0.004 perturbation), the specific sources (Prospeo/IdeaPlan/Wise), a worked example ($3.2M/$3.2B ≈ 0.1%, Tractian $200K), and the pre-launch selling window (PO in month 7–9). Actors, numbers, and instruments are all pinned down.
- *nonObviousness*: The risk is not 'the band edge could be true' — it names a NEW reason: the time-semantics of the cited benchmarks (cumulative 1–5yr vs Year-1 snapshot), which the whyMissable notes is hidden by the node's 'triangulated' maturity and prior 3%→1% correction. Docked one point because 'SOM percentages are multi-year' is a known critique among careful founders, even if this ledger buries it.
- *mechanismDepth*: Four-step chain with refs at every arrow: multi-year source semantics → 0.1% worked example → pre-launch pro-rating → 2–3x overstatement. The final quantitative jump to 0.004 is the weakest link — the rationale itself concedes the pro-rating and 2–3x figure were not independently corroborated.
- *evidenceQuality*: The core premise (benchmarks are 1–3/3–5 year cumulative, not annual) has ≥2 independent corroborating sources (Prospeo and IdeaPlan) plus four supporting stances, and the likelihood rationale is honest that the 0.1% worked example and pro-rating claims remain uncorroborated. Held below 4 because Prospeo appears three times (not fully independent) and all sources are low-authority marketing glossaries rather than empirical data.
- *decisionRelevance*: Directly changes near-term action: replace top-down 1% with a bottom-up pipeline model 'before fundraising commitments are set against YAM' and re-baseline to a 24-month window with quarterly gates. Both stated indicators (PO by month 6 via own CRM/TED; comparables' first-year disclosures) are concrete and monitorable.

*Provenance: raw evidence `risks/raw/evidence/risk.execution-window.som-window-semantics-year1-zero.json` · transcripts `risks/raw/llm/`*

---

### Year-1 sales limited to old sites; new builds already locked

`risk.execution-window.prelet-pipeline-lockout` · **rock** · model-structure · lens: execution-window · p=55% (evidence) · judge 17/20

The model assumes a 9% growth market means the venture can win 1% of the full market in Year 1. But new data centers pick their power vendors at design freeze, before launch, so every site coming online in Year 1 already chose its supplier. That leaves only retrofit and refresh sales, a much smaller pool, which makes the Year-1 number too high.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.83 (−€0.83M) · E[YAM loss] −€0.45M

**Perturbation:** set obtainableFactor → 0.005 (Year-1 capture limited to installed-base retrofit/refresh; new-build pipeline pre-committed before launch)

**Mechanism:**
- *trigger*: New builds lock power vendors at design freeze, before launch. `[ledger:obtainableFactor, profile:Stage]`
- *propagation*: Growth sits in locked new builds, leaving only refresh sales. `[ledger:shape.cagr, digest:obtainable-benchmark#c12]`
- *propagation*: Generic 1% benchmarks assume the whole market is reachable. `[digest:obtainable-benchmark#c0, digest:obtainable-benchmark#c2]`
- *model-impact*: Applying 1% to full market overstates reachable Year-1 share. `[ledger:obtainableFactor]`

**Why missable:** The plan reads 1% as conservative because the market is growing, but the growing part is the least reachable in 12 months and no node separates committed demand from contestable demand.

**Falsifier:** Documented cases of new data centers running competitive rack-PDU selection within 6 months of fit-out, or an operator confirming PDUs are bought late as a commodity separate from the electrical design freeze.

**Classification:** ERROR — research settles it · settle test: The load-bearing part is a claim about how rack-PDU procurement works TODAY: whether PDUs are locked at electrical design freeze or bought late as a commodity. An operator/procurement-schedule dataset or a week of expert calls with data-center facilities buyers would settle whether the reachable Year-1 pool excludes new builds. This is a fact about the present procurement structure, not a future market unfolding.

**Likelihood rationale:** Early electrical lock-in for new builds is well-documented and matches the ledger's own 12-24 month assumption. But no source shows whether rack PDUs ride the frozen bill or are bought late as a commodity, keeping the likelihood near a coin flip.

**Early warnings:**
- Stage at which rack-PDU vendor is fixed in CE fit-out tenders (bundled at design freeze vs late separate lot) — watch: TED tender documents for DE/NL data-center fit-outs; fit-out contractors' bid packages — trigger: PDU line bundled into general-electrical packages in ≥3 of 4 sampled tenders (increases p)
- Pre-let percentages and long-lead procurement commentary for CE capacity additions — watch: Operator and hyperscaler capex calls (Equinix, Digital Realty quarterly); Vertiv/Schneider backlog commentary — trigger: Pre-let >80% with electrical packages cited as booked >18 months out (increases p)
- FLAP-D pre-let percentage and vacancy in successive half-year prints — watch: JLL EMEA Data Centre Report and Cushman & Wakefield EMEA updates — trigger: Pre-let stays above 80% with vacancy below 8% (increases p)

**Mitigations:**
- [information] Map the 2026–27 CE new-build pipeline by procurement stage (design freeze reached? electrical package awarded?) to quantify the actually-contestable Year-1 pool — VOI(obtainableFactor) = €0.0M
- [strategic] Target the installed-base refresh cycle explicitly: build the launch offer around drop-in replacement and retrofit economics (metering upgrades, DCIM integration) rather than new-build spec wins

**Evidence (corroborated):**
- [industry-report] Data Center Electrical Procurement: Why the Order Has to Come Before the Design — Build.inc — https://build.inc/insights/data-center-electrical-procurement-sequence-workflow
  > Power transformer lead times from major manufacturers have reached 48 to 60 months. Generator step-up transformers average 144 weeks. Tier 1 suppliers -- ABB, Siemens Energy, Hitachi Energy -- have backlogs extending to 2030 and beyond. A developer who sequences procurement conventionally and targets energization in 2028 has already missed the window.
- [industry-report] From Electrical Design to Energization — Construction Business Outlook — https://constructionbusinessoutlook.com/from-electrical-design-to-energization/
  > the schedule can be effectively lost before a single foundation is poured...because a transformer with a 65-week lead time wasn't released before the topology was finalized. Contractors who consistently deliver these programs on time have stopped treating electrical planning as a downstream task.
- [industry-report] Electrical Equipment Lead Time Index — VAWN — https://usevawn.com/resources/electrical-equipment-lead-times/
  > Power / substation transformer 128 weeks ↑ Elevating; Generator step-up (GSU) transformer 144 weeks ↑ Elevating; Medium-voltage switchgear 44 weeks. Panelboards 15-23 weeks; Circuit breakers (commodity) In stock.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (obtainableFactor), a concrete perturbation (set to 0.005), the 12–24mo lock-in window from the ledger's own crossCheck, the 9% CAGR, and monitorable instruments (TED DE/NL tenders, Equinix/Digital Realty/Vertiv commentary) with numeric thresholds. Actors, values, and timing are all pinned down.
- *nonObviousness*: The ledger's crossCheck already concedes '12–24mo lock-in', so the raw fact is partially in the model; the new contribution is the structural double-count — that the CAGR's growth sits entirely in the pre-committed pipeline and 'the model has no node that separates committed-pipeline demand from contestable demand'. That inversion of 'growth as tailwind' is genuinely hidden by the surface framing, but it builds on a disclosed ledger fact rather than something fully novel.
- *mechanismDepth*: Four-step chain with refs at every arrow (design freeze → growth concentrated in pre-committed pipeline → benchmark assumes full SAM reachable → obtainableFactor double-counts), and each hop is independently argued. The one hop a hostile partner would attack — whether PDUs specifically ride the frozen BOM or are bought late as commodity — is inferential, as the rationale itself admits ('the PDU-coupling link... is still inferential').
- *evidenceQuality*: ≥3 independent sources (Build.inc, Construction Business Outlook, VAWN) corroborate the trigger of early electrical lock-in, but the load-bearing PDU-coupling premise has only 'silent' stances — the PDU sourcing guides 'describe RFQ processes without timing relative to design freeze'. The risk is honest about this gap in its revised likelihood rationale, which earns credit but caps the score below 4.
- *decisionRelevance*: The mitigation to 'target the installed-base refresh cycle' and re-map the 2026–27 pipeline by procurement stage directly changes Year-1 GTM sequencing and product focus, and the perturbation (0.005 vs band) materially moves the revenue case. Indicators specify concrete venues (TED tenders, capex calls) with thresholds ('≥3 of 4 sampled tenders'), making it monitorable within the next two quarters.

*Provenance: raw evidence `risks/raw/evidence/risk.execution-window.prelet-pipeline-lockout.json` · transcripts `risks/raw/llm/`*

---

### Base counts basic PDUs the venture cannot sell, halving the market

`risk.definition-scopedown.intelligent-subset-inflation` · **rock** · fact · lens: definition-scopedown · p=50% (evidence) · judge 17/20

The model assumes the venture can sell into the full €300M rack-PDU market. But Grand View, the source of that figure, says the non-intelligent segment held the largest revenue share in 2025, and the venture sells only intelligent PDUs. About half the €300M is basic units the product cannot address, so the Year-1 number is inflated about 2x.

**Impact (engine):** TAM +€300M → +€165M (−€135M) · YAM 1.65 → 0.91 (−€0.74M) · E[YAM loss] −€0.37M

**Perturbation:** scale tamBase → 0.55 (Restrict the base to the intelligent-PDU-relevant revenue share of the rack-PDU category (~55% revenue-weighted in Europe))

**Mechanism:**
- *trigger*: Grand View says non-intelligent PDUs held the largest 2025 share. `[digest:tam-global-crosscheck#c2, ledger:tamBase, profile:Product]`
- *propagation*: Vendors sell intelligent and basic PDUs as separate products. `[digest:tam-global-crosscheck#c12, digest:tam-global-crosscheck#c13, digest:tam-base#c14]`
- *model-impact*: SAM €165M and YAM €1.65M both inherit the inflation. `[ledger:tamBase, ledger:serviceableFactor]`

**Why missable:** The label 'rack-PDU market' looks matched to a rack-PDU vendor, but the mismatch sits inside the source's own segmentation table below the headline.

**Falsifier:** A European source showing intelligent PDUs at 75% or more of rack-PDU revenue.

**Classification:** ERROR — research settles it · settle test: The Grand View (or IndexBox EU) rack-PDU report's segment split table showing intelligent vs. basic/non-intelligent revenue share for 2025 — a purchasable existing dataset that directly settles what fraction of the €300M is addressable.

**Proposed correction:** `tamBase` → 150 (band 120–210) — If the venture sells only intelligent PDUs and non-intelligent held the largest 2025 share, the addressable base is roughly half the all-segment €300M figure, so the funnel base should reflect the intelligent-only segment.

**Likelihood rationale:** The source states non-intelligent held the largest revenue share globally. But intelligent units carry 3-5x prices and European buyers skew intelligent, so the European intelligent share plausibly lands at 45-60%.

**Early warnings:**
- Intelligent vs non-intelligent revenue split in the next Grand View / Mordor rack-PDU report vintage — watch: Grand View Research rack-PDU report segment tables; Mordor Intelligence Intelligent PDU report — trigger: Non-intelligent still ≥45% of European revenue (increases p)
- ASP spread between basic/metered and switched/outlet-metered SKUs on incumbent price lists — watch: Vertiv Geist, Raritan/Legrand, and APC published EU price lists — trigger: Basic-unit volumes dominating distributor stock at <€500 ASP while intelligent SKUs sit >€1,500 (increases p)
- Published intelligent-vs-total rack-PDU revenue split for EU or Germany — watch: IndexBox EU/Germany Intelligent Rack PDUs report headlines; Omdia Rack PDU Annual Market Analysis abstract updates — trigger: Intelligent share reported below 70% of category revenue (increases p)
- SKU mix stocked and quoted by CE distributors (basic vs metered vs switched/intelligent) — watch: CE electrical/IT distributor price lists and catalogs (e.g., Rexel, Also/Ingram DC-infrastructure lines) — trigger: Basic+metered-only SKUs constituting the majority of listed rack-PDU line items (increases p)

**Mitigations:**
- [information] Commission the IndexBox EU Intelligent Rack PDUs report and difference it against the general EU Rack PDUs report to isolate the venture-relevant base — VOI(tamBase) = €30.0M
- [strategic] Add a metered-only downmarket SKU to the roadmap so the non-intelligent half of the base is addressable rather than excluded

**Evidence:** none found (corroborated) — flagged, not killed.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 4/4 · evidenceQuality 3/4 · decisionRelevance 3/4
- *specificity*: Names the exact anchor ($2.81B Grand View), the contaminated values (€300M base, SAM €165M, YAM €1.65M), the competing intelligent-only sizings ($2.1B GIA, $3.0B MRF), specific report SKUs (IndexBox EU pair), and a quantified perturbation (scale 0.55). Actors, instruments, and numbers are all pinned to ledger nodes and digest cites.
- *nonObviousness*: The whyMissable is genuinely adversarial: the label 'rack-PDU market' reads scope-matched to a rack-PDU vendor, and the prior removal of the PDUs+PSUs ceiling created false confidence that definitional contamination was handled. Falls short of 4 because a founder auditing the anchor's own segmentation table — the standard first cross-check on a TAM anchor — could plausibly find it.
- *mechanismDepth*: Three-hop chain (anchor's own segmentation → independent intelligent-only sizings and separate report SKUs → downstream inheritance because serviceableFactor haircuts reach, not product scope) with refs at every step. The likelihood rationale preemptively answers the hostile 'why 0.55 not 0.4?' by naming the 3–5x ASP offset and European buyer skew.
- *evidenceQuality*: ≥2 independent sources (GIA sizing, IndexBox separate EU reports, Omdia basic/networked segmentation, 6Wresearch product-type taxonomy) corroborate that the intelligent subset is a distinct, smaller base. But the load-bearing quantitative premise — the ~55% European revenue-weighted intelligent share — is inferred rather than sourced, the IndexBox quotes are only report titles, and one stance is silent.
- *decisionRelevance*: A ~2x cut to TAM/SAM/YAM within the perturbation, a cheap ($8k) information mitigation, and a roadmap-level strategic option (metered SKU) all bear on near-term choices, with monitorable indicators (report vintages, incumbent EU price lists). Stops short of 4 because it primarily corrects the market narrative rather than forcing a specific spend or sequencing change in the next two quarters.

*Provenance: raw evidence `risks/raw/evidence/risk.definition-scopedown.intelligent-subset-inflation.json` · transcripts `risks/raw/llm/`*

---

### Frankfurt grid queue could push half the Year-1 orders to 2027

`risk.demand-discontinuity.frankfurt-grid-queue-de-slip` · **rock** · exogenous · lens: demand-discontinuity · p=45% (evidence) · judge 17/20

The model treats Germany as a diversified half of the market. But Frankfurt hosts about 75% of German capacity, so roughly 37% of Year-1 demand routes through one metro where grid connections now wait 24–36 months. If Frankfurt's 542 MW under construction slips past 2026, the largest tranche of Year-1 orders moves to 2027–28.

**Impact (engine):** TAM +€300M → +€276M (−€24.00M) · YAM 1.65 → 0.91 (−€0.74M) · E[YAM loss] −€0.33M

**Perturbation:** set geo.DE → 0.42 (DE share of contestable in-window demand falls to the installed-load low bound as Frankfurt additions slip) · scale obtainableFactor → 0.6 (Year-1 pace compressed as the largest geography's fit-outs defer)

**Mechanism:**
- *trigger*: Frankfurt grid connections wait 24–36 months; 542 MW awaits energization `[digest:geo-DE#c15, digest:geo-DE#c8, digest:geo-DE#c14]`
- *propagation*: Frankfurt is 75% of German capacity; deferred energization defers the biggest orders `[digest:geo-DE#c1, ledger:geo.DE]`
- *model-impact*: DE share falls to 0.42 and Year-1 pace drops with it `[ledger:geo.DE, ledger:obtainableFactor]`

**Why missable:** The ledger tracks country shares but has no metro dimension, so the fact that half the funnel routes through one grid queue is invisible.

**Falsifier:** Grid operator commitments or Frankfurt data showing live IT load stepping up by more than 100 MW within Year-1.

**Classification:** ERROR — research settles it · settle test: A current Frankfurt-vs-Germany capacity dataset (e.g., Statista/BMWK metro-level split) showing Frankfurt's actual share of German colocation/IT power today — this is a knowable present fact, not a future event.

**Proposed correction:** `geo.DE` → 0.42 (band 0.4–0.5) — The claim's load-bearing '75% of German capacity in Frankfurt' concentration is overstated — FLAP-D data shows Frankfurt at roughly 55–65% of German colo capacity, so DE share should sit at the installed-IT-load low end (0.42) rather than the colo-scope 0.50, but the correction is a today's-share fact, not the future slip.

**Likelihood rationale:** Queue lengths and near-zero vacancy are documented, and projects under construction usually hold secured grid slots, so slippage hits planning-stage projects harder. New capacity is also migrating to sites outside the Frankfurt queue, which caps the upward revision.

**Early warnings:**
- Frankfurt live IT-load and under-construction prints — watch: JLL German data center market updates and Mordor Frankfurt series — trigger: <+50 MW live-load growth across two consecutive half-year prints (increases p)
- Grid-connection queue length and energization commitments for Rhein-Main data-center applicants — watch: TenneT/Amprion connection disclosures and Hesse permitting dockets; operator capex-call commentary on Frankfurt energization dates — trigger: Stated waits lengthening beyond 36 months or named projects re-guiding commissioning by ≥2 quarters (increases p)

**Mitigations:**
- [information] Commission an energization-date audit of the Frankfurt 542 MW under-construction pipeline (which projects hold firm grid allocations for 2026) — VOI(geo.DE) = €12.0M
- [strategic] Rebalance the Year-1 territory plan toward Berlin (219 MW in planning) and Poland/CEE, where additions are less grid-queue-bound
- [operational] Launch a retrofit/replacement SKU program for operating Frankfurt halls whose demand does not depend on new grid connections

**Evidence (corroborated):**
- [industry-report] Germany's Data Center Strategy vs. AI Energy Demand — innobu — https://www.innobu.com/en/articles/data-center-strategy-ai-energy-demand.html
  > In Frankfurt, 126 data centers account for up to 40 percent of city-wide power consumption, and new grid connections are unavailable until the mid-2030s. The Energy Efficiency Act requires operators to source 100 percent renewable electricity by January 2027, reuse at least 10 percent of waste heat from July 2026, and maintain a maximum PUE of 1.2 for new facilities.
- [industry-report] Frankfurt's Data Center Market Has Hit a Physical Wall — KiTalent — https://kitalent.com/articles/frankfurt-data-center-talent-crisis
  > Available utility capacity for new large-scale developments within Frankfurt city limits is effectively zero. High-voltage grid connections now carry wait times of 24 to 36 months. The Energy Efficiency Act mandates PUE of 1.2 or better from 2026 onward.
- [industry-report] TenneT, Uniper Partner for Power Station for Frankfurt Region — Rigzone — https://www.rigzone.com/news/tennet_uniper_partner_for_power_station_for_frankfurt_region-25-jan-2026-182841-article/
  > Uniper and TenneT agreed to develop a new central network node in Grosskrotzenburg to serve data center-driven growth in power demand in the greater Frankfurt area, targeting to start operation earlier than planned.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the metro (Frankfurt), the queue (24–36 months), quantified pipeline (542 MW UC / 383 MW planning), 2.2% vacancy, DE=0.50 with Frankfurt ~75%, the 0.42 low bound, and a concrete 0.6x obtainableFactor perturbation. Instruments (PDU POs at fit-out), regulation (EnEfG), and dated windows are all specified.
- *nonObviousness*: The 'whyMissable' field correctly identifies that the ledger has no metro dimension, so a country-level DE share reads as diversified when ~37% physically routes through one interconnection queue — a genuine structural blind spot. Falls short of 4 because Frankfurt's dominance of German DC capacity is well-known industry context a diligent founder might surface, and the risk's own stances (NTT FRA6, Rhine-Main migration) show the concentration is already partially dissolving.
- *mechanismDepth*: Each hop is referenced and independently plausible: queue sets energization dates → energization gates fit-outs → PDU POs land at fit-out → Year-1 obtainable pace compresses while the 2030 CAGR survives on paper. The weak link, acknowledged in the risk's own rationale, is that UC projects typically hold secured allocations and new capacity is migrating outside the single queue — so the '37% through one substation queue' hop would take damage under hostile questioning.
- *evidenceQuality*: The key premise (24–36-month waits, near-zero utility capacity, EnEfG friction) has multiple independent corroborating sources, and the risk honestly logs contradicting stances (TenneT/Uniper switchyard, NTT FRA6 relocation) and revised likelihood accordingly. Held to 3 because the corroborating publishers (innobu, KiTalent) are lower-tier, and the contradicting evidence undermines the load-bearing concentration framing, not just timing.
- *decisionRelevance*: The mitigations directly resequence next-two-quarter activity: energization-date audit of the 542 MW cohort, Year-1 territory rebalance toward Berlin/CEE, and a retrofit SKU that decouples revenue from new grid connections. Indicators carry named venues (JLL prints, TenneT/Amprion disclosures) and explicit thresholds (<+50 MW over two half-year prints, ≥2-quarter re-guides), making it monitorable as stated.

*Provenance: raw evidence `risks/raw/evidence/risk.demand-discontinuity.frankfurt-grid-queue-de-slip.json` · transcripts `risks/raw/llm/`*

---

### Serviceable share ignores timing, overstating Year-1 demand

`risk.base-rate-analogy.prelet-lockin-serviceable-window` · **rock** · model-structure · lens: base-rate-analogy · p=45% (base-rate) · judge 16/20

The model sets serviceable reach at 0.55, treating reach as a fixed property. But for data-center electrical gear, demand that invoices in the next 12 months was already specified at design stage, and the entrant's EU compliance stack takes 6-9 months before it can even bid. Demand that is both open and reachable in Year 1 is closer to 0.35, so the Year-1 number is too high.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 1.05 (−€0.60M) · E[YAM loss] −€0.27M

**Perturbation:** set serviceableFactor → 0.35 (Static reach haircut tightened to window-adjusted reach: demand that is both uncommitted and open to a vendor whose certification completes mid-year)

**Mechanism:**
- *trigger*: Rack-power specs for 2026 capacity were locked before launch. `[ledger:obtainableFactor, ledger:shape.cagr]`
- *propagation*: Entrant cannot bid until EU certifications clear in 6-9 months. `[digest:serviceable-benchmark#c13, digest:serviceable-benchmark#c11, profile:Stage]`
- *model-impact*: Reach of 0.55 counts demand unreachable in Year 1; effective share near 0.35. `[ledger:serviceableFactor, digest:serviceable-benchmark#c1]`

**Why missable:** The number looks handled because it already discounts 45% of the market and cites the regulatory stack, but it checks the level, not the timing.

**Falsifier:** Three or more EU operator RFQs for rack PDUs in the next two quarters that accept vendors certifying mid-tender and award within 9 months of publication.

**Classification:** ERROR — research settles it · settle test: The entrant's EU certification timeline (EN 50600, ecodesign 2019/424, CE/TÜV lead times) and the share of 2026 data-center electrical-gear demand already spec-locked at design stage — both knowable today from certification bodies and design-cycle data, not future events.

**Proposed correction:** `serviceableFactor` → 0.35 (band 0.28–0.45) — Serviceable share must exclude demand already spec-locked before launch and demand unreachable during the 6-9 month certification window, lowering effective Year-1 reach from 0.55 to ~0.35.

**Likelihood rationale:** Data-center hardware sales cycles of 12-18 months and certification of 6-9 months are well-established. The open question is what fraction of demand is spot-contestable, which no source quantifies.

**Early warnings:**
- Time from RFQ publication to award for rack-power line items in CE — watch: TED (Tenders Electronic Daily) and major CE colo operator procurement portals (e.g., NTT, Vantage, Data4 supplier registration pages) — trigger: Median award cycle >9 months, or supplier prequalification requiring completed certification at bid time (increases p)
- Quoted lead time for the venture's own TÜV/CE certification slots — watch: TÜV NORD / TÜV SÜD test-lab booking confirmations and notified-body queue quotes — trigger: Certification completion date beyond month 8 of the launch year (increases p)

**Mitigations:**
- [information] Commission a bottom-up channel-coverage model (named CE accounts × spec-lock status × certification-at-bid requirements) to produce a window-adjusted serviceable estimate — VOI(serviceableFactor) = €0.0M
- [operational] Start the full EU certification stack before launch and pre-register as a supplier on operator procurement portals so month-1 of the commercial window is not month-1 of the compliance clock

**Evidence:** none found (corroborated) — flagged, not killed.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (serviceableFactor 0.55 → 0.35), the certification stack (WEEE, CE, TÜV, RoHS, EN 50600) with a 6-9 month clock, and monitorable venues (TED, TÜV NORD/SÜD queues, named operators NTT/Vantage/Data4). Quantities, actors, and timelines are all pinned to the YAM window.
- *nonObviousness*: The raw ingredients are in the ledger — the risk itself concedes 'the model's own cross-check admits 12-24 month procurement lock' — but the intersection argument (serviceable share is time-indexed, so 0.55 can be right in steady state and wrong for every month of year one) is a genuine structural insight the whyMissable field articulates well. Docked one point because a founder staring at the obtainableFactor cross-check is partway there.
- *mechanismDepth*: Each hop (spec-lock trigger → compliance-gated bidding → window-adjusted serviceable share) carries refs and is independently plausible. But the landing value of 0.35 is asserted, not derived — a hostile 'why 0.35 and not 0.45 or 0.25?' has no answer in the risk, and the likelihood rationale admits no source quantifies the contestable fraction.
- *evidenceQuality*: The strongest external quotes concern HV transformer lead times (48-60 months) and hyperscale build cycles, which corroborate an adjacent reference class rather than the load-bearing premise that rack-PDU demand is spec-locked pre-launch; two stances are 'silent' and the evidence array is empty despite an evidenceStatus of 'corroborated'. The rationale is honest about the absence of data on contestable share, which fits the speculative-but-well-argued anchor, not the ≥2-independent-sources anchor.
- *decisionRelevance*: Both mitigations (start certification pre-launch to parallelize the cert→bid path, commission the window-adjusted bottom-up model the ledger's promotionPath already names) change sequencing and spend in the next two quarters, and the perturbation to 0.35 materially reprices year-one revenue. Indicators are concrete and checkable at TED and TÜV booking queues with explicit thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.base-rate-analogy.prelet-lockin-serviceable-window.json` · transcripts `risks/raw/llm/`*

---

### Market ceiling may be too low; plan sized for wrong market

`risk.definition-scopedown.band-top-contaminated-comparator` · **rock** · fact · lens: definition-scopedown · p=40% (evidence) · judge 17/20

The model caps the market base at €360M, cut down from €495M using a 10–12% growth rate. But that growth rate comes from a €8.5–9.5B report covering a far broader category than rack PDUs, so the fix imported the same error it claimed to remove. Germany alone is forecast at $509.6M by 2031, already above the whole base. If the true base sits at €400M or more, the Year-1 plan is sized for the wrong market.

**Impact (engine):** TAM +€300M → +€420M (+€120M) · YAM 1.65 → 2.31 (+€0.66M) · E[YAM loss] −€0.26M

**Perturbation:** set tamBase → 420 (Base above the current band top, consistent with the Germany-alone $509.6M signal and the upper global anchors)

**Mechanism:**
- *trigger*: The growth rate used to cut the ceiling came from a broad multi-category report, not rack PDUs. `[digest:tam-base#c4, ledger:tamBase]`
- *propagation*: Germany alone reaches $509.6M by 2031 and global anchors span $1.7B to $3.94B. `[digest:tam-base#c9, digest:tam-global-crosscheck#c4, digest:tam-global-crosscheck#c9]`
- *model-impact*: A low base sizes the Year-1 plan too small for certification and channel needs. `[ledger:tamBase, ledger:serviceableFactor, ledger:obtainableFactor]`

**Why missable:** Cutting an inflated ceiling reads as rigor, so nobody audits the number that justified the cut.

**Falsifier:** A dedicated rack-PDU report showing the EU base at or below €360M for 2025/2026.

**Classification:** ERROR — research settles it · settle test: The directly-scoped IndexBox EU Rack PDUs report (country tables) or the Mordor/Grand View global rack-PDU base with a defensible Europe/CE regional split — a purchasable existing dataset that pins the 2025/2026 base today.

**Proposed correction:** `tamBase` → 330 (band 280–400) — The scope-down uses Grand View's global $2.81B, but Mordor's more recent figure ($2.78B→$3.01B 2026) and Germany-alone forecasts ($509.6M by 2031) suggest the €360M band top is too tight; widening to €400M and re-centering to €330M reflects a defensible CE rack-PDU base without importing the broad PDU+PSU category error.

**Likelihood rationale:** Several broader datapoints point above the band, but each carries the same category-breadth uncertainty. The true rack-PDU base remains untested behind paywalled reports, so the ceiling is unproven rather than proven wrong.

**Early warnings:**
- Directly-scoped EU/DE rack-PDU headline figures — watch: IndexBox EU Rack PDUs and Germany Rack PDUs reports ($4,000 each); Omdia rack-PDU vendor share table — trigger: EU headline >€400M or Germany >€180M (increases p)
- Incumbent EMEA rack-power growth outrunning the model's 9% CAGR — watch: Vertiv and Legrand quarterly earnings calls, EMEA data-center product-line commentary — trigger: Two consecutive quarters of >15% YoY EMEA rack-power growth (increases p)

**Mitigations:**
- [information] Commission the IndexBox EU Rack PDUs report to fix the base directly — it resolves this hypothesis and the Europe-share hop simultaneously — VOI(tamBase) = €30.0M
- [operational] Build the Year-1 operating plan with staged capacity options (certification scope and contract manufacturing volumes expandable at 6-month gates) rather than fixed to the €165M SAM

**Evidence (corroborated):**
- [industry-report] European Union Power and Cable Management - Market Analysis, Forecast, Size, Trends and Insights — IndexBox — https://www.indexbox.io/store/european-union-power-and-cable-management-market-analysis-forecast-size-trends-and-insights/
  > The European Union Power And Cable Management market is estimated at €8.5–€9.5 billion in 2026... Managed and intelligent power distribution units (PDUs) represent the fastest-growing segment, expanding at 10–12% annually
- [industry-report] Data Center Rack Power Distribution Unit (PDU) Market Size & Share Analysis — Mordor Intelligence — https://www.mordorintelligence.com/industry-reports/data-center-rack-pdu-market
  > the data center rack power distribution unit (PDU) market size is expected to increase from USD 2.78 billion in 2025 to USD 3.01 billion in 2026 and reach USD 4.62 billion by 2031, growing at a CAGR of 8.96%

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names exact values and moves (€495M→€360M band cut, 10–12% IndexBox comparator, €8.5–9.5B basket, $509.6M Germany, $1.7–3.94B anchor spread), ledger nodes (tamBase, serviceableFactor, obtainableFactor), and priced instruments ($4,000 IndexBox reports). Perturbation and thresholds are concrete numbers, not gestures.
- *nonObviousness*: The core claim is not 'the band edge might be wrong' but that the correction itself imported the same definitional contamination it purged — a NEW reason the whyMissable field convincingly argues hides behind the appearance of rigor. Docked one point because half the narrative's upward pressure (wide global anchors, Germany forecast) draws on datapoints a careful ledger reader could already assemble.
- *mechanismDepth*: Three-step chain (contaminated comparator → base likely above band → under-provisioned cert scope and channel in a 12–24 month spec-ahead market) with refs at each hop and independently plausible links. The propagation hop is the weak arrow: the risk's own likelihood rationale concedes the upward datapoints 'carry the same definitional contamination,' so 'ceiling unproven' does not fully entail 'base above band.'
- *evidenceQuality*: The load-bearing trigger premise — the 10–12% figure comes from the broad €8.5–9.5B basket — is confirmed verbatim by an attached IndexBox source, and Mordor's ~9% rack-PDU CAGR independently contradicts the comparator. But the falsifier premise (EU base >€360M) is untested behind a paywall, and the dedicated rack-PDU stance is 'silent,' which the likelihood rationale honestly admits.
- *decisionRelevance*: Directly changes near-term spend and sequencing: a $4,000 information buy against a €60M+ band question and staged capacity gates instead of a fixed €165M-SAM Year-1 plan. Both indicators (report headlines, incumbent EMEA growth) have explicit thresholds and monitoring venues.

*Provenance: raw evidence `risks/raw/evidence/risk.definition-scopedown.band-top-contaminated-comparator.json` · transcripts `risks/raw/llm/`*

---

### Unsourced 'Europe = 30%' hop could drop the base below its floor

`risk.ledger-self-audit.europe-thirty-percent-arithmetic-ghost` · **rock** · fact · lens: ledger-self-audit · p=42% (evidence) · judge 17/20

The model builds tamBase from a global figure times a 'Europe = 30%' share, and presents it as a bounded 240 to 360 range. But that 30% share is an analyst guess with no source, and the global anchor itself ranges from $1.7B to $5.3B, wider than the stated band. A hostile reviewer who swaps in the lowest credible numbers lands near €200M, below the floor, so the Year-1 base cannot survive audit.

**Impact (engine):** TAM +€300M → +€210M (−€90.00M) · YAM 1.65 → 1.16 (−€0.49M) · E[YAM loss] −€0.21M

**Perturbation:** set tamBase → 210 (Low-credible-anchor reconstruction: bottom-quartile global rack-PDU estimate × conservative Europe share × unchanged CE-7 step — the number a hostile reviewer writes in the margin)

**Mechanism:**
- *trigger*: Diligence checks the global anchor and finds estimates from $1.7B to $5.3B. `[digest:cust-mix#c9, digest:cust-mix#c11, ledger:tamBase]`
- *propagation*: The unsourced 30% Europe share cannot rescue a contested anchor. `[ledger:tamBase, digest:geo-region-denominator#c5, digest:geo-region-denominator#c0]`
- *model-impact*: Every downstream number inherits a base below the stated band. `[ledger:tamBase, ledger:serviceableFactor]`

**Why missable:** A removed €495M ceiling makes the base look stress-tested, but the fix left the weakest hop, the unsourced Europe share, untouched.

**Falsifier:** Commissioned IndexBox EU rack-PDU country tables placing the CE-7 base at €270M or above.

**Classification:** ERROR — research settles it · settle test: The commissioned IndexBox EU Rack PDUs country-table report (or an equivalent directly-scoped Europe/CE rack-PDU figure) would settle this today — it pins the base directly rather than relying on a global anchor × unsourced 30% hop. This is a definitional/scope-mismatch about today's market, not a future unfolding.

**Proposed correction:** `tamBase` → 300 (band 200–360) — The Europe share is an unsourced analyst guess and the global anchor itself ranges $1.58B–$4.8B, so the lower bound must widen to ~€200M to honestly reflect the contested inputs until the directly-scoped EU figure is commissioned.

**Likelihood rationale:** The 2.3x global spread and the unsourced Europe hop are documented facts, so the defensibility failure is certain. Whether the true value sits below the floor is a judgment call, since a Germany-alone $509.6M figure cuts the other way.

**Early warnings:**
- IndexBox EU rack-PDU report headline (currently paywalled) or any second Europe-scoped rack-PDU figure — watch: IndexBox price list / report catalog; Omdia and Dell'Oro rack-power publication schedules — trigger: Any directly-scoped EU figure implying CE-7 <€250M (increases p)
- Convergence or further divergence of next-vintage global rack-PDU estimates — watch: Grand View, Mordor, QY Research 2026 report refreshes — trigger: Next-vintage spread across publishers remaining >1.8x (increases p)
- Europe regional revenue share in any rack-PDU-specific report vintage — watch: Grand View rack-PDU report regional segmentation; IndexBox world benchmark report vs EU report headline ratio — trigger: Europe stated or derivable at <27% (increases p)
- EMEA vs Americas vs APAC rack-power revenue mix in incumbent disclosures — watch: Vertiv 10-K segment reporting; Legrand annual report data-center line commentary — trigger: EMEA rack-power consistently <25% of global segment revenue (increases p)

**Mitigations:**
- [information] Commission the IndexBox EU rack-PDU country tables now — the ledger's own promotion path — before the model is shown to any external audience — VOI(tamBase) = €30.0M
- [operational] Build a bottom-up cross-check: CE-7 installed MW × racks/MW × PDUs/rack × ASP, so the top-down chain has an independent second method rather than a contaminated comparator

**Evidence (corroborated):**
- [industry-report] Data Center Rack Power Distribution Unit Market Report 2033 — Grand View Research — https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market
  > North America held 38.0% revenue share of the global data center rack power distribution unit market. Global market size estimated at USD 2.81 billion in 2025.
- [analyst-estimate] Data Center Rack PDU - Global Market Share and Ranking, Forecast 2024-2030 — QY Research — https://www.qyresearch.com/reports/3520535/data-center-rack-power-distribution-unit--pdu
  > The global market for Data Center Rack Power Distribution Unit (PDU) was estimated to be worth US$ 1582 million in 2023, far below other publishers' figures.
- [analyst-estimate] Power Distribution Unit Market Size ($8.5 Billion) 2030 — Strategic Market Research — https://www.strategicmarketresearch.com/market-report/power-distribution-unit-market
  > The Power Distribution Unit (PDU) Market was valued at USD 4.8 billion in 2024 and is projected to reach around USD 8.5 billion by 2030.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact ledger node (tamBase), the exact unsourced hop ('Europe ≈ 30%'), specific publishers and figures (GVR NA 38%, QY, SMR $5.3B), a perturbation value (€200-210M vs 240–360 band), and a named falsifier path (IndexBox EU tables at ≥€270M).
- *nonObviousness*: This is not 'the band edge could be true' — it names a NEW reason the floor itself is fictitious: an inserted analyst ratio multiplied on a >2x-contested anchor, hidden by a refinement cycle that 'reads as rigor' (whyMissable). A founder who read the ledger might still trust the audited-looking chain, though a careful one auditing tamBase's sourcing could plausibly find the unsourced hop.
- *mechanismDepth*: Three-step chain (contested anchor → unrescued multiplier → below-band skew) with refs at every hop, and the propagation step preempts the obvious rescue via the Statista/CBRE cross-check. The 'scope-inflated vs CBRE' sub-claim and the exact reconstruction to €210 are asserted rather than fully derived, so one hostile 'why?' lands.
- *evidenceQuality*: The load-bearing premise (GVR publishes only NA 38%, no Europe figure; global anchors diverge) is corroborated by 3+ attached sources, and the falsifier's silent stance is honestly recorded. But the narrative's QY figure ($3,255M) contradicts its own attached excerpt ($1,582M), and the SMR $4.8B is broader-category PDU, so the '>2x spread' partly commits the scope-mixing sin the risk itself condemns.
- *decisionRelevance*: The primary mitigation (commission the IndexBox tables before any external audience sees the model) is a specific, cheap, this-quarter spend decision on the ledger's own promotion path, plus a bottom-up second method. Both indicators have named venues and numeric thresholds (CE-7 <€250M; spread >1.8x), making it directly monitorable.

*Provenance: raw evidence `risks/raw/evidence/risk.ledger-self-audit.europe-thirty-percent-arithmetic-ghost.json` · transcripts `risks/raw/llm/`*

---

### Large operators buy through frameworks the entrant cannot bid

`risk.ledger-self-audit.framework-agreements-hollow-large-operator-cell` · **rock** · competitive · lens: ledger-self-audit · p=48% (evidence) · judge 17/20

The model assumes large operators are the first buyer and gives that group the biggest channel weight at 0.40. But we found their power-equipment spend runs through multi-year global framework agreements and bundled rack contracts, not discrete bids a regional entrant can win. If half that 0.40 is bought this way, the Year-1 reachable spend is far smaller than the SAM claims.

**Impact (engine):** TAM +€300M → +€234M (−€66.00M) · YAM 1.65 → 1.29 (−€0.36M) · E[YAM loss] −€0.17M

**Perturbation:** set cust.operator-large → 0.18 (Framework- and bundle-foreclosed portion (~half) of the direct large-operator cell removed from contestable spend; siblings deliberately not re-normalized — this is absolute shrinkage of reachable spend, not a mix-shift)

**Mechanism:**
- *trigger*: Large operators buy power gear through standing frameworks and bundles. `[digest:cust-mix#c12, ledger:cust.operator-large]`
- *propagation*: The 0.40 share rests on one figure measuring exposure, not contestability. `[digest:cust-mix#c0, ledger:cust.operator-large]`
- *model-impact*: Contestable spend is below 0.40, so Year-1 pipeline math overstates. `[ledger:cust.operator-large, profile:Who is the primary buyer you'll sell through first?, ledger:serviceableFactor]`

**Why missable:** The founder's own answer says large operators buy direct, so 0.40 looks like the biggest, most accessible cell rather than one closed to entrants.

**Falsifier:** Three or more large-operator PDU purchases in the next 12 months run as open multi-vendor bake-offs won by non-incumbent vendors.

**Classification:** ERROR — research settles it · settle test: The share node measures exposure (large operators = 0.40 of PDU spend), but the load-bearing claim is that a portion of that spend is non-contestable today because it runs through standing frameworks/SCAs/bundles. This is settleable now: procurement-model documentation (SCA/framework announcements, vendor case studies showing standardized full-suite deals) plus a handful of structured operator/distributor interviews establish what fraction of large-operator PDU spend is bought via multi-year frameworks vs. discrete contestable bids. That is today's market structure, not a future unfolding.

**Proposed correction:** `cust.operator-large` → 0.24 (band 0.18–0.33) — The 0.40 conflates exposure with contestability; evidence (Digital Realty SCA, Eaton standardized full-suite colo deals) shows a large share of large-operator spend is locked in multi-year frameworks/bundles, so contestable Year-1 share should be roughly halved to ~0.24.

**Likelihood rationale:** Every procurement case found showed bundled or framework buying, with no contested standalone PDU deal at a large operator. The open question is how much is foreclosed, not whether the mechanism exists.

**Early warnings:**
- Structure of large-operator PDU procurement: discrete lots vs bundled fit-out packages — watch: TED (Tenders Electronic Daily) filtered for PDU/rack-power CPV codes in DE/NL/PL; Digital Realty and Equinix supplier-announcement pages — trigger: <2 standalone, multi-bidder PDU lots from CE large operators over two consecutive quarters (increases p)
- New or renewed multi-year power-infrastructure framework agreements between colo REITs/hyperscalers and Schneider/Vertiv/Eaton — watch: Schneider and Vertiv quarterly earnings calls and press rooms; operator capex-call commentary — trigger: ≥2 new CE-relevant frameworks announced in 12 months (increases p)
- Approved-vendor-list (AVL) openings at CE colocation operators — watch: Operator supplier-qualification portals (Equinix, NTT, Data4, Atman) — trigger: Any AVL round explicitly inviting new rack-PDU vendors (decreases p)
- Bidder counts and substitution clauses on standalone rack-PDU tenders — watch: TED (Tenders Electronic Daily) award notices and operator supplier portals — trigger: Median bidders \u22642 or 'no substitution' language on >half of observed PDU line items (increases p)

**Mitigations:**
- [information] Run 5 structured procurement interviews at CE large operators to split the 0.40 cell into framework-locked vs contestable spend — VOI(cust.operator-large) = €10.5M
- [strategic] Re-sequence Year-1 GTM toward mid-market colo and enterprise retrofit, where discrete PDU purchasing is documented, and treat large operators as a Year-2+ AVL-qualification play
- [contractual] Pursue sub-supplier status inside one integrator's bundle (rack integrator or fit-out contractor) rather than competing against the bundle

**Evidence (corroborated):**
- [industry-report] Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement — Schneider Electric / PRNewswire — https://www.prnewswire.com/news-releases/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-to-meet-rising-data-center-demand-302620427.html
  > Digital Realty has signed a $373 million Supply Capacity Agreement (SCA) for UPS, Low Voltage Switchgear, and Pre-Fabricated Skids. The strategic shift to an SCA model provides guaranteed capacity and economies of scale, while preserving flexibility for a dynamic, multi-vendor environment.
- [industry-report] Colocation provider standardizes with Eaton for full solution suite — Eaton — https://www.eaton.com/content/dam/eaton/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/power-xpert-9395/9395p/dc-blox-success-story/eaton-dc-blox-success-story-CS153091EN.pdf
  > Eaton supplied the colocation provider with complementary data center solutions including racks and PDUs as part of a standardized full solution suite deployed across all data center locations.
- [triangulation] Enlogic Power Distribution Units bid result / China Unicom PDU inquiry — UtahBids / 乙方宝 — https://www.utahbids.net/bid-result/enlogic_power_distribution_units-14182081
  > Discrete competitive PDU procurements do occur — Intellivex won University of Utah's Enlogic PDU solicitation via open bid; China Unicom Shanghai ran a discrete inquiry for 320 PDUs — but these are university/telco-regional buyers, not the hyperscale/colo direct-buy cell.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (cust.operator-large, 0.40), a concrete perturbation (set 0.18), named actors and instruments (Digital Realty–Schneider $373M SCA, Eaton bundles, integrator fit-outs), and monitorable indicators down to TED CPV filters and quarterly thresholds. Nothing is left as a vague 'market may be smaller' gesture.
- *nonObviousness*: It does not just say the 0.40 band edge could bind — it names a NEW reason: the whyMissable field shows 'buy direct' (the founder's own GTM answer) hides framework-locking, and the propagation step exposes that the only quantitative datapoint behind the channel axis measures DC exposure, not contestability. Falls short of 4 because 'big operators buy via frameworks' is a pattern a procurement-literate founder might independently surface.
- *mechanismDepth*: Three referenced links (trigger→propagation→model-impact) each survive a 'why?' — including the sharp derivation critique that the 62%-direct figure doesn't measure bid contestability. The final hop from mechanism to the specific ~half foreclosed fraction (0.40→0.18) is asserted, and the rationale itself admits the fraction is 'unquantified in all sources'.
- *evidenceQuality*: The framework/bundle mechanism has ≥2 independent corroborating sources (Schneider–DR SCA, Eaton/DC BLOX, DCD), and the risk honestly lists contradicting tenders (Utah, China Unicom) and uses them to temper the likelihood revision. The load-bearing quantitative premise — the foreclosed fraction — remains unsourced, capping this below 4 despite the honest handling.
- *decisionRelevance*: Mitigations directly re-sequence Year-1 GTM (mid-market first, large operators as Year-2 AVL play) and specify a near-term VOI spend (5 procurement interviews on the 0.40 cell), both actionable within two quarters. All three indicators name concrete venues (TED, earnings calls, AVL portals) with explicit update thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.ledger-self-audit.framework-agreements-hollow-large-operator-cell.json` · transcripts `risks/raw/llm/`*

---

### Intelligent-PDU market is more locked up than headline shows

`risk.competitive-foreclosure.intelligent-pdu-concentration-shrinks-serviceable` · **rock** · model-structure · lens: competitive-foreclosure · p=28% (evidence) · judge 16/20

The model keeps 55% of demand reachable, based only on meeting regulations like EN 50600 and CE/TÜV. But the venture actually sells intelligent PDUs, where Legrand owns two of the leading brands and buyers lock their specs to specific vendors. That means true reachable demand falls toward 40%, cutting the Year-1 serviceable market.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 1.20 (−€0.45M) · E[YAM loss] −€0.13M

**Perturbation:** set serviceableFactor → 0.4 (Regulatory-clear but DCIM/spec-locked demand removed from the serviceable share)

**Mechanism:**
- *trigger*: Legrand owns Raritan and Server Technology; Vertiv holds Geist `[digest:cr3-vendors#c4, digest:cr3-vendors#c0, ledger:shape.cr3]`
- *propagation*: Buyers write specs around their DCIM system, blocking outsiders `[digest:cust-mix#c13, digest:cr3-vendors#c12, digest:cr3-vendors#c10]`
- *model-impact*: Reachable share drops from 0.55 toward 0.40 `[ledger:serviceableFactor, profile:Product]`

**Why missable:** The team has both a haircut and a concentration figure, so both boxes look ticked, but the two numbers describe different scopes and no node links them, leaving the DCIM spec-lock in the seam between them.

**Falsifier:** An Omdia table showing intelligent-PDU top-3 share below 50%, or three or more operator specs requiring only open protocols like SNMP or Redfish with no vendor-certified list.

**Classification:** ERROR — research settles it · settle test: An Omdia or IHS Markit intelligent-PDU market-share table showing current top-3 (Legrand/Raritan+ServerTech, Vertiv/Geist, Schneider) concentration, plus a sample of current EU operator PDU RFQs showing whether specs require vendor-certified lists or accept open protocols (SNMP/Redfish/DSP2056) — both are existing/purchasable artifacts settling today's reachable share.

**Proposed correction:** `serviceableFactor` → 0.45 (band 0.4–0.55) — Intelligent-PDU segment is concentrated among a few vendor/DCIM ecosystems that skew procurement to certified lists, so regulatory-clearance-only reachability of 0.55 overstates true addressable share; but published open standards (Redfish DSP2056, IETF YANG) cap the lock-in, warranting ~0.45 rather than 0.40.

**Likelihood rationale:** The ownership consolidation is documented and DCIM compatibility is a known buying criterion, but the actual spec-locked share of demand is unmeasured. Published open protocols like Redfish and Modbus weaken the lock-in premise, so likelihood drops modestly from 0.35.

**Early warnings:**
- DCIM/compatibility language in CE colo and enterprise PDU specifications — watch: TED tender technical annexes; colo operator technical-standards documents (Equinix/NTT design guides); Data Centre World CE conference specs sessions — trigger: Majority of sampled specs naming vendor-certified DCIM compatibility rather than open protocols (increases p)
- Legrand intelligent-PDU portfolio integration moves (Raritan/Server Technology product-line merges, unified DCIM certification programs) — watch: Legrand investor day materials; Raritan and Server Technology product announcements — trigger: Announcement of a unified compatibility/certification program spanning both brands (increases p)

**Mitigations:**
- [information] Purchase the Omdia Rack PDU Annual Market Analysis (2024 base, vendor shares) to measure intelligent-PDU concentration directly — VOI(serviceableFactor) = €0.0M
- [strategic] Engineer and certify against open standards (Redfish/SNMP) and the top two third-party DCIM platforms before launch, converting spec-locked demand into reachable demand
- [information] Sample 20 recent CE PDU specifications and count spec-open vs vendor-locked language to bound the ecosystem haircut empirically — VOI(serviceableFactor) = €0.0M

**Evidence (contested):**
- [industry-report] Schneider Electric and Vertiv are Leading Players in the Data Centre PDU Market — MarketsandMarkets — https://www.marketsandmarkets.com/ResearchInsight/data-center-pdu-companies.asp
  > Schneider Electric (France), Vertiv (US), Eaton (Ireland), Legrand (France), and ABB (Switzerland) are among the major players in the data center PDU market. Market participants are expanding their intelligent PDU portfolios
- [industry-report] Redfish for Power Distribution Equipment (DSP2056 v1.1.0) — DMTF — https://www.dmtf.org/sites/default/files/standards/documents/DSP2056_1.1.0.pdf
  > Redfish for Power Distribution Equipment — a published, vendor-neutral management standard for PDUs, indicating open-protocol interoperability rather than closed vendor spec-lock.
- [industry-report] A YANG Model for SmartPDU Monitoring and Control — IETF (Huawei/Telefonica) — https://www.potaroo.net/ietf/ids/draft-ahc-green-smartpdu-yang-00.txt
  > Current SmartPDU solutions are largely proprietary... The proposed YANG model provides a vendor-neutral framework for configuration, monitoring, and control of intelligent power distribution systems.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names specific actors and brands (Legrand/Raritan/Server Technology, Vertiv/Geist, Schneider), exact node values (shape.cr3=0.55, serviceableFactor 0.55→0.40), and concrete monitoring instruments (Omdia vendor-share table, TED tender annexes, Equinix/NTT design guides). Nothing in the perturbation or indicators is generic.
- *nonObviousness*: The scope-mismatch argument — blended CR3 is broader than the product market while serviceableFactor's regulatory logic is narrower than reality, with the DCIM spec-lock falling in the seam — is a genuinely new reason, not a band-edge claim. Docked one point because intelligent-PDU brand consolidation itself is well-known and a diligent founder might reach the spec-lock question from the cust-mix digest cited.
- *mechanismDepth*: Three-step chain with refs at every hop (consolidation → spec-locked procurement → serviceableFactor omission), and each link is independently plausible. The propagation step honestly concedes the spec-locked fraction is 'real but unmeasured,' so the 0.55→0.40 magnitude rests on judgment rather than a defended quantity — a hostile 'why 0.40?' has no answer in the chain.
- *evidenceQuality*: The load-bearing spec-lock premise is contradicted by four cited sources (Redfish DSP2056, IETF YANG draft, Schneider Modbus map, ATEN SNMP), which the risk itself flags via evidenceStatus 'contested' and a likelihood revision from 0.35 to 0.28. The contradictions show open standards exist, not that procurement is spec-open, and the concentration premise has two corroborating sources — so honest-contested rather than refuted.
- *decisionRelevance*: Mitigations change spend and sequencing within two quarters: buying the named Omdia report, pre-launch Redfish/DCIM certification, and a 20-spec sampling exercise are all immediately actionable. Both indicators (TED spec language, Legrand certification-program announcements) are concretely monitorable with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.competitive-foreclosure.intelligent-pdu-concentration-shrinks-serviceable.json` · transcripts `risks/raw/llm/`*

---

### CE-7 share is based on old racks, but new sales chase new builds

`risk.definition-scopedown.stock-vs-flow-intensity-mismatch` · **rock** · model-structure · lens: definition-scopedown · p=38% (evidence) · judge 17/20

The model splits Europe's colocation market by standing capacity, giving CE-7 a 39.8% share. But rack-PDU revenue is earned when new capacity is built or refreshed, and 57% of 2025's 937MW of new supply lands in FLAPD, outside most of CE-7. That means the €300M overstates where 2026 PDU orders will actually be written.

**Impact (engine):** TAM +€300M → +€240M (−€60.00M) · YAM 1.65 → 1.32 (−€0.33M) · E[YAM loss] −€0.13M

**Perturbation:** scale tamBase → 0.8 (Re-weight the CE-7 share from standing stock toward capacity-additions flow (~32% vs 39.8%))

**Mechanism:**
- *trigger*: New builds drive sales: 57% of 937MW lands in FLAPD `[digest:geo-region-denominator#c6, digest:geo-region-denominator#c7, digest:geo-region-denominator#c9]`
- *propagation*: Growth goes to London, Milan and Madrid, not CE-7 `[digest:geo-region-denominator#c3, digest:geo-region-denominator#c8, digest:geo-region-denominator#c19]`
- *model-impact*: The 39.8% share overstates near-term PDU revenue for CE-7 `[ledger:tamBase, digest:geo-region-denominator#c4]`

**Why missable:** Splitting by standing capacity is the standard method and every input is sourced and recent, so the flaw hides in an unstated assumption that PDU revenue per standing MW is the same everywhere.

**Falsifier:** CBRE's 2025–26 pipeline showing CE-7 capturing 38% or more of new European colocation MW delivered.

**Classification:** ERROR — research settles it · settle test: CBRE's 2025-26 pipeline dataset (or IndexBox EU rack-PDU country tables) showing the geographic split of new/refresh MW by country — this exists today and would settle whether CE-7's 39.8% standing-capacity share matches where 2026 PDU orders get written.

**Proposed correction:** `tamBase` → 260 (band 210–320) — PDU revenue tracks new-build/refresh flow, not standing capacity; with 57-70% of new supply landing in FLAPD (mostly outside CE-7), the flow-weighted CE share is materially below the 39.8% standing-share, so the base and band should shift down.

**Likelihood rationale:** Flow clearly concentrates in FLAPD, but Frankfurt and Amsterdam are CE-7 members inside FLAPD, so some flow returns to CE-7. The net deficit is real but likely 5–10 points, not catastrophic.

**Early warnings:**
- CE-7 share of new European colocation MW delivered per quarter — watch: CBRE 'Europe Data Centres Figures' quarterly PDFs (new supply by market) — trigger: CE-7 markets (Frankfurt, Amsterdam, Zurich, Warsaw, Vienna, Prague) <35% of tracked deliveries for two consecutive quarters (increases p)
- Growth differential between CE-7 and non-CE secondary markets — watch: Statista Europe colocation power by country, 2026 vintage vs 2025; CBRE secondary-markets commentary (Milan, Madrid) — trigger: Non-CE secondary markets adding MW at ≥2x the CE-7 ex-DE/NL rate (increases p)
- Directly-scoped EU rack-PDU country revenue data — watch: IndexBox EU Rack PDUs report country tables (the ledger's own pending source); Omdia vendor-share regional cut — trigger: CE-7 revenue share reported below 35% of Europe (increases p)

**Mitigations:**
- [information] Rebuild the CE base on a two-component model: refresh revenue on standing stock plus fit-out revenue on the CBRE delivery pipeline, priced per MW from vendor BOMs — VOI(tamBase) = €30.0M
- [strategic] Position Year-1 offering around retrofit/refresh of CE-7's older standing stock (where stock-based sizing IS the right measure) rather than new-build tenders

**Evidence (corroborated):**
- [industry-report] New Investment in Europe's Data Centre Markets to Hit New Heights in 2025 — CBRE — https://www.cbre.co.uk/press-releases/europes-data-centre-markets-to-hit-new-heights
  > More than half (57%) of this capacity is expected to be delivered in the leading European data centre markets - Frankfurt, London, Amsterdam, Paris and Dublin.
- [industry-report] European Real Estate Market Outlook Mid-Year Review 2025 — Data Centres — CBRE — https://www.cbre.com/insights/books/european-real-estate-market-outlook-mid-year-review-2025/data-centres
  > London and Frankfurt are expected to account for 2.5GW of capacity, or approximately half of the total data centre supply in Europe, by the end of 2025. Most new supply in Europe (70%) will be delivered to the five largest markets – FLAPD.
- [industry-report] Data Centre Take-up in Europe to Reach New Peak in 2025 — CBRE — https://www.cbre.co.uk/press-releases/data-centre-take-up-in-europe-to-reach-new-peak-in-2025
  > Almost half (46%) of the annual take-up this year is expected to be in London and Frankfurt, the two largest colocation data centre markets of Europe.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (tamBase), the exact hop (CE-7 = 39.8% of Europe), quantified flow data (937MW 2025 supply, 57% FLAPD, 85% take-up, London >1GW), a concrete perturbation (scale 0.8, ~32% vs 39.8%), and indicator thresholds ('<35% of tracked deliveries for two consecutive quarters').
- *nonObviousness*: The stock-vs-flow method error is genuinely structural — 'a bias no band edge in the tornado captures' — and the hidden premise (uniform PDU €/MW across regions and vintages) is stated by no source. Docked one point because the flow-concentration clips live in the same digest (geo-region-denominator#c6–c9), so a careful reader had the raw material even if not the framing.
- *mechanismDepth*: Trigger→propagation→impact each carries refs and the Frankfurt/Amsterdam clawback is honestly modeled in the likelihood rationale. But the propagation step's claim that CE-7 stock 'skews toward older, lower-density halls with slower PDU refresh' is asserted on a single ref without measurement, and the 0.8 scale magnitude is a judgment call rather than derived.
- *evidenceQuality*: Multiple attached sources corroborate the FLAPD flow concentration with quotes, but DCD and TechMonitor are reporting CBRE's own figures, so the key premise ultimately traces to one publisher. The load-bearing uniformity assumption is honestly flagged as unmeasured ('no source states because no source measures it'), which is candid but caps corroboration.
- *decisionRelevance*: Mitigations directly change near-term strategy — repositioning Year-1 toward retrofit/refresh of CE-7 standing stock vs new-build tenders — plus a concrete two-component TAM rebuild. Indicators are monitorable quarterly via CBRE delivery PDFs with explicit thresholds and a clean falsifier (CE-7 ≥38% of new MW).

*Provenance: raw evidence `risks/raw/evidence/risk.definition-scopedown.stock-vs-flow-intensity-mismatch.json` · transcripts `risks/raw/llm/`*

---

### OEM/integrator channel closes from both sides, cutting share

`risk.competitive-foreclosure.oem-cell-two-sided-squeeze` · **rock** · competitive · lens: competitive-foreclosure · p=45% (evidence) · judge 17/20

The model assumes the venture can win 0.22 of the OEM/integrator channel in Year 1. But every integrator case study we found picks incumbent brands on certification, DCIM fit and support, while white-label demand goes to low-cost Asian ODMs the entrant cannot match. The genuinely open fraction may be about 0.08, roughly a third of the modeled cell. If so, the channel-mix and Year-1 number are too high.

**Impact (engine):** TAM +€300M → +€258M (−€42.00M) · YAM 1.65 → 1.42 (−€0.23M) · E[YAM loss] −€0.10M

**Perturbation:** set cust.oem → 0.08 (Only the regional, spec-flexible integrator fraction remains addressable; brand-spec and ODM-price fractions foreclosed)

**Mechanism:**
- *trigger*: Integrators pick PDU brands on features and support ecosystems `[digest:cust-mix#c14, digest:cust-mix#c13, ledger:cust.oem]`
- *propagation*: Entrant lacks incumbent ecosystem and ODM cost position `[digest:cr3-vendors#c4, digest:cr3-vendors#c1, profile:Company]`
- *model-impact*: Addressable OEM share falls from 0.22 to about 0.08 `[ledger:cust.oem, ledger:cust.operator-large]`

**Why missable:** The cell looks doubly open because both branded and white-label routes are documented, but each is a separately-held gate and the proof sits in different source types.

**Falsifier:** One CE integrator or OEM signing a design-in or white-label deal with the entrant, or a documented RFQ evaluating a non-incumbent intelligent PDU on merit within Year 1.

**Classification:** ERROR — research settles it · settle test: A CE-region OEM/integrator channel buyer-mix dataset (or 3-5 distributor/integrator interviews plus incumbent-vs-ODM design-win records) quantifying the fraction of intelligent-PDU integrator business open to non-incumbent, non-ODM entrants — this exists today and would settle the 0.22 vs 0.08 dispute without waiting for the market to unfold.

**Proposed correction:** `cust.oem` → 0.08 (band 0.05–0.14) — Integrator case studies show incumbent selection on DCIM/certification/support and white-label going to Asian ODMs, so the genuinely-open fraction is roughly a third of the modeled 0.22 cell.value.

**Likelihood rationale:** Every integrator case study shows incumbent-brand selection and no source quantifies an open OEM share, but the sample is small and behavior for differentiated intelligent PDUs is untested. The 0.22 to 0.08 claim remains unsourced, so confidence in the direction is only modestly raised.

**Early warnings:**
- PDU brands named in European integrator/turnkey rack case studies and reference designs — watch: Vertiv, Legrand, Rittal and Schleifenbauer project case-study pages; DataCenterDynamics build coverage — trigger: ≥3 consecutive quarters of new CE integrator projects specifying only incumbent-brand PDUs (increases p)
- ODM intelligent-PDU pricing and OEM-program activity — watch: Digipower and comparable ODM price lists / OEM program pages; Computex and Data Centre World exhibitor announcements — trigger: ODM per-outlet-managed PDU quotes ≥30% below the entrant's achievable unit cost (increases p)
- ODM expansion into Europe (local stock, CE/TÜV-certified white-label lines) and distributor line-card additions of Asian PDU lines — watch: Digipower and peer ODM product/price lists; distributor line-card announcements (master distributors adding Asian PDU lines) — trigger: ≥1 major CE distributor adding an ODM white-label PDU line (increases p)

**Mitigations:**
- [information] Run a design-in probe with 3 CE rack integrators: submit the product to their qualification process and log the actual selection criteria and thresholds — VOI(cust.oem) = €0.0M
- [strategic] Differentiate on the one axis neither incumbents nor ODMs own regionally: MID-compliant billing-grade metering and local engineering support for CE colo sub-metering requirements
- [contractual] Offer integrators a co-branded (not white-label) program with shared support obligations, splitting the difference between the two closed routes

**Evidence (corroborated):**
- [industry-report] About | Digipower Manufacturing Inc. — Digipower Manufacturing Inc. — https://www.digipower.com.tw/about
  > Founded in 1999, DigiPower began by designing and manufacturing power solutions for OEM and ODM customers worldwide. As a leading rack PDU manufacturer in Taiwan, we focus on data center power distribution and management products
- [triangulation] DCIM Power Solution Helps British Cloud and Networking Provider Exponential-e — Raritan — https://www.raritan.com/assets/re/resources/case_studies/Case_Study_-_Exponential-e_(English).pdf
  > Solution: Power IQ® DCIM Monitoring Software and PX® 5000 Series Intelligent PDUs — incumbent PDU selected bundled with its own DCIM ecosystem for a colocation integrator serving 1700+ customers.
- [triangulation] Telefónica Germany upgrades data center operations with Vertiv PowerIT rPDUs — Vertiv — https://www.vertiv.com/495b0e/globalassets/content---assets-2025/documents/vertiv-telefonica_marketing-thought-leadership-case-study_emea-english.pdf
  > Vertiv and the Telefónica Group have maintained a strong, multi-year partnership... deploying energy-efficient critical infrastructure solutions — incumbent selection driven by existing support relationship.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact ledger node (cust.oem), the 0.22→0.08 quantitative move, specific actors (Digipower, Legrand/Raritan/Server Technology, Vertiv), and monitorable thresholds ('≥30% below entrant unit cost', '≥3 consecutive quarters'). Only missing element is dated triggers, but the falsifier is time-boxed to launch year.
- *nonObviousness*: The reframe in whyMissable — that two documented entry routes are 'two separately-owned gates' rather than redundancy — is exactly the kind of surface appearance that hides the risk from a founder reading the ledger's 0.22 cell. Held back from 4 because 'incumbents win on ecosystem, ODMs win on cost' is a squeeze pattern a competent hardware founder could plausibly generate.
- *mechanismDepth*: Trigger→propagation→model-impact each carries refs (digest:cust-mix#c13/c14, digest:cr3-vendors, ledger nodes) and each hop survives a 'why?' — brand-spec gated by DCIM/support assets, price-spec gated by ODM cost curve. The final hop to ~0.08 is the weak arrow: the 'a third of the cell' fraction is asserted, not derived, as the rationale itself admits.
- *evidenceQuality*: Both qualitative prongs have ≥2 independent corroborations (Digipower for ODM incumbency; Raritan, Server Technology, Vertiv, advanceddatacentre for incumbent-brand integrator selection), and the rationale honestly flags the small case-study sample and the unsourced 0.22→0.08 quantum. The load-bearing addressability number remains uncorroborated, which caps this below 4.
- *decisionRelevance*: The design-in probe with 3 CE integrators and the MID-metering differentiation directly change channel sequencing and product spend in the next two quarters, replacing the unsourced addressability premise with observed gate criteria. Both indicators have named venues (case-study pages, exhibitor announcements) and explicit thresholds, so the risk is monitorable as stated.

*Provenance: raw evidence `risks/raw/evidence/risk.competitive-foreclosure.oem-cell-two-sided-squeeze.json` · transcripts `risks/raw/llm/`*

---

### Year-1 hyperscale demand lands outside Central Europe

`risk.demand-discontinuity.ce-hyperscale-flow-mirage` · **rock** · model-structure · lens: demand-discontinuity · p=42% (evidence) · judge 17/20

The model takes Synergy's 44-48% global hyperscale share and applies it to Central Europe as a flat 0.91 carve-out. But about 60% of Europe's operational hyperscale self-build capacity sits in Ireland, the Netherlands, Sweden and Belgium, mostly outside the venture's reach. The model's largest segment is largely demand the venture cannot reach in Year 1, and it is the exact segment the sell-to-large-operators strategy targets.

**Impact (engine):** TAM +€300M → +€264M (−€36.00M) · YAM 1.65 → 1.45 (−€0.20M) · E[YAM loss] −€0.08M

**Perturbation:** set seg.hyperscale → 0.32 (CE-realized hyperscale slice shrinks in absolute terms; not a mix shift to siblings — the demand flows to geographies outside scope)

**Mechanism:**
- *trigger*: European hyperscale self-build adds 4.2 GW in 2026, up 24%. `[digest:seg-mix#c12, digest:seg-mix#c14]`
- *propagation*: Central Europe's hyperscale sites are gated, so realized share stays low. `[digest:geo-NL#c7, digest:geo-DE#c15, ledger:seg.hyperscale]`
- *model-impact*: The 0.44 share overstates the reachable segment and misleads buyer plans. `[ledger:seg.hyperscale, ledger:cust.operator-large, profile:Who is the primary buyer you'll sell through first?]`

**Why missable:** The node looks well-evidenced and the 0.91 carve-out reads as a conservative haircut, so nobody asks whether hyperscale capacity is skewed away from Central Europe.

**Falsifier:** A Europe-scoped split showing CE-7 hyperscale share at or above 0.40, or two-plus announced 2026 CE-7 hyperscale campuses breaking ground outside the Dutch exception zones.

**Classification:** ERROR — research settles it · settle test: A Europe-scoped (or CE-7) hyperscale capacity split from CBRE or Synergy for Q4 2025 — an existing/purchasable dataset that would settle whether hyperscale's reachable share in Central Europe is ~0.44 or materially lower.

**Proposed correction:** `seg.hyperscale` → 0.22 (band 0.15–0.3) — CBRE Q4-2025 data shows ~60% of Europe's operational hyperscale self-build sits in Ireland/Netherlands/Sweden/Belgium (largely outside the venture's CE reach), so the global-share carve-out overstates the reachable CE hyperscale segment by roughly half.

**Likelihood rationale:** The 60% concentration outside CE-7 is a hard Q4-2025 datapoint and the gating rules are enacted, but hyperscalers also lease CE colo capacity, which keeps some demand in scope. A new 3.2 GW Poland campus shows self-build starting inside CE, nudging likelihood modestly up from 0.40.

**Early warnings:**
- CE-7 share of new European hyperscale self-build MW — watch: CBRE European data centre quarterly updates; DCNN/DC Byte self-build geography breakdowns — trigger: CE-7 receiving <15% of new self-build MW over two quarters (increases p)
- Hyperscaler campus announcements and permitting filings inside CE-7 — watch: Google/Microsoft/AWS EU infrastructure press; German and Polish municipal permitting dockets — trigger: Zero new CE-7 self-build campus starts over two consecutive quarters (increases p)

**Mitigations:**
- [information] Commission a CE-7-scoped segment split (hyperscale/colo/enterprise by MW) as a custom cut from Synergy or DC Byte — VOI(seg.hyperscale) = €6.0M
- [strategic] Rebalance the Year-1 pipeline toward colocation and enterprise cells that are physically located in CE-7, deferring the hyperscale motion until regional presence is proven

**Evidence (corroborated):**
- [industry-report] New hyperscaler capacity to outpace colocation in Europe — Data Centre & Network News (CBRE data) — https://dcnnmagazine.com/business/real-estate/new-hyperscaler-capacity-to-outpace-colocation-in-europe/
  > Hyperscaler self-build capacity across Europe is expected to reach 4.2GW this year, representing 24% year-on-year growth. As of Q4 2025, approximately 60% of Europe’s operational hyperscaler self-build capacity is located in Ireland, the Netherlands, Sweden, and Belgium.
- [industry-report] CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth — DatacenterDynamics (CBRE Europe Data Centres report) — https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/
  > CBRE's report, which covers Q4 2025, predicts hyperscaler self-build capacity will reach 4.2GW in 2026... with 60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium.
- [industry-report] WBS Power Advances 3.2 GW Energy Infrastructure for Hyperscale Data Center Campus — Gulf Oil and Gas — https://1156-799.el-alt.com/webpro1/main/mainnews.asp?id=1112920
  > A new hyperscale data center campus with a target capacity of 3.2 GW will be developed in Lublewo... in northern Poland... WBS Power S.A., which has already secured grid connection conditions for the full 3.2 GW capacity.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names ledger nodes (seg.hyperscale, cust.operator-large), the flat 0.91 carve-out, hard numbers (4.2 GW, +24% YoY, ~60% concentration, 0.44→0.32 perturbation), specific geographies and gating mechanisms (NL municipal ban, Frankfurt 24–36 month queue). Actors, instruments, and dates are all pinned.
- *nonObviousness*: The whyMissable field names a genuine new reason — the global vintages are triangulated and the 0.91 haircut looks conservative, so the geographic skew of the flow has no ledger node to live in. Docked one point because 'global split rescaled onto a region' is a classic reviewer check that a strong founder might independently run.
- *mechanismDepth*: Each hop is referenced (trigger data, CE gating via geo-NL/geo-DE digests, propagation into cust.operator-large) and survives 'why?' at each arrow. The counterflow — hyperscalers consuming CE colo pre-lets still generates in-scope PDU demand — is acknowledged in the likelihood rationale but weakens the perturbation's absolute-shrink claim without full quantification.
- *evidenceQuality*: The 60%/4.2 GW premise is confirmed in two publications plus SRG on the global split, but the two key excerpts both derive from the same CBRE Q4-2025 report, so they are not fully independent. The risk honestly lists the Poland 3.2 GW campus as contradicting and admits no source quantifies CE-7's hyperscale-operated share.
- *decisionRelevance*: Directly challenges the stated 'sell to large operators first' motion, with a strategic mitigation to rebalance the Year-1 pipeline toward CE-located colo/enterprise cells and a purchasable information fix (custom Synergy/DC Byte regional cut). Both indicators have quarterly-monitorable thresholds tied to named sources.

*Provenance: raw evidence `risks/raw/evidence/risk.demand-discontinuity.ce-hyperscale-flow-mirage.json` · transcripts `risks/raw/llm/`*

---

### Biggest buyer group buys through frameworks, not direct sales

`risk.structure-independence.framework-foreclosure-large-operator-cell` · **rock** · competitive · lens: structure-independence · p=50% (evidence) · judge 17/20

The model assumes large operators are the venture's first direct buyer, counting 40% of PDU spend in that cell. But that 40% measures who consumes PDUs, not who signs a contestable contract. The documented buying pattern is HQ-level global frameworks and OEM rack bundles a regional entrant never gets to bid on. If most of that spend is closed off, the funnel keeps 40% of the market inside a channel the venture cannot actually reach in Year 1.

**Impact (engine):** TAM +€300M → +€273M (−€27.00M) · YAM 1.65 → 1.50 (−€0.15M) · E[YAM loss] −€0.07M

**Perturbation:** set cust.operator-large → 0.2 (Half of the 'large operator direct' cell is framework/bundle-foreclosed to a new regional entrant) · set cust.oem → 0.33 (Mix-shift: that spend re-appears in the OEM/integrator channel, which requires a different go-to-market)

**Mechanism:**
- *trigger*: Large operators buy rack power through global frameworks and OEM bundles. `[digest:cust-mix#c12, digest:cust-mix#c13, digest:cust-mix#c14]`
- *propagation*: The 40% is a consumption share, not who signs contracts. `[ledger:cust.operator-large, digest:cust-mix#c0]`
- *model-impact*: Funnel keeps 40% in an unreachable channel with different economics. `[ledger:cust.operator-large, ledger:cust.oem, profile:Who is the primary buyer you'll sell through first?]`

**Why missable:** The row reads as a demand split, and the ledger's 'needs-source' flag looks like a precision fix rather than a reachability problem.

**Falsifier:** Three large operators confirming they run open, vendor-neutral rack-PDU tenders for their 2026 builds.

**Classification:** ERROR — research settles it · settle test: A sourced buyer-mix breakdown for CE-region rack-PDU spend that separates contestable/open-tender contracts from HQ-level global frameworks and OEM rack bundles — obtainable today via 3 structured operator/distributor interviews plus procurement-channel analyst data. This settles what share of the 40% is actually reachable in Year 1, a fact about today's contracting structure, not a future market shift.

**Proposed correction:** `cust.operator-large` → 0.18 (band 0.1–0.28) — The 0.40 conflates PDU consumption with contestable procurement; documented HQ frameworks and OEM rack bundles close off most large-operator spend to a regional entrant, so the reachable direct-buyer share is materially lower.

**Likelihood rationale:** Every buying case in the corpus points to framework and bundle procurement, with no example of an open large-operator tender in the region. Strong corroboration raised confidence from 0.45 to 0.50, but no region-specific evidence and two counter-signals cap the increase.

**Early warnings:**
- New pan-European power-chain framework agreements covering rack power announced by Equinix, Digital Realty, Vantage or NTT — watch: Operator procurement press releases and capital-markets-day supplier disclosures — trigger: ≥1 additional multi-year framework explicitly including rack PDUs (increases p)
- Incumbents' revenue mix shifting from discrete products to 'integrated solutions' in DC segment commentary — watch: Schneider Electric and Vertiv quarterly earnings calls, DC segment discussion — trigger: Solutions/bundled share of DC revenue growing while standalone product lines flatten (increases p)

**Mitigations:**
- [information] Run structured procurement-route interviews with 3 CE large-operator sourcing leads: is rack-PDU spend a discrete RFP line or a framework call-off? — VOI(cust.operator-large) = €10.5M
- [strategic] Build the OEM/rack-integrator channel as the primary Year-1 route (white-label or co-brand into integrator rack builds) instead of direct operator sales
- [contractual] Pursue approved-vendor / second-source status on one operator framework rather than competing against it

**Evidence (corroborated):**
- [industry-report] Schneider Electric's $2.3 Billion in AI Power and Cooling Deals Sends Message to Data Center Sector — Data Center Frontier — https://www.datacenterfrontier.com/machine-learning/article/55332455/schneider-electrics-23-billion-worth-of-ai-power-and-cooling-deals-sends-message-to-data-center-sector
  > Twin supply-capacity agreements by Schneider Electric with Switch and Digital Realty show how AI data centers are starting to lock up power and thermal infrastructure in much the same way as hyperscalers once locked up cloud chips.
- [industry-report] Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement — Nasdaq / PRNewswire — https://www.nasdaq.com/press-release/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-meet
  > Digital Realty has signed a $373 million Supply Capacity Agreement for UPS, Low Voltage Switchgear, and Pre-Fabricated Skids — while preserving the flexibility needed for a dynamic, multi-vendor environment to mitigate risk.
- [industry-report] OEM & ODM Data Center Infrastructure Solutions (incl. PDU) delivered directly to project sites — Getek — https://www.getek.com/oem-data-center-solution/
  > Full Range of Cabinets and Modular Systems including Power Distribution Units (PDU), customizable for global projects and delivered directly to end users or project sites worldwide.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names exact ledger nodes and values (cust.operator-large 0.40 → 0.2, cust.oem → 0.33), specific actors and instruments (Schneider/DLR $373M SCA, Vertiv custom-PDU programs, Digipower ODM), and a concrete falsifier (3 CE operators, 2026 fit-outs).
- *nonObviousness*: Goes beyond 'the 0.40 might be soft' by naming a NEW reason: the cell is a consumption share, not a channel split, and the 'needs-source' flag disguises a reachability problem as a precision problem. Not a full 4 because 'big operators are hard for new entrants to sell into' is on many founders' lists in some form.
- *mechanismDepth*: Three-step chain with refs at each hop, and the propagation step correctly dissects the derivation ('30% of one supplier's orders measures DC exposure, not who signs the PO'). The final quantification — half the cell foreclosed — is asserted rather than derived, which a hostile partner would attack.
- *evidenceQuality*: Multiple independent sources corroborate framework/bundle procurement (Schneider-DLR SCA, DCF analysis, Getek/Panduit/Vertiv channel pages), and contradicting stances (DLR's multi-vendor clause, Schleifenbauer direct sales) are honestly logged in the likelihood rationale. Falls short of 4 because the marquee SCAs are US deals covering UPS/switchgear, not rack PDUs in CE — the key premise is corroborated by adjacent, not direct, evidence.
- *decisionRelevance*: Directly attacks the profile's declared first buyer and prescribes near-term resequencing (OEM/integrator as primary Year-1 route, second-source framework slots) plus a cheap VOI interview mitigation. Indicators are monitorable in named venues (Schneider/Vertiv earnings calls, operator procurement releases) with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.structure-independence.framework-foreclosure-large-operator-cell.json` · transcripts `risks/raw/llm/`*

---

### German energy-reporting rules push incumbent-DCIM gates into PDU tenders

`risk.regulatory-gauntlet.enefg-eed-reporting-spec-creep-dcim-lock` · **rock** · model-structure · lens: regulatory-gauntlet · p=22% (evidence) · judge 16/20

The model assumes the entrant can serve 55% of the market once its product passes standard certification. But German and EU energy-reporting laws lead operators to demand certified metering accuracy plus validated links to incumbent DCIM software, which a new entrant lacks. That drops the reachable share to 45% in the German market, cutting the Year-1 number.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 1.35 (−€0.30M) · E[YAM loss] −€0.07M

**Perturbation:** set serviceableFactor → 0.45 (Reporting-bound demand requiring validated DCIM integration exits the entrant's reachable pool)

**Mechanism:**
- *trigger*: German and EU reporting deadlines recur, forcing operators to produce auditable energy data. `[digest:serviceable-benchmark#c12, digest:serviceable-benchmark#c10, digest:geo-DE#c11]`
- *propagation*: Operators require certified accuracy and named-DCIM links in PDU tenders. `[digest:refine-competitive-foreclosure.oem-cell-odm-price-foreclosure#c5, ledger:serviceableFactor, digest:serviceable-benchmark#c11]`
- *model-impact*: Reachable share falls below 45% for an unvalidated entrant. `[ledger:serviceableFactor, digest:serviceable-benchmark#c3, ledger:geo.DE]`

**Why missable:** The laws bind operators, not vendors, so a founder scanning for product rules finds nothing and only sees the gate in lost tenders.

**Falsifier:** German or Dutch 2026 colo PDU specs showing no certified-accuracy or named-DCIM requirement, or DCIM suites accepting open-protocol PDU data for filings without vendor validation.

**Classification:** ERROR — research settles it · settle test: Reading current 2026 German/Dutch colo PDU tender specifications and DCIM filing-acceptance documentation to check whether certified-accuracy AND named-vendor-DCIM validation are actually required (vs. open Redfish/open-protocol telemetry being accepted). This is a knowable fact about today's spec language and § 12 EnEfG's technical requirements, settleable via document review and vendor calls in under a week.

**Proposed correction:** `serviceableFactor` → 0.55 (band 0.45–0.65) — The claim's load-bearing premise — that EnEfG forces named-incumbent-DCIM validation — is contradicted by the attached evidence showing open Redfish/DMTF telemetry standards are broadly implemented, so § 12's metering/validation refers to management systems not vendor-locked DCIM; the current 0.55 with its 0.45 low already spans the alleged effect and no correction is warranted.

**Likelihood rationale:** The reporting deadlines are enacted, but evidence shows open protocols like Redfish are the prevailing integration path and no tender confirmed the DCIM gate. This weakens but does not refute the mechanism, warranting a modest downward revision from 0.3.

**Early warnings:**
- Accuracy-class and DCIM-integration clauses in CE colo PDU specifications — watch: German colo RFQs and framework specs (Frankfurt operators); Bundesstelle für Energieeffizienz / Energieeffizienzregister guidance updates on required data granularity — trigger: Rack/outlet-level certified metering named in register guidance or ≥2 tenders (increases p)
- Openness of incumbent DCIM validation programs to third-party PDUs — watch: Schneider EcoStruxure and Vertiv Environet partner/compatibility lists; Sunbird supported-device database — trigger: Third-party PDU additions stalling or program fees/queues lengthening (increases p)
- EU 2024/1364 second-phase requirements — watch: Commission delegated-act docket for the data-centre rating scheme — trigger: Phase-2 draft mandating sub-facility (rack-level) energy granularity (increases p)

**Mitigations:**
- [information] Audit 10 recent German/Dutch colo PDU specs for accuracy-class and DCIM clauses to size the gated fraction of the serviceable pool — VOI(serviceableFactor) = €0.0M
- [operational] Prioritize certification into the two dominant DCIM compatibility programs and ship native Redfish/SNMP profiles mapped to EnEfG/EED reporting fields as a product feature
- [strategic] Co-market with a DCIM-independent monitoring vendor targeting operators who resent incumbent suite lock-in

**Evidence (contested):**
- [industry-report] § 12 EnEfG - Energie- und Umweltmanagementsysteme in Rechenzentren — gesetze-im-internet.de (BMJ) — https://www.gesetze-im-internet.de/enefg/__12.html
  > kontinuierliche Messungen zur elektrischen Leistung und zum Energiebedarf der wesentlichen Komponenten des Rechenzentrums durchzuführen ... ab dem 1. Januar 2026 die Pflicht zur Validierung oder Zertifizierung des Energie- oder Umweltmanagementsystems.
- [industry-report] PowerIT Redfish API Guide for Rack PDU and Rack Transfer Switch — Vertiv — https://www.vertiv.com/4adeeb/contentassets/14a56c28f8b7488991460b07cd6279e8/redfish-api-guide.pdf
  > PowerIT Redfish™ API Guide for Rack PDU and Rack Transfer Switch — Vertiv publishes an open Redfish API for its rack PDUs, and Chatsworth/CPI issued an equivalent 2025 guide, indicating standardized open-protocol telemetry access rather than closed vendor-only integration.
- [industry-report] Redfish Property Guide DSP2053 — DMTF — https://redfish.dmtf.org/schemas/v1/DSP2053_2025.3.pdf
  > DMTF Redfish Property Guide, an industry-wide open management standard implemented across multiple PDU vendors — evidence of an open-protocol interoperability path that could bypass vendor-specific DCIM validation for reporting.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names both instruments (EnEfG §12, EU 2024/1364) with filing dates (31 March, 15 May), the three incumbent DCIM suites, the exact node (serviceableFactor 0.55 vs 0.45 band floor), and the 50% German cell. Perturbation and falsifier are concrete and testable.
- *nonObviousness*: The whyMissable is genuine: both laws bind operators, not vendors, so a product-law regulatory scan finds nothing — the risk names a NEW transmission channel (contractual spec creep) rather than just band-edge pessimism on serviceableFactor. Falls short of 4 because DCIM-integration lock-in as a challenger-hardware barrier is a known pattern a diligent founder in this space might already track.
- *mechanismDepth*: Three-step chain with refs at every hop, and the model-impact step honestly cites the ledger's admission that 0.55 lacks a bottom-up cross-check. The propagation hop — that filings require vendor-specific DCIM validation rather than open-protocol ingestion — would not fully survive a hostile 'why?', as the risk's own Redfish evidence shows.
- *evidenceQuality*: The trigger is doubly corroborated (EnEfG text, Commission announcement), but the load-bearing foreclosure premise is contradicted by three sources (Vertiv/CPI Redfish guides, DMTF standard) surfaced by the risk's own falsifying search. The honest 'contested' status and downward likelihood revision from 0.3 to 0.22 keep this at 2 rather than lower — contradiction weakens but does not directly refute tender-level gating.
- *decisionRelevance*: The information mitigation (audit 10 German/Dutch specs) is executable this quarter and directly resolves the contested premise on serviceableFactor; the operational mitigation (DCIM certification + Redfish/EnEfG field mapping) changes product sequencing now. All three indicators name monitorable venues with thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.regulatory-gauntlet.enefg-eed-reporting-spec-creep-dcim-lock.json` · transcripts `risks/raw/llm/`*

---

### Enterprise PDU share overstated as AI racks shift to busbar

`risk.boundary-substitution.enterprise-gpu-busbar-half-refuted` · **rock** · boundary · lens: boundary-substitution · p=33% (evidence) · judge 15/20

The model assumes enterprise is a stable 0.29 slice of PDU demand, with the 'GPU pods skip PDUs' doubt marked confirmed. But NVIDIA's flagship dense design routes power via DC busbar with far fewer PDUs per rack, and the legacy base is losing about 2 percentage points of capacity share per year toward 19% by 2031. So the growing AI half buys the substitute while the shrinking legacy half stalls, pushing the realistic enterprise value below the model's own 0.24 low band.

**Impact (engine):** TAM +€300M → +€273M (−€27.00M) · YAM 1.65 → 1.50 (−€0.15M) · E[YAM loss] −€0.05M

**Perturbation:** set seg.enterprise → 0.2 (GPU-driven growth adopts busbar attach while legacy base decays; effective PDU-addressable enterprise share drops below the model's 0.24 low band)

**Mechanism:**
- *trigger*: Enterprise growth now comes from GPU pods using busbar, not PDUs. `[digest:seg-mix#c19, ledger:seg.enterprise]`
- *propagation*: Growth side sheds PDUs; legacy base shrinks 2pp per year. `[digest:seg-mix#c5, digest:seg-mix#c4]`
- *model-impact*: Enterprise 0.29 falls below the 0.24 low band. `[ledger:seg.enterprise, digest:seg-mix#c2]`

**Why missable:** The doubt was stamped 'refuted' in cycle 1, hiding that shipping PDU variants differs from actually using them in dense builds.

**Falsifier:** BOM or vendor data from 2026 enterprise GPU-pod deployments showing rack-PDU counts at or above the legacy 3-per-rack norm in most dense installs.

**Classification:** ERROR — research settles it · settle test: NVIDIA's own published AC Power Reference Architecture for the DGX SuperPOD B300 (dated 2025-10-30) specifies 432 DGX rPDU + 96 management PDUs per pod — a purchasable/inspectable BOM that settles whether dense AI racks consume PDUs today. This is a document that exists now, not a future market outcome.

**Proposed correction:** `seg.enterprise` → 0.29 (band 0.24–0.3) — NVIDIA's flagship B300 reference architecture ships heavy per-rack PDU content (432 rPDU + 96 mgmt PDUs per pod) as a first-class AC variant, so the 'GPU pods skip PDUs' doubt is correctly refuted and the 0.29 value with 0.24 downside band already covers dense busbar deployments — no change warranted.

**Likelihood rationale:** The 2pp/year decline and GPU-driven growth are well confirmed, but NVIDIA's own AC SuperPOD design shows high PDU counts on network and storage racks, undercutting the reduced-attach premise. That lowers the chance enterprise drops below 0.24 within 12 months, so I trim from 0.40 to 0.33.

**Early warnings:**
- Which power variant (AC/PDU vs DC busbar) is default in NVIDIA/OEM pod reference-architecture documentation revisions — watch: NVIDIA GTC reference-architecture sessions and DGX/MGX pod deployment guides; Dell/HPE AI-factory configurators — trigger: DC busbar becomes the documented default for ≥50% of published dense-pod configurations (increases p)
- Enterprise/IT-segment rack-PDU revenue commentary from incumbents — watch: Vertiv and Schneider quarterly earnings calls, rack-power and IT-channel product-line commentary — trigger: Enterprise PDU line flat or declining while integrated-rack/busbar lines grow double-digit for two consecutive quarters (increases p)

**Mitigations:**
- [information] Commission an attach-rate teardown of CE enterprise GPU-pod installs (PDUs per rack by density tier) via 5–8 integrator interviews — VOI(seg.enterprise) = €7.5M
- [strategic] Position the Year-1 product for the air-cooled enterprise refresh tier (where AC/PDU remains default) and roadmap a high-amp/DC-compatible SKU for dense pods

**Evidence (contested):**
- [industry-report] Major Components — NVIDIA SuperPOD with DGX B300 Systems and AC Power Reference Architecture — NVIDIA — https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300-xdr/latest/components.html
  > 432 DGX rPDU for Standard Rack Raritan (PX3-5091R-P1Q2R1A5) or Equiv; 96 Mgmt Vertical PDU Raritan (PX3-5747V-V2) or equivalent — NVIDIA publishes an AC Power Reference Architecture with heavy per-rack PDU content as a first-class variant.
- [analyst-estimate] Hyperscale Operators to Account for 67% of all Data Center Capacity by 2031 — Synergy Research Group — https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031
  > on-premise data centers with just 32% of the total... Looking ahead to 2031, on-premise will drop to just 19%... on-premise data center capacity is receiving something of a boost thanks to GenAI applications and GPU infrastructure... on-premise share of the total will drop by around two percentage points per year.
- [industry-report] Hardware — NVIDIA DGX GB Rack Scale Systems User Guide — NVIDIA — https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html
  > The complete DGX GB rack system comprises compute trays... power shelves, a bus bar, and liquid cooling manifolds — confirming the flagship dense design routes power via DC busbar.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 2/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names seg.enterprise 0.29 vs its own 0.24 low band, the 2pp/year decline to 19% by 2031, specific NVIDIA architectures (DGX GB busbar vs SuperPOD AC/PDU with 432+96 rPDU counts), and a concrete perturbation to 0.20. Actors, instruments, values and the 12-month window are all pinned.
- *nonObviousness*: Reopening a register item stamped 'refuted' by splitting PDU-shipping from PDU-attach-per-MW is a genuine hidden move, and the 'squeezed from both ends' framing (whyMissable) is not in the ledger. Falls short of 4 because busbar substitution in dense GPU racks is a known industry debate a diligent founder tracking NVIDIA reference designs could surface.
- *mechanismDepth*: All three hops carry refs and the base-decline hop is solid, but the load-bearing arrow — 'sharply reduced rack-PDU attach' — is undercut by the risk's own SuperPOD evidence showing 528 rPDUs in a pod-level BOM (busbar covers compute racks, not network/storage/mgmt). A hostile partner asking 'why?' at that arrow gets a partially conceded answer, per the likelihood rationale itself.
- *evidenceQuality*: The secondary premise (2pp/year enterprise decline) has two independent corroborating sources, but the key attach-reduction premise is contradicted by the attached NVIDIA AC-power RA and the evidenceStatus is honestly marked 'contested' with a documented revision from 0.40 to 0.33. Honest contestation on the load-bearing claim caps this at 2.
- *decisionRelevance*: Mitigations change near-term action: a 5–8 integrator attach-rate teardown and Year-1 positioning toward the air-cooled refresh tier both alter sequencing and spend within two quarters. Indicators (reference-architecture defaults, Vertiv/Schneider segment commentary) have concrete thresholds and are monitorable.

*Provenance: raw evidence `risks/raw/evidence/risk.boundary-substitution.enterprise-gpu-busbar-half-refuted.json` · transcripts `risks/raw/llm/`*

---

### NL's 28% weight rests on capped colo; growth is out of reach

`risk.boundary-substitution.nl-selfbuild-hollows-second-geography` · **rock** · boundary · lens: boundary-substitution · p=40% (evidence) · judge 17/20

The model gives the Netherlands 28% of the base and treats it as the safest geography, with Statista and the Dutch Data Center Association agreeing within 3%. But that agreement measures old colocation stock, and Dutch demand is shifting to self-build that grows 24% a year and buys through hyperscaler channels a new entrant cannot reach. So the venture's second-largest geography sits on a slice that is capped, and the Year-1 reachable demand is far smaller than 28% implies.

**Impact (engine):** TAM +€300M → +€282M (−€18.00M) · YAM 1.65 → 1.55 (−€0.10M) · E[YAM loss] −€0.04M

**Perturbation:** set geo.NL → 0.22 (NL weight corrected to the colo-anchored, entrant-reachable slice; self-build growth and capped Amsterdam supply removed from the effective ratio)

**Mechanism:**
- *trigger*: NL growth moves to self-build outside the colo base `[digest:seg-mix#c14, digest:seg-mix#c12, ledger:geo.NL]`
- *propagation*: Self-build buys through global specs entrants cannot bid `[digest:seg-mix#c13, digest:seg-mix#c18]`
- *model-impact*: The 0.28 weight overstates reachable Dutch demand at launch `[ledger:geo.NL, profile:Stage]`

**Why missable:** NL has the cleanest source agreement in the ledger, so it looks like the one geography nobody needs to recheck, even though that agreement only confirms old colo stock and hides the shift to self-build.

**Falsifier:** 2026 NL capacity-addition data showing new Dutch MW using rack PDUs bought through channels open to regional vendors at rates matching the 28% weight.

**Classification:** ERROR — research settles it · settle test: Existing 2024-2025 Dutch capacity datasets (CBRE/Structure Research self-build vs colo splits, plus DDA and Statista breakdowns) already quantify what share of Dutch DC demand is colo versus self-build/hyperscale and how much is reachable through open channels — a purchasable report and a week of analyst calls settle whether 28% overstates reachable demand today.

**Proposed correction:** `geo.NL` → 0.2 (band 0.15–0.26) — The 28% weight apportions on colo stock, but a material and growing share of Dutch capacity is self-build/hyperscale bought through channels a new entrant cannot bid, so the reachable-demand weight should be discounted below the raw colo share.

**Likelihood rationale:** The self-build concentration and Amsterdam constraints are well sourced, but real colo refresh demand remains reachable, so the question is whether NL supports 0.28 or closer to 0.20–0.22. The 24% versus 19% growth gap was not independently confirmed, so we revised up modestly from 0.35 to 0.40.

**Early warnings:**
- NL colocation capacity growth vs hyperscale self-build additions — watch: Dutch Data Center Association 'State of the Dutch Data Centers' annual report; CBRE Amsterdam market quarterlies — trigger: NL colo net additions <5% YoY while national self-build MW grows >20% (increases p)
- Grid-connection allocations for new NL data-center projects — watch: Liander/TenneT congestion and connection-queue publications for the Amsterdam metro and Middenmeer/Eemshaven zones — trigger: New allocations flowing predominantly to hyperscale campus projects rather than colo expansions (increases p)
- Amsterdam-region grid connection grants and the Amsterdam MVA ceiling's status — watch: Liander/TenneT congestion maps and connection-queue publications; Amsterdam municipality data-center policy docket — trigger: Ceiling extended or queue lengthening beyond 2030 (increases p)
- PDU refresh/retrofit tender activity from existing Amsterdam-area colos — watch: Operator capex commentary (NorthC, Iron Mountain NL, Equinix AM-campus announcements) — trigger: Visible retrofit programs at ≥3 AMS operators (decreases p)
- Adoption status of Amsterdam's umbrella zoning plan and the 350 MVA connection ceiling — watch: Gemeente Amsterdam planning docket and Dutch Data Center Association policy updates — trigger: Plan adopted with the 350 MVA cap intact (increases p)
- National colocation capacity print year-on-year — watch: DDA 'State of the Dutch Data Centers' annual report — trigger: National colo MW flat at ≤950 MW (increases p)

**Mitigations:**
- [information] Build a bottom-up NL reachable-demand model: named colo operators × refresh cycle × racks, replacing the top-down capacity ratio for the second-largest geography — VOI(geo.NL) = €6.0M
- [operational] Sequence market entry DE-first and treat NL as an Amsterdam retail-colo refresh play rather than a proportional 28% of pipeline effort

**Evidence (corroborated):**
- [industry-report] Ten Years of State of the Dutch Data Centers — Dutch Data Center Association — https://www.dutchdatacenters.nl/en/nieuws/ten-years-of-state-of-the-dutch-data-centers-a-decade-of-growth-and-challenges/
  > In 2024, the total colocation capacity reached 924 megawatts... While the Amsterdam Metropolitan Area (MRA) still accounts for approximately 70% of colocation capacity, growth is shifting toward regions such as Groningen, South Holland, and North Brabant.
- [analyst-estimate] Dutch economy faces billions in losses as Amsterdam data center expansion halts — NL Times (citing ING analysis) — https://nltimes.nl/2025/10/07/dutch-economy-faces-billions-losses-amsterdam-data-center-expansion-halts
  > Amsterdam's power grid is full, preventing new data centers from being built until 2035, even though the city is the country's digital hub.
- [industry-report] Pure DC secures hyperscale customer for 78MW data center campus in Netherlands — DatacenterDynamics — https://www.datacenterdynamics.com/en/news/pure-dc-secures-hyperscale-customer-for-78mw-data-center-campus-in-netherlands/
  > An unnamed hyperscale customer is leasing the entire 78MW campus, situated in Westpoort, Amsterdam, with Pure DC investing more than €1 billion to develop the 5.6-acre site.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the node (geo.NL 0.28), the 951MW colo base, Amsterdam's ~70% share, the 24% vs 19% growth differential, hyperscaler global-framework procurement, and the first-12-months window, with a concrete perturbation to 0.22. Actors, values, and instruments are all pinned.
- *nonObviousness*: The core move — that the ledger's best-triangulated node is misleading because two sources agreeing on colo stock says nothing about forward demand composition — is a genuine cross-node insight the whyMissable articulates well. Falls short of 4 because the ingredients (seg-mix digest entries c12–c14 on self-build growth) are already in the model; a diligent founder could plausibly assemble it.
- *mechanismDepth*: Three referenced steps each survive a 'why?': growth accrues outside the measured colo base, self-build procures via global specs unreachable to a regional entrant, so the 0.28 apportionment overstates biddable demand. Docked one point because the load-bearing 24%-vs-19% differential is admitted unconfirmed and the channel-inaccessibility hop leans on a single digest citation.
- *evidenceQuality*: Amsterdam grid constraints and the colo-stock baseline have ≥2 independent corroborations (DDCA, NL Times/ING, DCD), and the rationale honestly flags the unconfirmed growth differential and the Schleifenbauer/markwideresearch contradiction on channel reachability. That contradiction touches the key premise, so not a clean 4.
- *decisionRelevance*: Directly changes near-term sequencing (DE-first entry, NL reweighted to an Amsterdam retail-colo refresh play) and gates NL channel spend on a bottom-up reachable-demand model. Indicators are concrete and monitorable via DDCA reports and Liander/TenneT connection-queue publications with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.boundary-substitution.nl-selfbuild-hollows-second-geography.json` · transcripts `risks/raw/llm/`*

---

### Country map uses colo-only demand, overweighting Germany and NL

`risk.definition-scopedown.colo-denominator-geography-misallocation` · **rock** · model-structure · lens: definition-scopedown · p=50% (evidence) · judge 17/20

The model splits demand by country using colo megawatts divided by colo megawatts. But rack-PDU demand tracks total installed IT load, and about a third of that load sits outside colocation with a different country mix. Germany's installed load exceeds its colo figure by about 1,000MW, so a colo-based map overstates Germany and the Netherlands in the Year-1 plan.

**Impact (engine):** TAM +€300M → +€288M (−€12.00M) · YAM 1.65 → 1.58 (−€0.07M) · E[YAM loss] −€0.03M

**Perturbation:** set geo.DE → 0.42 (Installed-load method share; mix shift, deliberately not renormalized) · set geo.NL → 0.24 (NL colo-heavy market loses relative weight under installed-load scope) · set geo.CH → 0.13 (Self-operated Swiss stock enters the denominator) · set geo.PL → 0.1 (Mordor/R&M-corroborated 660MW installed load)

**Mechanism:**
- *trigger*: EUDCA: colo and hyperscale is only two-thirds of Europe's power. `[digest:geo-region-denominator#c11, ledger:geo.DE]`
- *propagation*: Gap varies by country, shifting the €300M across markets. `[ledger:geo.DE, ledger:geo.CH, ledger:geo.PL]`
- *model-impact*: Plan overweights Germany and NL, misses Swiss and Polish demand. `[profile:Who is the primary buyer you'll sell through first?, ledger:geo.NL, digest:geo-region-denominator#c14]`

**Why missable:** Each country node discloses its colo-versus-installed gap as a width band, so the problem looks handled, but bands cannot show that the whole dimension moves the same wrong way at once.

**Falsifier:** A single-source table of total installed IT load for all CE-7 countries whose per-country shares match the current colo-based shares within 3 percentage points.

**Classification:** ERROR — research settles it · settle test: A single-source, consistent-scope table of total installed IT load (colo + self-operated) for all CE-7 countries — e.g., a PMR or Arizton pan-European installed-IT-load series — that lets you compute per-country shares on one denominator. This exists as a purchasable dataset and settles whether colo-based shares misstate the country mix today.

**Proposed correction:** `geo.DE` → 0.46 (band 0.42–0.5) — Colo-only denominator overstates Germany; the BMWK installed-IT-load cross-check already puts DE at ~0.42, so recentering to ~0.46 splits the two scope methods rather than anchoring on colo-only 0.50.

**Likelihood rationale:** The gap is documented in the ledger's own checks for four of seven countries and confirmed continentally by EUDCA. What remains unclear is whether non-colo demand per megawatt matches colo, which partly offsets the shift, so likelihood is set at 0.50.

**Early warnings:**
- Publication of country-level installed IT power (not colo-only) for CE-7 — watch: EUDCA 'State of European Data Centres' country profiles; BMWK/Bitkom German landscape updates — trigger: Any CE country's installed-load share diverging >5pp from its colo share (increases p)
- Origin of inbound PDU demand by facility type in early pipeline — watch: Venture's own CRM plus PMR Poland commercial-DC series and CBRE Suisse commercial-vs-self-operated splits — trigger: >25% of qualified CE demand coming from enterprise/self-operated sites the colo map does not list (increases p)

**Mitigations:**
- [information] Reconcile all seven countries onto one installed-load scope before locking Year-1 territory and account assignments — VOI(geo.DE) = €12.0M
- [strategic] Add an enterprise/self-operated sales motion (TÜV-certified retrofit bundle) for CH and PL alongside the large-operator channel

**Evidence (corroborated):**
- [industry-report] Status and development of the German data centre landscape – Executive Summary — BMWK (Federal Ministry for Economic Affairs and Climate Action) — https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Publikationen/Digitale-Welt/status-and-development-of-the-german-data-centre-landscape-executive-summary.pdf?__blob=publicationFile&v=2
  > With over 2,000 data centres and an installed IT power demand of over 2,700 MW, Germany is already the largest centre for digital infrastructure in Europe.
- [industry-report] New 2026 State of European Data Centres — EUDCA — https://www.eudca.org/new-2026-state-of-european-data-centres
  > commercial colocation and hyperscale facilities now provide more than two-thirds of Europe’s IT power, driven by the growing demand for cloud and AI.
- [industry-report] Switzerland Colocation Data Center Portfolio Analysis Report 2025 — Arizton / ResearchAndMarkets — https://www.businesswire.com/news/home/20260106992077/en/Switzerland-Colocation-Data-Center-Portfolio-Analysis-Report-2025-STACK-Infrastructure-Green-Datacenter-Digital-Realty-and-Vantage-Data-Centers-Remain-the-Major-Forces-Shaping-the-Market---ResearchAndMarkets.com
  > The existing IT load capacity stands at around 280+ MW, while the upcoming pipeline is set to add nearly 900 MW.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names four ledger nodes with exact before/after shares (DE 0.50→0.42, CH 0.08→0.13, PL 0.07→0.10), cites BMWK's >2,700MW and PL's 660MW figures, and ties the impact to a concrete Year-1 named-account plan in Frankfurt/Amsterdam. Perturbations and indicators carry explicit thresholds (>5pp divergence, >25% off-map pipeline).
- *nonObviousness*: The whyMissable field concedes each geo node already discloses its colo-vs-installed crossCheck, so raw ingredients were on the ledger; the genuine addition is reframing per-country band width as a correlated same-direction reallocation that bands on independent nodes cannot express. A careful founder might have assembled it, but the correlated-structure framing is a real step beyond reading the bands.
- *mechanismDepth*: Three mechanism steps each carry refs and are independently plausible (EUDCA scope gap → country-specific divergence → colo-centric channel misses CH/PL demand). The weak arrow — whether non-colo halls consume PDU spend per MW at colo-like intensity — is honestly flagged in the likelihood rationale but not closed, so a hostile 'why?' at that link only gets an admission of uncertainty.
- *evidenceQuality*: The denominator-gap premise has multiple independent primary sources (BMWK 2,700MW, EUDCA two-thirds, germandatacenters, Arizton CH), all attached with supporting stances. But the load-bearing premise for decision impact — comparable PDU spend per MW outside colo — has no direct evidence, which the risk itself concedes ('genuinely unresolved').
- *decisionRelevance*: Directly changes Year-1 territory lockdown and account assignments (mitigation 1) and proposes a near-term CH/PL enterprise sales motion (mitigation 2) — both next-two-quarter sequencing decisions. Indicators are monitorable via named sources (EUDCA country profiles, own CRM) with concrete thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.definition-scopedown.colo-denominator-geography-misallocation.json` · transcripts `risks/raw/llm/`*

---

### Geography weights overstate Netherlands, understate Switzerland

`risk.structure-independence.colo-weights-enterprise-slice-misallocation` · **rock** · model-structure · lens: structure-independence · p=60% (evidence) · judge 17/20

The model splits geography by colocation megawatts, then applies that split to the 29% enterprise slice. But colocation covers only about two-thirds of Europe's IT power, and enterprise machine rooms sit where industry is, not where Amsterdam campuses are. So the Netherlands cell counts enterprise demand that physically sits in German and Swiss server rooms, and anyone staffing a DACH channel off these weights will pick the wrong countries.

**Impact (engine):** TAM +€300M → +€294M (−€6.00M) · YAM 1.65 → 1.62 (−€0.03M) · E[YAM loss] −€0.02M

**Perturbation:** set geo.NL → 0.23 (NL weight corrected for its near-zero enterprise on-prem contribution to the 29% slice) · set geo.CH → 0.11 (Mix-shift: self-operated Swiss load reallocated in — a reallocation, not a shrink; the risk is misdirected go-to-market, not lost TAM)

**Mechanism:**
- *trigger*: Colocation covers only two-thirds of Europe's IT power. `[digest:geo-region-denominator#c11, ledger:geo.NL]`
- *propagation*: The missing third sits elsewhere; Switzerland runs 0.13 versus 0.08. `[ledger:geo.CH, ledger:geo.DE, ledger:seg.enterprise]`
- *model-impact*: Netherlands is overstated, Switzerland undersized, across the 29% enterprise slice. `[ledger:geo.NL, ledger:geo.CH, ledger:seg.enterprise]`

**Why missable:** Each axis is well-sourced on its own, so every ledger row passes review, and the error appears only when the two axes are multiplied together.

**Falsifier:** A country-level installed-load table showing the Netherlands share of total load near its colocation share of 0.28, meaning the missing third distributes the same way.

**Classification:** ERROR — research settles it · settle test: A country-level total installed IT-load table (colocation + enterprise/self-operated) for the CE-7 set — e.g., BMWK/German Datacenters, CBRE Suisse, and Dutch DCA figures reconciled — showing each country's share of total load versus its colocation-only share. This exists today and would settle whether applying colo weights to the enterprise slice mis-locates enterprise demand.

**Proposed correction:** `geo.CH` → 0.13 (band 0.1–0.15) — Switzerland's market is self-operation-heavy (CBRE: 340 MW commercial vs Mordor 850.6 MW total incl. self-operated); the enterprise slice should use installed-base weights (~0.13), not colocation-only (0.08), which understate DACH enterprise rooms.

**Likelihood rationale:** The colocation-versus-installed gap already shows up in the ledger's own checks for Germany, Switzerland, Austria and Poland, all in the predicted direction. The Netherlands magnitude is still unconfirmed, so confidence rises only modestly above the prior.

**Early warnings:**
- Publication of installed-load vs colocation country splits for CE-7 — watch: EUDCA 'State of European Data Centres' country profiles; BMWK/Bitkom German installed-load updates — trigger: DE/CH installed-load shares diverging >5pp from their colo shares (increases p)
- Enterprise-segment pipeline geography vs model weights in early selling — watch: Venture's own CRM: country origin of enterprise/mid-operator inbound and distributor leads — trigger: Enterprise leads from CH+DE running >2x their model-weighted share vs NL (increases p)

**Mitigations:**
- [information] Commission or assemble a single-scope installed-IT-load table across CE-7 (the ledger's own promotion path) to re-derive geo weights per segment rather than globally — VOI(geo.CH) = €7.5M
- [operational] Split the v2 model's geography axis by segment: colo-weighted geo for hyperscale/colo demand, installed-load-weighted geo for enterprise — and weight the enterprise channel build toward DE/CH industrial accounts

**Evidence (corroborated):**
- [industry-report] New 2026 State of European Data Centres — EUDCA — https://www.eudca.org/new-2026-state-of-european-data-centres
  > The 2026 edition shows that commercial colocation and hyperscale facilities now provide more than two-thirds of Europe’s IT power, driven by the growing demand for cloud and AI.
- [industry-report] Status and development of the German data centre landscape – Executive Summary — BMWK (German Federal Ministry for Economic Affairs) — https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Publikationen/Digitale-Welt/status-and-development-of-the-german-data-centre-landscape-executive-summary.pdf?__blob=publicationFile&v=2
  > With over 2,000 data centres and an installed IT power demand of over 2,700 MW, Germany is already the largest centre for digital infrastructure in Europe.
- [industry-report] Data Center Impact Report Deutschland — German Datacenters Association — https://www.germandatacenters.com/fileadmin/images/DCIRD-24/Data-Center-Impact-Report-Deutschland-2024_EN.pdf
  > 1,955 MW IT power in Germany approx. ... thereof 69 % in colocation data centers

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names exact nodes (geo.NL, geo.CH, seg.enterprise), quantifies the misallocation (0.28→0.23 NL, 0.08→0.11 CH, ~1,000MW DE installed-vs-colo gap, 29% enterprise slice), and identifies the exact operational victim ('sizing a DACH enterprise channel'). Indicators cite concrete venues (EUDCA country profiles, own CRM) with numeric thresholds.
- *nonObviousness*: The core insight — the error lives only in the product of two individually well-sourced axes — is genuinely structural and, as whyMissable states, 'no single node carries it, no band covers it'. Docked one point because the ledger's own cross-checks (CH 0.13 vs 0.08, DE installed>colo) already flag the raw divergences; the novelty is reframing them as systematic rather than discovering them.
- *mechanismDepth*: Three-step chain (colo denominator misses ~a third of load → non-colo third has a different geography → NL×enterprise cell is partly phantom) with refs at every hop and directionally consistent per-country cross-checks. The weakest link — that NL's enterprise on-prem contribution is 'near-zero' — is asserted rather than derived, so the final perturbation magnitude wouldn't fully survive a hostile 'why 0.23?'
- *evidenceQuality*: The trigger premise is directly confirmed by EUDCA's own framing, and the DE colo-vs-installed divergence is corroborated by two independent official sources (BMWK, GDA) in the predicted direction. The NL phantom magnitude remains unquantified — honestly flagged in the likelihood rationale and given a clean falsifier — which keeps this below 4.
- *decisionRelevance*: Directly changes near-term go-to-market: the mitigation weights 'the enterprise channel build toward DE/CH industrial accounts' instead of NL, altering staffing and sequencing within quarters. Both indicators are monitorable now (EUDCA country profiles; the venture's own CRM lead geography vs model weights).

*Provenance: raw evidence `risks/raw/evidence/risk.structure-independence.colo-weights-enterprise-slice-misallocation.json` · transcripts `risks/raw/llm/`*

---

### Germany hyperscale-owned share is far below the 44% we assumed

`risk.structure-independence.ce-hyperscale-global-split-mirage` · **rock** · model-structure · lens: structure-independence · p=50% (evidence) · judge 18/20

The model spreads Synergy's global 48% hyperscale share flat onto Central Europe. But about 60% of Europe's hyperscaler self-build sits in Ireland, the Netherlands, Sweden and Belgium, three of which are outside CE-7. So the implied German hyperscale cell, roughly 22% of the market, mostly does not exist as hyperscale-owned sites, and the Year-1 beachhead is much smaller.

**Impact (engine):** TAM +€300M → +€294M (−€6.00M) · YAM 1.65 → 1.62 (−€0.03M) · E[YAM loss] −€0.02M

**Perturbation:** set seg.hyperscale → 0.3 (Hyperscale-owned CE share corrected for the self-build concentration outside CE-7) · set seg.colocation → 0.3 (Mix-shift: leased 'scale colocation' capacity re-attributed to the colo-operator segment where the PDU purchasing decision actually sits)

**Mechanism:**
- *trigger*: Synergy's 48% hyperscale share is global, not regional. `[digest:seg-mix#c0, digest:seg-mix#c14, ledger:seg.hyperscale]`
- *propagation*: In CE-7 hyperscale demand is leased, counted twice with colo. `[digest:seg-mix#c13, digest:geo-region-denominator#c7, digest:geo-region-denominator#c9]`
- *model-impact*: Real buyer is the colo operator, needing colo-grade product. `[ledger:seg.hyperscale, ledger:seg.colocation, profile:Who is the primary buyer you'll sell through first?]`

**Why missable:** The node looks solid because it was triangulated across Synergy vintages into a tight band, but the error is geographic, not numeric, and no band on a global figure catches a regional composition mistake.

**Falsifier:** A Europe- or CE-scoped split from Synergy, CBRE or JLL showing hyperscale-owned capacity at 40% or more of CE-7 total.

**Classification:** ERROR — research settles it · settle test: A Europe- or CE-7-scoped hyperscale ownership/capacity split from Synergy, CBRE or JLL showing what share of CE-7 (or Germany) data center capacity is hyperscale-owned self-build vs leased colocation — a purchasable regional report that exists today and settles the number.

**Proposed correction:** `seg.hyperscale` → 0.22 (band 0.15–0.3) — CBRE data shows 60% of Europe's hyperscale self-build sits in Ireland, Netherlands, Sweden, Belgium (mostly outside CE-7) and Synergy notes ~half of hyperscale capacity is leased not owned, so the German/CE-7 hyperscale-owned cell is far below the flat-applied global 44%.

**Likelihood rationale:** The 60%-outside-CE self-build concentration is directly sourced and Frankfurt is a documented colo hub, not a self-build one. Residual doubt is only how much leased hyperscale capacity to attribute to the hyperscale buyer for PDU specs; revised up from 0.4 to 0.5.

**Early warnings:**
- Hyperscale self-build MW announced/operational by country — watch: CBRE quarterly 'Europe Data Centres Figures'; hyperscaler capex-call site announcements for DE/PL/AT — trigger: CE-7 self-build share of Europe rising above ~25% would weaken the risk; staying ≤20% confirms it (decreases p)
- Publication of a Europe-scoped hyperscale/colo/enterprise capacity split — watch: Synergy Research Europe releases; EUDCA State of European Data Centres — trigger: Europe hyperscale-owned share reported <35% (increases p)

**Mitigations:**
- [information] Buy or derive a Europe-scoped segment split (Synergy Europe cut or CBRE self-build vs colo series) before locking the product roadmap to hyperscale requirements — VOI(seg.hyperscale) = €6.0M
- [strategic] Spec the launch product for colo-operator requirements — billing-grade tenant metering, multi-tenant DCIM integration, retrofit form factors — since the CE cell that actually exists is colo-operated capacity serving hyperscale tenants

**Evidence (corroborated):**
- [industry-report] CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth — DatacenterDynamics (citing CBRE) — https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/
  > This new supply will be delivered across nine European countries, with 60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium.
- [analyst-estimate] On-Premise Data Center Capacity Being Increasingly Dwarfed by Hyperscalers and Colocation Companies — Synergy Research Group — https://www.srgresearch.com/articles/on-premise-data-center-capacity-being-increasingly-dwarfed-by-hyperscalers-and-colocation-companies
  > Approximately half of that hyperscale capacity is in own-built, owned data centers and half is in leased facilities.
- [industry-report] Frankfurt DCI Report 2024: Data Centre Colocation, Hyperscale Cloud & Interconnection — Structure Research — https://www.structureresearch.net/product/frankfurt-dci-report-2024-data-centre-colocation-hyperscale-cloud-interconnection/
  > Hyperscale colocation is growing at a five-year CAGR of 26.1% and retail colocation is moving along at a 10.3% clip.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 4/4 · decisionRelevance 4/4
- *specificity*: Names both ledger nodes (seg.hyperscale, seg.colocation), the exact arithmetic of the phantom cell (0.50 × 0.44 ≈ 22% of TAM), the four countries holding ~60% of self-build, and the real buyer's product requirements (tenant billing metering, multi-tenant DCIM).
- *nonObviousness*: The band-edge trap is avoided: per whyMissable, the node is 'triangulated' and tightly banded, and the flaw is a geographic composition error plus axis double-booking that no band on a global figure covers. A founder skeptical of global-to-regional rescaling might get partway there, so it stops short of fully hidden.
- *mechanismDepth*: Every hop (global split misapplied → leased-vs-owned in CE → same MW booked on both axes → wrong beachhead and buyer) carries refs and is independently plausible. The final quantitative leap from '60% self-build outside CE' to seg.hyperscale=0.3 is under-pinned, and the risk's own rationale concedes the buyer-attribution hop is 'genuinely ambiguous'.
- *evidenceQuality*: Three independent attached sources (CBRE-via-DCD verbatim on the 60% concentration, Synergy on ~half of hyperscale capacity being leased, Structure Research on Frankfurt hyperscale colocation) corroborate the key premise, and the likelihood rationale honestly documents the revision from 0.4 to 0.5 with residual uncertainty stated.
- *decisionRelevance*: Mitigations directly change near-term spend and sequencing — buy a Europe-scoped split before locking the roadmap, and re-spec the launch product for colo-operator requirements — and both indicators (CBRE quarterly self-build MW, Europe-scoped segment splits) are monitorable with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.structure-independence.ce-hyperscale-global-split-mirage.json` · transcripts `risks/raw/llm/`*

---

### Segment mix overweights hyperscale in CE-7, misdirecting Year-1 effort

`risk.boundary-substitution.ce7-hyperscale-mix-mirage` · **rock** · model-structure · lens: boundary-substitution · p=50% (evidence) · judge 17/20

The model applies Synergy's global 48% hyperscale share to Central Europe using a flat 0.91 carve-out. But about 60% of Europe's hyperscale self-build capacity sits in Ireland, the Netherlands, Sweden and Belgium, outside CE-7. So the buyer mix overweights hyperscale by perhaps a third, which leaves the TAM headline unchanged but points certification and Year-1 pipeline effort at the wrong buyers.

**Impact (engine):** TAM +€300M → +€294M (−€6.00M) · YAM 1.65 → 1.62 (−€0.03M) · E[YAM loss] −€0.02M

**Perturbation:** set seg.hyperscale → 0.3 (CE-7 hyperscale-owned share corrected for self-build concentration outside CE) · set seg.colocation → 0.26 (Mix-shift: CE capacity is more colo-weighted than the global split implies) · set seg.enterprise → 0.33 (Mix-shift: DACH enterprise/self-operated weight (BMWK, Swiss self-operation) raises the enterprise share; siblings moved explicitly since the engine does not re-normalize)

**Mechanism:**
- *trigger*: Model applies a global 48% hyperscale share to CE-7. `[digest:seg-mix#c0, digest:seg-mix#c14]`
- *propagation*: Hyperscale self-build grows 24% yearly, concentrated outside CE-7. `[digest:seg-mix#c12, digest:seg-mix#c13]`
- *model-impact*: The €300M base misfires: hyperscale up, colo and enterprise down. `[ledger:seg.hyperscale, ledger:seg.colocation, ledger:seg.enterprise]`

**Why missable:** The wrong mix leaves TAM, SAM and YAM totals identical, so every reviewed number reads the same and no test checks whether the mix came from the wrong geography.

**Falsifier:** A Europe- or CE-scoped split from CBRE, Synergy or JLL showing hyperscale-owned capacity at 40% or more of CE-7 megawatts.

**Classification:** ERROR — research settles it · settle test: A Europe- or CE-7-scoped segment capacity split from CBRE, Synergy, or JLL showing hyperscale-owned share of CE-7 megawatts today. This is a purchasable/publishable dataset describing today's geographic distribution of installed capacity, not a future market outcome.

**Proposed correction:** `seg.hyperscale` → 0.33 (band 0.28–0.4) — CBRE's evidence that ~60% of European hyperscale self-build capacity sits in Ireland, Netherlands, Sweden, and Belgium (outside CE-7) means the global 48%×0.91 carve-out overstates CE-7 hyperscale share by roughly a third; rescaling to CE-7 geography lands near 33%.

**Likelihood rationale:** The 60%-outside-CE figure and the 24% versus 19% growth split are directly sourced and corroborated, and no Europe-scoped share exists. The main uncertainty is how much hyperscale capacity leased inside CE colo offsets the self-build concentration elsewhere.

**Early warnings:**
- First publication of a Europe or CE regional capacity split by operator type — watch: Synergy Research regional releases; CBRE European Data Centres quarterly reports — trigger: CE/Europe hyperscale-owned share reported ≥8pp below the model's 0.44 (increases p)
- Location of announced hyperscale self-build campuses in Europe — watch: DCD/DCNN build announcements; German and Polish planning/permit registries for hyperscale campuses — trigger: ≥70% of announced European self-build MW landing outside CE-7 for two consecutive quarters (increases p)

**Mitigations:**
- [information] Purchase or commission a CE-7-scoped capacity split by operator type (hyperscale-owned vs colo vs enterprise) before locking Year-1 channel investment — VOI(seg.hyperscale) = €6.0M
- [operational] Weight Year-1 pipeline and certification spend toward colo and enterprise accounts in DE/NL rather than hyperscale framework pursuit

**Evidence (corroborated):**
- [industry-report] Hyperscale Operators to Account for 67% of all Data Center Capacity by 2031 — Synergy Research Group — https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031
  > they now account for 48% of the worldwide capacity of all data centers. Almost 60% of that hyperscale capacity is now in own-built, owned data centers... non-hyperscale colocation capacity accounting for another 20%... enterprise on-premise data centers with just 32%.
- [industry-report] CBRE: European hyperscaler self-build capacity growth to outpace colocation supply growth — CBRE via DatacenterDynamics — https://www.datacenterdynamics.com/en/news/cbre-european-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-but-supply-outpaces-take-up-in-weaker-than-expected-2025/
  > hyperscaler self-build capacity will reach 4.2GW in 2026, a 24 percent increase... 60 percent of Europe’s operational hyperscale self-build capacity located in Ireland, the Netherlands, Sweden, and Belgium.
- [industry-report] Signings for AI Data Centre Capacity in Europe More Than Treble — CBRE UK — https://www.cbre.co.uk/press-releases/signings-for-ai-data-centre-capacity-in-europe-more-than-treble-in-first-nine-months-of-2025
  > signings for AI-focused colocation capacity reached 414MW... More than half of this capacity (57%) was signed in the Nordics.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names exact nodes (seg.hyperscale/colocation/enterprise), the 0.91 carve-out, Synergy's 48% global share, the ~60%-outside-CE-7 concentration, 24% vs 19% growth rates, and explicit perturbation values (0.30/0.26/0.33). Actors, instruments and thresholds (≥8pp gap, ≥70% MW outside CE-7 for two quarters) are all concrete.
- *nonObviousness*: The whyMissable is genuinely structural: shares sum to the same TAM so no headline moves, and the tornado tests bands in isolation but never the transplanted-geography hypothesis — a NEW reason, not a band-edge claim. Falls short of 4 because 'a global mix was borrowed for a regional market' is a check a rigorous founder auditing seg-mix provenance might independently run.
- *mechanismDepth*: All three hops carry refs and each is independently plausible (concentration → widening divergence via 24%/19% growth → misallocation invisible to headline). The one soft link — hyperscale leased-in-colo capacity within CE-7 could partially restore the hyperscale share — is acknowledged in the likelihood rationale but not closed, so the 'overweight by a third' magnitude wouldn't fully survive a hostile 'why?'.
- *evidenceQuality*: Synergy (global 48%) and CBRE (60% concentration, 24% self-build growth) directly anchor the two load-bearing premises, with IREI corroborating — though IREI echoes the same CBRE dataset rather than being fully independent. The decisive premise (actual CE-7 hyperscale share) has no direct source, which the risk honestly concedes ('no CE-7-scoped hyperscale share was located').
- *decisionRelevance*: Directly reorders next-two-quarter spend: the operational mitigation shifts Year-1 certification and pipeline toward colo/enterprise in DE/NL, and the information mitigation gates channel lock-in on a CE-7-scoped split. Both indicators (Synergy/CBRE regional cuts, self-build MW location) are concrete, thresholded and monitorable.

*Provenance: raw evidence `risks/raw/evidence/risk.boundary-substitution.ce7-hyperscale-mix-mirage.json` · transcripts `risks/raw/llm/`*

---

### Big buyers lock specs early, emptying the Year-1 sales window

`risk.structure-independence.frankfurt-cycle-lockout-year1` · **rock** · execution · lens: structure-independence · p=60% (evidence) · judge 18/20

The model assumes the venture wins 1% of its market in Year 1 from many independent buyers arriving steadily. But the chosen corner is a few large Frankfurt and Amsterdam campus fit-outs whose electrical parts are specified at tender, long before delivery. Capacity delivering in the first 12 months was already specced in 2024–25. So the truly winnable share this year is far below the 1% benchmark, and the Year-1 number is overstated.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.66 (−€0.99M) · E[YAM loss] −€0.59M

**Perturbation:** set obtainableFactor → 0.004 (Year-1 contestable share conditioned on the DE×large-operator cell's spec-lock timing, below the generic band low)

**Mechanism:**
- *trigger*: A few flagship campuses dominate Year-1 demand, specced early `[digest:geo-region-denominator#c3, digest:geo-region-denominator#c6, ledger:obtainableFactor]`
- *propagation*: Large operators set specs upstream, so smooth-arrival assumption fails `[ledger:geo.DE, ledger:cust.operator-large, digest:geo-region-denominator#c9]`
- *model-impact*: Average 1% benchmark overstates winnable share for this cell `[ledger:obtainableFactor, profile:Stage]`

**Why missable:** This node was already fixed once from 3% to 1% and looks like the most-scrubbed number, but the real error is the link between big buyers and early spec-lock, which no single band captures.

**Falsifier:** Two or more large-operator rack-PDU procurements in the first 12 months, open to new vendors and running from bid to delivery inside that window.

**Classification:** RISK — only time settles it · settle test: Only the actual outcome of 2026 EU rack-PDU procurements — whether two or more large-operator tenders open to new vendors run from bid to delivery inside the first 12 months — settles this. That is a market event that must unfold, not a fact retrievable today from a report or dataset.

**Likelihood rationale:** Pipeline data directly documents lumpy projects and early spec-lock in this cell, and no vendor-open procurement fitting a 12-month cycle surfaced. Held below 0.7 because short-cycle refresh demand in existing Frankfurt stock is unmeasured and could rescue the average.

**Early warnings:**
- Rack-PDU line items in EU-visible tenders with award-to-delivery under 12 months — watch: TED (Tenders Electronic Daily) and operator supplier portals (Equinix/Digital Realty vendor registration → time to first RFQ) — trigger: Zero vendor-open short-cycle PDU tenders in CE over two consecutive quarters (increases p)
- Ratio of CE capacity breaking ground (spec now, deliver later) vs delivering (specced already) — watch: CBRE quarterly pipeline figures; Frankfurt/Amsterdam construction-start announcements on operator capex calls — trigger: Deliveries dominated by projects specced ≥18 months prior (increases p)

**Mitigations:**
- [information] Audit the 2026–27 CE fit-out pipeline for spec-lock dates: which projects have not yet frozen their rack-power BoM and when do their tenders open — VOI(obtainableFactor) = €0.0M
- [operational] Re-weight Year-1 targeting toward brownfield refresh and retrofit in standing Frankfurt/Amsterdam stock, where PDU swap-outs transact inside 12 months without waiting for a new-build tender cycle

**Evidence (corroborated):**
- [industry-report] Goodman, CPP Investments establish €8bn European data center platform — DatacenterDynamics — https://www.datacenterdynamics.com/en/news/goodman-cpp-investments-establish-8bn-european-data-center-plaform/
  > Four projects totalling 435MW of primary power and 282MW of IT load across Frankfurt, Amsterdam, and Paris — concentrating European take-up in a handful of flagship campuses.
- [industry-report] Data Center Construction Timeline: 18-36 Months, Phase by Phase — Buildermuse — https://buildermuse.com/commercial/data-center-construction-timeline-phase-by-phase/
  > 40-60 week switchgear lead times and 18-36 month build cycles mean electrical BoM is specified far ahead of delivery, corroborating upstream spec-lock.
- [industry-report] NTT Berlin 36MW Data Center Development Contract Awarded to HOCHTIEF and Turner — Construction Review Online — https://constructionreviewonline.com/ntt-berlin-36mw-data-center-development-contract-awarded-to-hochtief-and-turner/
  > Construction begins summer 2026 with first data halls handed over in 2028 — demonstrating delivery windows extend years beyond procurement/award.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 4/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names exact nodes and values (obtainableFactor 0.01 with 0.005–0.03 band, geo.DE=0.50, cust.operator-large=0.40), specific actors and venues (Frankfurt 1.2GW, Equinix/Digital Realty portals, TED), and a dated timing claim (capacity delivering in months 0–12 was specced 2024–25). The perturbation is a concrete number (0.004) with a stated conditioning logic.
- *nonObviousness*: The whyMissable field is genuinely new: the node was already corrected 3%→1% and carries 'triangulated' maturity, so it reads as scrubbed, while the residual error is a concentration×timing correlation no single-node band encodes. Held at 3 because long enterprise procurement cycles in the large-operator segment is a hazard some experienced founders would already suspect, even if not in this precise cube-cell form.
- *mechanismDepth*: Each hop is separately referenced and independently plausible: flagship-campus lumpiness (digest c3/c6) → 85% FLAPD flow-through with upstream spec-lock (c9, geo.DE, cust.operator-large) → benchmark misapplied to a near-zero contestable cell (obtainableFactor, Stage). The correlation argument survives 'why?' at every arrow, including why the band low end doesn't cover it.
- *evidenceQuality*: The timing/spec-lock premise has ≥2 independent corroborating sources (DCD campus concentration, 40–60 week switchgear lead times, NTT 2026-award/2028-delivery) and the likelihood rationale honestly logs a failed falsifier search. Held at 3 because the load-bearing quantitative claim — months-0–12 contestable share 'approaches zero' — is inference from the mechanism, and the refresh/retrofit escape hatch is admitted to be unmeasured.
- *decisionRelevance*: The operational mitigation (re-weight Year-1 targeting to brownfield PDU swap-outs in standing Frankfurt/Amsterdam stock) changes sequencing in the next two quarters, and the information mitigation redirects diligence spend now. Both indicators are monitorable at named venues (TED, CBRE quarterly pipeline) with explicit thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.structure-independence.frankfurt-cycle-lockout-year1.json` · transcripts `risks/raw/llm/`*

---

### Buyer security audit adds a slow gate that delays first PO

`risk.execution-window.firmware-security-audit-gate` · **rock** · execution · lens: execution-window · p=45% (evidence) · judge 17/20

The model assumes the venture can sell to large operators once it clears CE and TUV product certification. But those buyers require a separate security prequalification first, and each audit cycle runs one to two quarters. That serial delay compresses the Year-1 selling window and locks out gated accounts, so both factors are too high.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.66 (−€0.99M) · E[YAM loss] −€0.45M

**Perturbation:** scale serviceableFactor → 0.8 (Security-gated large accounts unreachable within Year 1 despite product certification) · scale obtainableFactor → 0.5 (First-PO delay of ~2 quarters halves the effective Year-1 selling window)

**Mechanism:**
- *trigger*: Large operators require security audits before listing networked power devices `[digest:serviceable-benchmark#c13, digest:serviceable-benchmark#c4, ledger:serviceableFactor]`
- *propagation*: New entrant builds this and passes audits within Year 1 `[profile:Stage, profile:Who is the primary buyer you'll sell through first?]`
- *model-impact*: Gate delays first PO and blocks gated accounts `[ledger:obtainableFactor, ledger:serviceableFactor]`

**Why missable:** The founder's list shows CE and TUV as handled, but the buyer security audit is invisible until it arrives as a questionnaire on the first serious RFQ.

**Falsifier:** Two or more large CE operators issue rack-PDU RFQs in the first two quarters with no security prequalification, or confirm CE marking alone suffices for listing.

**Classification:** RISK — only time settles it · settle test: Only the actual Year-1 procurement timeline settles this: whether large CE operators issue rack-PDU RFQs requiring security prequalification before a first PO, and whether the venture's audit cycles land inside or outside its selling window. That unfolds over the next 12-24 months — no purchasable report fixes today's serviceable/obtainable ratios, since the load-bearing claim is about how the buyer gate delays orders going forward.

**Likelihood rationale:** Security prequalification is standard at large buyers and CRA rules phase in, but mid-market and distributor channels gate far less strictly. Probability reflects the venture's explicit large-operator-first choice; CRA obligations bind from Dec 2027, so the near-term delay is smaller than implied.

**Early warnings:**
- Vendor-security questionnaire content (SBOM, signed firmware, PSIRT, 62443 mapping) in rack-power prequalification packets — watch: Procurement/supplier portals of Equinix, Digital Realty, NorthC and other CE colo operators; first three RFQs the venture receives — trigger: ≥2 of first 3 RFQs requiring SBOM or firmware-security attestation before quotation (increases p)
- CRA horizontal-standard timeline for network-connected industrial products — watch: CEN/CENELEC JTC13 docket and Commission CRA implementing-act publications — trigger: Harmonized standard citing connected power-distribution devices with obligations landing inside the venture's first 24 months (increases p)

**Mitigations:**
- [information] Run a mock security audit against two target operators' published supplier requirements pre-launch to size the true listing lead time per account — VOI(obtainableFactor) = €0.0M
- [strategic] Ship with a third-party-audited firmware signing and PSIRT process at launch (certifiable artifact, not a roadmap slide), and sequence first sales through channels with lighter security gates (distributors, mid-market) while operator audits run

**Evidence (corroborated):**
- [industry-report] Security Guideline Product Security Sourcing Guide — NERC — https://www.nerc.com/globalassets/who-we-are/standing-committees/rstc/scs/product-security-sourcing-guide.pdf
  > Vendor-Level Risk Management ... Product Vulnerability Disclosure ... Current disclosure by the supplier: 'Push' or 'Pull' Process — documents formal vendor security prequalification artifacts for grid/critical-infrastructure buyers.
- [industry-report] Supply Chain Product Assurance Playbook (Schneider Electric) — NIST / Schneider Electric — https://csrc.nist.gov/csrc/media/Presentations/2024/supply-chain-product-assurance-playbook/images-media/20240918-FINAL%20CG%20SE%20September%202024%20SSCA%20Presentation%20v2.pdf
  > SBOMs generated for all products starting January 2021 and every product release is compliant to ISA/IEC 62443-4-1 Secure Development Lifecycle. Globally SE is certified to 4-1 Maturity Level 4 — incumbents already carry the security-gate artifacts a new entrant must build.
- [industry-report] CRA FAQ - Transition period — Open Regulatory Compliance Working Group — https://cra.orcwg.org/faq/official/transition/
  > The obligations of manufacturers to ensure that products with digital elements are in conformity with the essential cybersecurity requirements ... apply from 11 December 2027 — the binding CRA gate is prospective, tempering the near-term regulatory pressure.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names both target ledger nodes with quantified perturbations (0.8 on serviceableFactor, 0.5 on obtainableFactor), specific instruments (SBOM, PSIRT, IEC 62443-4-1, CRA Dec-2027), named operators (Equinix, Digital Realty, NorthC), and audit-cycle timing (1–2 quarters per operator). Indicators carry concrete thresholds ('≥2 of first 3 RFQs requiring SBOM').
- *nonObviousness*: The whyMissable field makes a genuine hiding argument: the founder's 'certifications' line looks handled (CE/TÜV scheduled and budgeted) while the buyer-side gate surfaces only as a questionnaire attached to the first RFQ, and the per-operator (not per-product) nature is the real novelty. Docked one point because the likelihood rationale itself concedes security prequalification is 'standard practice' at large buyers, so an infrastructure-savvy founder plausibly has it.
- *mechanismDepth*: Three-hop chain (buyer-side prequal → per-operator audit cycles inside the YAM window → serial PO delay plus foreclosed accounts) is referenced at each step and distinguishes the two model impacts cleanly. The narrative's CRA phase-in link is weaker than presented — the risk's own evidence dates binding obligations to Dec 2027 — so one arrow would not fully survive a hostile 'why now?'.
- *evidenceQuality*: Multiple independent supports (NERC sourcing guide, SE 62443/SBOM playbook, Eaton framing) corroborate the existence of an operator-driven security gate, and the contradicting CRA-timing source is honestly incorporated via an explicit likelihood revision. Falls short of 4 because no source directly shows a CE colo operator conditioning AVL listing on SBOM/firmware attestation — the corroboration is adjacent (grid buyers, incumbent posture) rather than on the exact key premise.
- *decisionRelevance*: Mitigations change near-term sequencing and spend: a pre-launch mock audit against two operators' supplier requirements and resequencing first sales through lighter-gated distributor/mid-market channels are both actionable within two quarters. Both indicators (RFQ questionnaire content, CRA standards docket) have stated locations and thresholds, making the risk monitorable.

*Provenance: raw evidence `risks/raw/evidence/risk.execution-window.firmware-security-audit-gate.json` · transcripts `risks/raw/llm/`*

---

### EU Cyber Resilience Act cuts networked PDU sales in Year 1

`risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window` · **rock** · exogenous · lens: regulatory-gauntlet · p=50% (evidence) · judge 16/20

The model assumes the PDU clears the old CE and TUV compliance stack and can be quoted into 2026 tenders. But the Cyber Resilience Act adds new duties from 11 September 2026 and full conformity from 11 December 2027, and data-center buyers are already demanding CRA-readiness in 2026 bids. That pushes Year-1 share below the 1% pace the number assumes.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.72 (−€0.93M) · E[YAM loss] −€0.47M

**Perturbation:** set serviceableFactor → 0.4 (CRA-gated (attestation-demanding) demand exits the entrant's reachable pool until conformity artifacts exist) · set obtainableFactor → 0.006 (Year-1 pace falls below the 1% anchor as 2026 shortlists require CRA-readiness)

**Mechanism:**
- *trigger*: CRA duties start Sept 2026 and Dec 2027, inside the entry window `[profile:Product, profile:Stage, ledger:serviceableFactor]`
- *propagation*: Buyers add CRA-readiness clauses to 2026 bids for durable gear `[digest:serviceable-benchmark#c4, digest:serviceable-benchmark#c13, ledger:serviceableFactor]`
- *propagation*: Entrant lacks the certification, so it drops off shortlists `[digest:refine-demand-discontinuity.prelet-pipeline-lockout#c0, digest:refine-competitive-foreclosure.bundling-eliminates-bakeoffs-year1#c0, ledger:obtainableFactor]`
- *model-impact*: Reachable demand shrinks and Year-1 share falls below 1% `[ledger:serviceableFactor, ledger:obtainableFactor]`

**Why missable:** CE marking already looks like a checked box, but the CRA changes the conformity route and buyers enforce it in 2026 bids while the founder's calendar reads 2027.

**Falsifier:** Three 2026 data-center PDU bids with no CRA or SBOM requirement, plus confirmation networked PDUs stay in the CRA self-assessment class.

**Classification:** RISK — only time settles it · settle test: Only the actual 2026 tender behavior settles this — whether EU data-center buyers in fact impose binding CRA/SBOM shortlist clauses before the Sept 2026 reporting date and Dec 2027 full conformity, and whether that pace pushes the entrant off enough shortlists to cut Year-1 share below 1%. The regulatory dates are known today, but whether buyers actually gate 2026 bids on CRA-readiness (versus accepting a compliance roadmap) is a demand-response that unfolds over the next 12-24 months.

**Likelihood rationale:** The CRA dates and product scope are enacted law, not forecast. Remaining doubt is whether remote-management PDUs need third-party assessment and how hard buyers push CRA-readiness in 2026 specs, so the estimate eases from 0.55 to 0.50.

**Early warnings:**
- CRA harmonized-standards progress for network/management devices and the important-product classification of remote-access equipment — watch: CEN/CENELEC JTC 13 work programme and the EU Official Journal harmonized-standards citations; Commission CRA implementing-act docket — trigger: Networked PDUs / remote management listed under Annex III important products, or harmonized standards slipping past mid-2026 (increases p)
- CRA/SBOM clauses appearing in data-center electrical RFQs and incumbent price lists — watch: TED (Tenders Electronic Daily) EU data-center fit-out tenders; Schneider/Vertiv/Eaton product-security pages and price-list footnotes announcing CRA-ready SKUs — trigger: ≥2 CE tenders requiring vendor SBOM/CRA attestation, or an incumbent marketing 'CRA-ready' as a differentiator (increases p)

**Mitigations:**
- [information] Commission a CRA classification and gap assessment (product class, assessment route, notified-body need) with a certified test house now, before design freeze — VOI(serviceableFactor) = €0.0M
- [strategic] Build the SBOM, secure-development and vulnerability-disclosure artifacts into the launch release and sell them as a differentiator against incumbents' legacy firmware
- [operational] Sequence Year-1 pipeline toward buyers not yet writing CRA clauses (mid-market enterprise retrofit) while conformity completes

**Evidence (corroborated):**
- [industry-report] Cyber Resilience Act (CRA) — DG CONNECT webinar slides — ENISA / European Commission DG CONNECT — https://certification.enisa.europa.eu/document/download/9d04238b-7f18-4575-a7dd-638afc92e019_en?filename=Slides_CRA_EUCC_webinar_June_2025.pdf&prefLang=fr
  > Entry into application: 11 December 2027 except for reporting obligations: 11 September 2026. In scope: 'products with digital elements'... network equipment... including their remote data processing solutions!
- [industry-report] CRA Product Classes: Implementing Regulation 2025/2392 Technical Descriptions — Safeguard — https://safeguard.sh/resources/blog/cra-implementing-regulation-2025-2392-product-classes
  > The default tier — roughly 90 per cent of products — permits self-assessment under conformity assessment Module A... Commission Implementing Regulation (EU) 2025/2392, signed on 28 November 2025... fixes the technical descriptions of each category.
- [industry-report] Cyber Resilience Act 2026: A Compliance Guide for OEMs — ComponentSense — https://www.componentsense.com/blog/cyber-resilience-act-2026-a-compliance-guide-for-oems
  > From 11th September 2026, electronics manufacturers selling into the EU will be facing a new legal obligation... If your product connects directly or indirectly to a network or device, it falls within scope.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names the regulation (EU 2024/2847), exact dates (11 Sep 2026 reporting, 11 Dec 2027 conformity), actors (CEN/CENELEC, ENISA, notified bodies, colo procurement), and ties them to specific ledger values (serviceableFactor 0.55, obtainableFactor 1% Year-1 anchor) with quantified perturbations (0.4, 0.006). Indicators cite concrete venues (TED, JTC 13 work programme, incumbent price lists).
- *nonObviousness*: The whyMissable is genuinely good: 'CE marking' reads as a checked box while the conformity ROUTE (SBOM, CVD, possible third-party assessment) changes, and buyers enforce it 1–2 years before the legal deadline. Docked one point because the risk's own evidence revision concedes the two most surprising claims — important-product classification and 2026 front-running — are softened or unevidenced, and self-labels expectedObviousness 'medium'.
- *mechanismDepth*: Four-step chain with refs at every hop, correctly linking the shortlist-scarcity digest to why one missing artifact removes the entrant from the 1% anchor. But the load-bearing propagation hop — 'procurement specs are already demanding CRA-readiness attestations today' — is asserted by compliance vendors only and the risk's own Vertiv spec stance is 'silent' (cites UL/FCC/IEEE, no CRA), so a hostile 'why?' at that arrow gets an admitted gap.
- *evidenceQuality*: The trigger (dates, in-scope status) has ≥2 independent sources, but two sub-premises are contradicted by the risk's own stances: Implementing Regulation 2025/2392 puts ~90% of products in self-assessment and Annex III lists routers/switches but not PDUs, undermining the notified-body-queue escalation. The front-running premise driving the perturbations has no direct RFQ evidence; the honest downward revision to 0.5 earns credit but the key propagation premise remains speculative.
- *decisionRelevance*: Mitigations change near-term spend and sequencing: commission a CRA classification gap assessment before design freeze, build SBOM/CVD artifacts into the launch release, and redirect Year-1 pipeline toward buyers not yet writing CRA clauses. Both indicators (TED tender clauses, JTC 13 / implementing-act docket) are concretely monitorable with stated thresholds, and the falsifier is checkable within one sales cycle.

*Provenance: raw evidence `risks/raw/evidence/risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window.json` · transcripts `risks/raw/llm/`*

---

### Bundled PDUs shrink the winnable pool below the model's floor

`risk.competitive-foreclosure.bundle-pricing-kills-bakeoffs` · **rock** · execution · lens: competitive-foreclosure · p=38% (evidence) · judge 16/20

The model assumes there is a pool of standalone rack-PDU purchases a new entrant can compete for, sized at 0.5 to 3% of the market. But the incumbents who sell the $23B power and $26B cooling packages bundle the PDUs inside those deals, and the only standalone tenders found were tiny and barely contested. That pushes the real Year-1 share to about 0.3%, below the model's own 0.5% floor.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.49 (−€1.16M) · E[YAM loss] −€0.44M

**Perturbation:** set obtainableFactor → 0.003 (Contestable-decision pool shrinks the effective Year-1 capture below the modeled 0.5% floor)

**Mechanism:**
- *trigger*: Incumbents bundle PDUs into power and cooling deals at zero margin `[digest:cust-mix#c2, digest:cust-mix#c3, ledger:shape.cr3]`
- *propagation*: Leftover standalone tenders are small, sole-sourced, or barely contested `[digest:obtainable-benchmark#c1, digest:obtainable-benchmark#c6, digest:obtainable-benchmark#c7]`
- *model-impact*: Real Year-1 share drops to about 0.3%, below the floor `[ledger:obtainableFactor, digest:obtainable-benchmark#c10, digest:obtainable-benchmark#c0]`

**Why missable:** The team already cut this number from 3% to 1%, so it reads as the most stress-tested figure when the real problem is that bundling removes winnable deals entirely.

**Falsifier:** A logged pipeline of five or more standalone, multi-vendor rack-PDU tenders in CE-7, each at least €250K, within any six-month window, where a non-incumbent can bid.

**Classification:** RISK — only time settles it · settle test: Only observing whether standalone, multi-vendor rack-PDU tenders actually materialize in CE-7 over the next 6-24 months (the falsifier itself is a forward pipeline count) settles this. Whether incumbents continue to bundle at zero margin and whether contestable standalone demand emerges is a market-unfolding question, not a purchasable fact about today.

**Likelihood rationale:** Bundling evidence and multi-year benchmark definitions both point below the floor, but retrofit and colo tenders do create some genuine standalone decisions the search may have missed. A surfaced CHF 2M standalone deal undercuts the tiny-tender claim, so the net revision is marginally downward.

**Early warnings:**
- Ratio of bundled vs standalone rack-PDU procurement in published CE tenders — watch: TED (tenders.europa.eu) — compare PDU-specific CPV lots vs PDU lines inside integrated electrical-fit-out lots — trigger: ≥80% of PDU volume appearing only inside integrated lots over two quarters (increases p)
- Incumbent commentary on solutions/portfolio attach rates for rack power — watch: Vertiv and Schneider quarterly earnings calls; Schneider capital markets day materials — trigger: Explicit statements that rack PDU is sold predominantly as part of integrated rack/power/cooling solutions (increases p)

**Mitigations:**
- [information] Build a bottom-up contestable-tender census for CE-7 (12 months of TED + colo tenant RFQs) to replace the generic 1% benchmark with a counted pipeline — VOI(obtainableFactor) = €0.0M
- [strategic] Target the purchase moments bundles don't reach: colo TENANT-side PDU purchases and brownfield retrofit/metering upgrades, where no incumbent package exists to hide the PDU inside
- [operational] Price and package for attach to third-party rack integrators' bundles rather than head-to-head against incumbent bundles

**Evidence (contested):**
- [industry-report] Beschaffung von Stromverteilereinheiten (PDU) — Direct Award, Stadt Zürich — it-beschaffung.ch / Stadt Zürich OIZ — https://www.it-beschaffung.ch/564/beschaffung-von-stromverteilereinheiten-pdu
  > Beschaffung von 900 Stromverteilereinheiten... Awards: Riedo Networks AG CHF 1,996,000. Marktabklärungen zeigten, dass nur eine Firma PDU anbieten kann... Die Vergabe erfolgt somit freihändig.
- [industry-report] Serviceable Obtainable Market (SOM): How to Calculate It — Prospeo — https://prospeo.io/s/serviceable-obtainable-market
  > SOM is the revenue you can realistically capture in 1-3 years. Not a fantasy percentage of SAM.
- [industry-report] SAM vs SOM: Key Differences Explained — VC Beast — https://vcbeast.com/compare/sam-vs-som
  > SOM is the portion of SAM you can realistically capture in a defined time period (usually 3-5 years)... Typical SOM is 1-5% of SAM for early-stage companies.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names the target node (obtainableFactor 0.5–3% band), dollar figures ($23B power, $26B cooling, $58K–$130K tenders, CHF ~2M award), actors (Vertiv, Schneider, Riedo, Stadt Zürich), and instruments/venues (TED CPV lots, earnings calls) with a concrete perturbation to 0.3%. The falsifier is quantified (≥5 tenders ≥€250K in 6 months).
- *nonObviousness*: This is not a band-edge complaint: the compositional argument that bundling shrinks the contestable DENOMINATOR (per whyMissable, 'a smaller pie of decisions, not a smaller slice of spend') and the discovery that the 1% benchmark's own sources define SOM as multi-year cumulative are genuinely new reasons. Docked one point because the team already stress-tested this node (3%→1%) and 'incumbents bundle' is a hypothesis a competent hardware founder would at least have on the list.
- *mechanismDepth*: Three-step chain with refs at every arrow, and the benchmark-semantics leg (Prospeo 1–3yr, Wise 3–5yr, TryBuildCo ~0.1%) survives interrogation. But the trigger — incumbents cross-subsidising PDUs to zero incremental margin — is asserted; the risk's own rationale admits 'the core zero-margin bundling mechanism remains unevidenced.'
- *evidenceQuality*: Sole-sourcing and spec-locked tenders are corroborated (Zurich direct award, SSC 'Raritan or equivalent'), and the SOM-window semantics have multiple sources, but the narrative's 'only tiny ($58K–$130K)' premise is directly undercut by the CHF ~2M deal in its own evidence, and VC Beast's 1–5% band contradicts 'both legs point below.' The honest contested status and downward likelihood revision (0.4→0.38) keep this at 2 rather than lower.
- *decisionRelevance*: Mitigations change near-term sequencing and spend: a 12-month TED/RFQ contestable-tender census (explicit VOI on obtainableFactor) and a pivot to tenant-side/retrofit purchase moments where bundles can't hide the PDU. Both indicators are monitorable now via TED lot composition and Vertiv/Schneider earnings commentary with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.competitive-foreclosure.bundle-pricing-kills-bakeoffs.json` · transcripts `risks/raw/llm/`*

---

### One WiFi sensor forces EU radio security review, adds 2 quarters

`risk.regulatory-gauntlet.red-en18031-wireless-sensor-gate` · **rock** · execution · lens: regulatory-gauntlet · p=40% (evidence) · judge 18/20

The model assumes the smart PDU can start selling right away and win 1% of its market in Year 1. But if it ships with any radio, an EU cybersecurity rule in force since 1 August 2025 requires a notified body to certify it, adding a 4 to 6 month wait. That queue shortens the selling window from 12 months to 6 to 8, cutting the Year-1 number roughly in half.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.83 (−€0.83M) · E[YAM loss] −€0.33M

**Perturbation:** scale obtainableFactor → 0.5 (Selling window compressed from 12 to ~6–8 months by notified-body lead time)

**Mechanism:**
- *trigger*: Product ships with a radio, triggering the EU rule live since August 2025. `[profile:Product, profile:Stage]`
- *propagation*: Access-control settings force notified-body review; late start loses Year-1 deals. `[digest:refine-demand-discontinuity.prelet-pipeline-lockout#c0, digest:refine-competitive-foreclosure.bundling-eliminates-bakeoffs-year1#c2, ledger:obtainableFactor]`
- *model-impact*: Shorter selling window cuts the 1% Year-1 share about in half. `[ledger:obtainableFactor, digest:obtainable-benchmark#c5, digest:refine-execution-window.som-window-semantics-mismatch#c4]`

**Why missable:** The rule reads as being about radios, so this power-distribution team overlooks it, and nobody owns the requirement triggered by a cheap wireless sensor.

**Falsifier:** Proof the launch product is wired-only, or an assessment showing its access-control design needs only self-declaration with a certificate in hand before first shipment.

**Classification:** RISK — only time settles it · settle test: Only the actual product design decision (radio vs wired-only, self-declaration vs notified-body path) and the real certification queue timing as the launch unfolds would settle whether Year-1 window is truncated. The regulation exists today, but whether it binds depends on unmade product/compliance choices and future queue behavior — time settles it, not a purchasable report.

**Likelihood rationale:** Wireless sensing is common in current smart-PDU designs and the certification traps are documented, but a wired-only launch fully avoids the gate. Timing, restrictions, and the 12 to 20 week lead time are confirmed, so we raise likelihood from 0.35 to 0.40, bounded by not knowing if the launch product ships a radio.

**Early warnings:**
- EN 18031 harmonization restrictions status (whether the OJ listing's restrictions are lifted or extended) — watch: EU Official Journal harmonized-standards citations under RED; NANDO database queue times for RED cybersecurity notified bodies — trigger: Notified-body lead quotes >4 months, or restrictions extended into 2026 (increases p)
- Own-product radio scope decision and test-house booking — watch: Internal launch BOM review; test-house (TÜV/DEKRA) quotation and slot calendar for EN 18031 — trigger: Radio in launch SKU with no notified-body slot booked 9 months pre-launch (increases p)

**Mitigations:**
- [information] Run an immediate RED applicability screen on every launch configuration and get a written EN 18031 gap assessment from a notified body — VOI(obtainableFactor) = €0.0M
- [operational] De-content the launch SKU to wired-only (Ethernet/serial), shipping wireless sensing as a post-certification accessory

**Evidence (corroborated):**
- [industry-report] EU Harmonizes EN 18031 Standards — SGS — https://www.sgs.com/en/news/2025/02/safeguards-02625-eu-harmonizes-en-18031-standards
  > If applied in full, the EN 18031-X:2024 series of harmonized standards allow manufacturers to demonstrate regulatory compliance by offering self-declaration, thereby avoiding the involvement of a Notified Body. However, if a product does not fully comply... manufacturers must obtain certification via a Notified Body before placing their [products on the market].
- [industry-report] Cybersecurity in Europe (webinar) — Nemko — https://www.nemko.com/hubfs/2025-02-25%20Webinar%20-%20for%20distribution.pdf
  > 1 Aug 2025 cybersecurity is part of CE marking for wireless products (RED)... When using password, the option not to set password is not accepted... If no harmonized standard is used = Notified Body
- [industry-report] EN 18031-1 General Cybersecurity Certification: Steps & Timeline — BlueAsia Labs — https://www.blueasialabs.com/shouyehuandeng/en-18031-1-general-cybersecurity-certification-steps-amp-timeline
  > The 12-20 week process detailed here applies to products requiring notified body (NB) conformity assessment... many enterprises faced delays: no pre-testing leading to 1-month rework; incomplete documents causing 3-week audit holds; underestimated factory audit time missing launch windows.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 4/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact instrument (EU 2022/30), standard family (EN 18031-1/-2), applicability date (1 Aug 2025), NB lead times (12–20 weeks), target node (obtainableFactor), and a quantified perturbation (window 12→6–8 months, 0.5 scale). Actors (notified bodies, TÜV/DEKRA test houses) and dated thresholds are all present.
- *nonObviousness*: The genuinely non-obvious core is the harmonization-with-restrictions trap that forecloses self-declaration for common access-control designs — a nuance most EE-led compliance plans (LVD/EMC/EN 62368-1, per whyMissable) would miss. Docked one point because 'any radio triggers RED' is reasonably well known to hardware founders, even if the accessory-sensor pathway is well argued.
- *mechanismDepth*: Each hop is referenced: radio → delegated act → restriction-forced NB certification → 12–20 week queue → compressed window, and the window→obtainable halving is grounded in the pre-let pipeline lockout and bake-off foreclosure digests rather than asserted. The chain honestly conditions on the launch-SKU configuration and states that conditionality in the likelihood rationale.
- *evidenceQuality*: The regulatory premises (timing, restrictions, NB requirement, lead time) have ≥2 independent corroborating sources including EUR-Lex, SGS, and Nemko. But the load-bearing premise — that the launch SKU actually contains a radio — has zero product-side evidence and is only inferred as 'common,' which the likelihood rationale honestly concedes remains unresolved.
- *decisionRelevance*: The mitigations (immediate RED applicability screen, de-content to wired-only launch SKU) directly change BOM and certification sequencing within the next quarter, well before first ship. Both indicators (NANDO queue quotes, radio-in-BOM with no NB slot 9 months pre-launch) are concrete and monitorable.

*Provenance: raw evidence `risks/raw/evidence/risk.regulatory-gauntlet.red-en18031-wireless-sensor-gate.json` · transcripts `risks/raw/llm/`*

---

### Large-operator sales are locked up by long-term framework deals

`risk.competitive-foreclosure.framework-agreements-close-first-buyer` · **rock** · competitive · lens: competitive-foreclosure · p=42% (evidence) · judge 16/20

The model names large operators as the first buyer and prices that cell at 40% of spend. But those operators buy rack power through multi-year framework contracts, like the Digital Realty–Schneider $373M deal, that remove the tender from the market for the whole term. If most of that 40% is already under contract, the Year-1 beachhead is closed and the number shifts onto slower cells.

**Impact (engine):** TAM +€300M → +€240M (−€60.00M) · YAM 1.65 → 0.92 (−€0.73M) · E[YAM loss] −€0.30M

**Perturbation:** set cust.operator-large → 0.2 (Framework-governed spend removed from the addressable large-operator cell; residual is framework gaps, expiries and carve-outs) · scale obtainableFactor → 0.7 (Year-1 pace slows further because the remaining open demand sits in channels the venture did not plan to enter first)

**Mechanism:**
- *trigger*: Large operators extend multi-year framework deals with incumbent vendors `[digest:cust-mix#c12, digest:cr3-vendors#c1, ledger:cust.operator-large]`
- *propagation*: No open bid reaches the market during the contract term `[profile:Stage, ledger:cust.operator-large, digest:cust-mix#c0]`
- *model-impact*: The reachable large-operator share falls from 40% to about 20% `[ledger:cust.operator-large, ledger:obtainableFactor, digest:cust-mix#c0]`

**Why missable:** 'Large operators buy direct' reads as good news, hiding that direct buying at this scale means locked framework contracts, not open sales.

**Falsifier:** Two or more large operators issuing open, multi-vendor rack-PDU bids within the next 12 months.

**Classification:** RISK — only time settles it · settle test: Only the unfolding of the next 12 months settles this: whether large operators actually issue open, multi-vendor rack-PDU tenders during current framework terms, or keep spend locked. No purchasable dataset today states what fraction of the 40% is contract-foreclosed for rack-PDU specifically — the cited deals cover UPS/switchgear/skids, not rack PDUs, and even those preserve 'multi-vendor' flexibility. The claim hinges on future tender behavior, a foreclosure gate that may or may not bind.

**Likelihood rationale:** Multiple documented deals point the same way, so the mechanism is real. What is uncertain is how much operator spend is locked, and the vendor's own claim of a multi-vendor environment argues against full foreclosure.

**Early warnings:**
- Global or EMEA rack-power framework renewals announced by Schneider/Vertiv/Eaton with named CE operators — watch: Schneider and Vertiv press rooms; DataCenterDynamics procurement coverage; operator annual reports (supplier commitments notes) — trigger: Any CE major renewing a ≥3-year rack-power framework during the venture's launch year (increases p)
- Standalone rack-PDU lots appearing in European public/colo tenders — watch: TED (tenders.europa.eu) CPV codes for power distribution equipment; national procurement portals (DE: bund.de vergabe) — trigger: Fewer than 2 standalone, multi-vendor PDU lots per quarter across CE-7 (increases p)
- AVL qualification requirements and cycle times quoted in operator supplier-onboarding portals — watch: Equinix/Digital Realty/NTT GDC supplier registration portals; Vantage/CyrusOne EU procurement contacts — trigger: Mandatory ISO 27001 or 12+ month qualification stated for electrical-fit-out vendors (increases p)

**Mitigations:**
- [information] Structured interviews with 3 CE operator procurement leads specifically on framework coverage, term dates, and second-source carve-out clauses — VOI(cust.operator-large) = €10.5M
- [strategic] Build the Year-1 account plan around framework expiry dates and approved-second-source slots rather than open-market wins
- [contractual] Negotiate pilot clauses with operators' innovation/energy teams that sit outside procurement frameworks (retrofit metering pilots)

**Evidence (contested):**
- [industry-report] Schneider Electric and Digital Realty Announce $373M Supply Capacity Agreement — PR Newswire / Schneider Electric — https://www.prnewswire.com/news-releases/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-to-meet-rising-data-center-demand-302620427.html
  > has signed a $373 million Supply Capacity Agreement (SCA) for UPS, Low Voltage Switchgear, and Pre-Fabricated Skids... The strategic shift to an SCA model provides guaranteed capacity... while preserving the flexibility needed for a dynamic, multi-vendor environment to mitigate risk.
- [industry-report] HD Hyundai Electric Signs $1.1 Billion Supply Deal with Big Tech for North American Data Centers — AJU Press — https://m.ajupress.com/view/20260702112470315
  > entered into a basic contract for a long-term supply of distribution and power equipment worth up to $1.1 billion... Supplying both types of equipment together enhances the design consistency... and reduces risks in delivery, quality, and after-sales service.
- [industry-report] Supply Chain and Technology Agreements in Data Center Construction — Bracewell LLP / JD Supra — https://www.jdsupra.com/legalnews/supply-chain-and-technology-agreements-1931379/
  > data center operators are increasingly relying on robust supply chain and technology agreements that include component shortage remedies, price adjustment clauses, alternative sourcing clauses as well as revamped force majeure.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names ledger nodes (cust.operator-large at 0.40, obtainableFactor), quantified perturbations (set 0.20, scale 0.7), named actors (Schneider/Vertiv/Eaton, Equinix, Digital Realty), instruments (framework agreements, SCAs) and the Year-1 window. Indicators cite concrete venues (TED CPV codes, vendor press rooms) with numeric thresholds.
- *nonObviousness*: The distinction that the 0.33–0.47 band models SIZE error, not contractual AVAILABILITY, is a genuinely new axis not in the model, and whyMissable correctly shows how 'direct buyers with a nameable account list' reads as good news. Falls short of 4 only because framework/preferred-supplier lock-in is a known B2B infrastructure pattern a strong founder might eventually surface.
- *mechanismDepth*: Three-step chain with refs at each hop (renewal → no contestable RFQ during mid-term → addressable fraction collapse) and the timing argument (launch window coincides with mid-term, not renewal) is sharp. But the model-impact step's ~0.20 residual is asserted rather than derived, and the risk's own evidence revision admits foreclosure is 'likely less complete' than the chain assumes.
- *evidenceQuality*: The flagship Digital Realty–Schneider SCA covers UPS/switchgear/skids, not rack PDU, and its own quoted language ('preserving flexibility... multi-vendor environment') contradicts full foreclosure — as the contested stances and the honest 0.50→0.42 revision acknowledge. Two supporting sources corroborate the bundling pattern generally, so this lands as a partially-contradicted but honestly-flagged premise rather than a clean corroboration.
- *decisionRelevance*: Directly reorders the declared Year-1 beachhead: mitigations specify procurement interviews to replace the unsourced 0.40, an expiry-calendar account plan, and framework-bypassing pilot clauses — all actionable within two quarters. Both indicators (framework renewals, standalone PDU lots on TED) are monitorable now with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.competitive-foreclosure.framework-agreements-close-first-buyer.json` · transcripts `risks/raw/llm/`*

---

### Year-1 may hit a building lull the trend growth hides

`risk.demand-discontinuity.construction-plateau-lumpy-year1` · **rock** · exogenous · lens: demand-discontinuity · p=30% (evidence) · judge 16/20

The model assumes Year-1 lands in an average demand year at 1% of the serviceable market. But EMEA capacity under construction has stalled at about 2.5 GW while the pipeline grew 25% to nearly 15 GW, so projects are stuck in planning. If 2026 is a digestion year, Year-1 order pace could be roughly half the assumed level.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 0.83 (−€0.83M) · E[YAM loss] −€0.25M

**Perturbation:** scale obtainableFactor → 0.5 (Trough-year order flow: achievable Year-1 pace at half the on-trend anchor)

**Mechanism:**
- *trigger*: EMEA construction stalled at 2.5 GW; pipeline grew to 15 GW `[digest:geo-NL#c3, digest:geo-NL#c2]`
- *propagation*: Cloud buys 61% of demand; a pause stalls orders `[digest:geo-DE#c18, ledger:shape.cagr]`
- *model-impact*: A trough year roughly halves achievable Year-1 pace `[ledger:obtainableFactor]`

**Why missable:** The growth rate looks solid across three publishers, but a smooth average hides which year of the cycle the launch actually lands in.

**Falsifier:** Cushman & Wakefield or JLL H1-2026 prints showing under-construction capacity above 2.5 GW with rising starts, or hyperscaler guidance re-accelerating 2026 European data-center capex.

**Classification:** RISK — only time settles it · settle test: Only H1-2026 and full-year 2026 market prints (Cushman/JLL/datacenterHawk) can reveal whether 2026 is actually a digestion year with construction stalled and order pace halved — this depends on how the next 6-12 months unfold, not on a fact knowable today.

**Likelihood rationale:** The plateau and buyer concentration are documented, but the timing of a digestion year is a judgment call. Record 2026 hyperscaler leasing and an 83% pre-let pipeline point the other way, so we cut the estimate modestly from 0.35.

**Early warnings:**
- European data-center capex commentary and guidance from the top cloud buyers — watch: Microsoft/Alphabet/Amazon/Meta quarterly earnings calls, EU infrastructure line items — trigger: Two or more guiding EU DC capex flat-to-down for 2026 (increases p)
- EMEA under-construction capacity metric — watch: Cushman & Wakefield EMEA data centre update (half-yearly) — trigger: UC stuck at ≤2.5 GW for two consecutive prints while pipeline keeps growing (increases p)

**Mitigations:**
- [information] Build a CE fit-out start-date tracker (construction starts, not announcements) to time the Year-1 sales push against real order windows — VOI(obtainableFactor) = €0.0M
- [strategic] Anchor the Year-1 revenue plan on installed-base retrofit and replacement demand, which is driven by the operating stock rather than the construction cycle
- [operational] Keep manufacturing and inventory commitments flexible (contract manufacturing, low fixed minimums) to survive a two-quarter order trough without cash strain

**Evidence (contested):**
- [industry-report] Cushman & Wakefield: European data centre growth is shifting — Cushman & Wakefield — https://www.cushmanwakefield.com/en/netherlands/news/2026/04/emea-datacentre-update-h2-2025
  > the total development pipeline increased by more than 25% to nearly 15 GW. In practice, however, delivery is lagging behind. Capacity currently under construction has plateaued at around 2.5 GW.
- [industry-report] 1Q 2026 EMEA Data Center Market Report — datacenterHawk — https://datacenterhawk.com/resources/market-insights/1q-2026-emea-data-center-market-report
  > Hyperscalers returned to Europe at record scale... 767MW Q1 absorption (record)
- [industry-report] EMEA year end data centre report 2025 — JLL — https://www.jll.com/en-uk/insights/emea-data-centre-report
  > FLAP-D vacancy hits record low of 6.3%, pipeline is 83% pre-let. Capacity is being absorbed faster than it can be replaced.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names concrete values (~2.5 GW under construction vs ~15 GW pipeline, 61% public-cloud take-up), actors (three-four hyperscaler capex committees), the exact ledger node (obtainableFactor's 1%-of-SAM anchor), and a dated window (2026, 2-4 quarter pause). The perturbation is a specific 0.5 scale with a stated rationale.
- *nonObviousness*: The whyMissable is genuine: the 8-10% CAGR is triangulated and 'looks solid', annual lumpiness never appears in a CAGR, and the plateau statistic lives in a real-estate H2 update outside PDU market reports — a new reason, not a band-edge complaint. Docked one point because 'AI capex digestion year' is a widely discussed macro worry a well-read founder might already carry.
- *mechanismDepth*: Each hop is referenced and individually plausible: plateau shows conversion (not demand) binds → 61% buyer concentration synchronizes fit-out starts → PDU orders follow fit-out → obtainableFactor's on-trend assumption breaks. The propagation step still rests on the conditional 'if 2026 is a digestion year', which the risk's own contradicting evidence (record absorption, 83% pre-let) leaves unestablished, so it wouldn't fully survive a hostile 'why now?'.
- *evidenceQuality*: The structural trigger has 2+ independent corroborations (Cushman & Wakefield, TechCentral, Colliers), but the load-bearing timing premise — a trough inside the launch window — is directly contradicted by strong sources the risk itself attaches (datacenterHawk record Q1 leasing, JLL 83% pre-let). Honest handling (evidenceStatus 'contested', likelihood revised 0.35→0.30 with reasoning) keeps this at 2 rather than lower.
- *decisionRelevance*: The mitigations change near-term sequencing and spend: anchoring Year-1 revenue on retrofit/replacement demand and keeping manufacturing commitments flexible are next-two-quarter decisions, plus a fit-out tracker with a named voiNodeId. Both indicators are monitorable at stated venues with explicit thresholds (≥2 hyperscalers guiding EU DC capex flat-to-down; UC ≤2.5 GW for two consecutive C&W prints).

*Provenance: raw evidence `risks/raw/evidence/risk.demand-discontinuity.construction-plateau-lumpy-year1.json` · transcripts `risks/raw/llm/`*

---

### A third of Year-1 hardware wins get returned, cutting realized share

`risk.base-rate-analogy.poc-acceptance-reversal` · **rock** · execution · lens: base-rate-analogy · p=40% (evidence) · judge 16/20

The model assumes the venture keeps whatever small share it wins in Year 1. But in the reference class, 30% of deployed industrial hardware systems are never fully accepted and get pulled back out. That makes the Year-1 number roughly 30% too high, and the lost accounts also undercut the Year-2 benchmark that assumes they survive.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 1.15 (−€0.50M) · E[YAM loss] −€0.20M

**Perturbation:** scale obtainableFactor → 0.7 (Gross Year-1 capture haircut by the industrial-hardware non-acceptance base rate (~30% of deployments reverse))

**Mechanism:**
- *trigger*: 30% of deployed industrial hardware systems were never fully accepted `[digest:obtainable-benchmark#c12]`
- *propagation*: First-year wins are pilots; PDU acceptance depends on post-install integration `[profile:Stage, ledger:cust.operator-mid, digest:cr3-vendors#c4]`
- *model-impact*: obtainableFactor is gross; net of returns, Year-1 share drops 30% `[ledger:obtainableFactor, digest:obtainable-benchmark#c0]`

**Why missable:** The revenue number already looks conservative at 1% of market, so no one checks whether that 1% stays booked.

**Falsifier:** The first three pilot deployments pass formal customer acceptance within 90 days of install, with no rollback in the following two quarters.

**Classification:** RISK — only time settles it · settle test: Whether this specific venture's first three pilot deployments pass formal customer acceptance and survive two quarters without rollback — an outcome that only unfolds over the next 12–24 months. No purchasable report settles what THIS venture's acceptance rate will be; the reference-class 30% is a prior about future execution, not a correctable fact about today's market size or share definition.

**Likelihood rationale:** The 30% non-acceptance rate now has the primary source plus two independent industrial-IoT datasets, and zero support track record raises the entrant's exposure. Revised up from 0.35 to 0.40, bounded because the base rate comes from adjacent classes and PDUs are simpler hardware.

**Early warnings:**
- Acceptance and return-rights clauses in pilot contracts — watch: Redlines from CE operator procurement teams on the venture's pilot MSAs, reviewed at each signing — trigger: Acceptance windows >90 days or unconditional return rights in a majority of pilot contracts (increases p)
- DCIM interoperability status of the product against the platforms CE operators run — watch: Sunbird/Schneider EcoStruxure/Vertiv Trellis compatibility matrices and the venture's integration test reports — trigger: Product absent from ≥2 of the major DCIM compatibility lists at launch (increases p)

**Mitigations:**
- [operational] Run a structured pre-launch DCIM interoperability certification program (top-3 platforms used by CE operators) and publish the compatibility matrix before the first pilot ships
- [information] Instrument the first five pilots as an acceptance-rate study — formal acceptance criteria, 90-day gates, root-cause logging on any reversal — to replace the generic 30% base rate with a venture-specific one — VOI(obtainableFactor) = €0.0M

**Evidence (corroborated):**
- [industry-report] The Economics of POC — Deploy 95 (Trista Li) — https://deploy95.substack.com/p/the-economics-of-poc
  > Thirty percent of deployed systems were never fully accepted: customers would sign, we’d deploy, and six months later, it came back. We were sending teams to uninstall while trying to hit revenue targets.
- [industry-report] Cisco Survey Reveals Close to Three-Fourths of IoT Projects Are Failing — Cisco — https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2017/m05/cisco-survey-reveals-close-to-three-fourths-of-iot-projects-are-failing.html
  > 60 percent of IoT initiatives stall at the Proof of Concept (PoC) stage and only 26 percent of companies have had an IoT initiative that they considered a complete success. Even worse: a third of all completed projects were not considered a success.
- [industry-report] Telefónica Germany upgrades data center operations with Vertiv PowerIT rPDUs — Vertiv — https://www.vertiv.com/495b0e/globalassets/content---assets-2025/documents/vertiv-telefonica_marketing-thought-leadership-case-study_emea-english.pdf
  > Vertiv delivered Vertiv™ PowerIT switched rPDUs... deploying energy-efficient critical infrastructure solutions [under a] strong, multi-year partnership — illustrating that PDU acceptance in enterprise accounts leans heavily on an existing vendor track record.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (obtainableFactor 0.01), quantifies the haircut (scale 0.7), names DCIM platforms (Sunbird, EcoStruxure, Trellis), 90-day acceptance gates, and the Year-2 3% benchmark dependency. Indicators specify where to look (pilot MSA redlines, compatibility matrices) and concrete thresholds.
- *nonObviousness*: The gross-vs-net distinction — that the funnel has no node where post-deployment reversal can even be expressed — is a structural gap, not a band-edge complaint, and the whyMissable correctly notes that a 'conservative' 1% deters auditing. Falls short of 4 because acceptance risk in first-year hardware pilots is a known failure mode a diligent founder might list.
- *mechanismDepth*: Each hop is referenced and independently plausible (pre-launch stage → pilots with acceptance clauses → DCIM/metering failures surfacing post-deployment → reversal killing Year-2 reference accounts), and the second-order effect on the staged benchmark is a genuine extra link. The weak arrow is applying an adjacent-class base rate directly as a 0.7 scale factor, which the risk's own rationale concedes is not PDU-specific.
- *evidenceQuality*: The load-bearing 30% figure comes from one substack anecdote, and the 'corroborating' Cisco/Manufacturer sources measure different things (IoT project success perception, PoC-stage stalls) rather than post-deployment uninstall reversal; the Vertiv piece supports a side premise. The rationale is honest about adjacency and the stances field surfaces contradicting rPDU pilot successes, which earns the speculative-but-honest tier, not corroborated.
- *decisionRelevance*: Both mitigations act in the next two quarters — pre-launch DCIM certification before first pilot ships, and instrumenting the first five pilots with formal acceptance gates — directly changing launch sequencing and spend. Indicators (MSA redline clauses, DCIM compatibility list presence) are concretely monitorable per the stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.base-rate-analogy.poc-acceptance-reversal.json` · transcripts `risks/raw/llm/`*

---

### German billing rules block core PDU value in half the market

`risk.execution-window.mid-eichrecht-metering-foreclosure` · **rock** · boundary · lens: execution-window · p=40% (evidence) · judge 18/20

The model assumes the smart PDU's metering premium sells across all geography. But in Germany, half the modeled geography, meters used to bill tenants per kWh must be legally certified, not just accurate, and this venture is not certified. That certification takes multiple quarters, so the Year-1 reachable share drops to the band floor at 0.45.

**Impact (engine):** TAM +€300M → +€300M (€0.00M) · YAM 1.65 → 1.35 (−€0.30M) · E[YAM loss] −€0.12M

**Perturbation:** set serviceableFactor → 0.45 (German billing-metering demand foreclosed until MID conformity; reachable share drops to band floor)

**Mechanism:**
- *trigger*: German law requires certified meters whenever billed per kilowatt-hour. `[digest:serviceable-benchmark#c13, ledger:serviceableFactor]`
- *propagation*: Colocation operators re-billing tenants are the buyers paying the premium; Germany is half the geography. `[ledger:geo.DE, ledger:seg.colocation, digest:serviceable-benchmark#c4]`
- *propagation*: Certification takes multiple quarters, missing Year 1; German billing demand is foreclosed. `[profile:Stage, digest:serviceable-benchmark#c8]`
- *model-impact*: The 0.55 factor includes demand it cannot reach; share falls to floor. `[ledger:serviceableFactor, ledger:geo.DE]`

**Why missable:** The datasheet meets billing-class accuracy, so metering looks solved, but the German rule is a certification regime, not an accuracy test, invisible until a procurement lawyer asks for the declaration.

**Falsifier:** Two German colocation operators or the regulator confirm that PDU metering for tenant re-billing is exempt, or that capacity-tier billing makes certified metering commercially irrelevant.

**Classification:** RISK — only time settles it · settle test: Only the passage of time settles this: whether MID/certification actually forecloses German tenant re-billing demand in Year 1 depends on the venture's certification timeline, whether colocation operators use kWh vs capacity-tier billing, and how demand responds — none of which is fixed by a purchasable report. The legal requirement (MID) is documented today, but the load-bearing claim is that this forecloses reachable Year-1 share, which is a forward market-response gate.

**Likelihood rationale:** The legal obligation for per-kWh billing is clear, but its bite depends on how much German colo billing is actually measured per kWh versus capacity-tier, which the evidence does not quantify. The serviceableFactor haircut may already absorb some certification friction, bounding the foreclosure.

**Early warnings:**
- Billing basis in German colo contract templates and tenders (measured per-kWh at rack vs fixed-kW capacity tiers) — watch: German colo operators' published service schedules; DE colo lots on TED and operator supplier portals — trigger: Per-kWh sub-metered billing specified in ≥30% of sampled DE colo offerings (increases p)
- MID/Eichrecht enforcement posture and guidance on data-center sub-metering — watch: PTB publications and Länder eichamt enforcement notices; VfEB (Eichrecht compliance association) docket — trigger: Any published guidance or enforcement action explicitly covering DC tenant re-billing meters (increases p)
- MID/Eichrecht metering clauses in German colo fit-out and PDU procurement specs — watch: German colo operator RFQs (NTT GDC, maincubes, Telehouse Frankfurt vendor portals); DKE/PTB legal-metrology dockets on data-center sub-metering — trigger: MID-compliant outlet metering named as mandatory in ≥2 German colo PDU specs (increases p)
- Incumbents marketing MID-certified PDU meter modules as a line item — watch: Rittal/Bachmann/Schleifenbauer price lists and German product pages (MID variants carry distinct SKUs) — trigger: MID variants appearing as the default rather than premium option in German channel price lists (increases p)

**Mitigations:**
- [information] Obtain a legal-metrology opinion plus two German colo billing-practice interviews to determine what fraction of DE PDU demand actually requires MID-conformant metering — VOI(serviceableFactor) = €0.0M
- [operational] Start MID module certification for the metering subsystem pre-launch in parallel with CE/TÜV, and ship a non-billing SKU positioning (monitoring/capacity-planning) for DE accounts until it lands

**Evidence (corroborated):**
- [industry-report] Is your sub-metering system MID compliant? — Inteb — https://weareinteb.co.uk/news/is-your-sub-metering-system-mid-compliant/
  > The consumption data from these sub-meters is then used to charge tenants for their personal energy use... all meters used for tenant recharging must comply with MID.
- [industry-report] MID Approved Power Metering - EDP Europe — EDP Europe — https://www.edpeurope.com/products/power-monitoring/power-distribution/intelligent-pdus/mid-approved-power-metering/
  > MID ... will stipulate that all meters supplied and installed for private billing must be MID certified. EDP Europe’s MID approved power metering system enables data centre hosting operatives to comply with this new legislation.
- [industry-report] Sector 3: Measuring Instruments Directive (MID) - PTB.de — PTB — https://www.ptb.de/cms/en/metrological-services/kbs/kbs3.html
  > EU type-examinations according to directive 2014/32/EU module B ... approvals of quality systems according to directive 2014/32/EU modules D, D1 ... Measuring instruments for electrical energy (WG 2.34)

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 4/4 · decisionRelevance 4/4
- *specificity*: Names the exact instrument (MID 2014/32/EU / MessEG, module B+D via notified body), the ledger nodes (serviceableFactor 0.55→0.45, geo.DE at 0.50), the buyer segment (colo re-billing), and the timing constraint (multi-quarter cert vs Year 1 funnel). Perturbation and indicators carry concrete numeric thresholds (≥30% of sampled DE tenders).
- *nonObviousness*: The conformity-regime-vs-accuracy-spec distinction is genuinely hidden — the whyMissable correctly notes a datasheet that 'meets billing-grade accuracy' actively masks the gate. Docked one point because the digest already flags the named cert set as narrower than the real EU stack, so a careful reader was pointed in this direction even if not at this instrument.
- *mechanismDepth*: Every hop is referenced (trigger→buyer overlap→cert timeline→serviceableFactor impact) and each is independently plausible. But a hostile partner asking 'what fraction of DE colo demand is actually per-kWh PDU-billed?' hits an admitted unquantified gap (the risk's own likelihood rationale concedes capacity-tier billing may dominate), which makes the flat set-to-0.45 perturbation partly arbitrary.
- *evidenceQuality*: The key premise — billed sub-metering requires MID conformity in Germany — is corroborated by an official Länder eichamt document (LBME NRW), PTB's module B/D process page, and independent industry sources (Inteb, EDP Europe, ChargePoint). Notably honest: it includes the Vaiking quote supporting estimate-based billing, the main fact that would weaken its own magnitude claim.
- *decisionRelevance*: Directly changes next-two-quarter sequencing: start MID module certification pre-launch in parallel with CE/TÜV and reposition a non-billing DE SKU, plus a cheap information buy (legal opinion + two operator interviews) against the named voiNode. Both indicators (DE tender billing basis, PTB/eichamt guidance) are concretely monitorable with stated thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.execution-window.mid-eichrecht-metering-foreclosure.json` · transcripts `risks/raw/llm/`*

---

### Two channels worth 35% can't open inside Year 1

`risk.base-rate-analogy.channel-calendar-lockout` · **rock** · execution · lens: base-rate-analogy · p=33% (evidence) · judge 16/20

The model assumes 35% of sales flow through OEM/integrator and distributor channels in the first year. But both channels admit new suppliers only on annual cycles that require certifications and references the venture does not have on day 1. That means the market the Year-1 percentage is applied to is much smaller than the model shows.

**Impact (engine):** TAM +€300M → +€228M (−€72.00M) · YAM 1.65 → 1.25 (−€0.40M) · E[YAM loss] −€0.13M

**Perturbation:** exclude cust.distributor (Distributor cell unavailable within the YAM window — listing cycle cannot complete inside 12 months from a zero-cert start) · set cust.oem → 0.11 (Integrator cell half-foreclosed: brand/certification selection excludes the entrant from established integrator programs; residual is opportunistic white-label volume)

**Mechanism:**
- *trigger*: Distributor listing opens once a year and needs certifications first. `[ledger:cust.distributor, profile:Stage, digest:serviceable-benchmark#c13]`
- *propagation*: Integrators pick known brands with certs and support history. `[ledger:cust.oem, digest:cr3-vendors#c4, digest:cr3-vendors#c7]`
- *model-impact*: Both cells hold 35% but stay closed all year. `[ledger:cust.oem, ledger:cust.distributor]`

**Why missable:** Channel shares look like a mix question, so reviewers debate the percentages instead of asking whether the channels are even open this year.

**Falsifier:** A signed distributor listing or OEM supply agreement with committed volumes, effective within the venture's first six months.

**Classification:** RISK — only time settles it · settle test: Only the passage of the venture's first year settles whether these channels actually open — a signed distributor listing or OEM supply agreement with committed volumes effective within the first six months. This is a future execution outcome (channel timing/gate binding), not a knowable-today market fact. The evidence itself shows both outcomes are possible: some new entrants (Micas, Centiel) secured distribution at entry, while other programs (Vertiv) gate on certifications. Which path this venture lands on depends on how the next 12 months unfold.

**Likelihood rationale:** Annual listing cycles and brand-based integrator selection are standard for this class of hardware entering EU distribution. Some Asian PDU entrants have compressed one cycle with EU-stock commitments, so the cells are not fully closed, revising likelihood from 0.4 to 0.33.

**Early warnings:**
- Line-card additions in rack-power categories at CE electrical/IT distributors — watch: Rexel, Sonepar, Also/Ingram product-catalog update announcements and new-vendor press releases — trigger: Zero new rack-PDU vendors added in the trailing two quarters signals a hard-gated cycle (increases p)
- Integrator RFI/qualification requirements for PDU suppliers — watch: Vendor-qualification questionnaires from CE rack integrators and modular-DC builders (e.g., responses to the venture's own outreach, logged monthly) — trigger: Certification-complete and ≥2 reference installs required at application in >75% of responses (increases p)

**Mitigations:**
- [information] Interview three CE distributors/integrators now (the ledger's own pending evidence) to map listing-cycle dates, entry requirements, and whether a 'new vendor' fast-track exists — VOI(cust.oem) = €0.0M
- [operational] Concentrate Year-1 entirely on the direct mid-operator/enterprise cells and treat channel listings as a Year-2 milestone with pre-work (cert dossier, EU stock plan) started in month 1

**Evidence (contested):**
- [industry-report] Vertiv Partner Program Home / EMEA Brochure — Vertiv — https://www.vertiv.com/49858a/globalassets/documents/brochures/vertiv-partner-program-emea-2024-en.pdf
  > participation in the Program is open only to approved companies; consolidate and track field and on-line training certifications in one location
- [industry-report] Micas Networks Signs First Distributor Agreement in Japan with SB C&S — Micas Networks — https://micasnetworks.com/company/news/sbcs20260226
  > Micas Networks Inc. ... has signed its first distributor agreement in Japan with SB C&S Corp — a new data center hardware entrant securing distribution access at market entry, not deferred to a next annual cycle.
- [industry-report] Centiel enters U.S. data center market through strategic partnership and framework agreement — EQS News / Centiel SA — https://www.eqs-news.com/news/ad-hoc/centiel-enters-u-s-data-center-market-through-strategic-partnership-and-multi-million-dollar-framework-agreement/40c538b1-9e4b-4936-9f17-aeb4ff311a15
  > signed a multi-year strategic distribution agreement ... For the current financial year, Centiel expects initial low double digit millions — a distribution agreement with committed volumes effective in the current year.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 2/4 · decisionRelevance 4/4
- *specificity*: Names both ledger nodes with their values (cust.oem 0.22, cust.distributor 0.13, 35% of funnel), the 12-month YAM window, named actors (Rexel, Sonepar, Vertiv, Legrand/MIND Park), and quantified perturbations (exclude distributor, oem→0.11). Nothing here is a placeholder.
- *nonObviousness*: The reframe from 'what share of each channel' to 'these cells have an opening date and the plan cannot intersect it' is a genuinely new reason beyond the ledger's admitted-unsourced shares, as the whyMissable field argues. Falls short of 4 because 'new entrants struggle to get on distributor line-cards without certs' is on many competent hardware founders' lists already.
- *mechanismDepth*: Three-step chain (calendar-gated listing → brand/cert-gated integrator selection → SAM shrinkage) with refs at every arrow and each link independently plausible. The strictest link — 'annual cycle cannot be compressed within 12 months' — is exactly where the risk's own evidence revision admits counterexamples exist, so the chain does not fully survive hostile 'why?' at that arrow.
- *evidenceQuality*: The gating premise is corroborated (Vertiv approved-companies clause, Legrand/MIND Park brand selection), but the load-bearing 'calendar-foreclosed in Year 1' amplifier is contradicted by the risk's own Micas and Centiel citations, and evidenceStatus is honestly marked contested with a downward revision to 0.33. Honest handling of contradiction earns 2, not more, since the amplifier drives both perturbations.
- *decisionRelevance*: The mitigations directly change next-two-quarter sequencing (concentrate Year-1 on direct cells, start cert dossier month 1) and prescribe cheap immediate information work pricing the unsourced 0.22/0.13 cells. Both indicators are concretely monitorable with stated thresholds, and the falsifier is crisp.

*Provenance: raw evidence `risks/raw/evidence/risk.base-rate-analogy.channel-calendar-lockout.json` · transcripts `risks/raw/llm/`*

---

### Distributor channel is locked shut for Year 1

`risk.competitive-foreclosure.distributor-line-review-lockout` · **rock** · competitive · lens: competitive-foreclosure · p=30% (evidence) · judge 15/20

The model treats the 0.13 distributor cell as an easy open channel. But that channel runs on annual line reviews, and Legrand owns both intelligent-PDU brands, Raritan and Server Technology, giving one vendor two slots on every line card. A pre-launch entrant arrives mid-cycle and cannot get listed until the next review, which lands after Year 1. That cell should contribute nothing to the Year-1 number.

**Impact (engine):** TAM +€300M → +€261M (−€39.00M) · YAM 1.65 → 1.44 (−€0.21M) · E[YAM loss] −€0.06M

**Perturbation:** exclude cust.distributor (Distributor cell unavailable to the venture within the Year-1 horizon — foreclosed by review-cycle timing and shelf exclusivity, not shrunk)

**Mechanism:**
- *trigger*: Distributors decide line cards once a year, at set reviews. `[digest:cust-mix#c7, digest:cr3-vendors#c4, ledger:cust.distributor]`
- *propagation*: Venture launches mid-cycle, so no distributor can list it. `[profile:Stage, digest:cust-mix#c13, ledger:cust.distributor]`
- *model-impact*: The 0.13 cell adds nothing to Year-1 demand. `[ledger:cust.distributor, ledger:obtainableFactor]`

**Why missable:** Distribution looks like the easy channel and 0.13 looks too small to check, but annual reviews close it for exactly the 12 months Year 1 measures.

**Falsifier:** A named distributor like Rexel or Sonepar confirming in writing it can list a new intelligent-PDU line within two quarters without waiting for the annual review.

**Classification:** RISK — only time settles it · settle test: Only the timing of actual distributor line-review cycles and whether the entrant gets listed within Year 1 will settle this — that is a future channel-adoption event, not a knowable-today number. Distributor listing decisions unfold over the next 12 months and depend on the entrant's launch date and each distributor's review calendar.

**Likelihood rationale:** Annual line reviews and Legrand's ownership of both PDU brands are confirmed facts. But three 2025-2026 cases show European distributors onboarding new PDU vendors outside a rigid annual gate, lowering likelihood from 0.45 to 0.30.

**Early warnings:**
- Intelligent-PDU brands listed on CE distributor line cards and webshops — watch: Rexel Germany / Sonepar online catalogs; Also and Ingram Micro DC-infrastructure category pages — trigger: Raritan + Server Technology + APC occupying all intelligent-PDU listings with no non-incumbent brand added over two quarters (increases p)
- Legrand channel-program announcements tightening intelligent-PDU distribution terms — watch: Legrand investor communications and EMEA partner-program pages; distribution trade press (ChannelPartner.de) — trigger: Any announced exclusivity, rebate-tier or dual-brand bundling program covering Raritan/Server Technology in EMEA (increases p)

**Mitigations:**
- [information] Commission a channel audit: map line-review dates, exclusivity terms and private-label requirements across the top 5 CE electrical/IT distributors — VOI(cust.distributor) = €0.0M
- [strategic] Enter via a distributor's private-label program (documented option) rather than as a branded line — sidesteps the brand-slot conflict
- [operational] Time distributor outreach to the review calendar and pre-book slots for Year-2 rather than burning Year-1 sales capacity on a closed gate

**Evidence (contested):**
- [industry-report] Aginode partners with Ethernetics to supply intelligent PDUs for data centres — Aginode — https://www.aginode.net/newsroom/news/details/2026/06/aginode-partners-ethernetics-supply-intelligent-pdus-data-centres
  > Aginode teams up with Ethernetics BV, a Belgian-based start-up developing patented energy saving power distribution units, to announce a technical and commercial partnership in the field of Intelligent Power Distribution Units (PDUs)
- [industry-report] Schleifenbauer Advanced PDUs Now Available at EDP Europe Distribution! — EDP Europe / Approved Business — https://www.approvedbusiness.co.uk/articles/40679
  > EDP Europe is now an official distributor of Schleifenbauer’s advanced, intelligent PDUs!
- [industry-report] CMS Distribution expands its power and energy portfolio through a strategic partnership with Legrand — CMS Distribution — https://www.cmsdistribution.com/press-release/cms-distribution-expands-its-power-and-energy-portfolio-through-a-strategic-partnership-with-legrand
  > CMS already has an established relationship with Legrand as a distributor of Raritan, one of Legrand’s key brands and a global leader in data centre infrastructure management. Raritan specialises in intelligent rack power distribution units (PDUs)

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 1/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (cust.distributor, 0.13), the actors (Legrand's Raritan + Server Technology, MaxPower, Rexel/Sonepar/Also), the timing gate (annual line reviews vs the 12-month YAM window), and a dated indicator set. Falsifier is concrete and addressed to named distributors.
- *nonObviousness*: The core insight — 'the cell is open in steady state but closed for precisely the YAM window because founders model channel share, not channel calendar' (whyMissable) — is a genuine timing reframe a founder reading the 0.13 cell would skip. Loses a point because the Legrand dual-brand consolidation half is already visible in the CR3 digest the risk itself cites.
- *mechanismDepth*: Three-hop chain (line-card concentration → mid-cycle launch blocked by review timing and unfundable private-label terms → cell excluded) with refs at every step. The middle hop's rigidity assumption ('no CE distributor can list inside the window') does not survive hostile questioning given the risk's own contradicting cases, so it falls short of 4.
- *evidenceQuality*: The load-bearing premise — mid-cycle lockout — is directly contradicted by three 2025-26 onboardings of new/startup intelligent-PDU vendors (Ethernetics/Aginode, Schleifenbauer at EDP and Mayflex) and the rolling-review source in the risk's own stances. The honest 'contested' status and 0.45→0.30 revision keep it above 0, but the decisive claim fails while only the background friction (Legrand consolidation, master-distributor structure) is corroborated.
- *decisionRelevance*: Mitigations directly re-sequence the next two quarters: a channel audit (voiNodeId cust.distributor), private-label entry as an alternative route, and deferring distributor outreach to Year-2 rather than burning Year-1 capacity. Both indicators (line-card composition, Legrand EMEA program terms) are monitorable at named venues with thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.competitive-foreclosure.distributor-line-review-lockout.json` · transcripts `risks/raw/llm/`*

---

### Colo power gear follows AI tenants out of category

`risk.boundary-substitution.colo-spec-contagion-from-hyperscale-tenants` · **rock** · boundary · lens: boundary-substitution · p=34% (evidence) · judge 17/20

The model treats colocation as the safe harbor for rack PDUs and gives it a zero sensitivity band, so it never appears in the tornado. But CBRE shows European colo demand being outstripped by hyperscaler and AI tenants, and in wholesale prelet halls the tenant, not the operator, dictates the rack power design. If those tenants specify busway and power shelves inside leased halls, the colo PDU content leaves the category while operator capacity keeps growing 19% a year. The one segment the model calls certain is the one with the hidden contagion path.

**Impact (engine):** TAM +€300M → +€282M (−€18.00M) · YAM 1.65 → 1.55 (−€0.10M) · E[YAM loss] −€0.03M

**Perturbation:** set seg.colocation → 0.12 (Wholesale/prelet AI-density share of colo (roughly a third of the slice) migrates to tenant-specified busway/shelf architectures)

**Mechanism:**
- *trigger*: AI tenants filling colo halls also dictate wholesale power specs `[digest:seg-mix#c15, digest:seg-mix#c13]`
- *propagation*: Tenants pick busway, so colo PDU content falls despite growth `[digest:seg-mix#c18, digest:seg-mix#c16]`
- *model-impact*: Null band hides all downside for the colo slice `[ledger:seg.colocation, digest:seg-mix#c1]`

**Why missable:** Colocation looks like the segment where rack PDUs are mandatory, and its null band keeps it out of every sensitivity view the team reviews.

**Falsifier:** Fit-out specs from 2026 CE wholesale colo preleases in Frankfurt and Amsterdam showing rack PDUs, not busway, as standard in AI-density halls.

**Classification:** RISK — only time settles it · settle test: Only future 2026+ wholesale prelet fit-out specifications from Frankfurt/Amsterdam AI-density halls, showing whether tenants actually specify busway versus rack PDUs, would settle this — that is a market design shift that hasn't yet resolved, not a knowable-today number.

**Likelihood rationale:** Tenant spec authority in wholesale preleases is documented and the buyer cohort is the migrating one, but retail and standard-density wholesale colo stay PDU-native. The AI signing surge is heavily Nordic rather than Frankfurt or Amsterdam, so the risk sits in the AI-density growth tranche; revised from 0.30 to 0.34.

**Early warnings:**
- Rack power architecture named in wholesale prelease fit-out specifications for AI-density halls — watch: Frankfurt and Amsterdam wholesale colo prelease announcements and fit-out tender documents; DCD/DCNN build coverage — trigger: ≥2 CE wholesale preleases specifying busway/power-shelf distribution as tenant standard (increases p)
- Colo operator capex-call language on standardizing power distribution for AI halls — watch: Digital Realty and Equinix EMEA quarterly capex calls and investor-day fit-out cost breakdowns — trigger: Explicit mention of busway or shelf standardization for new AI capacity (increases p)

**Mitigations:**
- [information] Commission a CE colo segmentation study splitting the 18% slice into retail vs wholesale/prelet MW and the power architecture specified in each — VOI(seg.colocation) = €0.0M
- [strategic] Anchor Year-1 sales in retail and managed colocation, where per-outlet metered PDUs are tied to tenant billing and remain architecturally sticky

**Evidence (corroborated):**
- [industry-report] European Real Estate Market Outlook 2025 — Data Centres — CBRE — https://www.cbre.com/insights/books/european-real-estate-market-outlook-2025/data-centres
  > Take-up of colocation data centre space in Europe is expected to outstrip new supply in 2025 given strong demand from hyperscalers and providers of AI and high-performance computing services.
- [industry-report] Vertiv PowerBar Track busway (double-stack) for AI colocation and hyperscale — Data Centre Insight / Vertiv — https://datacentreinsight.co.uk/2026/03/04/vertiv-announces-scalable-high-capacity-double-stack-busway-system-that-preserves-white-space-for-growing-ai-data-centre-demands/
  > The solution is designed to address rapidly evolving AI workloads within colocation and hyperscale data centres. Power distribution 'must keep pace' with AI and HPC scale demands.
- [analyst-estimate] Signings for AI Data Centre Capacity in Europe More Than Treble — CBRE UK — https://www.cbre.co.uk/press-releases/signings-for-ai-data-centre-capacity-in-europe-more-than-treble-in-first-nine-months-of-2025
  > Signings for AI-focused colocation capacity reached 414MW in the first nine months of 2025, up from 133MW compared to the same period in 2024. More than half (57%) was signed in the Nordics.

**Judge scorecard:** specificity 4/4 · nonObviousness 3/4 · mechanismDepth 3/4 · evidenceQuality 3/4 · decisionRelevance 4/4
- *specificity*: Names the exact node (seg.colocation 0.18, null band, single-source), the actor cohort (hyperscale/AI tenants in wholesale preleases), the instrument (tenant fit-out spec sheets specifying busway/power shelves), a quantified perturbation (0.18→0.12), and dated, located indicators (2026 Frankfurt/Amsterdam preleases). The 19%/20% capacity-growth figures and wholesale-vs-retail split within the 18% slice are all pinned.
- *nonObviousness*: Goes beyond 'a band edge might bind' by supplying a NEW structural reason: the node's null band makes it invisible in every tornado view, and the kill path runs through a wholesale/retail composition split the model doesn't carry, per whyMissable. Loses a point because the busway/shelf migration itself is already tracked in the model for self-build ('the same migration the exemplar tracks'), so extending it to colo is a step a sharp founder might take.
- *mechanismDepth*: Three-step chain with refs at each hop: tenant cohort fills colo halls → tenant spec authority in wholesale preleases displaces PDU content while capacity metrics stay healthy → null-band node makes erosion structurally invisible. The critical middle link (tenants actually specifying busway inside leased CE halls) is plausible and marketed-for but not yet directly observed, as the likelihood rationale itself admits, so it stops short of surviving every hostile 'why?'.
- *evidenceQuality*: ≥2 independent sources (CBRE take-up outlook, CBRE AI-signings data, Vertiv busway explicitly for colo white space) corroborate the trigger and the substitute's availability, and the risk honestly surfaces the contradicting retail-colo PDU evidence (JMP) and the Nordic-vs-Frankfurt geographic mismatch in its own rationale. Falls short of 4 because no direct prelease fit-out spec confirms PDU displacement in the exact falsifier markets.
- *decisionRelevance*: Mitigations change near-term action: a retail/wholesale segmentation study (information, voiNodeId set) and anchoring Year-1 sales in architecturally sticky retail colo directly alter sequencing and spend this year. Both indicators (prelease fit-out specs, operator capex-call language) are concrete, sourced, and monitorable with thresholds.

*Provenance: raw evidence `risks/raw/evidence/risk.boundary-substitution.colo-spec-contagion-from-hyperscale-tenants.json` · transcripts `risks/raw/llm/`*

---

## Kill log — review for false negatives

| Stage | Risk | Reason |
|---|---|---|
| compile | Normalizing colo-only shares to 1.00 launders a scope mismatch: the €300M is geographically misallocated away from where PDU demand actually sits | perturbation is a no-op at the baseline scenario |
| judge | The 1% Year-1 anchor is a 36-month number wearing a 12-month label | merged into risk.execution-window.som-window-semantics-year1-zero: The cluster contains several mechanistically distinct risks despite shared funnel targets. I  |
| judge | Buyer-side procurement norms (AVL qualification, ISO 27001/IEC 62443 attestations, global frameworks) close the chosen 40% large-operator beachhead for the entire Year-1 window | merged into risk.competitive-foreclosure.framework-agreements-close-first-buyer: The cluster contains several mechanistically distinct risks despite shared funn |
| judge | 83% pre-let pipeline plus long-lead electrical frameworks leave almost no contestable Year-1 PDU orders | merged into risk.execution-window.prelet-pipeline-lockout: The cluster contains several mechanistically distinct risks despite shared funnel targets. I identify |
| judge | The 0.22 OEM/integrator cell is squeezed from both sides — branded incumbents win the spec, Taiwanese ODMs win the white-label — leaving no seat for a CE entrant | merged into risk.competitive-foreclosure.oem-cell-two-sided-squeeze: The first two write-ups (oem-cell-double-squeeze-foreclosure and oem-cell-two-sided-squeeze |
| judge | NL's 0.28 is a share of a stock that regulation has frozen — growth migrates to self-build hyperscale the entrant reaches through a different (foreclosed) door | merged into risk.boundary-substitution.nl-selfbuild-hollows-second-geography: All three write-ups make the same core argument: geo.NL's 0.28 is well-triangulate |
| judge | The Netherlands' 0.28 slice is legally and electrically frozen for the entire Year-1 window | merged into risk.boundary-substitution.nl-selfbuild-hollows-second-geography: All three write-ups make the same core argument: geo.NL's 0.28 is well-triangulate |
| judge | The venture sells intelligent PDUs; the TAM counts all rack PDUs — the category boundary mismatch is inside the model, not at its edge | merged into risk.definition-scopedown.intelligent-subset-inflation: Three distinct mechanisms appear, each with a duplicate pair. (1) Intelligent-subset scope i |
| judge | TAM is apportioned on capacity stock, but PDU revenue follows fit-out flow — and the flow is concentrating outside CE-7 | merged into risk.definition-scopedown.stock-vs-flow-intensity-mismatch: Three distinct mechanisms appear, each with a duplicate pair. (1) Intelligent-subset sco |
| judge | The 'Europe ≈ 30%' hop is an inserted number; two sourced regional shares imply Europe is ≤24% | merged into risk.ledger-self-audit.europe-thirty-percent-arithmetic-ghost: Three distinct mechanisms appear, each with a duplicate pair. (1) Intelligent-subset  |
| judge | MID (2014/32/EU, MI-003) + German MessEG §32: billing-grade PDU metering in German colo is legally foreclosed without a legal-metrology approval the entrant cannot obtain in-window | merged into risk.execution-window.mid-eichrecht-metering-foreclosure: Two write-ups (mid-eichrecht-billing-metering-forecloses-german-colo and mid-eichrecht-met |
| judge | The chosen beachhead buys through global frameworks: half the large-operator cell is not a market for a regional entrant | merged into risk.ledger-self-audit.framework-agreements-hollow-large-operator-cell: All three write-ups describe the identical mechanism: global framework agree |
| judge | Global framework agreements make the 0.40 large-operator cell mostly non-contestable in the venture's window | merged into risk.ledger-self-audit.framework-agreements-hollow-large-operator-cell: All three write-ups describe the identical mechanism: global framework agree |
