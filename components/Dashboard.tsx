"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import { ledger } from "@/lib/ledger"; // self-validates at module load (fails loudly at boot)
import { delta, evaluate, sensitivity } from "@/lib/compute";
import { deriveGraph } from "@/lib/graph";
import { FLAGS } from "@/lib/flags";
import type { ScenarioAction, ScenarioState } from "@/lib/useScenario";
import ScenarioControls from "@/components/ScenarioControls";
// Client-only: d3-geo produces float coordinates that differ at the 10th
// decimal between SSR and client, tripping React's hydration check. The map
// fetches its TopoJSON at runtime anyway, so SSR buys nothing.
const RegionMap = dynamic(() => import("@/components/RegionMap"), { ssr: false });
import BoundaryPanel from "@/components/BoundaryPanel";
import FunnelOutputs from "@/components/FunnelOutputs";
import DeltaPanel from "@/components/DeltaPanel";
import ShapeStrip from "@/components/ShapeStrip";
import Tornado from "@/components/Tornado";
import FactsLedger from "@/components/FactsLedger";
import FactInspector from "@/components/FactInspector";
import FactGraph from "@/components/FactGraph";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface Props {
  // Scenario state is lifted to app/page.tsx and shared with the Fact Bank.
  state: ScenarioState;
  dispatch: React.Dispatch<ScenarioAction>;
}

// Numbered band header — gives the page a scannable, report-like structure.
function SectionKicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="font-mono text-[10px] tabular-nums text-ink-faint">{n}</span>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
        {children}
      </div>
      <div className="h-px flex-1 bg-hairline" />
    </div>
  );
}

export default function Dashboard({ state, dispatch }: Props) {
  const { current: cur, baseline: base } = state;
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const current = useMemo(() => evaluate(ledger, cur), [cur]);
  const baseline = useMemo(() => evaluate(ledger, base), [base]);
  const deltaTam = useMemo(() => delta(ledger, base, cur, "tam"), [base, cur]);
  const deltaYam = useMemo(() => delta(ledger, base, cur, "yam"), [base, cur]);
  const swings = useMemo(() => sensitivity(ledger, cur, "tam"), [cur]);
  const graph = useMemo(() => deriveGraph(ledger, cur), [cur]);

  return (
    <div className="relative mx-auto max-w-6xl px-6 py-12">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start justify-between gap-4 border-b border-hairline pb-6"
      >
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink">
            Atlas — Market Size &amp; Shape
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Live, lever-driven TAM / SAM / YAM. A market size is a computation,
            never a number — pull a lever and the funnel recomputes against a
            pinned baseline.
          </p>
        </div>
      </motion.header>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {/* 01 — the answer first: outputs and the delta lead the page. */}
        <motion.section variants={itemVariants} className="mt-8">
          <SectionKicker n="01">The verdict</SectionKicker>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <FunnelOutputs current={current} baseline={baseline} />
            <DeltaPanel deltaTam={deltaTam} deltaYam={deltaYam} />
          </div>
        </motion.section>

        {/* 02 — the levers and the model they drive. */}
        <motion.section variants={itemVariants} className="mt-10">
          <SectionKicker n="02">Scenario levers &amp; model</SectionKicker>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr]">
            <div className="space-y-6">
              <ScenarioControls ledger={ledger} state={state} dispatch={dispatch} />
              <RegionMap
                ledger={ledger}
                selected={cur.geographies}
                onToggle={(value) => dispatch({ type: "toggle", dimension: "geography", value })}
              />
            </div>
            <div className="space-y-6">
              {/* Fact graph — the typed DAG: facts roll up into TAM/SAM/YAM. */}
              <section className="card rounded-xl p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
                    Fact graph
                  </h2>
                  <p className="text-xs text-ink-3">
                    Sourced facts → scope factors → TAM · SAM · YAM. Excluded facts dim live with the levers.
                  </p>
                </div>
                <div className="mt-3">
                  <FactGraph model={graph} variant="panel" />
                </div>
              </section>
              <ShapeStrip ledger={ledger} />
              {FLAGS.tornado ? <Tornado bars={swings} metric="tam" /> : null}
            </div>
          </div>
        </motion.section>

        {/* 03 — the evidence behind every number. */}
        <motion.section variants={itemVariants} className="mt-10">
          <SectionKicker n="03">Fact ledger</SectionKicker>
          <FactsLedger
            ledger={ledger}
            scenario={cur}
            dispatch={dispatch}
            onSelect={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
          />
        </motion.section>

        {/* 04 — endnotes: scope boundary and the independence caveat. */}
        <motion.section variants={itemVariants} className="mt-10">
          <SectionKicker n="04">Scope &amp; caveats</SectionKicker>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BoundaryPanel />
            <p className="rounded-lg border border-hairline border-l-2 border-l-warning bg-warning-wash px-4 py-3 text-xs leading-relaxed text-ink-2">
              <span className="font-semibold text-warning-ink">MVP caveat:</span> scope factors are treated
              as independent across dimensions (e.g. edge&apos;s share is assumed the
              same in every geography). Where that&apos;s false, the interaction is
              itself a risk.
            </p>
          </div>
        </motion.section>
      </motion.div>

      <FactInspector
        nodeId={selectedNodeId}
        ledger={ledger}
        scenario={cur}
        baseline={base}
        onSelect={setSelectedNodeId}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
