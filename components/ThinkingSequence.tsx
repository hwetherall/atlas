"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { THINKING_STEPS, THINKING_TOTAL_MS } from "@/lib/demoScript";

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — the ~7s "thinking" research log. Pure theatre: deterministic timers
// stream a log that reads as real work while the (already-hardcoded) model is
// "assembled". No LLM, no network (CLAUDE.md §6).
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function ThinkingSequence({ onComplete }: Props) {
  // active = number of completed steps; the step at index `active` is running.
  const [active, setActive] = useState(0);
  const [pctText, setPctText] = useState(0);
  const pct = useMotionValue(0);
  const widthPct = useTransform(pct, (v) => `${v}%`);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let acc = 0;
    THINKING_STEPS.forEach((s, i) => {
      acc += s.ms;
      timers.push(setTimeout(() => setActive(i + 1), acc));
    });
    timers.push(setTimeout(() => onCompleteRef.current(), THINKING_TOTAL_MS + 350));

    const controls = animate(pct, 100, {
      duration: THINKING_TOTAL_MS / 1000,
      ease: "linear",
      onUpdate: (v) => setPctText(Math.round(v)),
    });

    return () => {
      timers.forEach(clearTimeout);
      controls.stop();
    };
    // run once on mount; onComplete is read through a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = THINKING_STEPS.slice(0, Math.min(active + 1, THINKING_STEPS.length));

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <h1 className="font-display text-lg font-medium tracking-tight text-ink">
            Researching the market
          </h1>
        </div>
        <p className="mt-1 text-sm text-ink-3">
          Atlas is sourcing facts and assembling a live model. This takes a moment.
        </p>
      </motion.div>

      <div className="card mt-6 rounded-2xl p-5">
        <ul className="space-y-2.5 font-mono text-[13px]">
          <AnimatePresence initial={false}>
            {visible.map((s, i) => {
              const done = i < active;
              const running = i === active;
              return (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    {done ? (
                      <span className="text-positive">✓</span>
                    ) : running ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-accent/30 border-t-accent" />
                    ) : (
                      <span className="text-ink-faint">•</span>
                    )}
                  </span>
                  <span className={done ? "text-ink-3" : "text-ink"}>{s.label}</span>
                  {s.detail ? <span className="text-ink-faint">· {s.detail}</span> : null}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {/* progress bar */}
        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
            <motion.div
              className="h-full rounded-full bg-accent"
              style={{ width: widthPct }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-ink-3">
            <span>Building fact graph</span>
            <span className="tabular-nums">{pctText}%</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onCompleteRef.current()}
        className="mt-4 self-center text-xs text-ink-faint transition-colors hover:text-ink-2"
      >
        Skip →
      </button>
    </div>
  );
}
