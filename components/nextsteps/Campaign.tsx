"use client";

import { useMemo } from "react";
import type { Ledger } from "@/lib/schema";
import { ledgerRev1 } from "@/lib/ledgerRev1";
import { baselineScenario, evaluate } from "@/lib/compute";
import { REFINEMENT_SUMMARY } from "@/lib/refinement";
import { risks } from "@/lib/risks";
import { THREADS } from "@/lib/threads";
import { TOOLKIT, RESPONSE_LABEL, type ToolId } from "@/lib/toolkit";
import { formatEUR, formatPct } from "@/lib/format";
import ThreadBadge from "@/components/ThreadBadge";
import type { MemoRow } from "@/components/nextsteps/types";

// ─────────────────────────────────────────────────────────────────────────────
// Campaign — view 0 of the Next Steps tab. Grounds the reader (what the loop
// already did → where that leaves the model → why what remains needs executed
// responses, not more reading), then the five memos as a table an executive
// can reason with: chance × impact, the move, and what acting buys — every €
// engine-computed at render.
// ─────────────────────────────────────────────────────────────────────────────

const TOOL_ORDER: ToolId[] = ["delphi", "egeria", "argus", "julius"];

export default function Campaign({
  ledger,
  rows,
  totalExposure,
  onOpen,
}: {
  ledger: Ledger;
  rows: MemoRow[];
  totalExposure: number;
  onOpen: (v: number) => void;
}) {
  // The loop's movement, computed live from both ledgers (as CorrectedModel
  // does) — rev 1 frozen "before", rev 2 corrected "after", both at baseline.
  const movement = useMemo(() => {
    const before = evaluate(ledgerRev1, baselineScenario(ledgerRev1));
    const after = evaluate(ledger, baselineScenario(ledger));
    return { before, after };
  }, [ledger]);

  const remainingRisks = useMemo(() => risks.filter((r) => r.resolution === "risk").length, []);
  const atStake = rows.reduce((s, r) => s + r.rr.severity, 0);

  return (
    <div>
      <header className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
          Next steps
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
          What to do about what remains
        </h1>
      </header>

      {/* ── The grounding: what we did → where we are → what comes next ────── */}
      <section className="mt-6 grid gap-3 lg:grid-cols-3">
        <div className="card rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            What we did
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            Built the market model from sourced facts, then attacked it with two adversarial
            research passes. {REFINEMENT_SUMMARY.applied} corrections were applied,{" "}
            {REFINEMENT_SUMMARY.refuted} attacks refuted.
          </p>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-ink-3">
            TAM {formatEUR(movement.before.tam)} → {formatEUR(movement.after.tam)} · Year-1{" "}
            {formatEUR(movement.before.yam)} → {formatEUR(movement.after.yam)}
          </p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Where that leaves us
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            A market size and shape we looped on until the numbers held — smaller than the first
            draft, and defensible. What web research can settle, it has settled.
          </p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            What remains
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            {remainingRisks} risks no report can settle. Each needs an executed response — and
            that is what the Innovera suite does. Two of them you have followed here from the
            first risk pass:
          </p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            {THREADS.map((t) => (
              <ThreadBadge key={t.id} thread={t} />
            ))}
          </p>
        </div>
      </section>

      {/* ── The five memos ──────────────────────────────────────────────────── */}
      <section className="mt-10">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Five memos, ranked by what&rsquo;s at stake
          </h2>
          <p className="hidden text-xs text-ink-3 sm:block">
            {formatEUR(atStake)} of the register&rsquo;s {formatEUR(totalExposure)} expected
            Year-1 loss — five exemplar dispositions; in the full product every finding carries
            one.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-3 border-b border-hairline px-3 pb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          <span className="w-5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">The risk</span>
          <span className="w-14 shrink-0 text-right" title="Likelihood the risk is real and plays out.">
            Chance
          </span>
          <span
            className="w-20 shrink-0 text-right"
            title="Year-1 revenue lost if the risk proves true, at your current levers."
          >
            If it hits
          </span>
          <span className="w-32 shrink-0 text-right">Our move</span>
          <span
            className="w-32 shrink-0 text-right"
            title="Engine-computed: expected Year-1 loss that executing settles or retires. Watching and accepting honestly buy €0 — they buy latency and a bound instead."
          >
            What acting buys
          </span>
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {rows.map((row, i) => (
            <li key={row.memo.riskId}>
              <button
                type="button"
                onClick={() => onOpen(i + 1)}
                className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-left transition-colors hover:border-hairline-strong"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-xs tabular-nums text-ink-faint">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-ink">
                      {row.rr.risk.title} <ThreadBadge riskId={row.memo.riskId} />
                    </p>
                    <p className="mt-0.5 text-xs text-ink-3">{row.memo.tableLine}</p>
                  </div>
                  <span className="mt-0.5 w-14 shrink-0 text-right font-mono text-xs tabular-nums text-ink-3">
                    {formatPct(row.rr.risk.likelihood.value)}
                  </span>
                  <span
                    className={`mt-0.5 w-20 shrink-0 text-right font-mono text-xs tabular-nums ${
                      row.rr.impact.dYam < 0 ? "text-negative-ink" : "text-positive-ink"
                    }`}
                  >
                    {formatEUR(row.rr.impact.dYam, { signed: true })}
                  </span>
                  <span className="mt-0.5 w-32 shrink-0 text-right">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-ink-2">
                      {RESPONSE_LABEL[row.memo.response]}
                    </span>
                    <span className="block text-[10px] text-ink-faint">· {row.tool.name}</span>
                  </span>
                  <span className="mt-0.5 w-32 shrink-0 text-right">
                    <BuysCell row={row} />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* The toolkit — subscription framing, no prices. */}
      <section className="mt-10">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Your Innovera toolkit
          </h2>
          <p className="hidden text-xs text-ink-3 sm:block">
            Included in the subscription — four tools cover the five responses (accepting a risk
            is governed by Argus, not shelved).
          </p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOL_ORDER.map((id) => (
            <div key={id} className="card rounded-xl p-4">
              <p className="font-display text-sm font-medium text-ink">{TOOLKIT[id].name}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink-3">{TOOLKIT[id].epithet}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-2">{TOOLKIT[id].does}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-[11px] text-ink-faint">
        Sourcing facts (report titles, prices, audit timelines, cost bands) from the cached
        research passes in research/raw/nextsteps/ · design in nextsteps.md.
      </p>
    </div>
  );
}

// What executing buys, in the executive's own units: € where the engine
// retires exposure, an honest two-word state where it doesn't.
function BuysCell({ row }: { row: MemoRow }) {
  const { memo, retired } = row;
  if (memo.projection.retirement === "settles") {
    return (
      <>
        <span className="font-mono text-xs tabular-nums text-positive-ink">{formatEUR(retired)}</span>
        <span className="block text-[10px] text-ink-faint">question settled</span>
      </>
    );
  }
  if (memo.projection.retirement === "mitigates") {
    return retired > 1e-9 ? (
      <>
        <span className="font-mono text-xs tabular-nums text-positive-ink">{formatEUR(retired)}</span>
        <span className="block text-[10px] text-ink-faint">exposure retired</span>
      </>
    ) : (
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-3">
        worst case lifted
      </span>
    );
  }
  if (memo.projection.retirement === "bounds") {
    return (
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-3">
        accepted, tripwired
      </span>
    );
  }
  return (
    <span className="text-[10px] font-medium uppercase tracking-wide text-ink-3">watching</span>
  );
}
