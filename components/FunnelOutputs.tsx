"use client";

import type { EvalResult, Metric } from "@/lib/compute";
import { formatEUR } from "@/lib/format";

interface Props {
  current: EvalResult;
  baseline: EvalResult;
}

const TIERS: { metric: Metric; label: string; sub: string; color: string }[] = [
  { metric: "tam", label: "TAM", sub: "Total addressable", color: "bg-sky-500" },
  { metric: "sam", label: "SAM", sub: "Serviceable", color: "bg-sky-400" },
  { metric: "yam", label: "YAM", sub: "Year-1 addressable", color: "bg-emerald-400" },
];

function Tier({
  label,
  sub,
  color,
  value,
  baselineValue,
  scale,
}: {
  label: string;
  sub: string;
  color: string;
  value: number;
  baselineValue: number;
  scale: number;
}) {
  const pct = scale > 0 ? Math.max(0, (value / scale) * 100) : 0;
  const basePct = scale > 0 ? Math.max(0, (baselineValue / scale) * 100) : 0;
  const changed = Math.abs(value - baselineValue) > 1e-9;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-sm font-semibold text-neutral-100">{label}</span>
          <span className="ml-2 text-xs text-neutral-500">{sub}</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg tabular-nums text-neutral-50">
            {formatEUR(value)}
          </div>
          {changed ? (
            <div className="font-mono text-[11px] tabular-nums text-neutral-500">
              baseline {formatEUR(baselineValue)}
            </div>
          ) : null}
        </div>
      </div>
      {/* Centered bars give the funnel silhouette; ghost = baseline reference. */}
      <div className="relative mt-1.5 flex h-3 items-center justify-center">
        <div
          className="absolute rounded-sm border border-neutral-700"
          style={{ width: `${basePct}%`, height: "100%" }}
          aria-hidden
        />
        <div
          className={`absolute rounded-sm ${color}`}
          style={{ width: `${pct}%`, height: "100%" }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function FunnelOutputs({ current, baseline }: Props) {
  const ref = Math.max(baseline.tam, current.tam, 1);

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <h2 className="text-sm font-semibold text-neutral-200">Market funnel</h2>
      <p className="mt-0.5 text-xs text-neutral-500">
        Current scenario vs pinned baseline. Every number is derived live.
      </p>
      <div className="mt-4 space-y-4">
        {TIERS.map((t) => (
          <Tier
            key={t.metric}
            label={t.label}
            sub={t.sub}
            color={t.color}
            value={current[t.metric]}
            baselineValue={baseline[t.metric]}
            scale={ref}
          />
        ))}
      </div>
    </section>
  );
}
