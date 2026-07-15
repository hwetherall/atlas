"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { FactNode, Ledger, Scenario, SourceType } from "@/lib/schema";
import { evaluate, type Metric } from "@/lib/compute";
import { formatEUR, formatNodeBand, formatNodeValue, formatPct } from "@/lib/format";
import { Badge, KIND_LABEL, KIND_STYLE } from "@/lib/badges";
import { SKILLS } from "@/lib/skills";
import { lineageOf, type NodeRef } from "@/lib/lineage";
import { contributionDisplay, factEuro, marginalContribution } from "@/lib/contribution";
import { factClaim } from "@/lib/factClaims";
import { bandSwing, informationValue, swingTam, voiBucket, type VoiBucket } from "@/lib/voi";
import EvidenceSignal from "@/components/EvidenceSignal";

// ─────────────────────────────────────────────────────────────────────────────
// FactDetail — the fact dossier: Fact · Verify next · Evidence · Recipe ·
// Lineage. Shared by the dashboard's FactInspector drawer (variant="drawer")
// and the Fact Bank's master-detail panel (variant="panel"). Live contribution
// and value-of-information recompute as the levers move (read-only; no network).
// ─────────────────────────────────────────────────────────────────────────────

export type FactDetailVariant = "drawer" | "panel";

interface Props {
  node: FactNode;
  ledger: Ledger;
  scenario: Scenario; // current — drives the live numbers
  onSelect: (id: string) => void; // lineage navigation
  onClose: () => void;
  variant: FactDetailVariant;
}

// Size/spacing knobs per host — same markup, roomier in the panel.
const VARIANT = {
  drawer: {
    section: "p-5",
    claim: "text-[17px]",
    value: "text-3xl",
    excerpt: "text-[12px] leading-snug",
  },
  panel: {
    section: "p-6",
    claim: "text-xl",
    value: "text-4xl",
    excerpt: "text-[13px] leading-relaxed",
  },
} as const;

const SOURCE_TYPE_STYLE: Record<SourceType, string> = {
  "industry-report": "border-fact-blue-line text-fact-blue",
  internal: "border-fact-violet-line text-fact-violet",
  "analyst-estimate": "border-fact-amber-line text-fact-amber",
  triangulation: "border-fact-green-line text-fact-green",
  pending: "border-hairline-strong text-ink-faint",
};

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  "industry-report": "industry report",
  internal: "internal",
  "analyst-estimate": "analyst estimate",
  triangulation: "triangulation",
  pending: "pending",
};

const BUCKET_STYLE: Record<VoiBucket, string> = {
  High: "text-negative-ink",
  Med: "text-warning-ink",
  Low: "text-ink-2",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
      {children}
    </h3>
  );
}

