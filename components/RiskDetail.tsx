"use client";

import type { Ledger, Scenario } from "@/lib/schema";
import type { Mitigation, PerturbationOp } from "@/lib/riskSchema";
import { mitigationVoi, type RankedRisk } from "@/lib/riskCompute";
import { voiBucket } from "@/lib/voi";
import { formatEUR, formatNodeValue, formatPct } from "@/lib/format";
import { factClaim } from "@/lib/factClaims";
import {
  Badge,
  CATEGORY_LABEL,
  CATEGORY_STYLE,
  EVIDENCE_STATUS_LABEL,
  EVIDENCE_STATUS_STYLE,
} from "@/lib/badges";
import ThreadBadge from "@/components/ThreadBadge";

// ─────────────────────────────────────────────────────────────────────────────
// RiskDetail — the risk dossier (FactDetail's sibling), reordered per the
// walkthrough feedback (next-steps.md item 8) to read as an argument:
//   ① the fact we're challenging  ② what the problem is  ③ what it does to
//   our numbers  ④ how we'd attack it  ⑤ Innovera's read — with mechanism,
//   early warnings and sources folded into one "full workings" details.
// Every € figure comes from lib/riskCompute.ts against the current levers.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ranked: RankedRisk;
  ledger: Ledger;
  scenario: Scenario;
  maxVoi: number;
  onClose: () => void;
}

const MITIGATION_LABEL: Record<Mitigation["type"], string> = {
  information: "buy information",
  contractual: "contractual",
  strategic: "strategic",
  operational: "operational",
};

function opLabel(op: PerturbationOp, ledger: Ledger): string {
  const node = ledger.find((n) => n.id === op.nodeId);
  const label = node?.label ?? op.nodeId;
  if (op.op === "exclude") return `${label}: excluded from reachable scope`;
  const value =
    node?.unit === "ratio" ? formatPct(op.value!, op.value! < 0.1 ? 1 : 0) : `${op.value}`;
  if (op.op === "set") return `${label} → ${value}`;
  if (op.op === "scale") return `${label} × ${op.value}`;
  return `${label} ${op.value! >= 0 ? "+" : ""}${value}`;
}

