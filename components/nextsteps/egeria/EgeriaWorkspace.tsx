"use client";

import { useState } from "react";
import type { Ledger } from "@/lib/schema";
import { RESPONSE_LABEL } from "@/lib/toolkit";
import { formatEUR, formatPct } from "@/lib/format";
import type { MemoRow } from "@/components/nextsteps/types";
import ExpertMatch from "@/components/nextsteps/egeria/ExpertMatch";
import SessionBrief from "@/components/nextsteps/egeria/SessionBrief";
import BookingPanel from "@/components/nextsteps/egeria/BookingPanel";
import type { EgeriaStep } from "@/components/nextsteps/egeria/types";

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
  const [step, setStep] = useState<EgeriaStep>("match");
  const { memo, rr, retired } = row;

  if (memo.artifact.kind !== "egeria") return null;

  const artifact = memo.artifact;
  const share = totalExposure > 0 ? rr.severity / totalExposure : 0;

  return (
    <article className="mt-6 overflow-hidden rounded-[24px] border border-hairline-strong bg-card shadow-raised">
      <header className="relative overflow-hidden bg-ink px-5 py-5 text-card sm:px-7 sm:py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 82% 20%, rgba(46, 107, 230, 0.42), transparent 34%), linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.035))",
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <button
              type="button"
              onClick={onBackToCampaign}
              className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
            >
              ← Back to the campaign
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-display text-3xl font-medium tracking-tight text-card">Egeria</h1>
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/80">
                Expert network
              </span>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/70">
              The counselor kings consulted — turning an open model question into a prepared conversation with someone who has decided it before.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-positive" />
              Match ready
            </p>
            <p className="mt-1 font-mono text-[10px] text-white/50">No network call in the demo path</p>
          </div>
        </div>
      </header>

      <div className="bg-paper/55 px-4 py-5 sm:px-6 sm:py-6">
        <Journey step={step} onStep={setStep} />

        {step === "match" ? (
          <ExpertMatch
            artifact={artifact}
            riskTitle={rr.risk.title}
            severity={rr.severity}
            likelihood={rr.risk.likelihood.value}
            impact={rr.impact.dYam}
            deadline={memo.decision.deadline}
            onReviewBrief={() => setStep("brief")}
          />
        ) : null}

        {step === "brief" ? (
          <SessionBrief
            artifact={artifact}
            ledger={ledger}
            onBack={() => setStep("match")}
            onContinue={() => setStep("book")}
          />
        ) : null}

        {step === "book" ? (
          <BookingPanel artifact={artifact} retired={retired} onBack={() => setStep("brief")} />
        ) : null}

        <RiskDetails row={row} share={share} />
      </div>
    </article>
  );
}

function Journey({ step, onStep }: { step: EgeriaStep; onStep: (step: EgeriaStep) => void }) {
  const activeIndex = step === "match" ? 1 : step === "brief" ? 2 : 3;
  const steps: Array<{ label: string; target?: EgeriaStep }> = [
    { label: "Risk identified" },
    { label: "Expert match", target: "match" },
    { label: "Session brief", target: "brief" },
    { label: "Book", target: "book" },
  ];

  return (
    <nav aria-label="Egeria progress" className="rounded-xl border border-hairline bg-card p-2">
      <ol className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {steps.map((item, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const className = `flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors ${
            isActive
              ? "bg-accent-wash text-accent-ink"
              : isComplete
                ? "text-positive-ink"
                : "text-ink-faint hover:bg-well hover:text-ink-2"
          }`;
          const content = (
            <>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] ${
                  isActive
                    ? "bg-accent text-card"
                    : isComplete
                      ? "bg-positive-wash text-positive-ink"
                      : "bg-well text-ink-faint"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              {item.label}
            </>
          );

          return (
            <li key={item.label}>
              {item.target ? (
                <button type="button" onClick={() => onStep(item.target!)} className={`w-full ${className}`}>
                  {content}
                </button>
              ) : (
                <span className={className}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function RiskDetails({ row, share }: { row: MemoRow; share: number }) {
  const { memo, rr } = row;

  return (
    <details className="mt-6 rounded-xl border border-hairline bg-card px-4 py-3.5">
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
          <div className="rounded-xl border border-hairline bg-well p-4">
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
                className={`rounded-lg border p-3 ${
                  item.verdict === "chosen" ? "border-accent/30 bg-accent-wash" : "border-hairline bg-card"
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
