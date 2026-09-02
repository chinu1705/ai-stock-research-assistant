"use client";

import { PersonaAnalysis } from "@/types";
import { cn, getSignalBg } from "@/lib/utils";
import { AlertTriangle, Zap } from "lucide-react";

interface DebateBoardProps {
  personas: PersonaAnalysis[];
  consensus: {
    signal: string;
    avgConfidence: number;
    agreement: string;
    keyDisagreements: string[];
    synthesizedView: string;
  };
}

export function DebateBoard({ personas, consensus }: DebateBoardProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            Consensus View
          </h3>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs font-bold uppercase font-mono",
                getSignalBg(consensus.signal)
              )}
            >
              {consensus.signal}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {consensus.avgConfidence}% confidence
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-medium text-slate-500 font-mono">
            Agreement:
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-mono font-medium",
              consensus.agreement === "strong"
                ? "bg-emerald-500/10 text-emerald-400"
                : consensus.agreement === "moderate"
                  ? "bg-blue-500/10 text-blue-400"
                  : consensus.agreement === "weak"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
            )}
          >
            {consensus.agreement}
          </span>
        </div>
        <p className="text-xs text-slate-300">
          {consensus.synthesizedView}
        </p>
        {consensus.keyDisagreements.length > 0 && (
          <div className="mt-3 space-y-1">
            {consensus.keyDisagreements.map((d, i) => (
              <p key={i} className="text-[11px] text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                {d}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {personas.map((persona, index) => {
          const avatarColors = [
            "from-emerald-500 to-teal-600",
            "from-blue-500 to-indigo-600",
            "from-purple-500 to-pink-600",
            "from-amber-500 to-orange-600",
            "from-red-500 to-rose-600",
          ];
          return (
            <div
              key={persona.name}
              className="bg-[#111827] border border-[#1e293b] rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 bg-gradient-to-br rounded-md flex items-center justify-center text-white text-[10px] font-bold",
                    avatarColors[index % avatarColors.length]
                  )}>
                    {persona.name.charAt(0)}
                  </div>
                  <span className="font-medium text-xs text-white font-mono">
                    {persona.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase font-mono",
                    getSignalBg(persona.signal)
                  )}
                >
                  {persona.signal}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${persona.confidence}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {persona.confidence}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-3">
                {persona.summary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
