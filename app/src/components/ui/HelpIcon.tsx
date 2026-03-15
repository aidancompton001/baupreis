"use client";

import Tooltip from "./Tooltip";

interface HelpIconProps {
  text: string;
}

export default function HelpIcon({ text }: HelpIconProps) {
  return (
    <Tooltip content={text}>
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] font-medium cursor-help hover:border-brand-600 hover:text-brand-600 transition-colors">
        ?
      </span>
    </Tooltip>
  );
}
