"use client";

import { useMemo, useState } from "react";
import type { FactNode, Ledger, Scenario } from "@/lib/schema";
import { isExcluded } from "@/lib/dimensions";
import { boundsFor } from "@/lib/levers";
import { formatNodeBand, formatNodeValue } from "@/lib/format";
import { Badge } from "@/lib/badges";
import { informationValue } from "@/lib/voi";
import { contributionDisplay, contributionMeasure } from "@/lib/contribution";
import { evaluate } from "@/lib/compute";
import type { ScenarioAction } from "@/lib/useScenario";
import AssumptionSlider from "@/components/AssumptionSlider";
import EvidenceSignal, { sourceCounts } from "@/components/EvidenceSignal";

// ─────────────────────────────────────────────────────────────────────────────
// FactBankTable — the grouped fact table. Six narrative groups mirror the
// equation strip; within share groups, biggest first. Four columns: the fact,
// its value (with share bar + band), its live impact on TAM, and one merged
// evidence signal. "Biggest unknowns first" flattens to a ranked list.
// Group headers are extra <tr>s in the SAME tbody — rows must never remount
// (inline slider state dies).
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ledger: Ledger;
  scenario: Scenario;
  dispatch: React.Dispatch<ScenarioAction>;
  selectedId: string | null;
  onSelect: (id: string) => void; // parent toggles selection
  onHoverNode?: (node: FactNode | null) => void;
  condensed: boolean;
}

type GroupKey = "base" | "geography" | "segment" | "customerType" | "assumptions" | "shape";

const GROUPS: { key: GroupKey; title: string; blurb: string }[] = [
  { key: "base", title: "Market base", blurb: "the anchor everything multiplies from" },
  { key: "geography", title: "Geography", blurb: "how the base splits by country" },
  { key: "segment", title: "Segments", blurb: "how it splits by application" },
  { key: "customerType", title: "Buyers", blurb: "who writes the check" },
  { key: "assumptions", title: "Our assumptions", blurb: "the two dials we control" },
  { key: "shape", title: "Market shape", blurb: "context, not in the math" },
];

function groupOf(node: FactNode): GroupKey {
  if (node.id === "tamBase") return "base";
  if (node.dimension) return node.dimension;
  if (node.kind === "assumption") return "assumptions";
  return "shape";
}

