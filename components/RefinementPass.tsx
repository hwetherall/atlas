"use client";

import { REFINEMENT_CYCLE1, REFINEMENT_SUMMARY, type RefinementEntry } from "@/lib/refinement";
import { ledgerRev1 } from "@/lib/ledgerRev1";
import { formatEUR } from "@/lib/format";
import { Badge } from "@/lib/badges";

// ─────────────────────────────────────────────────────────────────────────────
// RefinementPass — the under-the-hood tab: the machine takes its own flagged
// model errors, re-researches each one with targeted searches, and an
// adjudicator rules on the proposed correction against fresh evidence.
// Renders lib/refinement.ts (cycle 1), narrated as problem → research →
// outcome → why: the fixes lead, the deferred queue follows, and the ten
// refuted proposals fold into a collapsed credibility proof.
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

function nodeLabel(nodeId: string): string {
  return ledgerRev1.find((n) => n.id === nodeId)?.label ?? nodeId;
}

export default function RefinementPass() {
  const bySeverity = (a: RefinementEntry, b: RefinementEntry) =>
    b.expectedYamLoss - a.expectedYamLoss;
  const fixed = REFINEMENT_CYCLE1.filter(
    (e) => e.outcome === "applied" || e.outcome === "folded",
  ).sort(bySeverity);
  const deferred = REFINEMENT_CYCLE1.filter((e) => e.outcome === "deferred").sort(bySeverity);
  const refuted = REFINEMENT_CYCLE1.filter((e) => e.outcome === "refuted").sort(bySeverity);
  const totalAtStake = REFINEMENT_CYCLE1.reduce((s, e) => s + e.expectedYamLoss, 0);
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
          what would settle it — so each one could be put back on the research bench.
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

      {/* The fixes — the reason this tab exists, told in full. */}
      <section className="mt-8">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fact-green">
            ✓ What we fixed
          </h2>
          <p className="hidden text-xs text-ink-3 sm:block">
            The corrections that survived adjudication and entered the model.
          </p>
        </div>
        <ul className="mt-3 space-y-3">
          {fixed.map((e) => (
            <FixCard key={e.riskId} entry={e} />
          ))}
        </ul>
      </section>

      {/* Deferred — honest loose ends, queued rather than forced. */}
      <section className="mt-8">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fact-amber">
            … Queued for next curation
          </h2>
          <p className="hidden text-xs text-ink-3 sm:block">
            Corrections the research supports but that need a human decision before they apply.
          </p>
        </div>
        <ul className="mt-3 space-y-3">
          {deferred.map((e) => (
            <CompactCard key={e.riskId} entry={e} />
          ))}
        </ul>
      </section>

      {/* Refuted — collapsed credibility proof: the adjudicator says no, often. */}
      <details className="group mt-8">
        <summary className="cursor-pointer list-none rounded-lg border border-hairline bg-card px-3 py-2.5 transition-colors hover:border-hairline-strong">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
            <span aria-hidden className="mr-1.5 inline-block transition-transform group-open:rotate-90">
              ▸
            </span>
            {refuted.length} proposals the evidence rejected — the model held
          </span>
          <span className="ml-2 text-xs text-ink-3">
            the adjudicator refutes more than it confirms; that is what makes the applied fixes
            worth trusting
          </span>
        </summary>
        <ul className="mt-3 space-y-3">
          {refuted.map((e) => (
            <CompactCard key={e.riskId} entry={e} />
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

// Full-size card for an applied/folded correction: the four beats — what was
// wrong, what the research found, what changed, and why — each labeled.
function FixCard({ entry: e }: { entry: RefinementEntry }) {
  return (
    <li className="card rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium text-ink">{e.title}</p>
        <Badge className={VERDICT_STYLE[e.verdict]}>{VERDICT_LABEL[e.verdict]}</Badge>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            The problem
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-2">
            The model carried{" "}
            <span className="font-mono tabular-nums text-ink">
              {nodeLabel(e.nodeId)} = {fmt(e.nodeId, e.rev1Value)}
            </span>{" "}
            — with {formatEUR(e.expectedYamLoss)} of expected Year-1 loss riding on it if the
            doubt was right.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            The research
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-2">
            {e.proposed ? (
              <>
                The machine proposed{" "}
                <span className="font-mono tabular-nums text-ink">
                  {fmt(e.nodeId, e.proposed.value)}
                </span>
                : {e.proposed.rationale}
              </>
            ) : (
              "Targeted re-search of the fact's settle-test, adjudicated against fresh evidence."
            )}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            The outcome
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            <span className="font-mono tabular-nums text-ink">
              {fmt(e.nodeId, e.rev1Value)} → {fmt(e.nodeId, e.appliedValue ?? e.verdictValue)}
            </span>
            <span className={`ml-2 ${OUTCOME_STYLE[e.outcome]}`}>{e.outcomeNote}</span>
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Why
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-2">{e.verdictRationale}</p>
        </div>
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
    </li>
  );
}

// Compact card for deferred/refuted entries — the pre-restructure layout.
function CompactCard({ entry: e }: { entry: RefinementEntry }) {
  return (
    <li className="card rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium text-ink">{e.title}</p>
        <Badge className={VERDICT_STYLE[e.verdict]}>{VERDICT_LABEL[e.verdict]}</Badge>
      </div>

      <p className="mt-2 font-mono text-xs tabular-nums text-ink-2">
        {nodeLabel(e.nodeId)}: {fmt(e.nodeId, e.rev1Value)}
        {e.proposed ? (
          <>
            {" "}
            <span className="text-ink-faint">— machine proposed</span>{" "}
            {fmt(e.nodeId, e.proposed.value)}
          </>
        ) : null}{" "}
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

      <p className={`mt-2 text-[11px] font-medium ${OUTCOME_STYLE[e.outcome]}`}>{e.outcomeNote}</p>
    </li>
  );
}
