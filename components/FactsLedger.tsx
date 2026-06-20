"use client";

import { useMemo, useState } from "react";
import type { Confidence, Ledger, NodeKind, Scenario } from "@/lib/schema";
import { evaluate } from "@/lib/compute";
import { formatEUR } from "@/lib/format";
import {
  FilterChip,
  KIND_STYLE,
  CONFIDENCE_STYLE,
} from "@/lib/badges";
import { informationValue } from "@/lib/voi";
import { groupBySection, sectionOf } from "@/lib/ledgerView";
import type { ScenarioAction } from "@/lib/useScenario";
import LedgerGroup from "@/components/LedgerGroup";
import LedgerRow from "@/components/LedgerRow";

interface Props {
  ledger: Ledger;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
  onSelect: (id: string) => void;
  selectedNodeId: string | null;
}

const CONF_RANK: Record<Confidence, number> = { verified: 2, inferred: 1, unknown: 0 };

const KINDS: NodeKind[] = ["extracted", "estimated", "calculated", "assumption"];
const CONFIDENCES: Confidence[] = ["verified", "inferred", "unknown"];

type SortKey = "default" | "value" | "confidence" | "voi";
type View = "funnel" | "ranked";

export default function FactsLedger({
  ledger,
  scenario,
  dispatch,
  onSelect,
  selectedNodeId,
}: Props) {
  const [view, setView] = useState<View>("funnel");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [hiddenKinds, setHiddenKinds] = useState<Set<NodeKind>>(new Set());
  const [hiddenConf, setHiddenConf] = useState<Set<Confidence>>(new Set());

  // Shape facts live in ShapeStrip — keep them out of the ledger entirely (§2.2).
  const ledgerNoShape = useMemo(() => ledger.filter((n) => sectionOf(n) !== "shape"), [ledger]);

  // Counts (over the shape-filtered ledger) to gray out empty filter categories (§5).
  const counts = useMemo(() => {
    const kind = {} as Record<NodeKind, number>;
    const conf = {} as Record<Confidence, number>;
    for (const n of ledgerNoShape) {
      kind[n.kind] = (kind[n.kind] ?? 0) + 1;
      conf[n.confidence] = (conf[n.confidence] ?? 0) + 1;
    }
    return { kind, conf };
  }, [ledgerNoShape]);

  // VOI per node, live with the levers — drives the "Riskiest first" sort + column.
  const voiById = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of ledger) m.set(n.id, informationValue(ledger, scenario, n.id));
    return m;
  }, [ledger, scenario]);

  // SAM / YAM for the assumption card's inline "→ SAM/YAM" results.
  const totals = useMemo(() => evaluate(ledger, scenario), [ledger, scenario]);

  const visible = useMemo(
    () => ledgerNoShape.filter((n) => !hiddenKinds.has(n.kind) && !hiddenConf.has(n.confidence)),
    [ledgerNoShape, hiddenKinds, hiddenConf],
  );

  const baseNode = useMemo(() => ledger.find((n) => n.id === "tamBase"), [ledger]);

  // "By funnel" groups (base is rendered as a header stat, not a card).
  const groups = useMemo(
    () => groupBySection(visible).filter((g) => g.section !== "base"),
    [visible],
  );
  const shareGroups = groups.filter((g) => g.section !== "assumption");
  const assumptionGroup = groups.find((g) => g.section === "assumption");

  // "Ranked" flat list.
  const ranked = useMemo(() => {
    const list = [...visible];
    switch (sortKey) {
      case "value":
        return list.sort((a, b) => b.value - a.value);
      case "confidence":
        return list.sort((a, b) => CONF_RANK[b.confidence] - CONF_RANK[a.confidence]);
      case "voi":
        return list.sort((a, b) => (voiById.get(b.id) ?? 0) - (voiById.get(a.id) ?? 0));
      default:
        return list; // ledger order
    }
  }, [visible, sortKey, voiById]);

  function toggle<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  // Sort / "Riskiest first" imply the Ranked view; "Default order" returns to cards.
  function chooseSort(k: SortKey) {
    setSortKey(k);
    setView(k === "default" ? "funnel" : "ranked");
  }
  function chooseView(v: View) {
    setView(v);
    if (v === "funnel") setSortKey("default");
  }

  return (
    <section className="glass-panel rounded-xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-semibold text-neutral-200">Facts ledger</h2>
        <p className="text-xs text-neutral-500">
          € now = each fact&apos;s slice of TAM at the current scope — moves with the levers.
        </p>
      </div>

      {/* Controls — local view state only; never recomputes the model. */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-white/5 pb-3 text-xs">
        {/* View toggle */}
        <div className="inline-flex rounded-md border border-white/10 bg-white/[0.03] p-0.5">
          {(["funnel", "ranked"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => chooseView(v)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                view === v ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {v === "funnel" ? "By funnel" : "Ranked"}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 text-neutral-500">
          Sort
          <select
            value={sortKey}
            onChange={(e) => chooseSort(e.target.value as SortKey)}
            className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-1 text-xs text-neutral-300 outline-none focus:border-sky-400/40"
          >
            <option value="default">Default order</option>
            <option value="value">Value</option>
            <option value="confidence">Confidence</option>
            <option value="voi">Information value</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setSortKey("voi");
            setView("ranked");
          }}
          className={`rounded-md border px-2 py-1 text-xs transition-colors ${
            view === "ranked" && sortKey === "voi"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
              : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-neutral-200"
          }`}
        >
          ⚑ Riskiest first
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-1">
          {KINDS.map((k) => (
            <FilterChip
              key={k}
              label={k}
              active={!hiddenKinds.has(k)}
              disabled={(counts.kind[k] ?? 0) === 0}
              className={KIND_STYLE[k]}
              onClick={() => setHiddenKinds((s) => toggle(s, k))}
            />
          ))}
          <span className="mx-1 h-3 w-px bg-white/10" />
          {CONFIDENCES.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={!hiddenConf.has(c)}
              disabled={(counts.conf[c] ?? 0) === 0}
              className={CONFIDENCE_STYLE[c]}
              onClick={() => setHiddenConf((s) => toggle(s, c))}
            />
          ))}
        </div>
      </div>

      {/* Market base — top of the funnel, set apart as a header stat (§2.2). */}
      {baseNode ? (
        <button
          type="button"
          onClick={() => onSelect(baseNode.id)}
          className="mt-3 flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-white/20"
        >
          <div className="min-w-0">
            <div className="truncate text-sm text-neutral-200">{baseNode.label}</div>
            <div className="text-[11px] text-neutral-500">Top of the funnel · {baseNode.kind}</div>
          </div>
          <span className="shrink-0 font-mono text-lg tabular-nums text-neutral-50">
            {formatEUR(baseNode.value)}
          </span>
        </button>
      ) : null}

      {view === "funnel" ? (
        <>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {shareGroups.map((g) => (
              <LedgerGroup
                key={g.section}
                section={g.section}
                label={g.label}
                nodes={g.nodes}
                ledger={ledger}
                scenario={scenario}
                dispatch={dispatch}
                onSelect={onSelect}
                selectedNodeId={selectedNodeId}
                sam={totals.sam}
                yam={totals.yam}
              />
            ))}
          </div>
          {assumptionGroup ? (
            <div className="mt-3">
              <LedgerGroup
                section={assumptionGroup.section}
                label={assumptionGroup.label}
                nodes={assumptionGroup.nodes}
                ledger={ledger}
                scenario={scenario}
                dispatch={dispatch}
                onSelect={onSelect}
                selectedNodeId={selectedNodeId}
                sam={totals.sam}
                yam={totals.yam}
              />
            </div>
          ) : null}
          {shareGroups.length === 0 && !assumptionGroup ? (
            <p className="mt-6 text-center text-xs text-neutral-600">
              No facts match the current filters.
            </p>
          ) : null}
        </>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[16%]" />
              <col className="w-[13%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-neutral-500">
                <th className="py-1.5 pr-2 font-medium">Fact</th>
                <th className="px-2 font-medium">Dimension</th>
                <th className="px-2 font-medium">Kind</th>
                <th className="px-2 font-medium">Maturity</th>
                <th className="px-2 text-right font-medium">Value</th>
                <th className="px-2 text-right font-medium">€ now</th>
                <th className="pl-2 text-right font-medium">Info value</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((n) => (
                <LedgerRow
                  key={n.id}
                  node={n}
                  ledger={ledger}
                  scenario={scenario}
                  onSelect={onSelect}
                  selected={n.id === selectedNodeId}
                  variant="row"
                  voi={voiById.get(n.id) ?? 0}
                />
              ))}
            </tbody>
          </table>
          {ranked.length === 0 ? (
            <p className="py-6 text-center text-xs text-neutral-600">
              No facts match the current filters.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
