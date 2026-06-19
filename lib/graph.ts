import type { Confidence, FactNode, Ledger, NodeKind, Scenario } from "@/lib/schema";
import { evaluate } from "@/lib/compute";

// ─────────────────────────────────────────────────────────────────────────────
// Graph view-model — DERIVED FOR DISPLAY (plan §"Graph data").
//
// The ledger stores only leaf facts; TAM/SAM/YAM are computed implicitly in
// compute.ts and never stored as nodes. This module reconstructs the typed DAG
// the funnel *describes* (CLAUDE.md §2) as a {nodes, edges} view-model so it can
// be drawn — without touching compute.ts. Values come from evaluate(), so the
// graph's TAM/SAM/YAM are identical to the funnel's (single source of truth).
//
// Synthetic nodes (scope factors + TAM/SAM/YAM) carry kind 'calculated' so the
// renderer reuses the existing kind palette. Leaves carry their real kind.
// ─────────────────────────────────────────────────────────────────────────────

export type GraphGroup = "geography" | "segment" | "customerType" | "funnel" | "shape";

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  confidence?: Confidence;
  value: number;
  unit: string; // 'EUR_M' | 'ratio'
  group: GraphGroup;
  synthetic: boolean; // true = not a real ledger node (factor / TAM / SAM / YAM)
  dimmed: boolean; // excluded from the current scenario
  x: number; // center coordinates in the SVG viewBox space
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  dimmed: boolean;
}

export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
}

// Layout constants (SVG coordinate space — the renderer scales via viewBox).
const COL_X = { leaf: 130, factor: 500, tam: 800, sam: 1040, yam: 1250 } as const;
const CANVAS_W = 1380;
const ROW_H = 46;
const GROUP_GAP = 30;
const TOP = 70;

// Short display labels for the synthetic / base spine nodes.
const SPINE_LABEL: Record<string, string> = {
  tamBase: "Market base",
  "factor.geography": "Geography mix",
  "factor.segment": "Segment mix",
  "factor.customerType": "Buyer mix",
  "out.tam": "TAM",
  "out.sam": "SAM",
  "out.yam": "YAM",
};

export const SYNTHETIC_IDS = {
  geoFactor: "factor.geography",
  segFactor: "factor.segment",
  custFactor: "factor.customerType",
  tam: "out.tam",
  sam: "out.sam",
  yam: "out.yam",
} as const;

