# ledger.md — Enriched Facts Ledger (Atlas, M15 Market Module)

> Extension spec for the v1 demo. **Builds on the resolved design in `CLAUDE.md` — does not relitigate it.**
> Goal: make the Facts ledger the *second star of the show* alongside the lever simulation, by turning each
> fact from a styled table row into an inspectable object with **Fact · Evidence · Recipe · Lineage**, a
> **live contribution** that moves with the levers, and a **value-of-information** ranking.
>
> Everything new here is **presentation + read-only derivation**. The compute engine and the §10 oracle are
> untouched. No LLM, no network — consistent with `CLAUDE.md` §6 and §9.

---

## 0. Decisions baked in (flip these if you disagree before starting)

1. **Inspector = right slide-in drawer**, not inline row-expansion. More room for the richness, reads as a
   product. (Swap to inline-expand only if you want the smaller-footprint version.)
2. **Hero fact = `geo.DE` (Germany 28%).** Its delta (`exclude Germany → −€336M`) is already the headline in
   the §10 oracle, so its live-contribution number is one you're showing anyway. `tamBase` is the secondary
   hero (top risk: one source, ±25% band).
3. **Enrichment depth:** `geo.DE` and `tamBase` get the *full* treatment (evidence array + derivation +
   provenance + band + skill). Every *other* node gets at least `skillId` + `maturity` + a one-line
   `provenance.rationale`, so every row has a Recipe and a ladder rung without authoring full evidence for all.

---

## 1. Hard guardrails (read before writing code)

- **Do not modify `lib/compute.ts` or `lib/__tests__/compute.test.ts`.** The §10 oracle must stay green
  exactly: baseline **TAM €1,200M · SAM €660M · YAM €39.6M**; ex-Germany×edge×large-operators **TAM €31.10M**;
  ΔTAM telescopes to **−€1,168.9M** (Geo −€336M, Segment −€786M, Customer −€47M).
- **Nothing new enters the lever math.** `evidence`, `derivation`, `provenance`, `maturity`, `skillId`,
  lineage, contribution, and VOI are all read-only metadata or pure display-side derivations. The three filter
  levers + two assumption sliders behave identically.
- **All schema additions are `.optional()`.** The existing ledger must still validate unchanged.
- **No LLM / no network anywhere**, including "Re-run skill" — that's animation only and resolves to the same
  value (same ethos as `lib/demoScript.ts`: the intake is theatre, the ledger is the truth).
- **Node-addressable.** Lineage navigation is by node `id`. Don't introduce positional coupling.
- **Reuse, don't reinvent:** existing palette (`KIND_STYLE`/`CONFIDENCE_STYLE`), `formatEUR`/`formatPct`,
  framer-motion patterns, `glass-panel` styling, and the graph adjacency in `lib/graph.ts`.
- **New architecture ideas** that come up go to `Market_Module_Open_Questions.md`, not into this build.

---

## 2. Files touched

| File | Change |
|---|---|
| `lib/schema.ts` | **edit** — additive optional fields + `evidence`/`derivation`/`provenance`/`maturity` schemas |
| `lib/skills.ts` | **new** — `Skill` type, `SKILLS` registry, `validateSkillRefs()` |
| `lib/ledger.ts` | **edit** — enrich `geo.DE` + `tamBase` fully; tag all other nodes with `skillId` + `maturity`; call `validateSkillRefs` |
| `lib/lineage.ts` | **new** — pure `lineageOf(ledger, id)` over the graph adjacency |
| `lib/contribution.ts` | **new** — pure `marginalContribution(ledger, scenario, id, metric)` |
| `lib/voi.ts` | **new** — pure `informationValue(ledger, scenario, id)` |
| `lib/badges.tsx` | **new** — lift `KIND_STYLE` / `CONFIDENCE_STYLE` here so ledger + inspector share them |
| `components/FactInspector.tsx` | **new** — the drawer (Fact/Evidence/Recipe/Lineage) |
| `components/FactsLedger.tsx` | **edit** — row-click opens inspector; dim excluded rows; sort/filter/"riskiest" header |
| `components/Dashboard.tsx` | **edit** — lift `selectedNodeId` state; pass `scenario`/`baseline`; wire lineage navigation |
| `lib/__tests__/*` | **new test files only** — schema/skills, lineage, contribution, voi |

