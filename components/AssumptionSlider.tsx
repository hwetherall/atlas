"use client";

import { formatPct } from "@/lib/format";

interface Props {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  band?: { low: number; high: number };
  hideLabel?: boolean;
  hideBand?: boolean;
  onChange: (value: number) => void;
}

/**
 * A single assumption lever (CLAUDE.md §3.3). Reused by ScenarioControls and,
 * inline (hideLabel/hideBand), by the Facts ledger — both write the same
 * scenario.assumptions state.
 */
export default function AssumptionSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  band,
  hideLabel,
  hideBand,
  onChange,
}: Props) {
  const valueText = formatPct(value, value < 0.1 ? 1 : 0);
  return (
    <div>
      {hideLabel ? (
        <div className="text-right">
          <span className="font-mono text-sm tabular-nums text-neutral-100">
            {valueText}
          </span>
        </div>
      ) : (
        <div className="flex items-baseline justify-between">
          <label htmlFor={`slider-${id}`} className="text-sm text-neutral-300">
            {label}
          </label>
          <span className="font-mono text-sm tabular-nums text-neutral-100">
            {valueText}
          </span>
        </div>
      )}
      <input
        id={`slider-${id}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={hideLabel ? label : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-sky-400"
      />
      {band && !hideBand ? (
        <p className="mt-0.5 text-[11px] text-neutral-500">
          plausible band {formatPct(band.low, band.low < 0.1 ? 1 : 0)}–
          {formatPct(band.high, band.high < 0.1 ? 1 : 0)}
        </p>
      ) : null}
    </div>
  );
}
