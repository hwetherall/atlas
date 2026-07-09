import { z } from "zod";
import { evidenceSchema, isoDate, type FactNode, type Ledger } from "@/lib/schema";
import { TAM_BASE_ID } from "@/lib/compute";

// ─────────────────────────────────────────────────────────────────────────────
// Risk Engine §1 — the risk register contract.
//
// A risk is a claim that COMPILES TO A MODEL PERTURBATION: it names ledger
// node ids and carries machine-readable ops. € impact (ΔTAM/ΔSAM/ΔYAM),
// severity and VOI are always computed by the engine (lib/riskCompute.ts) —
// nothing computable is stored here. A "risk" with no node to perturb cannot
// exist in this schema; that is the point.
//
// Same doctrine as the ledger: the register is validated on load and a
// malformed register fails loudly at boot (validateRisks, below).
// ─────────────────────────────────────────────────────────────────────────────

export const riskCategorySchema = z.enum([
  "fact", // a ledger value could be wrong (the band is real)
  "model-structure", // the multiplicative funnel itself could mis-shape
  "boundary", // something excluded (lib/boundary.ts) could matter
  "exogenous", // macro / regulatory / demand shocks
  "competitive", // concentration / incumbent response / foreclosure
  "execution", // entrant-side: ramp, certification, channel
]);
export type RiskCategory = z.infer<typeof riskCategorySchema>;

// ── Perturbation ops: the compile target. ────────────────────────────────────
// Ops apply in array order (later ops on the same node see earlier results).
// Assumption leaves apply to the EFFECTIVE value (scenario override ?? ledger
// default) and write into scenario.assumptions — a risk's claim beats the
// user's slider. All other leaves clone the ledger; sibling shares are NOT
// re-normalized (same documented v1 caveat as the tornado).
// 'exclude' targets a dimension node and removes its dimensionValue from the
// scenario selection: "this cell is unavailable *to us*" (foreclosure), as
// opposed to "the cell shrinks" (a value op).
export const perturbationOpSchema = z
  .object({
    nodeId: z.string().min(1),
    op: z.enum(["set", "scale", "add", "exclude"]),
    value: z.number().finite().optional(),
    note: z.string().optional(), // human gloss: "−25% demand shock"
  })
  .superRefine((p, ctx) => {
    if (p.op === "exclude" && p.value !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: `exclude op on '${p.nodeId}' must not carry a value`,
        path: ["value"],
      });
    }
    if (p.op !== "exclude" && p.value === undefined) {
      ctx.addIssue({
        code: "custom",
        message: `${p.op} op on '${p.nodeId}' requires a value`,
        path: ["value"],
      });
    }
    if (p.op === "scale" && p.value !== undefined && p.value <= 0) {
      ctx.addIssue({
        code: "custom",
        message: `scale op on '${p.nodeId}' requires a positive factor`,
        path: ["value"],
      });
    }
  });
export type PerturbationOp = z.infer<typeof perturbationOpSchema>;

// ── Indicators: the Bayesian hooks — observable early-warning signals that
//    would move the likelihood before the risk materializes. ─────────────────
export const indicatorSchema = z.object({
  signal: z.string().min(1), // the observable ("Omdia CE colo MW forecast revision")
  where: z.string().optional(), // a named place to watch (tender portal, capex call)
  threshold: z.string().optional(), // the reading that triggers re-assessment
  updates: z.enum(["increases", "decreases"]).default("increases"), // effect on likelihood when observed
});
export type Indicator = z.infer<typeof indicatorSchema>;

// ── Mitigations. Information-type mitigations resolve a ledger fact, so their
//    value is computable (lib/voi.ts informationValue on voiNodeId). ──────────
export const mitigationTypeSchema = z.enum([
  "information", // buy/verify a fact → carries voiNodeId, gets a computed VOI
  "contractual",
  "strategic",
  "operational",
]);
export type MitigationType = z.infer<typeof mitigationTypeSchema>;

export const mitigationSchema = z
  .object({
    action: z.string().min(1),
    type: mitigationTypeSchema,
    voiNodeId: z.string().optional(), // information-type only: the node the info de-risks
    note: z.string().optional(),
  })
  .superRefine((m, ctx) => {
    if (m.type === "information" && !m.voiNodeId) {
      ctx.addIssue({
        code: "custom",
        message: "information mitigation requires a voiNodeId",
        path: ["voiNodeId"],
      });
    }
    if (m.type !== "information" && m.voiNodeId) {
      ctx.addIssue({
        code: "custom",
        message: "voiNodeId is only for information mitigations",
        path: ["voiNodeId"],
      });
    }
  });
export type Mitigation = z.infer<typeof mitigationSchema>;

export const evidenceStatusSchema = z.enum([
  "corroborated", // ≥1 independent source materially supports the key premise
  "contested", // credible contradiction of a non-load-bearing link — kept, flagged
  "speculative", // no external signal either way — kept, never silently killed
]);
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;

// The two boards of the register — a stored judgment, not a computable.
export const riskTierSchema = z.enum([
  "front-of-mind", // "the risks you've probably thought of"
  "rock", // "the rocks you didn't look under"
]);
export type RiskTier = z.infer<typeof riskTierSchema>;

// ── Errors vs risks: the reducible/irreducible split. ────────────────────────
// The settle-it test: "name the artifact that would settle this claim." If a
// report, dataset or a week of expert calls settles it, the claim is an ERROR
// in the model — research fixes it (the fact-bank refinement loop). If only
// time settles it, it is a RISK — you monitor its indicators and mitigate.
export const resolutionSchema = z.enum(["error", "risk"]);
export type Resolution = z.infer<typeof resolutionSchema>;