**Do not touch:** `lib/compute.ts`, `lib/__tests__/compute.test.ts`, the §10 numbers, `useScenario.ts` reducer.

---

## 3. Data model additions — `lib/schema.ts`

All additive. Append schemas, then add the optional fields to `factNodeSchema`. Keep the existing `source`,
`op/inputs`, `dimension/dimensionValue`, `sensitivityRange` exactly as they are.

```ts
// ── Evidence: richer than the single `source`. The detail view prefers
//    `evidence` when present and falls back to `source`. ──────────────────────
export const sourceTypeSchema = z.enum([
  "industry-report",
  "internal",        // VentureX profile / competitor table — "consume, don't re-derive"
  "analyst-estimate",
  "triangulation",
  "pending",         // a source we know we want but haven't attached → shows the promotion path
]);
export type SourceType = z.infer<typeof sourceTypeSchema>;

export const evidenceSchema = z.object({
  title: z.string().min(1),
  sourceType: sourceTypeSchema,
  publisher: z.string().optional(),
  date: z.string().optional(),       // free-form ISO-ish; not as strict as asOf
  excerpt: z.string().optional(),    // short snippet/quote
  url: z.string().optional(),
  attached: z.boolean().default(true),
});
export type Evidence = z.infer<typeof evidenceSchema>;

// ── Derivation: the human-readable calc/triangulation for a leaf.
//    (Calculated internal nodes still use op/inputs; this is for the narrative
//    behind an `estimated`/`extracted` value.) ────────────────────────────────
export const derivationSchema = z.object({
  method: z.string().min(1),         // "Top-down capacity apportionment"
  expression: z.string().min(1),     // "DE_capacity (2.1 GW) ÷ CE_capacity (7.5 GW) = 0.28"
  crossCheck: z.string().optional(), // "GDP-weighted: 0.27 (within 5%)"
});
export type Derivation = z.infer<typeof derivationSchema>;

// ── Maturity ladder + confidence provenance ──────────────────────────────────
export const maturitySchema = z.enum([
  "needs-source",
  "single-source",
  "triangulated",
  "verified",
]);
export type Maturity = z.infer<typeof maturitySchema>;

export const provenanceSchema = z.object({
  rationale: z.string().min(1),        // why this `confidence`, in one line
  promotionPath: z.string().optional() // what would lift it (the VOI action)
});
export type Provenance = z.infer<typeof provenanceSchema>;
```

Add to `factNodeSchema` (all optional, alongside the existing fields):

```ts
    evidence: z.array(evidenceSchema).optional(),
    derivation: derivationSchema.optional(),
    provenance: provenanceSchema.optional(),
    maturity: maturitySchema.optional(),
    skillId: z.string().optional(),
```

> **Circular-import warning:** `lib/skills.ts` imports `NodeKind` from `lib/schema.ts`, so `schema.ts` must
> **not** import `skills.ts`. Do the `skillId`-exists check in `lib/skills.ts` via `validateSkillRefs(ledger)`
> and call it from `lib/ledger.ts` *after* `validateLedger` — not inside `factNodeSchema`.

---

## 4. Skill registry — `lib/skills.ts` (new)

A skill is the **hardcoded method** Innovera used to produce a fact: reusable, versioned, auditable. This is
the IP-flavoured surface — give it real anatomy.

