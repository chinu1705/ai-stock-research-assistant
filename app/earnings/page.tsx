"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Search, TrendingUp, TrendingDown } from "lucide-react";

interface EarningsData {
  ticker: string;
  earningsDate: string | null;
  epsForward: number | null;
  trailingPE: number | null;
  lastReport?: {
    epsEstimate: number;
    epsActual: number;
    surprise?: number;
    reportDate?: string;
  };
}

export default function EarningsPage() {
  const [search, setSearch] = useState("");
  const [lookupResult, setLookupResult] = useState<EarningsData | null>(null);
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!search.trim()) return;
    setLooking(true);
    setError(null);
    setLookupResult(null);
    try {
      const res = await fetch(`/api/earnings?ticker=${search.trim().toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setLookupResult(data);
      } else {
        setError("Ticker not found");
      }
    } catch {
      setError("Failed to fetch earnings data");
    } finally {
      setLooking(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Earnings Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Look up any stock&apos;s earnings date, EPS estimates, and historical surprises.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLookup(); }} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            placeholder="RELIANCE.NS, TSLA, INFY.NS..."
            className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#1e293b] rounded-md text-xs font-mono text-white focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-600"
          />
          <Button type="submit" disabled={looking}>
            <Search className="w-3.5 h-3.5 mr-1.5" />
            {looking ? "Looking..." : "Lookup"}
          </Button>
        </form>

        {error && (
          <div className="text-center py-8 bg-[#111827] border border-[#1e293b] rounded-lg">
            <Calendar className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-red-400 font-mono">{error}</p>
          </div>
        )}

        {lookupResult && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {lookupResult.ticker} — Earnings Data
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                      Next Earnings
                    </div>
                    <div className="text-sm text-white font-mono">
                      {lookupResult.earningsDate || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                      Forward EPS
                    </div>
                    <div className="text-sm text-white font-mono">
                      {lookupResult.epsForward != null ? `$${lookupResult.epsForward.toFixed(2)}` : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                      Trailing P/E
                    </div>
                    <div className="text-sm text-white font-mono">
                      {lookupResult.trailingPE != null ? `${lookupResult.trailingPE.toFixed(1)}x` : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                      Last Report
                    </div>
                    {lookupResult.lastReport ? (
                      <div className="text-sm font-mono">
                        <span className={lookupResult.lastReport.epsActual >= lookupResult.lastReport.epsEstimate ? "text-emerald-400" : "text-red-400"}>
                          {lookupResult.lastReport.epsActual >= lookupResult.lastReport.epsEstimate ? (
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 inline mr-1" />
                          )}
                          ${lookupResult.lastReport.epsActual.toFixed(2)}
                        </span>
                        <span className="text-slate-500 text-[10px] ml-1">vs ${lookupResult.lastReport.epsEstimate.toFixed(2)} est</span>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 font-mono">N/A</div>
                    )}
                  </div>
                </div>

                {lookupResult.lastReport && (
                  <div className="mt-4 pt-3 border-t border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <Badge variant={lookupResult.lastReport.epsActual >= lookupResult.lastReport.epsEstimate ? "success" : "danger"}>
                        {lookupResult.lastReport.epsActual >= lookupResult.lastReport.epsEstimate ? "BEAT" : "MISSED"}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-mono">
                        EPS surprise: {lookupResult.lastReport.epsActual >= lookupResult.lastReport.epsEstimate ? "+" : ""}
                        {lookupResult.lastReport.surprise !== undefined
                          ? `${lookupResult.lastReport.surprise.toFixed(1)}%`
                          : `${((lookupResult.lastReport.epsActual - lookupResult.lastReport.epsEstimate) / Math.abs(lookupResult.lastReport.epsEstimate) * 100).toFixed(1)}%`
                        }
                      </span>
                      {lookupResult.lastReport.reportDate && (
                        <span className="text-[10px] text-slate-600 font-mono ml-auto">
                          {lookupResult.lastReport.reportDate}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!lookupResult && !error && !looking && (
          <div className="text-center py-20">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-mono">
              Enter a stock ticker above to look up earnings data.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
