interface LogoMarkProps {
  className?: string;
  accent?: boolean;
}

/**
 * Isotipo de JuliusCapital: una "J" geométrica de trazo único.
 * El trazo usa currentColor para funcionar sobre fondo claro u oscuro;
 * el punto final es un acento dorado opcional.
 */
export function LogoMark({ className, accent = true }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="JuliusCapital"
    >
      <path
        d="M39 9 L39 35 A15 15 0 0 1 24 50"
        stroke="currentColor"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {accent ? <circle cx="24" cy="50" r="5.5" fill="#C9A44C" /> : null}
    </svg>
  );
}
