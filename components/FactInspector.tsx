"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FactNode, Ledger, Scenario, SourceType } from "@/lib/schema";
import { labelFor } from "@/lib/dimensions";
import { formatEUR, formatPct } from "@/lib/format";
import {
  Badge,
  CONFIDENCE_STYLE,
  KIND_STYLE,
  MATURITY_LABEL,
  MATURITY_STYLE,
} from "@/lib/badges";
import { SKILLS } from "@/lib/skills";
import { lineageOf, type NodeRef } from "@/lib/lineage";
import { marginalContribution } from "@/lib/contribution";
import { bandSwing, informationValue } from "@/lib/voi";

// ─────────────────────────────────────────────────────────────────────────────
// FactInspector — ledger.md §8. A right slide-in drawer that turns one fact into
// an inspectable object: Fact · Evidence · Recipe · Lineage. Live contribution
// and value-of-information recompute as the levers move (read-only; no network).
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  nodeId: string | null;
  ledger: Ledger;
  scenario: Scenario; // current (cur) — drives the live numbers
  baseline: Scenario; // pinned baseline (base) — reserved for vs-baseline views
  onSelect: (id: string) => void; // lineage navigation
  onClose: () => void;
}

const DIM_FIELD = {
  geography: "geographies",
  segment: "segments",
  customerType: "customerTypes",
} as const;

const SOURCE_TYPE_STYLE: Record<SourceType, string> = {
  "industry-report": "border-sky-500/40 text-sky-300",
  internal: "border-violet-500/40 text-violet-300",
  "analyst-estimate": "border-amber-500/40 text-amber-300",
  triangulation: "border-emerald-500/40 text-emerald-300",
  pending: "border-neutral-500/40 text-neutral-500",
};

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  "industry-report": "industry report",
  internal: "internal",
  "analyst-estimate": "analyst estimate",
  triangulation: "triangulation",
  pending: "pending",
};

function renderValue(node: FactNode): string {
  if (node.unit === "EUR_M") return formatEUR(node.value);
  if (node.unit === "ratio") return formatPct(node.value, node.value < 0.1 ? 1 : 0);
  return `${node.value} ${node.unit}`;
}

function formatRatioOrEur(unit: string, v: number): string {
  if (unit === "EUR_M") return formatEUR(v);
  if (unit === "ratio") return formatPct(v, v < 0.1 ? 1 : 0);
  return `${v}`;
}

function formatRange(node: FactNode): string {
  if (!node.sensitivityRange) return "—";
  const { low, high } = node.sensitivityRange;
  // No spaces around the dash so "€900M–€1,500M" fits on one line.
  return `${formatRatioOrEur(node.unit, low)}–${formatRatioOrEur(node.unit, high)}`;
}

function claim(node: FactNode): React.ReactNode {
  const v = <strong className="font-semibold text-neutral-50">{renderValue(node)}</strong>;
  if (node.id === "tamBase")
    return <>The Central Europe rack-PDU market is worth {v} across all segments and buyers.</>;
  if (node.id === "serviceableFactor")
    return <>{v} of TAM is serviceable — reachable through channel and regulatory-clear demand.</>;
  if (node.id === "obtainableFactor")
    return <>{v} of SAM is realistically obtainable in the first 12 months.</>;
  if (node.id === "shape.cagr") return <>The market is growing at {v} CAGR (2025–2030).</>;
  if (node.id === "shape.cr3") return <>The top three suppliers hold {v} of the market.</>;
  if (node.dimension === "geography")
    return <>{node.label} accounts for {v} of the Central Europe rack-PDU market.</>;
  if (node.dimension === "segment")
    return <>The {node.label} segment is {v} of the rack-PDU market.</>;
  if (node.dimension === "customerType")
    return <>{node.label} make up {v} of rack-PDU buyers.</>;
  return <>{node.label}: {v}.</>;
}

type Bucket = "High" | "Med" | "Low";
function voiBucket(voi: number, maxVoi: number): Bucket {
  if (maxVoi <= 0) return "Low";
  const r = voi / maxVoi;
  if (r >= 0.5) return "High";
  if (r >= 0.15) return "Med";
  return "Low";
}

const BUCKET_STYLE: Record<Bucket, string> = {
  High: "text-rose-300",
  Med: "text-amber-300",
  Low: "text-neutral-300",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
      {children}
    </h3>
  );
}

