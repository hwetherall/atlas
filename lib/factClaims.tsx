import type { FactNode, Ledger } from "@/lib/schema";
import { formatEUR, formatNodeValue, formatPct } from "@/lib/format";
import { factEuro } from "@/lib/contribution";

// ─────────────────────────────────────────────────────────────────────────────
// factClaim — the one-sentence plain claim for a fact, shared by FactDetail
// (the dossier headline) and RiskDetail ("the fact we're challenging").
// Dimension shares lead with € — "Germany is a €160M market" answers the
// reader's question; "50%" (of what?) doesn't — with the share kept as the
// supporting clause.
// ─────────────────────────────────────────────────────────────────────────────

export function factClaim(ledger: Ledger, node: FactNode): React.ReactNode {
  const v = <strong className="font-semibold text-ink">{formatNodeValue(node)}</strong>;
  if (node.id === "tamBase")
    return <>The Central Europe rack-PDU market is worth {v} across all segments and buyers.</>;
  if (node.id === "serviceableFactor")
    return <>{v} of TAM is serviceable — reachable through channel and regulatory-clear demand.</>;
  if (node.id === "obtainableFactor")
    return <>{v} of SAM is realistically obtainable in the first 12 months.</>;
  if (node.id === "shape.cagr") return <>The market is growing at {v} CAGR (2025–2030).</>;
  if (node.id === "shape.cr3") return <>The top three suppliers hold {v} of the market.</>;

  const euro = factEuro(ledger, node);
  const base = ledger.find((n) => n.id === "tamBase");
  if (euro !== null && base) {
    const e = <strong className="font-semibold text-ink">{formatEUR(euro)}</strong>;
    const share = `${formatPct(node.value)} of the ${formatEUR(base.value)} Central Europe base`;
    if (node.dimension === "geography")
      return (
        <>
          {node.label} is a {e} market — {share}.
        </>
      );
    if (node.dimension === "segment")
      return (
        <>
          The {node.label} segment is worth {e} — {share}.
        </>
      );
    if (node.dimension === "customerType")
      return (
        <>
          {node.label} buy {e} of the market — {share}.
        </>
      );
  }
  return (
    <>
      {node.label}: {v}.
    </>
  );
}
