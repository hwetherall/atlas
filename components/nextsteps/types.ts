import type { Memo } from "@/lib/nextStepsSchema";
import type { RankedRisk } from "@/lib/riskCompute";
import type { Tool } from "@/lib/toolkit";

// One memo joined to its live register entry — severity, tool and retired
// exposure are computed in the NextSteps shell and shared by every view.
export interface MemoRow {
  memo: Memo;
  rr: RankedRisk;
  tool: Tool;
  retired: number;
}
