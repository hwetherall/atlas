"use client";

import { REFINEMENT_CYCLE1, REFINEMENT_SUMMARY, type RefinementEntry } from "@/lib/refinement";
import { ledgerRev1 } from "@/lib/ledgerRev1";
import { formatEUR } from "@/lib/format";
import { Badge } from "@/lib/badges";

// ─────────────────────────────────────────────────────────────────────────────
// RefinementPass — the under-the-hood tab: the machine takes its own flagged
// model errors, re-researches each one with targeted searches, and an
// adjudicator rules on the proposed correction against fresh evidence.
// Renders lib/refinement.ts (cycle 1). The next tab shows the outcome.
// ─────────────────────────────────────────────────────────────────────────────

const VERDICT_STYLE: Record<RefinementEntry["verdict"], string> = {
  confirm: "border-fact-green-line bg-fact-green-tint text-fact-green",
  adjust: "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
  refute: "border-fact-blue-line bg-fact-blue-tint text-fact-blue",
};

const VERDICT_LABEL: Record<RefinementEntry["verdict"], string> = {
  confirm: "confirmed — the model was wrong",
  adjust: "adjusted — wrong, but differently",
  refute: "refuted — the model held",
};

const OUTCOME_STYLE: Record<RefinementEntry["outcome"], string> = {
  applied: "text-fact-green",
  folded: "text-fact-green",
  deferred: "text-fact-amber",
  refuted: "text-ink-3",
};

function fmt(nodeId: string, v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const node = ledgerRev1.find((n) => n.id === nodeId);
  return node?.unit === "EUR_M" ? `€${v}M` : `${v}`;
}

export default function RefinementPass() {
  const entries = [...REFINEMENT_CYCLE1].sort((a, b) => b.expectedYamLoss - a.expectedYamLoss);
  const s = REFINEMENT_SUMMARY;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="border-b border-hairline pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
          Refinement · cycle 1
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
          The machine re-researched its own doubts
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-2">
          Every flagged model error names the fact it doubts, the value it thinks is right, and
          what would settle it. Each was re-researched with targeted searches, and an adjudicator
          ruled on the proposed fix against the fresh evidence — corrections only enter the fact
          bank through human review.{" "}
          <span className="text-ink-3">
            {s.researched} errors researched · {s.applied} corrections applied · {s.folded} folded
            in · {s.deferred} deferred · {s.refuted} refuted (the model held)
          </span>
        </p>
      </header>

      <ul className="mt-6 space-y-3">
        {entries.map((e) => (
          <li key={e.riskId} className="card rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="min-w-0 flex-1 text-sm font-medium text-ink">{e.title}</p>
              <Badge className={VERDICT_STYLE[e.verdict]}>{VERDICT_LABEL[e.verdict]}</Badge>
            </div>

            <p className="mt-2 font-mono text-xs tabular-nums text-ink-2">
              {ledgerRev1.find((n) => n.id === e.nodeId)?.label ?? e.nodeId}:{" "}
              {fmt(e.nodeId, e.rev1Value)}
              {e.proposed ? (
                <>
                  {" "}
                  <span className="text-ink-faint">— machine proposed</span>{" "}
                  {fmt(e.nodeId, e.proposed.value)}
                </>
              ) : null}
              {" "}
              <span className="text-ink-faint">— research says</span>{" "}
              <span className={e.verdict === "refute" ? "text-ink" : "text-accent-ink"}>
                {e.verdict === "refute" ? `keep ${fmt(e.nodeId, e.rev1Value)}` : fmt(e.nodeId, e.verdictValue)}
              </span>
              <span className="ml-2 text-ink-faint">
                (was worth {formatEUR(e.expectedYamLoss)} of expected Year-1 loss)
              </span>
            </p>

            <p className="mt-2 text-xs leading-relaxed text-ink-2">{e.verdictRationale}</p>

            {e.evidence[0] ? (
              <p className="mt-2 border-l-2 border-hairline pl-2 text-[11px] leading-relaxed text-ink-3">
                “{e.evidence[0].excerpt}”{" "}
                <a
                  href={e.evidence[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap text-accent-ink hover:underline"
                >
                  — {e.evidence[0].publisher ?? e.evidence[0].title} ↗
                </a>
              </p>
            ) : null}

            <p className={`mt-2 text-[11px] font-medium ${OUTCOME_STYLE[e.outcome]}`}>
              {e.outcomeNote}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[11px] text-ink-faint">
        Raw evidence per error in research/raw/refine-*.json · verdicts in risks/refine.review.md ·
        curation record in risks/resolution-log.md.
      </p>
    </div>
  );
}
