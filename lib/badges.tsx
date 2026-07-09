import type { Confidence, Maturity, NodeKind } from "@/lib/schema";
import type { EvidenceStatus, RiskCategory } from "@/lib/riskSchema";

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

// ── Risk register ─────────────────────────────────────────────────────────────
// Reuses the fact-* token triads; hues group by flavor: construction attacks
// (fact/model-structure/boundary — the "rocks") read violet/blue, world risks
// read amber/red.

export const CATEGORY_STYLE: Record<RiskCategory, string> = {
  fact: "border-fact-blue-line bg-fact-blue-tint text-fact-blue",
  "model-structure": "border-fact-violet-line bg-fact-violet-tint text-fact-violet",
  boundary: "border-fact-violet-line bg-fact-violet-tint text-fact-violet",
  exogenous: "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
  competitive: "border-fact-red-line bg-fact-red-tint text-fact-red",
  execution: "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
};

// Plain-language category labels — the raw enum ("fact", "boundary") reads as
// jargon in the register; these say what part of the case the risk attacks.
export const CATEGORY_LABEL: Record<RiskCategory, string> = {
  fact: "shaky number",
  "model-structure": "model structure",
  boundary: "scope gap",
  exogenous: "external shock",
  competitive: "competition",
  execution: "execution",
};

// Hover copy that explains each category in one line (schema §1).
export const CATEGORY_TOOLTIP: Record<RiskCategory, string> = {
  fact: "A number in the model could be wrong — its plausible band is real.",
  "model-structure": "The multiplicative funnel itself could mis-shape the estimate.",
  boundary: "Something left out of scope could actually matter.",
  exogenous: "A shock from outside — macro, regulatory or demand.",
  competitive: "Concentration, incumbent response or channel foreclosure.",
  execution: "Entrant-side: ramp, certification, channel build.",
};

// Evidence status: how the risk fared against an external-evidence search.
export const EVIDENCE_STATUS_STYLE: Record<EvidenceStatus, string> = {
  corroborated: "border-fact-green-line text-fact-green",
  contested: "border-fact-amber-line text-fact-amber",
  speculative: "border-fact-red-line text-fact-red",
};

export const EVIDENCE_STATUS_LABEL: Record<EvidenceStatus, string> = {
  corroborated: "backed by evidence",
  contested: "evidence contested",
  speculative: "no external evidence",
};

// A leading glyph so evidence reads as a status, not another category tag.
export const EVIDENCE_STATUS_ICON: Record<EvidenceStatus, string> = {
  corroborated: "✓",
  contested: "!",
  speculative: "?",
};

export const EVIDENCE_STATUS_TOOLTIP: Record<EvidenceStatus, string> = {
  corroborated: "At least one independent source supports the key premise.",
  contested: "A credible source disputes a non-load-bearing link — kept and flagged.",
  speculative: "No external signal either way — kept, never silently dropped.",
};

export function Badge({
  className,
  title,
  children,
}: {
  className: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}
