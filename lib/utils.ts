export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  if (currency === "INR" || currency === "₹") {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)} L`;
    return `₹${value.toFixed(2)}`;
  }
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-emerald-600 dark:text-emerald-400";
  if (change < 0) return "text-red-600 dark:text-red-400";
  return "text-gray-600 dark:text-gray-400";
}

export function getChangeBg(change: number): string {
  if (change > 0) return "bg-emerald-50 dark:bg-emerald-950/30";
  if (change < 0) return "bg-red-50 dark:bg-red-950/30";
  return "bg-gray-50 dark:bg-gray-950/30";
}

export function getSignalColor(signal: string): string {
  switch (signal.toLowerCase()) {
    case "buy":
    case "strong_buy":
    case "bullish":
      return "text-emerald-600 dark:text-emerald-400";
    case "sell":
    case "strong_sell":
    case "bearish":
      return "text-red-600 dark:text-red-400";
    case "hold":
    case "neutral":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function getSignalBg(signal: string): string {
  switch (signal.toLowerCase()) {
    case "buy":
    case "strong_buy":
    case "bullish":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300";
    case "sell":
    case "strong_sell":
    case "bearish":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    case "hold":
    case "neutral":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
  }
}

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCurrencyFromTicker(ticker: string): string {
  const upper = ticker.toUpperCase();
  if (upper.endsWith(".NS") || upper.endsWith(".BO")) return "INR";
  return "USD";
}
