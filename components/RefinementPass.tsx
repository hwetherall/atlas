"use client";

import {
  FEATURED_REFINEMENTS,
  REFINEMENT_CYCLE1,
  REFINEMENT_SUMMARY,
  type RefinementEntry,
  type RefinementOutcome,
} from "@/lib/refinement";
import { ledgerRev1 } from "@/lib/ledgerRev1";
import { formatEUR } from "@/lib/format";
import { Badge } from "@/lib/badges";
import ThreadBadge from "@/components/ThreadBadge";

// ─────────────────────────────────────────────────────────────────────────────
// RefinementPass — the under-the-hood tab: the machine takes its own flagged
// model errors, re-researches each one, and an adjudicator rules on the
// proposed correction against fresh evidence. Rebuilt per the walkthrough
// feedback (next-steps.md items 9+11): FOUR exemplars — one per outcome,
// each told in six beats (current state → problem → research → findings →
// what changed → what now) — teach the loop; the other thirteen findings
// collapse to one-line outcomes so the counts stay honest.
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

const OUTCOME_LABEL: Record<RefinementOutcome, string> = {
  applied: "✓ Applied",
  folded: "✓ Folded in",
  deferred: "… Deferred",
  refuted: "✕ Refuted",
};

const OUTCOME_STYLE: Record<RefinementOutcome, string> = {
  applied: "border-fact-green-line bg-fact-green-tint text-fact-green",
  folded: "border-fact-green-line bg-fact-green-tint text-fact-green",
  deferred: "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
  refuted: "border-hairline bg-well text-ink-3",
};

// One line on what each outcome MEANS — the exemplar teaches the process.
const OUTCOME_LESSON: Record<RefinementOutcome, string> = {
  applied: "The doubt was right: the evidence confirmed a correction, and it entered the fact bank through human review.",
  folded: "Right, but not separately: its verdict strengthened another correction instead of becoming its own.",
  deferred: "The research holds up, but applying it needs a human decision first — queued, not forced.",
  refuted: "The doubt was wrong: fresh evidence sided with the model. The adjudicator says no more often than yes — that is what makes the applied fixes worth trusting.",
};

function fmt(nodeId: string, v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const node = ledgerRev1.find((n) => n.id === nodeId);
  return node?.unit === "EUR_M" ? `€${v}M` : `${v}`;
}

function nodeLabel(nodeId: string): string {
  return ledgerRev1.find((n) => n.id === nodeId)?.label ?? nodeId;
}

