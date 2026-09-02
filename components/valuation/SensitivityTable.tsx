"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Table2 } from "lucide-react";

interface SensitivityTableProps {
  table: number[][];
  growthLabels?: string[];
  discountLabels?: string[];
}

export function SensitivityTable({
  table,
  growthLabels = ["-2%", "-1%", "Base", "+1%", "+2%"],
  discountLabels = ["-1%", "-0.5%", "Base", "+0.5%", "+1%"],
}: SensitivityTableProps) {
  if (!table || table.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Table2 className="w-3.5 h-3.5" />
          Sensitivity Analysis
        </h3>
        <p className="text-[10px] text-slate-500 font-mono">
          Fair value under different growth and discount rate assumptions
        </p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1e293b]">
              <th className="px-3 py-2 text-left text-[10px] text-slate-500 uppercase">
                WACC \ Growth
              </th>
              {growthLabels.map((label) => (
                <th key={label} className="px-3 py-2 text-center text-[10px] text-slate-500 uppercase">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i} className="border-b border-[#1e293b]/50">
                <td className="px-3 py-2 font-semibold text-white">
                  {discountLabels[i]}
                </td>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2 text-center tabular-nums ${
                      i === Math.floor(table.length / 2) && j === Math.floor(row.length / 2)
                        ? "bg-blue-500/10 text-blue-400 font-bold"
                        : cell > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                    }`}
                  >
                    ${cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
