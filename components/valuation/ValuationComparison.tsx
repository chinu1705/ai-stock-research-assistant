"use client";

import { ValuationResult } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn, getSignalBg, formatCurrency } from "@/lib/utils";
import { Target, BarChart3, Layers } from "lucide-react";

interface ValuationComparisonProps {
  result: ValuationResult;
  currency?: string;
}

export function ValuationComparison({ result, currency = "USD" }: ValuationComparisonProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono flex items-center justify-center gap-1.5">
              <Target className="w-3 h-3" />
              DCF Fair Value
            </p>
            <p className="text-xl font-bold text-white font-mono tabular-nums">
              {formatCurrency(result.dcf.fairValuePerShare, currency)}
            </p>
            <p
              className={cn(
                "text-[11px] font-medium mt-1 font-mono",
                result.dcf.signal === "undervalued"
                  ? "text-emerald-400"
                  : result.dcf.signal === "overvalued"
                    ? "text-red-400"
                    : "text-amber-400"
              )}
            >
              {result.dcf.marginOfSafety} margin of safety
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono flex items-center justify-center gap-1.5">
              <BarChart3 className="w-3 h-3" />
              Relative Value
            </p>
            <p className="text-xl font-bold text-white font-mono tabular-nums">
              {formatCurrency(result.relativeValuation.impliedValue, currency)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              {result.relativeValuation.premium} vs peers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono flex items-center justify-center gap-1.5">
              <Layers className="w-3 h-3" />
              Blended Fair Value
            </p>
            <p className="text-xl font-bold text-blue-400 font-mono tabular-nums">
              {formatCurrency(result.consensus.blended, currency)}
            </p>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-semibold uppercase mt-1 inline-block font-mono",
                getSignalBg(result.consensus.recommendation)
              )}
            >
              {result.consensus.recommendation}
            </span>
          </CardContent>
        </Card>
      </div>

      {result.relativeValuation.peers.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Peer Valuation Comparison
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="text-left px-4 py-2 text-[10px] text-slate-500 uppercase">Company</th>
                  <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase">P/E</th>
                  <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase">P/B</th>
                  <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase">EV/EBITDA</th>
                </tr>
              </thead>
              <tbody>
                {result.relativeValuation.peers.map((peer) => (
                  <tr key={peer.ticker} className="border-b border-[#1e293b]/50">
                    <td className="px-4 py-2 text-white font-semibold">
                      {peer.ticker}
                      <span className="text-slate-500 ml-1 text-[10px]">{peer.name}</span>
                    </td>
                    <td className="text-right px-4 py-2 text-slate-300 tabular-nums">{peer.pe.toFixed(1)}x</td>
                    <td className="text-right px-4 py-2 text-slate-300 tabular-nums">{peer.pb.toFixed(1)}x</td>
                    <td className="text-right px-4 py-2 text-slate-300 tabular-nums">{peer.evEbitda.toFixed(1)}x</td>
                  </tr>
                ))}
                <tr className="bg-[#0d1117] font-semibold">
                  <td className="px-4 py-2 text-white">Average</td>
                  <td className="text-right px-4 py-2 text-white tabular-nums">{result.relativeValuation.averagePe.toFixed(1)}x</td>
                  <td className="text-right px-4 py-2 text-white">—</td>
                  <td className="text-right px-4 py-2 text-white">—</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
