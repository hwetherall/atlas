"use client";

import { useMemo } from "react";
import { ledger } from "@/lib/ledger";
import { ledgerRev1 } from "@/lib/ledgerRev1";
import { baselineScenario, evaluate } from "@/lib/compute";
import { REFINEMENT_CYCLE1, REFINEMENT_SUMMARY } from "@/lib/refinement";
import { formatEUR, formatNodeValue } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// CorrectedModel — "what changed and why": the before/after of the model once
// the refinement corrections were curated in. Every headline number is
// computed live from BOTH ledgers (rev 1 frozen, rev 2 live) — the deltas are
// engine facts, not copy. This is the tab that makes the loop's value legible:
// a smaller number you can defend beats a bigger one you can't.
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  { key: "tam" as const, label: "TAM", sub: "total market" },
  { key: "sam" as const, label: "SAM", sub: "serviceable" },
  { key: "yam" as const, label: "YAM", sub: "Year-1 obtainable" },
];

export default function CorrectedModel() {
  const { before, after } = useMemo(() => {
    return {
      before: evaluate(ledgerRev1, baselineScenario(ledgerRev1)),
      after: evaluate(ledger, baselineScenario(ledger)),
    };
  }, []);

  const applied = REFINEMENT_CYCLE1.filter((e) => e.outcome === "applied");
  const deferred = REFINEMENT_CYCLE1.filter((e) => e.outcome === "deferred");
  const s = REFINEMENT_SUMMARY;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="border-b border-hairline pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
          The corrected model
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
          A smaller number you can defend
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-2">
          The refinement pass changed three facts — each backed by sources, each applied through
          human review. Everything below is recomputed live from the two fact banks; nothing is a
          slide number.
        </p>
      </header>

      {/* ── the headline movement, engine-computed ─────────────────────────── */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {METRICS.map((m) => {
          const b = before[m.key];
          const a = after[m.key];
          const delta = a - b;
          return (
            <div key={m.key} className="card rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                {m.label} <span className="font-normal normal-case text-ink-faint">· {m.sub}</span>
              </p>
              <p className="mt-2 font-mono text-sm tabular-nums text-ink-3">
                {formatEUR(b)} <span className="text-ink-faint">→</span>{" "}
                <span className="text-xl font-medium text-ink">{formatEUR(a)}</span>
              </p>
              <p
                className={`mt-1 font-mono text-xs tabular-nums ${
                  delta < 0 ? "text-negative-ink" : "text-positive-ink"
                }`}
              >
                {formatEUR(delta, { signed: true })} ({Math.round((delta / b) * 100)}%)
              </p>
            </div>
          );
        })}
      </div>

      {/* ── why you can believe it: the three corrections ──────────────────── */}
      <div className="mt-8">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
          What changed — and why
        </h2>
        <ul className="mt-2 space-y-3">
          {applied.map((e) => {
            const rev1Node = ledgerRev1.find((n) => n.id === e.nodeId);
            const rev2Node = ledger.find((n) => n.id === e.nodeId);
            if (!rev1Node || !rev2Node) return null;
            return (
              <li key={e.riskId} className="card rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{rev1Node.label}</p>
                  <p className="font-mono text-sm tabular-nums">
                    <span className="text-ink-3 line-through">{formatNodeValue(rev1Node)}</span>{" "}
                    <span className="text-ink-faint">→</span>{" "}
                    <span className="text-accent-ink">{formatNodeValue(rev2Node)}</span>
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{e.verdictRationale}</p>
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
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── the model also survived attacks — that is evidence too ─────────── */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-well p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            {s.refuted} attacks refuted — the model held
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            Ten proposed corrections died against fresh evidence — including three of the four
            independent attacks on the market base. A number that survives adversarial
            re-research is worth more than one that was never attacked.
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-well p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            {deferred.length} corrections deferred — honestly
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            Three share-mix adjustments need a redistribution decision across sibling facts before
            they can be applied. They are queued, not forgotten — and the next research cycle
            independently re-derived all three.
          </p>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-ink-faint">
        Ledger rev 1 → rev 2 · corrections applied by human curation · full audit trail:
        risks/resolution-log.md, risks/refine.review.md, research/raw/refine-*.json.
      </p>
    </div>
  );
}
