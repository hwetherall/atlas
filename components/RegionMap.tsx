"use client";

import { useMemo } from "react";
import type { Ledger } from "@/lib/schema";
import { GEOGRAPHIES } from "@/lib/dimensions";

interface Props {
  ledger: Ledger;
  selected: string[];
  onToggle: (value: string) => void;
}

// Hand-rolled, stylized polygons for Central Europe — positioned roughly
// geographically (x = east, y = south). No map library, no 3D (CLAUDE.md §5.2).
// 'other' has no shape and is toggled via the Geography control instead.
interface Shape {
  value: string;
  points: string;
  labelX: number;
  labelY: number;
}

const SHAPES: Shape[] = [
  { value: "NL", points: "58,52 96,48 102,76 70,86 54,74", labelX: 78, labelY: 68 },
  { value: "DE", points: "98,80 162,70 178,96 170,152 128,166 104,140 92,106", labelX: 132, labelY: 118 },
  { value: "PL", points: "182,68 262,62 278,112 250,144 196,132 178,100", labelX: 226, labelY: 102 },
  { value: "FR", points: "18,150 72,140 82,182 76,244 38,262 14,212", labelX: 46, labelY: 200 },
  { value: "CZ", points: "150,152 212,142 222,172 176,188 144,172", labelX: 182, labelY: 166 },
  { value: "CH", points: "92,182 140,176 146,206 108,218 86,202", labelX: 114, labelY: 198 },
  { value: "AT", points: "140,192 216,180 226,208 160,218 134,206", labelX: 182, labelY: 200 },
];

export default function RegionMap({ ledger, selected, onToggle }: Props) {
  const { shareOf, label } = useMemo(() => {
    const shareOf = new Map<string, number>();
    const label = new Map<string, string>();
    for (const n of ledger) {
      if (n.dimension === "geography" && n.dimensionValue) {
        shareOf.set(n.dimensionValue, n.value);
        label.set(n.dimensionValue, n.label);
      }
    }
    return { shareOf, label };
  }, [ledger]);

  const maxShare = Math.max(...SHAPES.map((s) => shareOf.get(s.value) ?? 0), 0.0001);
  const selectedSet = new Set(selected);

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <h2 className="text-sm font-semibold text-neutral-200">Geography</h2>
      <p className="mt-0.5 text-xs text-neutral-500">
        Shaded by market intensity. Click a country to include / exclude it.
      </p>

      <svg
        viewBox="0 0 300 290"
        className="mt-3 w-full"
        role="group"
        aria-label="Central Europe market intensity map"
      >
        {SHAPES.map((s) => {
          const share = shareOf.get(s.value) ?? 0;
          const name = label.get(s.value) ?? s.value;
          const on = selectedSet.has(s.value);
          const intensity = share / maxShare;
          const fill = on
            ? `rgba(56,189,248,${(0.18 + 0.82 * intensity).toFixed(3)})`
            : "rgba(120,120,130,0.10)";
          return (
            <g key={s.value}>
              <polygon
                points={s.points}
                role="checkbox"
                aria-checked={on}
                aria-label={`${name} — ${on ? "included" : "excluded"}`}
                tabIndex={0}
                onClick={() => onToggle(s.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle(s.value);
                  }
                }}
                style={{ fill, cursor: "pointer" }}
                className={[
                  "outline-none transition-[fill] focus-visible:stroke-sky-300",
                  on ? "stroke-sky-400" : "stroke-neutral-600 [stroke-dasharray:3_3]",
                ].join(" ")}
                strokeWidth={1.25}
              />
              <text
                x={s.labelX}
                y={s.labelY}
                textAnchor="middle"
                className={`pointer-events-none select-none text-[10px] font-medium ${on ? "fill-neutral-50" : "fill-neutral-500"}`}
              >
                {s.value}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-6 rounded-sm bg-gradient-to-r from-sky-500/20 to-sky-400" />
          low → high intensity
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 rounded-sm border border-dashed border-neutral-600" />
          excluded
        </span>
      </div>
    </section>
  );
}
