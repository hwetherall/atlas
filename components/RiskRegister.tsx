"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Ledger } from "@/lib/schema";
import type { Risk } from "@/lib/riskSchema";
import type { FeaturedIds } from "@/lib/featured";
import type { ScenarioState } from "@/lib/useScenario";
import { rankRisks, type RankedRisk } from "@/lib/riskCompute";
import { informationValue } from "@/lib/voi";
import { formatEUR, formatPct } from "@/lib/format";
import {
  Badge,
  CATEGORY_LABEL,
  CATEGORY_STYLE,
  CATEGORY_TOOLTIP,
  EVIDENCE_STATUS_ICON,
  EVIDENCE_STATUS_LABEL,
  EVIDENCE_STATUS_STYLE,
  EVIDENCE_STATUS_TOOLTIP,
} from "@/lib/badges";
import RiskDetail from "@/components/RiskDetail";

// ─────────────────────────────────────────────────────────────────────────────
// RiskRegister — workspace surface #3. The aggregated register over the
// curated lib/risks.ts: two boards ("the rocks" = risks hiding inside the
// model's own construction; "front of mind" = the world risks a founder would
// list), severity-ranked LIVE against the current scenario. Deselect Germany
// on any surface and DE-exposed risks collapse here — risk exposure follows
// scope, because every impact is recomputed by the engine, never stored.
// Master-detail split mirrors the Fact Bank.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ledger: Ledger;
  risks: Risk[];
  state: ScenarioState;
  // Demo framing: the register renders twice (against the original model and
  // the corrected one); this line gives each pass its narrative context.
  headerNote?: string;
  // Curated headline subset (lib/featured.ts): featured findings render on
  // top, the rest fold into a collapsed full register. Omit to render the
  // classic three-board layout.
  featured?: FeaturedIds;
}

const BOARD_COPY = {
  error: {
    kicker: "Fix the model first",
    blurb: "Not risks — errors. Research settles these; each carries a proposed correction.",
  },
  rock: {
    kicker: "The rocks",
    blurb: "Risks inside the model's own construction — they look handled until you lift them.",
  },
  "front-of-mind": {
    kicker: "Front of mind",
    blurb: "The risks you've probably priced — quantified here against the funnel.",
  },
} as const;

type BoardId = keyof typeof BOARD_COPY;

