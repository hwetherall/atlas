import { describe, expect, it } from "vitest";
import { validateLedger } from "@/lib/schema";
import { riskSchema, validateRisks, type Risk } from "@/lib/riskSchema";

// Minimal ledger exercising every funnel-active shape plus a context node.
const ledger = validateLedger([
  {
    id: "tamBase",
    label: "Base",
    kind: "estimated",
    value: 320,
    unit: "EUR_M",
    confidence: "inferred",
    asOf: "2026-07-06",
  },
  {
    id: "geo.DE",
    label: "Germany",
    kind: "estimated",
    value: 0.5,
    unit: "ratio",
    confidence: "inferred",
    asOf: "2026-07-06",
    dimension: "geography",
    dimensionValue: "DE",
  },
  {
    id: "seg.hyperscale",
    label: "Hyperscale",
    kind: "estimated",
    value: 0.44,
    unit: "ratio",
    confidence: "inferred",
    asOf: "2026-07-06",
    dimension: "segment",
    dimensionValue: "hyperscale",
  },
  {
    id: "serviceableFactor",
    label: "Serviceable share",
    kind: "assumption",
    value: 0.55,
    unit: "ratio",
    confidence: "inferred",
    asOf: "2026-07-06",
  },
  {
    id: "shape.cagr",
    label: "Market CAGR",
    kind: "estimated",
    value: 0.09,
    unit: "ratio",
    confidence: "inferred",
    asOf: "2026-07-06",
  },
]);

const validRisk: Risk = {
  id: "risk.test",
  title: "Hyperscale slice is smaller than modeled",
  narrative: "A partner-grade paragraph.",
  category: "boundary",
  targetNodes: ["seg.hyperscale"],
  mechanism: "busway adoption → rack-PDU displacement → hyperscale share shrinks",
  whyMissable: "The exclusion list looks like a scoping footnote.",
  falsifier: "2026 hyperscale rack-PDU order growth in CE.",
  likelihood: { value: 0.35, rationale: "documented busway shift", basis: "evidence" },
  perturbation: [{ nodeId: "seg.hyperscale", op: "set", value: 0.22 }],
  indicators: [{ signal: "OCP power-shelf CE deployments", updates: "increases" }],
  mitigations: [
    { action: "Commission a CE rack-power architecture survey", type: "information", voiNodeId: "seg.hyperscale" },
  ],
  tier: "rock",
  resolution: "risk",
  asOf: "2026-07-07",
};

describe("riskSchema", () => {
  it("parses a well-formed risk", () => {
    expect(riskSchema.parse(validRisk)).toMatchObject({ id: "risk.test" });
  });

  it("rejects likelihood outside [0, 1]", () => {
    expect(() =>
      riskSchema.parse({ ...validRisk, likelihood: { ...validRisk.likelihood, value: 1.2 } }),
    ).toThrow();
  });

  it("requires a value on set/scale/add ops", () => {
    expect(() =>
      riskSchema.parse({
        ...validRisk,
        perturbation: [{ nodeId: "seg.hyperscale", op: "set" }],
      }),
    ).toThrow();
  });

  it("forbids a value on exclude ops", () => {
    expect(() =>
      riskSchema.parse({
        ...validRisk,
        perturbation: [{ nodeId: "seg.hyperscale", op: "exclude", value: 0.2 }],
      }),
    ).toThrow();
  });

  it("requires a positive scale factor", () => {
    expect(() =>
      riskSchema.parse({
        ...validRisk,
        perturbation: [{ nodeId: "seg.hyperscale", op: "scale", value: -0.5 }],
      }),
    ).toThrow();
  });

  it("requires voiNodeId on information mitigations only", () => {
    expect(() =>
      riskSchema.parse({
        ...validRisk,
        mitigations: [{ action: "Verify the mix", type: "information" }],
      }),
    ).toThrow();
    expect(() =>
      riskSchema.parse({
        ...validRisk,
        mitigations: [{ action: "Sign a distributor", type: "strategic", voiNodeId: "geo.DE" }],
      }),
    ).toThrow();
  });
});

