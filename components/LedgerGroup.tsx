"use client";

import type { FactNode, Ledger, Scenario } from "@/lib/schema";
import type { SectionId } from "@/lib/ledgerView";
import type { ScenarioAction } from "@/lib/useScenario";
import { boundsFor } from "@/lib/levers";
import { formatEUR } from "@/lib/format";
import LedgerRow from "@/components/LedgerRow";
import AssumptionSlider from "@/components/AssumptionSlider";

// ─────────────────────────────────────────────────────────────────────────────
// LedgerGroup — one funnel card (improve-ledger.md §2.2).
//   share dimensions → header (Σ 100% · n facts) + aligned LedgerRows
//   assumption       → the existing inline sliders, each with its → SAM/YAM result
// No € subtotal: each dimension partitions the SAME TAM, so a per-card total
// would mislead (see honesty note in FactsLedger).
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  section: SectionId;
  label: string;
  nodes: FactNode[];
  ledger: Ledger;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
  onSelect: (id: string) => void;
  selectedNodeId: string | null;
  sam: number;
  yam: number;
}

function CardShell({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-xl p-4">
      <header className="mb-1 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-300">{label}</h3>
        {right}
      </header>
      {children}
    </section>
  );
}

export default function LedgerGroup({
  section,
  label,
  nodes,
  ledger,
  scenario,
  dispatch,
  onSelect,
  selectedNodeId,
  sam,
  yam,
}: Props) {
  if (section === "assumption") {
    return (
      <CardShell label={label}>
        <div>
          {nodes.map((n) => {
            const result =
              n.id === "serviceableFactor"
                ? `→ SAM ${formatEUR(sam)}`
                : n.id === "obtainableFactor"
                  ? `→ YAM ${formatEUR(yam)}`
                  : "";
            return (
              <div key={n.id} className="border-b border-white/5 py-2 last:border-0">
                <div className="flex items-baseline justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect(n.id)}
                    className="truncate text-left text-sm text-neutral-200 hover:text-sky-300"
                  >
                    {n.label}
                  </button>
                  <span className="shrink-0 font-mono text-[11px] text-sky-300/80">{result}</span>
                </div>
                <div className="mt-1.5">
                  <AssumptionSlider
                    id={`ledger-${n.id}`}
                    label={n.label}
                    value={scenario.assumptions[n.id] ?? n.value}
                    band={n.sensitivityRange}
                    hideLabel
                    {...boundsFor(n.id)}
                    onChange={(v) => dispatch({ type: "setAssumption", id: n.id, value: v })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardShell>
    );
  }

  // Share dimensions (geography / segment / customerType).
  return (
    <CardShell
      label={label}
      right={
        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
          <span className="rounded-full border border-white/10 px-1.5 py-0.5 tabular-nums">
            Σ 100%
          </span>
          <span className="tabular-nums">{nodes.length} facts</span>
        </div>
      }
    >
      <ul>
        {nodes.map((n) => (
          <LedgerRow
            key={n.id}
            node={n}
            ledger={ledger}
            scenario={scenario}
            onSelect={onSelect}
            selected={n.id === selectedNodeId}
            variant="card"
          />
        ))}
      </ul>
    </CardShell>
  );
}