export default function FactBankTable({
  ledger,
  scenario,
  dispatch,
  selectedId,
  onSelect,
  onHoverNode,
  condensed,
}: Props) {
  const [search, setSearch] = useState("");
  const [rankedView, setRankedView] = useState(false);

  // VOI per node, live with the levers — drives the ranked view and ⚑ markers.
  const voiById = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of ledger) m.set(n.id, informationValue(ledger, scenario, n.id));
    return m;
  }, [ledger, scenario]);

  const verifyIds = useMemo(() => {
    return new Set(
      [...voiById.entries()]
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => id),
    );
  }, [voiById]);

  // Impact measure per node + the max magnitude (bar scale).
  const impactById = useMemo(() => {
    const m = new Map<string, ReturnType<typeof contributionMeasure>>();
    for (const n of ledger) m.set(n.id, contributionMeasure(ledger, scenario, n));
    return m;
  }, [ledger, scenario]);
  const maxImpact = useMemo(
    () => Math.max(...[...impactById.values()].map((m) => Math.abs(m.amount)), 1e-9),
    [impactById],
  );

  const factors = useMemo(() => evaluate(ledger, scenario).factors, [ledger, scenario]);

  const matches = (n: FactNode) => {
    const q = search.trim().toLowerCase();
    return q === "" || n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
  };

  // Grouped view: group header + rows (shares sorted biggest-first).
  // Ranked view: one flat list by verification payoff.
  const sections = useMemo(() => {
    if (rankedView) {
      const rows = ledger
        .filter(matches)
        .slice()
        .sort((a, b) => (voiById.get(b.id) ?? 0) - (voiById.get(a.id) ?? 0));
      return [{ group: null as (typeof GROUPS)[number] | null, rows }];
    }
    return GROUPS.map((group) => {
      let rows = ledger.filter((n) => groupOf(n) === group.key && matches(n));
      if (group.key === "geography" || group.key === "segment" || group.key === "customerType") {
        rows = rows.slice().sort((a, b) => b.value - a.value);
      }
      return { group, rows };
    }).filter((s) => s.rows.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledger, search, rankedView, voiById]);

  function groupAnnotation(key: GroupKey, count: number): string {
    switch (key) {
      case "base":
        return `as of ${ledger.find((n) => n.id === "tamBase")?.asOf ?? ""}`;
      case "geography":
        return `${count} shares · sum to 100% · currently ×${factors.geography.toFixed(2)}`;
      case "segment":
        return `${count} shares · sum to 100% · currently ×${factors.segment.toFixed(2)}`;
      case "customerType":
        return `${count} shares · sum to 100% · currently ×${factors.customerType.toFixed(2)}`;
      case "assumptions":
        return "TAM → SAM → YAM";
      case "shape":
        return "informs risk, doesn't move the funnel";
    }
  }

  const hide = condensed ? "hidden" : "";
  const thClass =
    "px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3";
  const colSpan = condensed ? 2 : 4;

  return (
    <section className="card rounded-xl p-5">
      {/* Controls — local view state only; never recomputes the model. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline pb-3 text-xs">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search facts…"
          className="w-40 rounded border border-hairline bg-card px-2 py-1 text-xs text-ink outline-none placeholder:text-ink-faint focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setRankedView((v) => !v)}
          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
            rankedView
              ? "border-fact-red-line bg-fact-red-tint text-fact-red"
              : "border-hairline bg-card text-ink-3 hover:border-hairline-strong hover:text-ink"
          }`}
        >
          ⚑ Biggest unknowns first
        </button>
        {rankedView ? (
          <span className="text-[11px] text-ink-faint">ranked by verification payoff</span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className={thClass}>Fact</th>
              <th className={`${thClass} w-36 text-right`}>Value</th>
              <th className={`${thClass} w-36 text-right ${hide}`}>Impact on TAM</th>
              <th className={`${thClass} w-44 ${hide}`}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <FragmentRows
                key={section.group?.key ?? "ranked"}
                section={section}
                annotation={
                  section.group ? groupAnnotation(section.group.key, section.rows.length) : null
                }
                colSpan={colSpan}
                render={(node, index) => {
                  const excluded = isExcluded(node, scenario);
                  const selected = node.id === selectedId;
                  const isAssumption = node.kind === "assumption";
                  const isBase = node.id === "tamBase";
                  const measure = impactById.get(node.id)!;
                  const display = contributionDisplay(ledger, scenario, node);
                  const barPct = Math.max(
                    (Math.abs(measure.amount) / maxImpact) * 100,
                    measure.amount !== 0 ? 4 : 0,
                  );
                  const { attached } = sourceCounts(node);
                  const missingSource = node.kind === "extracted" && attached === 0;

                  return (
                    <tr
                      key={node.id}
                      id={`fb-row-${node.id}`}
                      onClick={() => onSelect(node.id)}
                      onMouseEnter={() => onHoverNode?.(node)}
                      onMouseLeave={() => onHoverNode?.(null)}
                      className={`scroll-mt-14 cursor-pointer border-b border-hairline/70 transition-colors last:border-0 ${
                        selected ? "bg-accent-wash/60" : "hover:bg-well/60"
                      }`}
                      style={{ transition: "opacity 0.4s ease, background-color 0.2s ease" }}
                    >
                      <td className={`px-3 py-3 ${excluded ? "opacity-40 saturate-50" : ""}`}>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {rankedView ? (
                            <span className="w-5 font-mono text-[11px] tabular-nums text-ink-faint">
                              {index + 1}
                            </span>
                          ) : null}
                          <span
                            className={`text-sm ${
                              excluded ? "text-ink-3 line-through" : "text-ink"
                            } ${isBase ? "font-medium" : ""}`}
                          >
                            {node.label}
                          </span>
                          {verifyIds.has(node.id) ? (
                            <span
                              className="text-[10px] font-medium text-fact-red"
                              title="Verify next — biggest swing, weakest evidence"
                            >
                              ⚑ verify
                            </span>
                          ) : null}
                          {missingSource ? (
                            <Badge className="border-fact-red-line text-fact-red">
                              missing source
                            </Badge>
                          ) : null}
                        </div>
                      </td>

                      <td
                        className={`w-36 px-3 py-3 text-right align-top ${
                          excluded ? "opacity-40 saturate-50" : ""
                        }`}
                      >
                        {isAssumption ? (
                          // Keep the slider interactive without opening the dossier.
                          <div onClick={(e) => e.stopPropagation()}>
                            <AssumptionSlider
                              id={`fb-${node.id}`}
                              label={node.label}
                              value={scenario.assumptions[node.id] ?? node.value}
                              band={node.sensitivityRange}
                              hideLabel
                              hideBand
                              {...boundsFor(node.id)}
                              onChange={(v) =>
                                dispatch({ type: "setAssumption", id: node.id, value: v })
                              }
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-end gap-2">
                              {node.dimension ? (
                                <span className="h-[3px] w-16 overflow-hidden rounded-full bg-well">
                                  <span
                                    className="block h-full rounded-full bg-accent/60"
                                    style={{ width: `${Math.min(node.value * 100, 100)}%` }}
                                  />
                                </span>
                              ) : null}
                              <span
                                className={`font-mono tabular-nums text-ink ${
                                  isBase ? "text-[15px]" : "text-sm"
                                }`}
                              >
                                {formatNodeValue(node)}
                              </span>
                            </div>
                            {node.sensitivityRange ? (
                              <div className="mt-0.5 text-[10px] text-ink-faint">
                                {formatNodeBand(node)}
                              </div>
                            ) : null}
                          </>
                        )}
                      </td>

                      <td
                        className={`w-36 px-3 py-3 text-right align-top ${hide} ${
                          excluded ? "opacity-40 saturate-50" : ""
                        }`}
                      >
                        <div className="font-mono text-[13px] tabular-nums text-ink-2">
                          {display.value}
                        </div>
                        {measure.amount !== 0 ? (
                          <div className="mt-1 flex justify-end">
                            <span className="h-[3px] w-14 overflow-hidden rounded-full bg-well">
                              <span
                                className={`block h-full rounded-full ${
                                  measure.mode === "excluded"
                                    ? "bg-accent/30"
                                    : measure.mode === "band"
                                      ? "bg-warning"
                                      : "bg-accent"
                                }`}
                                style={{ width: `${barPct}%` }}
                              />
                            </span>
                          </div>
                        ) : null}
                        <div className="mt-0.5 text-[10px] text-ink-faint">{display.sub}</div>
                      </td>

                      <td className={`w-44 px-3 py-3 align-top ${hide}`}>
                        <EvidenceSignal node={node} />
                      </td>
                    </tr>
                  );
                }}
              />
            ))}
            {sections.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="py-6 text-center text-xs text-ink-faint">
                  No facts match the current search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Group header + its rows. Plain function returning <tr>s so everything stays
// in one tbody (rows must not remount when views toggle).
function FragmentRows({
  section,
  annotation,
  colSpan,
  render,
}: {
  section: { group: { key: GroupKey; title: string; blurb: string } | null; rows: FactNode[] };
  annotation: string | null;
  colSpan: number;
  render: (node: FactNode, index: number) => React.ReactNode;
}) {
  return (
    <>
      {section.group ? (
        <tr key={`hdr-${section.group.key}`} className="border-b border-hairline-strong">
          <td colSpan={colSpan} className="px-3 pb-1.5 pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
                {section.group.title}
                <span className="ml-2 font-normal normal-case tracking-normal text-ink-3">
                  — {section.group.blurb}
                </span>
              </span>
              {annotation ? (
                <span className="font-mono text-[11px] tabular-nums text-ink-3">{annotation}</span>
              ) : null}
            </div>
          </td>
        </tr>
      ) : null}
      {section.rows.map((node, index) => render(node, index))}
    </>
  );
}
