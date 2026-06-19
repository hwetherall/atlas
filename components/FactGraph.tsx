"use client";

import { motion } from "framer-motion";
import type { NodeKind } from "@/lib/schema";
import { formatEUR, formatPct } from "@/lib/format";
import type { GraphModel, GraphNode } from "@/lib/graph";

// ─────────────────────────────────────────────────────────────────────────────
// FactGraph — hand-rolled SVG of the typed DAG (CLAUDE.md §2): sourced leaf
// facts on the left fan into scope factors, which roll up the funnel spine into
// TAM → SAM → YAM. Edges are SVG paths; nodes are HTML cards in foreignObjects
// so everything scales together via the viewBox (hero large, panel small).
//
// Pure presentational — it takes a derived GraphModel and a variant. The "panel"
// variant is static (re-derives on every lever change), "hero" plays the reveal.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  model: GraphModel;
  variant?: "hero" | "panel";
}

// Reuse the kind palette from the facts ledger so badges read consistently.
const KIND_STYLE: Record<NodeKind, string> = {
  extracted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  estimated: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  calculated: "border-violet-500/40 bg-violet-500/10 text-violet-200",
  assumption: "border-amber-500/40 bg-amber-500/10 text-amber-200",
};

const NODE_W = 168;
const NODE_H = 38;
const OUT_W = 158;
const OUT_H = 66;

function isOutput(id: string): boolean {
  return id.startsWith("out.");
}

function dims(node: GraphNode): { w: number; h: number } {
  return isOutput(node.id) ? { w: OUT_W, h: OUT_H } : { w: NODE_W, h: NODE_H };
}

function valueText(node: GraphNode): string {
  if (node.unit === "EUR_M") return formatEUR(node.value);
  if (node.unit === "ratio") return formatPct(node.value, node.value < 0.1 ? 1 : 0);
  return `${node.value}`;
}

// Column index drives the reveal stagger (left fans in first).
function columnOf(x: number): number {
  if (x < 300) return 0;
  if (x < 650) return 1;
  if (x < 920) return 2;
  if (x < 1150) return 3;
  return 4;
}

export default function FactGraph({ model, variant = "panel" }: Props) {
  const { nodes, edges, width, height } = model;
  const animate = variant === "hero";
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // Edge path from the right edge of `from` to the left edge of `to`.
  function edgePath(fromId: string, toId: string): string | null {
    const a = byId.get(fromId);
    const b = byId.get(toId);
    if (!a || !b) return null;
    const sx = a.x + dims(a).w / 2;
    const sy = a.y;
    const tx = b.x - dims(b).w / 2;
    const ty = b.y;
    const mx = (sx + tx) / 2;
    return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;
  }

  const lastColDelay = 4 * 0.12;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full min-w-[680px]"
        role="img"
        aria-label="Fact graph: sourced facts rolling up into TAM, SAM and YAM"
      >
        {/* edges */}
        <g fill="none">
          {edges.map((e, i) => {
            const d = edgePath(e.from, e.to);
            if (!d) return null;
            return (
              <motion.path
                key={e.id}
                d={d}
                stroke={e.dimmed ? "rgba(255,255,255,0.05)" : "rgba(148,197,255,0.28)"}
                strokeWidth={1.5}
                initial={animate ? { pathLength: 0, opacity: 0 } : false}
                animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
                transition={
                  animate
                    ? { pathLength: { delay: lastColDelay + 0.25 + i * 0.015, duration: 0.5 }, opacity: { delay: lastColDelay + 0.25 + i * 0.015, duration: 0.2 } }
                    : undefined
                }
                style={{ transition: animate ? undefined : "stroke 0.4s ease" }}
              />
            );
          })}
        </g>

        {/* nodes */}
        {nodes.map((n) => {
          const { w, h } = dims(n);
          const out = isOutput(n.id);
          const col = columnOf(n.x);
          return (
            <motion.g
              key={n.id}
              initial={animate ? { opacity: 0 } : false}
              animate={animate ? { opacity: 1 } : undefined}
              transition={animate ? { delay: col * 0.12, duration: 0.4 } : undefined}
              style={{ opacity: animate ? undefined : n.dimmed ? 0.32 : 1, transition: "opacity 0.4s ease" }}
            >
              <foreignObject x={n.x - w / 2} y={n.y - h / 2} width={w} height={h}>
                <div
                  className={`flex h-full w-full flex-col justify-center rounded-md border px-2 backdrop-blur-sm ${KIND_STYLE[n.kind]} ${
                    n.dimmed ? "opacity-40 saturate-50" : ""
                  } ${out ? "items-center shadow-[0_0_22px_rgba(167,139,250,0.25)]" : ""}`}
                  style={out ? { boxShadow: "0 0 22px rgba(167,139,250,0.25)" } : undefined}
                >
                  <span className={`truncate ${out ? "text-center text-[11px] uppercase tracking-wide opacity-80" : "text-[11px] leading-tight"}`}>
                    {n.label}
                  </span>
                  <span className={`font-mono tabular-nums ${out ? "text-[20px] font-semibold leading-tight" : "text-[12px] leading-tight"}`}>
                    {valueText(n)}
                  </span>
                </div>
              </foreignObject>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
