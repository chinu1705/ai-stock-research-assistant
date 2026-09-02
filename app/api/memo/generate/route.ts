import { NextRequest, NextResponse } from "next/server";
import { generateMemo } from "@/lib/gemini";
import { getStockQuoteWithFundamentals, getPeers, getStockFinancials } from "@/lib/yahoo-finance";
import { calculateDCF, getValuationSignal } from "@/lib/valuation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker } = body;

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    const [quote, peerData, financials] = await Promise.all([
      getStockQuoteWithFundamentals(ticker),
      getPeers(ticker),
      getStockFinancials(ticker),
    ]);

    const stockData = {
      ...quote,
      ...financials,
      ticker: ticker.toUpperCase(),
    };

    const memoData = await generateMemo(
      ticker.toUpperCase(),
      stockData as unknown as Record<string, unknown>,
      peerData as unknown[],
      []
    );

    const freeCashFlow = financials?.freeCashflow || (quote.marketCap || 0) * 0.05 || 1e9;
    const dcfResult = calculateDCF({
      currentPrice: quote.price,
      freeCashFlow,
      revenueGrowthRate: 8,
      terminalGrowthRate: 3,
      discountRate: 10,
      marginExpansion: 0.5,
      capexPercent: 5,
      operatingMargin: 25,
    });

    const targetPrice = dcfResult.fairValuePerShare;
    const signal = getValuationSignal(targetPrice, quote.price);
    const confidence = signal === "undervalued" ? 75 : signal === "overvalued" ? 70 : 60;

    let memoId = `temp-${Date.now()}`;
    let createdAt = new Date().toISOString();

    try {
      const { prisma } = await import("@/lib/prisma");
      const stock = await prisma.stock.upsert({
        where: { ticker: ticker.toUpperCase() },
        update: {},
        create: {
          ticker: ticker.toUpperCase(),
          name: quote.name,
          currency: quote.currency,
        },
      });

      const memo = await prisma.investmentMemo.create({
        data: {
          stockId: stock.id,
          title: `${quote.name} (${ticker.toUpperCase()}) — Investment Memo`,
          thesis: memoData.thesis || "",
          valuation: memoData.valuation || "",
          peerAnalysis: memoData.peerAnalysis || "",
          riskAssessment: memoData.riskAssessment || "",
          catalysts: memoData.catalysts || "",
          recommendation: memoData.recommendation || "HOLD",
          targetPrice,
          timeHorizon: "12 months",
          confidence,
          personas: JSON.stringify([]),
        },
      });
      memoId = memo.id;
      createdAt = memo.createdAt.toISOString();
    } catch (dbError) {
      console.warn("Database unavailable, returning memo without persistence:", dbError);
    }

    return NextResponse.json({
      id: memoId,
      title: `${quote.name} (${ticker.toUpperCase()}) — Investment Memo`,
      thesis: memoData.thesis || "",
      valuation: memoData.valuation || "",
      peerAnalysis: memoData.peerAnalysis || "",
      riskAssessment: memoData.riskAssessment || "",
      catalysts: memoData.catalysts || "",
      recommendation: memoData.recommendation || "HOLD",
      targetPrice,
      timeHorizon: "12 months",
      confidence,
      createdAt,
    });
  } catch (error) {
    console.error("Memo generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate memo" },
      { status: 500 }
    );
  }
}
