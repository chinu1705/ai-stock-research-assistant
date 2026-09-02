import { NextRequest, NextResponse } from "next/server";
import { getStockQuoteWithFundamentals, getStockFinancials } from "@/lib/yahoo-finance";
import { calculateOpportunityScore, INTERESTING_STOCKS } from "@/lib/scoring";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const sector = searchParams.get("sector");

    const results = [];

    for (const ticker of INTERESTING_STOCKS.slice(0, 20)) {
      try {
        const [quote, financials] = await Promise.all([
          getStockQuoteWithFundamentals(ticker),
          getStockFinancials(ticker),
        ]);

        const score = calculateOpportunityScore(
          quote,
          financials as Record<string, unknown> | null
        );

        results.push({
          ticker,
          name: quote.name,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          overallScore: score.overallScore,
          valueScore: score.valueScore,
          growthScore: score.growthScore,
          momentumScore: score.momentumScore,
          qualityScore: score.qualityScore,
          safetyScore: score.safetyScore,
          reason: score.reason,
          sector: (financials as Record<string, unknown>)?.sector as string | undefined,
        });
      } catch {
        continue;
      }
    }

    results.sort((a, b) => b.overallScore - a.overallScore);

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
    });
  } catch (error) {
    console.error("Scanner API error:", error);
    return NextResponse.json(
      { error: "Failed to scan opportunities" },
      { status: 500 }
    );
  }
}
