"use client";

import { useEffect, useMemo, useState } from "react";
import type { Ledger } from "@/lib/schema";
import type { ScenarioState } from "@/lib/useScenario";
import { risks } from "@/lib/risks";
import { memos } from "@/lib/nextSteps";
import { TOOLKIT, RESPONSE_TOOL } from "@/lib/toolkit";
import { rankRisks } from "@/lib/riskCompute";
import { retiredExposure } from "@/lib/projection";
import Campaign from "@/components/nextsteps/Campaign";
import MemoView from "@/components/nextsteps/MemoView";
import EgeriaWorkspace from "@/components/nextsteps/egeria/EgeriaWorkspace";
import type { MemoRow } from "@/components/nextsteps/types";

// ─────────────────────────────────────────────────────────────────────────────
// NextSteps — workspace surface #8: the Innovera toolkit in action. Shell
// only: nav state, keyboard, and the live memo↔register join. The views live
// in components/nextsteps/: most responses use MemoView; Egeria branches into
// its own Risk -> Match -> Brief -> Book workspace.
// Register design language throughout; every € figure is engine-computed
// against the current levers (rankRisks, projectAction, retiredExposure) —
// the data module carries narrative and projection ops.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ledger: Ledger;
  state: ScenarioState;
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
  const activeRow = view > 0 ? rows[view - 1] : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("button, input, textarea, select")) return;
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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <StepNav view={view} rows={rows} onGo={go} />
      {view === 0 ? (
        <Campaign ledger={ledger} rows={rows} totalExposure={totalExposure} onOpen={go} />
      ) : activeRow?.memo.artifact.kind === "egeria" ? (
        <EgeriaWorkspace
          row={activeRow}
          ledger={ledger}
          totalExposure={totalExposure}
          onBackToCampaign={() => go(0)}
        />
      ) : activeRow ? (
        <MemoView
          row={activeRow}
          index={view}
          count={rows.length}
          ledger={ledger}
          state={state}
          totalExposure={totalExposure}
        />
      ) : null}
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
        <div className="flex items-center gap-2" role="tablist" aria-label="Responses">
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
