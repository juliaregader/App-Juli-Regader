import { clsx } from "clsx";

import { LogoMark } from "./LogoMark";

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}

export function Logo({ className, markClassName, showWordmark = true }: LogoProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={clsx("h-8 w-8 shrink-0 text-brand-900", markClassName)} />
      {showWordmark ? (
        <span className="font-display text-lg font-bold tracking-tight text-current">
          Julius<span className="font-normal">Capital</span>
        </span>
      ) : null}
    </span>
  );
}
