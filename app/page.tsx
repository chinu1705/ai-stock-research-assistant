"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StockData {
  "Global Quote"?: {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

interface Analysis {
  summary: string;
  bullCase: string;
  bearCase: string;
  confidenceScore: number;
  sentiment: string;
  keyCatalyst: string;
  riskLevel: string;
}

type Tab = "overview" | "ai" | "history";

function ConfidenceGauge({ score }: { score: number }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * Math.PI;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const strokeDashoffset = circumference - progress * circumference;

  const getColor = (score: number) => {
    if (score >= 70) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getLabel = (score: number) => {
    if (score >= 70) return "Bullish";
    if (score >= 40) return "Neutral";
    return "Bearish";
  };

  return (
    <div className="flex flex-col items-center">
      <svg height={radius} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius}`}>
        <path
          d={`M ${stroke * 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke * 2} ${radius}`}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke * 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke * 2} ${radius}`}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="-mt-4 text-center">
        <p className="text-3xl font-black text-zinc-900 dark:text-white">{score}</p>
        <p className="text-sm font-semibold" style={{ color: getColor(score) }}>
          {getLabel(score)}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);

  useEffect(() => {
    if (!stockData) {
      setChartData([]);
      return;
    }
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/history?ticker=${ticker}`);
        const data = await response.json();
        if (Array.isArray(data)) setChartData(data);
      } catch {
        setChartData([]);
      }
    };
    fetchHistory();
  }, [stockData]);

  const handleSearch = async () => {
    if (!ticker) return;
    setLoading(true);
    setError("");
    setStockData(null);
    setAnalysis(null);
    setAnalysisError("");
    setActiveTab("overview");

    try {
      const response = await fetch(`/api/stock?ticker=${ticker}`);
      const data = await response.json();
      if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
        setError(`No data found for "${ticker}". Check the ticker symbol.`);
      } else {
        setStockData(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    const quote = stockData?.["Global Quote"];
    if (!quote) return;
    setAnalyzing(true);
    setAnalysisError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, quote }),
      });
      const data = await response.json();
      if (data.error) {
        setAnalysisError(data.error);
      } else {
        setAnalysis(data);
        setActiveTab("ai");
      }
    } catch {
      setAnalysisError("Failed to generate analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const quote = stockData?.["Global Quote"];
  const isPositive = quote ? !quote["09. change"].startsWith("-") : true;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-12 transition-colors dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-1 text-4xl font-bold text-zinc-900 dark:text-white">
                AI Stock Research Assistant
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Enter a stock ticker to generate an AI-powered research summary
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full border border-zinc-300 bg-white p-2.5 text-lg dark:border-zinc-700 dark:bg-zinc-800"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex w-full gap-2">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. AAPL, TSLA, RELIANCE.NS"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {error && (
            <p className="mt-6 text-center text-red-600 dark:text-red-400">{error}</p>
          )}

          {quote && (
            <>
              <div className="mt-6 flex gap-1 rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800">
                {(["overview", "ai", "history"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition ${
                      activeTab === tab
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {tab === "ai" ? "AI Analysis" : tab}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className={`px-6 py-5 ${isPositive ? "bg-emerald-600" : "bg-red-600"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-md backdrop-blur-sm">
                          <span className="text-xs font-black text-white">
                            {quote["01. symbol"].slice(0, 4)}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {quote["01. symbol"]}
                          </h2>
                          <p className="text-sm text-white/80">
                            {isPositive ? "▲ Trending Up" : "▼ Trending Down"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">${quote["05. price"]}</p>
                        <p className="text-sm font-medium text-white/90">
                          {quote["09. change"]} ({quote["10. change percent"]})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-6 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">Open</p>
                      <p className="font-medium text-zinc-900 dark:text-white">${quote["02. open"]}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">Prev Close</p>
                      <p className="font-medium text-zinc-900 dark:text-white">${quote["08. previous close"]}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">High</p>
                      <p className="font-medium text-zinc-900 dark:text-white">${quote["03. high"]}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">Low</p>
                      <p className="font-medium text-zinc-900 dark:text-white">${quote["04. low"]}</p>
                    </div>
                  </div>

                  {chartData.length > 0 && (
                    <div className="px-6 pb-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        30-Day Price History
                      </p>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11 }}
                            tickFormatter={(date) => date.slice(5)}
                            stroke="currentColor"
                            className="text-zinc-400"
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            tick={{ fontSize: 11 }}
                            stroke="currentColor"
                            className="text-zinc-400"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              border: "1px solid #71717a",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={isPositive ? "#059669" : "#dc2626"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {analyzing ? "Generating AI Analysis..." : "✨ Generate AI Analysis"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="mt-4 space-y-4">
                  {analysisError && (
                    <p className="text-center text-red-600 dark:text-red-400">{analysisError}</p>
                  )}
                  {!analysis && !analysisError && (
                    <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      Click "Generate AI Analysis" on the Overview tab first.
                    </p>
                  )}
                  {analysis && (
                    <>
                      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            AI Confidence Score
                          </p>
                          <div className="flex gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              analysis.riskLevel === "Low"
                                ? "bg-emerald-100 text-emerald-700"
                                : analysis.riskLevel === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {analysis.riskLevel} Risk
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              analysis.sentiment === "Bullish"
                                ? "bg-emerald-100 text-emerald-700"
                                : analysis.sentiment === "Bearish"
                                ? "bg-red-100 text-red-700"
                                : "bg-zinc-100 text-zinc-700"
                            }`}>
                              {analysis.sentiment}
                            </span>
                          </div>
                        </div>
                        <ConfidenceGauge score={analysis.confidenceScore} />
                      </div>

                      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          📋 Summary
                        </p>
                        <p className="text-zinc-800 dark:text-zinc-200">{analysis.summary}</p>
                      </div>

                      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/40">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                          ⚡ Key Catalyst to Watch
                        </p>
                        <p className="text-indigo-900 dark:text-indigo-200">{analysis.keyCatalyst}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                            🐂 Bull Case
                          </p>
                          <p className="text-emerald-900 dark:text-emerald-200">{analysis.bullCase}</p>
                        </div>
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                            🐻 Bear Case
                          </p>
                          <p className="text-red-900 dark:text-red-200">{analysis.bearCase}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  Search history coming soon.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}