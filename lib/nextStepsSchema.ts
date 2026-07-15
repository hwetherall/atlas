import { z } from "zod";
import type { Ledger } from "@/lib/schema";
import type { Risk } from "@/lib/riskSchema";

// ─────────────────────────────────────────────────────────────────────────────
// Next Steps §1 — the memo schema (nextsteps.md §3–5).
//
// A memo is board-grade advice for ONE risk: the stakes, the decision, why
// this response beat the other four, the tool's artifact, and what executing
// does to the model. Doctrine unchanged from the register: the data carries
// narrative and *what changes* (projection ops); every € figure on the
// surface is engine-computed at render time. Zod-validated at module load —
// a bad node id or a missing rationale cell fails the build, not the demo.
// ─────────────────────────────────────────────────────────────────────────────

export const responseTypeSchema = z.enum([
  "buy-information",
  "expert",
  "monitor",
  "act",
  "ignore",
]);
export type ResponseType = z.infer<typeof responseTypeSchema>;

// What executing the memo changes in the model: a new value, a narrower
// plausible band, and/or a confidence promotion on a ledger leaf.
export const projectionOpSchema = z
  .object({
    nodeId: z.string().min(1),
    value: z.number().finite().optional(),
    low: z.number().finite().optional(),
    high: z.number().finite().optional(),
    confidence: z.enum(["verified", "inferred", "unknown"]).optional(),
    note: z.string().optional(),
  })
  .refine(
    (op) =>
      op.value !== undefined ||
      (op.low !== undefined && op.high !== undefined) ||
      op.confidence !== undefined,
    { message: "projection op must change a value, a band, or a confidence" },
  );
export type ProjectionOp = z.infer<typeof projectionOpSchema>;

// How the memo's execution counts against the portfolio (nextsteps.md §5):
//   settles   — resolves the linked risk's question either way → full expected
//               loss retires (research/expert answers kill the uncertainty)
//   mitigates — changes the world the risk bites on → severity recomputed on
//               the projected model, retired = before − after
//   bounds    — accepts the risk but caps the regret (Themis) → retires €0
//   none      — watching only (Argus) → retires €0
export const retirementSchema = z.enum(["settles", "mitigates", "bounds", "none"]);
export type Retirement = z.infer<typeof retirementSchema>;

// Three plain beats + one clock. Replaces the old narrative/whenItBites/
// decisionExpiry trio, which read as three disconnected riddles: state what
// the model assumes, what the world does instead, what that costs this year —
// then one merged clock row for when it starts costing and why decide now.
export const stakesSchema = z.object({
  assumption: z.string().min(1), // what the model assumes
  reality: z.string().min(1), // what the world does instead
  consequence: z.string().min(1), // what that costs this year
  clock: z.object({
    whenItBites: z.string().min(1), // when it starts costing us
    whyNow: z.string().min(1), // why the decision can't wait
  }),
});

export const decisionSchema = z.object({
  question: z.string().min(1), // the single sentence to decide
  deadline: z.string().min(1),
  defaultPath: z.string().min(1), // what deciding nothing does
});

// The five-cell strip: every response scored against THIS risk.
export const rationaleCellSchema = z.object({
  response: responseTypeSchema,
  verdict: z.enum(["chosen", "rejected"]),
  note: z.string().min(1), // one honest line
});

export const memoEvidenceSchema = z.object({
  title: z.string().min(1),
  publisher: z.string().nullable().optional(),
  url: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().optional(),
});

// ── Artifacts — the tool deliverable, one shape per response ────────────────

export const delphiOptionSchema = z.object({
  title: z.string().min(1),
  vendor: z.string().min(1),
  scope: z.string().min(1), // what it covers
  price: z.string().min(1), // display string; sourced or marked estimate
  delivery: z.string().min(1), // off-the-shelf / lead time
  settles: z.array(z.string().min(1)).min(1), // ledger node ids it pins
  url: z.string().optional(),
  note: z.string().optional(),
});

