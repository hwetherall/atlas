"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Confidence, FactNode, Ledger, NodeKind, Scenario } from "@/lib/schema";
import { labelFor } from "@/lib/dimensions";
import { boundsFor } from "@/lib/levers";
import { formatEUR, formatPct } from "@/lib/format";
import type { ScenarioAction } from "@/lib/useScenario";
import AssumptionSlider from "@/components/AssumptionSlider";

interface Props {
  ledger: Ledger;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
}

const KIND_STYLE: Record<NodeKind, string> = {
  extracted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  estimated: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  calculated: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  assumption: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

const CONFIDENCE_STYLE: Record<Confidence, string> = {
  verified: "border-emerald-500/40 text-emerald-300",
  inferred: "border-amber-500/40 text-amber-300",
  unknown: "border-rose-500/40 text-rose-300",
};

function renderValue(node: FactNode): string {
  if (node.unit === "EUR_M") return formatEUR(node.value);
  if (node.unit === "ratio") return formatPct(node.value, node.value < 0.1 ? 1 : 0);
  return `${node.value} ${node.unit}`;
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${className}`}>
      {children}
    </span>
  );
}

function Row({
  node,
  scenario,
  dispatch,
}: {
  node: FactNode;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
}) {
  const [open, setOpen] = useState(false);
  const isAssumption = node.kind === "assumption";
  const missingSource = node.kind === "extracted" && !node.source?.title;

  return (
    <li className="border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <motion.span 
            className="text-neutral-500"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▸
          </motion.span>
          <span className="truncate text-sm text-neutral-200">{node.label}</span>
          <Badge className={KIND_STYLE[node.kind]}>{node.kind}</Badge>
          {missingSource ? (
            <Badge className="border-rose-500/50 text-rose-300">missing source</Badge>
          ) : null}
        </button>

        <div className="w-40 shrink-0">
          {isAssumption ? (
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
          ) : (
            <span className="block text-right font-mono text-sm tabular-nums text-neutral-100">
              {renderValue(node)}
            </span>
          )}
        </div>

        <div className="hidden w-20 shrink-0 text-center sm:block">
          <Badge className={CONFIDENCE_STYLE[node.confidence]}>{node.confidence}</Badge>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-6 mb-2 space-y-1 text-xs text-neutral-400">
              {node.source ? (
                <div>
                  <span className="text-neutral-500">Source: </span>
                  {node.source.url ? (
                    <a
                      href={node.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 underline transition-colors hover:text-sky-300"
                    >
                      {node.source.title ?? node.source.url}
                    </a>
                  ) : (
                    <span className="text-neutral-300">
                      {node.source.title ?? node.source.note}
                    </span>
                  )}
                  {node.source.note && node.source.title ? (
                    <span className="text-neutral-500"> — {node.source.note}</span>
                  ) : null}
                </div>
              ) : (
                <div className="text-neutral-500">No source attached.</div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-neutral-500">
                <span>id: {node.id}</span>
                <span>asOf: {node.asOf}</span>
                {node.dimension ? (
                  <span>
                    {node.dimension}: {labelFor(node.dimension, node.dimensionValue ?? "")}
                  </span>
                ) : null}
                {node.op ? <span>op: {node.op}({(node.inputs ?? []).join(", ")})</span> : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function FactsLedger({ ledger, scenario, dispatch }: Props) {
  return (
    <section className="glass-panel rounded-xl p-5">
      <h2 className="text-sm font-semibold text-neutral-200">Facts ledger</h2>
      <p className="mt-0.5 text-xs text-neutral-500">
        The levers are facts. Click a row for sourcing; assumption leaves are
        editable inline.
      </p>
      <ul className="mt-3">
        {ledger.map((node) => (
          <Row key={node.id} node={node} scenario={scenario} dispatch={dispatch} />
        ))}
      </ul>
    </section>
  );
}
