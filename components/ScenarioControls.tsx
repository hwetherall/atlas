"use client";

import { motion } from "framer-motion";
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
              className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                on ? "text-sky-100" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {on && (
                <motion.div
                  layoutId={`bg-${dimension}`}
                  className="absolute inset-0 rounded-md bg-sky-500/20 border border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{label}</span>
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
    <section className="glass-panel rounded-xl p-5">
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

      <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
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

      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "pinBaseline" })}
          className="rounded-md bg-gradient-to-b from-sky-400 to-sky-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all hover:brightness-110"
        >
          Pin as baseline
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "resetToBaseline" })}
          disabled={!differs}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300 transition-all hover:bg-white/10 disabled:opacity-40"
        >
          Reset to baseline
        </button>
      </div>
    </section>
  );
}