export const delphiArtifactSchema = z.object({
  kind: z.literal("delphi"),
  options: z.array(delphiOptionSchema).min(2),
  recommendation: z.string().min(1), // which option(s) and why
});

export const egeriaArtifactSchema = z.object({
  kind: z.literal("egeria"),
  profile: z.object({
    name: z.string().min(1), // fictional by design (nextsteps.md §8)
    title: z.string().min(1),
    location: z.string().min(1),
    background: z.array(z.string().min(1)).min(2), // career bullets
    expertise: z.array(z.string().min(1)).min(2), // area chips
    engagement: z.string().min(1),
  }),
  // 1–3 backup experts, one honest line each on when to prefer them.
  alternates: z
    .array(
      z.object({
        name: z.string().min(1),
        title: z.string().min(1),
        location: z.string().min(1),
        why: z.string().min(1),
      }),
    )
    .min(1)
    .max(3),
  // Prefilled draft for the Email CTA modal; the body is composed from
  // `intro` + the agenda questions. Static demo mock — nothing sends.
  emailDraft: z.object({
    to: z.string().min(1),
    subject: z.string().min(1),
    intro: z.string().min(1),
  }),
  // Kept as data (feeds the email body + node validation) but no longer
  // rendered as a standalone Agenda section.
  agenda: z
    .array(
      z.object({
        question: z.string().min(1),
        nodeId: z.string().min(1), // the ledger fact this question settles
        moves: z.string().min(1), // how the answer moves the model
      }),
    )
    .min(3),
  deliverable: z.string().min(1), // what exists after the call
});

export const argusArtifactSchema = z.object({
  kind: z.literal("argus"),
  watch: z
    .array(
      z.object({
        signal: z.string().min(1),
        feed: z.string().min(1), // where Argus looks
        threshold: z.string().min(1), // what trips the alert
        cadence: z.string().min(1),
      }),
    )
    .min(2),
  escalation: z.string().min(1),
  // Watches Argus carries for the REST of the register — the standing list
  // that makes "here is how we track it" concrete beyond this one risk
  // (e.g. legislative feeds in launch countries, acceptance tripwires).
  alsoWatching: z
    .array(z.object({ signal: z.string().min(1), feed: z.string().min(1) }))
    .optional(),
  // ONE static mock alert, clearly labeled a simulation (nextsteps.md §4).
  mockAlert: z.object({
    label: z.string().min(1), // "Simulated alert — what Argus delivers"
    feedItem: z.string().min(1), // the observed item
    source: z.string().min(1),
    tripped: z.string().min(1), // which threshold, and by what
    effect: z.string().min(1), // how the register re-prices
  }),
});

export const juliusArtifactSchema = z.object({
  kind: z.literal("julius"),
  objective: z.string().min(1),
  workstreams: z
    .array(z.object({ name: z.string().min(1), detail: z.string().min(1) }))
    .min(2),
  milestones: z
    .array(z.object({ when: z.string().min(1), what: z.string().min(1) }))
    .min(3),
  resourcing: z.string().min(1),
  budget: z.string().min(1), // band, not a quote
  leadingIndicators: z.array(z.string().min(1)).min(2),
  killCriteria: z.array(z.string().min(1)).min(1),
});

// The acceptance memo (response "ignore" → Accept & watch). No tool of its
// own — Argus executes it: every revisit trigger below is an Argus tripwire.
export const acceptanceArtifactSchema = z.object({
  kind: z.literal("acceptance"),
  acceptance: z.string().min(1), // the case for accepting
  maxRegretNote: z.string().min(1), // the computed bound, in words
  revisitTriggers: z.array(z.string().min(1)).min(1), // Argus-watched
  sunset: z.string().min(1), // when this acceptance expires unreviewed
  signoff: z.string().min(1), // who owns the acceptance
});

export const artifactSchema = z.discriminatedUnion("kind", [
  delphiArtifactSchema,
  egeriaArtifactSchema,
  argusArtifactSchema,
  juliusArtifactSchema,
  acceptanceArtifactSchema,
]);
export type Artifact = z.infer<typeof artifactSchema>;

// ── The memo ─────────────────────────────────────────────────────────────────