export default function RiskRegister({ ledger, risks, state, headerNote, featured }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Severity = p × |ΔYAM|, engine-computed against the CURRENT scenario.
  const ranked = useMemo(
    () => rankRisks(ledger, state.current, risks),
    [ledger, risks, state.current],
  );
  const maxSeverity = Math.max(...ranked.map((r) => r.severity), 1e-9);
  // VOI ceiling for the dossier's mitigation badges.
  const maxVoi = useMemo(
    () => Math.max(...ledger.map((n) => informationValue(ledger, state.current, n.id)), 1e-9),
    [ledger, state.current],
  );

  const selected = selectedId ? (ranked.find((r) => r.risk.id === selectedId) ?? null) : null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const stats = useMemo(() => {
    const errors = risks.filter((r) => r.resolution === "error").length;
    const rocks = risks.filter((r) => r.resolution !== "error" && r.tier === "rock").length;
    const corroborated = risks.filter((r) => r.evidenceStatus === "corroborated").length;
    const totalExpectedLoss = ranked.reduce((s, r) => s + r.severity, 0);
    return { errors, rocks, corroborated, totalExpectedLoss };
  }, [risks, ranked]);

  // Curated headline subset: featured rows render on top with their true
  // global ranks; everything else stays in the boards, folded into a
  // collapsed full register. Without `featured`, rest === ranked (unchanged).
  const featuredSet = new Set(featured ? [...featured.errors, ...featured.risks] : []);
  const featuredErrors = featured ? ranked.filter((r) => featuredSet.has(r.risk.id) && r.risk.resolution === "error") : [];
  const featuredRisks = featured ? ranked.filter((r) => featuredSet.has(r.risk.id) && r.risk.resolution !== "error") : [];
  const rest = ranked.filter((r) => !featuredSet.has(r.risk.id));

  // Errors (reducible — research fixes the model) sit on their own board and
  // feed the refinement loop; the risk boards hold only irreducible risks.
  const boards: { id: BoardId; rows: RankedRisk[] }[] = [
    { id: "error", rows: rest.filter((r) => r.risk.resolution === "error") },
    {
      id: "rock",
      rows: rest.filter((r) => r.risk.resolution !== "error" && r.risk.tier === "rock"),
    },
    {
      id: "front-of-mind",
      rows: rest.filter(
        (r) => r.risk.resolution !== "error" && r.risk.tier === "front-of-mind",
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="border-b border-hairline pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-ink">
          Risk register
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
          What could kill this number
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-2">
          Every risk is a claim against a specific fact in the model, with a machine-readable
          perturbation — so its € impact is <em>computed</em> against your current levers, never
          asserted.{" "}
          <span className="text-ink-3">
            {risks.length} findings · {stats.errors} model errors to fix · {stats.rocks} rocks ·{" "}
            {stats.corroborated} backed by evidence · Σ expected YAM at risk{" "}
            {formatEUR(stats.totalExpectedLoss)}
          </span>
        </p>
        {headerNote ? <p className="mt-1.5 max-w-3xl text-xs text-accent-ink">{headerNote}</p> : null}
      </header>

      <div
        className={
          selected
            ? "mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:items-start"
            : "mt-6"
        }
      >
        <div className="space-y-8">
          {(() => {
            const sectionProps = {
              rankOf: (row: RankedRisk) => ranked.indexOf(row) + 1,
              maxSeverity,
              selectedId,
              condensed: Boolean(selected),
              onSelect: (id: string) => setSelectedId((cur) => (cur === id ? null : id)),
            };
            const boardSections = boards
              .filter(({ rows }) => rows.length > 0)
              .map(({ id, rows }) => (
                <BoardSection
                  key={id}
                  glyph={id === "error" ? "▲" : id === "rock" ? "◆" : "○"}
                  toneClass={id === "error" ? "text-fact-red" : "text-ink-3"}
                  kicker={BOARD_COPY[id].kicker}
                  blurb={BOARD_COPY[id].blurb}
                  rows={rows}
                  {...sectionProps}
                />
              ));
            if (!featured) return boardSections;
            return (
              <>
                <BoardSection
                  glyph="▲"
                  toneClass="text-fact-red"
                  kicker="Headline errors"
                  blurb="What our own numbers didn't survive — each carries a proposed fix."
                  rows={featuredErrors}
                  {...sectionProps}
                />
                <BoardSection
                  glyph="◆"
                  toneClass="text-ink-3"
                  kicker="Headline risks"
                  blurb="What could still kill the number — research won't settle these, only time."
                  rows={featuredRisks}
                  {...sectionProps}
                />
                {/* The rest of the register — the proof of work, one click away. */}
                <details className="group">
                  <summary className="cursor-pointer list-none rounded-lg border border-hairline bg-card px-3 py-2.5 transition-colors hover:border-hairline-strong">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
                      <span aria-hidden className="mr-1.5 inline-block transition-transform group-open:rotate-90">
                        ▸
                      </span>
                      Full register — all {risks.length} findings
                    </span>
                    <span className="ml-2 text-xs text-ink-3">
                      {rest.length} more · Σ expected YAM at risk {formatEUR(stats.totalExpectedLoss)} —
                      every finding, ranked by the engine
                    </span>
                  </summary>
                  <div className="mt-6 space-y-8">{boardSections}</div>
                </details>
              </>
            );
          })()}
        </div>

        <AnimatePresence mode="popLayout">
          {selected ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="card order-first overflow-hidden rounded-xl p-0 lg:order-none lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"
            >
              <RiskDetail
                ranked={selected}
                ledger={ledger}
                scenario={state.current}
                maxVoi={maxVoi}
                onClose={() => setSelectedId(null)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// One board: kicker + blurb, the three-number column header, and its rows.
// Shared by the classic boards, the featured sections and the collapsed
// full register so they can't drift apart.
function BoardSection({
  glyph,
  toneClass,
  kicker,
  blurb,
  rows,
  rankOf,
  maxSeverity,
  selectedId,
  condensed,
  onSelect,
}: {
  glyph: string;
  toneClass: string;
  kicker: string;
  blurb: string;
  rows: RankedRisk[];
  rankOf: (row: RankedRisk) => number;
  maxSeverity: number;
  selectedId: string | null;
  condensed: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3">
        <h2 className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${toneClass}`}>
          {glyph} {kicker}
        </h2>
        <p className="hidden text-xs text-ink-3 sm:block">{blurb}</p>
      </div>

      {/* Column headers — name the three numbers so the row reads on its
          own: chance it's real × what it costs = expected loss (ranked). */}
      <div className="mt-2 flex items-center gap-3 border-b border-hairline px-3 pb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
        <span className="w-5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">Risk</span>
        <span
          className="w-12 shrink-0 whitespace-nowrap text-right"
          title="Likelihood this risk is real and plays out."
        >
          Chance
        </span>
        <span
          className="w-24 shrink-0 whitespace-nowrap text-right"
          title="Change in the Year-1 number (YAM) if the risk lands, at your current levers."
        >
          If it lands
        </span>
        <span
          className="w-36 shrink-0 whitespace-nowrap text-right"
          title="Chance × impact — the expected Year-1 loss. Rows are ranked by this."
        >
          Expected loss
        </span>
      </div>

      <ul className="mt-1.5 space-y-1.5">
        {rows.map((row) => (
          <RiskRow
            key={row.risk.id}
            row={row}
            rank={rankOf(row)}
            maxSeverity={maxSeverity}
            selected={selectedId === row.risk.id}
            condensed={condensed}
            onSelect={() => onSelect(row.risk.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function RiskRow({
  row,
  rank,
  maxSeverity,
  selected,
  condensed,
  onSelect,
}: {
  row: RankedRisk;
  rank: number;
  maxSeverity: number;
  selected: boolean;
  condensed: boolean;
  onSelect: () => void;
}) {
  const { risk, impact, severity } = row;
  // A risk whose target cells are deselected has nothing to bite on — it is
  // out of scope under the current levers, not gone.
  const outOfScope = severity < 1e-9;

  return (
    <li id={`rr-row-${risk.id}`}>
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
          selected
            ? "border-accent/40 bg-accent-wash"
            : "border-hairline bg-card hover:border-hairline-strong"
        } ${outOfScope ? "opacity-50" : ""}`}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-xs tabular-nums text-ink-faint">
            {rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-sm text-ink ${condensed ? "line-clamp-2" : ""}`}>{risk.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Badge
                className={CATEGORY_STYLE[risk.category]}
                title={CATEGORY_TOOLTIP[risk.category]}
              >
                {CATEGORY_LABEL[risk.category]}
              </Badge>
              {risk.evidenceStatus ? (
                <span
                  title={EVIDENCE_STATUS_TOOLTIP[risk.evidenceStatus]}
                  className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide ${EVIDENCE_STATUS_STYLE[risk.evidenceStatus]}`}
                >
                  <span aria-hidden className="font-mono not-italic">
                    {EVIDENCE_STATUS_ICON[risk.evidenceStatus]}
                  </span>
                  {EVIDENCE_STATUS_LABEL[risk.evidenceStatus]}
                </span>
              ) : null}
              {risk.resolution === "error" && risk.proposedCorrection ? (
                <span
                  className="font-mono text-[10px] tabular-nums text-fact-red"
                  title="The concrete fix this error implies — confirmed or refuted by the refinement research pass (npm run refine)."
                >
                  fix: {risk.proposedCorrection.nodeId} → {risk.proposedCorrection.value}
                </span>
              ) : null}
              {outOfScope ? (
                <span className="text-[10px] uppercase tracking-wide text-ink-faint">
                  out of scope under current levers
                </span>
              ) : null}
            </div>
          </div>

          {/* Chance it's real. */}
          <span className="mt-0.5 w-12 shrink-0 text-right font-mono text-xs tabular-nums text-ink-3">
            {formatPct(risk.likelihood.value)}
          </span>

          {/* Impact on the Year-1 number if it lands. */}
          <span
            className={`mt-0.5 w-24 shrink-0 text-right font-mono text-xs tabular-nums ${
              outOfScope
                ? "text-ink-faint"
                : impact.dYam < 0
                  ? "text-negative-ink"
                  : "text-positive-ink"
            }`}
          >
            {outOfScope ? "—" : formatEUR(impact.dYam, { signed: true })}
          </span>

          {/* Expected loss (chance × impact) — the ranking, shown as a bar. */}
          <div className="mt-0.5 flex w-36 shrink-0 items-center justify-end gap-2">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-well">
              <div
                className="h-full rounded-full bg-negative"
                style={{
                  width: `${Math.max((severity / maxSeverity) * 100, outOfScope ? 0 : 2)}%`,
                }}
              />
            </div>
            <span className="w-16 text-right font-mono text-xs tabular-nums text-ink-2">
              {outOfScope ? "€0" : formatEUR(severity)}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}
