// ─────────────────────────────────────────────────────────────────────────────
// The Innovera toolkit — the named product suite that executes the five risk
// responses (nextsteps.md §2). Mythology family, same lineage as Atlas and
// Agent Argus. Subscription framing: these are capabilities the user has,
// not things they buy — no prices anywhere on the surface.
//
// Five responses, FOUR tools: "ignore" is not a product, it is a governed
// acceptance — Argus executes it as Accept & watch (the acceptance memo's
// revisit triggers are Argus tripwires). nextsteps.md §2 licenses this:
// "Argus additionally backs every ignore as the safety net."
// ─────────────────────────────────────────────────────────────────────────────

import type { ResponseType } from "@/lib/nextStepsSchema";

export type ToolId = "argus" | "delphi" | "egeria" | "julius";

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
  egeria: {
    id: "egeria",
    name: "Egeria",
    epithet: "The counselor kings consulted — the expert network",
    does: "Matches the open question to a practitioner who has decided it before, with an agenda built from the model's own doubts.",
  },
  argus: {
    id: "argus",
    name: "Agent Argus",
    epithet: "The hundred-eyed watchman — always-on monitoring",
    does: "Watches the risk's early-warning feeds around the clock; when a threshold trips, it alerts and re-prices the register.",
  },
  julius: {
    id: "julius",
    name: "Julius",
    epithet: "The commander — acts while others deliberate",
    does: "Turns a strategic response into a chartered initiative: workstreams, milestones, kill criteria, and the payoff computed.",
  },
};

export const RESPONSE_TOOL: Record<ResponseType, ToolId> = {
  "buy-information": "delphi",
  expert: "egeria",
  monitor: "argus",
  act: "julius",
  // Acceptance is governed, not shelved: Argus watches the revisit triggers.
  ignore: "argus",
};

// Display names for the five responses. The enum value "ignore" stays for
// data stability; the surface says what it really is — accepted, tripwired.
export const RESPONSE_LABEL: Record<ResponseType, string> = {
  "buy-information": "Buy information",
  expert: "Speak to an expert",
  monitor: "Monitor",
  act: "Act",
  ignore: "Accept & watch",
};