function MetricCard({
  label,
  value,
  sub,
  valueClass = "text-neutral-100",
}: {
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div
        className={`mt-1 whitespace-nowrap font-mono text-base font-semibold tabular-nums ${valueClass}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-neutral-500">{sub}</div>
    </div>
  );
}

// The skill procedure as a mini log. Idle → numbered list; while runToken ticks,
// it streams ✓ / spinner / • like ThinkingSequence, then calls onComplete.
function ProcedureList({
  steps,
  runToken,
  onComplete,
}: {
  steps: string[];
  runToken: number;
  onComplete: () => void;
}) {
  const [active, setActive] = useState(-1); // -1 = idle
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (runToken === 0) return;
    setActive(0);
    const per = Math.max(450, Math.round(2400 / steps.length));
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setActive(i + 1), per * (i + 1)));
    });
    timers.push(
      setTimeout(() => {
        onCompleteRef.current();
        setActive(-1);
      }, per * steps.length + 250),
    );
    return () => timers.forEach(clearTimeout);
  }, [runToken, steps.length]);

  const idle = active === -1;
  return (
    <ol className="space-y-1.5 font-mono text-[11px] text-neutral-400">
      {steps.map((s, i) => {
        const done = !idle && i < active;
        const running = !idle && i === active;
        return (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[1px] flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              {idle ? (
                <span className="text-neutral-600">{i + 1}.</span>
              ) : done ? (
                <span className="text-emerald-400">✓</span>
              ) : running ? (
                <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-sky-400/30 border-t-sky-400" />
              ) : (
                <span className="text-neutral-700">•</span>
              )}
            </span>
            <span className={running ? "text-neutral-100" : undefined}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function FactInspector({ nodeId, ledger, scenario, onSelect, onClose }: Props) {
  const node = useMemo(
    () => (nodeId ? (ledger.find((n) => n.id === nodeId) ?? null) : null),
    [nodeId, ledger],
  );
  const open = Boolean(node);

  const [runToken, setRunToken] = useState(0);
  const [rerunning, setRerunning] = useState(false);
  const [flashKey, setFlashKey] = useState(0);

  // Reset the re-run theatre whenever the inspected node changes.
  useEffect(() => {
    setRerunning(false);
    setFlashKey(0);
  }, [nodeId]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // All live derivations recompute as the levers move (§8).
  const view = useMemo(() => {
    if (!node) return null;
    const lineage = lineageOf(ledger, node.id);
    const topOutput = lineage.downstream.find((r) => r.id.startsWith("out."));

    // Live contribution / sensitivity card (improve-ledger.md §6).
    //  • filter leaf → its marginal € slice of TAM (a genuine, non-redundant number)
    //  • serviceable/obtainable → ± band swing on the metric it drives (SAM/YAM)
    //  • tamBase → no card: its band swing would just restate the Plausible-band card
    const isFilterLeaf = Boolean(node.dimension && node.dimensionValue);
    let showContrib = true;
    let contribLabel = "Live contribution";
    let contribValue = "—";
    let contribSub = "";
    if (isFilterLeaf && node.dimension && node.dimensionValue) {
      const selected = scenario[DIM_FIELD[node.dimension]].includes(node.dimensionValue);
      const c = marginalContribution(ledger, scenario, node.id, "tam");
      if (selected) {
        contribValue = formatEUR(c); // c > 0 → "€336M" (unsigned)
        contribSub = "to TAM now";
      } else {
        contribValue = `+${formatEUR(Math.abs(c))}`;
        contribSub = "if included";
      }
    } else if (node.id === "serviceableFactor" || node.id === "obtainableFactor") {
      const m = node.id === "serviceableFactor" ? "sam" : "yam";
      const sw = bandSwing(ledger, scenario, node.id, m);
      contribLabel = `${m.toUpperCase()} sensitivity`;
      contribValue = sw > 0 ? `±${formatEUR(sw)}` : "—";
      contribSub = sw > 0 ? `band on ${m.toUpperCase()}` : "no band swing";
    } else {
      // tamBase (and any other base node): the Plausible-band card already shows
      // its € range — a sensitivity card here would just halve and restate it.
      showContrib = false;
    }

    // Value of information, bucketed against the ledger max.
    const voi = informationValue(ledger, scenario, node.id);
    const maxVoi = Math.max(...ledger.map((n) => informationValue(ledger, scenario, n.id)));
    const bucket = voiBucket(voi, maxVoi);

    return {
      lineage,
      topOutput,
      showContrib,
      contribLabel,
      contribValue,
      contribSub,
      bucket,
      band: formatRange(node),
      hasBand: Boolean(node.sensitivityRange),
    };
  }, [node, ledger, scenario]);

  const skill = node?.skillId ? SKILLS[node.skillId] : undefined;

  function handleRerun() {
    if (rerunning) return;
    setRerunning(true);
    setRunToken((t) => t + 1);
  }

  function navigate(ref: NodeRef) {
    // Only real ledger nodes are navigable; synthetic spine nodes are static.
    if (ledger.some((n) => n.id === ref.id)) onSelect(ref.id);
  }

  function Chips({ refs }: { refs: NodeRef[] }) {
    if (refs.length === 0) return <span className="text-[11px] text-neutral-600">—</span>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {refs.map((r) => {
          const real = ledger.some((n) => n.id === r.id);
          return real ? (
            <button
              key={r.id}
              type="button"
              onClick={() => navigate(r)}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:border-sky-400/40 hover:text-sky-300"
            >
              {r.label}
            </button>
          ) : (
            <span
              key={r.id}
              className="rounded-md border border-white/[0.06] bg-white/[0.01] px-2 py-1 text-[11px] text-neutral-500"
            >
              {r.label}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && node && view ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel fixed right-0 top-0 z-50 flex h-full w-full max-w-[30rem] flex-col overflow-y-auto rounded-none border-l border-white/10"
            role="dialog"
            aria-label={`Fact inspector: ${node.label}`}
          >
            {/* ── Fact ─────────────────────────────────────────────────────── */}
            <div className="border-b border-white/[0.06] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className={KIND_STYLE[node.kind]}>{node.kind}</Badge>
                  <Badge className={CONFIDENCE_STYLE[node.confidence]}>{node.confidence}</Badge>
                  {node.maturity ? (
                    <Badge className={MATURITY_STYLE[node.maturity]}>
                      {MATURITY_LABEL[node.maturity]}
                    </Badge>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1 -mt-1 shrink-0 rounded-md px-2 py-1 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-[15px] leading-snug text-neutral-300">{claim(node)}</p>

              <div className="mt-2 font-mono text-[10px] text-neutral-600">
                {node.id} · {node.dimension ? labelFor(node.dimension, node.dimensionValue ?? "") : node.kind} ·{" "}
                {node.dimension ? "leaf" : "base"} · feeds {view.topOutput?.label ?? "context"}
              </div>

              <motion.div
                key={`val-${flashKey}`}
                initial={flashKey ? { backgroundColor: "rgba(94,234,212,0.22)" } : false}
                animate={{ backgroundColor: "rgba(0,0,0,0)" }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="mt-3 inline-flex items-baseline gap-2 rounded-lg px-1"
              >
                <span className="font-mono text-3xl font-semibold tabular-nums text-neutral-50">
                  {renderValue(node)}
                </span>
                <span className="text-[11px] text-neutral-500">as of {node.asOf}</span>
              </motion.div>

              <div className={`mt-4 grid gap-2 ${view.showContrib ? "grid-cols-3" : "grid-cols-2"}`}>
                {view.showContrib ? (
                  <MetricCard
                    label={view.contribLabel}
                    value={view.contribValue}
                    sub={view.contribSub}
                  />
                ) : null}
                <MetricCard
                  label="Plausible band"
                  value={view.band}
                  sub={view.hasBand ? "plausible range" : "no band yet"}
                />
                <MetricCard
                  label="Info value"
                  value={view.bucket}
                  sub="value of information"
                  valueClass={BUCKET_STYLE[view.bucket]}
                />
              </div>
              {view.bucket === "High" ? (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-300">
                  ⚑ Top value-of-information — verify next
                </div>
              ) : null}
            </div>

            {/* ── Evidence ─────────────────────────────────────────────────── */}
            <div className="border-b border-white/[0.06] p-5">
              <SectionTitle>Evidence</SectionTitle>
              {node.evidence && node.evidence.length > 0 ? (
                <div className="space-y-2">
                  {node.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border px-3 py-2.5 ${
                        ev.attached
                          ? "border-white/[0.07] bg-white/[0.02]"
                          : "border-dashed border-white/[0.08] bg-transparent opacity-70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13px] text-neutral-200">
                          {ev.url ? (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-400 underline hover:text-sky-300"
                            >
                              {ev.title}
                            </a>
                          ) : (
                            ev.title
                          )}
                        </span>
                        <Badge className={SOURCE_TYPE_STYLE[ev.sourceType]}>
                          {SOURCE_TYPE_LABEL[ev.sourceType]}
                        </Badge>
                      </div>
                      {ev.publisher || ev.date ? (
                        <div className="mt-0.5 text-[11px] text-neutral-500">
                          {[ev.publisher, ev.date].filter(Boolean).join(" · ")}
                        </div>
                      ) : null}
                      {ev.excerpt ? (
                        <p className="mt-1 text-[12px] leading-snug text-neutral-400">{ev.excerpt}</p>
                      ) : null}
                      {!ev.attached ? (
                        <div className="mt-1 text-[11px] font-medium text-neutral-500">
                          Not yet attached
                          {node.provenance?.promotionPath ? ` — ${node.provenance.promotionPath}` : ""}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : node.source ? (
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-[13px] text-neutral-300">
                  {node.source.url ? (
                    <a
                      href={node.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 underline hover:text-sky-300"
                    >
                      {node.source.title ?? node.source.url}
                    </a>
                  ) : (
                    node.source.title ?? node.source.note
                  )}
                  {node.source.note && node.source.title ? (
                    <span className="text-neutral-500"> — {node.source.note}</span>
                  ) : null}
                </div>
              ) : (
                <p className="text-[12px] text-neutral-600">No source attached.</p>
              )}

              {node.provenance?.rationale ? (
                <p className="mt-2 text-[11px] italic text-neutral-500">
                  Why {node.confidence}: {node.provenance.rationale}
                </p>
              ) : null}

              {node.derivation ? (
                <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-[10px] uppercase tracking-wide text-neutral-500">
                    Calculation · {node.derivation.method}
                  </div>
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-[12px] text-neutral-200">
                    {node.derivation.expression}
                  </pre>
                  {node.derivation.crossCheck ? (
                    <div className="mt-1 text-[11px] text-emerald-300/80">
                      ✓ {node.derivation.crossCheck}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* ── Recipe ───────────────────────────────────────────────────── */}
            <div className="border-b border-white/[0.06] p-5">
              <SectionTitle>Recipe</SectionTitle>
              {skill ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-neutral-100">{skill.name}</span>
                    <Badge className="border-white/15 text-neutral-400">v{skill.version}</Badge>
                  </div>
                  <p className="mt-1 text-[12px] leading-snug text-neutral-400">{skill.summary}</p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
                        Consumes
                      </div>
                      <ul className="space-y-1 text-[11px] text-neutral-400">
                        {skill.consumes.map((c) => (
                          <li key={c} className="flex gap-1.5">
                            <span className="text-neutral-600">–</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
                        Procedure
                      </div>
                      <ProcedureList
                        key={node.id}
                        steps={skill.procedure}
                        runToken={runToken}
                        onComplete={() => {
                          setRerunning(false);
                          setFlashKey((k) => k + 1);
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-snug text-neutral-500">
                    <span className="text-neutral-400">Confidence policy:</span> {skill.confidencePolicy}
                  </p>

                  <button
                    type="button"
                    onClick={handleRerun}
                    disabled={rerunning}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-neutral-300 transition-colors hover:border-sky-400/40 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {rerunning ? "Re-running…" : "↻ Re-run skill"}
                  </button>
                </div>
              ) : (
                <p className="text-[12px] text-neutral-600">No skill attached to this fact.</p>
              )}
            </div>

            {/* ── Lineage ──────────────────────────────────────────────────── */}
            <div className="p-5">
              <SectionTitle>Lineage</SectionTitle>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
                    Computed from
                  </div>
                  <Chips refs={view.lineage.upstream} />
                </div>
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
                    Feeds into
                  </div>
                  <Chips refs={view.lineage.downstream} />
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
