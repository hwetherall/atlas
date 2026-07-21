"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Ledger } from "@/lib/schema";
import type { EgeriaArtifact } from "@/components/nextsteps/egeria/types";

export default function SessionBrief({
  artifact,
  ledger,
  onBack,
  onContinue,
}: {
  artifact: EgeriaArtifact;
  ledger: Ledger;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [active, setActive] = useState(0);
  const nodes = useMemo(() => new Map(ledger.map((node) => [node.id, node.label])), [ledger]);
  const linkedNodeCount = new Set(artifact.agenda.map((item) => item.nodeId)).size;
  const selected = artifact.agenda[active];

  return (
    <div>
      <section className="overflow-hidden border-y border-hairline">
        <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex items-center gap-3 border-b border-hairline bg-well p-4 md:border-b-0 md:border-r">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden">
              <Image
                src={artifact.profile.portrait}
                alt=""
                fill
                sizes="64px"
                className="object-cover object-[50%_28%]"
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-positive-ink">
                Match accepted
              </p>
              <p className="mt-1 font-display text-base font-medium text-ink">{artifact.profile.name}</p>
              <p className="mt-0.5 text-[10px] text-ink-3">{artifact.profile.location}</p>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
                  Session brief · generated from the risk graph
                </p>
                <h2 className="mt-1 font-display text-2xl text-ink">Five questions. Two model nodes. One decision.</h2>
              </div>
              <p className="border-l border-hairline pl-3 font-mono text-[10px] text-ink-3">
                {artifact.agenda.length} questions · {linkedNodeCount} linked nodes
              </p>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-ink-2">
              Egeria turns the model&rsquo;s open assumptions into a prepared advisory agenda, so the hour is spent deciding—not explaining the market from scratch.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section aria-label="Prepared questions" className="divide-y divide-hairline border-y border-hairline">
          {artifact.agenda.map((item, index) => (
            <button
              key={item.question}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className={`flex w-full items-start gap-3 border-l-2 p-3.5 text-left transition-colors ${
                active === index
                  ? "border-accent bg-accent-wash"
                  : "border-transparent bg-card hover:bg-well"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[11px] ${
                  active === index ? "border-accent bg-accent text-card" : "border-hairline-strong bg-card text-ink-3"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium leading-relaxed text-ink">{item.question}</span>
                <span className="mt-1.5 inline-flex border-l border-hairline-strong pl-1.5 font-mono text-[9px] text-ink-3">
                  {nodes.get(item.nodeId) ?? item.nodeId}
                </span>
              </span>
              <span aria-hidden className={active === index ? "text-accent-ink" : "text-ink-faint"}>→</span>
            </button>
          ))}
        </section>

        <aside className="h-fit border-l-2 border-accent bg-well p-5 lg:sticky lg:top-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
            Question {active + 1} · model connection
          </p>
          <p className="mt-3 font-display text-xl leading-snug text-ink">{selected.question}</p>

          <div className="mt-5 border-y border-hairline bg-card px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              Settles this node
            </p>
            <p className="mt-1 text-sm font-medium text-ink">{nodes.get(selected.nodeId) ?? selected.nodeId}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              What the answer changes
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">{selected.moves}</p>
          </div>

          <div className="mt-5 border-t border-hairline pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              Comes back to Atlas
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{artifact.deliverable}</p>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <button type="button" onClick={onBack} className="text-xs font-medium text-ink-3 hover:text-ink">
          ← Back to expert match
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="bg-accent px-5 py-2.5 text-sm font-semibold text-card transition-colors hover:bg-accent-ink"
        >
          Continue to booking →
        </button>
      </div>
    </div>
  );
}
