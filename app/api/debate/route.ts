import { NextRequest, NextResponse } from "next/server";
import { generateDebate } from "@/lib/gemini";
import { getStockQuoteWithFundamentals } from "@/lib/yahoo-finance";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, personas } = body;

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    const quote = await getStockQuoteWithFundamentals(ticker);
    const stockData = {
      ...quote,
      ticker: ticker.toUpperCase(),
    };

    const result = await generateDebate(
      ticker.toUpperCase(),
      stockData as unknown as Record<string, unknown>,
      personas
    );

    return NextResponse.json({
      ticker: ticker.toUpperCase(),
      debateId: Date.now().toString(),
      ...result,
    });
  } catch (error) {
    console.error("Debate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate debate" },
      { status: 500 }
    );
  }
}
