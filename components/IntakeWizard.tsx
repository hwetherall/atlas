"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BUSINESS_FIELDS,
  FOLLOWUP_QUESTIONS,
  RESEARCH_PLAN,
  UPLOADED_DOCS,
  type UploadedDoc,
} from "@/lib/demoScript";

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — guided intake. Prefilled and one-click-per-step so a live demo never
// stalls. Nothing here drives the math: the research always resolves to the
// hardcoded rack-PDU ledger (CLAUDE.md §6). The upload accepts files but only
// records their names — no processing, no network.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

const STEPS = ["Upload", "Business", "Follow-ups", "Research plan"] as const;

export default function IntakeWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [docs, setDocs] = useState<UploadedDoc[]>(UPLOADED_DOCS);
  const [fields, setFields] = useState(() => BUSINESS_FIELDS.map((f) => ({ ...f })));
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(FOLLOWUP_QUESTIONS.map((q) => [q.id, q.answer])),
  );
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const last = STEPS.length - 1;

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const added = Array.from(list).map((f) => ({
      name: f.name,
      meta: `${Math.max(1, Math.round(f.size / 1024))} KB`,
    }));
    setDocs((d) => [...d, ...added]);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-400/80">Atlas</p>
        <h1 className="mt-1 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
          New market analysis
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Tell Atlas about the venture. It will research the market and build a live, sourced model.
        </p>
      </motion.div>

      {/* step indicator */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-colors ${
                i < step
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                  : i === step
                    ? "border-sky-500/60 bg-sky-500/15 text-sky-200"
                    : "border-white/10 bg-white/[0.02] text-neutral-500"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < last ? (
              <div className={`h-px flex-1 ${i < step ? "bg-emerald-500/40" : "bg-white/10"}`} />
            ) : null}
          </div>
        ))}
      </div>

      <div className="glass-panel mt-4 min-h-[20rem] rounded-2xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 ? (
              <div>
                <h2 className="text-sm font-semibold text-neutral-200">Upload your venture profile</h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  The same anonymized profile VentureX produces — plus anything else relevant.
                </p>

                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  className={`mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center transition-colors ${
                    dragging ? "border-sky-400/60 bg-sky-500/5" : "border-white/15 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <span className="text-2xl">⬆</span>
                  <span className="mt-2 text-sm text-neutral-300">Drop files or click to browse</span>
                  <span className="mt-0.5 text-xs text-neutral-500">PDF, DOCX, XLSX — nothing leaves your machine</span>
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />

                <ul className="mt-4 space-y-2">
                  {docs.map((d, i) => (
                    <li
                      key={`${d.name}-${i}`}
                      className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
                    >
                      <span className="text-base">📄</span>
                      <span className="min-w-0 flex-1 truncate text-sm text-neutral-200">{d.name}</span>
                      <span className="shrink-0 text-xs text-neutral-500">{d.meta}</span>
                      <span className="shrink-0 text-emerald-400">✓</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {step === 1 ? (
              <div>
                <h2 className="text-sm font-semibold text-neutral-200">Confirm the business</h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Atlas pre-filled this from your documents. Edit anything that&apos;s off.
                </p>
                <div className="mt-4 space-y-3">
                  {fields.map((f, i) => (
                    <label key={f.label} className="block">
                      <span className="text-xs text-neutral-500">{f.label}</span>
                      <input
                        value={f.value}
                        onChange={(e) =>
                          setFields((prev) => prev.map((p, j) => (j === i ? { ...p, value: e.target.value } : p)))
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-100 outline-none transition-colors focus:border-sky-500/50"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="text-sm font-semibold text-neutral-200">A few follow-ups</h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  These pin down the axes Atlas will size across.
                </p>
                <div className="mt-4 space-y-5">
                  {FOLLOWUP_QUESTIONS.map((q) => (
                    <div key={q.id}>
                      <p className="text-sm text-neutral-200">{q.question}</p>
                      <p className="text-xs text-neutral-500">{q.helper}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {q.options.map((opt) => {
                          const active = answers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                active
                                  ? "border-sky-500/60 bg-sky-500/15 text-sky-200"
                                  : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:text-neutral-200"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h2 className="text-sm font-semibold text-neutral-200">Research plan</h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Atlas will run these steps, then hand you a live model.
                </p>
                <ol className="mt-4 space-y-2">
                  {RESEARCH_PLAN.map((item, i) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/10 text-[11px] text-sky-300">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* nav */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Back
        </button>
        {step < last ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(last, s + 1))}
            className="rounded-lg border border-sky-500/50 bg-sky-500/15 px-5 py-2 text-sm font-medium text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-colors hover:bg-sky-500/25"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-lg border border-emerald-500/50 bg-emerald-500/15 px-5 py-2 text-sm font-medium text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-colors hover:bg-emerald-500/25"
          >
            Execute research plan →
          </button>
        )}
      </div>
    </div>
  );
}
