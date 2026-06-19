import { OBTAINABLE_ID, SERVICEABLE_ID } from "@/lib/compute";

// UI bounds for the assumption sliders (plan §EPIC-002 / STORY-013).
// Shared by ScenarioControls and the inline sliders in the Facts ledger so
// both lever surfaces behave identically.
export interface SliderBounds {
  min: number;
  max: number;
  step: number;
}

export const ASSUMPTION_BOUNDS: Record<string, SliderBounds> = {
  [SERVICEABLE_ID]: { min: 0, max: 1, step: 0.01 },
  [OBTAINABLE_ID]: { min: 0, max: 0.2, step: 0.005 },
};

export const DEFAULT_BOUNDS: SliderBounds = { min: 0, max: 1, step: 0.01 };

export function boundsFor(id: string): SliderBounds {
  return ASSUMPTION_BOUNDS[id] ?? DEFAULT_BOUNDS;
}
