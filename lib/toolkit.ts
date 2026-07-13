// ─────────────────────────────────────────────────────────────────────────────
// The Innovera toolkit — the named product suite that executes the five risk
// responses (nextsteps.md §2). Mythology family, same lineage as Atlas and
// Agent Argus. Subscription framing: these are capabilities the user has,
// not things they buy — no prices anywhere on the surface.
// ─────────────────────────────────────────────────────────────────────────────

import type { ResponseType } from "@/lib/nextStepsSchema";

export type ToolId = "argus" | "delphi" | "mentor" | "daedalus" | "themis";

export interface Tool {
  id: ToolId;
  name: string;
  epithet: string; // the one-line identity
  does: string; // what it does for the subscriber
}

export const TOOLKIT: Record<ToolId, Tool> = {
  delphi: {
    id: "delphi",
    name: "Delphi",
    epithet: "The research desk — the oracle you consult",
    does: "Commissions the report, dataset or analyst time that settles a fact, and folds the answer back into the model.",
  },
  mentor: {
    id: "mentor",
    name: "Mentor",
    epithet: "The expert network — judgment on demand",
    does: "Matches the open question to a practitioner who has decided it before, with an agenda built from the model's own doubts.",
  },
  argus: {
    id: "argus",
    name: "Agent Argus",
    epithet: "The hundred-eyed watchman — always-on monitoring",
    does: "Watches the risk's early-warning feeds around the clock; when a threshold trips, it alerts and re-prices the register.",
  },
  daedalus: {
    id: "daedalus",
    name: "Daedalus",
    epithet: "The master builder — execution playbooks",
    does: "Turns a strategic response into a chartered initiative: workstreams, milestones, kill criteria, and the payoff computed.",
  },
  themis: {
    id: "themis",
    name: "Themis",
    epithet: "Right order — risk governance",
    does: "Records the conscious acceptance: the max-regret bound, the revisit triggers, the sunset date, and who signed it.",
  },
};

export const RESPONSE_TOOL: Record<ResponseType, ToolId> = {
  "buy-information": "delphi",
  expert: "mentor",
  monitor: "argus",
  act: "daedalus",
  ignore: "themis",
};
