/**
 * Bauhaus SVG Pattern Overlay
 *
 * Seamless tiling geometric pattern for section backgrounds.
 * Tile: 120x120px. Variants: sparse (3), medium (5), dense (8) shapes per tile.
 */

interface OverlayProps {
  variant?: "sparse" | "medium" | "dense";
  opacity?: number;
  className?: string;
}

export const BauhausOverlay = ({
  variant = "sparse",
  opacity = 0.05,
  className = "",
}: OverlayProps) => {
  const patternId = `bau-overlay-${variant}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          {/* Sparse: 3 shapes */}
          <polygon points="15,5 25,22 5,22" fill="#C1292E" opacity="0.7" />
          <rect x="70" y="45" width="8" height="8" fill="#1A1A1A" opacity="0.5" />
          <circle cx="40" cy="95" r="4" fill="#F5C518" opacity="0.6" />

          {variant !== "sparse" && (
            <>
              {/* Medium adds 2 more */}
              <rect x="95" y="10" width="6" height="6" fill="#F5C518" opacity="0.4" transform="rotate(45 98 13)" />
              <polygon points="55,70 65,87 45,87" fill="#1A1A1A" opacity="0.3" />
            </>
          )}

          {variant === "dense" && (
            <>
              {/* Dense adds 3 more */}
              <circle cx="100" cy="90" r="3" fill="#C1292E" opacity="0.5" />
              <rect x="10" y="55" width="7" height="7" fill="#BC8279" opacity="0.4" />
              <polygon points="85,55 90,45 95,55" fill="#F5C518" opacity="0.3" />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
