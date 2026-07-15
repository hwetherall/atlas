"use client";

import { useMemo, useState } from "react";
import type { Ledger } from "@/lib/schema";
import type { ScenarioState } from "@/lib/useScenario";
import type { Memo } from "@/lib/nextStepsSchema";
import { projectAction } from "@/lib/projection";
import { formatEUR, formatPct } from "@/lib/format";
import { BookSessionModal, EmailModal } from "@/components/nextsteps/EgeriaModals";

// ─────────────────────────────────────────────────────────────────────────────
// Artifacts — the tool deliverable, one renderer per response
// (nextsteps.md §4), plus ModelAfter (the engine-computed projection block).
// Delphi reads as a buying list; Egeria as an expert profile with static
// demo-mock CTAs; Argus as risk → what changes → how we track it; Julius as
// an initiative charter; acceptance as a signed, tripwired memo.
// ─────────────────────────────────────────────────────────────────────────────

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
      {children}
    </h2>
  );
}

export function LabeledLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

function LabeledLineBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

function nodeLabel(ledger: Ledger, id: string): string {
  return ledger.find((n) => n.id === id)?.label ?? id;
}

export function ArtifactBlock({ memo, ledger }: { memo: Memo; ledger: Ledger }) {
  const a = memo.artifact;
  switch (a.kind) {
    // ── Delphi — the buying list: report · what you'll learn · what it
    //    settles · price, each linked to its store page (item 26). ────────────
    case "delphi":
      return (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-hairline text-left text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  <th className="py-1.5 pr-3 font-medium">Report</th>
                  <th className="py-1.5 pr-3 font-medium">What you&rsquo;ll learn</th>
                  <th className="py-1.5 pr-3 font-medium">What it settles</th>
                  <th className="py-1.5 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {a.options.map((opt) => (
                  <tr key={opt.title} className="border-b border-hairline align-top">
                    <td className="max-w-56 py-2.5 pr-3">
                      <p className="text-ink">
                        {opt.url ? (
                          <a href={opt.url} target="_blank" rel="noreferrer" className="hover:underline">
                            {opt.title} ↗
                          </a>
                        ) : (
                          opt.title
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-3">
                        {opt.vendor}
                        {opt.note ? ` · ${opt.note}` : ""}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3 text-ink-2">{opt.scope}</td>
                    <td className="py-2.5 pr-3">
                      <span className="flex flex-wrap gap-1">
                        {opt.settles.map((id) => (
                          <span
                            key={id}
                            className="whitespace-nowrap rounded border border-hairline bg-well px-1.5 py-0.5 text-[10px] text-ink-2"
                          >
                            {nodeLabel(ledger, id)}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2.5 text-right">
                      <span className="font-mono tabular-nums text-ink">{opt.price}</span>
                      <span className="block text-[10px] text-ink-faint">{opt.delivery}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg border border-accent/40 bg-accent-wash p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
              Delphi recommends
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{a.recommendation}</p>
          </div>
        </div>
      );

    // ── Egeria — the expert profile is the artifact (item 23): who she is,
    //    where her judgment comes from, and two static demo-mock CTAs. ────────
    case "egeria":
      return <EgeriaArtifact artifact={a} />;

    // ── Argus — risk → what happens if things change → how we track it,
    //    then the watch table and the standing list (item 25). ────────────────
    case "argus":
      return (
        <div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-hairline bg-card p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                The risk
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{memo.tableLine}</p>
            </div>
            <div className="rounded-lg border border-hairline bg-card p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                If things change
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{a.escalation}</p>
            </div>
            <div className="rounded-lg border border-hairline bg-card p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                How we track it
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
                The feeds below, swept on cadence, around the clock — a threshold trip re-prices
                the register the same day.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-hairline text-left text-[10px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                  <th className="py-1.5 pr-3 font-medium">Signal</th>
                  <th className="py-1.5 pr-3 font-medium">Feed</th>
                  <th className="py-1.5 pr-3 font-medium">Alert threshold</th>
                  <th className="py-1.5 text-right font-medium">Cadence</th>
                </tr>
              </thead>
              <tbody>
                {a.watch.map((w) => (
                  <tr key={w.signal} className="border-b border-hairline align-top">
                    <td className="py-2.5 pr-3 text-ink">{w.signal}</td>
                    <td className="py-2.5 pr-3 text-ink-3">{w.feed}</td>
                    <td className="py-2.5 pr-3 font-mono text-[11px] text-ink-2">{w.threshold}</td>
                    <td className="whitespace-nowrap py-2.5 text-right text-ink-2">{w.cadence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* The mock alert — one static simulation, clearly labeled. */}
          <div className="mt-4 rounded-lg border border-hairline-strong bg-well p-4">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-warning" />
              {a.mockAlert.label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink">“{a.mockAlert.feedItem}”</p>
            <p className="mt-1 text-[11px] text-ink-3">{a.mockAlert.source}</p>
            <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <LabeledLine label="Tripped">{a.mockAlert.tripped}</LabeledLine>
              <LabeledLine label="What Argus does">{a.mockAlert.effect}</LabeledLine>
            </div>
          </div>

          {/* The standing list — Argus's watch across the whole register. */}
          {a.alsoWatching && a.alsoWatching.length > 0 ? (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Also on Argus&rsquo;s watch — the rest of the register
              </p>
              <ul className="mt-2 space-y-1.5">
                {a.alsoWatching.map((w) => (
                  <li key={w.signal} className="flex gap-2 text-[11px] leading-relaxed">
                    <span aria-hidden className="text-ink-faint">◉</span>
                    <span>
                      <span className="text-ink-2">{w.signal}</span>{" "}
                      <span className="text-ink-faint">— {w.feed}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );

    // ── Julius — the initiative charter. ─────────────────────────────────────
    case "julius":
      return (
        <div>
          <p className="max-w-3xl text-sm leading-relaxed text-ink">{a.objective}</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {a.workstreams.map((w) => (
              <div key={w.name} className="card rounded-xl p-4">
                <p className="text-xs font-medium text-ink">{w.name}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{w.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-x-8 gap-y-4 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Milestones
              </p>
              <ul className="mt-2 space-y-1.5">
                {a.milestones.map((m) => (
                  <li key={m.when} className="flex gap-3 text-xs">
                    <span className="w-16 shrink-0 font-mono tabular-nums text-ink-3">{m.when}</span>
                    <span className="text-ink-2">{m.what}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] tabular-nums">
                <span className="rounded border border-hairline bg-card px-2 py-1 text-ink-2">{a.budget}</span>
                <span className="rounded border border-hairline bg-card px-2 py-1 text-ink-2">{a.resourcing}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  Leading indicators — is it working?
                </p>
                <ul className="mt-2 space-y-1 text-xs text-ink-2">
                  {a.leadingIndicators.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden className="text-positive">↗</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  Kill criteria — when to stop
                </p>
                <ul className="mt-2 space-y-1 text-xs text-ink-2">
                  {a.killCriteria.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden className="text-negative">✕</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );

    // ── Accept & watch — the acceptance memo, executed by Argus. ─────────────
    case "acceptance":
      return (
        <div className="max-w-3xl">
          <p className="text-sm leading-relaxed text-ink-2">{a.acceptance}</p>
          <div className="mt-4 space-y-3">
            <LabeledLine label="Max regret — the bound">{a.maxRegretNote}</LabeledLine>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Revisit triggers — Argus watches these
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-ink-2">
                {a.revisitTriggers.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden className="text-ink-faint">⚑</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <LabeledLine label="Sunset">{a.sunset}</LabeledLine>
              <LabeledLine label="Sign-off">{a.signoff}</LabeledLine>
            </div>
          </div>
        </div>
      );
  }
}

// ── Egeria — profile card + backups + demo-mock CTAs ─────────────────────────

function EgeriaArtifact({
  artifact,
}: {
  artifact: Extract<Memo["artifact"], { kind: "egeria" }>;
}) {
  const [modal, setModal] = useState<"none" | "book" | "email">("none");
  const { profile, alternates, emailDraft, agenda, deliverable } = artifact;
  // The last background line is the fictional-by-design disclosure — render
  // it as a footnote, not a career bullet.
  const bullets = profile.background.filter((b) => !b.toLowerCase().includes("fictional"));
  const disclosure = profile.background.find((b) => b.toLowerCase().includes("fictional"));

  return (
    <div>
      <div className="card rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-medium text-ink">{profile.name}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-3">
              {profile.title} · {profile.location}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModal("book")}
              className="rounded-lg border border-accent/40 bg-accent-wash px-3 py-1.5 text-xs font-medium text-accent-ink transition-colors hover:border-accent/70"
            >
              Book session
            </button>
            <button
              type="button"
              onClick={() => setModal("email")}
              className="rounded-lg border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-hairline-strong"
            >
              Email
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.expertise.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-hairline bg-well px-2 py-0.5 text-[10px] font-medium text-ink-2"
            >
              {chip}
            </span>
          ))}
        </div>
        <ul className="mt-3 space-y-1.5">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-xs leading-relaxed text-ink-2">
              <span aria-hidden className="text-ink-faint">·</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[11px] text-ink-3">{profile.engagement}</p>
        {disclosure ? <p className="mt-1.5 text-[10px] italic text-ink-faint">{disclosure}</p> : null}
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        If the calendar says no — the backups
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {alternates.map((alt) => (
          <div key={alt.name} className="rounded-lg border border-hairline bg-card p-3">
            <p className="text-xs font-medium text-ink">{alt.name}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
              {alt.title} · {alt.location}
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{alt.why}</p>
          </div>
        ))}
      </div>

      <LabeledLineBlock label="Deliverable">{deliverable}</LabeledLineBlock>

      {modal === "book" ? (
        <BookSessionModal expertName={profile.name} onClose={() => setModal("none")} />
      ) : null}
      {modal === "email" ? (
        <EmailModal draft={emailDraft} agenda={agenda} onClose={() => setModal("none")} />
      ) : null}
    </div>
  );
}

// ── The model after — projectAction rendered ─────────────────────────────────

const METRIC_LABEL = { tam: "TAM", sam: "SAM", yam: "YAM" } as const;

export function ModelAfter({
  memo,
  ledger,
  state,
  retired,
  likelihoodBefore,
}: {
  memo: Memo;
  ledger: Ledger;
  state: ScenarioState;
  retired: number;
  likelihoodBefore: number;
}) {
  const projected = useMemo(
    () => projectAction(ledger, state.current, memo.projection.ops),
    [ledger, state.current, memo.projection.ops],
  );
  const funnelMoved =
    Math.abs(projected.after.tam - projected.before.tam) > 1e-9 ||
    Math.abs(projected.after.yam - projected.before.yam) > 1e-9;

  return (
    <div className="mt-3">
      <p className="max-w-3xl text-xs leading-relaxed text-ink-2">{memo.projection.note}</p>

      {memo.projection.ops.length > 0 ? (
        <div className="mt-4 space-y-2">
          {funnelMoved ? (
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs tabular-nums text-ink-2">
              {(["tam", "sam", "yam"] as const).map((m) => (
                <span key={m}>
                  {METRIC_LABEL[m]} {formatEUR(projected.before[m])}
                  <span className="text-ink-faint"> → </span>
                  {formatEUR(projected.after[m])}
                </span>
              ))}
            </div>
          ) : null}
          {projected.nodes.map((n) => (
            <div
              key={n.nodeId}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-lg border border-hairline bg-well px-3 py-2"
            >
              <span className="text-xs text-ink" title={n.nodeId}>
                {nodeLabel(ledger, n.nodeId)}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-ink-2">
                possible swing on {METRIC_LABEL[n.metric]}: ±{formatEUR(n.swingBefore)}
                <span className="text-ink-faint"> → </span>±{formatEUR(n.swingAfter)}
              </span>
              {n.voiBefore > 1e-9 ? (
                <span className="font-mono text-[11px] tabular-nums text-ink-2">
                  value of information: {formatEUR(n.voiBefore)}
                  <span className="text-ink-faint"> → </span>
                  {formatEUR(n.voiAfter)}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {memo.projection.likelihoodAfter !== undefined ? (
        <p className="mt-3 font-mono text-xs tabular-nums text-ink-2">
          Chance the risk bites: {formatPct(likelihoodBefore)}
          <span className="text-ink-faint"> → </span>
          {formatPct(memo.projection.likelihoodAfter)} on the executed plan
        </p>
      ) : null}

      <p className="mt-4 font-mono text-xs tabular-nums text-ink">
        {memo.projection.retirement === "settles" ? (
          <>Executing settles the question — {formatEUR(retired)} of expected Year-1 loss comes off the register.</>
        ) : memo.projection.retirement === "mitigates" ? (
          retired > 1e-9 ? (
            <>Executing retires {formatEUR(retired)} of expected Year-1 loss on the projected model.</>
          ) : (
            <>
              Executing moves the downside band, not today&rsquo;s expected loss — the worst case
              rises off the floor (the swing line above), which severity pricing does not yet
              capture.
            </>
          )
        ) : memo.projection.retirement === "bounds" ? (
          <>Retires €0 — the acceptance bounds the regret; it does not shrink it.</>
        ) : (
          <>Retires €0 — watching moves nothing until the world does.</>
        )}
      </p>
    </div>
  );
}
