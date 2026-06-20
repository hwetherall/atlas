import { describe, expect, it } from "vitest";
import { ledger } from "@/lib/ledger";
import { baselineScenario } from "@/lib/compute";
import { informationValue, swingTam } from "@/lib/voi";

const baseline = baselineScenario(ledger);

describe("informationValue", () => {
  it("tamBase ranks #1 across the whole ledger", () => {
    const ranked = [...ledger]
      .map((n) => ({ id: n.id, voi: informationValue(ledger, baseline, n.id) }))
      .sort((a, b) => b.voi - a.voi);
    expect(ranked[0].id).toBe("tamBase");
  });

  it("a banded leaf (geo.DE) outranks a band-less leaf (geo.NL ≈ 0)", () => {
    const de = informationValue(ledger, baseline, "geo.DE");
    const nl = informationValue(ledger, baseline, "geo.NL");
    expect(de).toBeGreaterThan(nl);
    expect(nl).toBe(0);
  });

  it("swing€ is computed for geography even though sensitivity() excludes it", () => {
    // geo.DE band 0.24–0.31 shifts the geography factor without re-normalizing:
    // worst swing = |1200 × (1 − 0.28 + 0.24) − 1200| = 48.
    expect(swingTam(ledger, baseline, "geo.DE")).toBeCloseTo(48, 6);
  });

  it("a node without a sensitivityRange has 0 swing and 0 VOI", () => {
    expect(swingTam(ledger, baseline, "geo.NL")).toBe(0);
    expect(informationValue(ledger, baseline, "geo.NL")).toBe(0);
  });

  it("uncertainty weights confidence: tamBase VOI = swing × 0.5 (inferred)", () => {
    // tamBase band 900–1500 around 1200 → max swing 300; inferred → 0.5.
    expect(swingTam(ledger, baseline, "tamBase")).toBeCloseTo(300, 6);
    expect(informationValue(ledger, baseline, "tamBase")).toBeCloseTo(150, 6);
  });
});
