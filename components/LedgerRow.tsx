"use client";

import type { FactNode, Ledger, Scenario } from "@/lib/schema";
import { DIMENSION_LABELS } from "@/lib/dimensions";
import { formatEUR, formatPct } from "@/lib/format";
import { marginalContribution } from "@/lib/contribution";
import {
  Badge,
  ConfidenceDot,
  KIND_STYLE,
  MATURITY_LABEL,
  MATURITY_STYLE,
} from "@/lib/badges";
import { isExcluded, shareWidth } from "@/lib/ledgerView";

// ─────────────────────────────────────────────────────────────────────────────
// LedgerRow — one fact, two layouts (improve-ledger.md §2.2 / §2.3).
//   variant="card" → a row inside a dimension card (label · maturity · share bar
//                    · % · € now · trust dot)
//   variant="row"  → a <tr> for the flat Ranked table
// The per-fact derivation (excluded check, € now, trust dot) is shared so the
// two views never disagree. Read-only: € now is the EXISTING marginalContribution.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  node: FactNode;
  ledger: Ledger;
  scenario: Scenario;
  onSelect: (id: string) => void;
  selected: boolean;
  variant?: "card" | "row";
  voi?: number;
}

function renderValue(node: FactNode): string {
  if (node.unit === "EUR_M") return formatEUR(node.value);
  if (node.unit === "ratio") return formatPct(node.value, node.value < 0.1 ? 1 : 0);
  return `${node.value} ${node.unit}`;
}

// € now = each fact's marginal slice of TAM at the current scope (§3). Filter
// leaves only; base/assumption have no on/off so they return null (shown "—").
function euroNow(
  ledger: Ledger,
  scenario: Scenario,
  node: FactNode,
  excluded: boolean,
  compact: boolean,
): string | null {
  const isFilterLeaf = Boolean(node.dimension && node.dimensionValue);
  if (!isFilterLeaf) return null;
  const c = marginalContribution(ledger, scenario, node.id, "tam");
  if (excluded) {
    const add = `+${formatEUR(Math.abs(c))}`;
    return compact ? add : `${add} if included`;
  }
  return formatEUR(c); // included → c > 0 → "€336M"
}

export default function LedgerRow({
  node,
  ledger,
  scenario,
  onSelect,
  selected,
  variant = "card",
  voi = 0,
}: Props) {
  const excluded = isExcluded(node, scenario);

  if (variant === "row") {
    const now = euroNow(ledger, scenario, node, excluded, true);
    return (
      <tr
        onClick={() => onSelect(node.id)}
        className={`cursor-pointer border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02] ${
          selected ? "bg-sky-500/[0.06]" : ""
        } ${excluded ? "opacity-50 saturate-50" : ""}`}
      >
        <td className="truncate py-1.5 pr-2">
          <span
            className={`text-sm ${excluded ? "text-neutral-400 line-through" : "text-neutral-200"}`}
          >
            {node.label}
          </span>
        </td>
        <td className="px-2 text-xs text-neutral-400">
          {node.dimension ? DIMENSION_LABELS[node.dimension] : "—"}
        </td>
        <td className="px-2">
          <Badge className={KIND_STYLE[node.kind]}>{node.kind}</Badge>
        </td>
        <td className="px-2">
          {node.maturity ? (
            <Badge className={MATURITY_STYLE[node.maturity]}>{MATURITY_LABEL[node.maturity]}</Badge>
          ) : (
            <span className="text-neutral-600">—</span>
          )}
        </td>
        <td className="px-2 text-right font-mono text-xs tabular-nums text-neutral-200">
          {renderValue(node)}
        </td>
        <td className="px-2 text-right font-mono text-xs tabular-nums text-neutral-400">
          {now ?? "—"}
        </td>
        <td className="pl-2 text-right font-mono text-xs tabular-nums text-neutral-400">
          {voi > 0 ? formatEUR(voi) : "—"}
        </td>
      </tr>
    );
  }

  // variant === "card"
  const now = euroNow(ledger, scenario, node, excluded, false);
  return (
    <li
      className={`border-b border-white/5 last:border-0 ${selected ? "bg-sky-500/[0.06]" : ""}`}
      style={{ transition: "opacity 0.4s ease, background-color 0.2s ease" }}
    >
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={`flex w-full items-center gap-2 py-1.5 text-left ${
          excluded ? "opacity-50 saturate-50" : ""
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate text-sm ${
            excluded ? "text-neutral-400 line-through" : "text-neutral-200"
          }`}
        >
          {node.label}
        </span>
        {node.maturity ? (
          <Badge className={`hidden shrink-0 sm:inline ${MATURITY_STYLE[node.maturity]}`}>
            {MATURITY_LABEL[node.maturity]}
          </Badge>
        ) : null}
        {/* thin share bar */}
        <span className="hidden h-1 w-14 shrink-0 overflow-hidden rounded-full bg-white/5 md:block">
          <span
            className="block h-full rounded-full bg-neutral-400/50"
            style={{ width: shareWidth(node.value) }}
          />
        </span>
        {/* % */}
        <span className="w-11 shrink-0 text-right font-mono text-xs tabular-nums text-neutral-300">
          {formatPct(node.value, node.value < 0.1 ? 1 : 0)}
        </span>
        {/* € now */}
        <span className="w-32 shrink-0 whitespace-nowrap text-right font-mono text-xs tabular-nums text-neutral-500">
          {now}
        </span>
        <ConfidenceDot confidence={node.confidence} />
      </button>
    </li>
  );
}
