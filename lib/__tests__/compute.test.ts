import { describe, expect, it } from "vitest";
import { oracleLedger as ledger } from "./fixtures/oracleLedger"; // frozen §10 oracle
import { valuesOf } from "@/lib/dimensions";
import type { Scenario } from "@/lib/schema";
import {
  baselineScenario,
  DELTA_ORDER,
  delta,
  evaluate,
  sensitivity,
} from "@/lib/compute";

// The §10 worked example is the test oracle.
const baseline = baselineScenario(ledger);

// "Central Europe ex-Germany × edge × large operators"
const scenario: Scenario = {
  id: "ex-de-edge-large",
  label: "CE ex-Germany × edge × large operators",
  geographies: valuesOf("geography").filter((g) => g !== "DE"), // sum 0.72
  segments: ["edge"], // 0.09
  customerTypes: ["operator-large"], // 0.40
  assumptions: {},
};

describe("evaluate — §10 worked example", () => {
  it("baseline returns tamBase with all dimensions selected", () => {
    const r = evaluate(ledger, baseline);
    expect(r.factors.geography).toBeCloseTo(1, 6);
    expect(r.factors.segment).toBeCloseTo(1, 6);
    expect(r.factors.customerType).toBeCloseTo(1, 6);
    expect(r.tam).toBeCloseTo(1200, 2);
    expect(r.sam).toBeCloseTo(660, 2);
    expect(r.yam).toBeCloseTo(39.6, 2);
  });

  it("scenario applies scope + funnel factors", () => {
    const r = evaluate(ledger, scenario);
    expect(r.factors.geography).toBeCloseTo(0.72, 6);
    expect(r.factors.segment).toBeCloseTo(0.09, 6);
    expect(r.factors.customerType).toBeCloseTo(0.4, 6);
    expect(r.tam).toBeCloseTo(31.1, 2); // 31.104
    expect(r.sam).toBeCloseTo(17.11, 2); // 17.1072
    expect(r.yam).toBeCloseTo(1.03, 2); // 1.026432
  });

  it("assumption overrides touch only SAM/YAM, never TAM", () => {
    const base = evaluate(ledger, baseline);
    const bumped = evaluate(ledger, {
      ...baseline,
      assumptions: { serviceableFactor: 0.65 },
    });
    expect(bumped.tam).toBeCloseTo(base.tam, 6); // TAM unchanged
    expect(bumped.sam).toBeCloseTo(1200 * 0.65, 2); // 780
    expect(bumped.sam).toBeGreaterThan(base.sam);
  });

  it("empty selection yields a zero factor (and zero metric)", () => {
    const empty: Scenario = { ...scenario, segments: [] };
    const r = evaluate(ledger, empty);
    expect(r.factors.segment).toBe(0);
    expect(r.tam).toBe(0);
  });
});

describe("delta — sequential decomposition (§10 telescoping)", () => {
  it("ΔTAM decomposes in funnel order and telescopes exactly", () => {
    const d = delta(ledger, baseline, scenario, "tam");
    expect(d.byFactor.geography).toBeCloseTo(-336.0, 2);
    expect(d.byFactor.segment).toBeCloseTo(-786.24, 2);
    expect(d.byFactor.customerType).toBeCloseTo(-46.66, 2); // -46.656
    expect(d.byFactor.serviceable).toBeCloseTo(0, 6);
    expect(d.byFactor.obtainable).toBeCloseTo(0, 6);

    const sum = DELTA_ORDER.reduce((acc, f) => acc + d.byFactor[f], 0);
    expect(sum).toBeCloseTo(d.total, 9); // telescoping is exact
    expect(d.total).toBeCloseTo(31.104 - 1200, 6); // -1168.896
  });

  it("ΔYAM telescopes to its own total too", () => {
    const d = delta(ledger, baseline, scenario, "yam");
    const sum = DELTA_ORDER.reduce((acc, f) => acc + d.byFactor[f], 0);
    expect(sum).toBeCloseTo(d.total, 9);
    expect(d.total).toBeCloseTo(
      evaluate(ledger, scenario).yam - evaluate(ledger, baseline).yam,
      6,
    );
  });

  it("baseline vs baseline is a zero delta", () => {
    const d = delta(ledger, baseline, baseline, "tam");
    expect(d.total).toBeCloseTo(0, 9);
  });
});

describe("sensitivity — the tornado (§4.3)", () => {
  it("includes only v1 leaves for the scenario and ranks by swing magnitude", () => {
    const bars = sensitivity(ledger, scenario, "tam");
    const ids = bars.map((b) => b.id);

    expect(ids).toContain("tamBase");
    expect(ids).toContain("serviceableFactor");
    expect(ids).toContain("obtainableFactor");
    expect(ids).toContain("seg.edge"); // selected segment share
    expect(ids).toContain("cust.operator-large"); // selected customer share
    expect(ids).not.toContain("seg.hyperscale"); // has a range but NOT selected
    expect(bars).toHaveLength(5);

    // Ranked largest-first; edge share moves TAM most in this scenario.
    expect(bars[0].id).toBe("seg.edge");
    expect(bars[0].magnitude).toBeGreaterThanOrEqual(bars[1].magnitude);
  });

  it("tamBase swings TAM proportionally (±300/1200 → ±7.776)", () => {
    const bars = sensitivity(ledger, scenario, "tam");
    const tamBase = bars.find((b) => b.id === "tamBase")!;
    expect(tamBase.lowSwing).toBeCloseTo(-7.776, 3);
    expect(tamBase.highSwing).toBeCloseTo(7.776, 3);

    // serviceable / obtainable do not move TAM.
    expect(bars.find((b) => b.id === "serviceableFactor")!.magnitude).toBeCloseTo(0, 6);
  });

  it("serviceableFactor moves YAM (non-zero swing on the YAM metric)", () => {
    const bars = sensitivity(ledger, scenario, "yam");
    expect(bars.find((b) => b.id === "serviceableFactor")!.magnitude).toBeGreaterThan(0);
  });

  it("colors are available via per-bar confidence", () => {
    const bars = sensitivity(ledger, scenario, "tam");
    for (const b of bars) expect(["verified", "inferred", "unknown"]).toContain(b.confidence);
  });
});
