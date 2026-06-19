"use client";

import type { Dimension, Ledger } from "@/lib/schema";
import { DIMENSION_LABELS, DIMENSION_VALUES } from "@/lib/dimensions";
import type { ScenarioAction, ScenarioState } from "@/lib/useScenario";
import { boundsFor } from "@/lib/levers";
import AssumptionSlider from "@/components/AssumptionSlider";

interface Props {
  ledger: Ledger;
  state: ScenarioState;
  dispatch: React.Dispatch<ScenarioAction>;
}

const FIELD: Record<Dimension, "geographies" | "segments" | "customerTypes"> = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
};

function FilterGroup({
  dimension,
  selected,
  onToggle,
}: {
  dimension: Dimension;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const selectedSet = new Set(selected);
  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {DIMENSION_LABELS[dimension]}
      </legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DIMENSION_VALUES[dimension].map(({ value, label }) => {
          const on = selectedSet.has(value);
          return (
            <button
              key={value}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => onToggle(value)}
              className={[
                "rounded-md border px-2.5 py-1 text-sm transition-colors",
                on
                  ? "border-sky-500/60 bg-sky-500/15 text-sky-200"
                  : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ScenarioControls({ ledger, state, dispatch }: Props) {
  const { current, baseline } = state;
  const differs = JSON.stringify(current) !== JSON.stringify({ ...baseline, id: current.id, label: current.label });

  const assumptionNodes = ledger.filter((n) => n.kind === "assumption");

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-200">Scenario controls</h2>
        {differs ? (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-300">
            differs from baseline
          </span>
        ) : (
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400">
            at baseline
          </span>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {(Object.keys(FIELD) as Dimension[]).map((dimension) => (
          <FilterGroup
            key={dimension}
            dimension={dimension}
            selected={current[FIELD[dimension]]}
            onToggle={(value) => dispatch({ type: "toggle", dimension, value })}
          />
        ))}
      </div>

      <div className="mt-5 space-y-4 border-t border-neutral-800 pt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Assumptions
        </h3>
        {assumptionNodes.map((node) => {
          const bounds = boundsFor(node.id);
          const value = current.assumptions[node.id] ?? node.value;
          return (
            <AssumptionSlider
              key={node.id}
              id={node.id}
              label={node.label}
              value={value}
              band={node.sensitivityRange}
              {...bounds}
              onChange={(v) => dispatch({ type: "setAssumption", id: node.id, value: v })}
            />
          );
        })}
      </div>

      <div className="mt-5 flex gap-2 border-t border-neutral-800 pt-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "pinBaseline" })}
          className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-sky-400"
        >
          Pin as baseline
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "resetToBaseline" })}
          disabled={!differs}
          className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600 disabled:opacity-40"
        >
          Reset to baseline
        </button>
      </div>
    </section>
  );
}
