import type { Dimension, FactNode, Scenario } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// improve-ledger.md §2 — View model for the two-view Facts ledger.
//
// Pure, read-only, no React. Buckets nodes into funnel sections so the ledger
// can render one card per dimension ("By funnel") or a flat list ("Ranked").
// Adds NO compute — this is presentation grouping only.
// ─────────────────────────────────────────────────────────────────────────────

export type SectionId =
  | "base"
  | "geography"
  | "segment"
  | "customerType"
  | "assumption"
  | "shape";

export function sectionOf(node: FactNode): SectionId {
  if (node.id === "tamBase") return "base";
  if (node.dimension) return node.dimension; // 'geography' | 'segment' | 'customerType'
  if (node.kind === "assumption") return "assumption"; // serviceableFactor, obtainableFactor
  return "shape"; // shape.cagr, shape.cr3, ...
}

export const SECTION_ORDER: SectionId[] = [
  "base",
  "geography",
  "segment",
  "customerType",
  "assumption",
  "shape",
];

export const SECTION_LABEL: Record<SectionId, string> = {
  base: "Market base",
  geography: "Geography",
  segment: "Segment",
  customerType: "Customer type",
  assumption: "Funnel assumptions",
  shape: "Market shape",
};

export interface LedgerSection {
  section: SectionId;
  label: string;
  nodes: FactNode[];
}

/** Bucket nodes into funnel sections, returned in SECTION_ORDER (empty sections dropped). */
export function groupBySection(nodes: FactNode[]): LedgerSection[] {
  const byId = new Map<SectionId, FactNode[]>();
  for (const n of nodes) {
    const s = sectionOf(n);
    const arr = byId.get(s) ?? [];
    arr.push(n);
    byId.set(s, arr);
  }
  return SECTION_ORDER.filter((s) => byId.has(s)).map((s) => ({
    section: s,
    label: SECTION_LABEL[s],
    nodes: byId.get(s)!,
  }));
}

/** A share (0–1 ratio) as a CSS width string for the mini share bar. */
export function shareWidth(ratio: number): string {
  return `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}

const DIM_FIELD: Record<Dimension, "geographies" | "segments" | "customerTypes"> = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
};

/**
 * A filter leaf is excluded when its dimensionValue is not in the scenario's
 * selection for its dimension. Excluded rows dim live with the levers (§4).
 */
export function isExcluded(node: FactNode, scenario: Scenario): boolean {
  if (!node.dimension || !node.dimensionValue) return false;
  return !scenario[DIM_FIELD[node.dimension]].includes(node.dimensionValue);
}
