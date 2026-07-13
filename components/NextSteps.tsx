"use client";

import { useEffect, useMemo, useState } from "react";
import type { Ledger } from "@/lib/schema";
import type { ScenarioState } from "@/lib/useScenario";
import { risks } from "@/lib/risks";
import { memos } from "@/lib/nextSteps";
import type { Memo, ResponseType } from "@/lib/nextStepsSchema";
import { TOOLKIT, RESPONSE_TOOL, type Tool } from "@/lib/toolkit";
import { rankRisks, type RankedRisk } from "@/lib/riskCompute";
import { projectAction, retiredExposure } from "@/lib/projection";
import { formatEUR, formatPct } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// NextSteps — workspace surface #8, rebuilt per nextsteps.md: the Innovera
// toolkit in action. Stepped views: 0 = the campaign overview (interim until
// milestone 4), 1–5 = one board-grade memo per risk, ordered by live
// severity. Register design language throughout — hairlines, mono numbers,
// small-caps kickers; color only where it carries meaning. Every € figure is
// engine-computed against the current levers (rankRisks, projectAction,
// retiredExposure) — the data module carries narrative and projection ops.
// ─────────────────────────────────────────────────────────────────────────────

const RESPONSE_LABEL: Record<ResponseType, string> = {
  "buy-information": "Buy information",
  expert: "Speak to an expert",
  monitor: "Monitor",
  act: "Act",
  ignore: "Ignore",
};

interface Props {
  ledger: Ledger;
  state: ScenarioState;
}

interface MemoRow {
  memo: Memo;
  rr: RankedRisk;
  tool: Tool;
  retired: number;
}

