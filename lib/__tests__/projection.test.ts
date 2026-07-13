import { describe, expect, it } from "vitest";
import { oracleLedger as ledger } from "./fixtures/oracleLedger"; // frozen §10 oracle
import { baselineScenario } from "@/lib/compute";
import { informationValue } from "@/lib/voi";
import { applyProjection, projectAction, retiredExposure } from "@/lib/projection";
import type { Risk } from "@/lib/riskSchema";

const baseline = baselineScenario(ledger);

describe("applyProjection", () => {
  it("re-values, re-bands and promotes confidence without mutating the input", () => {
    const projected = applyProjection(ledger, [
      { nodeId: "tamBase", value: 1300, low: 1250, high: 1350, confidence: "verified" },
    ]);
    const node = projected.find((n) => n.id === "tamBase")!;
    expect(node.value).toBe(1300);
    expect(node.sensitivityRange).toEqual({ low: 1250, high: 1350 });
    expect(node.confidence).toBe("verified");
    const original = ledger.find((n) => n.id === "tamBase")!;
    expect(original.value).toBe(1200);
    expect(original.confidence).toBe("inferred");
  });

  it("a band-only op keeps the value; a value-only op keeps the band", () => {
    const banded = applyProjection(ledger, [{ nodeId: "tamBase", low: 1100, high: 1300 }]);
    expect(banded.find((n) => n.id === "tamBase")!.value).toBe(1200);
    const valued = applyProjection(ledger, [{ nodeId: "tamBase", value: 1000 }]);
    expect(valued.find((n) => n.id === "tamBase")!.sensitivityRange).toEqual({
      low: 900,
      high: 1500,
    });
  });

  it("throws on an unknown node", () => {
    expect(() => applyProjection(ledger, [{ nodeId: "nope", value: 1 }])).toThrow(/unknown node/);
  });
});

describe("projectAction", () => {
  it("verified + re-banded tamBase: VOI collapses to 0, funnel re-derives", () => {
    // §10 oracle: TAM 1200 → 1300 flows through SAM (×0.55) and YAM (×0.06).
    const p = projectAction(ledger, baseline, [
      { nodeId: "tamBase", value: 1300, low: 1250, high: 1350, confidence: "verified" },
    ]);
    expect(p.before.tam).toBeCloseTo(1200, 6);
    expect(p.after.tam).toBeCloseTo(1300, 6);
    expect(p.after.sam).toBeCloseTo(715, 6);
    expect(p.after.yam).toBeCloseTo(42.9, 6);
    const node = p.nodes[0];
    expect(node.voiBefore).toBeCloseTo(150, 6); // swing 300 × inferred 0.5 (voi.test oracle)
    expect(node.voiAfter).toBe(0); // verified → uncertainty 0
    expect(node.swingBefore).toBeCloseTo(300, 6);
    expect(node.swingAfter).toBeCloseTo(50, 6); // band 1250–1350 around 1300
  });

  it("band narrowing alone shrinks swing and VOI proportionally", () => {
    const p = projectAction(ledger, baseline, [{ nodeId: "tamBase", low: 1150, high: 1250 }]);
    expect(p.after.tam).toBeCloseTo(1200, 6); // value untouched
    expect(p.nodes[0].swingAfter).toBeCloseTo(50, 6);
    expect(p.nodes[0].voiAfter).toBeCloseTo(25, 6); // still inferred → × 0.5
    expect(informationValue(ledger, baseline, "tamBase")).toBeCloseTo(150, 6); // input untouched
  });
});

describe("retiredExposure", () => {
  // Minimal risk targeting the oracle ledger: 50% chance tamBase is really 900.
  const risk = {
    likelihood: { value: 0.5, rationale: "test", basis: "judgment" },
    perturbation: [{ nodeId: "tamBase", op: "set", value: 900 }],
  } as unknown as Risk;
  // severity now = 0.5 × |ΔYAM| = 0.5 × (1200−900)×0.55×0.06 = 4.95
  const memoOf = (retirement: "settles" | "mitigates" | "bounds" | "none", ops: never[] | { nodeId: string; value: number }[] = []) => ({
    projection: { ops, retirement, note: "test" },
  });

  it("settles retires the full expected loss", () => {
    expect(retiredExposure(ledger, baseline, risk, memoOf("settles"))).toBeCloseTo(4.95, 6);
  });

  it("mitigates retires the severity delta on the projected model", () => {
    // Projected tamBase 1000 → severity after = 0.5 × (1000−900)×0.033 = 1.65.
    const memo = memoOf("mitigates", [{ nodeId: "tamBase", value: 1000 }]);
    expect(retiredExposure(ledger, baseline, risk, memo)).toBeCloseTo(4.95 - 1.65, 6);
  });

  it("bounds and none retire €0 — accepting or watching changes nothing yet", () => {
    expect(retiredExposure(ledger, baseline, risk, memoOf("bounds"))).toBe(0);
    expect(retiredExposure(ledger, baseline, risk, memoOf("none"))).toBe(0);
  });
});
