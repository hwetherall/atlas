"use client";

import { motion } from "framer-motion";
import { FLAGS } from "@/lib/flags";

// ─────────────────────────────────────────────────────────────────────────────
// WorkspaceNav — sticky tab bar shown once the guided intro lands in the
// workspace (fact bank ↔ dashboard ↔ risk register). The single Replay
// affordance lives here. z-30 keeps it under the FactInspector backdrop (z-40)
// and drawer (z-50).
// ─────────────────────────────────────────────────────────────────────────────

export type WorkspaceTab =
  | "factbank"
  | "dashboard"
  | "risks"
  | "refine"
  | "changes"
  | "dashboard2"
  | "risks2";

interface Props {
  active: WorkspaceTab;
  onNavigate: (tab: WorkspaceTab) => void;
  onReplay: () => void;
}

// The demo walks the C-suite through the loop left to right: the original
// model (1–3), the machine re-researching its own doubts (4), the corrected
// model (5–6), and what remains once the errors are gone (7).
const TABS: { id: WorkspaceTab; label: string; step: number }[] = [
  { id: "factbank", label: "Fact bank", step: 1 },
  { id: "dashboard", label: "Dashboard", step: 2 },
  ...(FLAGS.riskRegister
    ? [
        { id: "risks" as const, label: "First risk pass", step: 3 },
        { id: "refine" as const, label: "Re-research", step: 4 },
        { id: "changes" as const, label: "What changed", step: 5 },
        { id: "dashboard2" as const, label: "New dashboard", step: 6 },
        { id: "risks2" as const, label: "Remaining risks", step: 7 },
      ]
    : []),
];

export default function WorkspaceNav({ active, onNavigate, onReplay }: Props) {
  return (
    <div className="sticky top-0 z-30 border-b border-hairline bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-6 px-6">
        <span className="font-display text-sm font-medium tracking-tight text-ink">
          Atlas
        </span>
        <nav className="flex h-full items-center gap-4" aria-label="Workspace">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onNavigate(t.id)}
              aria-current={active === t.id ? "page" : undefined}
              className={`relative flex h-full items-center gap-1.5 text-sm transition-colors ${
                active === t.id ? "text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
              <span
                className={`font-mono text-[10px] tabular-nums ${
                  active === t.id ? "text-accent-ink" : "text-ink-faint"
                }`}
              >
                {t.step}
              </span>
              {t.label}
              {active === t.id ? (
                <motion.div
                  layoutId="workspace-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              ) : null}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={onReplay}
          className="ml-auto shrink-0 rounded-lg border border-hairline bg-card px-3 py-1.5 text-xs text-ink-3 transition-colors hover:border-hairline-strong hover:text-ink"
        >
          ↻ Replay intro
        </button>
      </div>
    </div>
  );
}
