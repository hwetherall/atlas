"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FLAGS } from "@/lib/flags";
import IntakeWizard from "@/components/IntakeWizard";
import ThinkingSequence from "@/components/ThinkingSequence";
import GraphReveal from "@/components/GraphReveal";
import Dashboard from "@/components/Dashboard";

// ─────────────────────────────────────────────────────────────────────────────
// Phase orchestrator for the guided demo. The dashboard itself lives in
// components/Dashboard.tsx; this shell walks the user through intake → thinking
// → graph reveal → dashboard, sharing one background across all phases.
// FLAGS.intro = false boots straight to the dashboard (dev).
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "intake" | "thinking" | "reveal" | "dashboard";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>(FLAGS.intro ? "intake" : "dashboard");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shared mesh gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-sky-600/20 blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[30%] w-[30%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <main className="relative">
        <AnimatePresence mode="wait">
          {phase === "intake" ? (
            <motion.div key="intake" {...fade}>
              <IntakeWizard onComplete={() => setPhase("thinking")} />
            </motion.div>
          ) : null}

          {phase === "thinking" ? (
            <motion.div key="thinking" {...fade}>
              <ThinkingSequence onComplete={() => setPhase("reveal")} />
            </motion.div>
          ) : null}

          {phase === "reveal" ? (
            <motion.div key="reveal" {...fade}>
              <GraphReveal onContinue={() => setPhase("dashboard")} />
            </motion.div>
          ) : null}

          {phase === "dashboard" ? (
            <motion.div key="dashboard" {...fade}>
              <Dashboard onReplay={() => setPhase("intake")} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
