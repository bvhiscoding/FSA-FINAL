import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "VND"): string {
  if (currency === "VND") {
    if (Math.abs(value) >= 1e12) {
      return `${(value / 1e12).toFixed(2)} nghìn tỷ`;
    }
    if (Math.abs(value) >= 1e9) {
      return `${(value / 1e9).toFixed(1)} tỷ`;
    }
    if (Math.abs(value) >= 1e6) {
      return `${(value / 1e6).toFixed(0)} triệu`;
    }
    return value.toLocaleString("vi-VN") + " VND";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: Math.abs(value) >= 1e6 ? "compact" : "standard",
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("vi-VN", { maximumFractionDigits: decimals });
}

export function getChangeClass(value: number): string {
  if (value > 0) return "text-growth";
  if (value < 0) return "text-decline";
  return "text-muted";
}

export function getChangeBgClass(value: number): string {
  if (value > 0) return "bg-growth";
  if (value < 0) return "bg-decline";
  return "bg-surface-muted";
}
