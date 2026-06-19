import { describe, expect, it } from "vitest";
import { DIMENSION_VALUES } from "@/lib/dimensions";
import { ledger } from "@/lib/ledger";
import type { Dimension } from "@/lib/schema";

const DIMENSIONS: Dimension[] = ["geography", "segment", "customerType"];

describe("dimensions ↔ ledger consistency", () => {
  it.each(DIMENSIONS)(
    "every %s dimension value has exactly one matching share node, and vice versa",
    (dimension) => {
      const declared = new Set(DIMENSION_VALUES[dimension].map((d) => d.value));
      const inLedger = new Set(
        ledger.filter((n) => n.dimension === dimension).map((n) => n.dimensionValue),
      );
      expect(inLedger).toEqual(declared);
    },
  );

  it("is orthogonal — no value appears under two dimensions", () => {
    const seen = new Map<string, Dimension>();
    for (const dimension of DIMENSIONS) {
      for (const { value } of DIMENSION_VALUES[dimension]) {
        expect(seen.has(value)).toBe(false);
        seen.set(value, dimension);
      }
    }
  });
});
