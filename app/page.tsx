"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FLAGS } from "@/lib/flags";
import { ledger } from "@/lib/ledger"; // self-validates at module load (fails loudly at boot)
import { useScenario } from "@/lib/useScenario";
import IntakeWizard from "@/components/IntakeWizard";
import ThinkingSequence from "@/components/ThinkingSequence";
import GraphReveal from "@/components/GraphReveal";
import FactBank from "@/components/FactBank";
import Dashboard from "@/components/Dashboard";
import WorkspaceNav, { type WorkspaceTab } from "@/components/WorkspaceNav";

// ─────────────────────────────────────────────────────────────────────────────
// Phase orchestrator for the guided demo: intake → thinking → graph reveal →
// FACT BANK → dashboard. The fact bank and dashboard form the "workspace" —
// one AnimatePresence child whose two surfaces stay mounted and share scenario
// state (lifted here), so tab flips are instant and levers stay in sync across
// both. FLAGS.intro = false boots straight to the dashboard (dev).
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "intake" | "thinking" | "reveal" | "factbank" | "dashboard";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>(FLAGS.intro ? "intake" : "dashboard");
  const { state, dispatch } = useScenario(ledger);

  // Lazy-mount-then-keep: each workspace surface runs its entrance animation
  // once, then stays mounted (hidden) so tab flips are instant and lose no state.
  const [seen, setSeen] = useState({ factbank: false, dashboard: false });
  useEffect(() => {
    if (phase === "factbank" && !seen.factbank) setSeen((s) => ({ ...s, factbank: true }));
    if (phase === "dashboard" && !seen.dashboard) setSeen((s) => ({ ...s, dashboard: true }));
  }, [phase, seen]);

  const inWorkspace = phase === "factbank" || phase === "dashboard";

  function goTab(tab: WorkspaceTab) {
    setPhase(tab);
    window.scrollTo({ top: 0 });
  }

  function replay() {
    setSeen({ factbank: false, dashboard: false });
    dispatch({ type: "resetToBaseline" });
    setPhase("intake");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shared backdrop: engineering-paper grid + one restrained accent wash */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(46, 107, 230, 0.06), transparent)" /* = --accent */,
          }}
        />
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
              <GraphReveal onContinue={() => setPhase("factbank")} />
            </motion.div>
          ) : null}

          {inWorkspace ? (
            <motion.div key="workspace" {...fade}>
              <WorkspaceNav
                active={phase as WorkspaceTab}
                onNavigate={goTab}
                onReplay={replay}
              />
              {(phase === "factbank" || seen.factbank) && (
                <div className={phase === "factbank" ? "" : "hidden"}>
                  <FactBank
                    ledger={ledger}
                    state={state}
                    dispatch={dispatch}
                    onOpenDashboard={() => goTab("dashboard")}
                  />
                </div>
              )}
              {(phase === "dashboard" || seen.dashboard) && (
                <div className={phase === "dashboard" ? "" : "hidden"}>
                  <Dashboard state={state} dispatch={dispatch} />
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
