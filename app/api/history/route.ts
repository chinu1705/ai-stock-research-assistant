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
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const result = await yahooFinance.historical(ticker, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    });

    const chartData = result
      .map((item) => ({
        date: item.date.toISOString().split("T")[0],
        price: parseFloat(item.close.toFixed(2)),
      }))
      .reverse();

    return NextResponse.json(chartData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}