"use client";

import { StockQuote } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";

interface OHLCGridProps {
  quote: StockQuote;
}

export function OHLCGrid({ quote }: OHLCGridProps) {
  const items = [
    { label: "Open", value: formatNumber(quote.open) },
    { label: "High", value: formatNumber(quote.high) },
    { label: "Low", value: formatNumber(quote.low) },
    { label: "Prev Close", value: formatNumber(quote.previousClose) },
    { label: "Volume", value: (quote.volume / 1e6).toFixed(1) + "M" },
    ...(quote.marketCap
      ? [{ label: "Market Cap", value: (quote.marketCap / 1e9).toFixed(1) + "B" }]
      : []),
    ...(quote.pe ? [{ label: "P/E", value: quote.pe.toFixed(1) }] : []),
    ...(quote.pb ? [{ label: "P/B", value: quote.pb.toFixed(1) }] : []),
    ...(quote.fiftyTwoWeekHigh
      ? [{ label: "52W High", value: formatNumber(quote.fiftyTwoWeekHigh) }]
      : []),
    ...(quote.fiftyTwoWeekLow
      ? [{ label: "52W Low", value: formatNumber(quote.fiftyTwoWeekLow) }]
      : []),
  ];

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                {item.label}
              </div>
              <div className="text-sm font-semibold text-white font-mono mt-0.5 tabular-nums">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
