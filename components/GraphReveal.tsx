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
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-400/80">Model ready</p>
        <h1 className="mt-1 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          Your market, as a computation
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-neutral-400">
          Every number traces back to a sourced fact. Sourced facts roll up through scope
          factors into TAM, then haircut down to SAM and the Year-1 obtainable market (YAM).
        </p>
      </motion.div>

      <div className="glass-panel mt-6 max-h-[66vh] overflow-auto rounded-2xl p-5">
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
          className="rounded-lg border border-sky-500/50 bg-sky-500/15 px-6 py-2.5 text-sm font-medium text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-colors hover:bg-sky-500/25"
        >
          Continue to dashboard →
        </button>
      </motion.div>
    </div>
  );
}
