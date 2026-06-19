"use client";

import { useReducer } from "react";
import type { Dimension, Ledger, Scenario } from "@/lib/schema";
import { baselineScenario } from "@/lib/compute";

// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the scenario + pinned baseline (plan §EPIC-002).
// Every lever surface (controls, map, inline ledger sliders) dispatches into
// this one reducer, so the map and the multi-selects can never desync.
// ─────────────────────────────────────────────────────────────────────────────

export interface ScenarioState {
  current: Scenario;
  baseline: Scenario;
}

export type ScenarioAction =
  | { type: "toggle"; dimension: Dimension; value: string }
  | { type: "setAssumption"; id: string; value: number }
  | { type: "pinBaseline" }
  | { type: "resetToBaseline" };

const FIELD: Record<Dimension, keyof Pick<Scenario, "geographies" | "segments" | "customerTypes">> = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
};

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function reducer(state: ScenarioState, action: ScenarioAction): ScenarioState {
  switch (action.type) {
    case "toggle": {
      const field = FIELD[action.dimension];
      return {
        ...state,
        current: {
          ...state.current,
          [field]: toggleValue(state.current[field], action.value),
        },
      };
    }
    case "setAssumption":
      return {
        ...state,
        current: {
          ...state.current,
          assumptions: { ...state.current.assumptions, [action.id]: action.value },
        },
      };
    case "pinBaseline":
      return {
        ...state,
        baseline: structuredClone(state.current),
      };
    case "resetToBaseline":
      return {
        ...state,
        current: structuredClone(state.baseline),
      };
    default:
      return state;
  }
}

function init(ledger: Ledger): ScenarioState {
  return {
    current: baselineScenario(ledger, { id: "current", label: "Current scenario" }),
    baseline: baselineScenario(ledger),
  };
}

export function useScenario(ledger: Ledger) {
  const [state, dispatch] = useReducer(reducer, ledger, init);
  return { state, dispatch };
}
