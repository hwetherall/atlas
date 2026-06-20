# dashboard-design.md — Dashboard v2: narrative spine + linked focus (Atlas, M15)

> The panels are fine; the *arrangement* isn't. Today it's an equal-weight grid with no reading order and no
> connection between the ledger and the visuals. This pass gives the dashboard a **narrative spine** (it reads
> as an argument, top to bottom), a persistent **control rail**, and a **single shared focus** that links every
> surface so the ledger and the visuals become one system.
>
> Same rules as `ledger.md` / `improve-ledger.md`: **presentation + read-only derivation only.** Compute engine
> and the §10 oracle are untouched. No LLM, no network.

---

## 0. Decisions locked

- **Graph-first.** The computation act defaults to the fact **Graph**, with a one-tap switch to the **Ledger**
  (the v2 cards). Two views of one DAG — not two top-level tabs.
- **Full linked focus.** Bidirectional brushing across all surfaces: hover previews, click pins + opens the
  inspector, and a focused leaf glows its downstream path to TAM (via `lineageOf`).
- **One narrative scroll, control rail pinned left.** No top-level "Ledger | Dashboard" tabs — that would sever
  the exact connection we want. The ledger lives *inside* the computation act.
- **Funnel hero is redrawn** (real proportions + ghosted baseline) and **tornado labels stop truncating** —
  these two carry most of the "looks broken" feeling.

---

## 1. Hard guardrails

- **Do not touch `lib/compute.ts` or `lib/__tests__/compute.test.ts`.** §10 oracle stays green
  (TAM €1,200M · SAM €660M · YAM €39.6M; ex-DE×edge×large-ops ΔTAM −€1,168.9M).
- **Focus is presentation-only state.** It never enters `Scenario`, the reducer, or the lever math. Highlighting
  Germany does not change the market; only the geography *lever* does.
- **Reuse everything:** `evaluate` / `delta` / `sensitivity` (`compute.ts`), `deriveGraph` (`graph.ts`),
  `marginalContribution` (`contribution.ts`), `informationValue` (`voi.ts`), `lineageOf` (`lineage.ts`), the
  shared badges (`badges.tsx`), `formatEUR` / `formatPct`, `glass-panel`, framer-motion patterns. **Add no new
  compute.**
- For any new component, follow the existing visual system; consult the `frontend-design` skill for tokens.
- New architecture ideas → `Market_Module_Open_Questions.md`.

---

## 2. The narrative spine (layout)

Reading order **is** the argument — and the arc of inquiry (`identify → quantify → mitigate`):

```
┌──────────────┬──────────────────────────────────────────────┐
│              │  ① THE ANSWER — Funnel hero + Δ (inline)      │
│  CONTROL     ├──────────────────────────────────────────────┤
│  RAIL        │  ② THE COMPUTATION — [Graph | Ledger]         │
│  (levers)    │     Graph default; both consume focus         │
│              ├───────────────────────┬──────────────────────┤
│  Geography   │  Market shape         │  ③ RISK · VOI         │
│  Segment     │  (context, recedes)   │     Tornado → facts   │
│  Customer    └───────────────────────┴──────────────────────┘
│  Assumptions
│  Map (=geo lever)
│  Pin / Reset
│  Boundary (collapsible)
└──────────────┘
        FactInspector drawer — universal drill-in, opens from any surface
```

- **Control rail** (`components/ControlRail.tsx`, new wrapper): a sticky left column (~20rem) holding the three
  filter-lever groups, the assumption sliders, the **map under the geography group** (it *is* that lever),
  Pin/Reset, and `BoundaryPanel` as a collapsible at the bottom. Inputs together; everything to the right is
  output/story. Stacks below the canvas on narrow widths.
- **① The answer** (`FunnelHero.tsx`, new — folds `FunnelOutputs` + `DeltaPanel`): the hero, full canvas width,
  largest type on the page. Funnel + Δ together because "the delta is the product" — cause and effect adjacent.
- **② The computation** (`ComputationPanel.tsx`, new): header with a `Graph | Ledger` segmented toggle
  (**Graph default**); body renders `FactGraph` (panel variant) or `FactsLedger`. Both highlight on focus and
  open the inspector on click.
- **③ Market shape + Risk:** `ShapeStrip` recedes (smaller, secondary) next to the `Tornado`, which is the
  value-of-information view and the bridge into facts.
- Demote the independence-MVP **caveat banner** from a full-width amber bar to a small info chip/tooltip inside
  the computation or risk act — it shouldn't shout before the answer.

