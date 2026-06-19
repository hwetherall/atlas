"use client";

import { useMemo } from "react";
import type { Ledger } from "@/lib/schema";
import { SEGMENTS } from "@/lib/dimensions";
import { formatPct } from "@/lib/format";

interface Props {
  ledger: Ledger;
}

const SEG_COLORS = [
  "bg-sky-500",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-violet-400",
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
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <h2 className="text-sm font-semibold text-neutral-200">Market shape</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">CAGR</div>
          <div className="font-mono text-xl tabular-nums text-neutral-50">
            {formatPct(cagr)}
          </div>
          <div className="text-[11px] text-neutral-600">2025–2030</div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Top-3 concentration
          </div>
          <div className="font-mono text-xl tabular-nums text-neutral-50">
            {formatPct(cr3)}
          </div>
          <div className="text-[11px] text-neutral-600">consumed from VentureX</div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Segmentation
          </div>
          <div className="mt-1.5 flex h-3 w-full overflow-hidden rounded-sm">
            {segShares.map((s) => (
              <div
                key={s.label}
                className={s.color}
                style={{ width: `${s.value * 100}%` }}
                title={`${s.label} ${formatPct(s.value)}`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-500">
            {segShares.map((s) => (
              <span key={s.label} className="flex items-center gap-1">
                <span className={`inline-block h-2 w-2 rounded-sm ${s.color}`} />
                {s.label} {formatPct(s.value)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
