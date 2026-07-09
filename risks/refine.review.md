# Refinement pass — 2026-07-08

17 model errors researched, ranked by expected Year-1 loss. Apply accepted diffs to lib/ledger.ts (values never auto-flow), then re-run `npm run risks -- --from=context`.

| # | Fact | Current | Suggested | Verdict | E[loss] |
|---|---|---|---|---|---|
| 1 | obtainableFactor | 0.03 | 0.01 (band 0.001–0.03) | confirm | −€2.53M |
| 2 | obtainableFactor | 0.03 | keep current | refute | −€2.42M |
| 3 | obtainableFactor | 0.03 | keep current | refute | −€2.32M |
| 4 | obtainableFactor | 0.03 | 0.02 (band 0.01–0.03) | adjust | −€1.94M |
| 5 | cust.operator-large | 0.4 | keep current | refute | −€0.89M |
| 6 | tamBase | 320 | keep current | refute | −€0.67M |
| 7 | cust.oem | 0.22 | keep current | refute | −€0.60M |
| 8 | tamBase | 320 | keep current | refute | −€0.53M |
| 9 | serviceableFactor | 0.55 | keep current | refute | −€0.49M |
| 10 | tamBase | 320 | keep current | refute | −€0.48M |
| 11 | tamBase | 320 | 300 (band 240–360) | confirm | −€0.34M |
| 12 | serviceableFactor | 0.55 | keep current | refute | −€0.30M |
| 13 | cust.operator-large | 0.4 | 0.32 (band 0.24–0.4) | adjust | −€0.25M |
| 14 | geo.NL | 0.28 | keep current | refute | −€0.12M |
| 15 | seg.enterprise | 0.29 | 0.29 (band 0.24–0.29) | confirm | −€0.10M |
| 16 | seg.hyperscale | 0.44 | 0.35 (band 0.25–0.44) | adjust | −€0.06M |
| 17 | geo.CH | 0.08 | 0.11 (band 0.08–0.13) | confirm | −€0.04M |

## Year-1 market share is set by a 3-5 year benchmark, too high

`risk.execution-window.som-window-semantics-mismatch` · fact `obtainableFactor` · current **0.03** · pipeline proposed **0.01** · verdict **confirm** → **0.01** (band 0.001–0.03)

The ledger's own cited Prospeo source explicitly assigns 1% of SAM to Year 1, with 3% and 5% reserved for Years 2 and 3. The model's 3% is therefore the Year-2 figure read as a Year-1 figure, making the Year-1 share roughly 3x too high. Anchoring at 1% with a band of 0.1% to 3% follows directly from the benchmark text and the Tractian comparable, whose stated first-year ARR of about $1.2M sits far below 1% of a multi-billion-dollar predictive maintenance market.

- [analyst-estimate] Addressable Markets: TAM, SAM & SOM Guide (2026) — Prospeo — https://prospeo.io/s/addressable-markets
  > SOM benchmarks that won't get you laughed out of the room: 1% of SAM in Year 1, 3% in Year 2, 5% in Year 3.
- [analyst-estimate] TAM SAM SOM Example: Real Numbers for 2026 — Prospeo — https://prospeo.io/s/tam-sam-som-example
  > Apply a 1% Year 1 capture rate and your SOM is ~$2.7M.
- [triangulation] LATAM SaaS + IoT Grows 10x to $1.2m in ARR — GetLatka — https://blog.getlatka.com/latam-saas-iot-grows-10x-to-1-2m-in-arr-3-7m-round-at-15m-valuation/
  > TRACTIAN Grows 10x to $1.2m in ARR, $3.7m Round at $15m Valuation

*Raw evidence: `research/raw/refine-execution-window.som-window-semantics-mismatch.json`*

---

## Rivals bundle PDUs, so the head-to-head bake-off rarely happens

`risk.competitive-foreclosure.bundling-eliminates-bakeoffs-year1` · fact `obtainableFactor` · current **0.03** · pipeline proposed **0.01** · verdict **refute** → **0.03** (band 0.01–0.05)

The proposal wants to cut the mid-band to 1% and open a 0.001% tail, but the fresh search does not support that. The procurement results show standalone rack/row-PDU contests do happen as separate RFPs, with named low bidders at Utah State and University of Utah and a Navy NRL sources-sought, which undercuts the 'no separate contest' bundle thesis. The revenue results for Enlogic and ZincFive give no Year-1 share figure, so the 0.001% anchor is unsupported. Absent any quantified contestable-share or win-rate data, the existing 1-5% benchmark band and 3% mid stand.

