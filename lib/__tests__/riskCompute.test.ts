import { describe, expect, it } from "vitest";
import { oracleLedger as ledger } from "./fixtures/oracleLedger"; // frozen §10 oracle
import { baselineScenario } from "@/lib/compute";
import { informationValue } from "@/lib/voi";
import type { Scenario } from "@/lib/schema";
import type { PerturbationOp, Risk } from "@/lib/riskSchema";
import {
  applyPerturbation,
  mitigationVoi,
  rankRisks,
  riskImpact,
  riskSeverity,
} from "@/lib/riskCompute";

// Oracle baseline: TAM 1200 · SAM 660 (×0.55) · YAM 39.6 (×0.06). geo.DE = 0.28.
const baseline = baselineScenario(ledger);

function makeRisk(id: string, perturbation: PerturbationOp[], likelihood = 0.5): Risk {
  return {
    id,
    title: id,
    narrative: "n",
    category: "fact",
    targetNodes: perturbation.map((p) => p.nodeId),
    mechanism: "a → b",
    whyMissable: "w",
    falsifier: "f",
    likelihood: { value: likelihood, rationale: "r", basis: "judgment" },
    perturbation,
    indicators: [{ signal: "s", updates: "increases" }],
    mitigations: [{ action: "act", type: "strategic" }],
    tier: "front-of-mind",
    resolution: "risk",
    asOf: "2026-07-07",
  };
}

describe("riskImpact — §10 oracle", () => {
  it("identity: set/scale to the current value moves nothing", () => {
    for (const ops of [
      [{ nodeId: "tamBase", op: "set", value: 1200 }] as PerturbationOp[],
      [{ nodeId: "tamBase", op: "scale", value: 1 }] as PerturbationOp[],
    ]) {
      const r = riskImpact(ledger, baseline, { perturbation: ops });
      expect(r.dTam).toBeCloseTo(0, 9);
      expect(r.dSam).toBeCloseTo(0, 9);
      expect(r.dYam).toBeCloseTo(0, 9);
    }
  });

  it("set tamBase 900 → dTam −300, dSam −165, dYam −9.9 exactly", () => {
    const r = riskImpact(ledger, baseline, {
      perturbation: [{ nodeId: "tamBase", op: "set", value: 900 }],
    });
    expect(r.dTam).toBeCloseTo(-300, 9);
    expect(r.dSam).toBeCloseTo(-165, 9);
    expect(r.dYam).toBeCloseTo(-9.9, 9);
  });

  it("scale tamBase 0.75 equals set 900", () => {
    const set = riskImpact(ledger, baseline, {
      perturbation: [{ nodeId: "tamBase", op: "set", value: 900 }],
    });
    const scale = riskImpact(ledger, baseline, {
      perturbation: [{ nodeId: "tamBase", op: "scale", value: 0.75 }],
    });
    expect(scale.dTam).toBeCloseTo(set.dTam, 9);
    expect(scale.dYam).toBeCloseTo(set.dYam, 9);
  });

  it("add geo.DE +0.05 → geography factor 1.05, dTam +60 (no re-normalization)", () => {
    const r = riskImpact(ledger, baseline, {
      perturbation: [{ nodeId: "geo.DE", op: "add", value: 0.05 }],
    });
    expect(r.perturbed.factors.geography).toBeCloseTo(1.05, 9);
    expect(r.dTam).toBeCloseTo(60, 9);
  });

  it("a risk's set beats the user's slider on assumption leaves", () => {
    const scenario: Scenario = { ...baseline, assumptions: { serviceableFactor: 0.65 } };
    const r = riskImpact(ledger, scenario, {
      perturbation: [{ nodeId: "serviceableFactor", op: "set", value: 0.3 }],
    });
    expect(r.base.sam).toBeCloseTo(780, 9); // 1200 × 0.65
    expect(r.perturbed.sam).toBeCloseTo(360, 9); // 1200 × 0.30
  });

  it("a risk's scale applies to the EFFECTIVE assumption value", () => {
    const scenario: Scenario = { ...baseline, assumptions: { serviceableFactor: 0.6 } };
    const r = riskImpact(ledger, scenario, {
      perturbation: [{ nodeId: "serviceableFactor", op: "scale", value: 0.5 }],
    });
    expect(r.base.sam).toBeCloseTo(720, 9); // 1200 × 0.60
    expect(r.perturbed.sam).toBeCloseTo(360, 9); // 1200 × 0.30 (scales 0.60, not 0.55)
  });

  it("is scenario-relative: perturbing an unselected share moves nothing", () => {
    const edgeOnly: Scenario = { ...baseline, segments: ["edge"] };
    const r = riskImpact(ledger, edgeOnly, {
      perturbation: [{ nodeId: "seg.hyperscale", op: "set", value: 0.1 }],
    });
    expect(r.dTam).toBeCloseTo(0, 9);
  });

  it("composes multiple ops across nodes", () => {
    const r = riskImpact(ledger, baseline, {
      perturbation: [
        { nodeId: "tamBase", op: "scale", value: 0.8 }, // 960
        { nodeId: "serviceableFactor", op: "set", value: 0.5 },
      ],
    });
    expect(r.perturbed.tam).toBeCloseTo(960, 9);
    expect(r.perturbed.sam).toBeCloseTo(480, 9);
    expect(r.perturbed.yam).toBeCloseTo(28.8, 9);
  });

  it("applies same-node ops in array order", () => {
    const r = riskImpact(ledger, baseline, {
      perturbation: [
        { nodeId: "tamBase", op: "set", value: 1000 },
        { nodeId: "tamBase", op: "scale", value: 0.9 },
      ],
    });
    expect(r.perturbed.tam).toBeCloseTo(900, 9);
  });

  it("exclude removes the dimension value from the scenario (foreclosure)", () => {
    const r = riskImpact(ledger, baseline, {
      perturbation: [{ nodeId: "geo.DE", op: "exclude" }],
    });
    expect(r.perturbed.factors.geography).toBeCloseTo(0.72, 9); // 1 − 0.28
    expect(r.dTam).toBeCloseTo(-336, 9);
  });
});

