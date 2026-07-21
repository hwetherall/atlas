import type { Memo } from "@/lib/nextStepsSchema";

export type EgeriaArtifact = Extract<Memo["artifact"], { kind: "egeria" }>;
export type EgeriaStep = "risk" | "search" | "match" | "brief" | "book";
export type EgeriaNavStep = Exclude<EgeriaStep, "search">;
