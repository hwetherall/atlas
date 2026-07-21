"use client";

import Image from "next/image";
import { useState } from "react";
import { formatEUR } from "@/lib/format";
import { EmailModal } from "@/components/nextsteps/EgeriaModals";
import type { EgeriaArtifact } from "@/components/nextsteps/egeria/types";

const DAYS = [
  { dow: "Thu", date: "16 Jul" },
  { dow: "Fri", date: "17 Jul" },
  { dow: "Mon", date: "20 Jul" },
  { dow: "Tue", date: "21 Jul" },
  { dow: "Wed", date: "22 Jul" },
  { dow: "Thu", date: "23 Jul" },
  { dow: "Fri", date: "24 Jul" },
  { dow: "Mon", date: "27 Jul" },
  { dow: "Tue", date: "28 Jul" },
  { dow: "Wed", date: "29 Jul" },
] as const;

const TIMES = ["09:00", "11:00", "14:00", "16:00"] as const;

export default function BookingPanel({
  artifact,
  retired,
  onBack,
}: {
  artifact: EgeriaArtifact;
  retired: number;
  onBack: () => void;
}) {
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  if (confirmed && day !== null && time !== null) {
    const selected = DAYS[day];
    return (
      <div>
        <section className="overflow-hidden border-y border-positive/25">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="bg-positive-wash p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center bg-positive text-xl text-card">✓</span>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-positive-ink">
                Session request staged
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-ink">The action is now in motion.</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {artifact.profile.name} · {selected.dow} {selected.date} · {time} CET
              </p>
              <SimulationTag />
              <button
                type="button"
                onClick={() => setConfirmed(false)}
                className="mt-5 text-xs font-medium text-positive-ink hover:underline"
              >
                Change date or time
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
                Research → risk → action → model
              </p>
              <div className="mt-5 space-y-0">
                <OutcomeStep
                  number="01"
                  title="Prep pack assembled"
                  body={`${artifact.agenda.length} questions, linked model nodes and the underlying evidence go to the expert.`}
                />
                <OutcomeStep
                  number="02"
                  title="Expert session"
                  body="One hour focused on the classification route, artifact sequence and buyer-readiness judgment."
                />
                <OutcomeStep number="03" title="Decision artifact returned" body={artifact.deliverable} />
                <OutcomeStep
                  number="04"
                  title="Risk register updated"
                  body={`${formatEUR(retired)} of expected Year-1 loss is settled and the answer becomes part of the market twin.`}
                  last
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="border-y border-hairline p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
            Choose an advisory slot
          </p>
          <h2 className="mt-1 font-display text-2xl text-ink">Book the classification session</h2>
          <p className="mt-2 text-xs text-ink-3">1-hour advisory session · follow-up memo included · CET</p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {DAYS.map((item, index) => (
              <button
                key={`${item.dow}-${item.date}`}
                type="button"
                onClick={() => setDay(index)}
                aria-pressed={day === index}
                className={`border px-2 py-3 text-center transition-colors ${
                  day === index
                    ? "border-accent/50 bg-accent-wash"
                    : "border-hairline bg-well hover:border-hairline-strong"
                }`}
              >
                <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {item.dow}
                </span>
                <span className="mt-1 block font-mono text-xs text-ink">{item.date}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {TIMES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTime(item)}
                aria-pressed={time === item}
                className={`border px-4 py-2 font-mono text-xs transition-colors ${
                  time === item
                    ? "border-accent/50 bg-accent-wash text-accent-ink"
                    : "border-hairline bg-card text-ink-2 hover:border-hairline-strong"
                }`}
              >
                {item} CET
              </button>
            ))}
          </div>

          <SimulationTag />
        </section>

        <aside className="flex flex-col border-l-2 border-accent bg-well p-5 sm:p-6">
          <div className="flex items-center gap-3 border-b border-hairline pb-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden">
              <Image
                src={artifact.profile.portrait}
                alt=""
                fill
                sizes="56px"
                className="object-cover object-[50%_28%]"
              />
            </div>
            <div>
              <p className="font-display text-base font-medium text-ink">{artifact.profile.name}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-ink-3">{artifact.profile.title}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              Egeria sends before the call
            </p>
            <ul className="mt-2 space-y-2">
              {artifact.agenda.slice(0, 3).map((item, index) => (
                <li key={item.question} className="flex gap-2 text-[11px] leading-relaxed text-ink-2">
                  <span className="font-mono text-ink-faint">0{index + 1}</span>
                  {item.question}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-ink-faint">+ {artifact.agenda.length - 3} linked questions and source pack</p>
          </div>

          <div className="mt-4 border-y border-hairline bg-card p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              Comes back
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{artifact.deliverable}</p>
          </div>

          <button
            type="button"
            disabled={day === null || time === null}
            onClick={() => setConfirmed(true)}
            className="mt-5 w-full bg-accent px-4 py-3 text-sm font-semibold text-card transition-colors hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            Request the session
          </button>
          <button
            type="button"
            onClick={() => setEmailOpen(true)}
            className="mt-2 w-full border border-hairline bg-card px-4 py-2.5 text-xs font-medium text-ink-2 hover:border-hairline-strong"
          >
            Prefer email? Open the prepared draft
          </button>
        </aside>
      </div>

      <div className="mt-5 border-t border-hairline pt-4">
        <button type="button" onClick={onBack} className="text-xs font-medium text-ink-3 hover:text-ink">
          ← Back to session brief
        </button>
      </div>

      {emailOpen ? (
        <EmailModal
          draft={artifact.emailDraft}
          agenda={artifact.agenda}
          onClose={() => setEmailOpen(false)}
        />
      ) : null}
    </div>
  );
}

function SimulationTag() {
  return (
    <p className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-3">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />
      Demo simulation — nothing is sent or booked
    </p>
  );
}

function OutcomeStep({
  number,
  title,
  body,
  last = false,
}: {
  number: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-3">
      <div className="flex flex-col items-center">
        <span className="flex h-7 w-7 items-center justify-center border border-accent/30 bg-accent-wash font-mono text-[9px] text-accent-ink">
          {number}
        </span>
        {!last ? <span aria-hidden className="h-full w-px bg-hairline" /> : null}
      </div>
      <div className={last ? "pb-0" : "pb-5"}>
        <p className="text-xs font-semibold text-ink">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{body}</p>
      </div>
    </div>
  );
}