- [triangulation] Bid Results on Rack Level Power Distribution Units — UtahBids — https://www.utahbids.net/bid-result/uu207787178_rack_level_power_distribution_units-14458370
  > Intellivex Data Center Solutions is the apparent low bidder on the Utah State University's UU207787178 Rack Level Power Distribution Units solicitation, with a low bid of $57,900.00 USD. Bids were opened on October 30, 2025
- [triangulation] Modular Power Distribution Units (PDUs) — SAM.gov — https://sam.gov/workspace/contract/opp/6dfb31aa3a6b4e7aa1b8865b85db032a/view
  > The Cyber Operations Division at the Naval Research Laboratory (NRL) ... has a requirement to install six (6) Modular Power Distribution Units (PDUs) as part of its ongoing efforts to replace antiquated computer room infrastructure
- [analyst-estimate] Enlogic Company Profile — Owler — https://www.owler.com/company/enlogic
  > Est. Annual Revenue $5.0-25M

*Raw evidence: `research/raw/refine-competitive-foreclosure.bundling-eliminates-bakeoffs-year1.json`*

---

## Selling to slow large operators cuts Year-1 capture tenfold

`risk.structure-independence.year1-obtainable-correlated-with-slowest-cell` · fact `obtainableFactor` · current **0.03** · pipeline proposed **0.005** · verdict **refute** → **0.03** (band 0.01–0.05)

The proposal claims comparable hardware entrants started near 0.001% and that AVL/RVL qualification exceeds the 12-month horizon, so Year-1 capture should be cut roughly tenfold to 0.5%. The search results confirm that NVIDIA AVL/RVL gates exist and that direct sales to large operators face heavy friction, but they contain no benchmark figure for first-year market capture. There is no dataset showing 0.001% or 0.1-1% first-year capture, so the proposed 0.5% value has no numerical support and rests only on the assertion itself. The claimed settle test evidence was not found, so the ledger's triangulated 3% mid-band and 1-5% band stand.

- [industry-report] NVIDIA Supply Chain Certification — Grokipedia — https://grokipedia.com/page/NVIDIA_Supply_Chain_Certification
  > Central to this certification framework are the Recommended Vendor List (RVL) and Approved Vendor List (AVL), which serve as key tools for validating and qualifying vendors for specific hardware components, such as cooling distribution units (CDUs)
- [industry-report] Stalled at the Gatekeeper: The Hidden Friction in Complex Data Center Sales — DCSMI — https://www.dcsmi.com/blog/stalled-at-the-gatekeeper-the-hidden-friction-in-complex-data-center-sales
  > In today's hyper-dense, power-constrained, GPU-fueled infrastructure market, the traditional sales playbook isn't just outdated. It's an open invitation to margin evisceration.
- [industry-report] Market at the Boiling Point: Is the CDU Space Becoming Saturated? — Dell'Oro Group — https://www.delloro.com/market-at-the-boiling-point-is-the-cdu-space-becoming-saturated/
  > With around 40 vendors rushing into coolant distribution units, liquid cooling is surging

*Raw evidence: `research/raw/refine-structure-independence.year1-obtainable-correlated-with-slowest-cell.json`*

---

## Most Year-1 rack-PDU orders are already awarded to rivals

`risk.demand-discontinuity.prelet-pipeline-lockout` · fact `obtainableFactor` · current **0.03** · pipeline proposed **0.01** · verdict **adjust** → **0.02** (band 0.01–0.03)

The search confirms the core mechanism: data-center electrical gear is procured and locked early, before design is finalized, so pre-let builds do not represent open order books for new vendors. Multiple 2026 sources show gear is released against design gates 12-24 months or more ahead, with transformers and switchgear at 52-80 week lead times and orders placed before topology is set. This supports cutting the generic 3% benchmark for a design-locked hardware market. However, the specific 83% pre-let figure was not corroborated in these results, and the search also found open EU tenders where rack cabinets and PDUs are still being competed for delivery in 2026. That undercuts the harder claim that reachable flow is strictly below 1%. A modest cut to 2% with a wider band is defensible; the 1% floor is not fully evidenced.

- [industry-report] Data Center Electrical Procurement: Why the Order Has to Come Before the Design — Build — https://build.inc/insights/data-center-electrical-procurement-sequence-workflow
  > The conventional development sequence treats electrical equipment procurement as a downstream task: finish design, secure permits, then buy the gear. For data centers in 2026, that sequence is obsolete.
