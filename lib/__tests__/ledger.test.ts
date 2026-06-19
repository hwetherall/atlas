import { describe, expect, it } from "vitest";
import { ledger } from "@/lib/ledger";
import type { Dimension } from "@/lib/schema";

describe("seed ledger (§10)", () => {
  it("loads and validates without throwing", () => {
    expect(ledger.length).toBeGreaterThan(0);
  });

  it.each<Dimension>(["geography", "segment", "customerType"])(
    "%s shares sum to ~1.0",
    (dimension) => {
      const sum = ledger
        .filter((n) => n.dimension === dimension)
        .reduce((acc, n) => acc + n.value, 0);
      expect(sum).toBeCloseTo(1, 6);
    },
  );

  it("has the canonical funnel + shape leaves", () => {
    const ids = new Set(ledger.map((n) => n.id));
    for (const id of ["tamBase", "serviceableFactor", "obtainableFactor", "shape.cagr", "shape.cr3"]) {
      expect(ids.has(id)).toBe(true);
    }
  });
});
