"use client";

import { motion } from "framer-motion";
import type { EvalResult, Metric } from "@/lib/compute";
import { formatEUR } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";

interface Props {
  current: EvalResult;
  baseline: EvalResult;
}

const TIERS: { metric: Metric; label: string; sub: string; color: string; glow: string }[] = [
  { metric: "tam", label: "TAM", sub: "Total addressable", color: "bg-gradient-to-r from-sky-400 to-blue-600", glow: "shadow-[0_0_15px_rgba(56,189,248,0.4)]" },
  { metric: "sam", label: "SAM", sub: "Serviceable", color: "bg-gradient-to-r from-sky-300 to-indigo-500", glow: "shadow-[0_0_15px_rgba(125,211,252,0.4)]" },
  { metric: "yam", label: "YAM", sub: "Year-1 addressable", color: "bg-gradient-to-r from-emerald-400 to-teal-600", glow: "shadow-[0_0_15px_rgba(52,211,153,0.4)]" },
];

function Tier({
  label,
  sub,
  color,
  glow,
  value,
  baselineValue,
  scale,
}: {
  label: string;
  sub: string;
  color: string;
  glow: string;
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
          <AnimatedNumber
            value={value}
            format="eur"
            className="font-mono text-lg tabular-nums bg-gradient-to-br from-white to-neutral-300 bg-clip-text text-transparent"
          />
          {changed ? (
            <div className="font-mono text-[11px] tabular-nums text-neutral-500">
              baseline {formatEUR(baselineValue)}
            </div>
          ) : null}
        </div>
      </div>
      {/* Centered bars give the funnel silhouette; ghost = baseline reference. */}
      <div className="relative mt-1.5 flex h-3 items-center justify-center">
        <motion.div
          className="absolute rounded-sm border border-neutral-700/50 bg-neutral-800/20"
          initial={false}
          animate={{ width: `${basePct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%" }}
          aria-hidden
        />
        <motion.div
          className={`absolute rounded-sm ${color} ${glow}`}
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
    <section className="glass-panel rounded-xl p-5">
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
            glow={t.glow}
            value={current[t.metric]}
            baselineValue={baseline[t.metric]}
            scale={ref}
          />
        ))}
      </div>
    </section>
  );
}
