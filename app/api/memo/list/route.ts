import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const memos = await prisma.investmentMemo.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { stock: true },
    });

    return NextResponse.json({
      memos: memos.map((m) => ({
        id: m.id,
        title: m.title,
        ticker: m.stock.ticker,
        recommendation: m.recommendation,
        confidence: m.confidence,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.warn("Database unavailable for memo list:", error);
    return NextResponse.json({ memos: [] });
  }
}
