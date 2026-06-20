import { describe, expect, it } from "vitest";
import { ledger } from "@/lib/ledger";
import { groupBySection, SECTION_ORDER, sectionOf } from "@/lib/ledgerView";

function node(id: string) {
  const n = ledger.find((x) => x.id === id);
  if (!n) throw new Error(`fixture missing node: ${id}`);
  return n;
}

describe("sectionOf — funnel bucketing (improve-ledger.md §2.1)", () => {
  it("tamBase → base", () => expect(sectionOf(node("tamBase"))).toBe("base"));
  it("geo.DE → geography", () => expect(sectionOf(node("geo.DE"))).toBe("geography"));
  it("serviceableFactor → assumption", () =>
    expect(sectionOf(node("serviceableFactor"))).toBe("assumption"));
  it("shape.cagr → shape", () => expect(sectionOf(node("shape.cagr"))).toBe("shape"));
});

describe("groupBySection", () => {
  it("returns sections in funnel order with no empty buckets", () => {
    const groups = groupBySection(ledger);
    const idx = groups.map((g) => SECTION_ORDER.indexOf(g.section));
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
    expect(groups.every((g) => g.nodes.length > 0)).toBe(true);
  });

  it("buckets every node exactly once", () => {
    const total = groupBySection(ledger).reduce((acc, g) => acc + g.nodes.length, 0);
    expect(total).toBe(ledger.length);
  });
});
