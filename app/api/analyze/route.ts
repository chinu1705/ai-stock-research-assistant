import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ticker, quote } = body;

  if (!ticker || !quote) {
    return NextResponse.json(
      { error: "Ticker and quote data are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

const prompt = `You are a senior equity research analyst at a top investment bank. Based on this stock data for ${ticker}:
- Current price: $${quote["05. price"]}
- Open: $${quote["02. open"]}
- High: $${quote["03. high"]}
- Low: $${quote["04. low"]}
- Previous close: $${quote["08. previous close"]}
- Change: ${quote["09. change"]} (${quote["10. change percent"]})

Provide a professional research summary with:
1. SUMMARY: A sharp, insightful 3-sentence overview of the price action and what it signals to institutional investors.
2. BULL CASE: The 3 strongest arguments for why this stock could outperform. Be specific about catalysts, momentum, and market dynamics.
3. BEAR CASE: The 3 strongest arguments for downside risk. Cover valuation concerns, macro headwinds, and technical signals.
4. CONFIDENCE SCORE: A number from 0-100 representing overall bullish sentiment (0=extremely bearish, 50=neutral, 100=extremely bullish). Base this on price momentum, trend strength, and risk/reward.
5. SENTIMENT: exactly one word, either "Bearish", "Neutral", or "Bullish".
6. KEY CATALYST: One specific near-term event or factor that could move this stock significantly.
7. RISK LEVEL: exactly one word, either "Low", "Medium", or "High".

Respond ONLY in this exact JSON format, no markdown, no extra text:
{"summary": "...", "bullCase": "...", "bearCase": "...", "confidenceScore": 75, "sentiment": "Bullish", "keyCatalyst": "...", "riskLevel": "Medium"}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}