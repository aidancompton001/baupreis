"use client";

interface PlanBadgeProps {
  plan: "Pro" | "Team";
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const colors =
    plan === "Pro"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors}`}
    >
      {plan}
    </span>
  );
}
