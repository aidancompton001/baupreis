/**
 * Bauhaus Grid — 3×3 composition from tiles
 *
 * Renders a grid of 9 Bauhaus tiles. Responsive:
 * - Mobile (375): 1 column
 * - Tablet (768): 2 columns
 * - Desktop (1440): 3 columns
 */

import {
  TileCircleOnBlack,
  TileDiagYellowBlack,
  TileRedYellowSplit,
  TileTriWhiteOnBlack,
  TileYellowBlackTriangles,
  TileHalfCircleRedYellow,
  TileRedBlackCorner,
  TileYellowRedDiag,
  TileBlackYellowQuarter,
} from "./BauhausTiles";
import type { ReactNode } from "react";

interface BauhausGridProps {
  /** Override the 9 tiles (pass JSX elements) */
  children?: ReactNode;
  /** Tile size in px (each cell) */
  tileSize?: number;
  /** Additional CSS classes */
  className?: string;
}

/** Default 3×3 composition matching the Brand Identity Visual Language */
const DEFAULT_GRID = [
  TileRedBlackCorner,
  TileDiagYellowBlack,
  TileRedYellowSplit,
  TileYellowBlackTriangles,
  TileTriWhiteOnBlack,
  TileCircleOnBlack,
  TileHalfCircleRedYellow,
  TileYellowRedDiag,
  TileBlackYellowQuarter,
];

export const BauhausGrid = ({
  children,
  tileSize = 200,
  className = "",
}: BauhausGridProps) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 ${className}`}
    aria-hidden="true"
    style={{ width: "fit-content" }}
  >
    {children ||
      DEFAULT_GRID.map((Tile, i) => <Tile key={i} size={tileSize} />)}
  </div>
);
