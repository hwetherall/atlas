"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// WorkspaceNav — sticky tab bar shown once the guided intro lands in the
// workspace (fact bank ↔ dashboard). The single Replay affordance lives here.
// z-30 keeps it under the FactInspector backdrop (z-40) and drawer (z-50).
// ─────────────────────────────────────────────────────────────────────────────

export type WorkspaceTab = "factbank" | "dashboard";

interface Props {
  active: WorkspaceTab;
  onNavigate: (tab: WorkspaceTab) => void;
  onReplay: () => void;
}

const TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "factbank", label: "Fact bank" },
  { id: "dashboard", label: "Dashboard" },
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
              className={`relative flex h-full items-center text-sm transition-colors ${
                active === t.id ? "text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
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
