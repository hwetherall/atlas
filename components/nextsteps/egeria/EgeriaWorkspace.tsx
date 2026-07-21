"use client";

import { useState } from "react";
import type { Ledger } from "@/lib/schema";
import { RESPONSE_LABEL } from "@/lib/toolkit";
import { formatEUR, formatPct } from "@/lib/format";
import type { MemoRow } from "@/components/nextsteps/types";
import RiskTriage from "@/components/nextsteps/egeria/RiskTriage";
import ExpertSearch from "@/components/nextsteps/egeria/ExpertSearch";
import ExpertMatch from "@/components/nextsteps/egeria/ExpertMatch";
import SessionBrief from "@/components/nextsteps/egeria/SessionBrief";
import BookingPanel from "@/components/nextsteps/egeria/BookingPanel";
import type { EgeriaNavStep, EgeriaStep } from "@/components/nextsteps/egeria/types";

const NAV_STEPS: EgeriaNavStep[] = ["risk", "match", "brief", "book"];

export default function EgeriaWorkspace({
  row,
  ledger,
  totalExposure,
  onBackToCampaign,
}: {
  row: MemoRow;
  ledger: Ledger;
  totalExposure: number;
  onBackToCampaign: () => void;
}) {
  const [step, setStep] = useState<EgeriaStep>("risk");
  const [highestStep, setHighestStep] = useState(0);
  const { memo, rr, retired } = row;

  if (memo.artifact.kind !== "egeria") return null;

  const artifact = memo.artifact;
  const share = totalExposure > 0 ? rr.severity / totalExposure : 0;

  const unlock = (target: EgeriaNavStep) => {
    const index = NAV_STEPS.indexOf(target);
    setHighestStep((current) => Math.max(current, index));
    setStep(target);
  };

  const navigate = (target: EgeriaNavStep) => {
    if (NAV_STEPS.indexOf(target) <= highestStep) setStep(target);
  };

  return (
    <article className="mt-6 overflow-hidden border border-hairline-strong bg-card shadow-card">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b border-hairline bg-card px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCampaign}
            aria-label="Back to the campaign"
            className="flex h-8 w-8 items-center justify-center border border-hairline text-sm text-ink-3 transition-colors hover:border-hairline-strong hover:text-ink"
          >
            ←
          </button>
          <span className="flex h-8 w-8 items-center justify-center bg-ink font-display text-sm text-card">E</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-ink">Egeria</p>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-ink">Expert network</span>
            </div>
            <p className="text-[10px] text-ink-3">Decision workspace · CRA conformity route</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint sm:block">Case EG-CRA-014</p>
          <span className="h-4 w-px bg-hairline" aria-hidden />
          <p className="flex items-center gap-1.5 text-[10px] text-positive-ink">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-positive" />
            Workspace active
          </p>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)]">
        <JourneyRail step={step} highestStep={highestStep} onStep={navigate} />

        <main className="min-w-0 px-5 py-7 sm:px-8 sm:py-10 lg:min-h-[720px] lg:px-10">
        {step === "risk" ? (
          <RiskTriage
            artifact={artifact}
            riskTitle={rr.risk.title}
            riskSummary={memo.tableLine}
            severity={rr.severity}
            likelihood={rr.risk.likelihood.value}
            impact={rr.impact.dYam}
            deadline={memo.decision.deadline}
            onSearch={() => setStep("search")}
          />
        ) : null}

        {step === "search" ? (
          <ExpertSearch artifact={artifact} onComplete={() => unlock("match")} />
        ) : null}

        {step === "match" ? (
          <ExpertMatch
            artifact={artifact}
            riskTitle={rr.risk.title}
            onSearchAgain={() => setStep("search")}
            onReviewBrief={() => unlock("brief")}
          />
        ) : null}

        {step === "brief" ? (
          <SessionBrief
            artifact={artifact}
            ledger={ledger}
            onBack={() => setStep("match")}
            onContinue={() => unlock("book")}
          />
        ) : null}

        {step === "book" ? (
          <BookingPanel artifact={artifact} retired={retired} onBack={() => setStep("brief")} />
        ) : null}

        {step !== "search" ? <RiskDetails row={row} share={share} /> : null}
        </main>
      </div>
    </article>
  );
}