export default function RiskDetail({ ranked, ledger, scenario, maxVoi, onClose }: Props) {
  const { risk, impact, severity } = ranked;
  const mechanismSteps = risk.mechanism.split(" → ");
  const targetNode = ledger.find((n) => n.id === risk.targetNodes[0]) ?? null;

  // The first funnel stage the perturbation moves — where the risk bites.
  const biteStage =
    Math.abs(impact.dTam) > 1e-9 ? "tam" : Math.abs(impact.dSam) > 1e-9 ? "sam" : "yam";
  const STAGES = [
    { key: "tam" as const, label: "TAM", d: impact.dTam },
    { key: "sam" as const, label: "SAM", d: impact.dSam },
    { key: "yam" as const, label: "Year-1", d: impact.dYam },
  ];

  return (
    <div className="p-5">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                risk.resolution === "error" ? "text-fact-red" : "text-ink-3"
              }`}
            >
              {risk.resolution === "error"
                ? "▲ Model error"
                : risk.tier === "rock"
                  ? "◆ Rock"
                  : "○ Front of mind"}
            </span>
            <ThreadBadge riskId={risk.id} />
            <Badge className={CATEGORY_STYLE[risk.category]}>{CATEGORY_LABEL[risk.category]}</Badge>
            {risk.evidenceStatus ? (
              <Badge className={`bg-transparent ${EVIDENCE_STATUS_STYLE[risk.evidenceStatus]}`}>
                {EVIDENCE_STATUS_LABEL[risk.evidenceStatus]}
              </Badge>
            ) : null}
          </div>
          <h2 className="mt-2 font-display text-xl font-medium leading-snug tracking-tight text-ink">
            {risk.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close risk detail"
          className="shrink-0 rounded-md border border-hairline px-2 py-1 text-xs text-ink-3 transition-colors hover:border-hairline-strong hover:text-ink"
        >
          Esc
        </button>
      </div>

      {/* ── ① the fact we're challenging ───────────────────────────────────── */}
      {targetNode ? (
        <div className="mt-4 rounded-lg border border-hairline bg-well p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            The fact we&rsquo;re challenging
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
            {factClaim(ledger, targetNode)}
          </p>
          <p className="mt-1 font-mono text-[11px] tabular-nums text-ink-3">
            {targetNode.label} = {formatNodeValue(targetNode)}
            {risk.targetNodes.length > 1
              ? ` · also touches: ${risk.targetNodes
                  .slice(1)
                  .map((id) => ledger.find((n) => n.id === id)?.label ?? id)
                  .join(", ")}`
              : ""}
          </p>
        </div>
      ) : null}

      {/* ── ② what the problem is ──────────────────────────────────────────── */}
      <Section title="What the problem is">
        <p className="text-sm leading-relaxed text-ink-2">{risk.narrative}</p>
      </Section>

      {/* ── ③ what it does to our numbers — mini funnel, biting stage lit ──── */}
      <Section title="What it does to our numbers">
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((s) => (
            <div
              key={s.key}
              className={`rounded-lg border p-3 ${
                s.key === biteStage
                  ? "border-negative/30 bg-negative-wash"
                  : "border-hairline bg-well"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wide text-ink-3">
                {s.label}
                {s.key === biteStage ? " — where it bites" : ""}
              </p>
              <p className="mt-1 font-mono text-xs tabular-nums text-ink-3">
                {formatEUR(impact.base[s.key])}
                <span className="text-ink-faint"> → </span>
                <span className="text-ink">{formatEUR(impact.perturbed[s.key])}</span>
              </p>
              <p
                className={`font-mono text-[11px] tabular-nums ${
                  s.d < 0 ? "text-negative-ink" : "text-ink-faint"
                }`}
              >
                {formatEUR(s.d, { signed: true })}
              </p>
            </div>
          ))}
          <div className="rounded-lg border border-negative/20 bg-negative-wash p-3">
            <p className="text-[10px] uppercase tracking-wide text-negative-ink">Expected loss</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-negative-ink">
              {formatEUR(severity)}
            </p>
            <p className="font-mono text-[11px] tabular-nums text-ink-3">
              p {formatPct(risk.likelihood.value)} · on Year-1
            </p>
          </div>
        </div>
        <p className="mt-1.5 text-[11px] text-ink-faint">
          Computed vs your current levers — this lens never moves them. Year-1 is small today
          ({formatEUR(impact.base.yam)}), so the € that matters is often the TAM/SAM hit.
          Perturbation: {risk.perturbation.map((op) => opLabel(op, ledger)).join(" · ")}
        </p>
      </Section>

      {/* ── ④ how we'd attack it ───────────────────────────────────────────── */}
      <Section title="How we’d attack it">
        {risk.resolution === "error" ? (
          <div className="rounded-lg border border-fact-red-line bg-fact-red-tint p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fact-red">
              ▲ Error, not a risk — research settles this
            </p>
            {risk.settleTest ? (
              <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                <span className="text-ink-3">What settles it:</span> {risk.settleTest}
              </p>
            ) : null}
            {risk.proposedCorrection ? (
              <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                <span className="text-ink-3">Proposed fix:</span>{" "}
                <span className="font-mono tabular-nums">
                  {ledger.find((n) => n.id === risk.proposedCorrection!.nodeId)?.label ??
                    risk.proposedCorrection.nodeId}
                  : {ledger.find((n) => n.id === risk.proposedCorrection!.nodeId)?.value} →{" "}
                  {risk.proposedCorrection.value}
                </span>{" "}
                — {risk.proposedCorrection.rationale}
              </p>
            ) : null}
            <p className="mt-1.5 text-[11px] text-ink-3">
              Queued for the refinement loop: research confirms or refutes the fix, then the fact
              bank is corrected and the register re-runs.
            </p>
          </div>
        ) : risk.settleTest ? (
          <p className="mb-2 text-xs leading-relaxed text-ink-2">
            <span className="text-ink-3">Why research can&rsquo;t settle this now:</span>{" "}
            {risk.settleTest}
          </p>
        ) : null}
        <ul className={`space-y-2 ${risk.resolution === "error" ? "mt-3" : ""}`}>
          {risk.mitigations.map((m, i) => {
            const voi = mitigationVoi(ledger, scenario, m);
            return (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-ink-2">
                <Badge
                  className={
                    m.type === "information"
                      ? "border-fact-blue-line bg-fact-blue-tint text-fact-blue"
                      : "border-hairline bg-well text-ink-3"
                  }
                >
                  {MITIGATION_LABEL[m.type]}
                </Badge>
                <span className="min-w-0 flex-1">
                  {m.action}
                  {voi !== null ? (
                    <span className="ml-1 whitespace-nowrap font-mono text-[11px] tabular-nums text-accent-ink">
                      · worth up to {formatEUR(voi)} on TAM ({voiBucket(voi, maxVoi)} VOI)
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ── ⑤ Innovera's read ──────────────────────────────────────────────── */}
      <Section title="Innovera’s read">
        <div className="space-y-2 rounded-lg border border-hairline bg-well p-3 text-xs leading-relaxed text-ink-2">
          <p>
            <span className="font-medium text-ink">Why you&rsquo;d miss it:</span>{" "}
            {risk.whyMissable}
          </p>
          <p>
            <span className="font-medium text-ink">Why we rate it {formatPct(risk.likelihood.value)}:</span>{" "}
            {risk.likelihood.rationale}
          </p>
          <p>
            <span className="font-medium text-ink">What would change our mind:</span>{" "}
            {risk.falsifier}
          </p>
        </div>
      </Section>

      {/* ── full workings — mechanism, early warnings, sources ─────────────── */}
      <details className="group mt-5">
        <summary className="cursor-pointer list-none text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink">
          <span aria-hidden className="mr-1 inline-block transition-transform group-open:rotate-90">
            ▸
          </span>
          Full workings — mechanism, early warnings, sources
        </summary>

        <Section title="Mechanism">
          <ol className="space-y-1.5">
            {mechanismSteps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink-2">
                <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Early warnings — watch these">
          <ul className="space-y-2">
            {risk.indicators.map((ind, i) => (
              <li key={i} className="text-xs leading-relaxed text-ink-2">
                <span className="text-ink">{ind.signal}</span>
                {ind.where ? <span className="text-ink-3"> — watch: {ind.where}</span> : null}
                {ind.threshold ? (
                  <span className="text-ink-3"> · trigger: {ind.threshold}</span>
                ) : null}
                <span className="ml-1 text-[10px] uppercase tracking-wide text-ink-faint">
                  {ind.updates === "increases" ? "↑ raises p" : "↓ lowers p"}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {risk.evidence?.length ? (
          <Section title={`Evidence (${EVIDENCE_STATUS_LABEL[risk.evidenceStatus ?? "speculative"]})`}>
            <ul className="space-y-2">
              {risk.evidence.map((e, i) => (
                <li key={i} className="rounded-lg border border-hairline bg-card p-3">
                  <p className="text-xs font-medium text-ink">
                    {e.url ? (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-accent-ink hover:underline"
                      >
                        {e.title} ↗
                      </a>
                    ) : (
                      e.title
                    )}
                    {e.publisher ? <span className="text-ink-3"> — {e.publisher}</span> : null}
                  </p>
                  {e.excerpt ? (
                    <p className="mt-1 border-l-2 border-hairline pl-2 text-[11px] leading-relaxed text-ink-3">
                      {e.excerpt}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : (
          <Section title="Evidence">
            <p className="text-xs text-ink-3">
              No external coverage found — kept and flagged, not killed. Absence of coverage is
              not absence of risk.
            </p>
          </Section>
        )}
      </details>

      <p className="mt-5 border-t border-hairline pt-3 text-[10px] text-ink-faint">
        {risk.id} · as of {risk.asOf} · drafts, transcripts and raw evidence in risks/ (audit
        trail)
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
