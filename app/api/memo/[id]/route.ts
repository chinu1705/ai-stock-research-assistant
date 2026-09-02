import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const memo = await prisma.investmentMemo.findUnique({
      where: { id },
      include: { stock: true },
    });

    if (!memo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: memo.id,
      title: memo.title,
      ticker: memo.stock.ticker,
      thesis: memo.thesis,
      valuation: memo.valuation,
      peerAnalysis: memo.peerAnalysis,
      riskAssessment: memo.riskAssessment,
      catalysts: memo.catalysts,
      recommendation: memo.recommendation,
      targetPrice: memo.targetPrice,
      timeHorizon: memo.timeHorizon,
      confidence: memo.confidence,
      createdAt: memo.createdAt.toISOString(),
    });
  } catch (error) {
    console.warn("Database unavailable for memo fetch:", error);
    return NextResponse.json(
      { error: "Failed to fetch memo" },
      { status: 500 }
    );
  }
}