- [industry-report] How Data Center Owners Use Design Management to De-Risk Multi-Phase Builds — iRecruit — https://www.irecruit.co/insights/data-center-owners-design-management-de-risk-multi-phase-builds
  > owners cut risk by locking the basis of design early, tying equipment releases to design gates... With switchgear at 52 to 65 weeks, transformers at 52 to 80 weeks... one late decision can push out Ready for Service
- [triangulation] Servers - Germany tender (TED-370594-2026) — TED / Euroopahanked — https://euroopahanked.ee/hanked/TED-370594-2026?lang=en
  > data-centre infrastructure components, including 19-inch rack cabinets, control and monitoring systems, uninterruptible power supplies... Open procedure

*Raw evidence: `research/raw/refine-demand-discontinuity.prelet-pipeline-lockout.json`*

---

## Big-operator sales locked up by global contracts, out of reach

`risk.structure-independence.global-framework-forecloses-large-operator-cell` · fact `cust.operator-large` · current **0.4** · pipeline proposed **0.25** · verdict **refute** → **0.4** (band 0.33–0.47)

The proposal assumes big-operator PDU spend is locked at global HQ and unreachable regionally. The evidence points the other way. Greenergy, Estonia's leading colocation provider targeting 10 MW+ AI/HPC loads, sourced Vertiv rack PDUs through a local Estonian partner, A-Kaabel, and separately bought Delta and DC Solutions gear regionally. Even the largest colo, Digital Realty, uses a multi-vendor model preserving flexibility rather than a single locked global PDU vendor. Telefonica Germany likewise deployed Vertiv rPDUs at national level. These are exactly the regional, country-level buying paths a CE team can reach, so the 0.40 large-operator share and its 0.33 to 0.47 band should stand.

- [industry-report] Greenergy and A-Kaabel deploy Vertiv rack PDUs to power scalable data center growth in Estonia — Vertiv — https://www.vertiv.com/48ebb0/globalassets/documents/case-studies/vertiv-greenergy-cs-en-emea-web.pdf
  > Now Estonia's leading colocation provider, Greenergy targets HPC and AI customers with IT loads exceeding 10 MW, prompting upgrades to its power and liquid cooling infrastructure. Since 2020, A-Kaabel has been an authorized sales and service partner for Vertiv in Estonia.
- [industry-report] Digital Realty signs $373m data center power kit deal with Schneider Electric — Nasdaq/PRNewswire — https://www.nasdaq.com/press-release/schneider-electric-and-digital-realty-announce-373m-supply-capacity-agreement-meet
  > The strategic shift to an SCA model provides guaranteed capacity, economies of scale, and a dedicated LVS production line, while preserving the flexibility needed for a dynamic, multi-vendor environment to mitigate risk.
- [industry-report] Telefonica Germany upgrades data center operations with Vertiv PowerIT rPDUs — Vertiv — https://www.vertiv.com/495b0e/globalassets/content---assets-2025/documents/vertiv-telefonica_marketing-thought-leadership-case-study_emea-english.pdf
  > In Germany, Telefónica is responsible for the operation and modernization of all data centers and core network sites nationwide... Vertiv delivered Vertiv PowerIT switched rPDUs (rack power distribution units).

*Raw evidence: `research/raw/refine-structure-independence.global-framework-forecloses-large-operator-cell.json`*

---

## TAM counts PDUs the venture doesn't sell; Germany grows half as fast

`risk.definition-scopedown.intelligent-subset-inflation` · fact `tamBase` · current **320** · pipeline proposed **224** · verdict **refute** → **320** (band 240–520)

The proposal rests on two specific numbers: an intelligent slice of $2.1B of $2.81B globally, and German intelligent growth of 5.2% vs 9%. Neither appears in the fresh results. The IndexBox reports that would carry the intelligent share are all paywalled, showing only price and executive-summary text with no percentage. The Omdia tracker splits basic vs networked PDUs but gives no accessible figure. Nothing found supports the ~75% intelligent share or the ~70% scaling, so the correction is not evidenced and the ledger value stands.

- [industry-report] Intelligent Rack PDUs Market in the European Union — IndexBox — https://www.indexbox.io/store/european-union-intelligent-rack-pdus-market-analysis-forecast-size-trends-and-insights/
  > The European Union market for Intelligent Rack Power Distribution Units (PDUs) stands at a critical inflection point... Buy the report - $4,000
- [industry-report] Rack PDU Market Tracker – 2025 — Omdia — https://omdia.tech.informa.com/om129351/rack-pdu-market-tracker--2025
  > Basic rack PDUs Networked rack PDUs The global market for rack PDUs by product segments
