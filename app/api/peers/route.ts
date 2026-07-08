// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const PEER_MAP = {
  AAPL: ["MSFT", "GOOGL", "META"],
  MSFT: ["AAPL", "GOOGL", "AMZN"],
  GOOGL: ["META", "MSFT", "AAPL"],
  GOOG: ["META", "MSFT", "AAPL"],
  META: ["GOOGL", "SNAP", "PINS"],
  AMZN: ["MSFT", "GOOGL", "WMT"],
  TSLA: ["F", "GM", "RIVN"],
  NVDA: ["AMD", "INTC", "QCOM"],
  AMD: ["NVDA", "INTC", "QCOM"],
  JPM: ["BAC", "GS", "MS"],
  BAC: ["JPM", "WFC", "C"],
  GS: ["MS", "JPM", "BAC"],
  NFLX: ["DIS", "PARA", "WBD"],
  "RELIANCE.NS": ["TCS.NS", "HDFCBANK.NS", "INFY.NS"],
  "RELIANCE.BO": ["TCS.BO", "HDFCBANK.BO", "INFY.BO"],
  "TCS.NS": ["INFY.NS", "WIPRO.NS", "HCLTECH.NS"],
  "TCS.BO": ["INFY.BO", "WIPRO.BO", "HCLTECH.BO"],
  "INFY.NS": ["TCS.NS", "WIPRO.NS", "HCLTECH.NS"],
  "HDFCBANK.NS": ["ICICIBANK.NS", "KOTAKBANK.NS", "SBIN.NS"],
  "HDFCBANK.BO": ["ICICIBANK.BO", "KOTAKBANK.BO", "SBIN.BO"],
};

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker required" }, { status: 400 });
  }

  const peers = PEER_MAP[ticker.toUpperCase()] || PEER_MAP[ticker] || [];

  if (peers.length === 0) {
    return NextResponse.json({ peers: [] });
  }

  try {
    const peerData = await Promise.all(
      peers.map(async (peer) => {
        try {
          const quote = await yahooFinance.quote(peer);
          return {
            symbol: peer,
            price: quote.regularMarketPrice?.toFixed(2) ?? "N/A",
            change: quote.regularMarketChange?.toFixed(2) ?? "0",
            changePercent: quote.regularMarketChangePercent?.toFixed(2) ?? "0",
            isPositive: (quote.regularMarketChange ?? 0) >= 0,
          };
        } catch {
          return null;
        }
      })
    );

    const filtered = peerData.filter(Boolean);
    return NextResponse.json({ peers: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch peer data" }, { status: 500 });
  }
}