"use client";

import { motion } from "framer-motion";
import type { EvalResult, Metric } from "@/lib/compute";
import { formatEUR } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";

interface Props {
  current: EvalResult;
  baseline: EvalResult;
}

// One-hue ordinal ramp, light → dark: the distillation from TAM to YAM.
const TIERS: { metric: Metric; label: string; sub: string; color: string }[] = [
  { metric: "tam", label: "TAM", sub: "Total addressable", color: "bg-funnel-tam" },
  { metric: "sam", label: "SAM", sub: "Serviceable", color: "bg-funnel-sam" },
  { metric: "yam", label: "YAM", sub: "Year-1 addressable", color: "bg-funnel-yam" },
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
          <span className="text-sm font-semibold text-ink">{label}</span>
          <span className="ml-2 text-xs text-ink-3">{sub}</span>
        </div>
        <div className="text-right">
          <AnimatedNumber
            value={value}
            format="eur"
            className="font-mono text-xl tabular-nums text-ink"
          />
          {changed ? (
            <div className="font-mono text-[11px] tabular-nums text-ink-3">
              baseline {formatEUR(baselineValue)}
            </div>
          ) : null}
        </div>
      </div>
      {/* Centered bars give the funnel silhouette; ghost = baseline reference. */}
      <div className="relative mt-1.5 flex h-3 items-center justify-center">
        <motion.div
          className="absolute rounded-sm border border-ink/15 bg-ink/[0.03]"
          initial={false}
          animate={{ width: `${basePct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%" }}
          aria-hidden
        />
        <motion.div
          className={`absolute rounded-sm ${color}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%" }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function FunnelOutputs({ current, baseline }: Props) {
  const ref = Math.max(baseline.tam, current.tam, 1);

  return (
    <section className="card rounded-xl p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
        Market funnel
      </h2>
      <p className="mt-0.5 text-xs text-ink-3">
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
