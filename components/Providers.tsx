"use client";

import { TickerProvider } from "@/contexts/TickerContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TickerProvider>{children}</TickerProvider>;
}
