interface LogoMarkProps {
  className?: string;
}

/**
 * Isotipo de la marca: monograma "J" en una insignia redondeada azul
 * oscuro, estilo neobanco. Colores fijos (no depende del tema).
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="Isotipo de JuliusCapital"
    >
      <rect width="32" height="32" rx="8" fill="#0E2A47" />
      <text
        x="16"
        y="22.5"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="18"
        fill="#FFFFFF"
      >
        J
      </text>
    </svg>
  );
}
