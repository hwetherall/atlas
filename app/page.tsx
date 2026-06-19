"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { ledger } from "@/lib/ledger"; // self-validates at module load (fails loudly at boot)
import { delta, evaluate, sensitivity } from "@/lib/compute";
import { FLAGS } from "@/lib/flags";
import { useScenario } from "@/lib/useScenario";
import ScenarioControls from "@/components/ScenarioControls";
import RegionMap from "@/components/RegionMap";
import BoundaryPanel from "@/components/BoundaryPanel";
import FunnelOutputs from "@/components/FunnelOutputs";
import DeltaPanel from "@/components/DeltaPanel";
import ShapeStrip from "@/components/ShapeStrip";
import Tornado from "@/components/Tornado";
import FactsLedger from "@/components/FactsLedger";

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

export default function Home() {
  const { state, dispatch } = useScenario(ledger);
  const { current: cur, baseline: base } = state;

  const current = useMemo(() => evaluate(ledger, cur), [cur]);
  const baseline = useMemo(() => evaluate(ledger, base), [base]);
  const deltaTam = useMemo(() => delta(ledger, base, cur, "tam"), [base, cur]);
  const deltaYam = useMemo(() => delta(ledger, base, cur, "yam"), [base, cur]);
  const swings = useMemo(() => sensitivity(ledger, cur, "tam"), [cur]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-sky-600/20 blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[30%] w-[30%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-6xl px-6 py-12">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
            Atlas — Market Size &amp; Shape
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Live, lever-driven TAM / SAM / YAM. A market size is a computation,
            never a number — pull a lever and the funnel recomputes against a
            pinned baseline.
          </p>
        </motion.header>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-panel mt-6 rounded-lg border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/80"
        >
          <span className="font-medium text-amber-400">MVP caveat:</span> scope factors are treated
          as independent across dimensions (e.g. edge&apos;s share is assumed the
          same in every geography). Where that&apos;s false, the interaction is
          itself a risk.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr]"
        >
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <ScenarioControls ledger={ledger} state={state} dispatch={dispatch} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <RegionMap
                ledger={ledger}
                selected={cur.geographies}
                onToggle={(value) => dispatch({ type: "toggle", dimension: "geography", value })}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <BoundaryPanel />
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <motion.div variants={itemVariants}>
                <FunnelOutputs current={current} baseline={baseline} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DeltaPanel deltaTam={deltaTam} deltaYam={deltaYam} />
              </motion.div>
            </div>
            <motion.div variants={itemVariants}>
              <ShapeStrip ledger={ledger} />
            </motion.div>
            {FLAGS.tornado ? (
              <motion.div variants={itemVariants}>
                <Tornado bars={swings} metric="tam" />
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6"
        >
          <FactsLedger ledger={ledger} scenario={cur} dispatch={dispatch} />
        </motion.div>
      </main>
    </div>
  );
}
