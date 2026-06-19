# CLAUDE.md — Market Module (M15)

> Working name: **Market Module** (rename freely — e.g. "Atlas"). Sibling to VentureX inside the M15 program.
> This file is the **resolved design** for the v1 demo build. Treat the architecture below as settled ground:
> build against it, don't relitigate it. Open extensions go in `Market_Module_Open_Questions.md`, not here.

---

## 1. What this is

An AI-powered **Market Size & Shape** dashboard. It takes an anonymized venture profile (the same profile VentureX already generates) and produces a **live, lever-driven** TAM / SAM / YAM model plus a market-shape readout.

Three things the demo must show (all hardcoded for v1):

1. **The facts** — a ledger of market facts with sourcing. These facts are the levers.
2. **The visual** — a simple map (regions shaded by market intensity) + the TAM/SAM/YAM funnel.
3. **The simulation** — pull a lever, see (a) the new numbers and (b) the **delta** vs a pinned baseline.

### North star: this is a risk instrument, not a calculator
Every design choice serves the chain **identify → quantify → (later) mitigate** risk. The **delta between scenarios is the product** — a market size on its own is just a number; a decomposable delta is something you can reason about. Risk Seek is a later phase, but the module is built to hand off to it cleanly (see §4.3 and §9).

### Definitions
- **TAM** — Total Addressable Market for the scoped market.
- **SAM** — Serviceable Addressable Market (TAM after serviceability haircut: reachable channel, regulatory-clear).
- **YAM** — **Year-1 Addressable Market**: how much of SAM is realistically obtainable in the first 12 months of operation. Frame it externally as a *time-boxed SOM* — a refinement of the standard TAM/SAM/SOM funnel, not a reinvention.

---

## 2. The one architectural commitment

**A market size is a computation, never a number.** The model is a typed DAG: leaves are sourced facts, internal nodes are operations, and TAM/SAM/YAM are *derived*. This is what gives us deltas, traceability, modularity, and (later) pairing — for free. It is the INNOVERA claims graph applied to one workstream.

**Hardcode the ledger, compute live.** v1 ships a hardcoded ledger (a typed TS object) and computes everything client-side. **Never hardcode the rendered TAM/SAM/YAM numbers** — if you do, the levers are theater and break under the first "what if" question. Static *data*, live *math*.

**No LLM and no network in the lever loop.** The three levers (§3.3) are deterministic recompute over the in-memory ledger. Research/LLM calls are out of the demo path entirely (see §6).

---

## 3. Data model

### 3.1 Node — the unit of the fact ledger

```ts
type NodeKind   = 'extracted' | 'estimated' | 'calculated' | 'assumption';
type Confidence = 'verified'  | 'inferred'  | 'unknown';            // carried over from VentureX
type Dimension  = 'geography' | 'segment'   | 'customerType';

interface Source { title: string; url?: string; note?: string; }

interface FactNode {
  id: string;
  label: string;
  kind: NodeKind;
  value: number;
  unit: string;                 // 'EUR_M', 'ratio', 'pct', 'units_per_yr', ...
  confidence: Confidence;
  asOf: string;                 // ISO date

  // leaf nodes (extracted | estimated | assumption):
  source?: Source;              // required for 'extracted'; optional note for 'estimated'/'assumption'

  // calculated nodes only:
  op?: 'product' | 'sum' | 'subtract' | 'share';
  inputs?: string[];            // node ids

  // share/scope nodes — which lever dimension + value this belongs to:
  dimension?: Dimension;
  dimensionValue?: string;      // 'DE', 'edge', 'operator-large', ...

  // risk metadata (makes the module Risk-Seek-ready):
  sensitivityRange?: { low: number; high: number };  // plausible band, drives the tornado
}
```

