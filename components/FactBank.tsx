"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FactNode, Ledger } from "@/lib/schema";
import type { Risk } from "@/lib/riskSchema";
import type { ScenarioAction, ScenarioState } from "@/lib/useScenario";
import { informationValue, swingTam } from "@/lib/voi";
import { formatEUR } from "@/lib/format";
import EquationStrip, { type EquationTerm } from "@/components/EquationStrip";
import FactBankTable from "@/components/FactBankTable";
import FactDetail from "@/components/FactDetail";

// ─────────────────────────────────────────────────────────────────────────────
// FactBank — the centerpiece page the guided flow lands on before the
// dashboard. Top: the whole model as one live equation with its levers.
// Middle: what to verify next. Bottom: the grouped fact table, master-detail
// with the dossier. Scenario state is shared with the dashboard (lifted to
// app/page.tsx), so lever changes on either surface stay in sync.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ledger: Ledger;
  state: ScenarioState;
  dispatch: React.Dispatch<ScenarioAction>;
  onOpenDashboard: () => void;
  risks?: Risk[]; // register errors feed the Verify-next refinement queue
}

// Which equation term a fact feeds — drives hover/selection highlighting.
function termOf(node: FactNode | null | undefined): EquationTerm | null {
  if (!node) return null;
  if (node.id === "tamBase") return "base";
  if (node.dimension) return node.dimension;
  if (node.id === "serviceableFactor") return "serviceable";
  if (node.id === "obtainableFactor") return "obtainable";
  return null; // shape facts sit outside the funnel
}

export default function FactBank({ ledger, state, dispatch, onOpenDashboard, risks }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<FactNode | null>(null);
  const node = selectedId ? (ledger.find((n) => n.id === selectedId) ?? null) : null;

  // Esc closes the detail panel.
  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node]);

  // Keep the dossier visible: below lg the panel renders ABOVE the table
  // (order-first), so clicking a low row would leave it off-screen — scroll
  // it into view. When the panel is already visible (lg sticky), fall back
  // to keeping the selected row visible for lineage navigation.
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!selectedId) return;
    const panel = panelRef.current;
    if (panel) {
      const r = panel.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight - 160) {
        panel.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
    }
    document.getElementById(`fb-row-${selectedId}`)?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const stats = useMemo(() => {
    const total = ledger.length;
    const crossChecked = ledger.filter(
      (n) => n.maturity === "verified" || n.maturity === "triangulated",
    ).length;
    const flagged = ledger.filter((n) => n.maturity === "needs-source").length;
    const sources = ledger.reduce(
      (acc, n) => acc + (n.evidence?.filter((e) => e.attached).length ?? (n.source ? 1 : 0)),
      0,
    );
    return { total, crossChecked, flagged, sources };
  }, [ledger]);

  // Facts the risk engine flagged as ERRORS (with a concrete hypothesis) —
  // these jump the verification queue: a targeted doubt beats a generic band.
  const errorByNode = useMemo(() => {
    const map = new Map<string, Risk>();
    for (const r of risks ?? []) {
      if (r.resolution !== "error") continue;
      const nodeId = r.proposedCorrection?.nodeId ?? r.targetNodes[0];
      if (nodeId && !map.has(nodeId)) map.set(nodeId, r);
    }
    return map;
  }, [risks]);

  // Verification targets: error-flagged facts first, then biggest swing ×
  // weakest evidence (VOI).
  const verifyNext = useMemo(() => {
    const byVoi = ledger
      .map((n) => ({ node: n, voi: informationValue(ledger, state.current, n.id) }))
      .sort((a, b) => b.voi - a.voi);
    const flagged = byVoi.filter((x) => errorByNode.has(x.node.id));
    const rest = byVoi.filter((x) => !errorByNode.has(x.node.id) && x.voi > 0);
    return [...flagged, ...rest].slice(0, 4).map((x) => ({
      node: x.node,
      swing: swingTam(ledger, state.current, x.node.id),
      error: errorByNode.get(x.node.id) ?? null,
    }));
  }, [ledger, state.current, errorByNode]);

  const highlightTerm = termOf(hoveredNode) ?? termOf(node);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
            Fact bank
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
            Every number, on the record
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Every input behind TAM, SAM and YAM — its sources, its method, and what it moves.{" "}
            <span className="text-ink-3">
              {stats.total} inputs · {stats.sources} sources attached · {stats.crossChecked}{" "}
              cross-checked · {stats.flagged} flagged for sourcing
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenDashboard}
          className="shrink-0 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-ink"
        >
          Open the dashboard →
        </button>
      </header>

      <EquationStrip
        ledger={ledger}
        state={state}
        dispatch={dispatch}
        highlightTerm={highlightTerm}
      />

      {/* What to check next — value-of-information, made legible. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
          Verify next
        </span>
        {verifyNext.map(({ node: n, swing, error }) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelectedId(n.id)}
            title={error ? `Risk engine: ${error.title}` : undefined}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors hover:border-accent/40 hover:text-accent-ink ${
              error
                ? "border-fact-red-line bg-fact-red-tint text-ink-2"
                : "border-hairline bg-card text-ink-2"
            }`}
          >
            <span className="mr-1 text-fact-red">{error ? "▲" : "⚑"}</span>
            {n.label} ·{" "}
            {error?.proposedCorrection
              ? `flagged: likely ${error.proposedCorrection.value}, not ${n.value}`
              : `up to ±${formatEUR(swing)} on TAM`}
          </button>
        ))}
      </div>

      <div
        className={
          node
            ? "mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:items-start"
            : "mt-6"
        }
      >
        <div>
          <FactBankTable
            ledger={ledger}
            scenario={state.current}
            dispatch={dispatch}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
            onHoverNode={setHoveredNode}
            condensed={Boolean(node)}
          />
        </div>

        <AnimatePresence mode="popLayout">
          {node ? (
            <motion.div
              key="detail"
              ref={panelRef}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="card order-first overflow-hidden rounded-xl p-0 lg:order-none lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"
            >
              <FactDetail
                variant="panel"
                node={node}
                ledger={ledger}
                scenario={state.current}
                onSelect={setSelectedId}
                onClose={() => setSelectedId(null)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
