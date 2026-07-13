import { risks } from "@/lib/risks";
import { risksCycle1 } from "@/lib/risksCycle1";

// ─────────────────────────────────────────────────────────────────────────────
// Featured findings — the hand-curated "headline" subset of each register
// pass. The register shows these prominently and folds the rest into a
// collapsible full register: the demo leads with 8–9 findings that carry the
// story, while the full list stays one click away as proof of work.
// Curation only — severity ranks are still computed live by the engine, and
// the picks track the top of that ranking.
// ─────────────────────────────────────────────────────────────────────────────

export interface FeaturedIds {
  errors: string[];
  risks: string[];
}

export const FEATURED: Record<"cycle1" | "cycle2", FeaturedIds> = {
  cycle1: {
    errors: [
      // The demo's headline: the model's own cited source says 1%, not 3% — the applied fix.
      "risk.execution-window.som-window-semantics-mismatch",
      // Vivid mechanism, later REFUTED by the loop — the adjudicator is not a yes-machine.
      "risk.competitive-foreclosure.bundling-eliminates-bakeoffs-year1",
      // "Most Year-1 orders were already awarded to rivals" — folded into the applied fix.
      "risk.demand-discontinuity.prelet-pipeline-lockout",
      // The self-audit catch: our own €495M cross-check measured a rival market.
      "risk.definition-scopedown.crosscheck-ceiling-contamination",
    ],
    risks: [
      // Top irreducible risk — the competitive headline.
      "risk.base-rate-analogy.fragmented-incumbency-price-response",
      // The Frankfurt grid wall — viscerally real-world.
      "risk.demand-discontinuity.grid-queue-construction-pause",
      // "Year-1 reach is two countries, not 55% of the market" — the hidden-structure rock.
      "risk.execution-window.serviceable-reach-is-flow-not-stock",
      // The CRA storyline — recurs in cycle 2 and in Next steps (continuity across tabs).
      "risk.regulatory-gauntlet.cra-conformity-clock",
    ],
  },
  cycle2: {
    errors: [
      // The loop finding the next layer of the same benchmark error it already fixed.
      "risk.execution-window.som-window-semantics-year1-zero",
      // The only positive-ΔYAM finding: the ceiling may be too LOW. Buy-Information anchor.
      "risk.definition-scopedown.band-top-contaminated-comparator",
      // Half the €300M base is basic PDUs the product can't sell — a 2× scope catch.
      "risk.definition-scopedown.intelligent-subset-inflation",
      // 542 MW stuck in the Frankfurt queue could push half of Year-1 into 2027.
      "risk.demand-discontinuity.frankfurt-grid-queue-de-slip",
    ],
    risks: [
      // #1 remaining risk — big buyers specced 2026 deliveries in 2024–25. The Act card.
      "risk.structure-independence.frankfurt-cycle-lockout-year1",
      // Enacted law with dates inside the entry window. The Expert card.
      "risk.regulatory-gauntlet.cra-conformity-clock-outlasts-yam-window",
      // The invisible serial gate: security prequal halves the selling window.
      "risk.execution-window.firmware-security-audit-gate",
      // Pushes Year-1 share below the model's own floor.
      "risk.competitive-foreclosure.bundle-pricing-kills-bakeoffs",
      // One WiFi sensor forces an EU radio security review — adds two quarters.
      "risk.regulatory-gauntlet.red-en18031-wireless-sensor-gate",
    ],
  },
};

// Fail at module load (dev boot), not on stage: every featured id must exist
// in the register it fronts.
function assertIds(cycle: "cycle1" | "cycle2", register: { id: string }[]) {
  const known = new Set(register.map((r) => r.id));
  const picks = FEATURED[cycle];
  for (const id of [...picks.errors, ...picks.risks]) {
    if (!known.has(id)) throw new Error(`featured.ts: unknown ${cycle} risk id "${id}"`);
  }
}
assertIds("cycle1", risksCycle1);
assertIds("cycle2", risks);
