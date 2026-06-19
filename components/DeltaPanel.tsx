"use client";

import { DELTA_ORDER, type DeltaFactor, type DeltaResult } from "@/lib/compute";
import { formatEUR } from "@/lib/format";

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
    ? "text-neutral-400"
    : total < 0
      ? "text-rose-400"
      : "text-emerald-400";
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`font-mono text-2xl tabular-nums ${tone}`}>
        {zero ? "—" : formatEUR(total, { signed: true })}
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
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <h2 className="text-sm font-semibold text-neutral-200">Δ vs baseline</h2>
      <p className="mt-0.5 text-xs text-neutral-500">
        The delta is the product. A market size on its own is just a number.
      </p>

      <div className="mt-4 flex gap-8">
        <Headline label="ΔTAM" total={deltaTam.total} />
        <Headline label="ΔYAM" total={deltaYam.total} />
      </div>

      {atBaseline ? (
        <p className="mt-4 text-sm text-neutral-500">
          Current scenario is the baseline — no delta to decompose.
        </p>
      ) : (
        <div className="mt-5">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            ΔTAM decomposition <span className="text-neutral-600">(funnel order)</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {DELTA_ORDER.map((factor) => {
              const v = deltaTam.byFactor[factor];
              const widthPct = (Math.abs(v) / maxAbs) * 50; // ≤50% each side of center
              const negative = v < 0;
              const negligible = Math.abs(v) < 1e-9;
              return (
                <div key={factor} className="flex items-center gap-2 text-sm">
                  <div className="w-28 shrink-0 text-neutral-400">
                    {FACTOR_LABELS[factor]}
                  </div>
                  <div className="relative h-3.5 flex-1">
                    {/* center line */}
                    <div className="absolute left-1/2 top-0 h-full w-px bg-neutral-700" />
                    {!negligible ? (
                      <div
                        className={`absolute top-0 h-full ${negative ? "rounded-l-sm bg-rose-500/70" : "rounded-r-sm bg-emerald-500/70"}`}
                        style={{
                          width: `${widthPct}%`,
                          [negative ? "right" : "left"]: "50%",
                        }}
                      />
                    ) : null}
                  </div>
                  <div
                    className={`w-24 shrink-0 text-right font-mono tabular-nums ${negligible ? "text-neutral-600" : negative ? "text-rose-300" : "text-emerald-300"}`}
                  >
                    {negligible ? "—" : formatEUR(v, { signed: true })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-neutral-600">
            Contributions sum exactly to ΔTAM {formatEUR(deltaTam.total, { signed: true })}.
          </p>
        </div>
      )}
    </section>
  );
}