export const memoSchema = z.object({
  riskId: z.string().min(1),
  response: responseTypeSchema,
  headline: z.string().min(1), // the quotable line — the memo's H1
  // One plain declarative mechanism sentence for the campaign table: what the
  // risk does, register voice, no drama. ("Big buyers run their own security
  // audit before you can quote — each one takes a quarter or two.")
  tableLine: z.string().min(1),
  stakes: stakesSchema,
  decision: decisionSchema,
  rationale: z.array(rationaleCellSchema).length(5),
  artifact: artifactSchema,
  projection: z.object({
    ops: z.array(projectionOpSchema), // may be empty (Argus/acceptance: the point is the model does NOT move yet)
    // For "mitigates" memos whose value ops can't carry the payoff (e.g. the
    // risk perturbs by scale, which is invariant under value changes): what
    // executing does to the CHANCE the risk bites. retiredExposure uses it.
    likelihoodAfter: z.number().min(0).max(1).optional(),
    retirement: retirementSchema,
    note: z.string().min(1), // what "the model after" means for this memo
  }),
  evidence: z.array(memoEvidenceSchema),
  asOf: z.string().min(1),
});
export type Memo = z.infer<typeof memoSchema>;

// Artifact kind implied by each response — enforced in validateMemos.
const RESPONSE_ARTIFACT: Record<ResponseType, Artifact["kind"]> = {
  "buy-information": "delphi",
  expert: "egeria",
  monitor: "argus",
  act: "julius",
  ignore: "acceptance",
};

/**
 * Boot-time validation, register doctrine: fail the build, not the demo.
 * Checks shape (zod) plus referential integrity against the ledger and the
 * cycle-2 register.
 */
export function validateMemos(raw: unknown[], ledger: Ledger, risks: Risk[]): Memo[] {
  const memos = raw.map((m, i) => {
    const parsed = memoSchema.safeParse(m);
    if (!parsed.success) {
      throw new Error(`nextSteps memo[${i}] invalid: ${parsed.error.message}`);
    }
    return parsed.data;
  });

  const riskIds = new Set(risks.map((r) => r.id));
  const nodeIds = new Set(ledger.map((n) => n.id));
  const seenResponses = new Set<ResponseType>();

  for (const memo of memos) {
    const tag = `memo ${memo.riskId}`;
    if (!riskIds.has(memo.riskId)) throw new Error(`${tag}: unknown risk id`);
    if (seenResponses.has(memo.response)) {
      throw new Error(`${tag}: duplicate response "${memo.response}"`);
    }
    seenResponses.add(memo.response);
    if (memo.artifact.kind !== RESPONSE_ARTIFACT[memo.response]) {
      throw new Error(
        `${tag}: artifact "${memo.artifact.kind}" does not match response "${memo.response}"`,
      );
    }
    const chosen = memo.rationale.filter((c) => c.verdict === "chosen");
    if (chosen.length !== 1 || chosen[0].response !== memo.response) {
      throw new Error(`${tag}: rationale must choose exactly the memo's own response`);
    }
    if (new Set(memo.rationale.map((c) => c.response)).size !== 5) {
      throw new Error(`${tag}: rationale must cover all five responses`);
    }
    for (const op of memo.projection.ops) {
      if (!nodeIds.has(op.nodeId)) throw new Error(`${tag}: projection targets unknown node '${op.nodeId}'`);
    }
    if (memo.artifact.kind === "delphi") {
      for (const opt of memo.artifact.options) {
        for (const id of opt.settles) {
          if (!nodeIds.has(id)) throw new Error(`${tag}: option "${opt.title}" settles unknown node '${id}'`);
        }
      }
    }
    if (memo.artifact.kind === "egeria") {
      for (const item of memo.artifact.agenda) {
        if (!nodeIds.has(item.nodeId)) throw new Error(`${tag}: agenda question targets unknown node '${item.nodeId}'`);
      }
    }
  }

  if (seenResponses.size !== 5) {
    throw new Error("nextSteps: expected exactly one memo per response type");
  }
  return memos;
}
