import type { Confidence, Maturity, NodeKind } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Shared badge palette. Lifted out of FactsLedger / FactGraph so the ledger and
// the Fact Inspector read from one source of truth (ledger.md §2, §7).
// Triads come from the fact-* token families in app/globals.css:
// dark text (≥4.8:1 on its own tint) + tint background + line border.
// ─────────────────────────────────────────────────────────────────────────────

export const KIND_STYLE: Record<NodeKind, string> = {
  extracted: "border-fact-green-line bg-fact-green-tint text-fact-green",
  estimated: "border-fact-blue-line bg-fact-blue-tint text-fact-blue",
  calculated: "border-fact-violet-line bg-fact-violet-tint text-fact-violet",
  assumption: "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
};

export const CONFIDENCE_STYLE: Record<Confidence, string> = {
  verified: "border-fact-green-line text-fact-green",
  inferred: "border-fact-amber-line text-fact-amber",
  unknown: "border-fact-red-line text-fact-red",
};

// The maturity ladder: needs-source → single-source → triangulated → verified.
export const MATURITY_STYLE: Record<Maturity, string> = {
  "needs-source": "border-fact-red-line bg-fact-red-tint text-fact-red",
  "single-source": "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
  triangulated: "border-fact-blue-line bg-fact-blue-tint text-fact-blue",
  verified: "border-fact-green-line bg-fact-green-tint text-fact-green",
};

export const MATURITY_LABEL: Record<Maturity, string> = {
  "needs-source": "unsourced",
  "single-source": "not cross-checked",
  triangulated: "cross-checked",
  verified: "verified",
};

// Plain-language kind labels for the dossier (the raw enum reads as jargon).
export const KIND_LABEL: Record<NodeKind, string> = {
  extracted: "from source",
  estimated: "estimated",
  calculated: "derived",
  assumption: "our call",
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
