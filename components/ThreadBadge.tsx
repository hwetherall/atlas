import { threadForRisk, type Thread, type ThreadId } from "@/lib/threads";

// ─────────────────────────────────────────────────────────────────────────────
// ThreadBadge — the continuity pill. One hue per thread, mounted wherever a
// thread member appears (register rows, refinement exemplars, corrected-model
// cards, next-steps table and memo headers), so the presenter can say "here is
// the 1% assumption again" and the audience sees the same pill they saw two
// tabs ago.
// ─────────────────────────────────────────────────────────────────────────────

const THREAD_STYLE: Record<ThreadId, { pill: string; dot: string }> = {
  "one-percent": {
    pill: "border-fact-violet-line bg-fact-violet-tint text-fact-violet",
    dot: "bg-fact-violet",
  },
  "slow-buyer-gate": {
    pill: "border-fact-amber-line bg-fact-amber-tint text-fact-amber",
    dot: "bg-fact-amber",
  },
};

export default function ThreadBadge({
  riskId,
  thread,
}: {
  /** Resolve the thread from a register id (renders nothing if unthreaded)… */
  riskId?: string;
  /** …or pass the thread directly (e.g. from lib/threads THREADS). */
  thread?: Thread | null;
}) {
  const t = thread ?? (riskId ? threadForRisk(riskId) : null);
  if (!t) return null;
  const style = THREAD_STYLE[t.id];
  return (
    <span
      title={t.note}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${style.pill}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      Following · {t.label}
    </span>
  );
}
