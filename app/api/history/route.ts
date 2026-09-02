import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] } as never);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    const result = await yf.chart(ticker, {
      period1: startDate.toISOString().split("T")[0],
      period2: endDate.toISOString().split("T")[0],
      interval: "1d",
    });

    const quotes = result.quotes || [];
    const chartData = quotes
      .filter((item: Record<string, unknown>) => item.close != null)
      .map((item: Record<string, unknown>) => ({
        date: (item.date as string) || "",
        price: parseFloat(((item.close as number) || 0).toFixed(2)),
      }))
      .reverse();

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch price history", details: String(error) },
      { status: 500 }
    );
  }
}
