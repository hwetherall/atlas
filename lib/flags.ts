// Feature flags. Flip a value to false to remove the surface in one line
// (CLAUDE.md §5.6 — the tornado must be hideable for demo day if not solid).
export const FLAGS = {
  tornado: true,
  // The guided demo intro (wizard → thinking → graph reveal). Flip to false to
  // boot straight to the dashboard during development.
  intro: true,
} as const;