- [industry-report] Europe Data Center Power Distribution Units and Power Supply Units Market — BIS Research — https://www.giiresearch.com/report/bis1769473-europe-data-center-power-distribution-units-power.html
  > The Europe data center PDUs and PSUs market is projected to reach $20,056.7 million by 2035 from $2,455.7 million in 2024

*Raw evidence: `research/raw/refine-definition-scopedown.intelligent-subset-inflation.json`*

---

## OEM/integrator channel is owned by cheaper Asian ODMs

`risk.competitive-foreclosure.oem-cell-odm-price-foreclosure` · fact `cust.oem` · current **0.22** · pipeline proposed **0.05** · verdict **refute** → **0.22** (band 0.22–0.22)

The claim rests on integrator deals being decided purely on unit cost, so branded CE-scale vendors are shut out. The falsifying evidence shows the opposite: European integrator and colocation deals are repeatedly won by branded vendors on features, compatibility, lead time and local support, not lowest price. Vertiv, Schleifenbauer, Legrand and Raritan all win rack-integration deals in Central and Eastern Europe through integrator partners like A-Kaabel, SAGA, Technosector and DPI. Digipower and GETEKnet do exist as white-label ODMs, but nothing quantifies the contestable share, and no source supports marking the channel down to 5%. The proposed cut is not backed by evidence, so the ledger value stands as an unsourced estimate needing validation.

- [industry-report] SAGA and Vertiv Integrate Racks and Monitored PDUs for Serbian Telecom Leader — Vertiv — https://www.vertiv.com/48ee7f/globalassets/documents/case-studies/vertiv-saga-case-study-mka4l0uksaga.pdf
  > a leading Serbian telecom company was searching for a server rack solution with fast delivery and monitored PDUs (power distribution units) compatible with their existing DCIM (Data Center Infrastructure Management) solution
- [industry-report] MIND Park Customer Case — Legrand specified by integrator Technosector — Raritan/Legrand — https://www1.raritan.com/rs/004-BTR-463/images/LDCS%20Magazine%202023-1%20EN%20Mind%20Park.pdf
  > Legrand Data Center Solutions technology has been specified by Technosector, a key partner for the site's owner, MIND Park... We are an integrator company, carrying out the complete fire safety, security and IT infrastructure
- [industry-report] Geteknet OEM Data Center PDU listing — MadeInChina.com — https://www.madeinchina.com/mall/show-Geteknet-OEM-Data-Centernetwork-Factory-Universal-Germany-C13-C19-Us-UK-EU-Industrial-Smart-Intelligent-PDU-Rack-Power-Distribution-Unit-for-Server-Rack-Cabinet_819542.html
  > Price $15.00 ... Min Order 100 Pieces ... Shipping From Zhejiang, China ... Trademark: OEM ODM

*Raw evidence: `research/raw/refine-competitive-foreclosure.oem-cell-odm-price-foreclosure.json`*

---

## Europe's PDU share is likely 24%, not the 30% assumed

`risk.definition-scopedown.europe-share-arithmetic-ghost` · fact `tamBase` · current **320** · pipeline proposed **256** · verdict **refute** → **320** (band 240–520)

The search results confirm only what the ledger already cites: GVR gives the $2.81B global base and North America at 38.0%, with no Europe percentage stated. No fresh source states Europe's share is 24%, and no regional revenue table was found. The US-being-28%-of-a-different-$2.1B-market point does not come from any result here and does not fix Europe's share. The proposed 24% is as unsourced as the ledger's 30%, so the correction lacks evidence to displace the standing value. The IndexBox EU and country reports exist but remain paywalled, so the number cannot be pinned yet.

- [industry-report] Data Center Rack Power Distribution Unit Market Report 2033 — Grand View Research — https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market
  > The global data center rack power distribution unit market size was estimated at USD 2.81 billion in 2025... North America held 38.0% revenue share of the global data center rack power distribution unit market.
- [industry-report] Rack PDUs Market in the World | Report — IndexBox — https://www.indexbox.io/store/world-rack-pdus-market-analysis-forecast-size-trends-and-insights/
  > World Rack PDUs Market 2026 Analysis and Forecast to 2035... Buy the report - $4,000
- [industry-report] Europe Data Center Power Distribution Units and Power Supply Units Market — Research and Markets / BIS Research — https://www.researchandmarkets.com/reports/6108485/europe-data-center-power-distribution-units
  > The Europe data center PDUs and PSUs market is projected to reach $20.05 billion by 2035 from $2.45 billion in 2024, growing at a CAGR of 21.23% during the forecast period 2025-2035.

*Raw evidence: `research/raw/refine-definition-scopedown.europe-share-arithmetic-ghost.json`*

---

## One owner controls two top PDU brands, shrinking reachable market

