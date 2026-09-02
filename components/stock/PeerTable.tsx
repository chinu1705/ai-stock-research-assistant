"use client";

import { PeerData } from "@/types";
import { formatPercent, formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Columns3 } from "lucide-react";

interface PeerTableProps {
  peers: PeerData[];
  ticker: string;
  currency?: string;
}

export function PeerTable({ peers, ticker, currency = "USD" }: PeerTableProps) {
  if (!peers || peers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Columns3 className="w-3.5 h-3.5" />
            Peer Comparison
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-600 font-mono">No peer data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Columns3 className="w-3.5 h-3.5" />
          Peer Comparison
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="text-right px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider">
                  Change %
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-500/5 border-b border-[#1e293b]">
                <td className="px-4 py-2 text-blue-400 font-semibold">
                  {ticker}
                </td>
                <td className="text-right px-4 py-2 text-slate-400">—</td>
                <td className="text-right px-4 py-2 text-slate-400">—</td>
                <td className="text-right px-4 py-2 text-slate-400">—</td>
              </tr>
              {peers.map((peer) => (
                <tr
                  key={peer.symbol}
                  className="border-t border-[#1e293b]/50 hover:bg-[#161b22] transition-colors"
                >
                  <td className="px-4 py-2 text-white font-semibold">
                    {peer.symbol}
                  </td>
                  <td className="text-right px-4 py-2 text-slate-200 tabular-nums">
                    {formatCurrency(peer.price, currency)}
                  </td>
                  <td
                    className={`text-right px-4 py-2 tabular-nums ${
                      peer.isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {peer.isPositive ? "+" : ""}
                    {peer.change.toFixed(2)}
                  </td>
                  <td
                    className={`text-right px-4 py-2 tabular-nums ${
                      peer.isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {formatPercent(peer.changePercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
