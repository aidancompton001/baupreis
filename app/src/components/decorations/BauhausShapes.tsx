/**
 * Bauhaus Geometric Decoration Primitives
 *
 * 5 SVG shapes for background/overlay decorations.
 * All: pointer-events-none, aria-hidden, absolute positioning via className.
 * Colors: #C1292E (red), #1A1A1A (black), #F5C518 (yellow), #BC8279 (salmon), #FFFFFF (white)
 */

type BauColor = "#C1292E" | "#1A1A1A" | "#F5C518" | "#BC8279" | "#FFFFFF";

interface ShapeProps {
  color?: BauColor;
  size?: number;
  opacity?: number;
  className?: string;
}

interface RectProps extends ShapeProps {
  w?: number;
  h?: number;
  rotation?: number;
}

interface TriangleProps extends ShapeProps {
  rotation?: number;
}

interface HalfCircleProps extends ShapeProps {
  rotation?: number;
}

export const BauCircle = ({
  color = "#C1292E",
  size = 200,
  opacity = 0.08,
  className = "",
}: ShapeProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="100" fill={color} opacity={opacity} />
  </svg>
);

export const BauTriangle = ({
  color = "#C1292E",
  size = 120,
  opacity = 0.08,
  rotation = 0,
  className = "",
}: TriangleProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 104"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
    style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
  >
    <polygon points="60,0 120,104 0,104" fill={color} opacity={opacity} />
  </svg>
);

export const BauRect = ({
  color = "#1A1A1A",
  w = 150,
  h = 100,
  opacity = 0.08,
  rotation = 0,
  className = "",
}: RectProps) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
    style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
  >
    <rect width={w} height={h} fill={color} opacity={opacity} />
  </svg>
);

export const BauDiamond = ({
  color = "#F5C518",
  size = 80,
  opacity = 0.08,
  className = "",
}: ShapeProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <polygon points="50,0 100,50 50,100 0,50" fill={color} opacity={opacity} />
  </svg>
);

export const BauHalfCircle = ({
  color = "#C1292E",
  size = 80,
  opacity = 0.1,
  rotation = 0,
  className = "",
}: HalfCircleProps) => (
  <svg
    width={size}
    height={size / 2}
    viewBox="0 0 100 50"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
    style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
  >
    <path d="M0,50 A50,50 0 0,1 100,50 Z" fill={color} opacity={opacity} />
  </svg>
);
