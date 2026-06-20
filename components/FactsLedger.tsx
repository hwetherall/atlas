"use client";

import { useMemo, useState } from "react";
import type {
  Confidence,
  Dimension,
  FactNode,
  Ledger,
  NodeKind,
  Scenario,
} from "@/lib/schema";
import { labelFor } from "@/lib/dimensions";
import { boundsFor } from "@/lib/levers";
import { formatEUR, formatPct } from "@/lib/format";
import {
  Badge,
  KIND_STYLE,
  CONFIDENCE_STYLE,
  MATURITY_STYLE,
  MATURITY_LABEL,
} from "@/lib/badges";
import { informationValue } from "@/lib/voi";
import type { ScenarioAction } from "@/lib/useScenario";
import AssumptionSlider from "@/components/AssumptionSlider";

interface Props {
  ledger: Ledger;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
  onSelect: (id: string) => void;
  selectedNodeId: string | null;
}

const DIM_FIELD: Record<Dimension, "geographies" | "segments" | "customerTypes"> = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
};

const CONF_RANK: Record<Confidence, number> = { verified: 2, inferred: 1, unknown: 0 };

const KINDS: NodeKind[] = ["extracted", "estimated", "calculated", "assumption"];
const CONFIDENCES: Confidence[] = ["verified", "inferred", "unknown"];

type SortKey = "default" | "value" | "confidence" | "voi";

function renderValue(node: FactNode): string {
  if (node.unit === "EUR_M") return formatEUR(node.value);
  if (node.unit === "ratio") return formatPct(node.value, node.value < 0.1 ? 1 : 0);
  return `${node.value} ${node.unit}`;
}

// A filter leaf is excluded when its dimensionValue is not in the scenario's
// selection for its dimension. Excluded rows dim live with the levers (§7.2).
function isExcluded(node: FactNode, scenario: Scenario): boolean {
  if (!node.dimension || !node.dimensionValue) return false;
  return !scenario[DIM_FIELD[node.dimension]].includes(node.dimensionValue);
}

function Row({
  node,
  scenario,
  dispatch,
  onSelect,
  selected,
}: {
  node: FactNode;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  const isAssumption = node.kind === "assumption";
  const missingSource = node.kind === "extracted" && !node.source?.title;
  const excluded = isExcluded(node, scenario);

  return (
    <li
      className={`border-b border-white/5 last:border-0 ${
        selected ? "bg-sky-500/[0.06]" : ""
      }`}
      style={{ transition: "opacity 0.4s ease, background-color 0.2s ease" }}
    >
      <div
        className={`flex items-center gap-3 py-2 ${
          excluded ? "opacity-40 saturate-50" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span
            className={`truncate text-sm ${
              excluded ? "text-neutral-400 line-through" : "text-neutral-200"
            }`}
          >
            {node.label}
          </span>
          <Badge className={KIND_STYLE[node.kind]}>{node.kind}</Badge>
          {node.maturity ? (
            <Badge className={`hidden md:inline ${MATURITY_STYLE[node.maturity]}`}>
              {MATURITY_LABEL[node.maturity]}
            </Badge>
          ) : null}
          {missingSource ? (
            <Badge className="border-rose-500/50 text-rose-300">missing source</Badge>
          ) : null}
        </button>

        <div className="w-40 shrink-0">
          {isAssumption ? (
            // Keep the slider interactive without opening the inspector.
            <div onClick={(e) => e.stopPropagation()}>
              <AssumptionSlider
                id={`ledger-${node.id}`}
                label={node.label}
                value={scenario.assumptions[node.id] ?? node.value}
                band={node.sensitivityRange}
                hideLabel
                hideBand
                {...boundsFor(node.id)}
                onChange={(v) => dispatch({ type: "setAssumption", id: node.id, value: v })}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(node.id)}
              className="block w-full text-right font-mono text-sm tabular-nums text-neutral-100"
            >
              {renderValue(node)}
            </button>
          )}
        </div>

        <div className="hidden w-20 shrink-0 text-center sm:block">
          <Badge className={CONFIDENCE_STYLE[node.confidence]}>{node.confidence}</Badge>
        </div>
      </div>
    </li>
  );
}

// A small toggle chip for the kind / confidence filters.
function FilterChip({
  label,
  active,
  className,
  onClick,
}: {
  label: string;
  active: boolean;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-opacity ${className} ${
        active ? "" : "opacity-30 line-through"
      }`}
    >
      {label}
    </button>
  );
}

export default function FactsLedger({
  ledger,
  scenario,
  dispatch,
  onSelect,
  selectedNodeId,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [hiddenKinds, setHiddenKinds] = useState<Set<NodeKind>>(new Set());
  const [hiddenConf, setHiddenConf] = useState<Set<Confidence>>(new Set());

  // VOI per node, live with the levers — drives the "Riskiest first" sort.
  const voiById = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of ledger) m.set(n.id, informationValue(ledger, scenario, n.id));
    return m;
  }, [ledger, scenario]);

  const rows = useMemo(() => {
    const list = ledger.filter(
      (n) => !hiddenKinds.has(n.kind) && !hiddenConf.has(n.confidence),
    );
    switch (sortKey) {
      case "value":
        return [...list].sort((a, b) => b.value - a.value);
      case "confidence":
        return [...list].sort((a, b) => CONF_RANK[b.confidence] - CONF_RANK[a.confidence]);
      case "voi":
        return [...list].sort((a, b) => (voiById.get(b.id) ?? 0) - (voiById.get(a.id) ?? 0));
      default:
        return list; // ledger order (filter preserves order)
    }
  }, [ledger, hiddenKinds, hiddenConf, sortKey, voiById]);

  function toggle<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  return (
    <section className="glass-panel rounded-xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-semibold text-neutral-200">Facts ledger</h2>
        <p className="text-xs text-neutral-500">
          The levers are facts. Click a row to inspect; assumption leaves are editable inline.
        </p>
      </div>

      {/* Controls — local view state only; never recomputes the model. */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-white/5 pb-3 text-xs">
        <label className="flex items-center gap-1.5 text-neutral-500">
          Sort
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
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
          onClick={() => setSortKey("voi")}
          className={`rounded-md border px-2 py-1 text-xs transition-colors ${
            sortKey === "voi"
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
              className={CONFIDENCE_STYLE[c]}
              onClick={() => setHiddenConf((s) => toggle(s, c))}
            />
          ))}
        </div>
      </div>

      <ul className="mt-1">
        {rows.map((node) => (
          <Row
            key={node.id}
            node={node}
            scenario={scenario}
            dispatch={dispatch}
            onSelect={onSelect}
            selected={node.id === selectedNodeId}
          />
        ))}
        {rows.length === 0 ? (
          <li className="py-6 text-center text-xs text-neutral-600">
            No facts match the current filters.
          </li>
        ) : null}
      </ul>
    </section>
  );
}
