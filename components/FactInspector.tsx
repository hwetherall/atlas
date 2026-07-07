"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Ledger, Scenario } from "@/lib/schema";
import FactDetail from "@/components/FactDetail";

// ─────────────────────────────────────────────────────────────────────────────
// FactInspector — ledger.md §8. The dashboard's right slide-in drawer host for
// the shared FactDetail dossier (Fact · Evidence · Recipe · Lineage). The Fact
// Bank page renders the same FactDetail inline as its master-detail panel.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  nodeId: string | null;
  ledger: Ledger;
  scenario: Scenario; // current (cur) — drives the live numbers
  baseline: Scenario; // pinned baseline (base) — reserved for vs-baseline views
  onSelect: (id: string) => void; // lineage navigation
  onClose: () => void;
}

export default function FactInspector({ nodeId, ledger, scenario, onSelect, onClose }: Props) {
  const node = useMemo(
    () => (nodeId ? (ledger.find((n) => n.id === nodeId) ?? null) : null),
    [nodeId, ledger],
  );
  const open = Boolean(node);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && node ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/25"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[30rem] flex-col overflow-y-auto border-l border-hairline bg-card shadow-drawer"
            role="dialog"
            aria-label={`Fact inspector: ${node.label}`}
          >
            <FactDetail
              variant="drawer"
              node={node}
              ledger={ledger}
              scenario={scenario}
              onSelect={onSelect}
              onClose={onClose}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