`risk.competitive-foreclosure.legrand-dual-brand-intelligent-pdu-lock` · fact `serviceableFactor` · current **0.55** · pipeline proposed **0.4** · verdict **refute** → **0.55** (band 0.45–0.65)

The Legrand ownership of Raritan and Server Technology is confirmed, and those brands hold the #1/#2 rack-PDU positions in North America. But the proposed cut to 0.40 rests on a claim that swapping a PDU forces re-integrating the monitoring layer, and the evidence points the other way. Standard protocols like SNMP, Modbus and Redfish let DCIM platforms normalize data across vendors, and a European bank case study shows a phased PDU vendor switch kept monitoring and security under one platform. Vendor concentration is real but the switching-cost lock-in that justified pushing below the 0.45 floor is not supported, so the ledger value stands.

- [analyst-estimate] Legrand (LR) — jimmy·research — jimmy·research — https://jimmyresearch.com/entities/legrand/
  > Legrand's Server Technology (2017) and Raritan (2015) acquisitions consolidated the #1 / #2 rack-PDU positions in North America.
- [industry-report] Data Centre PDU Migration & Rack Security | European Bank Case Study — Advanced Datacentre Systems — https://advanceddatacentre.com/case-studies/european-bank-pdu-migration/
  > When a leading European bank decided to change its intelligent PDU supplier... The solution had to support both legacy and new PDUs simultaneously, while keeping power monitoring, environmental data, and security workflows under one roof.
- [industry-report] Protocol Diversity in Data Centers: DCIM Solutions - Modius, Inc. — Modius, Inc. — https://modius.com/blog/simplifying-data-center-operations-how-modius-opendata-tackles-protocol-diversity/
  > Data Center Infrastructure Management (DCIM) software solves this by normalizing data across protocols and vendors into a unified, real-time operational view, enabling faster incident response and more reliable monitoring.

*Raw evidence: `research/raw/refine-competitive-foreclosure.legrand-dual-brand-intelligent-pdu-lock.json`*

---

## One vendor's colo definition inflates the European market base

`risk.ledger-self-audit.statista-scale-colo-scope-inflation` · fact `tamBase` · current **320** · pipeline proposed **245** · verdict **refute** → **320** (band 240–520)

The claimed ~7.6GW Statista total does not hold up. Summing the Statista 2024 country figures gives roughly 7.7GW, but this is a colocation-plus-scale-colocation IT-power series covering all of Europe including UK, Nordics, and Southern/Eastern countries. CBRE's 5.8GW is expected capacity across only its top-15 tracked markets by end-2024, and its 4,726MW is operational supply in those same 15 markets. The two series measure different scopes and market sets, so the gap does not prove Statista double-counts real capacity. A CBRE-narrow-set versus Statista-all-Europe comparison is not the matched-scope reconciliation the settle test requires, so no scale-down is justified. The proposed 320 to 245 cut rests on an apples-to-oranges ratio.

- [industry-report] Europe: Colocation data center power by country 2031 — Statista — https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/
  > Colocation and scale colocation data center IT power supply in Europe from 2024 to 2031, by country (in megawatts) | 2024 | 1,660 | 1,458 | 915 | 760 | 485 | 352 | 267 | 243 | 240 | 197 ...
- [industry-report] European Data Centres Overview — CBRE — https://www.cbre.com/insights/reports/european-data-centres-overview
  > 5.8GW Data centre capacity expected across Europe by the end of 2024
- [industry-report] Europe Data Centres - Figures Q4 2024 — CBRE — https://assoimmobiliare-be.afterpixel.com/app/uploads/2025/02/Europe-Data-Centres-Figures-Q4-2024.pdf
  > 4,726MW European colocation supply ... Note: Figures are representative of top 15 European markets covered by CBRE.

*Raw evidence: `research/raw/refine-ledger-self-audit.statista-scale-colo-scope-inflation.json`*

---

## The €495M cross-check ceiling measures a rival market, not ours

`risk.definition-scopedown.crosscheck-ceiling-contamination` · fact `tamBase` · current **320** · pipeline proposed **300** · verdict **confirm** → **300** (band 240–360)

The fresh BIS/R&M source confirms the €2.45B Europe figure is the combined PDUs+PSUs category growing 21.23% CAGR, a much broader scope than rack-PDU only. Rack-PDU growth sits far lower, and the IndexBox EU rack-PDU cluster shows intelligent PDUs growing 10-12%, well below 21%. This confirms the €495M cross-check inherits the broader category's inflated scope and should not set the band top; anchoring on the directly-scoped rack-PDU scope-down of €310-320 supports lowering the high end to ~€360.

