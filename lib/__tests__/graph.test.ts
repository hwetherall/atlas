import { describe, expect, it } from "vitest";
import { oracleLedger as ledger } from "./fixtures/oracleLedger"; // frozen §10 oracle
import { valuesOf } from "@/lib/dimensions";
import type { Scenario } from "@/lib/schema";
import { baselineScenario } from "@/lib/compute";
import { deriveGraph, SYNTHETIC_IDS } from "@/lib/graph";

const baseline = baselineScenario(ledger);

describe("deriveGraph — view-model integrity", () => {
  it("every edge references nodes that exist in the model", () => {
    const { nodes, edges } = deriveGraph(ledger, baseline);
    const ids = new Set(nodes.map((n) => n.id));
    for (const e of edges) {
      expect(ids.has(e.from), `missing edge source ${e.from}`).toBe(true);
      expect(ids.has(e.to), `missing edge target ${e.to}`).toBe(true);
    }
  });

  it("includes every dimension leaf from the ledger", () => {
    const { nodes } = deriveGraph(ledger, baseline);
    const leafIds = new Set(nodes.filter((n) => !n.synthetic).map((n) => n.id));
    for (const n of ledger) {
      if (n.dimension) expect(leafIds.has(n.id), `leaf ${n.id} missing`).toBe(true);
    }
  });

  it("synthesizes TAM/SAM/YAM whose values match the §10 worked example", () => {
    const { nodes } = deriveGraph(ledger, baseline);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    expect(byId.get(SYNTHETIC_IDS.tam)!.value).toBeCloseTo(1200, 6);
    expect(byId.get(SYNTHETIC_IDS.sam)!.value).toBeCloseTo(660, 6);
    expect(byId.get(SYNTHETIC_IDS.yam)!.value).toBeCloseTo(39.6, 6);
  });

  it("baseline scope factors are all ~1.0", () => {
    const { nodes } = deriveGraph(ledger, baseline);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    expect(byId.get(SYNTHETIC_IDS.geoFactor)!.value).toBeCloseTo(1, 6);
    expect(byId.get(SYNTHETIC_IDS.segFactor)!.value).toBeCloseTo(1, 6);
    expect(byId.get(SYNTHETIC_IDS.custFactor)!.value).toBeCloseTo(1, 6);
  });

  it("dims leaves that are excluded from the scenario", () => {
    const scenario: Scenario = {
      id: "ex-de",
      label: "ex-Germany",
      geographies: valuesOf("geography").filter((g) => g !== "DE"),
      segments: valuesOf("segment"),
      customerTypes: valuesOf("customerType"),
      assumptions: {},
    };
    const { nodes, edges } = deriveGraph(ledger, scenario);
    const de = nodes.find((n) => n.id === "geo.DE")!;
    expect(de.dimmed).toBe(true);
    // the edge out of the excluded leaf is dimmed too
    const deEdge = edges.find((e) => e.from === "geo.DE")!;
    expect(deEdge.dimmed).toBe(true);
    // a selected leaf stays lit
    expect(nodes.find((n) => n.id === "geo.NL")!.dimmed).toBe(false);
  });

  it("synthetic spine nodes are marked calculated; leaves keep their kind", () => {
    const { nodes } = deriveGraph(ledger, baseline);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    expect(byId.get(SYNTHETIC_IDS.tam)!.kind).toBe("calculated");
    expect(byId.get(SYNTHETIC_IDS.tam)!.synthetic).toBe(true);
    expect(byId.get("geo.DE")!.kind).toBe("estimated");
    expect(byId.get("serviceableFactor")!.kind).toBe("assumption");
  });
});
