"use client";

import type { Ledger, Scenario } from "@/lib/schema";
import type { Mitigation, PerturbationOp } from "@/lib/riskSchema";
import { mitigationVoi, type RankedRisk } from "@/lib/riskCompute";
import { voiBucket } from "@/lib/voi";
import { formatEUR, formatPct } from "@/lib/format";
import {
  Badge,
  CATEGORY_LABEL,
  CATEGORY_STYLE,
  EVIDENCE_STATUS_LABEL,
  EVIDENCE_STATUS_STYLE,
} from "@/lib/badges";

// ─────────────────────────────────────────────────────────────────────────────
// RiskDetail — the risk dossier (FactDetail's sibling). Narrative → computed
// impact ("view this world": base vs perturbed funnel, a display-only lens
// that never mutates the user's scenario) → mechanism chain → the partner
// beats (why missable · falsifier) → early warnings → mitigations with
// computed VOI → evidence. Every € figure comes from lib/riskCompute.ts.
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

      <p className="mt-3 text-sm leading-relaxed text-ink-2">{risk.narrative}</p>

      {/* ── computed impact — the "view this world" lens ───────────────────── */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-hairline bg-well p-3">
          <p className="text-[10px] uppercase tracking-wide text-ink-3">TAM if it lands</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-ink">
            {formatEUR(impact.perturbed.tam)}
          </p>
          <p className={`font-mono text-[11px] tabular-nums ${impact.dTam < 0 ? "text-negative-ink" : "text-ink-faint"}`}>
            {formatEUR(impact.dTam, { signed: true })}
          </p>
        </div>
        <div className="rounded-lg border border-hairline bg-well p-3">
          <p className="text-[10px] uppercase tracking-wide text-ink-3">YAM if it lands</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-ink">
            {formatEUR(impact.perturbed.yam)}
          </p>
          <p className={`font-mono text-[11px] tabular-nums ${impact.dYam < 0 ? "text-negative-ink" : "text-ink-faint"}`}>
            {formatEUR(impact.dYam, { signed: true })}
          </p>
        </div>
        <div className="rounded-lg border border-negative/20 bg-negative-wash p-3">
          <p className="text-[10px] uppercase tracking-wide text-negative-ink">Expected YAM loss</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-negative-ink">
            {formatEUR(severity)}
          </p>
          <p className="font-mono text-[11px] tabular-nums text-ink-3">
            p {formatPct(risk.likelihood.value)} · {risk.likelihood.basis}
          </p>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-ink-faint">
        Computed vs your current levers — this lens never moves them. Perturbation:{" "}
        {risk.perturbation.map((op) => opLabel(op, ledger)).join(" · ")}
      </p>

      {/* ── mechanism ──────────────────────────────────────────────────────── */}
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

      {/* ── the partner beats ──────────────────────────────────────────────── */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-well p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Why you'd miss it
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{risk.whyMissable}</p>
        </div>
        <div className="rounded-lg border border-hairline bg-well p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            What would kill this risk
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{risk.falsifier}</p>
        </div>
      </div>

      {/* ── errors vs risks: the settle-it verdict ─────────────────────────── */}
      {risk.resolution === "error" ? (
        <div className="mt-5 rounded-lg border border-fact-red-line bg-fact-red-tint p-3">
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
        <Section title="Why research can't settle this now">
          <p className="text-xs leading-relaxed text-ink-2">{risk.settleTest}</p>
        </Section>
      ) : null}

      <Section title="Likelihood rationale">
        <p className="text-xs leading-relaxed text-ink-2">{risk.likelihood.rationale}</p>
      </Section>

      {/* ── early warnings (the Bayesian hooks) ────────────────────────────── */}
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

      {/* ── mitigations, information-type priced by VOI ────────────────────── */}
      <Section title="Mitigations">
        <ul className="space-y-2">
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

      {/* ── evidence ───────────────────────────────────────────────────────── */}
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
            No external coverage found — kept and flagged, not killed. Absence of coverage is not
            absence of risk.
          </p>
        </Section>
      )}

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
