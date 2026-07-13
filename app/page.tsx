"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FLAGS } from "@/lib/flags";
import { ledger } from "@/lib/ledger"; // rev 2 (corrected) — self-validates at module load
import { ledgerRev1 } from "@/lib/ledgerRev1"; // rev 1 (frozen) — the demo's "before" world
import { risks } from "@/lib/risks"; // cycle-2 register (against rev 2)
import { risksCycle1 } from "@/lib/risksCycle1"; // cycle-1 register (against rev 1, frozen)
import { FEATURED } from "@/lib/featured"; // curated headline findings per register pass
import { useScenario } from "@/lib/useScenario";
import IntakeWizard from "@/components/IntakeWizard";
import ThinkingSequence from "@/components/ThinkingSequence";
import GraphReveal from "@/components/GraphReveal";
import FactBank from "@/components/FactBank";
import Dashboard from "@/components/Dashboard";
import RiskRegister from "@/components/RiskRegister";
import RefinementPass from "@/components/RefinementPass";
import CorrectedModel from "@/components/CorrectedModel";
import NextSteps from "@/components/NextSteps";
import WorkspaceNav, { type WorkspaceTab } from "@/components/WorkspaceNav";

// ─────────────────────────────────────────────────────────────────────────────
// Phase orchestrator for the guided demo. After the intro, the workspace walks
// the refinement loop left to right, under the hood:
//   1 Fact bank (rev 1)   the model as first researched
//   2 Dashboard (rev 1)   the numbers it produced
//   3 First risk pass     what the risk engine found: errors AND risks
//   4 Re-research         the machine re-researching its own doubts
//   5 What changed        the corrected model, with why (rev 1 → rev 2)
//   6 New dashboard       the numbers after correction (rev 2)
//   7 Remaining risks     the register against the corrected model
//   8 Next steps          the mitigate hand-off: five risks, five responses
// All surfaces stay mounted after first visit (instant tab flips) and share
// one scenario state, so levers stay in sync across both worlds.
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "intake" | "thinking" | "reveal" | WorkspaceTab;

const WORKSPACE_TABS: WorkspaceTab[] = [
  "factbank",
  "dashboard",
  "risks",
  "refine",
  "changes",
  "dashboard2",
  "risks2",
  "next",
];

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

const freshSeen = () =>
  Object.fromEntries(WORKSPACE_TABS.map((t) => [t, false])) as Record<WorkspaceTab, boolean>;

export default function Home() {
  const [phase, setPhase] = useState<Phase>(FLAGS.intro ? "intake" : "dashboard");
  const { state, dispatch } = useScenario(ledger);

  // Lazy-mount-then-keep: each workspace surface runs its entrance animation
  // once, then stays mounted (hidden) so tab flips are instant and lose no state.
  const [seen, setSeen] = useState<Record<WorkspaceTab, boolean>>(freshSeen);
  useEffect(() => {
    if (WORKSPACE_TABS.includes(phase as WorkspaceTab) && !seen[phase as WorkspaceTab]) {
      setSeen((s) => ({ ...s, [phase]: true }));
    }
  }, [phase, seen]);

  const inWorkspace = WORKSPACE_TABS.includes(phase as WorkspaceTab);

  function goTab(tab: WorkspaceTab) {
    setPhase(tab);
    window.scrollTo({ top: 0 });
  }

  function replay() {
    setSeen(freshSeen());
    dispatch({ type: "resetToBaseline" });
    setPhase("intake");
  }

  // Keep-mounted wrapper for one workspace surface.
  const surface = (tab: WorkspaceTab, node: React.ReactNode) =>
    (phase === tab || seen[tab]) && (
      <div key={tab} className={phase === tab ? "" : "hidden"}>
        {node}
      </div>
    );

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
              <WorkspaceNav active={phase as WorkspaceTab} onNavigate={goTab} onReplay={replay} />

              {/* 1–3: the original world (ledger rev 1, cycle-1 register) */}
              {surface(
                "factbank",
                <FactBank
                  ledger={ledgerRev1}
                  state={state}
                  dispatch={dispatch}
                  onOpenDashboard={() => goTab("dashboard")}
                />,
              )}
              {surface("dashboard", <Dashboard ledger={ledgerRev1} state={state} dispatch={dispatch} />)}
              {surface(
                "risks",
                <RiskRegister
                  ledger={ledgerRev1}
                  risks={risksCycle1}
                  state={state}
                  featured={FEATURED.cycle1}
                  headerNote="First pass, against the original model — most findings are not risks but errors: places where our own numbers don't survive scrutiny."
                />,
              )}

              {/* 4–5: the loop — re-research, then what it changed */}
              {surface("refine", <RefinementPass />)}
              {surface("changes", <CorrectedModel />)}

              {/* 6–7: the corrected world (ledger rev 2, cycle-2 register) */}
              {surface("dashboard2", <Dashboard ledger={ledger} state={state} dispatch={dispatch} />)}
              {surface(
                "risks2",
                <RiskRegister
                  ledger={ledger}
                  risks={risks}
                  state={state}
                  featured={FEATURED.cycle2}
                  headerNote="Second pass, against the corrected model — total exposure fell from €22.4M to €6.8M. What remains is small-caliber refinement work plus the risks only time can settle."
                />,
              )}

              {/* 8: the mitigate hand-off — what to do about what remains */}
              {surface("next", <NextSteps ledger={ledger} state={state} />)}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
