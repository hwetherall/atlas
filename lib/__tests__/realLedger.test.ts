import { describe, expect, it } from "vitest";
import { ledger } from "@/lib/ledger";
import { baselineScenario } from "@/lib/compute";
import { deriveGraph } from "@/lib/graph";

// ─────────────────────────────────────────────────────────────────────────────
// Sanity suite for the REAL (curated) ledger. The engine's exact-number oracle
// lives in fixtures/oracleLedger.ts; these tests instead pin the curation
// contract: sourced evidence, honest ranges, no placeholder remnants.
// ─────────────────────────────────────────────────────────────────────────────

describe("curated ledger — sourcing contract", () => {
  it("every node carries evidence or a provenance rationale", () => {
    for (const n of ledger) {
      const hasEvidence = (n.evidence?.length ?? 0) > 0;
      const hasRationale = Boolean(n.provenance?.rationale);
      expect(hasEvidence || hasRationale, n.id).toBe(true);
    }
  });

  it("extracted nodes have a URL'd source or attached URL'd evidence", () => {
    for (const n of ledger.filter((n) => n.kind === "extracted")) {
      const urled =
        Boolean(n.source?.url) ||
        (n.evidence ?? []).some((e) => e.attached && Boolean(e.url));
      expect(urled, n.id).toBe(true);
    }
  });

  it("attached external evidence entries carry a URL and a publisher or date", () => {
    for (const n of ledger) {
      for (const e of n.evidence ?? []) {
        if (!e.attached) continue;
        if (e.sourceType === "internal" || e.sourceType === "pending") continue;
        expect(e.url, `${n.id}: ${e.title}`).toBeTruthy();
        expect(Boolean(e.publisher || e.date), `${n.id}: ${e.title}`).toBe(true);
      }
    }
  });

  it("no placeholder remnants survive curation", () => {
    expect(JSON.stringify(ledger)).not.toMatch(/source TBD|ILLUSTRATIVE/);
  });

  it("asOf dates reflect the research pass", () => {
    for (const n of ledger) {
      expect(n.asOf >= "2026-07-01", n.id).toBe(true);
    }
  });
});

describe("curated ledger — value ranges", () => {
  it("sensitivity ranges bracket the value (low < value < high)", () => {
    for (const n of ledger) {
      if (!n.sensitivityRange) continue;
      expect(n.sensitivityRange.low, n.id).toBeLessThan(n.value);
      expect(n.sensitivityRange.high, n.id).toBeGreaterThan(n.value);
      if (n.unit === "ratio") {
        expect(n.sensitivityRange.low, n.id).toBeGreaterThanOrEqual(0);
        expect(n.sensitivityRange.high, n.id).toBeLessThanOrEqual(1);
      }
    }
  });

  it("funnel factors stay within their lever bounds", () => {
    const serviceable = ledger.find((n) => n.id === "serviceableFactor")!;
    const obtainable = ledger.find((n) => n.id === "obtainableFactor")!;
    expect(serviceable.value).toBeGreaterThan(0);
    expect(serviceable.value).toBeLessThan(1);
    expect(obtainable.value).toBeGreaterThan(0);
    expect(obtainable.value).toBeLessThanOrEqual(0.2); // levers.ts slider cap
  });

  it("tamBase is a positive EUR_M figure", () => {
    const tamBase = ledger.find((n) => n.id === "tamBase")!;
    expect(tamBase.unit).toBe("EUR_M");
    expect(tamBase.value).toBeGreaterThan(0);
  });
});

describe("curated ledger — graph integrity", () => {
  it("derives a well-formed graph with baseline factors of 1", () => {
    const graph = deriveGraph(ledger, baselineScenario(ledger));
    const ids = new Set(graph.nodes.map((n) => n.id));
    for (const e of graph.edges) {
      expect(ids.has(e.from), e.id).toBe(true);
      expect(ids.has(e.to), e.id).toBe(true);
    }
  });
});
