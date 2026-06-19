"use client";

import type { Confidence } from "@/lib/schema";
import type { Metric, SwingBar } from "@/lib/compute";
import { formatEUR } from "@/lib/format";

interface Props {
  bars: SwingBar[];
  metric: Metric;
}

// Confidence drives color: a high-swing, low-confidence node is the top risk
// and the top Value-of-Information target (CLAUDE.md §4.3).
const CONFIDENCE: Record<Confidence, { bar: string; dot: string; label: string }> = {
  verified: { bar: "fill-emerald-500/70", dot: "bg-emerald-400", label: "Verified" },
  inferred: { bar: "fill-amber-500/70", dot: "bg-amber-400", label: "Inferred" },
  unknown: { bar: "fill-rose-500/70", dot: "bg-rose-400", label: "Unknown" },
};

const METRIC_LABEL: Record<Metric, string> = { tam: "TAM", sam: "SAM", yam: "YAM" };

export default function Tornado({ bars, metric }: Props) {
  const maxMag = Math.max(...bars.map((b) => b.magnitude), 1e-9);
  const present = new Set(bars.map((b) => b.confidence));

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <details open>
        <summary className="cursor-pointer list-none">
          <span className="text-sm font-semibold text-neutral-200">
            Tornado — {METRIC_LABEL[metric]} sensitivity
          </span>
          <span className="ml-2 text-xs text-neutral-500">
            (value of information)
          </span>
        </summary>

        <div className="mt-3 space-y-1.5">
          {bars.map((b) => {
            const tone = CONFIDENCE[b.confidence];
            const seg = (swing: number) => {
              const w = (Math.abs(swing) / maxMag) * 50;
              const negative = swing < 0;
              return (
                <rect
                  x={negative ? 50 - w : 50}
                  y={0}
                  width={w}
                  height={14}
                  className={tone.bar}
                  rx={1}
                />
              );
            };
            return (
              <div key={b.id} className="flex items-center gap-2 text-sm">
                <div className="w-32 shrink-0 truncate text-neutral-300" title={b.label}>
                  {b.label}
                </div>
                <svg
                  viewBox="0 0 100 14"
                  preserveAspectRatio="none"
                  className="h-3.5 flex-1"
                  role="img"
                  aria-label={`${b.label}: swings ${formatEUR(b.lowSwing, { signed: true })} to ${formatEUR(b.highSwing, { signed: true })}`}
                >
                  <line x1={50} y1={0} x2={50} y2={14} className="stroke-neutral-700" strokeWidth={0.5} />
                  {seg(b.lowSwing)}
                  {seg(b.highSwing)}
                </svg>
                <div className="w-20 shrink-0 text-right font-mono text-xs tabular-nums text-neutral-400">
                  ±{formatEUR(b.magnitude)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3 border-t border-neutral-800 pt-2 text-[11px] text-neutral-500">
          {(["verified", "inferred", "unknown"] as Confidence[])
            .filter((c) => present.has(c))
            .map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${CONFIDENCE[c].dot}`} />
                {CONFIDENCE[c].label}
              </span>
            ))}
        </div>
        <p className="mt-1.5 text-[11px] text-neutral-600">
          v1 simplification: perturbing one share does not re-normalize the others.
        </p>
      </details>
    </section>
  );
}