Map of `kind` → DAG role:
- `extracted` / `estimated` → **leaves** (a value + a source or an inference flag + an as-of date).
- `assumption` → **leaves** that the user can overwrite via an assumption lever (e.g. serviceable %, win-rate).
- `calculated` → **internal nodes** (an `op` over `inputs`). TAM/SAM/YAM are calculated nodes.

Validate the whole ledger with **Zod** on load (`lib/schema.ts`). A malformed ledger should fail loudly at boot, not silently mis-render.

### 3.2 The funnel — how the number is built

Top-down, multiplicative. Two kinds of multiplier:

**Scope factors** (driven by the three levers — define *what market we're counting*):

```
TAM(selection) = tamBase
  × Σ geoShare[g]   for g in selected geographies
  × Σ segShare[s]   for s in selected segments
  × Σ custShare[c]  for c in selected customer types
```

**Funnel factors** (assumption leaves — turn scoped TAM into SAM and YAM):

```
SAM = TAM × serviceableFactor
YAM = SAM × obtainableFactor
```

When all values of a dimension are selected, its factor = 1 (shares within a dimension sum to ~1.0), so the baseline returns `tamBase`. Excluding Germany multiplies by `(1 − geoShare['DE'])`; selecting only the edge segment multiplies by `segShare['edge']`; and so on.

> **Independence assumption (MVP):** scope factors are treated as independent — e.g. edge's share is assumed identical in every geography. This is an approximation, and **where it's false it is itself a risk** (e.g. "edge is overweight in the Nordics"). v1 ships the independence model; cross-dimension interaction overrides are a flagged v2 item. Do not silently hide this — surface it as a caveat in the UI.

### 3.3 Levers

Three lever **dimensions**, each a set of selectable values:

| Lever | Axis | Meaning | Example values (PDU case) |
|---|---|---|---|
| **Geography** | where | region/country, with include/exclude | DE, FR, NL, PL, CZ, AT, CH, other |
| **Segment** | application / use-case | what the product is *for* | hyperscale, colocation, enterprise, edge, telecom |
| **Customer Type** | buyer firmographic / role | *who buys*, at what scale | operator-large, operator-mid, OEM/integrator, distributor |

**Orthogonality is mandatory.** Segment = application; Customer Type = buyer profile. They **intersect**, they do not nest. "Edge × operator-large" is a valid intersection; never let a Segment value silently imply a Customer Type or you double-restrict.

**Lever types** (behave differently — keep them distinct in the UI and the math):
- **Filter levers** — Geography, Segment, Customer Type. Turn share nodes on/off. Deterministic, instant.
- **Assumption levers** — sliders that overwrite an assumption leaf (`serviceableFactor`, `obtainableFactor`). Instant.
- **Boundary levers** — *out of scope for v1.* These change *what's in the ledger* (e.g. "include substitutes: busbars, power shelves, DC busways" for the PDU case) and require new research. v1 shows these as a read-only **"what's excluded and why"** panel — the seam where Risk Seek plugs in later.

### 3.4 Scenario & baseline

```ts
interface Scenario {
  id: string;
  label: string;
  geographies: string[];     // selected dimensionValues
  segments: string[];
  customerTypes: string[];
  assumptions: Record<string, number>;  // overrides for assumption leaves, by node id
}
```

Pin **one scenario as the baseline** (the current state of the twin). Render every other scenario as a **delta from the baseline** — cleaner than free-floating A-vs-B, and it's how the digital twin should behave.

---

## 4. Core computations — `lib/compute.ts`

Pure, deterministic, no network, fully unit-tested. The UI is a thin shell over these.

### 4.1 `evaluate(ledger, scenario) → { tam, sam, yam, factors }`
Applies §3.2. `factors` returns each multiplier used (for display and attribution).

### 4.2 `delta(ledger, baseline, scenario, metric) → { total, byFactor }`
Sequential attribution in **funnel order** — exact (telescopes to the total), order-dependent:

```ts
const ORDER = ['geography', 'segment', 'customerType', 'serviceable', 'obtainable'] as const;

function delta(ledger, baseline, scenario, metric) {
  const state = structuredClone(baseline);
  let prev = m(evaluate(ledger, state), metric);
  const byFactor: Record<string, number> = {};
  for (const f of ORDER) {
    applyFactor(state, scenario, f);                 // swap just this factor baseline → scenario
    const cur = m(evaluate(ledger, state), metric);
    byFactor[f] = cur - prev;                         // marginal contribution of f
    prev = cur;
  }
  // sum(byFactor) === m(scenario) − m(baseline)  exactly
  return { total: prev - m(evaluate(ledger, baseline), metric), byFactor };
}
```

> Shapley attribution (average over all orderings, order-fair) is the v2 upgrade. Sequential is correct and sufficient for the demo.

### 4.3 `sensitivity(ledger, scenario, metric) → SwingBar[]` — the tornado
For each leaf with a `sensitivityRange`, hold everything else at the scenario's values, set the leaf to `low` then `high`, recompute the metric, record the swing. Rank by `max(|lowSwing|, |highSwing|)`. **Color bars by `confidence`** — a high-swing, low-confidence node is the top risk and the top Value-of-Information target. This *is* the VOI view; it's Pedram's framework made concrete.

> **v1 tornado leaves:** `tamBase`, `serviceableFactor`, `obtainableFactor`, plus the **selected** segment share and the **selected** customer share. Perturbing a single share in v1 does **not** re-normalize the others (documented simplification — keeps the math simple and the bars legible). Re-normalized share sensitivity is a v2 item.

---

## 5. UI surfaces (v1)

One dashboard page. Lean, scannable, flat.

1. **Facts ledger** — table of nodes: label · kind badge · value+unit · confidence (tri-state badge) · source link · dimension tag. Reuse the VentureX pattern: scannable row → click to expand source/detail. Assumption leaves render as inline sliders.
2. **Map** — *keep it dead simple.* A flat inline-SVG of the relevant region, country `<path>`s filled by per-geography market value (intensity), **click a country to toggle include/exclude** (drives the Geography lever). No 3D, no rotation, no map library. Hand-rolled SVG is enough for the demo; `react-simple-maps` is an optional later swap if real geography is wanted.
3. **Scenario controls** — the three filter levers (multi-select; Geography also driven by the map), the assumption sliders, and a **"Pin as baseline"** button.
4. **Funnel outputs** — TAM / SAM / YAM as the funnel, baseline vs current shown side by side.
5. **Delta panel** — headline ΔTAM / ΔYAM + a decomposition bar chart from `delta().byFactor` ("−€336M Germany, −€786M segment, −€47M customer").
6. **Tornado** — `sensitivity()` bars, **behind a feature flag / collapsible** so it can be hidden in one line if it isn't solid by demo day.
7. **Shape strip** — CAGR, concentration (top-N share, sourced from the VentureX competitor table — *consume it, don't re-derive it*), segmentation mini-bar.

Charts (funnel, delta, tornado) can be plain SVG/flexbox — avoid heavy chart libs. Recharts is acceptable if preferred, but minimal deps win.

---

## 6. Scope

**In v1:**
- Hardcoded, Zod-validated ledger (one case: anonymized industrial entrant into the rack-PDU market).
- The three filter levers + two assumption sliders, deterministic recompute.
- TAM/SAM/YAM funnel, simple map, delta + decomposition, tornado (flagged), shape strip.
- Pin-baseline + delta-from-baseline.

**Explicitly out (v2+) — do not build these for the demo:**
- Any LLM / research call in the lever loop; boundary levers that trigger re-research.
- Persistence (Supabase), auth, multi-user.
- Pairing to the Customer & Demand workstream (architecture must *allow* it — shared, addressable node ids — but the wiring is later).
- 3D globe; regulatory-surface and value-chain market-research dimensions.
- Cross-dimension interaction overrides; Shapley attribution; re-normalized share sensitivity.

---

## 7. Tech & repo

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Zod, Tailwind. No backend in the demo path — data is a local TS module, compute is client-side pure functions.

```
/app/page.tsx                 dashboard
/components
  FactsLedger.tsx
  RegionMap.tsx               hand-rolled SVG, click-to-toggle geography
  ScenarioControls.tsx
  FunnelOutputs.tsx
  DeltaPanel.tsx
  Tornado.tsx                 feature-flagged
  ShapeStrip.tsx
/lib
  schema.ts                   Zod schemas for FactNode / Scenario / Ledger
  ledger.ts                   the hardcoded case (see §10 — replace illustrative values)
  dimensions.ts               geography/segment/customerType value lists + display labels
  compute.ts                  evaluate / delta / sensitivity (pure)
/lib/__tests__/compute.test.ts
```

---

## 8. Build milestones (engine-first)

The compute engine is the load-bearing, demo-risky part — get it right before any pixels.

1. **Schema + compute core + tests.** No UI. Prove `evaluate` / `delta` / `sensitivity` against the §10 worked example. The numbers in §10 are your test oracle.
2. **Funnel outputs + scenario controls.** Levers wired to compute; numbers update live.
3. **Delta panel.** Decomposition from `delta().byFactor`.
4. **Map.** Geography lever as a clickable region map.
5. **Tornado.** Flagged; cut/hide if not solid.
6. **Shape strip + polish.**

---

## 9. Principles

- **Facts are verifiable values with sources, not analysis** (carried over from VentureX). Citations/sources are mandatory on `extracted` nodes.
- **The headline number is always derived.** Never hardcode TAM/SAM/YAM.
- **No LLM / network in the lever loop.** The three levers are deterministic recompute.
- **Hardcode the ledger, compute live.**
- **Every node carries `confidence`; key leaves carry a `sensitivityRange`.** This is what makes the module risk-ready and Risk-Seek-ready without building Risk Seek now.
- **Independence of dimensions is an MVP approximation — surfaced, not hidden.**
- **Keep nodes modular and node-addressable** so pairing to other workstreams is possible later without rework. Shared inputs across modules = shared node ids.
- **This doc is the resolved design.** Don't relitigate the architecture in code review; route new ideas to the open-questions doc.

---

## 10. Illustrative seed ledger — REPLACE with sourced values

> All numbers below are **illustrative placeholders** to make the engine buildable and testable. Step 1 of the build (and the next research pass) is to replace them with real, sourced values from the VentureX profile + a market-sizing research run. The *structure* is canonical; the *values* are not.

```ts
// lib/ledger.ts  — illustrative; values flagged [ILLUSTRATIVE]
export const ledger: FactNode[] = [
  { id: 'tamBase', label: 'Central Europe rack-PDU market, all segments/buyers',
    kind: 'extracted', value: 1200, unit: 'EUR_M', confidence: 'inferred', asOf: '2026-06-19',
    source: { title: '[source TBD]' }, sensitivityRange: { low: 900, high: 1500 } },

  // geography shares (sum = 1.00)
  { id: 'geo.DE', label: 'Germany',      kind: 'estimated', value: 0.28, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'DE' },
  { id: 'geo.FR', label: 'France',       kind: 'estimated', value: 0.16, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'FR' },
  { id: 'geo.NL', label: 'Netherlands',  kind: 'estimated', value: 0.13, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'NL' },
  { id: 'geo.PL', label: 'Poland',       kind: 'estimated', value: 0.12, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'PL' },
  { id: 'geo.CH', label: 'Switzerland',  kind: 'estimated', value: 0.07, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'CH' },
  { id: 'geo.CZ', label: 'Czechia',      kind: 'estimated', value: 0.06, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'CZ' },
  { id: 'geo.AT', label: 'Austria',      kind: 'estimated', value: 0.05, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'AT' },
  { id: 'geo.other', label: 'Other CE',  kind: 'estimated', value: 0.13, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'geography', dimensionValue: 'other' },

  // segment (application) shares (sum = 1.00)
  { id: 'seg.hyperscale', label: 'Hyperscale',  kind: 'estimated', value: 0.34, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'segment', dimensionValue: 'hyperscale', sensitivityRange: { low: 0.29, high: 0.39 } },
  { id: 'seg.colocation', label: 'Colocation',  kind: 'estimated', value: 0.27, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'segment', dimensionValue: 'colocation' },
  { id: 'seg.enterprise', label: 'Enterprise',  kind: 'estimated', value: 0.24, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'segment', dimensionValue: 'enterprise' },
  { id: 'seg.edge',       label: 'Edge',        kind: 'estimated', value: 0.09, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'segment', dimensionValue: 'edge', sensitivityRange: { low: 0.06, high: 0.13 } },
  { id: 'seg.telecom',    label: 'Telecom',     kind: 'estimated', value: 0.06, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'segment', dimensionValue: 'telecom' },

  // customer-type (buyer profile) shares (sum = 1.00)
  { id: 'cust.operator-large', label: 'Large operators',   kind: 'estimated', value: 0.40, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'customerType', dimensionValue: 'operator-large', sensitivityRange: { low: 0.33, high: 0.47 } },
  { id: 'cust.operator-mid',   label: 'Mid / enterprise',  kind: 'estimated', value: 0.25, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'customerType', dimensionValue: 'operator-mid' },
  { id: 'cust.oem',            label: 'OEM / integrator',  kind: 'estimated', value: 0.22, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'customerType', dimensionValue: 'oem-integrator' },
  { id: 'cust.distributor',    label: 'Distributor',       kind: 'estimated', value: 0.13, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', dimension: 'customerType', dimensionValue: 'distributor' },

  // funnel factors (assumption leaves — assumption levers)
  { id: 'serviceableFactor', label: 'Serviceable share of TAM', kind: 'assumption', value: 0.55, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', source: { note: 'channel + regulatory reach' }, sensitivityRange: { low: 0.45, high: 0.65 } },
  { id: 'obtainableFactor',  label: 'Year-1 obtainable share of SAM', kind: 'assumption', value: 0.06, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', source: { note: 'year-1 win-rate × ramp × capacity' }, sensitivityRange: { low: 0.03, high: 0.10 } },

  // shape (display + risk)
  { id: 'shape.cagr',  label: 'Market CAGR (2025–2030)', kind: 'extracted', value: 0.11, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', source: { title: '[source TBD]' } },
  { id: 'shape.cr3',   label: 'Top-3 supplier concentration', kind: 'extracted', value: 0.62, unit: 'ratio', confidence: 'inferred', asOf: '2026-06-19', source: { title: 'VentureX competitor table' } },
];
```

### Worked example — use as the §8.1 unit-test oracle

**Baseline** (all geographies, all segments, all customer types):
- TAM = 1200 × 1.0 × 1.0 × 1.0 = **€1,200M**
- SAM = 1200 × 0.55 = **€660M**
- YAM = 660 × 0.06 = **€39.6M**

**Scenario** ("Central Europe ex-Germany × edge × large operators"):
- geoFactor = 1 − 0.28 = 0.72 · segFactor = 0.09 · custFactor = 0.40
- TAM = 1200 × 0.72 × 0.09 × 0.40 = **€31.10M**
- SAM = **€17.11M** · YAM = **€1.03M**

**ΔTAM decomposition** (sequential, funnel order — must sum to total):
- start 1200 → swap geography (ex-DE): 864 ⇒ Δgeo = **−336.0**
- → swap segment (edge): 77.76 ⇒ Δsegment = **−786.24**
- → swap customer (large operators): 31.10 ⇒ Δcustomer = **−46.66**
- Σ = −1168.9 = (31.10 − 1200.0) ✓
