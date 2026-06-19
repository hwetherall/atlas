import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// §3.1 — Node, the unit of the fact ledger.
// Exact type names are carried over from the resolved design (CLAUDE.md §3.1).
// The whole ledger is validated with Zod on load; a malformed ledger fails
// loudly at boot rather than silently mis-rendering.
// ─────────────────────────────────────────────────────────────────────────────

export const nodeKindSchema = z.enum([
  "extracted",
  "estimated",
  "calculated",
  "assumption",
]);
export type NodeKind = z.infer<typeof nodeKindSchema>;

// Tri-state confidence, carried over from VentureX.
export const confidenceSchema = z.enum(["verified", "inferred", "unknown"]);
export type Confidence = z.infer<typeof confidenceSchema>;

export const dimensionSchema = z.enum(["geography", "segment", "customerType"]);
export type Dimension = z.infer<typeof dimensionSchema>;

export const sourceSchema = z.object({
  // Required for 'extracted' nodes (enforced at the node level); for
  // 'estimated'/'assumption' a note-only source is permitted (§3.1).
  title: z.string().min(1).optional(),
  url: z.string().optional(),
  note: z.string().optional(),
});
export type Source = z.infer<typeof sourceSchema>;

export const opSchema = z.enum(["product", "sum", "subtract", "share"]);
export type Op = z.infer<typeof opSchema>;

export const sensitivityRangeSchema = z.object({
  low: z.number(),
  high: z.number(),
});
export type SensitivityRange = z.infer<typeof sensitivityRangeSchema>;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "asOf must be an ISO date (YYYY-MM-DD)");

export const factNodeSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    kind: nodeKindSchema,
    value: z.number(),
    unit: z.string().min(1), // 'EUR_M', 'ratio', 'pct', 'units_per_yr', ...
    confidence: confidenceSchema,
    asOf: isoDate,

    // leaf nodes (extracted | estimated | assumption):
    source: sourceSchema.optional(),

    // calculated nodes only:
    op: opSchema.optional(),
    inputs: z.array(z.string()).optional(),

    // share/scope nodes — which lever dimension + value this belongs to:
    dimension: dimensionSchema.optional(),
    dimensionValue: z.string().optional(),

    // risk metadata (makes the module Risk-Seek-ready):
    sensitivityRange: sensitivityRangeSchema.optional(),
  })
  .superRefine((node, ctx) => {
    // Citations are mandatory on extracted nodes (CLAUDE.md §9).
    if (node.kind === "extracted" && !node.source?.title) {
      ctx.addIssue({
        code: "custom",
        message: `extracted node '${node.id}' requires a source with a title`,
        path: ["source"],
      });
    }
    // Calculated nodes are an op over inputs (CLAUDE.md §3.1).
    if (node.kind === "calculated") {
      if (!node.op) {
        ctx.addIssue({
          code: "custom",
          message: `calculated node '${node.id}' requires an 'op'`,
          path: ["op"],
        });
      }
      if (!node.inputs || node.inputs.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: `calculated node '${node.id}' requires non-empty 'inputs'`,
          path: ["inputs"],
        });
      }
    }
    // dimension and dimensionValue travel together.
    if (Boolean(node.dimension) !== Boolean(node.dimensionValue)) {
      ctx.addIssue({
        code: "custom",
        message: `node '${node.id}' must set 'dimension' and 'dimensionValue' together`,
        path: ["dimensionValue"],
      });
    }
  });
export type FactNode = z.infer<typeof factNodeSchema>;

// A ledger is an array of fact nodes with globally unique ids. Calculated
// node inputs must reference ids that exist in the ledger.
export const ledgerSchema = z
  .array(factNodeSchema)
  .superRefine((nodes, ctx) => {
    const seen = new Set<string>();
    for (const n of nodes) {
      if (seen.has(n.id)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate node id '${n.id}'`,
        });
      }
      seen.add(n.id);
    }
    for (const n of nodes) {
      for (const input of n.inputs ?? []) {
        if (!seen.has(input)) {
          ctx.addIssue({
            code: "custom",
            message: `node '${n.id}' references unknown input '${input}'`,
          });
        }
      }
    }
  });
export type Ledger = z.infer<typeof ledgerSchema>;

// §3.4 — Scenario & baseline.
export const scenarioSchema = z.object({
  id: z.string(),
  label: z.string(),
  geographies: z.array(z.string()), // selected dimensionValues
  segments: z.array(z.string()),
  customerTypes: z.array(z.string()),
  assumptions: z.record(z.string(), z.number()), // overrides for assumption leaves, by node id
});
export type Scenario = z.infer<typeof scenarioSchema>;

/**
 * Validate a raw ledger. Throws a ZodError on any malformed input so the app
 * fails loudly at boot (CLAUDE.md §3.1) instead of silently mis-rendering.
 */
export function validateLedger(raw: unknown): Ledger {
  return ledgerSchema.parse(raw);
}
