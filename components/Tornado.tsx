"use client";

import { motion } from "framer-motion";
import type { Confidence } from "@/lib/schema";
import type { Metric, SwingBar } from "@/lib/compute";
import AnimatedNumber from "@/components/AnimatedNumber";

interface Props {
  bars: SwingBar[];
  metric: Metric;
}

const CONFIDENCE: Record<Confidence, { bar: string; dot: string; label: string }> = {
  verified: { bar: "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]", dot: "bg-emerald-400", label: "Verified" },
  inferred: { bar: "bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.3)]", dot: "bg-amber-400", label: "Inferred" },
  unknown: { bar: "bg-gradient-to-r from-rose-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]", dot: "bg-rose-400", label: "Unknown" },
};

const METRIC_LABEL: Record<Metric, string> = { tam: "TAM", sam: "SAM", yam: "YAM" };

export default function Tornado({ bars, metric }: Props) {
  const maxMag = Math.max(...bars.map((b) => b.magnitude), 1e-9);
  const present = new Set(bars.map((b) => b.confidence));

  return (
    <section className="glass-panel rounded-xl p-5">
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
                <motion.div
                  className={`absolute top-0 h-full ${tone.bar} ${negative ? "rounded-l-sm" : "rounded-r-sm"}`}
                  initial={false}
                  animate={{
                    width: `${w}%`,
                    [negative ? "right" : "left"]: "50%",
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            };
            return (
              <div key={b.id} className="flex items-center gap-2 text-sm">
                <div className="w-32 shrink-0 truncate text-neutral-300" title={b.label}>
                  {b.label}
                </div>
                <div className="relative h-3.5 flex-1">
                  {/* center line */}
                  <div className="absolute left-1/2 top-0 h-full w-px bg-neutral-700" />
                  {seg(b.lowSwing)}
                  {seg(b.highSwing)}
                </div>
                <div className="w-20 shrink-0 text-right font-mono text-xs tabular-nums text-neutral-400">
                  ±<AnimatedNumber value={b.magnitude} format="eur" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3 border-t border-white/10 pt-2 text-[11px] text-neutral-500">
          {(["verified", "inferred", "unknown"] as Confidence[])
            .filter((c) => present.has(c))
            .map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${CONFIDENCE[c].dot} shadow-[0_0_8px_currentColor]`} />
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
