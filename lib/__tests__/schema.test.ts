import { describe, expect, it } from "vitest";
import { factNodeSchema, scenarioSchema, validateLedger } from "@/lib/schema";

const validExtracted = {
  id: "tamBase",
  label: "Base",
  kind: "extracted",
  value: 1200,
  unit: "EUR_M",
  confidence: "inferred",
  asOf: "2026-06-19",
  source: { title: "[source TBD]" },
};

describe("factNodeSchema", () => {
  it("parses a well-formed node", () => {
    expect(factNodeSchema.parse(validExtracted)).toMatchObject({ id: "tamBase" });
  });

  it("throws on a missing required field", () => {
    const { value: _omit, ...noValue } = validExtracted;
    expect(() => factNodeSchema.parse(noValue)).toThrow();
  });

  it("throws on an unknown enum value", () => {
    expect(() =>
      factNodeSchema.parse({ ...validExtracted, kind: "guessed" }),
    ).toThrow();
  });

  it("requires a source on extracted nodes", () => {
    const { source: _omit, ...noSource } = validExtracted;
    expect(() => factNodeSchema.parse(noSource)).toThrow();
  });

  it("requires op + inputs on calculated nodes", () => {
    expect(() =>
      factNodeSchema.parse({ ...validExtracted, kind: "calculated", source: undefined }),
    ).toThrow();
    expect(
      factNodeSchema.parse({
        ...validExtracted,
        kind: "calculated",
        source: undefined,
        op: "product",
        inputs: ["a", "b"],
      }),
    ).toMatchObject({ op: "product" });
  });

  it("requires dimension and dimensionValue together", () => {
    expect(() =>
      factNodeSchema.parse({ ...validExtracted, dimension: "geography" }),
    ).toThrow();
  });

  it("rejects a non-ISO asOf date", () => {
    expect(() =>
      factNodeSchema.parse({ ...validExtracted, asOf: "June 19 2026" }),
    ).toThrow();
  });
});

describe("validateLedger", () => {
  it("throws on duplicate node ids", () => {
    expect(() => validateLedger([validExtracted, validExtracted])).toThrow(/duplicate/i);
  });

  it("throws when a calculated node references an unknown input", () => {
    const calc = {
      ...validExtracted,
      id: "tam",
      kind: "calculated",
      source: undefined,
      op: "product",
      inputs: ["does-not-exist"],
    };
    expect(() => validateLedger([validExtracted, calc])).toThrow(/unknown input/i);
  });
});

describe("scenarioSchema", () => {
  it("parses a well-formed scenario", () => {
    expect(
      scenarioSchema.parse({
        id: "s1",
        label: "S1",
        geographies: ["DE"],
        segments: ["edge"],
        customerTypes: ["operator-large"],
        assumptions: { serviceableFactor: 0.5 },
      }),
    ).toMatchObject({ id: "s1" });
  });
});
