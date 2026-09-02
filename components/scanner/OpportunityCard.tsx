"use client";

import { OpportunityScore } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface OpportunityCardProps {
  opportunity: OpportunityScore;
  rank: number;
}

export function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card hover>
      <CardContent className="flex items-center gap-3 py-3">
        <div className="text-lg font-bold text-slate-600 w-7 text-center font-mono">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white font-mono text-sm">
              {opportunity.ticker}
            </h3>
            {opportunity.sector && (
              <span className="px-1.5 py-0.5 bg-[#1e293b] rounded text-[10px] text-slate-400 font-mono">
                {opportunity.sector}
              </span>
            )}
            <ArrowUpRight className="w-3 h-3 text-slate-600" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-mono">
            {opportunity.reason}
          </p>
        </div>
        <div className="text-right">
          <div className={cn("text-lg font-bold font-mono tabular-nums", getScoreColor(opportunity.overallScore))}>
            {opportunity.overallScore}
          </div>
          <div className="w-14 h-1 bg-[#1e293b] rounded-full overflow-hidden mt-1">
            <div
              className={cn("h-full rounded-full", getScoreBg(opportunity.overallScore))}
              style={{ width: `${opportunity.overallScore}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
