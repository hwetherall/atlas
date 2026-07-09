"use client";

import type { Dimension, Ledger } from "@/lib/schema";
import { evaluate } from "@/lib/compute";
import { formatEUR, formatPct } from "@/lib/format";
import { boundsFor } from "@/lib/levers";
import type { ScenarioAction, ScenarioState } from "@/lib/useScenario";
import AnimatedNumber from "@/components/AnimatedNumber";
import AssumptionSlider from "@/components/AssumptionSlider";
import FilterGroup from "@/components/FilterGroup";

// ─────────────────────────────────────────────────────────────────────────────
// EquationStrip — the Fact Bank's thesis statement: the whole model as one
// live equation, with each lever sitting directly beneath the term it drives.
// Toggle a country and the term above the chip shrinks, then everything to its
// right. TAM/SAM/YAM carry the dashboard funnel-ramp underlines for identity.
//
// Split into two deliberate rows so the funnel never breaks at a width-driven
// point. TAM is restated as the hinge, so each row reads as its own equation:
//   Row 1:  BASE × WHERE × WHAT FOR × WHO BUYS = TAM
//   Row 2:  TAM  × CAN SERVE = SAM × YEAR-1 = YAM
// ─────────────────────────────────────────────────────────────────────────────

export type EquationTerm =
  | "base"
  | "geography"
  | "segment"
  | "customerType"
  | "tam"
  | "serviceable"
  | "sam"
  | "obtainable"
  | "yam";

// Funnel order — highlighting a term also highlights everything to its right.
const TERM_ORDER: EquationTerm[] = [
  "base",
  "geography",
  "segment",
  "customerType",
  "tam",
  "serviceable",
  "sam",
  "obtainable",
  "yam",
];

interface Props {
  ledger: Ledger;
  state: ScenarioState;
  dispatch: React.Dispatch<ScenarioAction>;
  /** Term the hovered/selected fact feeds — it and its downstream tint. */
  highlightTerm?: EquationTerm | null;
}

const OUTPUT_UNDERLINE: Record<"tam" | "sam" | "yam", string> = {
  tam: "bg-funnel-tam",
  sam: "bg-funnel-sam",
  yam: "bg-funnel-yam",
};

function Operator({ char }: { char: "×" | "=" }) {
  return (
    <span aria-hidden className="select-none pt-[1.35rem] text-center text-lg text-ink-faint">
      {char}
    </span>
  );
}