---

## 3. Linked focus — the connective tissue (full version)

One shared focus ties the ledger to every visual. **Focus targets a node `id`** (node-addressable, consistent
with the architecture). Map countries → `geo.*`, tornado bars → leaf ids, ledger rows → ids, graph nodes → ids,
shape segments → `seg.*`.

### 3.1 The context — `lib/focus.tsx` (new)

```ts
interface FocusValue {
  focusId: string | null;   // highlighted everywhere (hover preview or pinned)
  pinned: boolean;          // true = set by click and sticky
  inspectId: string | null; // FactInspector drawer target

  hover(id: string | null): void; // sets focusId only when not pinned
  pin(id: string): void;           // pinned=true, focusId=id, inspectId=id
  closeInspector(): void;          // pinned=false, inspectId=null
}
export const FocusProvider; export function useFocus(): FocusValue;
```

- **Hover** any focusable element → `hover(id)` → transient highlight across all surfaces; leave → `hover(null)`.
- **Click** → `pin(id)` → focus sticks (presenter can hover-talk) **and** the inspector opens at that node.
- **Close inspector / click empty** → `closeInspector()` (focus releases on next hover-out).

`Dashboard` wraps the page in `FocusProvider`; `FactInspector` reads `inspectId`; lineage chips in the inspector
call `pin(refId)` to navigate.

### 3.2 Per-surface wiring

Each surface maps its interactive elements to a node id and applies the same two behaviors — **set focus** (hover
/ click) and **respond to focus** (highlight when `focusId` matches):

| Surface | Element → id | On focus match |
|---|---|---|
| `RegionMap` | country `<path>` → `geo.<CC>` | accent stroke + raise; siblings dim slightly |
| `FactsLedger` (`LedgerRow`) | row → node id | accent ring on the row |
| `Tornado` | bar row → leaf id | bar brightens; others recede |
| `FactGraph` | node → id | node ring; **plus** its lineage edges/path glow |
| `ShapeStrip` | segmentation segment → `seg.*` | segment pops (bonus) |
| `FunnelHero` | TAM/SAM/YAM → output ids | responder: the focused leaf's contribution glows in-funnel |

### 3.3 Highlight tokens (keep it gentle, not a strobe)

- Focused element: a single accent (`--color-border-info` ring / brightness bump), full opacity.
- Within the *same* surface, non-matching siblings drop to ~60% — focus pops without the whole page going dark.
- Across *other* surfaces, the matching element gets the accent; non-matching are left alone (no global dimming).

### 3.4 Lineage flow (the "watch Germany flow to TAM" moment)

When `focusId` is a leaf, use `lineageOf(focusId).downstream` to faintly glow the path to the funnel
output(s) in the Graph and the corresponding stage(s) in `FunnelHero`. When `focusId` is an output, glow
`lineageOf(focusId).upstream`. This is the single most persuasive demo beat — pin Germany, watch its €336M
trace through scope factor → TAM. Uses existing `lineageOf`; no new compute.

---

## 4. Funnel hero redraw — `components/FunnelHero.tsx`

The current three-gradient-bars-with-a-YAM-dot reads as an error. Replace with:

- **Real proportions:** TAM / SAM / YAM as stacked stages, width ∝ value, with a **min width** so YAM is a
  visible sliver (not a dot). The large **€ value** is the emphasis; the bar is secondary.
- **Ghosted baseline:** a faint outline at the baseline width behind each current stage. At baseline they
  coincide; when a lever shrinks the scope, the gap is the story.
- **Inline Δ:** per stage, show `Δ` only when nonzero (e.g. `SAM €324M  ▼ −€336M`), sign-colored (green up /
  red down). Pull the `DeltaPanel` decomposition in here so the answer and its delta are one object.
- **Scope caption:** one line derived from the current selection — `Central Europe · all segments · all buyers`,
  updating live as levers move.
- One value-accent color family for the stages; gray for the baseline ghost. No decorative gradients.

---

## 5. Tornado fixes — `components/Tornado.tsx`

- **Untruncate labels.** Give the label column real width or wrap to two lines — "Central Europe rac…" and
  "Serviceable share …" must read fully.
