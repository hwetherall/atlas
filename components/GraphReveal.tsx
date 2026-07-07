"use client";

import { motion } from "framer-motion";
import { ledger } from "@/lib/ledger";
import { baselineScenario } from "@/lib/compute";
import { deriveGraph } from "@/lib/graph";
import FactGraph from "@/components/FactGraph";

// ─────────────────────────────────────────────────────────────────────────────
// Step 3a — the reveal. The fact graph assembles full-width as the centrepiece
// ("a market size is a computation, never a number", CLAUDE.md §2) before the
// user continues into the full dashboard.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  onContinue: () => void;
}

export default function GraphReveal({ onContinue }: Props) {
  const graph = deriveGraph(ledger, baselineScenario(ledger));

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">Model ready</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight text-ink">
          Your market, as a computation
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-2">
          Every number traces back to a sourced fact. Sourced facts roll up through scope
          factors into TAM, then haircut down to SAM and the Year-1 obtainable market (YAM).
        </p>
      </motion.div>

      <div className="card mt-6 max-h-[66vh] overflow-auto rounded-2xl p-5">
        <FactGraph model={graph} variant="hero" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex shrink-0 justify-center"
      >
        <button
          type="button"
          onClick={onContinue}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-ink"
        >
          Continue to the fact bank →
        </button>
      </motion.div>
    </div>
  );
}
