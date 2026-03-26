/**
 * Bauhaus Composed Decorations
 *
 * Pre-built compositions from BauhausShapes primitives.
 * All: pointer-events-none, aria-hidden.
 */

interface CompositionProps {
  className?: string;
  opacity?: number;
}

/** Corner decoration: red circle + black triangle + yellow square */
export const CompositionCornerTL = ({ className = "", opacity = 0.08 }: CompositionProps) => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <circle cx="40" cy="40" r="60" fill="#C1292E" opacity={opacity} />
    <polygon points="100,20 180,140 20,140" fill="#1A1A1A" opacity={opacity * 0.8} />
    <rect x="140" y="10" width="40" height="40" fill="#F5C518" opacity={opacity * 1.2} />
  </svg>
);

/** Corner decoration: yellow triangle + red half-circle */
export const CompositionCornerBR = ({ className = "", opacity = 0.08 }: CompositionProps) => (
  <svg
    width="180"
    height="180"
    viewBox="0 0 180 180"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <polygon points="180,180 80,180 180,80" fill="#F5C518" opacity={opacity} />
    <path d="M0,180 A90,90 0 0,1 90,90 L0,90 Z" fill="#C1292E" opacity={opacity * 0.9} />
  </svg>
);

/** Full-width stripe of alternating triangles, h=24 */
export const CompositionStripe = ({ className = "" }: CompositionProps) => (
  <div className={`w-full overflow-hidden ${className}`} style={{ zIndex: 1 }} aria-hidden="true">
    <svg
      width="100%"
      height="24"
      viewBox="0 0 480 24"
      preserveAspectRatio="none"
      className="pointer-events-none w-full"
    >
      <defs>
        <pattern id="bau-stripe" x="0" y="0" width="72" height="24" patternUnits="userSpaceOnUse">
          <polygon points="0,24 12,0 24,24" fill="#C1292E" />
          <polygon points="24,24 36,0 48,24" fill="#F5C518" />
          <polygon points="48,24 60,0 72,24" fill="#1A1A1A" />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill="url(#bau-stripe)" />
    </svg>
  </div>
);

/** Tiling grid pattern for backgrounds */
export const CompositionGrid = ({ className = "", opacity = 0.03 }: CompositionProps) => (
  <svg
    className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    aria-hidden="true"
    style={{ opacity }}
  >
    <defs>
      <pattern id="bau-comp-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="12" height="12" fill="#C1292E" opacity="0.6" />
        <rect x="60" y="60" width="12" height="12" fill="#1A1A1A" opacity="0.5" />
        <circle cx="120" cy="0" r="3" fill="#F5C518" opacity="0.7" />
        <circle cx="0" cy="120" r="3" fill="#C1292E" opacity="0.5" />
        <polygon points="90,20 100,40 80,40" fill="#1A1A1A" opacity="0.4" />
        <polygon points="30,80 40,100 20,100" fill="#F5C518" opacity="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bau-comp-grid)" />
  </svg>
);
