"use client";

import { AIAnalysis } from "@/types";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn, getSignalBg } from "@/lib/utils";
import { Target, Shield, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface AnalysisResultProps {
  analysis: AIAnalysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const rawBull = analysis.bullCase as unknown;
  const bullCaseItems: string[] = Array.isArray(rawBull)
    ? rawBull
    : typeof rawBull === "string"
      ? rawBull.split("|").map((s: string) => s.trim()).filter(Boolean)
      : [];

  const rawBear = analysis.bearCase as unknown;
  const bearCaseItems: string[] = Array.isArray(rawBear)
    ? rawBear
    : typeof rawBear === "string"
      ? rawBear.split("|").map((s: string) => s.trim()).filter(Boolean)
      : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="text-center py-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Signal
            </p>
            <span
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold uppercase font-mono",
                getSignalBg(analysis.technicalSignal)
              )}
            >
              {analysis.technicalSignal}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Sentiment
            </p>
            <span
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold uppercase font-mono",
                getSignalBg(analysis.sentiment)
              )}
            >
              {analysis.sentiment}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Risk
            </p>
            <span
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold uppercase font-mono",
                analysis.riskLevel === "low"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : analysis.riskLevel === "high"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-amber-500/10 text-amber-400"
              )}
            >
              {analysis.riskLevel}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-6">
        <ConfidenceGauge score={analysis.confidenceScore} />
        <div className="flex-1">
          <Card>
            <CardContent>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {analysis.priceTarget && (
        <Card>
          <CardContent className="flex items-center justify-between py-3">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              12-Month Price Target
            </span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              ${Number(analysis.priceTarget).toFixed(2)}
            </span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Bull Case
            </h3>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {bullCaseItems.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs text-slate-300"
                >
                  <span className="font-bold text-emerald-400 font-mono">
                    {i + 1}.
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Bear Case
            </h3>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {bearCaseItems.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs text-slate-300"
                >
                  <span className="font-bold text-red-400 font-mono">
                    {i + 1}.
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {analysis.keyCatalyst && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent>
            <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wider mb-1 font-mono flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Key Catalyst
            </p>
            <p className="text-xs text-slate-300">
              {analysis.keyCatalyst}
            </p>
          </CardContent>
        </Card>
      )}

      {analysis.volatilityNote && (
        <Card>
          <CardContent>
            <p className="text-[10px] text-slate-500 mb-1 font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              Volatility Note
            </p>
            <p className="text-xs text-slate-300">
              {analysis.volatilityNote}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
