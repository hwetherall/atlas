"use client";

import { BOUNDARY_EXCLUSIONS } from "@/lib/boundary";

// §3.3 — read-only "what's excluded and why". Boundary levers (which would
// change what's in the ledger) are v2; this is the seam where Risk Seek plugs in.
export default function BoundaryPanel() {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-200">What&apos;s excluded — and why</h2>
        <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-500">
          read-only · v2 boundary levers
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {BOUNDARY_EXCLUSIONS.map((e) => (
          <li key={e.item} className="text-sm">
            <span className="text-neutral-200">{e.item}</span>
            <span className="text-neutral-500"> — {e.reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
