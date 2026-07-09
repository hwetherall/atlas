"use client";

import type { Dimension } from "@/lib/schema";
import { DIMENSION_LABELS, DIMENSION_VALUES } from "@/lib/dimensions";

// Toggle-chip group for one lever dimension. Every selected chip carries its
// own pill (static — an earlier shared-layoutId slide rendered the pill on
// only the last-toggled chip). Shared by the dashboard's ScenarioControls
// (block layout) and the Fact Bank's EquationStrip (compact, label-less).
interface Props {
  dimension: Dimension;
  selected: string[];
  onToggle: (value: string) => void;
  compact?: boolean;
  showLabel?: boolean;
}

export default function FilterGroup({
  dimension,
  selected,
  onToggle,
  compact = false,
  showLabel = true,
}: Props) {
  const selectedSet = new Set(selected);

  const chips = DIMENSION_VALUES[dimension].map(({ value, label }) => {
    const on = selectedSet.has(value);
    return (
      <button
        key={value}
        type="button"
        role="checkbox"
        aria-checked={on}
        onClick={() => onToggle(value)}
        className={`rounded-md border transition-colors ${
          compact ? "px-1.5 py-0.5 text-[11px]" : "px-3 py-1.5 text-sm"
        } ${
          on
            ? "border-accent/30 bg-accent-wash text-accent-ink"
            : "border-transparent text-ink-3 hover:border-hairline hover:text-ink"
        }`}
      >
        {label}
      </button>
    );
  });

  if (compact) {
    return (
      <div
        role="group"
        aria-label={DIMENSION_LABELS[dimension]}
        className="flex flex-wrap items-center gap-1 gap-y-0.5"
      >
        {showLabel ? (
          <span className="mr-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-faint">
            {DIMENSION_LABELS[dimension]}
          </span>
        ) : null}
        {chips}
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-wide text-ink-3">
        {DIMENSION_LABELS[dimension]}
      </legend>
      <div className="mt-2 flex flex-wrap gap-1.5">{chips}</div>
    </fieldset>
  );
}
