"use client";

import { useState, useEffect } from "react";
import { DCFAssumptions } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings, Info } from "lucide-react";

interface DerivedAssumptions {
  revenueGrowth: number | null;
  operatingMargin: number | null;
  capexPercent: number | null;
  beta: number | null;
  discountRate: number | null;
  freeCashFlow: number;
  totalRevenue: number | null;
  sharesOutstanding: number;
}

interface DCFCalculatorProps {
  onCalculate: (assumptions: DCFAssumptions) => void;
  loading?: boolean;
  derivedAssumptions?: DerivedAssumptions | null;
}

function getDefaultAssumptions(derived?: DerivedAssumptions | null): DCFAssumptions {
  return {
    revenueGrowthRate: derived?.revenueGrowth != null ? derived.revenueGrowth * 100 : 8,
    terminalGrowthRate: 3,
    discountRate: derived?.discountRate != null ? derived.discountRate * 100 : 10,
    marginExpansion: 0.5,
    capexPercent: derived?.capexPercent != null ? derived.capexPercent * 100 : 5,
    operatingMargin: derived?.operatingMargin != null ? derived.operatingMargin * 100 : 25,
  };
}

export function DCFCalculator({ onCalculate, loading, derivedAssumptions }: DCFCalculatorProps) {
  const [assumptions, setAssumptions] = useState<DCFAssumptions>(() =>
    getDefaultAssumptions(derivedAssumptions)
  );

  useEffect(() => {
    if (derivedAssumptions) {
      setAssumptions(getDefaultAssumptions(derivedAssumptions));
    }
  }, [derivedAssumptions]);

  const handleChange = (field: keyof DCFAssumptions, value: string) => {
    setAssumptions((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const formatValue = (val: number | null | undefined) =>
    val != null ? (val * 100).toFixed(1) : "N/A";

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          DCF Assumptions
        </h3>
        {derivedAssumptions && (
          <p className="text-[10px] text-slate-500 font-mono">
            Auto-populated from {derivedAssumptions.totalRevenue ? "financials" : "market data"}
            {derivedAssumptions.beta != null && ` | Beta: ${derivedAssumptions.beta.toFixed(2)}`}
            {derivedAssumptions.freeCashFlow > 0 && ` | FCF: $${(derivedAssumptions.freeCashFlow / 1e9).toFixed(2)}B`}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: "revenueGrowthRate" as const, label: "Revenue Growth (%)", source: derivedAssumptions?.revenueGrowth },
            { key: "terminalGrowthRate" as const, label: "Terminal Growth (%)", source: null },
            { key: "discountRate" as const, label: "Discount Rate / WACC (%)", source: derivedAssumptions?.discountRate },
            { key: "marginExpansion" as const, label: "Margin Expansion (%/yr)", source: null },
            { key: "capexPercent" as const, label: "CapEx (% of Revenue)", source: derivedAssumptions?.capexPercent },
            { key: "operatingMargin" as const, label: "Operating Margin (%)", source: derivedAssumptions?.operatingMargin },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase tracking-wider">
                {field.label}
                {field.source != null && (
                  <span className="text-blue-400 ml-1" title={`Derived from stock data: ${(field.source * 100).toFixed(1)}%`}>
                    <Info className="w-2.5 h-2.5 inline" />
                  </span>
                )}
              </label>
              <input
                type="number"
                value={assumptions[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={`w-full px-2.5 py-1.5 bg-[#0d1117] border rounded-md text-xs font-mono text-white focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                  field.source != null ? "border-blue-500/30" : "border-[#1e293b]"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button onClick={() => onCalculate(assumptions)} disabled={loading}>
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            {loading ? "Calculating..." : "Run DCF Model"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