- Keep the amber bars, confidence coloring, and the `±€` swing values. Rank by `|swing|` desc (it's VOI).
- **Wire to focus:** each bar row hover → `hover(id)`, click → `pin(id)` (opens the fact's inspector showing
  its evidence + recipe + promotion path). This unifies the tornado's ranking with the ledger's "riskiest
  first" — same VOI, two forms, one "verify next."
- Keep the "v1 simplification: perturbing one share does not re-normalize the others" note, small.

---

## 6. Palette & hierarchy

Color should **encode**, not decorate:

- **Value / positive** → one accent family (blue→teal). **Risk / attention** → amber (tornado). **Structure** →
  neutral gray. **Delta sign** → green (up) / red (down). **Confidence** → the existing dot/badge colors.
  **Included vs excluded** → full vs dimmed.
- Retire the blue→purple→green gradient mix where it carries no meaning.
- **Hierarchy:** the funnel hero is the largest, calmest thing on the page; shape and risk recede; the control
  rail is quiet. More whitespace between acts than within them. Consistent `glass-panel` treatment so panels
  read as one family.

---

## 7. Files touched

| File | Change |
|---|---|
| `lib/focus.tsx` | **new** — `FocusProvider` + `useFocus` |
| `components/Dashboard.tsx` | **rewrite** — `FocusProvider` wrapper; control rail + canvas acts in narrative order; mounts `FactInspector` |
| `components/ControlRail.tsx` | **new** — wraps `ScenarioControls` + `RegionMap` + assumptions + Pin/Reset + `BoundaryPanel` (collapsible) |
| `components/FunnelHero.tsx` | **new** — funnel redraw + ghosted baseline + inline Δ (folds `FunnelOutputs` + `DeltaPanel`) |
| `components/ComputationPanel.tsx` | **new** — `Graph | Ledger` toggle (Graph default) |
| `components/RegionMap.tsx` | **edit** — consume + set focus |
| `components/FactGraph.tsx` | **edit** — focus highlight + lineage-flow glow |
| `components/FactsLedger.tsx` / `LedgerRow.tsx` | **edit** — row focus highlight; click → `pin` |
| `components/Tornado.tsx` | **edit** — untruncate labels; focus + inspector wiring |
| `components/ShapeStrip.tsx` | **edit** — recede; segment focus (bonus) |
| `components/FactInspector.tsx` | **edit** — read `inspectId` from focus context; lineage chips call `pin` |

**Do not touch:** `lib/compute.ts`, `lib/__tests__/compute.test.ts`, `lib/ledger.ts` data, `lib/schema.ts`,
the §10 numbers, the `useScenario` reducer.

---

## 8. Build milestones

1. **Reshell.** `FocusProvider` scaffold (no-op), `ControlRail`, canvas acts in narrative order, `ComputationPanel`
   with the `Graph | Ledger` toggle (Graph default). The spine reads even before wiring.
2. **Funnel hero.** Redraw with real proportions + ghosted baseline + inline Δ + scope caption; YAM is a visible
   sliver.
3. **Focus (core).** Context with hover-preview + click-pin; wire `RegionMap`, `FactsLedger`, `Tornado`,
   `FactGraph`; highlight tokens; inspector driven by `inspectId`.
4. **Lineage flow.** Focused leaf → downstream glow in Graph + funnel via `lineageOf`.
5. **Tornado untruncate** + focus link; `ShapeStrip` recede + segment focus.
6. **Palette + hierarchy polish.** Meaningful color, whitespace, caveat demoted to a chip.

---

## 9. Demo-day acceptance checklist

- [ ] Page reads top→bottom: **answer → computation → shape/risk**; controls pinned left.
- [ ] Computation act defaults to **Graph**; one tap → **Ledger**; both highlight on focus.
- [ ] **Hover Germany on the map** → its ledger row, its tornado geography bar, and its graph node highlight
      *simultaneously*; its slice glows in the funnel. **Click** → focus pins and the inspector opens at `geo.DE`
      showing **€336M**.
- [ ] **Pin a leaf** → its path glows from fact → scope factor → TAM.
- [ ] Funnel shows real TAM/SAM/YAM proportions with a **ghosted baseline**; moving a lever shows **inline Δ**;
      YAM is a sliver, not a dot.
- [ ] Tornado labels are **fully visible** (no "…").
- [ ] `npm test` green (incl. untouched §10 oracle); `npm run build` clean.

---

## 10. Out of scope (→ `Market_Module_Open_Questions.md`)

3D globe / real-geography map library; cross-dimension joint highlighting math; saved/named dashboard views;
keyboard-driven focus traversal; Risk Seek. The focus context (node-addressable, presentation-only) and the
act structure are built so these slot in without touching compute.