- [industry-report] Europe Data Center Power Distribution Units and Power Supply Units Market — BIS Research / GII Research — https://www.giiresearch.com/report/bis1769473-europe-data-center-power-distribution-units-power.html
  > The Europe data center PDUs and PSUs market is projected to reach $20,056.7 million by 2035 from $2,455.7 million in 2024, growing at a CAGR of 21.23% during the forecast period 2025-2035.
- [industry-report] European Union Power and Cable Management Market — IndexBox — https://www.indexbox.io/store/european-union-power-and-cable-management-market-analysis-forecast-size-trends-and-insights/
  > Managed and intelligent power distribution units (PDUs) represent the fastest-growing segment, expanding at 10–12% annually, as data center operators prioritize remote monitoring.
- [industry-report] European Union Intelligent Rack PDUs Market 2026 Analysis and Forecast to 2035 — IndexBox — https://www.indexbox.io/store/european-union-intelligent-rack-pdus-market-analysis-forecast-size-trends-and-insights/
  > The European Union market for Intelligent Rack Power Distribution Units (PDUs) stands at a critical inflection point, driven by the continent's accelerating digital transformation and stringent sustainability mandates.

*Raw evidence: `research/raw/refine-definition-scopedown.crosscheck-ceiling-contamination.json`*

---

## German metering law blocks the PDU's billing feature in its biggest market

`risk.regulatory-gauntlet.eichrecht-metering-foreclosure` · fact `serviceableFactor` · current **0.55** · pipeline proposed **0.45** · verdict **refute** → **0.55** (band 0.45–0.65)

The German metering law claim is real for measured-kWh billing, but the evidence does not show that per-outlet PDU billing is the entrant's serviceable use case in Germany, nor that Germany is 'half the funnel.' German colo billing runs on contracted capacity or excess-usage fees at the rack, with PDU metering used for monitoring. That means MID certification gates one billing use case, not the whole German half, so the model's 0.55 stands within its existing band. The proposed cut to 0.45 rests on an unproven assumption that metered billing is the reachable market.

- [industry-report] Anzeigepflicht für Messgeräte nach MessEG und MessEV — Gossen Metrawatt — https://www.gossenmetrawatt.de/wissen/energiemanagement-mit-system/anzeigepflicht-fuer-messgeraete-nach-messeg-und-messev/
  > Wenn also z. B. mit einem geeichten MID-Zähler Strom nach abgegebener kWh verkauft wird – beispielsweise an einen Untermieter in einer Anlage - handelt es sich um ein oder mehrere Messgeräte im Sinne von § 32 MessEG.
- [industry-report] Full Rack Colocation in Digital Realty FRA18 Frankfurt — Voxility — https://www.voxility.com/colocation/prices/Full+Rack+Colocation+in+Digital+Realty+FRA18+Frankfurt
  > Each additional 0,1 kW power draw above 3 kW included is charged with an excessive usage fee of $15544/0,1 kW
- [industry-report] Colocation Data Centre Monitoring – Vaiking — Vaiking — https://vaiking.de/en/branchen/colocation
  > Energy billing based on estimates ... manual allocation at rack level, estimates where measurement points are missing.

*Raw evidence: `research/raw/refine-regulatory-gauntlet.eichrecht-metering-foreclosure.json`*

---

## Large operators are buying whole racks, not the PDUs we sell

`risk.boundary-substitution.large-operator-channel-forecloses-to-odm` · fact `cust.operator-large` · current **0.4** · pipeline proposed **0.28** · verdict **adjust** → **0.32** (band 0.24–0.4)

The confirming evidence shows a real shift toward integrated AI racks: Schneider and Foxconn are co-developing bundled power, cooling and rack systems for hyperscale operators, and Iren bought $1.6bn of Dell rack systems directly. This supports the claim that some large-operator AI-density power spend moves into integrator bundles the venture cannot sell through, so 0.40 is too high. But the falsifying tender evidence cuts the other way: the Jülich JARVIS tender explicitly lists PDUs as a discrete operator-selected line item open to bidders, showing direct PDU tendering still happens even for AI-density halls. Neither side offers a hard percentage, so a partial markdown to about 0.32 is warranted rather than the deeper 0.28.

- [industry-report] Schneider Electric and Foxconn to Partner on AI Data Centres — Data Centre Magazine — https://datacentremagazine.com/news/schneider-electric-and-foxconn-to-partner-on-ai-data-centres
  > The companies plan to produce integrated hardware to help operators build AI facilities across multiple geographic regions with greater predictability.
