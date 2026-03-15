"use client";

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ category, size = 20, className = "" }: CategoryIconProps) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };

  switch (category) {
    case "steel":
      // I-beam profile
      return (
        <svg {...props}>
          <path d="M4 4h16M4 20h16M10 4v16M14 4v16M7 4v2M17 4v2M7 18v2M17 18v2" />
        </svg>
      );
    case "metal":
      // Ingot/cube
      return (
        <svg {...props}>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case "concrete":
      // Brick/block
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="5" x2="12" y2="12" />
          <line x1="7" y1="12" x2="7" y2="19" />
          <line x1="17" y1="12" x2="17" y2="19" />
        </svg>
      );
    case "wood":
      // Log/plank
      return (
        <svg {...props}>
          <path d="M3 6h18v12H3zM7 6v12M11 6v12M15 6v12M19 6v12" />
          <path d="M3 6c0-1 1-2 2-2h14c1 0 2 1 2 2" />
        </svg>
      );
    case "insulation":
      // Layers
      return (
        <svg {...props}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 12l10 5 10-5" />
          <path d="M2 17l10 5 10-5" />
        </svg>
      );
    case "energy":
      // Lightning bolt
      return (
        <svg {...props}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" strokeWidth={0} />
        </svg>
      );
    default:
      // Generic circle
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
