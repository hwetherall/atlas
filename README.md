# Atlas — Market Size & Shape (M15 Market Module)

An AI-powered **Market Size & Shape** dashboard. It takes an anonymized venture
profile and produces a **live, lever-driven TAM / SAM / YAM** model plus a
market-shape readout. This is a **risk instrument, not a calculator** — the
decomposable **delta between a pinned baseline and a scenario** is the product.

> v1 demo build. Design is resolved in [`CLAUDE.md`](./CLAUDE.md); open
> extensions go to `Market_Module_Open_Questions.md`.

## The one architectural commitment

**A market size is a computation, never a number.** The model is a typed DAG:
leaves are sourced facts, internal nodes are operations, and TAM/SAM/YAM are
*derived*. The ledger is hardcoded; the math is computed live, client-side. No
LLM and no network in the lever loop.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Zod · Tailwind v4 · Vitest.
No backend in the demo path: data is a local TS module, compute is pure client
functions.

## Layout

```
app/page.tsx          dashboard shell + single-source-of-truth scenario/baseline state
components/            FactsLedger, RegionMap, ScenarioControls, FunnelOutputs,
                       DeltaPanel, Tornado, ShapeStrip, BoundaryPanel, AssumptionSlider
lib/
  schema.ts           Zod schemas + types (FactNode/Scenario/Ledger); validateLedger fails loudly at boot
  ledger.ts           the curated ledger (real, sourced values — see research/)
  dimensions.ts       geography/segment/customerType value lists + labels
  compute.ts          evaluate / delta / sensitivity (pure, deterministic)
  useScenario.ts      reducer: toggle filters, set assumptions, pin baseline
  format.ts           formatEUR / formatPct
  flags.ts            FLAGS.tornado
  boundary.ts         read-only "what's excluded and why"
  __tests__/          the §10 worked-example oracle (30 tests)
```

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # the §10 oracle — engine correctness gate
npm run build      # production build + TypeScript check
```

## The §10 oracle (engine correctness gate)

- Baseline (all geos/segs/custs): **TAM €1,200M · SAM €660M · YAM €39.6M**.
- Scenario "CE ex-Germany × edge × large operators": **TAM €31.10M · SAM €17.11M · YAM €1.03M**.
- ΔTAM decomposes (funnel order) to Geography −€336M, Segment −€786M, Customer
  −€47M and telescopes exactly to **−€1,168.9M**.

These numbers are pinned against the **frozen pre-research ledger** in
`lib/__tests__/fixtures/oracleLedger.ts` (engine tests import it, not the live
ledger), so the live ledger can be re-curated without breaking the gate. The
live ledger has its own sanity suite in `lib/__tests__/realLedger.test.ts`.

## Research pass (real values)

`lib/ledger.ts` now carries **real, sourced values** curated from a cached Exa
research pass (`npm run research`, 2026-07-06). Raw search results are checked
in under `research/raw/` as the audit trail; each fact's derivation documents
its scope-down chain, and maturity/confidence say honestly which values are
extracted, triangulated, or still need a source.

## Notes
- Scope factors are treated as **independent** across dimensions (MVP
  approximation, surfaced in the UI as a caveat).
- The tornado is behind `FLAGS.tornado` and can be hidden in one line.