describe("applyPerturbation — purity", () => {
  it("never mutates its inputs and returns a fresh world", () => {
    const scenario: Scenario = { ...baseline, assumptions: { serviceableFactor: 0.6 } };
    const ledgerSnapshot = structuredClone(ledger);
    const scenarioSnapshot = structuredClone(scenario);

    const world = applyPerturbation(ledger, scenario, [
      { nodeId: "tamBase", op: "set", value: 900 },
      { nodeId: "serviceableFactor", op: "scale", value: 0.5 },
      { nodeId: "geo.DE", op: "exclude" },
    ]);

    expect(ledger).toEqual(ledgerSnapshot);
    expect(scenario).toEqual(scenarioSnapshot);
    expect(world.ledger).not.toBe(ledger);
    expect(world.scenario).not.toBe(scenario);
  });

  it("throws on an unknown node id", () => {
    expect(() =>
      applyPerturbation(ledger, baseline, [{ nodeId: "nope", op: "set", value: 1 }]),
    ).toThrow(/unknown node 'nope'/);
  });
});

describe("riskSeverity / rankRisks", () => {
  it("severity = likelihood × |Δmetric|, defaulting to yam", () => {
    const impact = riskImpact(ledger, baseline, {
      perturbation: [{ nodeId: "tamBase", op: "set", value: 900 }],
    });
    expect(riskSeverity(0.5, impact)).toBeCloseTo(0.5 * 9.9, 9);
    expect(riskSeverity(0.5, impact, "tam")).toBeCloseTo(0.5 * 300, 9);
  });

  it("ranks by severity desc with deterministic id tie-break", () => {
    const big = makeRisk("risk.b-big", [{ nodeId: "tamBase", op: "set", value: 600 }], 0.5);
    const small = makeRisk("risk.small", [{ nodeId: "tamBase", op: "set", value: 1100 }], 0.5);
    // Same perturbation + likelihood → identical severity → id order decides.
    const twinA = makeRisk("risk.a-twin", [{ nodeId: "tamBase", op: "set", value: 600 }], 0.5);

    const ranked = rankRisks(ledger, baseline, [small, big, twinA]);
    expect(ranked.map((r) => r.risk.id)).toEqual(["risk.a-twin", "risk.b-big", "risk.small"]);
    expect(ranked[0].severity).toBeCloseTo(ranked[1].severity, 9);
  });
});

describe("mitigationVoi", () => {
  it("equals lib/voi.ts informationValue for information mitigations", () => {
    const voi = mitigationVoi(ledger, baseline, {
      action: "Commission the sizing report",
      type: "information",
      voiNodeId: "tamBase",
    });
    expect(voi).toBeCloseTo(informationValue(ledger, baseline, "tamBase"), 9);
    expect(voi).toBeGreaterThan(0);
  });

  it("returns null for act-type mitigations", () => {
    expect(
      mitigationVoi(ledger, baseline, { action: "Sign a distributor", type: "strategic" }),
    ).toBeNull();
  });
});
