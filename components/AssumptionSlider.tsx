"use client";

import { formatPct } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";

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
  hideValue?: boolean; // track only — host renders the number itself
  onChange: (value: number) => void;
}

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
  hideValue,
  onChange,
}: Props) {
  const dp = value < 0.1 ? 1 : 0;
  return (
    <div>
      {hideValue ? null : hideLabel ? (
        <div className="text-right">
          <AnimatedNumber
            value={value}
            format="pct"
            dp={dp}
            className="font-mono text-sm tabular-nums text-ink"
          />
        </div>
      ) : (
        <div className="flex items-baseline justify-between">
          <label htmlFor={`slider-${id}`} className="text-sm text-ink-2">
            {label}
          </label>
          <AnimatedNumber
            value={value}
            format="pct"
            dp={dp}
            className="font-mono text-sm tabular-nums text-ink"
          />
        </div>
      )}
      <div className="relative mt-2 flex items-center">
        {/* Track background */}
        <div className="absolute h-1.5 w-full rounded-full bg-ink/10" />
        {/* Active track */}
        <div
          className="absolute h-1.5 rounded-full bg-accent"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        {/* Invisible native range input for interaction */}
        <input
          id={`slider-${id}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={hideLabel ? label : undefined}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 h-5 w-full cursor-pointer opacity-0"
        />
        {/* Custom thumb */}
        <div 
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border border-hairline-strong bg-card shadow-[0_1px_3px_rgba(22,35,59,0.25)]"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      {band && !hideBand ? (
        <p className="mt-1 text-[11px] text-ink-3">
          plausible band {formatPct(band.low, band.low < 0.1 ? 1 : 0)}–
          {formatPct(band.high, band.high < 0.1 ? 1 : 0)}
        </p>
      ) : null}
    </div>
  );
}
