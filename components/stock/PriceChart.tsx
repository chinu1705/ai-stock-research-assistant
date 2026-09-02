"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceHistoryPoint } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";

interface PriceChartProps {
  data: PriceHistoryPoint[];
  ticker: string;
  currency?: string;
}

export function PriceChart({ data, ticker, currency = "USD" }: PriceChartProps) {
  const symbol = currency === "INR" ? "₹" : "$";

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Price History
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-600 text-xs font-mono">
            No chart data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const min = Math.min(...data.map((d) => d.price)) * 0.995;
  const max = Math.max(...data.map((d) => d.price)) * 1.005;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" />
          {ticker} — 12 Month Price History
        </h3>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#475569", fontFamily: "monospace" }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return d.toLocaleDateString("en-US", { month: "short" });
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[min, max]}
                tick={{ fontSize: 10, fill: "#475569", fontFamily: "monospace" }}
                tickFormatter={(v) => `${symbol}${v.toFixed(0)}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
                formatter={(value: any) => [`${symbol}${Number(value).toFixed(2)}`, "Price"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
