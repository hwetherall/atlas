# improve-ledger.md — Ledger v2: dimension cards + ranked table (Atlas, M15)

> Increment on top of the shipped enriched ledger (`ledger.md`). The inspector is ~90% there and mostly stays.
> This pass **replaces the flat list of facts** with a structured, two-view ledger, wires the **live € column**
> so the ledger visibly moves with the levers, and cleans up the badges/filters and one inspector bug.
>
> Same rules as before: **presentation + read-only derivation only.** Compute engine and the §10 oracle are
> untouched. No LLM, no network.

---

## 0. The shape of the change (and decisions baked in)

**Problem:** the current ledger is one flat list of ~16 heterogeneous rows. You can't tell the three
100%-summing dimensions apart, and it reads as static even though it's the surface that's supposed to move.

**Answer — two views, toggled:**

1. **"By funnel" (default)** — one **card per dimension**, each card a compact aligned mini-table of its facts.
   Cards do the visual chunking; the table inside does the alignment. This is the everyday view and the demo
   view.
2. **"Ranked"** — a single **flat, sortable table** across all facts. This is where Sort / "Riskiest first"
   live, because ranking by value-of-information is cross-dimension and wants one list, not groups.

**Baked-in decisions (flip before starting if you disagree):**
- Default view is **cards-by-dimension**, not one-card-per-fact (that loses scannability) and not a permanent
  flat table (that's the thing you hated).
- Dimension cards show **`Σ 100%` + fact count** in the header — **no € subtotal** (each dimension partitions
  the *same* TAM, so three "€1,200M" headers would just confuse; see the honesty note in §3).
- "Riskiest first" and any non-default Sort switch the whole ledger to the **Ranked table**.

---

## 1. Hard guardrails (unchanged)

- **Do not touch `lib/compute.ts` or `lib/__tests__/compute.test.ts`.** §10 oracle stays green
  (TAM €1,200M · SAM €660M · YAM €39.6M; ex-DE×edge×large-ops ΔTAM −€1,168.9M).
- **Nothing new enters the lever math.** The `€ now` column, dimming, VOI, grouping are all read-only.
- **Reuse what exists:** `marginalContribution` (`lib/contribution.ts`), `informationValue` (`lib/voi.ts`),
  `lineageOf` (`lib/lineage.ts`), the shared badges (`lib/badges.tsx`), `formatEUR`/`formatPct`, `glass-panel`,
  framer-motion patterns, and the dimension value/label lists in `lib/dimensions.ts`. **Add no new compute.**
- New big ideas → `Market_Module_Open_Questions.md`.

---

## 2. The view model

### 2.1 Grouping

Add a pure helper (e.g. in `lib/ledgerView.ts`) that buckets nodes into funnel sections, in funnel order:

```ts
export type SectionId = "base" | "geography" | "segment" | "customerType" | "assumption" | "shape";

export function sectionOf(node: FactNode): SectionId {
  if (node.id === "tamBase") return "base";
  if (node.dimension) return node.dimension;            // 'geography' | 'segment' | 'customerType'
  if (node.kind === "assumption") return "assumption";  // serviceableFactor, obtainableFactor
  return "shape";                                        // shape.cagr, shape.cr3, ...
}

export const SECTION_ORDER: SectionId[] = [
  "base", "geography", "segment", "customerType", "assumption", "shape",
];

export const SECTION_LABEL: Record<SectionId, string> = {
  base: "Market base",
  geography: "Geography",
  segment: "Segment",
  customerType: "Customer type",
  assumption: "Funnel assumptions",
  shape: "Market shape",
};
```

### 2.2 "By funnel" view — dimension cards

- **Market base** is a single header stat, not a card body row: `Central Europe rack-PDU market · extracted ·
  €1,200M`, visually set apart as the top of the funnel.
- **Geography / Segment / Customer type** each render as a card (`glass-panel`):
  - Header: section label · `Σ 100%` pill · `n facts` · (no € subtotal).
  - Body: one compact row per fact — `label` · `maturity` chip · a **thin share bar** (fill = share, neutral
    `--color-border` / gray ramp) · `%` (mono, right) · **`€ now`** (mono, muted, right) · a small **trust dot**
    (confidence as color, replacing the full badge — see §5).
  - Rows align in columns so the eye can scan a single column down the card.
- **Funnel assumptions** card holds the assumption leaves as the existing inline **sliders**
  (`serviceableFactor`, `obtainableFactor`), each with its downstream result inline (`→ SAM €660M`,
  `→ YAM €39.6M`). This is where the sliders live now — not scattered in a list.
- **Market shape** card: `shape.cagr`, `shape.cr3` as compact display-only rows (no share bar, no `€ now`).
  > These already render in `ShapeStrip`. Either show a minimal shape card here **or** filter `shape.*` out of
  > the ledger to avoid duplication — author's call; default to a minimal card for completeness.

### 2.3 "Ranked" view — flat sortable table

A single `<table>` across all facts (ungrouped). Columns:

| Fact | Dimension | Kind | Maturity | Value | € now | Info value |
|---|---|---|---|---|---|---|

- Sortable by `Value`, `Confidence`, and **`Info value`** (`informationValue`, desc — this is "Riskiest
  first"). `Default order` returns to the **By funnel** card view.
- `table-layout: fixed` with explicit column widths (the panel is ~constrained); align numerics right, mono.
- Excluded filter-leaf rows dim here too (§4).

### 2.4 View toggle

A small segmented control in the ledger header: **`By funnel` | `Ranked`**. The existing Sort `<select>` and
the `Riskiest first` toggle drive the Ranked view (selecting any of them implies `Ranked`; `Default order`
implies `By funnel`). Keep one source of truth for view state in `FactsLedger`.

---

## 3. The `€ now` column — the "it moves" hook

Per share row, show the fact's current contribution to TAM via the **existing** `marginalContribution`:

```ts
marginalContribution(ledger, scenario, node.id, "tam")
```

- **Included** filter leaf → `formatEUR(contribution)` (e.g. Germany → `€336M`).
- **Excluded** filter leaf → render the row dimmed/struck (§4) and show `+€{contribution}M if included`.
- **Base / assumption / shape** rows → no `€ now` (they have no toggle; `tamBase`'s magnitude is the funnel
  itself, assumptions show their `→ SAM/YAM` result instead).

**Caption under the ledger header:** "€ now = each fact's slice of TAM at the current scope — moves with the
levers."

> **Honesty note (put this in a comment, not the UI):** `€ now` is each fact's *marginal* slice (toggle it,
> hold the rest), consistent with the independence approximation in `CLAUDE.md` §3.2. Because dimensions
> partition the *same* TAM multiplicatively, **do not** sum `€ now` *across* dimensions or print a cross-card
> total — it won't equal TAM and will mislead. Within a single dimension at baseline it does sum to TAM; that's
> the test below.

**Baseline invariants (new tests):** from the pinned baseline (all selected), the sum of `€ now` over the
nodes in each share dimension equals **€1,200M**, exactly:

```
Σ marginalContribution(baseline, geo.*,  "tam") === 1200
Σ marginalContribution(baseline, seg.*,  "tam") === 1200
Σ marginalContribution(baseline, cust.*, "tam") === 1200
```

(Each holds because `Σ base×share = base×Σshare = 1200×1.0`.) The per-fact check `geo.DE === 336` from the
prior spec still stands.

---

## 4. Row dimming for excluded facts

A filter leaf (`geo.*` / `seg.*` / `cust.*`) whose `dimensionValue` is **not** in the current scenario's
selection for its dimension renders: `opacity-50` + `line-through` on the label + the `excluded` maturity-style
chip + the `+€X if included` framing in the `€ now` slot. Mirror the dimming `FactGraph` already does, so the
ledger and the graph agree visually when a lever moves. This applies in **both** views.

---

## 5. Badge & filter cleanup

- **Two badges per row is noisy.** Keep the **maturity** chip (`needs-source → single-source → triangulated →
  verified`) as the per-row trust signal; **demote `confidence`** to a small **colored dot** next to the value
  (verified = green, inferred = amber, unknown = red, from the shared palette), with the full confidence badge
  shown only in the inspector. One chip + one dot per row, not two chips.
- **Filter chips read as a legend, not controls.** Give each an explicit on/off state: filled = active
  (included), outlined/muted = filtered out. Clicking toggles. Default all-on.
- **Gray out empty categories.** Today nothing is `calculated`/`verified`/`unknown`, so those three chips look
  broken. Disable (reduced opacity, non-interactive) any kind/confidence whose count in the current ledger is 0.

---

## 6. Inspector fix (the last 10%)

One real bug: on `tamBase` the **Live contribution card shows `±€300M band on TAM`**, which is just half the
plausible band the next card already shows (900–1500). Make that first card **conditional on node type**:

- **filter leaf** (`geo.*` / `seg.*` / `cust.*`): `Live contribution` = `marginalContribution` (e.g. `geo.DE`
  → **€336M**) — a genuine, non-redundant number. **Verify the `geo.DE` inspector shows €336M and not a
  restatement of its 24–31% band.**
- **base / assumption leaf**: relabel the card to **`TAM sensitivity`** (the band swing) **or drop it** so the
  node shows two cards (Band + Info value), not three duplicative ones.

Nitpick: the `Plausible band` card wraps across two lines — shorten the label or tighten so `€900M–€1,500M`
fits on one line.

---

## 7. Files touched

| File | Change |
|---|---|
| `lib/ledgerView.ts` | **new** — `sectionOf`, `SECTION_ORDER`, `SECTION_LABEL`, share-bar + grouping helpers |
| `components/FactsLedger.tsx` | **rewrite** — view toggle + filters; renders dimension cards or the ranked table |
| `components/LedgerGroup.tsx` | **new** — one dimension card (header + aligned fact rows) |
| `components/LedgerRow.tsx` | **new** — a single fact row (label · maturity · share bar · % · € now · trust dot); used by the card and (as a `<tr>` variant) the ranked table |
| `components/FactInspector.tsx` | **edit** — conditional `Live contribution` / `TAM sensitivity` card; band-card layout |
| `lib/badges.tsx` | **edit** — add the confidence **dot** variant; chip on/off + disabled states |
| `lib/__tests__/*` | **new tests only** — grouping + the per-dimension €-sum invariants |

**Do not touch:** `lib/compute.ts`, `lib/__tests__/compute.test.ts`, `lib/contribution.ts`, `lib/voi.ts`,
`lib/lineage.ts`, `lib/ledger.ts` data, the §10 numbers.

---

## 8. Tests (additive)

- `ledgerView.test.ts`: `sectionOf(tamBase)==='base'`; `sectionOf(geo.DE)==='geography'`;
  `sectionOf(serviceableFactor)==='assumption'`; `sectionOf(shape.cagr)==='shape'`.
- `contribution.test.ts` additions: the three per-dimension €-sum invariants in §3 (`=== 1200`, ±1e-6).
- `npm test` stays fully green including the untouched §10 oracle.

---

## 9. Build milestones

1. **`lib/ledgerView.ts` + grouping tests.** Pure, no UI.
2. **`LedgerRow` + `LedgerGroup`.** Static dimension cards (Geography/Segment/Customer) with share bar, `%`,
   maturity chip, trust dot. Base stat header. Assumptions card with the existing sliders. Shape card.
3. **`€ now` column** wired to `marginalContribution`; the per-dimension €-sum invariant tests green.
4. **Row dimming** for excluded leaves (both views).
5. **Ranked table** + view toggle; Sort / "Riskiest first" drive it; `tamBase` floats to #1.
6. **Badge/filter cleanup** (confidence dot, chip on/off, gray empty categories).
7. **Inspector card fix** + band-card layout; polish (motion, dark-mode parity with `glass-panel`).

---

## 10. Demo-day acceptance checklist

- [ ] Default ledger shows **dimension cards**, not a flat list; each share card shows `Σ 100%` + count.
- [ ] Germany row shows `28%` **and** `€336M`; the geography card's rows' `€ now` sum to **€1,200M** at baseline.
- [ ] Excluding **Telecom** (segment) → its row dims/strikes, shows `+€72M if included`, and the funnel TAM
      drops by €72M.
- [ ] Switching to **Riskiest first** flips to the **ranked table** with **`tamBase` at #1**.
- [ ] `geo.DE` inspector `Live contribution` reads **€336M** (not a copy of its band); `tamBase` card is
      relabeled/`not` duplicative.
- [ ] `npm test` green; `npm run build` clean.

---

## 11. Out of scope (→ `Market_Column_Open_Questions.md`)

Cross-dimension joint attribution (so a per-card "in-scope total" becomes meaningful); drag-to-reorder; saved
ledger views; a dedicated skills-library page. The view model here (pure `sectionOf` grouping, shared
`LedgerRow`, read-only `€ now`) is built so these slot in without touching compute.
