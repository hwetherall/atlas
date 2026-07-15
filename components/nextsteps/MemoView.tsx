"use client";

import type { Ledger } from "@/lib/schema";
import type { ScenarioState } from "@/lib/useScenario";
import { RESPONSE_LABEL } from "@/lib/toolkit";
import { formatEUR, formatPct } from "@/lib/format";
import ThreadBadge from "@/components/ThreadBadge";
import { ArtifactBlock, ModelAfter, SectionKicker, LabeledLine } from "@/components/nextsteps/Artifacts";
import type { MemoRow } from "@/components/nextsteps/types";

// ─────────────────────────────────────────────────────────────────────────────
// MemoView — views 1–5: one board-grade memo. Same seven-section skeleton on
// every memo so executives learn it once (nextsteps.md §3); stakes read as
// three plain beats — what the model assumes, what the world does instead,
// what that costs this year — beside the computed panel and one clock row.
// ─────────────────────────────────────────────────────────────────────────────

export default function MemoView({
  row,
  index,
  count,
  ledger,
  state,
  totalExposure,
}: {
  row: MemoRow;
  index: number;
  count: number;
  ledger: Ledger;
  state: ScenarioState;
  totalExposure: number;
}) {
  const { memo, rr, tool, retired } = row;
  const share = totalExposure > 0 ? rr.severity / totalExposure : 0;

  return (
    <article>
      <header className="mt-8 border-b border-hairline pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
          Memo {index} of {count} · {RESPONSE_LABEL[memo.response]} · executes with {tool.name}
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
          {memo.headline}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2">
          {rr.risk.title}
          <ThreadBadge riskId={memo.riskId} />
          <span className="font-mono text-xs tabular-nums text-ink-3">
            {formatEUR(rr.severity)} expected Year-1 loss · {formatPct(share)} of the remaining
            register
          </span>
        </p>
      </header>

      {/* The stakes — three beats + the computed panel + one clock. */}
      <section className="mt-8">
        <SectionKicker>The stakes</SectionKicker>
        <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] lg:gap-6">
          <div className="space-y-3">
            <StakesBeat label="What the model assumes">{memo.stakes.assumption}</StakesBeat>
            <StakesBeat label="What the world does instead">{memo.stakes.reality}</StakesBeat>
            <StakesBeat label="What that costs this year">{memo.stakes.consequence}</StakesBeat>
          </div>
          <div className="mt-4 space-y-3 lg:mt-0">
            <div className="rounded-lg border border-hairline bg-well p-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  Expected Year-1 loss
                </span>
                <span className="font-mono text-sm tabular-nums text-ink">
                  {formatEUR(rr.severity)}
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  Year-1 revenue if it hits
                </span>
                <span
                  className={`font-mono text-sm tabular-nums ${
                    rr.impact.dYam < 0 ? "text-negative-ink" : "text-positive-ink"
                  }`}
                >
                  {formatEUR(rr.impact.dYam, { signed: true })}
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  Chance it&rsquo;s real
                </span>
                <span className="font-mono text-sm tabular-nums text-ink-2">
                  {formatPct(rr.risk.likelihood.value)}
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-hairline bg-card p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                The clock
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-2">
                <span className="text-ink">When it starts costing us:</span>{" "}
                {memo.stakes.clock.whenItBites}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                <span className="text-ink">Why decide now:</span> {memo.stakes.clock.whyNow}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The decision */}
      <section className="mt-8 border-t border-hairline pt-6">
        <SectionKicker>The decision</SectionKicker>
        <p className="mt-3 max-w-3xl font-display text-xl leading-snug text-ink">
          {memo.decision.question}
        </p>
        <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <LabeledLine label="Deadline">{memo.decision.deadline}</LabeledLine>
          <LabeledLine label="If you decide nothing">{memo.decision.defaultPath}</LabeledLine>
        </div>
      </section>

      {/* Why this response */}
      <section className="mt-8 border-t border-hairline pt-6">
        <div className="flex items-baseline gap-3">
          <SectionKicker>Why this response</SectionKicker>
          <p className="hidden text-xs text-ink-3 sm:block">
            All five responses, scored against this risk — the chosen one has to win on the page.
          </p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {memo.rationale.map((cell) => (
            <div
              key={cell.response}
              className={`rounded-lg border p-3 ${
                cell.verdict === "chosen"
                  ? "border-accent/40 bg-accent-wash"
                  : "border-hairline bg-card"
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${
                  cell.verdict === "chosen" ? "text-accent-ink" : "text-ink-faint"
                }`}
              >
                {cell.verdict === "chosen" ? "✓ " : ""}
                {RESPONSE_LABEL[cell.response]}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{cell.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The artifact */}
      <section className="mt-8 border-t border-hairline pt-6">
        <div className="flex items-baseline gap-3">
          <SectionKicker>The plan — {tool.name}&rsquo;s deliverable</SectionKicker>
        </div>
        <div className="mt-3">
          <ArtifactBlock memo={memo} ledger={ledger} />
        </div>
      </section>

      {/* The model after */}
      <section className="mt-8 border-t border-hairline pt-6">
        <div className="flex items-baseline gap-3">
          <SectionKicker>The model after</SectionKicker>
          <p className="hidden text-xs text-ink-3 sm:block">
            What executing does to the model — computed, never asserted.
          </p>
        </div>
        <ModelAfter
          memo={memo}
          ledger={ledger}
          state={state}
          retired={retired}
          likelihoodBefore={rr.risk.likelihood.value}
        />
      </section>

      {/* The tool rail */}
      <section className="mt-8 border-t border-hairline pt-6">
        <div className="card flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl px-4 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Executes with
          </span>
          <span className="font-display text-sm font-medium text-ink">{tool.name}</span>
          <span className="text-xs text-ink-3">{tool.epithet} —</span>
          <span className="text-xs text-ink-2">{tool.does}</span>
        </div>
      </section>

      {/* Evidence */}
      {memo.evidence.length > 0 ? (
        <section className="mt-8 border-t border-hairline pt-6">
          <SectionKicker>Evidence</SectionKicker>
          <ul className="mt-3 space-y-2">
            {memo.evidence.map((e) => (
              <li key={e.url} className="border-l-2 border-hairline pl-2 text-[11px] leading-relaxed text-ink-3">
                “{e.excerpt}”{" "}
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap text-accent-ink hover:underline"
                >
                  — {e.publisher ?? e.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function StakesBeat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}
