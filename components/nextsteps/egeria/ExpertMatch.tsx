import Image from "next/image";
import { formatEUR, formatPct } from "@/lib/format";
import type { EgeriaArtifact } from "@/components/nextsteps/egeria/types";

interface Props {
  artifact: EgeriaArtifact;
  riskTitle: string;
  severity: number;
  likelihood: number;
  impact: number;
  deadline: string;
  onReviewBrief: () => void;
}

export default function ExpertMatch({
  artifact,
  riskTitle,
  severity,
  likelihood,
  impact,
  deadline,
  onReviewBrief,
}: Props) {
  const { caseSummary, matchReasons, network, profile } = artifact;
  const bench = network.benchSize.toLocaleString("en-GB");

  return (
    <div className="mt-5">
      <section aria-label="Risk to action" className="overflow-hidden rounded-xl border border-hairline bg-card">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          <RiskBeat number="01" label="Research established" value={caseSummary.known} />
          <RiskBeat number="02" label="Human judgment" value={caseSummary.unknown} />
          <RiskBeat
            number="03"
            label="Exposure"
            value={`${formatEUR(severity)} expected loss · ${formatPct(likelihood)} likelihood`}
            tone="negative"
          />
          <RiskBeat number="04" label="Action" value={caseSummary.action} tone="accent" />
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.55fr)]">
        <aside className="card rounded-2xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
            Why Egeria
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-ink">
            The law is known. The route is not.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            {riskTitle}
          </p>

          <div className="mt-5 space-y-2.5">
            <ReasonLine label="More research" value="Restates the regulation" />
            <ReasonLine label="The decision" value="Classify this product" active />
            <ReasonLine label="What waiting does" value="Misses design freeze" />
          </div>

          <div className="mt-5 rounded-xl border border-negative/20 bg-negative-wash p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-negative-ink">
              If it hits
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-negative-ink">
              {formatEUR(impact, { signed: true })}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
              {caseSummary.consequence}
            </p>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-ink-3">
            <span className="font-medium text-ink-2">Decision clock:</span>{" "}
            {deadline}
          </p>
        </aside>

        <section
          aria-labelledby="anneke-name"
          className="card overflow-hidden rounded-2xl border-accent/20"
        >
          <div className="grid min-h-[420px] md:grid-cols-[230px_minmax(0,1fr)]">
            <div className="relative min-h-72 overflow-hidden bg-well md:min-h-full">
              <Image
                src={profile.portrait}
                alt={`Fictional portrait of ${profile.name}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 230px"
                className="object-cover object-[50%_30%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-4 pb-4 pt-12 text-card md:hidden">
                <p className="text-xs font-medium">Best match</p>
              </div>
            </div>

            <div className="flex flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-positive/25 bg-positive-wash px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-positive-ink">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-positive" />
                    Best match
                  </p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-accent-ink">
                    Matched from {bench}+ Innovera experts
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-[11px] text-positive-ink">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-positive" />
                  {network.availability}
                </p>
              </div>

              <h2 id="anneke-name" className="mt-4 font-display text-3xl font-medium tracking-tight text-ink">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{profile.title}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-ink-3">
                {profile.location}
              </p>

              <div className="mt-5 grid gap-2.5">
                {matchReasons.map((reason) => (
                  <div key={reason.label} className="flex gap-3 rounded-xl border border-hairline bg-well/70 p-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] text-card"
                    >
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-ink">{reason.label}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-ink-2">{reason.proof}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-hairline bg-card px-2 py-0.5 text-[10px] text-ink-3"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={onReviewBrief}
                  className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-card shadow-raised transition-colors hover:bg-accent-ink"
                >
                  Review the prepared session brief →
                </button>
                <p className="mt-2 text-center text-[10px] italic leading-relaxed text-ink-faint">
                  {profile.disclosure}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <details className="mt-4 rounded-xl border border-hairline bg-card px-4 py-3">
        <summary className="cursor-pointer text-xs font-medium text-ink-2">
          Career evidence and {artifact.alternates.length} alternate matches
        </summary>
        <div className="mt-4 grid gap-4 border-t border-hairline pt-4 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              Career evidence
            </p>
            <ul className="mt-2 space-y-2">
              {profile.background.map((item) => (
                <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-ink-2">
                  <span aria-hidden className="text-accent-ink">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              Other strong matches
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {artifact.alternates.map((alternate) => (
                <div key={alternate.name} className="rounded-lg border border-hairline bg-well p-3">
                  <p className="text-xs font-semibold text-ink">{alternate.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase leading-relaxed tracking-wide text-ink-faint">
                    {alternate.title} · {alternate.location}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-2">{alternate.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

function RiskBeat({
  number,
  label,
  value,
  tone = "default",
}: {
  number: string;
  label: string;
  value: string;
  tone?: "default" | "negative" | "accent";
}) {
  const toneClass =
    tone === "negative"
      ? "text-negative-ink"
      : tone === "accent"
        ? "text-accent-ink"
        : "text-ink";

  return (
    <div className="relative border-b border-hairline p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-ink-faint">{number}</span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</p>
      </div>
      <p className={`mt-2 text-xs font-medium leading-relaxed ${toneClass}`}>{value}</p>
    </div>
  );
}

function ReasonLine({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-xs ${
        active ? "border-accent/35 bg-accent-wash" : "border-hairline bg-well"
      }`}
    >
      <span className={active ? "font-semibold text-accent-ink" : "text-ink-3"}>{label}</span>
      <span className="text-right text-ink-2">{active ? "✓ " : ""}{value}</span>
    </div>
  );
}
