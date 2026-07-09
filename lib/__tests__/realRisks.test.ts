import { describe, expect, it } from "vitest";
import { ledger } from "@/lib/ledger";
import { risks } from "@/lib/risks";
import { baselineScenario } from "@/lib/compute";
import { rankRisks, riskImpact } from "@/lib/riskCompute";

// ─────────────────────────────────────────────────────────────────────────────
// Curation contract for the LIVE risk register (mirrors realLedger.test.ts).
// The engine correctness gate is riskCompute.test.ts against the frozen
// oracle; this suite pins what "curated" means for lib/risks.ts.
// ─────────────────────────────────────────────────────────────────────────────

const baseline = baselineScenario(ledger);

describe("real risk register — curation contract", () => {
  it("loads and validates (validateRisks ran at import)", () => {
    expect(risks.length).toBeGreaterThanOrEqual(10);
  });

  it("every risk moves the funnel — a risk that moves nothing isn't a risk", () => {
    for (const risk of risks) {
      const impact = riskImpact(ledger, baseline, risk);
      expect(Math.abs(impact.dYam), `${risk.id} has zero ΔYAM at baseline`).toBeGreaterThan(0);
    }
  });

  it("carries no placeholder remnants", () => {
    const text = JSON.stringify(risks);
    expect(text).not.toMatch(/TBD|ILLUSTRATIVE|PLACEHOLDER|lorem/i);
  });

  it("both boards are populated — the tier split is not degenerate", () => {
    const trueRisks = risks.filter((r) => r.resolution === "risk");
    expect(trueRisks.some((r) => r.tier === "rock")).toBe(true);
    expect(trueRisks.some((r) => r.tier === "front-of-mind")).toBe(true);
  });

  it("errors carry the refinement apparatus; risks never carry corrections", () => {
    for (const risk of risks) {
      if (risk.resolution === "error") {
        expect(risk.settleTest, `${risk.id} needs a settle test`).toBeTruthy();
      } else {
        expect(risk.proposedCorrection, `${risk.id} is a risk with a correction`).toBeUndefined();
      }
    }
  });

  it("every risk carries the partner-grade apparatus", () => {
    for (const risk of risks) {
      expect(risk.falsifier.length, risk.id).toBeGreaterThan(10);
      expect(risk.whyMissable.length, risk.id).toBeGreaterThan(10);
      expect(risk.likelihood.rationale.length, risk.id).toBeGreaterThan(10);
      expect(risk.indicators.length, risk.id).toBeGreaterThanOrEqual(1);
      expect(risk.mitigations.length, risk.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("attached evidence always carries a url and a publisher", () => {
    for (const risk of risks) {
      for (const e of risk.evidence ?? []) {
        expect(e.url, `${risk.id}: '${e.title}'`).toBeTruthy();
        expect(e.publisher, `${risk.id}: '${e.title}'`).toBeTruthy();
      }
    }
  });

  it("ranking vs baseline is deterministic and strictly ordered after tie-break", () => {
    const a = rankRisks(ledger, baseline, risks);
    const b = rankRisks(ledger, baseline, risks);
    expect(a.map((r) => r.risk.id)).toEqual(b.map((r) => r.risk.id));
    for (let i = 1; i < a.length; i++) {
      const strictly =
        a[i - 1].severity > a[i].severity ||
        (a[i - 1].severity === a[i].severity && a[i - 1].risk.id < a[i].risk.id);
      expect(strictly, `rank ${i} not strictly ordered`).toBe(true);
    }
  });

  it("likelihoods are calibrated priors, not certainties", () => {
    for (const risk of risks) {
      expect(risk.likelihood.value, risk.id).toBeGreaterThan(0);
      expect(risk.likelihood.value, risk.id).toBeLessThan(1);
    }
  });
});