```ts
import type { NodeKind } from "@/lib/schema";

export interface Skill {
  id: string;            // 'geo-share-triangulation'
  name: string;          // 'Geo-share triangulation'
  version: string;       // '1.2'
  summary: string;       // one-line method
  consumes: string[];    // the inputs it needs
  procedure: string[];   // the numbered playbook (also the "Re-run" log)
  emits: NodeKind[];     // which kinds it can produce
  confidencePolicy: string; // how it assigns confidence + sets the band
}

export const SKILLS: Record<string, Skill> = {
  "tam-base-sizing": { /* → tamBase */ },
  "geo-share-triangulation": { /* → geo.* */ },
  "segment-decomposition": { /* → seg.* */ },
  "buyer-mix-survey": { /* → cust.* */ },
  "serviceability-model": { /* → serviceableFactor */ },
  "year1-obtainable-model": { /* → obtainableFactor */ },
  "competitor-concentration": { /* → shape.cr3 (consumes VentureX table) */ },
  "cagr-projection": { /* → shape.cagr */ },
};

export function validateSkillRefs(ledger: { skillId?: string }[]): void {
  for (const n of ledger) {
    if (n.skillId && !SKILLS[n.skillId]) {
      throw new Error(`ledger node references unknown skill '${n.skillId}'`);
    }
  }
}
```

