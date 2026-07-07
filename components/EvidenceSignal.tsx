"use client";

import type { FactNode, Maturity } from "@/lib/schema";
import { MATURITY_LABEL } from "@/lib/badges";

// One-glance evidence quality: maturity dot + plain words + source count.
// Shared by the fact-bank table and the dossier header so the signal reads
// identically everywhere. Dot + text, not a boxed badge — badges are reserved
// for genuine alerts.

const MATURITY_DOT: Record<Maturity, string> = {
  "needs-source": "bg-fact-red",
  "single-source": "bg-fact-amber",
  triangulated: "bg-fact-blue",
  verified: "bg-fact-green",
};

const MATURITY_TEXT: Record<Maturity, string> = {
  "needs-source": "text-fact-red",
  "single-source": "text-fact-amber",
  triangulated: "text-fact-blue",
  verified: "text-fact-green",
};

export function sourceCounts(node: FactNode): { attached: number; pending: number } {
  if (node.evidence && node.evidence.length > 0) {
    return {
      attached: node.evidence.filter((e) => e.attached).length,
      pending: node.evidence.filter((e) => !e.attached).length,
    };
  }
  return { attached: node.source ? 1 : 0, pending: 0 };
}

export default function EvidenceSignal({ node }: { node: FactNode }) {
  const { attached, pending } = sourceCounts(node);
  if (!node.maturity) return <span className="text-[12px] text-ink-faint">—</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px]">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${MATURITY_DOT[node.maturity]}`} />
      <span className={`whitespace-nowrap ${MATURITY_TEXT[node.maturity]}`}>
        {MATURITY_LABEL[node.maturity]}
      </span>
      {attached > 0 ? (
        <span className="whitespace-nowrap text-ink-3">
          · {attached} source{attached === 1 ? "" : "s"}
        </span>
      ) : null}
      {pending > 0 ? (
        <span className="whitespace-nowrap text-ink-faint">+{pending} identified</span>
      ) : null}
    </span>
  );
}
