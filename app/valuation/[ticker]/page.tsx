"use client";

import { useState, use, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DCFCalculator } from "@/components/valuation/DCFCalculator";
import { SensitivityTable } from "@/components/valuation/SensitivityTable";
import { ValuationComparison } from "@/components/valuation/ValuationComparison";
import { Spinner } from "@/components/ui/Spinner";
import { ValuationResult, DCFAssumptions } from "@/types";
import { getCurrencyFromTicker } from "@/lib/utils";
import { Calculator, Table2 } from "lucide-react";

export default function ValuationPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = use(params);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [derivedAssumptions, setDerivedAssumptions] = useState<{
    revenueGrowth: number | null;
    operatingMargin: number | null;
    capexPercent: number | null;
    beta: number | null;
    discountRate: number | null;
    freeCashFlow: number;
    totalRevenue: number | null;
    sharesOutstanding: number;
  } | null>(null);

  const handleCalculate = async (assumptions: DCFAssumptions) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker,
          assumptions: {
            revenueGrowthRate: assumptions.revenueGrowthRate / 100,
            terminalGrowthRate: assumptions.terminalGrowthRate / 100,
            discountRate: assumptions.discountRate / 100,
            marginExpansion: assumptions.marginExpansion / 100,
            capexPercent: assumptions.capexPercent / 100,
            operatingMargin: assumptions.operatingMargin / 100,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        if (data.derivedAssumptions) {
          setDerivedAssumptions(data.derivedAssumptions);
        }
      } else {
        setError("Failed to calculate valuation");
      }
    } catch {
      setError("Failed to calculate valuation");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPopulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        if (data.derivedAssumptions) {
          setDerivedAssumptions(data.derivedAssumptions);
        }
      } else {
        setError("Failed to calculate valuation");
      }
    } catch {
      setError("Failed to calculate valuation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAutoPopulate();
  }, [ticker]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            DCF Valuation: {ticker.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Discounted Cash Flow model with sensitivity analysis and peer comparison.
          </p>
        </div>

        <DCFCalculator
          onCalculate={handleCalculate}
          loading={loading}
          derivedAssumptions={derivedAssumptions}
        />

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-xs text-slate-500 mt-4 font-mono">Running DCF model...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-xs font-mono">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4">
            <ValuationComparison result={result} currency={getCurrencyFromTicker(ticker)} />
            {result.dcf.sensitivityTable && (
              <SensitivityTable table={result.dcf.sensitivityTable} />
            )}
            <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Table2 className="w-3.5 h-3.5" />
                5-Year FCF Projections
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1e293b]">
                      <th className="text-left px-4 py-2 text-[10px] text-slate-500 uppercase">Year</th>
                      <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase">Revenue</th>
                      <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase">Free Cash Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.dcf.projectionYears.map((yr) => (
                      <tr key={yr.year} className="border-b border-[#1e293b]/50">
                        <td className="px-4 py-2 text-white">Year {yr.year}</td>
                        <td className="text-right px-4 py-2 text-slate-300 tabular-nums">
                          {getCurrencyFromTicker(ticker) === "INR" ? "₹" : "$"}{(yr.revenue / 1e9).toFixed(1)}B
                        </td>
                        <td className="text-right px-4 py-2 text-slate-300 tabular-nums">
                          {getCurrencyFromTicker(ticker) === "INR" ? "₹" : "$"}{(yr.fcf / 1e9).toFixed(1)}B
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