function JourneyRail({
  step,
  highestStep,
  onStep,
}: {
  step: EgeriaStep;
  highestStep: number;
  onStep: (step: EgeriaNavStep) => void;
}) {
  const activeTarget: EgeriaNavStep = step === "search" ? "match" : step;
  const activeIndex = NAV_STEPS.indexOf(activeTarget);
  const steps: Array<{ label: string; detail: string; target: EgeriaNavStep }> = [
    { label: "Risk", detail: "Research boundary", target: "risk" },
    { label: step === "search" ? "Searching" : "Match", detail: step === "search" ? "Expert graph active" : "Evidence-ranked expert", target: "match" },
    { label: "Brief", detail: "Questions linked to model", target: "brief" },
    { label: "Book", detail: "Move the decision", target: "book" },
  ];

  return (
    <aside className="border-b border-hairline bg-well/65 lg:flex lg:min-h-[720px] lg:flex-col lg:border-b-0 lg:border-r">
      <nav aria-label="Egeria progress" className="p-3 lg:p-5">
      <p className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-ink-faint lg:block">Decision flow</p>
      <ol className="grid grid-cols-4 lg:mt-4 lg:block lg:space-y-1">
        {steps.map((item, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const unlocked = index <= highestStep;

          return (
            <li key={item.target}>
              <button
                type="button"
                onClick={() => onStep(item.target)}
                disabled={!unlocked || (step === "search" && item.target === "match")}
                aria-current={isActive ? "step" : undefined}
                className={`flex w-full items-center gap-2 border-l-2 px-2 py-2 text-left transition-colors lg:gap-3 lg:px-3 lg:py-3 ${
                  isActive
                    ? "border-accent bg-card text-ink"
                    : isComplete
                      ? "border-transparent text-ink-2 hover:bg-card"
                      : "border-transparent text-ink-faint disabled:cursor-not-allowed"
                }`}
              >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-[9px] ${
                  isActive
                    ? "border-accent bg-accent text-card"
                    : isComplete
                      ? "border-positive/30 bg-positive-wash text-positive-ink"
                      : "border-hairline-strong bg-card text-ink-faint"
                }`}
              >
                {isComplete ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.1em]">{item.label}</span>
                <span className="mt-0.5 hidden text-[10px] font-normal leading-4 text-ink-3 lg:block">{item.detail}</span>
              </span>
              </button>
            </li>
          );
        })}
      </ol>
      </nav>
      <div className="mt-auto hidden border-t border-hairline p-5 lg:block">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">System principle</p>
        <p className="mt-2 text-[11px] leading-5 text-ink-3">
          Research answers facts. Egeria routes the judgments that remain.
        </p>
      </div>
    </aside>
  );
}

function RiskDetails({ row, share }: { row: MemoRow; share: number }) {
  const { memo, rr } = row;

  return (
    <details className="mt-8 border-y border-hairline py-3.5">
      <summary className="cursor-pointer list-none text-xs font-medium text-ink-2 marker:hidden">
        <span className="flex items-center justify-between gap-3">
          <span>Risk details, alternatives and evidence</span>
          <span aria-hidden className="text-ink-faint">＋</span>
        </span>
      </summary>
      <div className="mt-4 border-t border-hairline pt-5">
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
              {RESPONSE_LABEL[memo.response]} · the underlying memo
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">{memo.headline}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <DetailBeat label="What the model assumes" body={memo.stakes.assumption} />
              <DetailBeat label="What the world does" body={memo.stakes.reality} />
              <DetailBeat label="What that costs" body={memo.stakes.consequence} />
            </div>
          </div>
          <div className="border-l-2 border-accent bg-well p-4">
            <Metric label="Expected Year-1 loss" value={formatEUR(rr.severity)} />
            <Metric label="Revenue if it hits" value={formatEUR(rr.impact.dYam, { signed: true })} negative />
            <Metric label="Chance it is real" value={formatPct(rr.risk.likelihood.value)} />
            <Metric label="Share of remaining register" value={formatPct(share)} last />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            Why the other responses lost
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {memo.rationale.map((item) => (
              <div
                key={item.response}
                className={`border-l-2 p-3 ${
                  item.verdict === "chosen" ? "border-accent bg-accent-wash" : "border-hairline bg-well/60"
                }`}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                  {item.verdict === "chosen" ? "✓ " : ""}{RESPONSE_LABEL[item.response]}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-ink-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {memo.evidence.length > 0 ? (
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Evidence</p>
            <ul className="mt-2 space-y-2">
              {memo.evidence.map((item) => (
                <li key={item.url} className="border-l-2 border-hairline pl-2 text-[10px] leading-relaxed text-ink-3">
                  “{item.excerpt}”{" "}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-ink hover:underline"
                  >
                    — {item.publisher ?? item.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}

function DetailBeat({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{label}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  negative = false,
  last = false,
}: {
  label: string;
  value: string;
  negative?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-2 ${last ? "" : "border-b border-hairline"}`}>
      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-ink-faint">{label}</span>
      <span className={`font-mono text-xs tabular-nums ${negative ? "text-negative-ink" : "text-ink"}`}>{value}</span>
    </div>
  );
}