export function deriveGraph(ledger: Ledger, scenario: Scenario): GraphModel {
  const byId = new Map(ledger.map((n) => [n.id, n] as const));
  const ev = evaluate(ledger, scenario);

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // ── Column 0: the share leaves, stacked in three groups ──────────────────
  let cursor = TOP + ROW_H / 2;

  function placeLeaves(dimension: GraphGroup, selected: string[]): { id: string; cy: number }[] {
    const placed: { id: string; cy: number }[] = [];
    for (const n of ledger) {
      if (n.dimension !== dimension) continue;
      const dimmed = !selected.includes(n.dimensionValue ?? "");
      nodes.push({
        id: n.id,
        label: n.label,
        kind: n.kind,
        confidence: n.confidence,
        value: n.value,
        unit: n.unit,
        group: dimension,
        synthetic: false,
        dimmed,
        x: COL_X.leaf,
        y: cursor,
      });
      placed.push({ id: n.id, cy: cursor });
      cursor += ROW_H;
    }
    return placed;
  }

  const geoPlaced = placeLeaves("geography", scenario.geographies);
  cursor += GROUP_GAP;
  const segPlaced = placeLeaves("segment", scenario.segments);
  cursor += GROUP_GAP;
  const custPlaced = placeLeaves("customerType", scenario.customerTypes);
  const leavesBottom = cursor - ROW_H + ROW_H / 2;

  const centroid = (arr: { cy: number }[]) =>
    arr.reduce((s, a) => s + a.cy, 0) / Math.max(arr.length, 1);
  const geoC = centroid(geoPlaced);
  const segC = centroid(segPlaced);
  const custC = centroid(custPlaced);
  const spineY = centroid([...geoPlaced, ...segPlaced, ...custPlaced]);

  // ── Synthetic node helpers ───────────────────────────────────────────────
  function addNode(
    id: string,
    value: number,
    unit: string,
    x: number,
    y: number,
    opts: { kind?: NodeKind; group?: GraphGroup; synthetic?: boolean; confidence?: Confidence; label?: string } = {},
  ) {
    nodes.push({
      id,
      label: opts.label ?? SPINE_LABEL[id] ?? id,
      kind: opts.kind ?? "calculated",
      confidence: opts.confidence,
      value,
      unit,
      group: opts.group ?? "funnel",
      synthetic: opts.synthetic ?? true,
      dimmed: false,
      x,
      y,
    });
  }

  function addEdge(from: string, to: string, dimmed = false) {
    edges.push({ id: `${from}→${to}`, from, to, dimmed });
  }

  // ── Column 1: market base + the three scope factors ──────────────────────
  const tamBase = byId.get("tamBase")!;
  addNode("tamBase", tamBase.value, tamBase.unit, COL_X.factor, Math.max(TOP, geoC - 3 * ROW_H), {
    kind: tamBase.kind,
    confidence: tamBase.confidence,
    synthetic: false,
  });
  addNode(SYNTHETIC_IDS.geoFactor, ev.factors.geography, "ratio", COL_X.factor, geoC);
  addNode(SYNTHETIC_IDS.segFactor, ev.factors.segment, "ratio", COL_X.factor, segC);
  addNode(SYNTHETIC_IDS.custFactor, ev.factors.customerType, "ratio", COL_X.factor, custC);

  // ── Columns 2–4: the funnel spine TAM → SAM → YAM + assumption leaves ─────
  addNode(SYNTHETIC_IDS.tam, ev.tam, "EUR_M", COL_X.tam, spineY);
  addNode(SYNTHETIC_IDS.sam, ev.sam, "EUR_M", COL_X.sam, spineY);
  addNode(SYNTHETIC_IDS.yam, ev.yam, "EUR_M", COL_X.yam, spineY);

  const serviceable = byId.get("serviceableFactor")!;
  const obtainable = byId.get("obtainableFactor")!;
  addNode("serviceableFactor", ev.factors.serviceable, "ratio", COL_X.tam, spineY + 190, {
    kind: serviceable.kind,
    confidence: serviceable.confidence,
    synthetic: false,
    label: serviceable.label,
  });
  addNode("obtainableFactor", ev.factors.obtainable, "ratio", COL_X.sam, spineY + 290, {
    kind: obtainable.kind,
    confidence: obtainable.confidence,
    synthetic: false,
    label: obtainable.label,
  });

  // ── Edges ────────────────────────────────────────────────────────────────
  for (const p of geoPlaced) addEdge(p.id, SYNTHETIC_IDS.geoFactor, isDimmed(byId, p.id, scenario));
  for (const p of segPlaced) addEdge(p.id, SYNTHETIC_IDS.segFactor, isDimmed(byId, p.id, scenario));
  for (const p of custPlaced) addEdge(p.id, SYNTHETIC_IDS.custFactor, isDimmed(byId, p.id, scenario));

  addEdge("tamBase", SYNTHETIC_IDS.tam);
  addEdge(SYNTHETIC_IDS.geoFactor, SYNTHETIC_IDS.tam);
  addEdge(SYNTHETIC_IDS.segFactor, SYNTHETIC_IDS.tam);
  addEdge(SYNTHETIC_IDS.custFactor, SYNTHETIC_IDS.tam);

  addEdge(SYNTHETIC_IDS.tam, SYNTHETIC_IDS.sam);
  addEdge("serviceableFactor", SYNTHETIC_IDS.sam);
  addEdge(SYNTHETIC_IDS.sam, SYNTHETIC_IDS.yam);
  addEdge("obtainableFactor", SYNTHETIC_IDS.yam);

  // ── Shape cluster: context facts, not wired into the funnel ───────────────
  const shapeY = leavesBottom + 64;
  let shapeX = COL_X.leaf;
  for (const n of ledger) {
    if (!n.id.startsWith("shape.")) continue;
    nodes.push({
      id: n.id,
      label: n.label,
      kind: n.kind,
      confidence: n.confidence,
      value: n.value,
      unit: n.unit,
      group: "shape",
      synthetic: false,
      dimmed: false,
      x: shapeX,
      y: shapeY,
    });
    shapeX += 260;
  }

  const height = Math.max(leavesBottom + 110, spineY + 290 + 40);
  return { nodes, edges, width: CANVAS_W, height };
}

function isDimmed(byId: Map<string, FactNode>, id: string, scenario: Scenario): boolean {
  const n = byId.get(id);
  if (!n || !n.dimension || !n.dimensionValue) return false;
  const selected =
    n.dimension === "geography"
      ? scenario.geographies
      : n.dimension === "segment"
        ? scenario.segments
        : scenario.customerTypes;
  return !selected.includes(n.dimensionValue);
}
