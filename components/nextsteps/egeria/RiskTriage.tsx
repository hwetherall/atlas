"use client";

import { useState } from "react";
import { formatEUR, formatPct } from "@/lib/format";
import type { EgeriaArtifact } from "@/components/nextsteps/egeria/types";

interface Props {
  artifact: EgeriaArtifact;
  riskTitle: string;
  riskSummary: string;
  severity: number;
  likelihood: number;
  impact: number;
  deadline: string;
  onSearch: () => void;
}

export default function RiskTriage({
  artifact,
  riskTitle,
  riskSummary,
  severity,
  likelihood,
  impact,
  deadline,
  onSearch,
}: Props) {
  const [selected, setSelected] = useState(false);
  const { caseSummary, network } = artifact;

  return (
    <div>
      <header className="max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
          Research handoff
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Research is complete. One judgment remains.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-2">
          Innovera has exhausted the questions that public sources can answer. Select the unresolved risk to see why the system recommends expert judgment instead of another research pass.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="research-boundary-title">
        <div className="flex items-end justify-between gap-4 border-b border-hairline pb-2">
          <div>
            <p id="research-boundary-title" className="text-xs font-semibold text-ink">
              Risks at the research boundary
            </p>
            <p className="mt-0.5 text-[11px] text-ink-3">1 requires practitioner judgment</p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-positive-ink">
            Web research exhausted
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelected((value) => !value)}
          aria-expanded={selected}
          className={`group w-full border-b px-1 py-4 text-left transition-colors ${
            selected ? "border-accent bg-accent-wash/60" : "border-hairline hover:bg-well/70"
          }`}
        >
          <span className="flex items-start gap-4 px-3">
            <span
              aria-hidden
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-[10px] ${
                selected
                  ? "border-accent bg-accent text-card"
                  : "border-hairline-strong bg-card text-ink-faint group-hover:border-accent"
              }`}
            >
              {selected ? "✓" : "1"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-semibold text-ink">{riskTitle}</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-warning-ink">
                  Human judgment required
                </span>
              </span>
              <span className="mt-1 block max-w-3xl text-xs leading-5 text-ink-3">{riskSummary}</span>
            </span>
            <span className="hidden shrink-0 text-right sm:block">
              <span className="block font-mono text-xs tabular-nums text-negative-ink">{formatEUR(severity)}</span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[0.08em] text-ink-faint">expected loss</span>
            </span>
            <span aria-hidden className={`mt-1 text-ink-faint transition-transform ${selected ? "rotate-90" : ""}`}>
              →
            </span>
          </span>
        </button>
      </section>

      {!selected ? (
        <div className="mt-12 border border-dashed border-hairline-strong px-6 py-10 text-center">
          <p className="text-sm font-medium text-ink-2">Select the risk to inspect the decision boundary</p>
          <p className="mt-1 text-xs text-ink-3">The recommendation and next action will appear here.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-label="Research boundary analysis">
            <div className="grid gap-0 border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-hairline">
              <BoundaryColumn number="01" label="Research established" body={caseSummary.known} />
              <BoundaryColumn number="02" label="Research cannot decide" body={caseSummary.unknown} emphasis />
              <BoundaryColumn number="03" label="Cost of guessing" body={caseSummary.consequence} />
            </div>

            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              <Metric label="Likelihood" value={formatPct(likelihood)} />
              <Metric label="Revenue if it hits" value={formatEUR(impact, { signed: true })} negative />
              <Metric label="Decision clock" value={deadline} />
            </dl>
          </section>

          <aside className="border-l-2 border-accent bg-well px-5 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-ink">
              Innovera recommendation
            </p>
            <h2 className="mt-2 font-display text-2xl leading-tight text-ink">
              Speak to someone who has made this classification before.
            </h2>
            <p className="mt-3 text-xs leading-5 text-ink-2">
              This is not a missing-facts problem. It is a product-specific conformity judgment. Egeria can search {network.benchSize.toLocaleString("en-GB")}+ expert profiles against the decision, product context and clock.
            </p>
            <ul className="mt-5 space-y-2 border-t border-hairline pt-4 text-[11px] text-ink-2">
              <li>✓ Classification experience, not regulatory commentary</li>
              <li>✓ Connected industrial-power context</li>
              <li>✓ Availability before the design freeze</li>
            </ul>
            <button
              type="button"
              onClick={onSearch}
              className="mt-5 w-full bg-ink px-4 py-3 text-sm font-semibold text-card transition-colors hover:bg-accent-ink"
            >
              Search the expert network →
            </button>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.08em] text-ink-faint">
              No outreach until you approve a match
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

function BoundaryColumn({
  number,
  label,
  body,
  emphasis = false,
}: {
  number: string;
  label: string;
  body: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`py-5 sm:px-5 sm:first:pl-0 ${emphasis ? "bg-warning-wash/55" : ""}`}>
      <p className="font-mono text-[9px] text-ink-faint">{number}</p>
      <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] ${emphasis ? "text-warning-ink" : "text-ink-3"}`}>
        {label}
      </p>
      <p className="mt-2 text-xs leading-5 text-ink-2">{body}</p>
    </div>
  );
}

function Metric({ label, value, negative = false }: { label: string; value: string; negative?: boolean }) {
  return (
    <div>
      <dt className="text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{label}</dt>
      <dd className={`mt-1 text-xs leading-5 ${negative ? "font-mono text-negative-ink" : "text-ink-2"}`}>{value}</dd>
    </div>
  );
}