function MetricCard({
  label,
  value,
  sub,
  valueClass = "text-ink",
}: {
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-well px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-3">{label}</div>
      <div className={`mt-1 font-mono text-base font-semibold tabular-nums ${valueClass}`}>
        {value}
      </div>
      <div className="text-[10px] text-ink-3">{sub}</div>
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
    <ol className="space-y-1.5 font-mono text-[11px] text-ink-2">
      {steps.map((s, i) => {
        const done = !idle && i < active;
        const running = !idle && i === active;
        return (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[1px] flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              {idle ? (
                <span className="text-ink-faint">{i + 1}.</span>
              ) : done ? (
                <span className="text-positive">✓</span>
              ) : running ? (
                <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-accent/30 border-t-accent" />
              ) : (
                <span className="text-ink-faint">•</span>
              )}
            </span>
            <span className={running ? "text-ink" : undefined}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function FactDetail({ node, ledger, scenario, onSelect, onClose, variant }: Props) {
  const style = VARIANT[variant];

  const [runToken, setRunToken] = useState(0);
  const [rerunning, setRerunning] = useState(false);
  const [flashKey, setFlashKey] = useState(0);

  // Reset the re-run theatre whenever the inspected node changes.
  useEffect(() => {
    setRerunning(false);
    setFlashKey(0);
  }, [node.id]);

  // All live derivations recompute as the levers move (§8).
  const view = useMemo(() => {
    const lineage = lineageOf(ledger, node.id);
    const contrib = contributionDisplay(ledger, scenario, node);
    const evalRes = evaluate(ledger, scenario);

    // Value of information, bucketed against the ledger max.
    const voi = informationValue(ledger, scenario, node.id);
    const maxVoi = Math.max(...ledger.map((n) => informationValue(ledger, scenario, n.id)));
    const bucket = voiBucket(voi, maxVoi);
    const swing = swingTam(ledger, scenario, node.id);

    return {
      lineage,
      evalRes,
      contribValue: contrib.value,
      contribSub: contrib.sub,
      bucket,
      swing,
      band: formatNodeBand(node),
      hasBand: Boolean(node.sensitivityRange),
    };
  }, [node, ledger, scenario]);

  const skill = node.skillId ? SKILLS[node.skillId] : undefined;

  function handleRerun() {
    if (rerunning) return;
    setRerunning(true);
    setRunToken((t) => t + 1);
  }

  function navigate(ref: NodeRef) {
    // Only real ledger nodes are navigable; synthetic spine nodes are static.
    if (ledger.some((n) => n.id === ref.id)) onSelect(ref.id);
  }

  // Live value for a flow chip — outputs/factors from evaluate(), leaves from
  // the ledger.
  function refValue(id: string): string | null {
    if (id === node.id) return formatNodeValue(node);
    if (id === "out.tam") return formatEUR(view.evalRes.tam);
    if (id === "out.sam") return formatEUR(view.evalRes.sam);
    if (id === "out.yam") return formatEUR(view.evalRes.yam);
    const leaf = ledger.find((x) => x.id === id);
    if (leaf) return formatNodeValue(leaf);
    const f = view.evalRes.factors;
    if (id.includes("geography")) return `×${f.geography.toFixed(2)}`;
    if (id.includes("segment")) return `×${f.segment.toFixed(2)}`;
    if (id.includes("customer")) return `×${f.customerType.toFixed(2)}`;
    if (id.includes("serviceable")) return `×${f.serviceable.toFixed(2)}`;
    if (id.includes("obtainable")) return `×${f.obtainable.toFixed(2)}`;
    return null;
  }

  function FlowChip({ refNode, current }: { refNode: NodeRef; current?: boolean }) {
    const real = !current && ledger.some((n) => n.id === refNode.id);
    const value = refValue(refNode.id);
    const inner = (
      <>
        {refNode.label}
        {value ? (
          <span className={`ml-1 font-mono tabular-nums ${current ? "" : "text-ink-3"}`}>
            {value}
          </span>
        ) : null}
      </>
    );
    if (current) {
      return (
        <span className="rounded-md border border-accent/30 bg-accent-wash px-2 py-1 text-[11px] font-medium text-accent-ink">
          {inner}
        </span>
      );
    }
    if (real) {
      return (
        <button
          type="button"
          onClick={() => navigate(refNode)}
          className="rounded-md border border-hairline bg-card px-2 py-1 text-[11px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink"
        >
          {inner}
        </button>
      );
    }
    return (
      <span className="rounded-md border border-hairline bg-well/60 px-2 py-1 text-[11px] text-ink-2">
        {inner}
      </span>
    );
  }

  // "Moving this lever moves these numbers" — the web, quantified.
  function rippleSentence(): React.ReactNode | null {
    const strong = (v: number) => (
      <strong className="font-mono font-semibold tabular-nums text-ink">
        {formatEUR(v, { signed: true })}
      </strong>
    );
    if (node.dimension && node.dimensionValue) {
      const excluded = isNodeExcluded;
      const tam = marginalContribution(ledger, scenario, node.id, "tam");
      const sam = marginalContribution(ledger, scenario, node.id, "sam");
      const yam = marginalContribution(ledger, scenario, node.id, "yam");
      if (excluded) {
        return (
          <>
            Switching {node.label} back on would add {strong(Math.abs(tam))} to TAM,{" "}
            {strong(Math.abs(sam))} to SAM, and {strong(Math.abs(yam))} to year-1.
          </>
        );
      }
      return (
        <>
          Switching {node.label} off would take {strong(-tam)} from TAM, {strong(-sam)} from
          SAM, and {strong(-yam)} from year-1.
        </>
      );
    }
    if (!node.sensitivityRange) return null;
    const swings = (["tam", "sam", "yam"] as Metric[])
      .map((metric) => ({ metric, sw: bandSwing(ledger, scenario, node.id, metric) }))
      .filter((x) => x.sw > 1e-9);
    if (swings.length === 0) return null;
    const label = (m: Metric) => (m === "yam" ? "year-1" : m.toUpperCase());
    return (
      <>
        Across its plausible band, this swings{" "}
        {swings.map((x, i) => (
          <span key={x.metric}>
            {i > 0 ? (i === swings.length - 1 ? " and " : ", ") : ""}
            {label(x.metric)} by{" "}
            <strong className="font-mono font-semibold tabular-nums text-ink">
              ±{formatEUR(x.sw)}
            </strong>
          </span>
        ))}
        .
      </>
    );
  }

  const isNodeExcluded =
    node.dimension && node.dimensionValue
      ? !scenario[
          node.dimension === "geography"
            ? "geographies"
            : node.dimension === "segment"
              ? "segments"
              : "customerTypes"
        ].includes(node.dimensionValue)
      : false;

  const siblingCount = node.dimension
    ? ledger.filter((n) => n.dimension === node.dimension).length
    : 0;

  return (
    <>
      {/* ── Fact ─────────────────────────────────────────────────────────── */}
      <div className={`border-b border-hairline ${style.section}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {node.kind === "assumption" ? (
              <Badge className={KIND_STYLE.assumption}>{KIND_LABEL.assumption}</Badge>
            ) : null}
            <EvidenceSignal node={node} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 rounded-md px-2 py-1 text-ink-3 transition-colors hover:bg-well hover:text-ink"
          >
            ✕
          </button>
        </div>

        <p className={`mt-3 font-display leading-snug text-ink ${style.claim}`}>
          {factClaim(ledger, node)}
        </p>

        {/* Where this fact sits in the math — the web, walkable. */}
        {view.lineage.upstream.length + view.lineage.downstream.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {view.lineage.upstream.map((r) => (
              <span key={r.id} className="flex items-center gap-1.5">
                <FlowChip refNode={r} />
                <span aria-hidden className="text-ink-faint">→</span>
              </span>
            ))}
            <FlowChip refNode={{ id: node.id, label: node.label }} current />
            {view.lineage.downstream.map((r) => (
              <span key={r.id} className="flex items-center gap-1.5">
                <span aria-hidden className="text-ink-faint">→</span>
                <FlowChip refNode={r} />
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-[11px] text-ink-3">
            Context fact — informs risk, not wired into the funnel.
          </p>
        )}

        <motion.div
          key={`val-${flashKey}`}
          // Flash in the accent tint and fade to transparent-accent —
          // never rgba(0,0,0,0), which interpolates through black.
          initial={flashKey ? { backgroundColor: "rgba(46,107,230,0.10)" } : false}
          animate={{ backgroundColor: "rgba(46,107,230,0)" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="mt-3 inline-flex items-baseline gap-2 rounded-lg px-1"
        >
          {(() => {
            // Dimension shares lead with € — the number a reader can anchor
            // on — with the share as the sub-line. Everything else unchanged.
            const euro = factEuro(ledger, node);
            if (euro !== null) {
              return (
                <>
                  <span className={`font-mono font-semibold tabular-nums text-ink ${style.value}`}>
                    {formatEUR(euro)}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-ink-3">
                    {formatPct(node.value)} of base
                  </span>
                </>
              );
            }
            return (
              <span className={`font-mono font-semibold tabular-nums text-ink ${style.value}`}>
                {formatNodeValue(node)}
              </span>
            );
          })()}
          <span className="text-[11px] text-ink-3">as of {node.asOf}</span>
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MetricCard label="Impact" value={view.contribValue} sub={view.contribSub} />
          <MetricCard
            label="Could really be"
            value={view.band}
            sub={view.hasBand ? "low – high estimate" : "no range estimated yet"}
          />
          <MetricCard
            label="Worth verifying"
            value={view.swing > 0 ? `${view.bucket} — ±${formatEUR(view.swing)}` : view.bucket}
            sub="verification payoff on TAM"
            valueClass={BUCKET_STYLE[view.bucket]}
          />
        </div>

        {rippleSentence() ? (
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
            {rippleSentence()}
            {node.dimension ? (
              <span className="mt-1 block text-[11px] text-ink-3">
                One of {siblingCount}{" "}
                {node.dimension === "customerType" ? "buyer" : node.dimension} shares that sum to
                100% — raising one means lowering the rest.
              </span>
            ) : null}
          </p>
        ) : null}

        {/* Verify next — the promotion path, elevated. Red when this fact is
            the top value-of-information target. */}
        {node.provenance?.promotionPath ? (
          <div
            className={`mt-3 rounded-lg border border-l-2 px-3 py-2.5 ${
              view.bucket === "High"
                ? "border-fact-red-line border-l-fact-red bg-fact-red-tint"
                : "border-hairline border-l-warning bg-warning-wash"
            }`}
          >
            <div
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                view.bucket === "High" ? "text-fact-red" : "text-warning-ink"
              }`}
            >
              {view.bucket === "High" ? "⚑ Verify next — highest-payoff check" : "Verify next"}
            </div>
            <p className="mt-1 text-[12px] leading-snug text-ink-2">
              {node.provenance.promotionPath}
            </p>
          </div>
        ) : null}
      </div>

      {/* ── Evidence ─────────────────────────────────────────────────────── */}
      <div className={`border-b border-hairline ${style.section}`}>
        <SectionTitle>Evidence</SectionTitle>
        {node.evidence && node.evidence.length > 0 ? (
          <div className="space-y-2">
            {node.evidence.map((ev, i) => (
              <div
                key={i}
                className={`rounded-lg border px-3 py-2.5 ${
                  ev.attached
                    ? "border-hairline bg-well/60"
                    : "border-dashed border-hairline-strong bg-transparent opacity-80"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] text-ink">
                    {ev.url ? (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-ink underline hover:text-accent"
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
                  <div className="mt-0.5 text-[11px] text-ink-3">
                    {[ev.publisher, ev.date].filter(Boolean).join(" · ")}
                  </div>
                ) : null}
                {ev.excerpt ? (
                  <p className={`mt-1 text-ink-2 ${style.excerpt}`}>{ev.excerpt}</p>
                ) : null}
                {!ev.attached ? (
                  <div className="mt-1 text-[11px] font-medium text-ink-3">
                    Identified, not yet pulled
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : node.source ? (
          <div className="rounded-lg border border-hairline bg-well/60 px-3 py-2.5 text-[13px] text-ink-2">
            {node.source.url ? (
              <a
                href={node.source.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent-ink underline hover:text-accent"
              >
                {node.source.title ?? node.source.url}
              </a>
            ) : (
              node.source.title ?? node.source.note
            )}
            {node.source.note && node.source.title ? (
              <span className="text-ink-3"> — {node.source.note}</span>
            ) : null}
          </div>
        ) : (
          <p className="text-[12px] text-ink-faint">No source attached.</p>
        )}

        {node.provenance?.rationale ? (
          <p className="mt-2 text-[11px] italic text-ink-3">
            Why {node.confidence === "verified" ? "we call it verified" : "this is an estimate"}:{" "}
            {node.provenance.rationale}
          </p>
        ) : null}

        {node.derivation ? (
          <div className="mt-3 rounded-lg border border-hairline bg-well p-3">
            <div className="text-[10px] uppercase tracking-wide text-ink-3">
              How we got this number
            </div>
            {node.derivation.plain ? (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                {node.derivation.plain}
              </p>
            ) : null}
            {/* The working — kept whole, one click away. */}
            <details className={`group ${node.derivation.plain ? "mt-2" : "mt-1"}`}>
              <summary className="cursor-pointer list-none text-[11px] font-medium text-ink-3 transition-colors hover:text-ink">
                <span aria-hidden className="mr-1 inline-block transition-transform group-open:rotate-90">
                  ▸
                </span>
                Show the working · {node.derivation.method}
              </summary>
              <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-mono text-[12px] text-ink-2">
                {node.derivation.expression}
              </pre>
              {node.derivation.crossCheck ? (
                <div className="mt-1.5 text-[11px] text-ink-3">
                  <span className="font-medium text-ink-2">Cross-check (different method):</span>{" "}
                  {node.derivation.crossCheck}
                </div>
              ) : null}
            </details>
          </div>
        ) : null}
      </div>

      {/* ── Method ───────────────────────────────────────────────────────── */}
      <div className={style.section}>
        <SectionTitle>Method</SectionTitle>
        {skill ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-ink">{skill.name}</span>
              <Badge className="border-hairline text-ink-3">v{skill.version}</Badge>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-ink-2">{skill.summary}</p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wide text-ink-3">
                  Inputs
                </div>
                <ul className="space-y-1 text-[11px] text-ink-2">
                  {skill.consumes.map((c) => (
                    <li key={c} className="flex gap-1.5">
                      <span className="text-ink-faint">–</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wide text-ink-3">
                  Steps
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

            <p className="mt-3 text-[11px] leading-snug text-ink-3">
              <span className="text-ink-2">When we call it verified:</span> {skill.confidencePolicy}
            </p>

            <button
              type="button"
              onClick={handleRerun}
              disabled={rerunning}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rerunning ? "Re-running…" : "↻ Re-run this method"}
            </button>
          </div>
        ) : (
          <p className="text-[12px] text-ink-faint">No method attached to this fact.</p>
        )}
      </div>
    </>
  );
}
