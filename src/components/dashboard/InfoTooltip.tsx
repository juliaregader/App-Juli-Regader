import { Info } from "lucide-react";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="text-content-muted hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-full"
        aria-label={text}
      >
        <Info className="size-3.5" aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-normal normal-case text-content-muted opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
