// ─────────────────────────────────────────────────────────────────────────────
// Zod schemas for every LLM stage payload of the risk pipeline, plus their
// JSON-Schema forms for OpenRouter structured outputs. Model output is ALWAYS
// re-validated with Zod after parsing (structured outputs are a hint, not a
// guarantee); failures get one repair round-trip in scripts/risks.mjs.
//
// The FINAL register contract (lib/riskSchema.ts) is enforced separately, by
// the engine bridge's `validate` command — same validator the app boots with.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

// ── Stage 1 — digest ─────────────────────────────────────────────────────────

export const digestSchema = z.object({
  claims: z
    .array(
      z.object({
        claim: z.string().min(1), // atomic, numeric where possible
        number: z.number().nullable(),
        unit: z.string().nullable(),
        sourceTitle: z.string().min(1),
        url: z.string().nullable(),
        excerpt: z.string().min(1), // ≤300 chars, verbatim from the result text
        tags: z.array(
          z.enum([
            "structure",
            "definition",
            "substitution",
            "demand",
            "competition",
            "regulation",
            "base-rate",
            "execution",
          ]),
        ),
      }),
    ),
  tensions: z.array(
    z.object({
      text: z.string().min(1), // claim vs curated ledger value, or claim vs claim
      nodes: z.array(z.string()), // ledger node ids involved
    }),
  ),
  absences: z.array(z.string()), // what was searched for and NOT found
});

export const synthesisSchema = z.object({
  tensions: z.array(
    z.object({
      text: z.string().min(1),
      nodes: z.array(z.string()),
      refs: z.array(z.string()), // digest claim refs: "<group>#c<n>"
    }),
  ),
});

// ── Stage 2 — hunt ───────────────────────────────────────────────────────────

export const perturbationOpSchema = z.object({
  nodeId: z.string().min(1),
  op: z.enum(["set", "scale", "add", "exclude"]),
  value: z.number().nullable(), // null for exclude
  note: z.string().nullable(),
});

export const hypothesisSchema = z.object({
  id: z.string().min(1), // short kebab-case slug
  title: z.string().min(1),
  narrative: z.string().min(1), // the partner-grade paragraph
  category: z.enum(["fact", "model-structure", "boundary", "exogenous", "competitive", "execution"]),
  targetNodes: z.array(z.string().min(1)).min(1),
  mechanism: z
    .array(
      z.object({
        step: z.enum(["trigger", "propagation", "model-impact"]),
        text: z.string().min(1),
        refs: z.array(z.string()).min(1), // "ledger:<id>" | "digest:<group>#c<n>" | "profile:<field>"
      }),
    )
    .min(3),
  whyMissable: z.string().min(1),
  expectedObviousness: z.enum(["low", "medium", "high"]),
  falsifier: z.string().min(1),
  likelihood: z.object({
    value: z.number().min(0).max(1),
    rationale: z.string().min(1),
    basis: z.enum(["evidence", "base-rate", "judgment"]),
  }),
  perturbation: z.array(perturbationOpSchema).min(1),
  indicators: z
    .array(
      z.object({
        signal: z.string().min(1),
        where: z.string().min(1),
        threshold: z.string().nullable(),
        updates: z.enum(["increases", "decreases"]),
      }),
    )
    .min(2),
  mitigations: z
    .array(
      z.object({
        action: z.string().min(1),
        type: z.enum(["information", "contractual", "strategic", "operational"]),
        voiNodeId: z.string().nullable(), // required when type === "information"
        note: z.string().nullable(),
      }),
    )
    .min(2),
});

export const huntBatchSchema = z.object({
  hypotheses: z.array(hypothesisSchema).min(1),
});

// ── Stage 4 — evidence ───────────────────────────────────────────────────────

export const querySetSchema = z.object({
  items: z.array(
    z.object({
      riskId: z.string().min(1),
      queries: z
        .array(
          z.object({
            query: z.string().min(1), // concrete entities, not topic words
            kind: z.enum(["confirming", "falsifying", "base-rate"]),
          }),
        )
        .min(2),
    }),
  ),
});

export const adjudicationSchema = z.object({
  stances: z.array(
    z.object({
      url: z.string().min(1),
      stance: z.enum(["supports", "contradicts", "silent"]),
      quote: z.string().min(1), // verbatim from the result text
    }),
  ),
  status: z.enum(["corroborated", "contested", "refuted", "speculative"]),
  statusRationale: z.string().min(1),
  evidence: z.array(
    z.object({
      title: z.string().min(1),
      sourceType: z.enum(["industry-report", "analyst-estimate", "triangulation"]),
      publisher: z.string().nullable(),
      date: z.string().nullable(),
      excerpt: z.string().min(1),
      url: z.string().min(1),
    }),
  ),
  revisedLikelihood: z.number().min(0).max(1).nullable(), // bounded move, clamped by the harness
  revisionRationale: z.string().nullable(),
});

// ── Stage 6 — polish (executive-register rewrite; content-preserving) ────────

export const polishSchema = z.object({
  title: z.string().min(1),
  narrative: z.string().min(1),
  mechanism: z.array(
    z.object({
      step: z.enum(["trigger", "propagation", "model-impact"]),
      text: z.string().min(1),
      refs: z.array(z.string()), // preserved verbatim from the original
    }),
  ),
  whyMissable: z.string().min(1),
  falsifier: z.string().min(1),
  likelihoodRationale: z.string().min(1),
});