- [industry-report] Iren taps Dell Technologies for Nvidia Blackwell servers under $1.6bn contract — DatacenterDynamics — https://www.datacenterdynamics.com/en/news/iren-taps-dell-technologies-for-nvidia-blackwell-servers-under-16bn-contract/
  > AI cloud firm Iren has signed a $1.6bn contract with Dell to acquire air-cooled Blackwell systems.
- [industry-report] Jülich JARVIS AI inference tender — Forschungszentrum Jülich / GlobalTenders — https://www.globaltenders.com/tender-detail/jarvis-eine-zentrale-plattform-f%C3%BCr-ki-infer-b3IRfCnbzDpiNXn3
  > Rack infrastructure, including power distribution units (PDU) and cooling distribution units (CDU) optimized for the offered IT equipment.

*Raw evidence: `research/raw/refine-boundary-substitution.large-operator-channel-forecloses-to-odm.json`*

---

## Netherlands weight overcounts megawatts that buy the fewest PDUs

`risk.boundary-substitution.nl-selfbuild-hotspot-hollows-geo` · fact `geo.NL` · current **0.28** · pipeline proposed **0.24** · verdict **refute** → **0.28** (band 0.24–0.31)

The ledger weight of 0.28 comes from a clean colo-megawatt share, 951 MW out of 3,451 MW, and the derivation already isolates colocation and excludes hyperscaler self-build capacity. The proposal argues self-build busway halls buy fewer PDUs, but the CBRE self-build figure describes owned hyperscale capacity, not the colo denominator the weight is built on, so it does not bear on the colo-based ratio. None of the fresh results supply a Netherlands rack-PDU-euro-per-MW figure that differs from the CE-7 average; the vendor and BOM sources return only paywalled report descriptions with no country intensity number. Without a purchasable intensity comparison showing NL below average, there is no basis to move the weight down.

- [industry-report] Netherlands Data Center Rack PDU Market | Share & Size 2032 — 6Wresearch — https://www.6wresearch.com/industry-report/netherlands-data-center-rack-pdu-market
  > By End User (Small-scale Data Centers, Large-scale Data Centers, Hyperscale Data Centers, Colocation Providers)
- [industry-report] Netherlands Hyperscale Data Center Market Report 2031 — Mordor Intelligence — https://www.mordorintelligence.com/industry-reports/netherlands-hyperscale-data-center-market
  > The Netherlands Hyperscale Data Center Market Report is Segmented by Data Center Type (Hyperscale Self-Build, Hyperscale Colocation)
- [industry-report] Europe Data Center Power Distribution Units and Power Supply Units Market — BIS Research — https://bisresearch.com/industry-report/europe-data-center-power-distribution-units-and-power-supply-units-market.html
  > Focus on Application, Product, and Country - Analysis and Forecast, 2025-2035

*Raw evidence: `research/raw/refine-boundary-substitution.nl-selfbuild-hotspot-hollows-geo.json`*

---

## Enterprise growth ships as GPU racks that skip PDUs

`risk.boundary-substitution.enterprise-gpu-pods-skip-pdus` · fact `seg.enterprise` · current **0.29** · pipeline proposed **0.29** · verdict **confirm** → **0.29** (band 0.24–0.29)

The claim's core premise is that GPU growth arrives without PDUs. NVIDIA's own B300 reference architecture shows the opposite: the AC-powered variant ships 72 DGX B300 in standard racks each with three 2U rack PDUs, and even the DC busbar variant lists 160 rPDUs in its bill of materials. The DC busbar option only becomes default for the densest deployments; NVIDIA explicitly keeps the traditional PDU AC option for legacy centers. PDU market reports independently attribute growth to AI and GPU workloads, so GPU capacity is PDU-consuming, not PDU-skipping. The full 0.29 stays defensible as PDU-addressable, with a modest downside band for the share of dense deployments that move to busbar power shelves.

- [industry-report] DGX SuperPOD with DGX B300 Systems, AC Power Reference Architecture — NVIDIA — https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300-xdr/latest/dgx-superpod-architecture.html
  > With DGX SuperPOD with DGX B300 systems, we utilize standard racks and with traditional power supplies and PDUs... Figure 2 shows 72 x NVIDIA DGX B300 PS systems in standard racks each with three (3) 2U rack PDUs for maximum redundancy.
- [industry-report] DGX SuperPOD DGX B300 DC Busbar Reference Architecture — Major Components — NVIDIA — https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300/latest/components.html
  > For legacy datacenter without the possibility for DC busbar, it is still possible to build SuperPOD with traditional PDU and AC powered EIA racks... 160 rPDU for MGX rack PX4-57A7I2U-C8E7V2