// For errors: the concrete correction the claim implies, to be confirmed or
// refuted by the refinement research pass. Curation reviews a diff, not a
// question — values still never auto-flow into the ledger.
export const proposedCorrectionSchema = z.object({
  nodeId: z.string().min(1), // the ledger fact to correct
  value: z.number().finite(), // suggested corrected value
  low: z.number().optional(), // suggested band
  high: z.number().optional(),
  rationale: z.string().min(1),
});
export type ProposedCorrection = z.infer<typeof proposedCorrectionSchema>;

export const riskSchema = z.object({
  id: z.string().min(1), // "risk.busway-hyperscale"
  title: z.string().min(1),
  narrative: z.string().min(1), // the partner-grade paragraph
  category: riskCategorySchema,
  targetNodes: z.array(z.string().min(1)).min(1), // ledger ids the claim is about
  mechanism: z.string().min(1), // causal chain, arrow form: "A → B → C"
  whyMissable: z.string().min(1), // why a competent founder's list omits this
  falsifier: z.string().min(1), // the observation that would kill this risk
  likelihood: z.object({
    value: z.number().min(0).max(1),
    rationale: z.string().min(1),
    basis: z.enum(["evidence", "base-rate", "judgment"]),
  }),
  perturbation: z.array(perturbationOpSchema).min(1), // the machine-readable claim
  indicators: z.array(indicatorSchema).min(1),
  mitigations: z.array(mitigationSchema).min(1),
  evidence: z.array(evidenceSchema).optional(),
  evidenceStatus: evidenceStatusSchema.optional(),
  tier: riskTierSchema,
  resolution: resolutionSchema,
  settleTest: z.string().optional(), // the artifact that would settle the claim
  proposedCorrection: proposedCorrectionSchema.optional(), // errors only
  asOf: isoDate,
});
export type Risk = z.infer<typeof riskSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Cross-validation against the ledger. Zod alone can't know ledger ids, so —
// following the validateSkillRefs pattern — validateRisks checks referential
// integrity and perturbation domains, collects EVERY issue, and throws one
// loud error at boot.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A perturbation may only touch nodes that evaluate() actually reads:
 * tamBase, the two assumption leaves, or a dimension share. Perturbing a
 * context node (shape.cagr, shape.cr3) would be a silent no-op — an error.
 */
export function isFunnelActive(node: FactNode): boolean {
  return node.id === TAM_BASE_ID || node.kind === "assumption" || Boolean(node.dimension);
}

export function validateRisks(raw: unknown, ledger: Ledger): Risk[] {
  const risks = z.array(riskSchema).parse(raw);
  const byId = new Map(ledger.map((n) => [n.id, n]));
  const issues: string[] = [];

  const seen = new Set<string>();
  for (const risk of risks) {
    if (seen.has(risk.id)) issues.push(`duplicate risk id '${risk.id}'`);
    seen.add(risk.id);

    for (const target of risk.targetNodes) {
      if (!byId.has(target)) {
        issues.push(`risk '${risk.id}' targets unknown node '${target}'`);
      }
    }

    // Simulate the op chain over ledger defaults to check domains statically.
    // (Runtime user overrides can shift assumption baselines slightly — the
    // same documented caveat as the tornado's no-renormalization.)
    const effective = new Map<string, number>();
    for (const op of risk.perturbation) {
      const node = byId.get(op.nodeId);
      if (!node) {
        issues.push(`risk '${risk.id}' perturbs unknown node '${op.nodeId}'`);
        continue;
      }
      if (!isFunnelActive(node)) {
        issues.push(
          `risk '${risk.id}' perturbs '${op.nodeId}', which is not funnel-active — a silent no-op`,
        );
        continue;
      }
      if (!risk.targetNodes.includes(op.nodeId)) {
        issues.push(
          `risk '${risk.id}' perturbs '${op.nodeId}' but does not list it in targetNodes`,
        );
      }
      if (op.op === "exclude") {
        if (!node.dimension) {
          issues.push(
            `risk '${risk.id}' excludes '${op.nodeId}', which has no dimension to exclude from`,
          );
        }
        continue;
      }
      const current = effective.get(op.nodeId) ?? node.value;
      const next =
        op.op === "set" ? op.value! : op.op === "scale" ? current * op.value! : current + op.value!;
      effective.set(op.nodeId, next);
      if (node.unit === "ratio" && (next < 0 || next > 1)) {
        issues.push(
          `risk '${risk.id}' pushes ratio node '${op.nodeId}' to ${next} — outside [0, 1]`,
        );
      }
      if (node.unit === "EUR_M" && next <= 0) {
        issues.push(`risk '${risk.id}' pushes '${op.nodeId}' to ${next} — EUR_M must stay > 0`);
      }
    }

    for (const m of risk.mitigations) {
      if (m.voiNodeId && !byId.has(m.voiNodeId)) {
        issues.push(
          `risk '${risk.id}' mitigation '${m.action}' references unknown node '${m.voiNodeId}'`,
        );
      }
    }

    if (risk.proposedCorrection) {
      if (risk.resolution !== "error") {
        issues.push(`risk '${risk.id}' has a proposedCorrection but is not an error`);
      }
      if (!byId.has(risk.proposedCorrection.nodeId)) {
        issues.push(
          `risk '${risk.id}' proposes a correction to unknown node '${risk.proposedCorrection.nodeId}'`,
        );
      }
    }
  }

  if (issues.length > 0) {
    throw new Error(`invalid risk register:\n  - ${issues.join("\n  - ")}`);
  }
  return risks;
}
