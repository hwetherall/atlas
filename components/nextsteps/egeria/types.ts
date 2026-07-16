import type { Memo } from "@/lib/nextStepsSchema";

export type EgeriaArtifact = Extract<Memo["artifact"], { kind: "egeria" }>;
export type EgeriaStep = "match" | "brief" | "book";
