import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] } as never);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    const quote = await yf.quote(ticker);
    return NextResponse.json({
      symbol: quote.symbol || ticker,
      name: quote.shortName || quote.longName || ticker,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      open: quote.regularMarketOpen || 0,
      high: quote.regularMarketDayHigh || 0,
      low: quote.regularMarketDayLow || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || undefined,
      pe: quote.trailingPE || undefined,
      pb: quote.priceToBook || undefined,
      dividendYield: quote.dividendYield || undefined,
      beta: quote.beta || undefined,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || undefined,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || undefined,
      currency: quote.currency || "USD",
      exchange: quote.exchange || "",
    });
  } catch (error) {
    console.error("Stock API error:", error);
    return NextResponse.json(
      { error: "Could not find ticker", details: String(error) },
      { status: 404 }
    );
  }
}
