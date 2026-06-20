import type { NodeKind } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// ledger.md §4 — Skill registry.
//
// A skill is the HARDCODED method Innovera used to produce a fact: reusable,
// versioned, auditable. This is the IP-flavoured surface — the "moat" the Recipe
// section of the Fact Inspector renders. Procedures deliberately rhyme with
// RESEARCH_PLAN / THINKING_STEPS in lib/demoScript.ts so the intake research-log
// and the per-fact recipes tell one coherent story.
//
// No LLM, no network — "Re-run skill" replays the procedure and resolves to the
// same value (CLAUDE.md §6 / §9).
// ─────────────────────────────────────────────────────────────────────────────

export interface Skill {
  id: string; // 'geo-share-triangulation'
  name: string; // 'Geo-share triangulation'
  version: string; // '1.2'
  summary: string; // one-line method
  consumes: string[]; // the inputs it needs
  procedure: string[]; // the numbered playbook (also the "Re-run" log)
  emits: NodeKind[]; // which kinds it can produce
  confidencePolicy: string; // how it assigns confidence + sets the band
}

export const SKILLS: Record<string, Skill> = {
  "tam-base-sizing": {
    id: "tam-base-sizing",
    name: "TAM base sizing",
    version: "1.0",
    summary:
      "Sizes the regional market base bottom-up from installed racks × PDU attach rate × ASP.",
    consumes: [
      "Regional installed rack base",
      "PDU attach rate per rack",
      "Average selling price (ASP)",
    ],
    procedure: [
      "Pull the Central Europe installed rack base",
      "Apply the PDU attach rate per rack",
      "Multiply by blended ASP to get region-wide revenue",
      "Emit extracted base + plausible band",
    ],
    emits: ["extracted"],
    confidencePolicy:
      "Single market report → inferred, widest band (±25%). A second sizing method within band → verified.",
  },

  "geo-share-triangulation": {
    id: "geo-share-triangulation",
    name: "Geo-share triangulation",
    version: "1.2",
    summary:
      "Apportions a regional base across countries using installed capacity, cross-checked against GDP weighting.",
    consumes: [
      "National installed rack capacity",
      "Regional base (tamBase)",
      "GDP weights (cross-check)",
    ],
    procedure: [
      "Pull per-country installed rack capacity",
      "Normalise each country to the regional total",
      "GDP cross-check; flag any country >5% apart",
      "Emit estimated share + plausible band",
    ],
    emits: ["estimated"],
    confidencePolicy:
      "Single capacity source → inferred; two corroborating sources within 5% → verified. Band = ±max(cross-check gap, 25%).",
  },

  "segment-decomposition": {
    id: "segment-decomposition",
    name: "Segment decomposition",
    version: "1.1",
    summary:
      "Splits demand across application segments from data-center build-out mix and power density.",
    consumes: [
      "Data-center build-out pipeline by type",
      "Per-segment power density",
      "Analyst segment splits (cross-check)",
    ],
    procedure: [
      "Classify the build-out pipeline by application segment",
      "Weight each segment by rack power density",
      "Normalise the segment mix to 1.0",
      "Cross-check against analyst segment splits",
    ],
    emits: ["estimated"],
    confidencePolicy:
      "Build-out pipeline + one analyst split → inferred. Band widens for thin segments (edge, telecom).",
  },

  "buyer-mix-survey": {
    id: "buyer-mix-survey",
    name: "Buyer-mix survey",
    version: "1.0",
    summary:
      "Estimates the buyer-type mix from procurement-channel structure and deal-size distribution.",
    consumes: [
      "Procurement-channel structure",
      "Deal-size distribution",
      "Win/loss field notes (cross-check)",
    ],
    procedure: [
      "Map buyers to firmographic / role profiles",
      "Weight each profile by share of procurement spend",
      "Normalise the buyer mix to 1.0",
      "Cross-check against win/loss field notes",
    ],
    emits: ["estimated"],
    confidencePolicy:
      "Channel structure + deal-size data → inferred. Two corroborating field sources → verified.",
  },

  "serviceability-model": {
    id: "serviceability-model",
    name: "Serviceability model",
    version: "1.0",
    summary:
      "Haircuts TAM to the reachable, regulatory-clear share via channel coverage and compliance gates.",
    consumes: [
      "Channel coverage by geography",
      "Regulatory / certification gates",
      "Distribution reach assumptions",
    ],
    procedure: [
      "Estimate reachable channel coverage",
      "Subtract regulatory / certification-blocked demand",
      "Combine into a serviceable share of TAM",
      "Emit assumption factor + plausible band",
    ],
    emits: ["assumption"],
    confidencePolicy:
      "Assumption leaf — inferred by construction; band reflects channel + regulatory uncertainty.",
  },

  "year1-obtainable-model": {
    id: "year1-obtainable-model",
    name: "Year-1 obtainable model",
    version: "1.0",
    summary:
      "Models the realistically winnable Year-1 share of SAM from win-rate × ramp × capacity.",
    consumes: [
      "Year-1 win-rate assumption",
      "Sales ramp curve",
      "Production / delivery capacity",
    ],
    procedure: [
      "Set a Year-1 win-rate against serviceable demand",
      "Apply the first-12-months sales ramp",
      "Cap by production / delivery capacity",
      "Emit assumption factor + plausible band",
    ],
    emits: ["assumption"],
    confidencePolicy:
      "Assumption leaf — inferred by construction; widest band of the funnel (win-rate is the deepest unknown).",
  },

  "competitor-concentration": {
    id: "competitor-concentration",
    name: "Competitor concentration",
    version: "1.0",
    summary:
      "Computes top-N supplier concentration directly from the VentureX competitor table (consume, don't re-derive).",
    consumes: [
      "VentureX competitor & share table",
      "Supplier revenue estimates",
    ],
    procedure: [
      "Read the VentureX competitor table",
      "Rank suppliers by estimated share",
      "Sum the top-3 share (CR3)",
      "Emit extracted concentration metric",
    ],
    emits: ["extracted"],
    confidencePolicy:
      "Sourced from the VentureX table → inferred; verified once two share sources agree.",
  },

  "cagr-projection": {
    id: "cagr-projection",
    name: "CAGR projection",
    version: "1.0",
    summary:
      "Projects the market growth rate from historical revenue and forward build-out demand.",
    consumes: [
      "Historical market revenue series",
      "Forward data-center build-out demand",
      "Analyst growth forecasts (cross-check)",
    ],
    procedure: [
      "Fit a growth rate to the historical revenue series",
      "Adjust for forward build-out demand",
      "Cross-check against analyst forecasts",
      "Emit extracted CAGR (2025–2030)",
    ],
    emits: ["extracted"],
    confidencePolicy:
      "Historical series + one analyst forecast → inferred; converging forecasts → verified.",
  },
};

/**
 * Throws if any ledger node references a skill that is not in SKILLS.
 *
 * Kept here (not in factNodeSchema) to avoid a circular import: lib/skills.ts
 * imports NodeKind from lib/schema.ts, so schema.ts must not import skills.ts.
 * Call this from lib/ledger.ts *after* validateLedger.
 */
export function validateSkillRefs(ledger: { skillId?: string }[]): void {
  for (const n of ledger) {
    if (n.skillId && !SKILLS[n.skillId]) {
      throw new Error(`ledger node references unknown skill '${n.skillId}'`);
    }
  }
}