**Author the eight skills fully** (they're cheap and they sell the moat). The hero, `geo-share-triangulation`,
is given below; mirror its shape for the rest. Keep them illustrative but plausible.

```ts
"geo-share-triangulation": {
  id: "geo-share-triangulation",
  name: "Geo-share triangulation",
  version: "1.2",
  summary:
    "Apportions a regional base across countries using installed capacity, cross-checked against GDP weighting.",
  consumes: ["National installed rack capacity", "Regional base (tamBase)", "GDP weights (cross-check)"],
  procedure: [
    "Pull per-country installed rack capacity",
    "Normalise each country to the regional total",
    "GDP cross-check; flag any country >5% apart",
    "Emit estimated share + plausible band",
  ],
  emits: ["estimated"],
  confidencePolicy:
    "Single capacity source → inferred; two corroborating sources within 5% → verified. Band = ±max(cross-check gap, 25%).",
},
```

> **Narrative coherence:** the `procedure` lines should rhyme with `RESEARCH_PLAN` and `THINKING_STEPS` in
> `lib/demoScript.ts`, so the intake research-log and the per-fact recipes tell one story. (Optional polish:
> have `THINKING_STEPS` name the skill each step runs — route to open-questions if it grows.)

---

## 5. Seed enrichment — `lib/ledger.ts` (edit)

Keep the `[ILLUSTRATIVE]` banner and `AS_OF`. Enrich in place.

**`geo.DE` — full hero treatment** (this is the exact target the inspector mock was built against):

```ts
{
  id: "geo.DE", label: "Germany", kind: "estimated", value: 0.28, unit: "ratio",
  confidence: "inferred", asOf: AS_OF, dimension: "geography", dimensionValue: "DE",
  sensitivityRange: { low: 0.24, high: 0.31 },   // gives the hero a band → shows up in VOI/tornado
  skillId: "geo-share-triangulation",
  maturity: "triangulated",
  derivation: {
    method: "Top-down capacity apportionment",
    expression: "DE_capacity (2.1 GW) ÷ CE_capacity (7.5 GW) = 0.28",
    crossCheck: "GDP-weighted: 0.27 (within 5% band)",
  },
  provenance: {
    rationale: "Single capacity source; GDP cross-check agrees → inferred.",
    promotionPath: "Attach a second independent capacity source within 5% → verified.",
  },
  evidence: [
    { title: "DCD Intelligence — CE data-centre power report", sourceType: "industry-report",
      publisher: "DCD Intelligence", date: "2025-11",
      excerpt: "German installed rack capacity ≈ 2.1 GW, the largest national base in the region.", attached: true },
    { title: "VentureX profile — competitor & footprint table", sourceType: "internal", date: AS_OF,
      excerpt: "Corroborates DE as the dominant CE footprint.", attached: true },
    { title: "Second independent capacity source", sourceType: "pending",
      excerpt: "Corroborating this lifts confidence inferred → verified.", attached: false },
  ],
},
```

**`tamBase` — secondary hero / top risk** (already has `source` + `sensitivityRange: {900,1500}`; add):

```ts
  skillId: "tam-base-sizing",
  maturity: "single-source",
  derivation: {
    method: "Bottom-up installed base × ASP",
    expression: "CE_racks × PDU_attach_rate × ASP ≈ €1,200M",
  },
  provenance: {
    rationale: "One market report, no triangulation yet → widest band, top value-of-information.",
    promotionPath: "Triangulate against a revenue-based sizing → narrow band, verified.",
  },
  evidence: [
    { title: "[source TBD] — CE rack-PDU market sizing", sourceType: "industry-report", attached: true,
      excerpt: "Region-wide rack-PDU revenue ≈ €1.2B (all segments)." },
    { title: "Revenue-based cross-check", sourceType: "pending", attached: false,
      excerpt: "A second sizing method would triangulate the base and shrink the ±25% band." },
  ],
```

**All other nodes:** add `skillId` (map to the table in §4), a `maturity`, and a one-line
`provenance.rationale`. `seg.*` → `segment-decomposition`, `cust.*` → `buyer-mix-survey`,
`serviceableFactor` → `serviceability-model`, `obtainableFactor` → `year1-obtainable-model`,
`shape.cr3` → `competitor-concentration`, `shape.cagr` → `cagr-projection`, every other `geo.*` →
`geo-share-triangulation`.

Finally, after the existing `validateLedger`, add the ref check:

```ts
export const ledger: Ledger = validateLedger(rawLedger);
validateSkillRefs(ledger);   // throws at boot on an unknown skillId
```

---

## 6. Pure derivations (read-only, deterministic, unit-tested)

> Before writing `lineage.ts`, **read `lib/graph.ts` and `lib/compute.ts`** to use the real edge structure and
> the real `evaluate` signature. The funnel uses synthetic factor/output ids (e.g. a geography scope factor and
> `out.tam`/`out.sam`/`out.yam`); reuse that adjacency rather than hardcoding a parallel one.

### 6.1 `lib/lineage.ts`

```ts
export interface NodeRef { id: string; label: string; }
export interface Lineage { upstream: NodeRef[]; downstream: NodeRef[]; }
export function lineageOf(ledger: Ledger, id: string): Lineage;
```

Behavior, derived from the funnel/graph:
- **share leaf** (`geo.*` / `seg.*` / `cust.*`): `upstream = [tamBase]`; `downstream = [<dimension> scope
  factor → TAM → SAM → YAM]`.
- **`tamBase`**: `upstream = []`; `downstream = [TAM, SAM, YAM]`.
- **`serviceableFactor`**: `downstream = [SAM, YAM]`. **`obtainableFactor`**: `downstream = [YAM]`.
- **`shape.*`**: display-only — empty lineage (consumed by the shape strip, not the funnel).

Use friendly labels for synthetic nodes ("geography scope factor", "TAM"). Lineage chips are clickable → they
select that node in the inspector (§8).

**Acceptance:** `lineageOf(ledger, "geo.DE").upstream` contains `tamBase`; `.downstream` reaches the TAM output.
`lineageOf(ledger, "tamBase").upstream` is empty.

### 6.2 `lib/contribution.ts` — the "it moves" number

```ts
export function marginalContribution(
  ledger: Ledger, scenario: Scenario, id: string, metric: "tam" | "sam" | "yam"
): number;   // €M the node currently adds to `metric` under `scenario`
```

"Flip one, hold the rest" (the per-node analog of the tornado leaf swing in `CLAUDE.md` §4.3):
- **filter leaf** value `v` in dimension `D`: `cur = m(evaluate(scenario))`; build `alt` = scenario with `v`
  toggled (removed if selected, added if excluded); `return cur − m(evaluate(alt))`. Positive = currently
  adding that much; when `v` is excluded the inspector frames it as "+€X if included".
- **assumption / base leaves** (`tamBase`, `serviceableFactor`, `obtainableFactor`): these have no on/off, so
  the inspector shows their **band swing from `sensitivity()`** instead (reuse the existing function — do not
  reimplement). `marginalContribution` may return `0` for them.

**Acceptance (ties to the oracle):** from the pinned **baseline** (all dimensions selected, factor = 1),
`marginalContribution(ledger, baseline, "geo.DE", "tam") === 336` (i.e. `tamBase 1200 × geoShare 0.28`).
Excluding DE drops TAM 1200 → 864, a €336M swing — the Geography step of the §10 delta.

### 6.3 `lib/voi.ts` — value of information (Pedram's framework, per fact)

```ts
export function informationValue(ledger: Ledger, scenario: Scenario, id: string): number;
```

`= swing€ × uncertainty`, where:
- `swing€` = the node's `sensitivity()` band impact on TAM (reuse §4.3); nodes without a `sensitivityRange`
  → `0`.
- `uncertainty` = `1 − confidenceWeight`, with `verified = 1.0`, `inferred = 0.5`, `unknown = 0.2`
  (→ uncertainty `0 / 0.5 / 0.8`).

Higher = "verify this next." Drives the ledger's "Riskiest first" sort (§7).

**Acceptance:** `tamBase` (band 900–1500, inferred) ranks **#1**. A band-less share leaf ranks ~0. `geo.DE`
(now has a band) ranks above any band-less leaf.

---

## 7. `components/FactsLedger.tsx` (edit)

Keep the scannable rows; change the interaction and add a header control row.

1. **Row click → open inspector.** Replace the inline expand-for-source with `onClick={() =>
   onSelect(node.id)}` (lift selection to Dashboard, §8). Rows stay lean: label · kind badge · value · maturity
   chip · confidence badge. (Assumption rows keep their inline slider.)
2. **Dim excluded rows.** If a node is a filter leaf whose `dimensionValue` is **not** in the current
   scenario's selection for its dimension, render the row at `opacity-50` with a `line-through` label — mirror
   the dimming already used in `FactGraph` ("Excluded facts dim live with the levers"). This is the cheapest,
   most visible expression of "the ledger moves."
3. **Header controls:**
   - Sort `<select>`: `Default order` · `Value` · `Confidence` · `Information value`.
   - Filter chips: by `kind` and by `confidence` (toggle to show/hide).
   - **"Riskiest first"** toggle → sort by `informationValue` desc.
   - All filtering/sorting is local state + `useMemo` over the ledger; no `sendPrompt`, no recompute of the
     model.
4. Add a small **maturity chip** per row (`needs-source → single-source → triangulated → verified`) using the
   shared palette in `lib/badges.tsx`.

---

## 8. `components/FactInspector.tsx` (new) + `Dashboard.tsx` (edit)

**Drawer.** Right slide-in (framer-motion `x: '100%' → 0`), backdrop, `Esc`/click-out to close. The real Next
app can use `position: fixed` freely. Reuse `glass-panel` styling and the shared badges. **Match the agreed
mock** — four stacked sections, no tabs:

- **Fact** — the claim sentence ("Germany accounts for **28%** of the Central Europe rack-PDU market."),
  kind/confidence/maturity badges, `id · dimension · leaf · feeds TAM`, the big value + `asOf`. Then three
  metric cards: **Live contribution** (`marginalContribution`, §6.2, framed with sign), **Plausible band**
  (from `sensitivityRange`), **Information value** (`informationValue` bucketed High/Med/Low + a "verify next"
  chip when high).
- **Evidence** — map `node.evidence[]` to source cards (title · `sourceType` pill · publisher/date · excerpt);
  `attached: false` renders muted as "not yet attached" with the `promotionPath`. Below: the **Calculation**
  block from `node.derivation` (`method`, mono `expression`, `crossCheck`). Fall back to `node.source` if
  `evidence` is absent.
- **Recipe** — look up `SKILLS[node.skillId]`: name + `version` pill, `summary`, two columns (**Consumes** /
  **Procedure**), and the `confidencePolicy` line. A **"Re-run skill"** button (see below).
- **Lineage** — `lineageOf(node.id)` as `computed from ← … → feeds into` chips; each chip is a button that
  calls `onSelect(refId)` to navigate the inspector to that node.

**Re-run skill (theatre).** A scoped ~2–3s overlay/inline progress that streams the skill's `procedure` lines
as a mini log, then settles and gives the value a subtle highlight flash. **It must not change the value** (no
network/LLM — same value resolves). Reuse the visual language of `components/ThinkingSequence.tsx`; a stripped
inline version is fine. This sells "facts are reproducible and refreshable, not hand-typed," and is the seam
toward the v2 boundary-lever → re-research idea.

**Dashboard wiring:**
```ts
const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
// FactsLedger gets: onSelect={setSelectedNodeId}, plus scenario `cur` for dimming
// FactInspector gets: nodeId={selectedNodeId}, ledger, scenario={cur}, baseline={base},
//                     onSelect={setSelectedNodeId} (lineage nav), onClose={() => setSelectedNodeId(null)}
```
The inspector computes live contribution / VOI from `(ledger, cur, base)` in a `useMemo`, so it updates as
levers move while it's open.

---

## 9. Tests — `lib/__tests__/` (new files only)

Mirror the existing Vitest style. **Never edit `compute.test.ts`.** `npm test` must stay fully green including
the untouched §10 oracle.

- `schema.test.ts` additions (or a new `evidence.test.ts`): `evidence`/`derivation`/`provenance` parse;
  optional fields absent still valid; a node with `kind: "estimated"` + full enrichment parses;
  `validateSkillRefs` throws on an unknown `skillId` and passes on the seeded ledger.
- `lineage.test.ts`: `geo.DE` upstream contains `tamBase` and downstream reaches the TAM output; `tamBase`
  upstream empty; `obtainableFactor` downstream is just YAM.
- `contribution.test.ts`: `marginalContribution(ledger, baseline, "geo.DE", "tam") === 336` (±1e-6).
- `voi.test.ts`: `informationValue` ranks `tamBase` above any band-less share leaf; `geo.DE` (banded) >
  a band-less leaf.

---

## 10. Build milestones (engine-first, mirrors `CLAUDE.md` §8)

1. **Schema + skills registry + seed.** Additive schemas; `lib/skills.ts` with all eight skills +
   `validateSkillRefs` wired into `lib/ledger.ts`; enrich `geo.DE` (full) + `tamBase` (full); tag every other
   node with `skillId`/`maturity`/`provenance.rationale`. Schema + skills tests green.
2. **Pure derivations + tests.** `lineage.ts`, `contribution.ts`, `voi.ts` with the §6 acceptance invariants.
   No UI yet.
3. **Inspector (static).** `lib/badges.tsx` extracted; `FactInspector.tsx` renders the hero fact's four
   sections against the seed.
4. **Selection wiring.** Lift `selectedNodeId` to Dashboard; row-click opens the drawer; lineage chips
   navigate; close works.
5. **Make it move.** Live-contribution + VOI metric cards live in the inspector; dim excluded ledger rows.
6. **Ledger controls.** Sort / filter / "Riskiest first".
7. **Re-run theatre + polish.** Procedure-log animation; motion, spacing, dark-mode parity with `glass-panel`.

---

## 11. Demo-day acceptance checklist

- [ ] Click the **Germany** row → drawer opens with the full **Fact · Evidence · Recipe · Lineage** card,
      matching the agreed mock.
- [ ] **Exclude Germany** with the lever → the Germany row dims/strikes, and its inspector **Live contribution**
      reads **€336M**.
- [ ] Sort **"Riskiest first"** → **`tamBase` is #1**.
- [ ] **Re-run skill** on `geo.DE` → procedure log plays ~2–3s, value stays **28%** (no network/LLM).
- [ ] Lineage chip (`tamBase`) → inspector navigates to that node.
- [ ] `npm test` green (incl. the untouched §10 oracle); `npm run build` clean.

---

## 12. Out of scope for this pass (→ `Market_Module_Open_Questions.md`)

Real re-research on "Re-run" (the v2 boundary-lever loop); per-node attribution that re-normalizes shares;
Shapley (order-fair) per-fact deltas; persisting an evidence change-log / value diffing over time; a standalone
skills library page. The architecture here (node-addressable ids, skills as first-class objects, optional
metadata) is built so these slot in later without rework.
