"use client";

import { StockQuote } from "@/types";
import { formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Radio } from "lucide-react";

interface PriceHeaderProps {
  quote: StockQuote;
}

export function PriceHeader({ quote }: PriceHeaderProps) {
  const isPositive = quote.change >= 0;

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white font-mono">
              {quote.symbol}
            </h1>
            <span className="px-2 py-0.5 bg-[#1e293b] rounded text-[10px] font-mono text-slate-400 uppercase">
              {quote.exchange}
            </span>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono uppercase">Live</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">{quote.name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white font-mono tabular-nums">
            {formatCurrency(quote.price, quote.currency)}
          </div>
          <div className={`flex items-center gap-2 justify-end font-mono ${getChangeColor(quote.change)}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span className="font-semibold text-sm">
              {isPositive ? "+" : ""}
              {quote.change.toFixed(2)}
            </span>
            <span className="text-xs">
              ({formatPercent(quote.changePercent)})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
