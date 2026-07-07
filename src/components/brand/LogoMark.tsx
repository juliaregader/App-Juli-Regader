interface LogoMarkProps {
  className?: string;
}

/**
 * Isotipo de la marca: una aguja de brújula minimalista que a la vez
 * sugiere una estrella del norte de 4 puntas. La punta norte se destaca
 * en el color de acento; el resto usa currentColor para adaptarse al tema.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Isotipo de Julià Regader"
    >
      <path
        d="M24 4 L28.95 19.05 L44 24 L28.95 28.95 L24 44 L19.05 28.95 L4 24 L19.05 19.05 Z"
        fill="currentColor"
      />
      <path
        d="M24 4 L28.95 19.05 L24 24 L19.05 19.05 Z"
        className="fill-brand-500"
      />
      <circle cx="24" cy="24" r="2.75" className="fill-surface" />
    </svg>
  );
}
