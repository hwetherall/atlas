import type { Confidence, Maturity, NodeKind } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Shared badge palette. Lifted out of FactsLedger / FactGraph so the ledger and
// the Fact Inspector read from one source of truth (ledger.md §2, §7).
// The `*-300` text variant from the ledger is canonical.
// ─────────────────────────────────────────────────────────────────────────────

export const KIND_STYLE: Record<NodeKind, string> = {
  extracted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  estimated: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  calculated: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  assumption: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

export const CONFIDENCE_STYLE: Record<Confidence, string> = {
  verified: "border-emerald-500/40 text-emerald-300",
  inferred: "border-amber-500/40 text-amber-300",
  unknown: "border-rose-500/40 text-rose-300",
};

// The maturity ladder: needs-source → single-source → triangulated → verified.
export const MATURITY_STYLE: Record<Maturity, string> = {
  "needs-source": "border-rose-500/40 bg-rose-500/10 text-rose-300",
  "single-source": "border-amber-500/40 bg-amber-500/10 text-amber-300",
  triangulated: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  verified: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

export const MATURITY_LABEL: Record<Maturity, string> = {
  "needs-source": "needs source",
  "single-source": "single source",
  triangulated: "triangulated",
  verified: "verified",
};

// Rank for sorting / progress along the ladder.
export const MATURITY_RANK: Record<Maturity, number> = {
  "needs-source": 0,
  "single-source": 1,
  triangulated: 2,
  verified: 3,
};

export function Badge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}
