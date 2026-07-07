"use client";

import type { Dimension, Ledger } from "@/lib/schema";
import { DIMENSION_FIELD } from "@/lib/dimensions";
import type { ScenarioAction, ScenarioState } from "@/lib/useScenario";
import { boundsFor } from "@/lib/levers";
import AssumptionSlider from "@/components/AssumptionSlider";
import FilterGroup from "@/components/FilterGroup";

interface Props {
  ledger: Ledger;
  state: ScenarioState;
  dispatch: React.Dispatch<ScenarioAction>;
}

export default function ScenarioControls({ ledger, state, dispatch }: Props) {
  const { current, baseline } = state;
  const differs = JSON.stringify(current) !== JSON.stringify({ ...baseline, id: current.id, label: current.label });

  const assumptionNodes = ledger.filter((n) => n.kind === "assumption");

  return (
    <section className="card rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
          Scenario controls
        </h2>
        {differs ? (
          <span className="rounded-full border border-fact-amber-line bg-warning-wash px-2 py-0.5 text-[11px] text-warning-ink">
            differs from baseline
          </span>
        ) : (
          <span className="rounded-full bg-well px-2 py-0.5 text-[11px] text-ink-3">
            at baseline
          </span>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {(Object.keys(DIMENSION_FIELD) as Dimension[]).map((dimension) => (
          <FilterGroup
            key={dimension}
            dimension={dimension}
            selected={current[DIMENSION_FIELD[dimension]]}
            onToggle={(value) => dispatch({ type: "toggle", dimension, value })}
          />
        ))}
      </div>

      <div className="mt-5 space-y-4 border-t border-hairline pt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink-3">
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

      <div className="mt-5 flex gap-2 border-t border-hairline pt-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "pinBaseline" })}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-ink"
        >
          Pin as baseline
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "resetToBaseline" })}
          disabled={!differs}
          className="rounded-md border border-hairline bg-card px-4 py-2 text-sm text-ink-2 transition-colors hover:bg-well disabled:opacity-40"
        >
          Reset to baseline
        </button>
      </div>
    </section>
  );
}
