"use client";

import { motion } from "framer-motion";
import { DELTA_ORDER, type DeltaFactor, type DeltaResult } from "@/lib/compute";
import { formatEUR } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";

interface Props {
  deltaTam: DeltaResult;
  deltaYam: DeltaResult;
}

const FACTOR_LABELS: Record<DeltaFactor, string> = {
  geography: "Geography",
  segment: "Segment",
  customerType: "Customer Type",
  serviceable: "Serviceable %",
  obtainable: "Obtainable %",
};

function Headline({ label, total }: { label: string; total: number }) {
  const zero = Math.abs(total) < 1e-9;
  const tone = zero
    ? "text-ink-3"
    : total < 0
      ? "text-negative-ink"
      : "text-positive-ink";
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-3">{label}</div>
      <div className={`font-mono text-2xl tabular-nums ${tone}`}>
        {zero ? "—" : <AnimatedNumber value={total} format="eur" signed />}
      </div>
    </div>
  );
}

export default function DeltaPanel({ deltaTam, deltaYam }: Props) {
  const atBaseline = Math.abs(deltaTam.total) < 1e-9 && Math.abs(deltaYam.total) < 1e-9;

  // Diverging decomposition bars scaled to the largest single contribution.
  const maxAbs = Math.max(
    1e-9,
    ...DELTA_ORDER.map((f) => Math.abs(deltaTam.byFactor[f])),
  );

  return (
    <section className="card rounded-xl p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
        Δ vs baseline
      </h2>
      <p className="mt-0.5 text-xs text-ink-3">
        The delta is the product. A market size on its own is just a number.
      </p>

      <div className="mt-4 flex gap-8">
        <Headline label="ΔTAM" total={deltaTam.total} />
        <Headline label="ΔYAM" total={deltaYam.total} />
      </div>

      {atBaseline ? (
        <p className="mt-4 text-sm text-ink-3">
          Current scenario is the baseline — no delta to decompose.
        </p>
      ) : (
        <div className="mt-5">
          <div className="text-xs font-medium uppercase tracking-wide text-ink-2">
            ΔTAM decomposition <span className="text-ink-faint">(funnel order)</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {DELTA_ORDER.map((factor) => {
              const v = deltaTam.byFactor[factor];
              const widthPct = (Math.abs(v) / maxAbs) * 50; // ≤50% each side of center
              const negative = v < 0;
              const negligible = Math.abs(v) < 1e-9;
              return (
                <div key={factor} className="flex items-center gap-2 text-sm">
                  <div className="w-28 shrink-0 text-ink-2">
                    {FACTOR_LABELS[factor]}
                  </div>
                  <div className="relative h-3.5 flex-1">
                    {/* center line */}
                    <div className="absolute left-1/2 top-0 h-full w-px bg-ink/20" />
                    {!negligible ? (
                      <motion.div
                        className={`absolute top-0 h-full ${negative ? "rounded-l-sm bg-negative" : "rounded-r-sm bg-positive"}`}
                        initial={false}
                        animate={{
                          width: `${widthPct}%`,
                          [negative ? "right" : "left"]: "50%",
                        }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ) : null}
                  </div>
                  <div
                    className={`w-24 shrink-0 text-right font-mono tabular-nums ${negligible ? "text-ink-faint" : negative ? "text-negative-ink" : "text-positive-ink"}`}
                  >
                    {negligible ? "—" : <AnimatedNumber value={v} format="eur" signed />}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-ink-faint">
            Contributions sum exactly to ΔTAM <AnimatedNumber value={deltaTam.total} format="eur" signed />.
          </p>
        </div>
      )}
    </section>
  );
}