export default function NextSteps({ ledger, state }: Props) {
  // Same live ranking as the register, so severities agree across tabs.
  const ranked = useMemo(() => rankRisks(ledger, state.current, risks), [ledger, state.current]);
  const totalExposure = useMemo(() => ranked.reduce((s, r) => s + r.severity, 0), [ranked]);

  const rows: MemoRow[] = useMemo(() => {
    const byId = new Map(ranked.map((r) => [r.risk.id, r]));
    return memos
      .map((memo) => {
        const rr = byId.get(memo.riskId)!;
        return {
          memo,
          rr,
          tool: TOOLKIT[RESPONSE_TOOL[memo.response]],
          retired: retiredExposure(ledger, state.current, rr.risk, memo),
        };
      })
      .sort((a, b) => b.rr.severity - a.rr.severity);
  }, [ranked, ledger, state.current]);

  // 0 = campaign overview · 1..5 = memos.
  const [view, setView] = useState(0);
  const last = rows.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setView((v) => Math.min(v + 1, last));
      if (e.key === "ArrowLeft") setView((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  const go = (v: number) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <StepNav view={view} rows={rows} onGo={go} />
      {view === 0 ? (
        <Campaign rows={rows} totalExposure={totalExposure} onOpen={go} />
      ) : (
        <MemoView
          row={rows[view - 1]}
          index={view}
          count={rows.length}
          ledger={ledger}
          state={state}
          totalExposure={totalExposure}
        />
      )}
    </div>
  );
}

// ── Step navigation — dots + prev/next, register-quiet ───────────────────────

function StepNav({
  view,
  rows,
  onGo,
}: {
  view: number;
  rows: MemoRow[];
  onGo: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-hairline pb-3 text-xs text-ink-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onGo(0)}
          aria-current={view === 0 ? "page" : undefined}
          className={`text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
            view === 0 ? "text-accent-ink" : "hover:text-ink"
          }`}
        >
          The campaign
        </button>
        <span aria-hidden className="text-ink-faint">
          ·
        </span>
        <div className="flex items-center gap-2" role="tablist" aria-label="Memos">
          {rows.map((row, i) => (
            <button
              key={row.memo.riskId}
              type="button"
              onClick={() => onGo(i + 1)}
              aria-current={view === i + 1 ? "page" : undefined}
              title={`${i + 1} · ${row.tool.name} — ${row.rr.risk.title}`}
              className={`font-mono text-[11px] tabular-nums transition-colors ${
                view === i + 1 ? "text-accent-ink" : "text-ink-faint hover:text-ink"
              }`}
            >
              {view === i + 1 ? `●${i + 1}` : `○${i + 1}`}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onGo(Math.max(view - 1, 0))}
          disabled={view === 0}
          className="disabled:opacity-30 hover:text-ink"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => onGo(Math.min(view + 1, rows.length))}
          disabled={view === rows.length}
          className="disabled:opacity-30 hover:text-ink"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ── View 0 — the campaign (interim overview; full version is milestone 4) ────

function Campaign({
  rows,
  totalExposure,
  onOpen,
}: {
  rows: MemoRow[];
  totalExposure: number;
  onOpen: (v: number) => void;
}) {
  const atStake = rows.reduce((s, r) => s + r.rr.severity, 0);
  const retired = rows.reduce((s, r) => s + r.retired, 0);
  return (
    <div>
      <header className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
          Next steps
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
          What to do about what remains
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-2">
          Identify, quantify — then mitigate. Five risks from the corrected register, each
          answered by one tool from the Innovera subscription.{" "}
          <span className="text-ink-3">
            {formatEUR(atStake)} of the register&rsquo;s {formatEUR(totalExposure)} expected
            Year-1 loss is addressed below · executing settles or retires {formatEUR(retired)} of
            it outright · every € figure is engine-computed at your current levers.
          </span>
        </p>
      </header>

      {/* The memos — rows in register style; click to open. */}
      <section className="mt-8">
        <div className="flex items-center gap-3 border-b border-hairline px-3 pb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          <span className="w-5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">Memo</span>
          <span className="w-28 shrink-0 text-right">Response</span>
          <span className="w-24 shrink-0 text-right" title="Expected Year-1 loss today (chance × impact).">
            At stake
          </span>
          <span
            className="w-24 shrink-0 text-right"
            title="Expected Year-1 loss that executing settles or retires (engine-computed; watching and accepting honestly retire €0)."
          >
            Retires
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
                    <p className="text-sm text-ink">{row.rr.risk.title}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      “{row.memo.headline}” · executes with{" "}
                      <span className="text-ink-2">{row.tool.name}</span>
                    </p>
                  </div>
                  <span className="mt-0.5 w-28 shrink-0 text-right text-[10px] font-medium uppercase tracking-wide text-ink-3">
                    {RESPONSE_LABEL[row.memo.response]}
                  </span>
                  <span className="mt-0.5 w-24 shrink-0 text-right font-mono text-xs tabular-nums text-ink-2">
                    {formatEUR(row.rr.severity)}
                  </span>
                  <span className="mt-0.5 w-24 shrink-0 text-right font-mono text-xs tabular-nums text-ink-2">
                    {row.retired > 1e-9 ? formatEUR(row.retired) : "—"}
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
            Included in the subscription — each memo names the tool that executes it.
          </p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(["delphi", "mentor", "argus", "daedalus", "themis"] as const).map((id) => (
            <div key={id} className="card rounded-xl p-4">
              <p className="font-display text-sm font-medium text-ink">{TOOLKIT[id].name}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink-3">{TOOLKIT[id].epithet}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-2">{TOOLKIT[id].does}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-[11px] text-ink-faint">
        Sourcing facts (report titles, prices, delivery terms) from the cached research pass in
        research/raw/nextsteps/ · design in nextsteps.md.
      </p>
    </div>
  );
}

// ── Views 1–5 — the memo ──────────────────────────────────────────────────────

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
      {children}
    </h2>
  );
}

function LabeledLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

function MemoView({
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
        <p className="mt-2 text-sm text-ink-2">
          {rr.risk.title}
          <span className="ml-3 font-mono text-xs tabular-nums text-ink-3">
            {formatEUR(rr.severity)} expected Year-1 loss · {formatPct(share)} of the remaining
            register
          </span>
        </p>
      </header>

      {/* The stakes */}
      <section className="mt-8">
        <SectionKicker>The stakes</SectionKicker>
        <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] lg:gap-6">
          <p className="text-sm leading-relaxed text-ink-2">{memo.stakes.narrative}</p>
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
                  If it lands (ΔYAM)
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
            <LabeledLine label="When it bites">{memo.stakes.whenItBites}</LabeledLine>
            <LabeledLine label="The decision expires">
              {memo.stakes.decisionExpiry.label} — {memo.stakes.decisionExpiry.why}
            </LabeledLine>
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
        <ModelAfter memo={memo} ledger={ledger} state={state} retired={retired} />
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

// ── Artifacts ─────────────────────────────────────────────────────────────────

function nodeLabel(ledger: Ledger, id: string): string {
  return ledger.find((n) => n.id === id)?.label ?? id;
}

function ArtifactBlock({ memo, ledger }: { memo: Memo; ledger: Ledger }) {
  const a = memo.artifact;
  switch (a.kind) {
    case "delphi":
      return (
        <div>
          {/* Sourcing table — store-page facts from the research cache. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-hairline text-left text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  <th className="py-1.5 pr-3 font-medium">Option</th>
                  <th className="py-1.5 pr-3 font-medium">Scope</th>
                  <th className="py-1.5 pr-3 font-medium">Settles</th>
                  <th className="py-1.5 pr-3 text-right font-medium">Price</th>
                  <th className="py-1.5 text-right font-medium">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {a.options.map((opt) => (
                  <tr key={opt.title} className="border-b border-hairline align-top">
                    <td className="py-2.5 pr-3">
                      <p className="text-ink">
                        {opt.url ? (
                          <a href={opt.url} target="_blank" rel="noreferrer" className="hover:underline">
                            {opt.title} ↗
                          </a>
                        ) : (
                          opt.title
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-3">
                        {opt.vendor}
                        {opt.note ? ` · ${opt.note}` : ""}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3 text-ink-2">{opt.scope}</td>
                    <td className="py-2.5 pr-3">
                      {opt.settles.map((id) => (
                        <span key={id} className="mr-1 font-mono text-[10px] text-ink-3" title={nodeLabel(ledger, id)}>
                          {id}
                        </span>
                      ))}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-right font-mono tabular-nums text-ink">
                      {opt.price}
                    </td>
                    <td className="whitespace-nowrap py-2.5 text-right text-ink-2">{opt.delivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg border border-accent/40 bg-accent-wash p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
              Delphi recommends
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{a.recommendation}</p>
          </div>
        </div>
      );

    case "mentor":
      return (
        <div>
          <div className="card rounded-xl p-4">
            <p className="font-display text-sm font-medium text-ink">{a.profile.name}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-3">{a.profile.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">{a.profile.bio}</p>
            <p className="mt-2 font-mono text-[11px] text-ink-3">{a.profile.engagement}</p>
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            The agenda — five questions, each mapped to the fact it settles
          </p>
          <ol className="mt-2 space-y-3">
            {a.agenda.map((item, i) => (
              <li key={item.question} className="flex gap-3">
                <span className="mt-0.5 w-4 shrink-0 text-right font-mono text-xs tabular-nums text-ink-faint">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed text-ink">{item.question}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">
                    <span className="font-mono" title={nodeLabel(ledger, item.nodeId)}>
                      → {item.nodeId}
                    </span>{" "}
                    · {item.moves}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <LabeledLineBlock label="Deliverable">{a.deliverable}</LabeledLineBlock>
        </div>
      );

    case "argus":
      return (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-hairline text-left text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  <th className="py-1.5 pr-3 font-medium">Signal</th>
                  <th className="py-1.5 pr-3 font-medium">Feed</th>
                  <th className="py-1.5 pr-3 font-medium">Alert threshold</th>
                  <th className="py-1.5 text-right font-medium">Cadence</th>
                </tr>
              </thead>
              <tbody>
                {a.watch.map((w) => (
                  <tr key={w.signal} className="border-b border-hairline align-top">
                    <td className="py-2.5 pr-3 text-ink">{w.signal}</td>
                    <td className="py-2.5 pr-3 text-ink-3">{w.feed}</td>
                    <td className="py-2.5 pr-3 font-mono text-[11px] text-ink-2">{w.threshold}</td>
                    <td className="whitespace-nowrap py-2.5 text-right text-ink-2">{w.cadence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <LabeledLineBlock label="Escalation">{a.escalation}</LabeledLineBlock>
          {/* The mock alert — one static simulation, clearly labeled. */}
          <div className="mt-4 rounded-lg border border-hairline-strong bg-well p-4">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-warning" />
              {a.mockAlert.label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink">“{a.mockAlert.feedItem}”</p>
            <p className="mt-1 text-[11px] text-ink-3">{a.mockAlert.source}</p>
            <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <LabeledLine label="Tripped">{a.mockAlert.tripped}</LabeledLine>
              <LabeledLine label="What Argus does">{a.mockAlert.effect}</LabeledLine>
            </div>
          </div>
        </div>
      );

    case "daedalus":
      return (
        <div>
          <p className="max-w-3xl text-sm leading-relaxed text-ink">{a.objective}</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {a.workstreams.map((w) => (
              <div key={w.name} className="card rounded-xl p-4">
                <p className="text-xs font-medium text-ink">{w.name}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{w.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-x-8 gap-y-4 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Milestones
              </p>
              <ul className="mt-2 space-y-1.5">
                {a.milestones.map((m) => (
                  <li key={m.when} className="flex gap-3 text-xs">
                    <span className="w-16 shrink-0 font-mono tabular-nums text-ink-3">{m.when}</span>
                    <span className="text-ink-2">{m.what}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] tabular-nums">
                <span className="rounded border border-hairline bg-card px-2 py-1 text-ink-2">{a.budget}</span>
                <span className="rounded border border-hairline bg-card px-2 py-1 text-ink-2">{a.resourcing}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  Leading indicators — is it working?
                </p>
                <ul className="mt-2 space-y-1 text-xs text-ink-2">
                  {a.leadingIndicators.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden className="text-positive">↗</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  Kill criteria — when to stop
                </p>
                <ul className="mt-2 space-y-1 text-xs text-ink-2">
                  {a.killCriteria.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden className="text-negative">✕</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );

    case "themis":
      return (
        <div className="max-w-3xl">
          <p className="text-sm leading-relaxed text-ink-2">{a.acceptance}</p>
          <div className="mt-4 space-y-3">
            <LabeledLine label="Max regret — the bound">{a.maxRegretNote}</LabeledLine>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Revisit triggers — Argus watches these
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-ink-2">
                {a.revisitTriggers.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden className="text-ink-faint">⚑</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <LabeledLine label="Sunset">{a.sunset}</LabeledLine>
              <LabeledLine label="Sign-off">{a.signoff}</LabeledLine>
            </div>
          </div>
        </div>
      );
  }
}

function LabeledLineBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

// ── The model after — projectAction rendered ─────────────────────────────────

const METRIC_LABEL = { tam: "TAM", sam: "SAM", yam: "YAM" } as const;

function ModelAfter({
  memo,
  ledger,
  state,
  retired,
}: {
  memo: Memo;
  ledger: Ledger;
  state: ScenarioState;
  retired: number;
}) {
  const projected = useMemo(
    () => projectAction(ledger, state.current, memo.projection.ops),
    [ledger, state.current, memo.projection.ops],
  );
  const funnelMoved =
    Math.abs(projected.after.tam - projected.before.tam) > 1e-9 ||
    Math.abs(projected.after.yam - projected.before.yam) > 1e-9;

  return (
    <div className="mt-3">
      <p className="max-w-3xl text-xs leading-relaxed text-ink-2">{memo.projection.note}</p>

      {memo.projection.ops.length > 0 ? (
        <div className="mt-4 space-y-2">
          {funnelMoved ? (
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs tabular-nums text-ink-2">
              {(["tam", "sam", "yam"] as const).map((m) => (
                <span key={m}>
                  {METRIC_LABEL[m]} {formatEUR(projected.before[m])}
                  <span className="text-ink-faint"> → </span>
                  {formatEUR(projected.after[m])}
                </span>
              ))}
            </div>
          ) : null}
          {projected.nodes.map((n) => (
            <div
              key={n.nodeId}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-lg border border-hairline bg-well px-3 py-2"
            >
              <span className="text-xs text-ink" title={n.nodeId}>
                {nodeLabel(ledger, n.nodeId)}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-ink-2">
                possible swing on {METRIC_LABEL[n.metric]}: ±{formatEUR(n.swingBefore)}
                <span className="text-ink-faint"> → </span>±{formatEUR(n.swingAfter)}
              </span>
              {n.voiBefore > 1e-9 ? (
                <span className="font-mono text-[11px] tabular-nums text-ink-2">
                  value of information: {formatEUR(n.voiBefore)}
                  <span className="text-ink-faint"> → </span>
                  {formatEUR(n.voiAfter)}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-4 font-mono text-xs tabular-nums text-ink">
        {memo.projection.retirement === "settles" ? (
          <>Executing settles the question — {formatEUR(retired)} of expected Year-1 loss comes off the register.</>
        ) : memo.projection.retirement === "mitigates" ? (
          retired > 1e-9 ? (
            <>Executing retires {formatEUR(retired)} of expected Year-1 loss on the projected model.</>
          ) : (
            <>
              Executing moves the downside band, not today&rsquo;s expected loss — the worst case
              rises off the floor (the swing line above), which severity pricing does not yet
              capture.
            </>
          )
        ) : memo.projection.retirement === "bounds" ? (
          <>Retires €0 — the acceptance bounds the regret; it does not shrink it.</>
        ) : (
          <>Retires €0 — watching moves nothing until the world does.</>
        )}
      </p>
    </div>
  );
}
