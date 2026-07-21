"use client";

import { useEffect, useRef, useState } from "react";
import type { EgeriaArtifact } from "@/components/nextsteps/egeria/types";

const PHASES = [
  {
    label: "Reading the decision boundary",
    detail: "Classification judgment · CRA route · design-freeze clock",
    count: null,
  },
  {
    label: "Finding conformity-classification experience",
    detail: "Not regulatory commentary — prior assessment decisions",
    count: 184,
  },
  {
    label: "Intersecting connected industrial-power work",
    detail: "Rack power · remote management · secure-development files",
    count: 23,
  },
  {
    label: "Checking standards proximity and availability",
    detail: "JTC 13 context · advisory capacity before design freeze",
    count: 4,
  },
  {
    label: "Ranking evidence against the case",
    detail: "Comparing direct experience, product context and timing",
    count: 1,
  },
] as const;

export default function ExpertSearch({
  artifact,
  onComplete,
}: {
  artifact: EgeriaArtifact;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLast = phase === PHASES.length - 1;
    const delay = reducedMotion ? 180 : isLast ? 1100 : 850;
    const timer = window.setTimeout(() => {
      if (isLast) completeRef.current();
      else setPhase((current) => current + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const current = PHASES[phase];
  const progress = ((phase + 1) / PHASES.length) * 100;

  return (
    <div className="mx-auto max-w-4xl py-4 sm:py-10" aria-live="polite">
      <header className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-ink bg-ink text-lg font-semibold text-card">
          E
        </div>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-accent-ink">
          Egeria expert graph
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
          Searching for the right judgment
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-2">
          Matching the unresolved decision—not just its keywords—against {artifact.network.benchSize.toLocaleString("en-GB")}+ expert profiles.
        </p>
      </header>

      <div className="mt-10 grid border border-hairline lg:grid-cols-[minmax(0,1fr)_230px]">
        <section className="p-5 sm:p-7" aria-label="Search stages">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-ink">Match sequence</p>
            <p className="font-mono text-[10px] tabular-nums text-ink-3">{String(phase + 1).padStart(2, "0")} / 05</p>
          </div>
          <div className="mt-3 h-px bg-hairline">
            <div className="h-px bg-accent transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>

          <ol className="mt-6 space-y-0">
            {PHASES.map((item, index) => {
              const complete = index < phase;
              const active = index === phase;
              return (
                <li key={item.label} className={`grid grid-cols-[24px_1fr] gap-3 ${index === PHASES.length - 1 ? "" : "pb-5"}`}>
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-5 w-5 items-center justify-center border font-mono text-[9px] transition-colors ${
                        complete
                          ? "border-positive bg-positive text-card"
                          : active
                            ? "border-accent bg-accent-wash text-accent-ink"
                            : "border-hairline bg-card text-ink-faint"
                      }`}
                    >
                      {complete ? "✓" : index + 1}
                    </span>
                    {index < PHASES.length - 1 ? <span className="h-full w-px bg-hairline" /> : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className={`text-xs font-medium ${active ? "text-ink" : complete ? "text-ink-2" : "text-ink-faint"}`}>
                        {item.label}
                      </p>
                      {active ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-accent-ink">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                          Active
                        </span>
                      ) : null}
                    </div>
                    <p className={`mt-1 text-[11px] leading-4 ${active || complete ? "text-ink-3" : "text-ink-faint"}`}>
                      {item.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="border-t border-hairline bg-well p-6 lg:border-l lg:border-t-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Candidate set</p>
          <p className="mt-2 font-mono text-4xl tabular-nums text-ink">
            {current.count === null ? `${artifact.network.benchSize.toLocaleString("en-GB")}+` : current.count}
          </p>
          <p className="mt-1 text-[11px] text-ink-3">
            {phase === 0 ? "profiles in network" : phase === PHASES.length - 1 ? "strongest fit" : "profiles remain"}
          </p>

          <div className="mt-8 border-t border-hairline pt-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Currently evaluating</p>
            <p className="mt-2 text-xs font-medium leading-5 text-ink">{current.label}</p>
            <p className="mt-2 text-[11px] leading-5 text-ink-3">{current.detail}</p>
          </div>
        </aside>
      </div>

      <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.08em] text-ink-faint">
        Illustrative demo matching sequence · no live outreach has occurred
      </p>
    </div>
  );
}
