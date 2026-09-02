"use client";

import { PersonaAnalysis } from "@/types";
import { cn, getSignalBg } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PersonaCardProps {
  analysis: PersonaAnalysis;
  index: number;
}

export function PersonaCard({ analysis, index }: PersonaCardProps) {
  const avatarColors = [
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-red-500 to-rose-600",
  ];

  return (
    <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 hover:border-[#2d3748] transition-colors">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
            avatarColors[index % avatarColors.length]
          )}
        >
          {analysis.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white text-sm font-mono">
              {analysis.name}
            </h3>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold uppercase font-mono",
                getSignalBg(analysis.signal)
              )}
            >
              {analysis.signal}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
            Confidence: {analysis.confidence}%
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-300 leading-relaxed">
        {analysis.summary}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <h4 className="text-[10px] font-medium text-emerald-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Bull Case
          </h4>
          <ul className="space-y-1">
            {analysis.bullCase.map((item, i) => (
              <li key={i} className="text-[11px] text-slate-400 flex gap-1.5">
                <span className="text-emerald-400 mt-0.5">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-medium text-red-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Bear Case
          </h4>
          <ul className="space-y-1">
            {analysis.bearCase.map((item, i) => (
              <li key={i} className="text-[11px] text-slate-400 flex gap-1.5">
                <span className="text-red-400 mt-0.5">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {Object.keys(analysis.keyMetrics).length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#1e293b]">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(analysis.keyMetrics).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-1 bg-[#0d1117] border border-[#1e293b] rounded text-[10px] font-mono"
              >
                <span className="text-slate-500">{key}: </span>
                <span className="text-white">
                  {typeof value === "number" ? value.toFixed(1) : value}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
