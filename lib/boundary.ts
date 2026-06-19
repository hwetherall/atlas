// §3.3 — what's deliberately outside the market boundary, and why.
//
// Read-only in v1. Changing these is a *boundary lever* (e.g. "include
// substitutes"), which changes what's in the ledger and requires new research —
// out of scope for v1 (§6). This typed list is the node-addressable seam where
// Risk Seek plugs in later.
export interface BoundaryExclusion {
  item: string;
  reason: string;
}

export const BOUNDARY_EXCLUSIONS: BoundaryExclusion[] = [
  {
    item: "Busbars / busway systems",
    reason:
      "Substitute power-distribution architecture with a different spec and buyer. Including it would expand the TAM but requires a substitution-risk research pass.",
  },
  {
    item: "Power shelves",
    reason:
      "Rack-internal DC distribution — adjacent, but outside the rack-PDU boundary as currently scoped.",
  },
  {
    item: "DC busways",
    reason: "DC-distribution substitute; excluded pending a boundary-lever research pass.",
  },
  {
    item: "Geographies outside Central Europe",
    reason: "Other regions are a separate market-sizing run, not part of this scope.",
  },
];
