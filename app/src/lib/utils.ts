import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, unit: string, locale: string = "de-DE"): string {
  const n = Number(price);
  return `${n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${unit}`;
}

export function formatPercent(value: number | string): string {
  const n = Number(value);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function formatDate(date: string | Date, locale: string = "de-DE"): string {
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getTrendArrow(trend: string): string {
  switch (trend) {
    case "rising":
      return "\u2191";
    case "falling":
      return "\u2193";
    default:
      return "\u2192";
  }
}

export function getTrendColor(trend: string): string {
  switch (trend) {
    case "rising":
      return "text-red-500";
    case "falling":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}
