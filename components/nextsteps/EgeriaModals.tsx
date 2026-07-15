"use client";

import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// EgeriaModals — the two CTA popups on the expert profile (next-steps.md
// item 23). Static demo mocks by design: zero network, nothing sends,
// nothing books. Both close on Escape / backdrop click and confirm into a
// clearly-labeled "demo simulation" state, same convention as the Argus
// mock alert. Dates derive from a fixed anchor so the demo is deterministic.
// ─────────────────────────────────────────────────────────────────────────────

// Fixed anchor for the booking grid — the memo pass date, not Date.now(),
// so every demo run shows the same calendar.
const ANCHOR = new Date("2026-07-15T00:00:00Z");
const SLOT_TIMES = ["09:00", "11:00", "14:00", "16:00"] as const;

function nextWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const d = new Date(ANCHOR);
  while (days.length < count) {
    d.setUTCDate(d.getUTCDate() + 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
  }
  return days;
}

function fmtDay(d: Date): { dow: string; date: string } {
  return {
    dow: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
  };
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="card w-full max-w-lg rounded-xl bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-base font-medium text-ink">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded px-1.5 text-sm text-ink-3 transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SimulationTag() {
  return (
    <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-warning" />
      Demo simulation — nothing is sent or booked
    </p>
  );
}

// ── Book session ─────────────────────────────────────────────────────────────

export function BookSessionModal({
  expertName,
  onClose,
}: {
  expertName: string;
  onClose: () => void;
}) {
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const days = nextWeekdays(10);

  return (
    <ModalShell title={`Book a session — ${expertName}`} onClose={onClose}>
      {confirmed ? (
        <div className="mt-4">
          <p className="text-sm text-ink">
            Session requested: {fmtDay(days[day!]).dow} {fmtDay(days[day!]).date} · {slot} CET
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            Egeria confirms within the hour and circulates the prep pack — the model&rsquo;s open
            questions, pre-read, and the fact each answer settles.
          </p>
          <SimulationTag />
        </div>
      ) : (
        <>
          <p className="mt-1 text-xs text-ink-3">1-hour advisory session · follow-up memo included</p>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {days.map((d, i) => {
              const f = fmtDay(d);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setDay(i)}
                  aria-pressed={day === i}
                  className={`rounded-lg border px-2 py-2 text-center transition-colors ${
                    day === i
                      ? "border-accent/60 bg-accent-wash"
                      : "border-hairline bg-well hover:border-hairline-strong"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wide text-ink-faint">{f.dow}</span>
                  <span className="mt-0.5 block text-xs text-ink">{f.date}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SLOT_TIMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSlot(t)}
                aria-pressed={slot === t}
                className={`rounded-full border px-3 py-1 font-mono text-xs tabular-nums transition-colors ${
                  slot === t
                    ? "border-accent/60 bg-accent-wash text-accent-ink"
                    : "border-hairline bg-well text-ink-2 hover:border-hairline-strong"
                }`}
              >
                {t} CET
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={day === null || slot === null}
            onClick={() => setConfirmed(true)}
            className="mt-4 w-full rounded-lg border border-accent/40 bg-accent-wash px-3 py-2 text-sm font-medium text-accent-ink transition-colors hover:border-accent/70 disabled:opacity-40"
          >
            Request session
          </button>
          <SimulationTag />
        </>
      )}
    </ModalShell>
  );
}

// ── Email ────────────────────────────────────────────────────────────────────

export function EmailModal({
  draft,
  agenda,
  onClose,
}: {
  draft: { to: string; subject: string; intro: string };
  agenda: { question: string }[];
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const body = `${draft.intro}\n\n${agenda
    .map((item, i) => `${i + 1}. ${item.question}`)
    .join("\n")}\n\nBest regards`;

  return (
    <ModalShell title="Draft email" onClose={onClose}>
      {sent ? (
        <div className="mt-4">
          <p className="text-sm text-ink">Sent to {draft.to}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            Egeria tracks the thread and books the session when Dr. Vos replies.
          </p>
          <SimulationTag />
        </div>
      ) : (
        <>
          <div className="mt-3 space-y-1.5 border-b border-hairline pb-3 text-xs">
            <p>
              <span className="text-ink-faint">To:</span>{" "}
              <span className="font-mono text-ink-2">{draft.to}</span>
            </p>
            <p>
              <span className="text-ink-faint">Subject:</span>{" "}
              <span className="text-ink">{draft.subject}</span>
            </p>
          </div>
          <pre className="mt-3 max-h-72 overflow-y-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink-2">
            {body}
          </pre>
          <button
            type="button"
            onClick={() => setSent(true)}
            className="mt-4 w-full rounded-lg border border-accent/40 bg-accent-wash px-3 py-2 text-sm font-medium text-accent-ink transition-colors hover:border-accent/70"
          >
            Send
          </button>
          <SimulationTag />
        </>
      )}
    </ModalShell>
  );
}
