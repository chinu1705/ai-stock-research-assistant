"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface TickerContextType {
  ticker: string;
  setTicker: (t: string) => void;
}

const TickerContext = createContext<TickerContextType>({
  ticker: "AAPL",
  setTicker: () => {},
});

export function TickerProvider({ children }: { children: React.ReactNode }) {
  const [ticker, setTickerState] = useState("AAPL");

  const setTicker = useCallback((t: string) => {
    setTickerState(t.toUpperCase());
  }, []);

  return (
    <TickerContext.Provider value={{ ticker, setTicker }}>
      {children}
    </TickerContext.Provider>
  );
}

export function useTicker() {
  return useContext(TickerContext);
}
