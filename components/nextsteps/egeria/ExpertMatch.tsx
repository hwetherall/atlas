import Image from "next/image";
import type { EgeriaArtifact } from "@/components/nextsteps/egeria/types";

interface Props {
  artifact: EgeriaArtifact;
  riskTitle: string;
  onSearchAgain: () => void;
  onReviewBrief: () => void;
}

export default function ExpertMatch({
  artifact,
  riskTitle,
  onSearchAgain,
  onReviewBrief,
}: Props) {
  const { matchReasons, network, profile } = artifact;
  const bench = network.benchSize.toLocaleString("en-GB");

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-5">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-positive-ink">
            Search complete · strongest fit identified
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Anneke Vos has made this judgment before.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-2">
            Egeria compared the decision against {bench}+ network profiles, then ranked direct classification experience above broad subject-matter familiarity.
          </p>
        </div>
        <button
          type="button"
          onClick={onSearchAgain}
          className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3 hover:text-ink"
        >
          ↻ Replay matching
        </button>
      </header>

      <section aria-labelledby="anneke-name" className="mt-8 border-y border-hairline">
        <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
          <div className="relative min-h-80 overflow-hidden bg-well md:min-h-[500px]">
            <Image
              src={profile.portrait}
              alt={`Fictional portrait of ${profile.name}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 260px"
              className="object-cover object-[50%_30%]"
            />
          </div>

          <div className="flex min-w-0 flex-col border-t border-hairline p-5 sm:p-7 md:border-l md:border-t-0 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">Recommended expert</p>
                <h2 id="anneke-name" className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm leading-6 text-ink-2">{profile.title}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-ink-3">{profile.location}</p>
              </div>
              <p className="flex items-center gap-2 border border-positive/25 bg-positive-wash px-3 py-2 text-[10px] font-medium text-positive-ink">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-positive" />
                {network.availability}
              </p>
            </div>

            <div className="mt-7">
              <div className="grid grid-cols-[105px_minmax(0,1fr)] border-b border-hairline pb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                <span>Match criterion</span>
                <span>Evidence</span>
              </div>
              {matchReasons.map((reason) => (
                <div key={reason.label} className="grid grid-cols-[105px_minmax(0,1fr)] gap-4 border-b border-hairline py-3.5">
                  <p className="text-[11px] font-semibold leading-5 text-ink">{reason.label}</p>
                  <p className="text-[11px] leading-5 text-ink-2">{reason.proof}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {profile.expertise.map((item) => (
                <span key={item} className="text-[10px] text-ink-3">
                  <span aria-hidden className="mr-1.5 text-accent-ink">•</span>{item}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-7">
              <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-ink">Prepared for this exact decision</p>
                  <p className="mt-1 max-w-md text-[11px] leading-5 text-ink-3">{riskTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={onReviewBrief}
                  className="shrink-0 bg-accent px-5 py-3 text-sm font-semibold text-card transition-colors hover:bg-accent-ink"
                >
                  Review session brief →
                </button>
              </div>
              <p className="mt-3 text-[9px] italic leading-4 text-ink-faint">{profile.disclosure}</p>
            </div>
          </div>
        </div>
      </section>

      <details className="mt-6 border-y border-hairline py-3">
        <summary className="cursor-pointer list-none text-xs font-medium text-ink-2 marker:hidden">
          <span className="flex items-center justify-between gap-3">
            <span>Career evidence and {artifact.alternates.length} alternate matches</span>
            <span aria-hidden className="text-ink-faint">＋</span>
          </span>
        </summary>
        <div className="mt-4 grid gap-7 border-t border-hairline pt-5 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Career evidence</p>
            <ul className="mt-3 space-y-3">
              {profile.background.map((item) => (
                <li key={item} className="border-l border-accent pl-3 text-[11px] leading-5 text-ink-2">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Other strong matches</p>
            <div className="mt-3 divide-y divide-hairline border-y border-hairline">
              {artifact.alternates.map((alternate) => (
                <div key={alternate.name} className="grid gap-1 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
                  <div>
                    <p className="text-xs font-semibold text-ink">{alternate.name}</p>
                    <p className="mt-0.5 text-[9px] uppercase leading-4 tracking-wide text-ink-faint">{alternate.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium leading-4 text-ink-3">{alternate.title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-ink-2">{alternate.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
