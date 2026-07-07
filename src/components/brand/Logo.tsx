import { clsx } from "clsx";

import { LogoMark } from "@/components/brand/LogoMark";

interface LogoProps {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}

export function Logo({ className, markClassName, showTagline = false }: LogoProps) {
  return (
    <div className={clsx("flex items-center gap-2.5", className)}>
      <LogoMark className={clsx("size-8 shrink-0 text-brand-900 dark:text-brand-100", markClassName)} />
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight text-content">
          Julià Regader
        </span>
        {showTagline ? (
          <span className="text-xs font-medium text-content-muted">
            Entiende. Organiza. Decide.
          </span>
        ) : null}
      </div>
    </div>
  );
}
