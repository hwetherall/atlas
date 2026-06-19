"use client";

import { useMemo } from "react";
import { ledger } from "@/lib/ledger"; // self-validates at module load (fails loudly at boot)
import { delta, evaluate, sensitivity } from "@/lib/compute";
import { FLAGS } from "@/lib/flags";
import { useScenario } from "@/lib/useScenario";
import ScenarioControls from "@/components/ScenarioControls";
import RegionMap from "@/components/RegionMap";
import BoundaryPanel from "@/components/BoundaryPanel";
import FunnelOutputs from "@/components/FunnelOutputs";
import DeltaPanel from "@/components/DeltaPanel";
import ShapeStrip from "@/components/ShapeStrip";
import Tornado from "@/components/Tornado";
import FactsLedger from "@/components/FactsLedger";

export default function Home() {
  const { state, dispatch } = useScenario(ledger);
  const { current: cur, baseline: base } = state;

  const current = useMemo(() => evaluate(ledger, cur), [cur]);
  const baseline = useMemo(() => evaluate(ledger, base), [base]);
  const deltaTam = useMemo(() => delta(ledger, base, cur, "tam"), [base, cur]);
  const deltaYam = useMemo(() => delta(ledger, base, cur, "yam"), [base, cur]);
  const swings = useMemo(() => sensitivity(ledger, cur, "tam"), [cur]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header>
        <h1 className="text-xl font-semibold text-neutral-50">
          Atlas — Market Size &amp; Shape
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Live, lever-driven TAM / SAM / YAM. A market size is a computation,
          never a number — pull a lever and the funnel recomputes against a
          pinned baseline.
        </p>
      </header>

      <p className="mt-4 rounded-md border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80">
        <span className="font-medium">MVP caveat:</span> scope factors are treated
        as independent across dimensions (e.g. edge&apos;s share is assumed the
        same in every geography). Where that&apos;s false, the interaction is
        itself a risk.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-5">
          <ScenarioControls ledger={ledger} state={state} dispatch={dispatch} />
          <RegionMap
            ledger={ledger}
            selected={cur.geographies}
            onToggle={(value) => dispatch({ type: "toggle", dimension: "geography", value })}
          />
          <BoundaryPanel />
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <FunnelOutputs current={current} baseline={baseline} />
            <DeltaPanel deltaTam={deltaTam} deltaYam={deltaYam} />
          </div>
          <ShapeStrip ledger={ledger} />
          {FLAGS.tornado ? <Tornado bars={swings} metric="tam" /> : null}
        </div>
      </div>

      <div className="mt-5">
        <FactsLedger ledger={ledger} scenario={cur} dispatch={dispatch} />
      </div>
    </main>
  );
}
