import { describe, expect, it } from "vitest";
import {
  derivationSchema,
  evidenceSchema,
  factNodeSchema,
  provenanceSchema,
} from "@/lib/schema";
import { ledger } from "@/lib/ledger";
import { SKILLS, validateSkillRefs } from "@/lib/skills";

// ledger.md §9 — enriched-ledger metadata is additive and optional. The existing
// ledger must still validate; full enrichment must parse; skill refs must resolve.

const baseEstimated = {
  id: "geo.DE",
  label: "Germany",
  kind: "estimated" as const,
  value: 0.28,
  unit: "ratio",
  confidence: "inferred" as const,
  asOf: "2026-06-19",
  dimension: "geography" as const,
  dimensionValue: "DE",
};

describe("enriched-ledger schemas", () => {
  it("parses an evidence object (with default attached=true)", () => {
    expect(
      evidenceSchema.parse({
        title: "DCD Intelligence — CE report",
        sourceType: "industry-report",
        publisher: "DCD Intelligence",
        date: "2025-11",
        excerpt: "DE rack capacity ≈ 2.1 GW.",
      }),
    ).toMatchObject({ sourceType: "industry-report", attached: true });
  });

  it("parses a pending (not-yet-attached) evidence object", () => {
    expect(
      evidenceSchema.parse({
        title: "Second independent capacity source",
        sourceType: "pending",
        attached: false,
      }),
    ).toMatchObject({ attached: false });
  });

  it("rejects an unknown sourceType", () => {
    expect(() =>
      evidenceSchema.parse({ title: "x", sourceType: "blog-post" }),
    ).toThrow();
  });

  it("parses a derivation, crossCheck optional", () => {
    expect(
      derivationSchema.parse({
        method: "Top-down capacity apportionment",
        expression: "2.1 ÷ 7.5 = 0.28",
      }),
    ).toMatchObject({ method: "Top-down capacity apportionment" });
  });

  it("parses a provenance, promotionPath optional", () => {
    expect(
      provenanceSchema.parse({ rationale: "Single source → inferred." }),
    ).toMatchObject({ rationale: "Single source → inferred." });
  });
});

describe("factNodeSchema with enrichment", () => {
  it("still validates a node with none of the optional enrichment fields", () => {
    expect(factNodeSchema.parse(baseEstimated)).toMatchObject({ id: "geo.DE" });
  });

  it("parses a fully-enriched estimated node", () => {
    const enriched = {
      ...baseEstimated,
      sensitivityRange: { low: 0.24, high: 0.31 },
      skillId: "geo-share-triangulation",
      maturity: "triangulated",
      derivation: {
        method: "Top-down capacity apportionment",
        expression: "2.1 ÷ 7.5 = 0.28",
        crossCheck: "GDP-weighted: 0.27",
      },
      provenance: {
        rationale: "Single capacity source; GDP cross-check agrees → inferred.",
        promotionPath: "Attach a second source → verified.",
      },
      evidence: [
        {
          title: "DCD Intelligence — CE report",
          sourceType: "industry-report",
          attached: true,
        },
      ],
    };
    expect(factNodeSchema.parse(enriched)).toMatchObject({
      maturity: "triangulated",
      skillId: "geo-share-triangulation",
    });
  });

  it("rejects an unknown maturity rung", () => {
    expect(() =>
      factNodeSchema.parse({ ...baseEstimated, maturity: "gold-plated" }),
    ).toThrow();
  });
});

describe("validateSkillRefs", () => {
  it("passes on the seeded ledger", () => {
    expect(() => validateSkillRefs(ledger)).not.toThrow();
  });

  it("throws on an unknown skillId", () => {
    expect(() => validateSkillRefs([{ skillId: "no-such-skill" }])).toThrow(
      /unknown skill/i,
    );
  });

  it("ignores nodes without a skillId", () => {
    expect(() => validateSkillRefs([{}, { skillId: undefined }])).not.toThrow();
  });

  it("every skillId used in the ledger resolves to a real skill", () => {
    for (const node of ledger) {
      if (node.skillId) expect(SKILLS[node.skillId]).toBeDefined();
    }
  });
});
