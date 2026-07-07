"use client";

// A small toggle chip for kind / confidence filters — shared by the dashboard
// facts ledger and the fact-bank table. `className` carries the badge triad
// (KIND_STYLE / CONFIDENCE_STYLE); inactive chips dim and strike.
export default function FilterChip({
  label,
  active,
  className,
  onClick,
}: {
  label: string;
  active: boolean;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-opacity ${className} ${
        active ? "" : "opacity-30 line-through"
      }`}
    >
      {label}
    </button>
  );
}