describe("validateRisks", () => {
  it("accepts a valid register", () => {
    expect(validateRisks([validRisk], ledger)).toHaveLength(1);
  });

  it("throws on duplicate risk ids", () => {
    expect(() => validateRisks([validRisk, validRisk], ledger)).toThrow(/duplicate risk id/);
  });

  it("throws on an unknown target node", () => {
    expect(() =>
      validateRisks([{ ...validRisk, targetNodes: ["seg.hyperscaler"] }], ledger),
    ).toThrow(/unknown node 'seg.hyperscaler'/);
  });

  it("throws when perturbing a non-funnel-active context node", () => {
    expect(() =>
      validateRisks(
        [
          {
            ...validRisk,
            targetNodes: ["shape.cagr"],
            perturbation: [{ nodeId: "shape.cagr", op: "set", value: 0.03 }],
          },
        ],
        ledger,
      ),
    ).toThrow(/not funnel-active/);
  });

  it("throws when a perturbed node is missing from targetNodes", () => {
    expect(() =>
      validateRisks(
        [{ ...validRisk, perturbation: [{ nodeId: "tamBase", op: "scale", value: 0.8 }] }],
        ledger,
      ),
    ).toThrow(/does not list it in targetNodes/);
  });

  it("throws when an op chain pushes a ratio outside [0, 1]", () => {
    expect(() =>
      validateRisks(
        [
          {
            ...validRisk,
            perturbation: [{ nodeId: "seg.hyperscale", op: "add", value: 0.7 }],
          },
        ],
        ledger,
      ),
    ).toThrow(/outside \[0, 1\]/);
  });

  it("checks the op chain cumulatively, in order", () => {
    // set 0.9 then add 0.2 → 1.1: the second op breaches, not the first.
    expect(() =>
      validateRisks(
        [
          {
            ...validRisk,
            perturbation: [
              { nodeId: "seg.hyperscale", op: "set", value: 0.9 },
              { nodeId: "seg.hyperscale", op: "add", value: 0.2 },
            ],
          },
        ],
        ledger,
      ),
    ).toThrow(/outside \[0, 1\]/);
  });

  it("throws when EUR_M is pushed to zero or below", () => {
    expect(() =>
      validateRisks(
        [
          {
            ...validRisk,
            targetNodes: ["tamBase"],
            perturbation: [{ nodeId: "tamBase", op: "add", value: -320 }],
          },
        ],
        ledger,
      ),
    ).toThrow(/EUR_M must stay > 0/);
  });

  it("throws when excluding a node with no dimension", () => {
    expect(() =>
      validateRisks(
        [
          {
            ...validRisk,
            targetNodes: ["serviceableFactor"],
            perturbation: [{ nodeId: "serviceableFactor", op: "exclude" }],
          },
        ],
        ledger,
      ),
    ).toThrow(/no dimension to exclude from/);
  });

  it("accepts an exclude op on a dimension node", () => {
    const risk = {
      ...validRisk,
      targetNodes: ["geo.DE"],
      perturbation: [{ nodeId: "geo.DE", op: "exclude" as const }],
    };
    expect(validateRisks([risk], ledger)).toHaveLength(1);
  });

  it("throws on an information mitigation referencing an unknown node", () => {
    expect(() =>
      validateRisks(
        [
          {
            ...validRisk,
            mitigations: [{ action: "Verify", type: "information", voiNodeId: "geo.XX" }],
          },
        ],
        ledger,
      ),
    ).toThrow(/unknown node 'geo.XX'/);
  });

  it("reports every issue, not just the first", () => {
    const bad = {
      ...validRisk,
      targetNodes: ["nope"],
      perturbation: [{ nodeId: "also-nope", op: "set" as const, value: 1 }],
    };
    try {
      validateRisks([bad], ledger);
      expect.unreachable("should have thrown");
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).toContain("unknown node 'nope'");
      expect(msg).toContain("unknown node 'also-nope'");
    }
  });
});
