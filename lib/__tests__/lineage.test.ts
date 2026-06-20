import { describe, expect, it } from "vitest";
import { ledger } from "@/lib/ledger";
import { SYNTHETIC_IDS } from "@/lib/graph";
import { lineageOf } from "@/lib/lineage";

const ids = (refs: { id: string }[]) => refs.map((r) => r.id);

describe("lineageOf", () => {
  it("a share leaf has tamBase upstream and reaches the TAM output downstream", () => {
    const lin = lineageOf(ledger, "geo.DE");
    expect(ids(lin.upstream)).toContain("tamBase");
    expect(ids(lin.downstream)).toContain(SYNTHETIC_IDS.tam);
  });

  it("a share leaf's downstream runs scope factor → TAM → SAM → YAM", () => {
    const down = ids(lineageOf(ledger, "geo.DE").downstream);
    expect(down).toEqual([
      SYNTHETIC_IDS.geoFactor,
      SYNTHETIC_IDS.tam,
      SYNTHETIC_IDS.sam,
      SYNTHETIC_IDS.yam,
    ]);
  });

  it("tamBase has empty upstream and downstream TAM/SAM/YAM", () => {
    const lin = lineageOf(ledger, "tamBase");
    expect(lin.upstream).toEqual([]);
    expect(ids(lin.downstream)).toEqual([
      SYNTHETIC_IDS.tam,
      SYNTHETIC_IDS.sam,
      SYNTHETIC_IDS.yam,
    ]);
  });

  it("serviceableFactor flows to SAM then YAM", () => {
    expect(ids(lineageOf(ledger, "serviceableFactor").downstream)).toEqual([
      SYNTHETIC_IDS.sam,
      SYNTHETIC_IDS.yam,
    ]);
  });

  it("obtainableFactor downstream is just YAM", () => {
    expect(ids(lineageOf(ledger, "obtainableFactor").downstream)).toEqual([
      SYNTHETIC_IDS.yam,
    ]);
  });

  it("shape facts have empty lineage (display-only)", () => {
    const lin = lineageOf(ledger, "shape.cr3");
    expect(lin.upstream).toEqual([]);
    expect(lin.downstream).toEqual([]);
  });

  it("refs carry friendly labels for synthetic spine nodes", () => {
    const down = lineageOf(ledger, "tamBase").downstream;
    expect(down.find((r) => r.id === SYNTHETIC_IDS.tam)?.label).toBe("TAM");
  });
});
