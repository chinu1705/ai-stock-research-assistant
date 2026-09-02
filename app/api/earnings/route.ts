import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] } as never);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    const quote = await yf.quote(ticker);
    const raw = quote as unknown as Record<string, unknown>;

    const earningsDate = raw.earningsDate
      ? Array.isArray(raw.earningsDate)
        ? raw.earningsDate[0]
          ? new Date(raw.earningsDate[0] as string | number).toISOString().split("T")[0]
          : null
        : new Date(raw.earningsDate as string | number).toISOString().split("T")[0]
      : null;

    const epsForward = (raw.epsForward as number) || null;
    const trailingPE = (raw.trailingPE as number) || null;

    const earningsQuarterly = raw.earningsQuarterly as
      | { date: string | number; actual?: number; estimate?: number; surprise?: number }[]
      | undefined;

    let lastReport = null;
    if (earningsQuarterly && earningsQuarterly.length > 0) {
      const latest = earningsQuarterly[0];
      if (latest.actual !== undefined && latest.estimate !== undefined) {
        lastReport = {
          epsEstimate: latest.estimate,
          epsActual: latest.actual,
          surprise: latest.surprise ?? ((latest.actual - latest.estimate) / Math.abs(latest.estimate) * 100),
          reportDate: new Date(latest.date).toISOString().split("T")[0],
        };
      }
    }

    return NextResponse.json({
      ticker: ticker.toUpperCase(),
      earningsDate,
      epsForward,
      trailingPE,
      lastReport,
    });
  } catch (error) {
    console.error("Earnings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings data" },
      { status: 500 }
    );
  }
}
