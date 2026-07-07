import { describe, expect, it } from "vitest";
import { oracleLedger as ledger } from "./fixtures/oracleLedger"; // frozen §10 oracle
import { baselineScenario } from "@/lib/compute";
import { valuesOf } from "@/lib/dimensions";
import type { Scenario } from "@/lib/schema";
import { marginalContribution } from "@/lib/contribution";

const baseline = baselineScenario(ledger);

describe("marginalContribution", () => {
  it("geo.DE adds €336M to TAM from the pinned baseline (the §10 geography step)", () => {
    // tamBase 1200 × geoShare 0.28 = 336; excluding DE drops TAM 1200 → 864.
    expect(marginalContribution(ledger, baseline, "geo.DE", "tam")).toBeCloseTo(336, 6);
  });

  it("base/assumption leaves have no on/off → 0", () => {
    expect(marginalContribution(ledger, baseline, "tamBase", "tam")).toBe(0);
    expect(marginalContribution(ledger, baseline, "serviceableFactor", "sam")).toBe(0);
    expect(marginalContribution(ledger, baseline, "obtainableFactor", "yam")).toBe(0);
  });

  it("an excluded value reports a negative number (framed as '+€X if included')", () => {
    const exDE: Scenario = {
      ...baseline,
      geographies: valuesOf("geography").filter((g) => g !== "DE"),
    };
    // DE is excluded: cur (ex-DE) − alt (incl-DE) is negative; magnitude is what
    // it WOULD add back.
    const contrib = marginalContribution(ledger, exDE, "geo.DE", "tam");
    expect(contrib).toBeLessThan(0);
    expect(Math.abs(contrib)).toBeCloseTo(336, 6);
  });

  it("an unknown id returns 0", () => {
    expect(marginalContribution(ledger, baseline, "no-such-node", "tam")).toBe(0);
  });
});
