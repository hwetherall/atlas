"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Ledger } from "@/lib/schema";
import { SEGMENTS } from "@/lib/dimensions";
import { formatPct } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";

interface Props {
  ledger: Ledger;
}

const SEG_COLORS = [
  "bg-gradient-to-r from-sky-400 to-sky-500",
  "bg-gradient-to-r from-sky-300 to-sky-400",
  "bg-gradient-to-r from-emerald-400 to-emerald-500",
  "bg-gradient-to-r from-amber-400 to-amber-500",
  "bg-gradient-to-r from-violet-400 to-violet-500",
];

export default function ShapeStrip({ ledger }: Props) {
  const { cagr, cr3, segShares } = useMemo(() => {
    const byId = new Map(ledger.map((n) => [n.id, n]));
    const segShares = SEGMENTS.map((s, i) => {
      const node = ledger.find(
        (n) => n.dimension === "segment" && n.dimensionValue === s.value,
      );
      return { label: s.label, value: node?.value ?? 0, color: SEG_COLORS[i % SEG_COLORS.length] };
    });
    return {
      cagr: byId.get("shape.cagr")?.value ?? 0,
      cr3: byId.get("shape.cr3")?.value ?? 0,
      segShares,
    };
  }, [ledger]);

  return (
    <section className="glass-panel rounded-xl p-5">
      <h2 className="text-sm font-semibold text-neutral-200">Market shape</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">CAGR</div>
          <div className="font-mono text-xl tabular-nums text-neutral-50">
            <AnimatedNumber value={cagr} format="pct" />
          </div>
          <div className="text-[11px] text-neutral-600">2025–2030</div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Top-3 concentration
          </div>
          <div className="font-mono text-xl tabular-nums text-neutral-50">
            <AnimatedNumber value={cr3} format="pct" />
          </div>
          <div className="text-[11px] text-neutral-600">consumed from VentureX</div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Segmentation
          </div>
          <div className="mt-1.5 flex h-3 w-full overflow-hidden rounded-sm bg-white/5 shadow-inner">
            {segShares.map((s) => (
              <motion.div
                key={s.label}
                className={s.color}
                initial={false}
                animate={{ width: `${s.value * 100}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                title={`${s.label} ${formatPct(s.value)}`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-500">
            {segShares.map((s) => (
              <span key={s.label} className="flex items-center gap-1">
                <span className={`inline-block h-2 w-2 rounded-sm ${s.color}`} />
                {s.label} <AnimatedNumber value={s.value} format="pct" className="ml-0.5" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
