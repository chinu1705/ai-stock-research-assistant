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

  const prompt = `You are a financial analyst. Based on this stock data for ${ticker}:
- Current price: $${quote["05. price"]}
- Open: $${quote["02. open"]}
- High: $${quote["03. high"]}
- Low: $${quote["04. low"]}
- Previous close: $${quote["08. previous close"]}
- Change: ${quote["09. change"]} (${quote["10. change percent"]})

Write a concise research summary with three sections, each 2-3 sentences:
1. SUMMARY: A neutral overview of what this price action suggests.
2. BULL CASE: The strongest argument for why this stock could go up.
3. BEAR CASE: The strongest argument for why this stock could go down.

Respond ONLY in this exact JSON format, no markdown, no extra text:
{"summary": "...", "bullCase": "...", "bearCase": "..."}`;

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