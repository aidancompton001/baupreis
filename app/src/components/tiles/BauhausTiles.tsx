/**
 * Bauhaus Visual Language — Full-Color Tile Library
 *
 * 12 modular SVG tiles (200×200 viewBox), 100% opacity.
 * Based on Brand Identity Visual Language grid.
 * Colors: #C1292E (red), #1A1A1A (black), #F5C518 (yellow), #FFFFFF (white)
 *
 * Usage: import { TileCircleOnBlack } from "@/components/tiles"
 */

interface TileProps {
  size?: number;
  className?: string;
}

/** T01: Red circle centered on black background */
export const TileCircleOnBlack = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#1A1A1A" />
    <circle cx="100" cy="100" r="80" fill="#C1292E" />
  </svg>
);

/** T02: Diagonal split — yellow top-left, black bottom-right */
export const TileDiagYellowBlack = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <polygon points="0,0 200,0 0,200" fill="#F5C518" />
    <polygon points="200,0 200,200 0,200" fill="#1A1A1A" />
  </svg>
);

/** T03: Diagonal split — red top-left, yellow bottom-right */
export const TileRedYellowSplit = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <polygon points="0,0 200,0 0,200" fill="#C1292E" />
    <polygon points="200,0 200,200 0,200" fill="#F5C518" />
  </svg>
);

/** T04: White triangle on black */
export const TileTriWhiteOnBlack = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#1A1A1A" />
    <polygon points="100,30 170,170 30,170" fill="#FFFFFF" />
  </svg>
);

/** T05: Yellow bottom-left triangle + black top-right triangle */
export const TileYellowBlackTriangles = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <polygon points="0,0 200,200 0,200" fill="#F5C518" />
    <polygon points="0,0 200,0 200,200" fill="#1A1A1A" />
  </svg>
);

/** T06: Red half-circle (right) on yellow background */
export const TileHalfCircleRedYellow = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#F5C518" />
    <path d="M200,20 A80,80 0 0,0 200,180 Z" fill="#C1292E" />
  </svg>
);

/** T07: Red background with black triangle in top-left corner */
export const TileRedBlackCorner = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#C1292E" />
    <polygon points="0,0 200,0 0,200" fill="#1A1A1A" />
  </svg>
);

/** T08: Yellow top-left + red bottom-right diagonal */
export const TileYellowRedDiag = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <polygon points="0,0 200,0 0,200" fill="#F5C518" />
    <polygon points="200,0 200,200 0,200" fill="#C1292E" />
  </svg>
);

/** T09: Black background, yellow quarter (top-right) */
export const TileBlackYellowQuarter = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#1A1A1A" />
    <rect x="100" y="0" width="100" height="100" fill="#F5C518" />
  </svg>
);

/** T10: Red square centered on white */
export const TileRedOnWhite = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#FFFFFF" />
    <rect x="40" y="40" width="120" height="120" fill="#C1292E" />
  </svg>
);

/** T11: Red circle on yellow */
export const TileCircleOnYellow = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#F5C518" />
    <circle cx="100" cy="100" r="70" fill="#C1292E" />
  </svg>
);

/** T12: Black triangle on yellow */
export const TileBlackTriYellow = ({ size = 200, className = "" }: TileProps) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
    <rect width="200" height="200" fill="#F5C518" />
    <polygon points="100,30 170,170 30,170" fill="#1A1A1A" />
  </svg>
);
