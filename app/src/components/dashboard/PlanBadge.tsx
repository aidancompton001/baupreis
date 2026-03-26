"use client";

interface PlanBadgeProps {
  plan: "Pro" | "Team";
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const colors =
    plan === "Pro"
      ? "bg-[#F5C518]/20 text-[#1A1A1A]"
      : "bg-[#BC8279]/20 text-[#BC8279]";

  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors}`}
    >
      {plan}
    </span>
  );
}
