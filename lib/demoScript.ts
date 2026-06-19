// ─────────────────────────────────────────────────────────────────────────────
// All scripted demo copy lives here so wording + timing are easy to tune in one
// place. None of this drives the math — the research always resolves to the
// hardcoded rack-PDU ledger (CLAUDE.md §6: no LLM, no network). The intake is
// theatre; the ledger is the truth.
// ─────────────────────────────────────────────────────────────────────────────

export interface UploadedDoc {
  name: string;
  meta: string; // size / page count — cosmetic
}

export const UPLOADED_DOCS: UploadedDoc[] = [
  { name: "VentureX_Profile.pdf", meta: "anonymized venture profile · 14 pp" },
  { name: "Product_Onepager.pdf", meta: "rack-PDU line · 2 pp" },
  { name: "GTM_Notes.docx", meta: "go-to-market notes · 6 pp" },
];

export interface BusinessField {
  label: string;
  value: string;
}

export const BUSINESS_FIELDS: BusinessField[] = [
  { label: "Company", value: "Industrial entrant (anonymized)" },
  { label: "Product", value: "Intelligent rack power distribution units (PDUs)" },
  { label: "Target region", value: "Central Europe" },
  { label: "Stage", value: "Pre-launch · first 12 months" },
];

export interface FollowupQuestion {
  id: string;
  question: string;
  helper: string;
  options: string[];
  answer: string; // prefilled selection
}

export const FOLLOWUP_QUESTIONS: FollowupQuestion[] = [
  {
    id: "scope",
    question: "Which applications are in scope for sizing?",
    helper: "Defines the segment axis of the market.",
    options: ["All data-center segments", "Hyperscale only", "Exclude telecom"],
    answer: "All data-center segments",
  },
  {
    id: "buyer",
    question: "Who is the primary buyer you'll sell through first?",
    helper: "Sets the customer-type axis.",
    options: ["Large operators", "OEM / integrators", "Distributors"],
    answer: "Large operators",
  },
  {
    id: "horizon",
    question: "What obtainable horizon should Year-1 (YAM) assume?",
    helper: "Caps SAM down to a realistic first-12-months number.",
    options: ["Conservative ramp", "Aggressive ramp", "Channel-led ramp"],
    answer: "Conservative ramp",
  },
];

export const RESEARCH_PLAN: string[] = [
  "Size the Central Europe rack-PDU market base across 7 geographies",
  "Decompose demand by 5 application segments and 4 buyer types",
  "Estimate the serviceable share (channel + regulatory reach)",
  "Model the Year-1 obtainable share (win-rate × ramp × capacity)",
  "Assemble a sourced fact graph and compute TAM / SAM / YAM",
  "Flag the highest value-of-information risks",
];

// ── Step 2: the ~7s "thinking" research log. Durations are in ms and sum to
// roughly 7000ms. Each line maps to a real part of the ledger build. ──────────
export interface ThinkingStep {
  label: string;
  detail?: string;
  ms: number;
}

export const THINKING_STEPS: ThinkingStep[] = [
  { label: "Reading uploaded profile & notes", detail: "3 documents", ms: 850 },
  { label: "Searching market sources", detail: "trade data · analyst notes", ms: 1000 },
  { label: "Extracting market base", detail: "€1,200M · Central Europe", ms: 900 },
  { label: "Estimating geography shares", detail: "7 markets", ms: 850 },
  { label: "Estimating segment & buyer mix", detail: "5 segments · 4 buyers", ms: 900 },
  { label: "Assessing serviceable & Year-1 obtainable share", ms: 850 },
  { label: "Assembling fact graph", detail: "20 nodes · 24 edges", ms: 850 },
  { label: "Computing TAM / SAM / YAM", ms: 800 },
  { label: "Ranking value-of-information risks", ms: 700 },
];

export const THINKING_TOTAL_MS = THINKING_STEPS.reduce((s, step) => s + step.ms, 0);
