import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ticker, quote, currency } = body;

  if (!ticker || !quote) {
    return NextResponse.json(
      { error: "Ticker and quote data are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a senior equity analyst at Goldman Sachs. Analyze this stock data for ${ticker}:
- Price: ${currency}${quote["05. price"]}
- Change: ${quote["09. change"]} (${quote["10. change percent"]})
- Open: ${currency}${quote["02. open"]}
- High: ${currency}${quote["03. high"]}
- Low: ${currency}${quote["04. low"]}
- Prev Close: ${currency}${quote["08. previous close"]}

Return ONLY this exact JSON, no markdown, no extra text:
{
  "confidenceScore": <number 0-100>,
  "sentiment": <"Bullish" or "Neutral" or "Bearish">,
  "riskLevel": <"Low" or "Medium" or "High">,
  "summary": "<2 sentences max. Sharp, specific, no filler words>",
  "keyCatalyst": "<1 specific near-term catalyst. Max 15 words.>",
  "bullCase": "<3 specific bullet points separated by |. Each max 12 words. No generic statements.>",
  "bearCase": "<3 specific bullet points separated by |. Each max 12 words. No generic statements.>",
  "technicalSignal": <"Strong Buy" or "Buy" or "Hold" or "Sell" or "Strong Sell">,
  "priceTarget": "<a specific short-term price target with rationale in 10 words max>",
  "volatilityNote": "<one sharp observation about today's price range in 10 words max>"
}`;

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