function Term({
  label,
  highlighted,
  source,
  output,
  baseline,
  children,
  controls,
}: {
  label: string;
  highlighted: boolean;
  source: boolean;
  output?: "tam" | "sam" | "yam";
  baseline?: React.ReactNode;
  children: React.ReactNode; // the value
  controls?: React.ReactNode; // lever chips / slider under the term
}) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-lg px-1.5 py-1 transition-colors ${
        source ? "bg-accent-wash/70" : ""
      }`}
    >
      <span
        className={`whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
          highlighted ? "text-accent-ink" : "text-ink-3"
        }`}
      >
        {label}
      </span>
      <span
        className={`mt-0.5 font-mono tabular-nums ${
          output ? "text-2xl font-semibold text-ink" : "text-lg text-ink-2"
        }`}
      >
        {children}
      </span>
      <span
        className={`mt-1 h-0.5 w-full max-w-[72px] rounded-full ${
          output
            ? highlighted
              ? "bg-accent"
              : OUTPUT_UNDERLINE[output]
            : highlighted
              ? "bg-accent/40"
              : "bg-transparent"
        }`}
      />
      {baseline ? (
        <span className="mt-1 whitespace-nowrap font-mono text-[11px] tabular-nums text-ink-3">
          {baseline}
        </span>
      ) : null}
      {controls ? <div className="mt-2">{controls}</div> : null}
    </div>
  );
}

export default function EquationStrip({ ledger, state, dispatch, highlightTerm }: Props) {
  const { current, baseline } = state;
  const cur = evaluate(ledger, current);
  const base = evaluate(ledger, baseline);
  const tamBase = ledger.find((n) => n.id === "tamBase")!;

  const differs =
    JSON.stringify(current) !==
    JSON.stringify({ ...baseline, id: current.id, label: current.label });

  const hiIdx = highlightTerm ? TERM_ORDER.indexOf(highlightTerm) : -1;
  const hi = (term: EquationTerm) => hiIdx >= 0 && TERM_ORDER.indexOf(term) >= hiIdx;
  const src = (term: EquationTerm) => highlightTerm === term;

  // Baseline subline for a factor term (shown only when it differs).
  function factorBaseline(curV: number, baseV: number): React.ReactNode {
    if (Math.abs(curV - baseV) < 1e-9) return null;
    return <>baseline {formatPct(baseV, baseV < 0.1 && baseV > 0 ? 1 : 0)}</>;
  }

  // Baseline subline for an output (€ + signed delta).
  function outputBaseline(curV: number, baseV: number): React.ReactNode {
    if (Math.abs(curV - baseV) < 1e-9) return null;
    const delta = curV - baseV;
    return (
      <>
        baseline {formatEUR(baseV)} ·{" "}
        <span className={delta < 0 ? "text-negative-ink" : "text-positive-ink"}>
          {formatEUR(delta, { signed: true })}
        </span>
      </>
    );
  }

  function factorValue(v: number) {
    return <AnimatedNumber value={v} format="pct" dp={v < 0.1 && v > 0 ? 1 : 0} />;
  }

  function leverChips(dimension: Dimension) {
    return (
      <div className="w-52">
        <FilterGroup
          dimension={dimension}
          compact
          showLabel={false}
          selected={
            current[
              dimension === "geography"
                ? "geographies"
                : dimension === "segment"
                  ? "segments"
                  : "customerTypes"
            ]
          }
          onToggle={(value) => dispatch({ type: "toggle", dimension, value })}
        />
      </div>
    );
  }

  function assumptionSlider(id: "serviceableFactor" | "obtainableFactor") {
    const node = ledger.find((n) => n.id === id)!;
    return (
      <div className="w-[110px]">
        <AssumptionSlider
          id={`eq-${id}`}
          label={node.label}
          value={current.assumptions[id] ?? node.value}
          band={node.sensitivityRange}
          hideLabel
          hideBand
          hideValue
          {...boundsFor(id)}
          onChange={(v) => dispatch({ type: "setAssumption", id, value: v })}
        />
      </div>
    );
  }

  return (
    <section className="card mt-6 rounded-xl px-5 py-4">
      {/* Header — keeps the status + Reset out of the equation flow. */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
          The model, live
        </span>
        <div className="flex items-center gap-2">
          {differs ? (
            <span className="rounded-full border border-fact-amber-line bg-warning-wash px-2 py-0.5 text-[11px] text-warning-ink">
              adjusted scenario
            </span>
          ) : (
            <span className="rounded-full bg-well px-2 py-0.5 text-[11px] text-ink-3">
              baseline
            </span>
          )}
          <button
            type="button"
            onClick={() => dispatch({ type: "resetToBaseline" })}
            disabled={!differs}
            className="rounded-md border border-hairline bg-card px-3 py-1 text-xs text-ink-2 transition-colors hover:bg-well disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      {/* One 9-column grid shared by both rows so operands, operators and
          values line up in columns. Row 1 builds the market down to TAM;
          row 2 restates TAM as the hinge and narrows it to the year-1 number.
          The two "column-buckets" of each row share widths, so e.g. the
          "Market base" and "Total (TAM)" values sit in the same column. */}
      <div
        className="grid items-start gap-x-1.5 gap-y-2"
        style={{
          gridTemplateColumns:
            "auto auto 13rem auto 13rem auto 13rem auto auto",
        }}
      >
        {/* Row 1 — sizing the market down to TAM. */}
        <Term label="Market base" highlighted={hi("base")} source={src("base")}>
          {formatEUR(tamBase.value)}
        </Term>
        <Operator char="×" />
        <Term
          label="Where"
          highlighted={hi("geography")}
          source={src("geography")}
          baseline={factorBaseline(cur.factors.geography, base.factors.geography)}
          controls={leverChips("geography")}
        >
          {factorValue(cur.factors.geography)}
        </Term>
        <Operator char="×" />
        <Term
          label="What for"
          highlighted={hi("segment")}
          source={src("segment")}
          baseline={factorBaseline(cur.factors.segment, base.factors.segment)}
          controls={leverChips("segment")}
        >
          {factorValue(cur.factors.segment)}
        </Term>
        <Operator char="×" />
        <Term
          label="Who buys"
          highlighted={hi("customerType")}
          source={src("customerType")}
          baseline={factorBaseline(cur.factors.customerType, base.factors.customerType)}
          controls={leverChips("customerType")}
        >
          {factorValue(cur.factors.customerType)}
        </Term>
        <Operator char="=" />
        <Term
          label="Total (TAM)"
          output="tam"
          highlighted={hi("tam")}
          source={false}
          baseline={outputBaseline(cur.tam, base.tam)}
        >
          <AnimatedNumber value={cur.tam} format="eur" />
        </Term>

        {/* Divider spanning the full grid width. */}
        <div className="my-1 border-t border-hairline" style={{ gridColumn: "1 / -1" }} />

        {/* Row 2 — narrowing TAM to the year-1 opportunity. */}
        <Term label="Total (TAM)" output="tam" highlighted={hi("tam")} source={false}>
          <AnimatedNumber value={cur.tam} format="eur" />
        </Term>
        <Operator char="×" />
        <Term
          label="Can serve"
          highlighted={hi("serviceable")}
          source={src("serviceable")}
          baseline={factorBaseline(cur.factors.serviceable, base.factors.serviceable)}
          controls={assumptionSlider("serviceableFactor")}
        >
          {factorValue(cur.factors.serviceable)}
        </Term>
        <Operator char="=" />
        <Term
          label="Serviceable (SAM)"
          output="sam"
          highlighted={hi("sam")}
          source={false}
          baseline={outputBaseline(cur.sam, base.sam)}
        >
          <AnimatedNumber value={cur.sam} format="eur" />
        </Term>
        <Operator char="×" />
        <Term
          label="Year-1 share"
          highlighted={hi("obtainable")}
          source={src("obtainable")}
          baseline={factorBaseline(cur.factors.obtainable, base.factors.obtainable)}
          controls={assumptionSlider("obtainableFactor")}
        >
          {factorValue(cur.factors.obtainable)}
        </Term>
        <Operator char="=" />
        <Term
          label="Year-1 (YAM)"
          output="yam"
          highlighted={hi("yam")}
          source={false}
          baseline={outputBaseline(cur.yam, base.yam)}
        >
          <AnimatedNumber value={cur.yam} format="eur" />
        </Term>
      </div>
    </section>
  );
}