- [industry-report] Data Center Rack Power Distribution Unit Market Report 2033 — Grand View Research — https://www.grandviewresearch.com/industry-analysis/data-center-rack-power-distribution-unit-pdu-market
  > The growth of high-performance computing (HPC), artificial intelligence (AI), and GPU-intensive workloads is driving demand for data center rack power distribution unit market.

*Raw evidence: `research/raw/refine-boundary-substitution.enterprise-gpu-pods-skip-pdus.json`*

---

## CE hyperscale share set at 0.44 is too high; real weight is colocation

`risk.structure-independence.ce-hyperscale-global-split-mirage` · fact `seg.hyperscale` · current **0.44** · pipeline proposed **0.28** · verdict **adjust** → **0.35** (band 0.25–0.44)

The CBRE data confirms the direction of the claim: about 60% of Europe's operational hyperscaler self-build capacity sits in Ireland, the Netherlands, Sweden and Belgium, none of which are Central Europe, and Frankfurt is described by Structure Research as a market with high barriers to self-build where hyperscalers rely on colocation. So a 0.44 hyperscale-owned share for CE is too high. But the evidence measures self-build only and does not give a clean CE-7 owned-vs-colo split; hyperscale demand still drives Frankfurt colocation heavily. The proposal's 0.28 point value is not directly supported by any cited figure, so a milder cut with a wider band better fits the evidence.

- [industry-report] New hyperscaler self-build capacity growth to outpace colocation supply growth in Europe — CBRE via Institutional Real Estate, Inc. — https://irei.com/news/new-hyperscaler-self-build-capacity-growth-to-outpace-colocation-supply-growth-in-europe/
  > As of fourth quarter 2025, approximately 60 percent of Europe's operational hyperscaler self-build capacity is located in Ireland, the Netherlands, Sweden and Belgium.
- [industry-report] Frankfurt DCAI Report 2025 — Structure Research — https://www.structureresearch.net/product/frankfurt-dci-report-2025-data-centre-colocation-hyperscale-cloud-ai-interconnection/
  > Frankfurt continues to be a strong growth story driven by hyperscale cloud, strict data residency regulations, high barriers to entry for self-builds, and the ability to serve a
- [industry-report] Hyperscale Operators to Account for 67% of all Data Center Capacity by 2031 — Synergy Research Group — https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031
  > they now account for 48% of the worldwide capacity of all data centers. Almost 60% of that hyperscale capacity is now in own-built, owned data centers with the balance being in leased facilities.

*Raw evidence: `research/raw/refine-structure-independence.ce-hyperscale-global-split-mirage.json`*

---

## Colo-based geo weights inflate NL, hide Swiss and German demand

`risk.structure-independence.colo-denominator-mispricing-enterprise-geography` · fact `geo.CH` · current **0.08** · pipeline proposed **0.11** · verdict **confirm** → **0.11** (band 0.08–0.13)

The Statista colo table gives CH 274 MW out of a CE-7 total that yields ~0.08. But Switzerland is heavily self-operated: Mordor puts installed base at 850.6 MW and CBRE at 340 MW commercial only, well above the 274 MW colo figure. A total-installed-load split raises CH toward ~0.11-0.13, while Germany's on-premise-heavy base (BMWK: over 2,700 MW installed vs 1,737 MW colo) and the Amsterdam-inflated NL weight also shift. This confirms the colo-only denominator understates Swiss weight; I trim the high to 0.13 to match the crosscheck rather than 0.14, which the evidence does not reach.

- [industry-report] Status and development of the German data centre landscape – Executive Summary — BMWK — https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Publikationen/Digitale-Welt/status-and-development-of-the-german-data-centre-landscape-executive-summary.pdf
  > With over 2,000 data centres and an installed IT power demand of over 2,700 MW, Germany is already the largest centre for digital infrastructure in Europe.
- [industry-report] Europe: Colocation data center power by country 2031 — Statista — https://www.statista.com/statistics/1659712/europe-colocation-data-center-power-by-country/
  > 2025 | Germany 1,737 | Netherlands 951 | Switzerland 274
- [analyst-estimate] Data Centres Overview | CBRE Switzerland — CBRE Switzerland — https://www.cbre.ch/insights/reports/data-centers-overview-fr-2025
  > Commercial capacity (excluding self-operated infrastructure) is 340 MW; the Swiss market is self-operation-heavy relative to its colocation footprint.

*Raw evidence: `research/raw/refine-structure-independence.colo-denominator-mispricing-enterprise-geography.json`*

---