export default function RefinementPass() {
  const s = REFINEMENT_SUMMARY;
  const totalAtStake = REFINEMENT_CYCLE1.reduce((sum, e) => sum + e.expectedYamLoss, 0);

  // Four exemplars, in outcome order (applied → folded → deferred → refuted).
  const exemplars = FEATURED_REFINEMENTS.map(
    (id) => REFINEMENT_CYCLE1.find((e) => e.riskId === id)!,
  );
  const rest = REFINEMENT_CYCLE1.filter((e) => !FEATURED_REFINEMENTS.includes(e.riskId)).sort(
    (a, b) => b.expectedYamLoss - a.expectedYamLoss,
  );
  const restCounts = rest.reduce(
    (acc, e) => ({ ...acc, [e.outcome]: (acc[e.outcome] ?? 0) + 1 }),
    {} as Partial<Record<RefinementOutcome, number>>,
  );
  const restSummary = (["applied", "folded", "refuted", "deferred"] as const)
    .filter((o) => restCounts[o])
    .map((o) => `${restCounts[o]} ${o === "folded" ? "folded in" : o}`)
    .join(", ");

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
          what would settle it — so each one could be put back on the research bench. Four
          findings below, one per outcome, show how the loop works; the rest are a click away.
        </p>
      </header>

      {/* The loop in three sentences: problem → what we did → outcome. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="card rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            The problem
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            The first risk pass flagged{" "}
            <span className="font-medium text-ink">{s.researched} places</span>{" "}
            where the model&rsquo;s own numbers didn&rsquo;t survive scrutiny — with{" "}
            <span className="font-medium text-ink">{formatEUR(totalAtStake)}</span> of expected
            Year-1 loss riding on them.
          </p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            What the machine did
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            Each doubt was re-researched with targeted searches, and an adjudicator ruled on the
            proposed fix against the fresh evidence. Nothing auto-flows — corrections enter the
            fact bank only through human review.
          </p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            The outcome
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            <span className="font-medium text-ink">{s.applied} corrections applied</span>,{" "}
            {s.folded} folded in, {s.deferred} deferred — and{" "}
            <span className="font-medium text-ink">{s.refuted} proposals refuted</span>: the
            evidence sided with the model, not the doubt.
          </p>
        </div>
      </div>

      {/* Four exemplars — one per outcome, six beats each. */}
      <section className="mt-8 space-y-4">
        {exemplars.map((e) => (
          <ExemplarCard key={e.riskId} entry={e} />
        ))}
      </section>

      {/* The rest — honest counts, one line each. */}
      <details className="group mt-8">
        <summary className="cursor-pointer list-none rounded-lg border border-hairline bg-card px-3 py-2.5 transition-colors hover:border-hairline-strong">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
            <span aria-hidden className="mr-1.5 inline-block transition-transform group-open:rotate-90">
              ▸
            </span>
            {rest.length} more findings researched this cycle — {restSummary}
          </span>
        </summary>
        <ul className="mt-3 space-y-1.5">
          {rest.map((e) => (
            <li
              key={e.riskId}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-hairline bg-card px-3 py-2"
            >
              <Badge className={OUTCOME_STYLE[e.outcome]}>{OUTCOME_LABEL[e.outcome]}</Badge>
              <span className="min-w-0 flex-1 text-xs text-ink">{e.title}</span>
              <span className="font-mono text-[11px] tabular-nums text-ink-3">
                {nodeLabel(e.nodeId)}: {fmt(e.nodeId, e.rev1Value)}
                {e.outcome === "applied" || e.outcome === "folded" ? (
                  <> → {fmt(e.nodeId, e.appliedValue ?? e.verdictValue)}</>
                ) : e.outcome === "refuted" ? (
                  <> — held</>
                ) : (
                  <> — queued</>
                )}
              </span>
            </li>
          ))}
        </ul>
      </details>

      <p className="mt-6 text-[11px] text-ink-faint">
        Raw evidence per error in research/raw/refine-*.json · verdicts in risks/refine.review.md ·
        curation record in risks/resolution-log.md.
      </p>
    </div>
  );
}

// One exemplar, six beats: current state → the problem → what we researched →
// what we found → what changed → what now. Derived beats come from the data;
// authored beats (problem / researchNote / whatNext) are the exemplar fields.
function ExemplarCard({ entry: e }: { entry: RefinementEntry }) {
  return (
    <article className="card rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={OUTCOME_STYLE[e.outcome]}>{OUTCOME_LABEL[e.outcome]}</Badge>
        <p className="min-w-0 flex-1 text-sm font-medium text-ink">{e.title}</p>
        <ThreadBadge riskId={e.riskId} />
        <Badge className={VERDICT_STYLE[e.verdict]}>{VERDICT_LABEL[e.verdict]}</Badge>
      </div>
      <p className="mt-1.5 text-[11px] text-ink-3">{OUTCOME_LESSON[e.outcome]}</p>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Beat label="Current state">
          The model carried{" "}
          <span className="font-mono tabular-nums text-ink">
            {nodeLabel(e.nodeId)} = {fmt(e.nodeId, e.rev1Value)}
          </span>{" "}
          — with {formatEUR(e.expectedYamLoss)} of expected Year-1 loss riding on the doubt.
        </Beat>
        <Beat label="The problem">{e.problem ?? e.proposed?.rationale ?? "—"}</Beat>
        <Beat label="What we researched">
          {e.researchNote ?? "Targeted re-search of the fact's settle-test, adjudicated against fresh evidence."}
        </Beat>
        <Beat label="What we found">{e.verdictRationale}</Beat>
        <Beat label="What changed">
          <span className="font-mono tabular-nums text-ink">
            {fmt(e.nodeId, e.rev1Value)}
            {" → "}
            {e.outcome === "refuted"
              ? `${fmt(e.nodeId, e.rev1Value)} (held)`
              : e.outcome === "deferred"
                ? `${fmt(e.nodeId, e.verdictValue)} (queued)`
                : fmt(e.nodeId, e.appliedValue ?? e.verdictValue)}
          </span>
          <span className="ml-2 text-ink-3">{e.outcomeNote}</span>
        </Beat>
        {e.whatNext ? <Beat label="What now">{e.whatNext}</Beat> : null}
      </div>

      {e.evidence[0] ? (
        <p className="mt-3 border-l-2 border-hairline pl-2 text-[11px] leading-relaxed text-ink-3">
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
    </article>
  );
}

function Beat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}
