import type { Ledger } from "@/lib/schema";
import { baselineScenario } from "@/lib/compute";
import { deriveGraph } from "@/lib/graph";

// ─────────────────────────────────────────────────────────────────────────────
// ledger.md §6.1 — Lineage of a fact.
//
// Pure, read-only, node-addressable. Reuses the real DAG adjacency from
// deriveGraph() (CLAUDE.md §2) rather than hardcoding a parallel one. Downstream
// is transitive forward-reachability over the funnel edges; upstream is the
// base a fact derives from.
//
// Synthetic spine nodes (scope factors, TAM/SAM/YAM) carry the graph's friendly
// labels ("Geography mix", "TAM", …). The inspector decides which chips are
// clickable (only real ledger nodes navigate).
// ─────────────────────────────────────────────────────────────────────────────

export interface NodeRef {
  id: string;
  label: string;
}

export interface Lineage {
  upstream: NodeRef[];
  downstream: NodeRef[];
}

function pushInto(map: Map<string, string[]>, key: string, value: string): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

// Breadth-first reachability over `adj`, in adjacency order, excluding `start`.
function reach(start: string, adj: Map<string, string[]>, ref: (id: string) => NodeRef): NodeRef[] {
  const out: NodeRef[] = [];
  const seen = new Set<string>([start]);
  let frontier = [start];
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const cur of frontier) {
      for (const nb of adj.get(cur) ?? []) {
        if (seen.has(nb)) continue;
        seen.add(nb);
        out.push(ref(nb));
        next.push(nb);
      }
    }
    frontier = next;
  }
  return out;
}

export function lineageOf(ledger: Ledger, id: string): Lineage {
  const node = ledger.find((n) => n.id === id);
  // Shape facts are display-only context — consumed by the shape strip, not the
  // funnel — so they have no funnel lineage (§6.1).
  if (!node || id.startsWith("shape.")) {
    return { upstream: [], downstream: [] };
  }

  const graph = deriveGraph(ledger, baselineScenario(ledger));
  const labelById = new Map(graph.nodes.map((n) => [n.id, n.label] as const));
  const ref = (nid: string): NodeRef => ({ id: nid, label: labelById.get(nid) ?? nid });

  const fwd = new Map<string, string[]>();
  const bwd = new Map<string, string[]>();
  for (const e of graph.edges) {
    pushInto(fwd, e.from, e.to);
    pushInto(bwd, e.to, e.from);
  }

  const downstream = reach(id, fwd, ref);

  // Share leaves (geo.* / seg.* / cust.*) apportion the market base. In the graph
  // they feed a scope factor that is a *co-input* to TAM alongside tamBase — not a
  // child of it — so surface tamBase as their upstream explicitly (§6.1). Other
  // leaves (tamBase, the assumption factors) have no upstream.
  const upstream = node.dimension ? [ref("tamBase")] : reach(id, bwd, ref);

  return { upstream, downstream };
}
