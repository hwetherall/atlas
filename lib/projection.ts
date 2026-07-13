import { evaluate, type Metric } from "@/lib/compute";
import { bandSwing, informationValue } from "@/lib/voi";
import { riskImpact, riskSeverity } from "@/lib/riskCompute";
import type { Ledger, Scenario } from "@/lib/schema";
import type { Risk } from "@/lib/riskSchema";
import type { Memo, ProjectionOp } from "@/lib/nextStepsSchema";

// ─────────────────────────────────────────────────────────────────────────────
// Next Steps §2 — projection: what executing a memo does to the model
// (nextsteps.md §5). Pure, deterministic, no network. Same primitive family
// as riskCompute.applyPerturbation, but a projection can also narrow a
// node's plausible band and promote its confidence — the two things
// research and expert calls actually buy you.
//
// Scenario note: projections write the LEDGER, not the scenario. evaluate()
// reads assumption leaves as scenario override ?? ledger default, so a
// user-moved slider still wins over a projected default — the projection
// shows what the model would say, not what the user must believe.
// ─────────────────────────────────────────────────────────────────────────────

/** The ledger as it would look after executing the ops. Never mutates. */
export function applyProjection(ledger: Ledger, ops: ProjectionOp[]): Ledger {
  let next = ledger;
  for (const op of ops) {
    const node = next.find((n) => n.id === op.nodeId);
    if (!node) throw new Error(`projection: unknown node '${op.nodeId}'`);
    next = next.map((n) => {
      if (n.id !== op.nodeId) return n;
      return {
        ...n,
        value: op.value ?? n.value,
        sensitivityRange:
          op.low !== undefined && op.high !== undefined
            ? { low: op.low, high: op.high }
            : n.sensitivityRange,
        confidence: op.confidence ?? n.confidence,
      };
    });
  }
  return next;
}

export interface ProjectionSnapshot {
  tam: number;
  sam: number;
  yam: number;
}

export interface NodeProjection {
  nodeId: string;
  metric: Metric; // the metric this leaf actually drives (voi.ts doctrine)
  voiBefore: number; // informationValue — what settling this fact is worth
  voiAfter: number;
  swingBefore: number; // plausible-band swing on `metric`, €M
  swingAfter: number;
}

// The metric a leaf's band swings (same mapping the fact-bank cards use):
// serviceableFactor drives SAM, obtainableFactor drives YAM, all else TAM.
function drivenMetric(nodeId: string): Metric {
  if (nodeId === "serviceableFactor") return "sam";
  if (nodeId === "obtainableFactor") return "yam";
  return "tam";
}

export interface ProjectedAction {
  before: ProjectionSnapshot;
  after: ProjectionSnapshot;
  nodes: NodeProjection[]; // one per distinct projected node
}

/** Funnel + per-node uncertainty, before vs after executing the ops. */
export function projectAction(
  ledger: Ledger,
  scenario: Scenario,
  ops: ProjectionOp[],
): ProjectedAction {
  const projected = applyProjection(ledger, ops);
  const before = evaluate(ledger, scenario);
  const after = evaluate(projected, scenario);
  const nodeIds = [...new Set(ops.map((op) => op.nodeId))];
  return {
    before: { tam: before.tam, sam: before.sam, yam: before.yam },
    after: { tam: after.tam, sam: after.sam, yam: after.yam },
    nodes: nodeIds.map((nodeId) => {
      const metric = drivenMetric(nodeId);
      return {
        nodeId,
        metric,
        voiBefore: informationValue(ledger, scenario, nodeId),
        voiAfter: informationValue(projected, scenario, nodeId),
        swingBefore: bandSwing(ledger, scenario, nodeId, metric),
        swingAfter: bandSwing(projected, scenario, nodeId, metric),
      };
    }),
  };
}

/**
 * Expected Year-1 loss a memo retires, per its retirement semantics
 * (nextStepsSchema — settles / mitigates / bounds / none):
 * - settles:   the action answers the risk's question either way, so the full
 *              expected loss (severity today) comes off the register.
 * - mitigates: the risk still exists but bites a projected world — retired is
 *              severity(today) − severity(on the projected ledger).
 * - bounds/none: €0 — accepting or watching retires nothing, honestly.
 */
export function retiredExposure(
  ledger: Ledger,
  scenario: Scenario,
  risk: Risk,
  memo: Pick<Memo, "projection">,
): number {
  const severityNow = riskSeverity(
    risk.likelihood.value,
    riskImpact(ledger, scenario, risk),
  );
  switch (memo.projection.retirement) {
    case "settles":
      return severityNow;
    case "mitigates": {
      const projected = applyProjection(ledger, memo.projection.ops);
      const severityAfter = riskSeverity(
        risk.likelihood.value,
        riskImpact(projected, scenario, risk),
      );
      return Math.max(0, severityNow - severityAfter);
    }
    case "bounds":
    case "none":
      return 0;
  }
}