// ── Stage 7 — classify (errors vs risks; the reducible/irreducible split) ────

export const classifySchema = z.object({
  resolution: z.enum(["error", "risk"]),
  settleTest: z.string().min(1), // the artifact that would settle the claim
  // Errors only (null for risks): the concrete correction the claim implies.
  proposedCorrection: z
    .object({
      nodeId: z.string().min(1),
      value: z.number(),
      low: z.number().nullable(),
      high: z.number().nullable(),
      rationale: z.string().min(1),
    })
    .nullable(),
  // Errors only: targeted queries for the refinement research pass.
  researchQueries: z.array(
    z.object({
      query: z.string().min(1),
      kind: z.enum(["confirming", "falsifying"]),
    }),
  ),
});

// ── Refinement loop (scripts/refine.mjs) — verdict on a proposed correction ──

export const refineVerdictSchema = z
  .object({
    // confirm/adjust → a ledger patch to curate; refute → the current value
    // stands and the error dies; unsettleable → NO web artifact settles the
    // load-bearing quantity — the error ESCALATES to an instrument outside
    // web research and leaves the refinement queue.
    verdict: z.enum(["confirm", "adjust", "refute", "unsettleable"]),
    // The final suggested ledger patch (null when refuted or unsettleable).
    value: z.number().nullable(),
    low: z.number().nullable(),
    high: z.number().nullable(),
    rationale: z.string().min(1), // ≤2 sentences, executive register
    // Unsettleable only: the cheapest instrument that WOULD settle the claim.
    instrument: z.enum(["commission-report", "buy-data", "expert-calls", "experiment"]).nullable(),
    instrumentNote: z.string().nullable(), // what it must measure, concretely
    evidence: z.array(
      z.object({
        title: z.string().min(1),
        sourceType: z.enum(["industry-report", "analyst-estimate", "triangulation"]),
        publisher: z.string().nullable(),
        date: z.string().nullable(),
        excerpt: z.string().min(1), // verbatim from the result text
        url: z.string().min(1),
      }),
    ),
  })
  .superRefine((v, ctx) => {
    if (v.verdict === "unsettleable" && !v.instrument) {
      ctx.addIssue({
        code: "custom",
        message: "unsettleable verdict requires an instrument",
        path: ["instrument"],
      });
    }
    if ((v.verdict === "confirm" || v.verdict === "adjust") && v.value === null) {
      ctx.addIssue({
        code: "custom",
        message: `${v.verdict} verdict requires a suggested value`,
        path: ["value"],
      });
    }
  });

// ── Stage 5 — judge ──────────────────────────────────────────────────────────

const dimensionScoreSchema = z.object({
  score: z.number().int().min(0).max(4),
  note: z.string().min(1), // ≤2 sentences citing the risk's own fields
});

export const scorecardSchema = z.object({
  specificity: dimensionScoreSchema,
  nonObviousness: dimensionScoreSchema,
  mechanismDepth: dimensionScoreSchema,
  evidenceQuality: dimensionScoreSchema,
  decisionRelevance: dimensionScoreSchema,
});

// The merge is a PARTITION, not a pick-one: risks that merely share a funnel
// node are distinct risks and come back as singleton groups. Only true
// duplicates (same underlying mechanism) are absorbed into an exemplar.
export const mergeSchema = z.object({
  rationale: z.string().min(1),
  groups: z.array(
    z.object({
      keepId: z.string().min(1),
      absorbs: z.array(z.string()), // TRUE duplicates folded into keepId ([] for singletons)
      foldedIndicators: z.array(
        z.object({
          signal: z.string().min(1),
          where: z.string().min(1),
          threshold: z.string().nullable(),
          updates: z.enum(["increases", "decreases"]),
        }),
      ),
    }),
  ),
});

// Semantic dedup (judge pass 2): a global partition of the register into
// mechanism families, produced by the BASIC model under SEMANTIC_DEDUP.
// Harness guarantees in code (not Zod): unmentioned ids become singletons,
// double-assigned ids keep their first family.
export const familyPartitionSchema = z.object({
  families: z.array(
    z.object({
      label: z.string().min(1), // kebab-case mechanism name
      memberIds: z.array(z.string().min(1)).min(1),
      rationale: z.string().min(1), // one sentence: why these are one mechanism
    }),
  ),
});

// ── JSON-Schema forms for OpenRouter response_format ─────────────────────────

// Anthropic's structured-output backend rejects several JSON-Schema keywords
// (verified live: maxItems on arrays, numeric minimum/maximum). Strip them —
// Zod still enforces the real constraints after parsing, and hard caps that
// models routinely overshoot live in code (slice), not in Zod, so a compliant
// wire response never fails local validation.
const UNSUPPORTED_KEYWORDS = [
  "maxItems",
  "minItems",
  "maxLength",
  "minLength",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  "pattern",
  "format",
];

function stripUnsupported(node) {
  if (Array.isArray(node)) {
    node.forEach(stripUnsupported);
  } else if (node && typeof node === "object") {
    for (const kw of UNSUPPORTED_KEYWORDS) delete node[kw];
    Object.values(node).forEach(stripUnsupported);
  }
  return node;
}

export function jsonSchemaOf(schema, name) {
  return { name, strict: true, schema: stripUnsupported(z.toJSONSchema(schema)) };
}
