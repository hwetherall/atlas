import { risks } from "@/lib/risks";
import { risksCycle1 } from "@/lib/risksCycle1";

// ─────────────────────────────────────────────────────────────────────────────
// Narrative threads — one ERROR and one RISK the presenter follows across the
// whole workspace (tab 3 → 4 → 5 → 7 → 8), so "here is Risk A" on one tab is
// still Risk A on the next. A thread is pure curation: it names the register
// entries that carry the same underlying question through both cycles. The
// ThreadBadge pill renders wherever a member id appears.
// ─────────────────────────────────────────────────────────────────────────────

export type ThreadId = "one-percent" | "slow-buyer-gate";

export interface Thread {
  id: ThreadId;
  label: string; // the pill text — short, stable, presenter-friendly
  kind: "error" | "risk";
  memberRiskIds: string[]; // register ids (either cycle) that carry this thread
  note: string; // one-line arc, shown as the pill tooltip
}

export const THREADS: Thread[] = [
  {
    id: "one-percent",
    label: "The 1% assumption",
    kind: "error",
    memberRiskIds: [
      // cycle 1: the model's own cited source says 1%, not 3% — flagged…
      "risk.execution-window.som-window-semantics-mismatch",
      // cycle 2: …fixed (3% → 1%), then attacked again; the fix held.
      "risk.execution-window.som-window-semantics-year1-zero",
    ],
    note: "The Year-1 share assumption: flagged on the first pass (your own source says 1%, not 3%), corrected by re-research, then attacked again on the second pass — and it held.",
  },
  {
    id: "slow-buyer-gate",
    label: "The slow-buyer gate",
    kind: "risk",
    memberRiskIds: [
      // cycle 1: "slow large operators cut Year-1 capture tenfold" — the
      // tenfold number was refuted, but the gate mechanism survived…
      "risk.structure-independence.year1-obtainable-correlated-with-slowest-cell",
      // cycle 2: …and returned quantified: buyer security audits eat quarters.
      "risk.execution-window.firmware-security-audit-gate",
    ],
    note: "Big buyers qualify vendors slower than the selling year: the first-pass tenfold cut was refuted by evidence, but the gate itself survived and returned quantified as the security-audit risk — answered by the Act memo.",
  },
];

const byRiskId = new Map<string, Thread>();
for (const t of THREADS) for (const id of t.memberRiskIds) byRiskId.set(id, t);

/** The thread a register entry belongs to, if any — drives the ThreadBadge. */
export function threadForRisk(riskId: string): Thread | null {
  return byRiskId.get(riskId) ?? null;
}

// Fail at module load (dev boot), not on stage: every member id must exist in
// one of the two registers. Same doctrine as lib/featured.ts.
{
  const known = new Set([...risksCycle1, ...risks].map((r) => r.id));
  for (const t of THREADS) {
    for (const id of t.memberRiskIds) {
      if (!known.has(id)) throw new Error(`threads.ts: unknown risk id "${id}" in thread "${t.id}"`);
    }
  }
}
