// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    const quote = await yahooFinance.quote(ticker);
    const result = {
      "Global Quote": {
        "01. symbol": quote.symbol ?? ticker,
        "02. open": quote.regularMarketOpen?.toFixed(2) ?? "0",
        "03. high": quote.regularMarketDayHigh?.toFixed(2) ?? "0",
        "04. low": quote.regularMarketDayLow?.toFixed(2) ?? "0",
        "05. price": quote.regularMarketPrice?.toFixed(2) ?? "0",
        "06. volume": quote.regularMarketVolume?.toString() ?? "0",
        "07. latest trading day": new Date().toISOString().split("T")[0],
        "08. previous close": quote.regularMarketPreviousClose?.toFixed(2) ?? "0",
        "09. change": quote.regularMarketChange?.toFixed(2) ?? "0",
        "10. change percent": quote.regularMarketChangePercent?.toFixed(4) + "%",
      },
    };
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Could not find ticker. For Indian stocks try RELIANCE.NS or TCS.BO" },
      { status: 404 }
    );
  }
} 