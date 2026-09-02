import { GoogleGenAI } from "@google/genai";
import { AIAnalysis, PersonaAnalysis } from "@/types";
import { PERSONAS, getDebatePrompt } from "./personas";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function parseJSONResponse(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

export async function generateAnalysis(
  ticker: string,
  quote: Record<string, unknown>
): Promise<AIAnalysis> {
  const prompt = `You are a senior equity analyst at Goldman Sachs analyzing ${ticker}.
  
Current Market Data:
- Price: $${quote.price}
- Change: ${quote.change} (${quote.changePercent}%)
- Open: $${quote.open}
- High: $${quote.high}
- Low: $${quote.low}
- Previous Close: $${quote.previousClose}
- Volume: ${quote.volume}
${quote.marketCap ? `- Market Cap: $${(quote.marketCap as number / 1e9).toFixed(1)}B` : ""}
${quote.pe ? `- P/E Ratio: ${quote.pe}` : ""}

Provide a comprehensive analysis with:
1. confidenceScore (0-100)
2. sentiment (bullish/neutral/bearish)
3. riskLevel (low/medium/high)
4. summary (2-3 sentences)
5. keyCatalyst (main catalyst to watch)
6. bullCase (3-4 reasons)
7. bearCase (3-4 reasons)
8. technicalSignal (buy/hold/sell based on technicals)
9. priceTarget (12-month target price)
10. volatilityNote (1 sentence on expected volatility)

Respond in this exact JSON format (no markdown, no code fences):
{
  "confidenceScore": number,
  "sentiment": "bullish" | "neutral" | "bearish",
  "riskLevel": "low" | "medium" | "high",
  "summary": "string",
  "keyCatalyst": "string",
  "bullCase": ["string", "string", "string"],
  "bearCase": ["string", "string", "string"],
  "technicalSignal": "buy" | "hold" | "sell",
  "priceTarget": number,
  "volatilityNote": "string"
}`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text || "";
  return parseJSONResponse(text) as unknown as AIAnalysis;
}

export async function generatePersonaAnalysis(
  ticker: string,
  stockData: Record<string, unknown>,
  personaId: string
): Promise<PersonaAnalysis> {
  const persona = PERSONAS[personaId];
  if (!persona) throw new Error(`Unknown persona: ${personaId}`);

  const prompt = getDebatePrompt(ticker, stockData, persona);

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text || "";
  const parsed = parseJSONResponse(text);

  return {
    name: persona.name,
    philosophy: persona.philosophy,
    signal: (parsed.signal as string) || "hold",
    confidence: (parsed.confidence as number) || 50,
    summary: (parsed.summary as string) || "",
    bullCase: (parsed.bullCase as string[]) || [],
    bearCase: (parsed.bearCase as string[]) || [],
    keyMetrics: (parsed.keyMetrics as Record<string, number>) || {},
  };
}

export async function generateDebate(
  ticker: string,
  stockData: Record<string, unknown>,
  personaIds: string[] = Object.keys(PERSONAS)
): Promise<{
  personas: PersonaAnalysis[];
  consensus: {
    signal: string;
    avgConfidence: number;
    agreement: string;
    keyDisagreements: string[];
    synthesizedView: string;
  };
}> {
  const analyses = await Promise.all(
    personaIds.map((id) => generatePersonaAnalysis(ticker, stockData, id))
  );

  const signalCounts: Record<string, number> = {};
  let totalConfidence = 0;

  for (const a of analyses) {
    signalCounts[a.signal] = (signalCounts[a.signal] || 0) + 1;
    totalConfidence += a.confidence;
  }

  const avgConfidence = Math.round(totalConfidence / analyses.length);
  const dominantSignal = Object.entries(signalCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const agreement =
    dominantSignal[1] === analyses.length
      ? "strong"
      : dominantSignal[1] >= analyses.length * 0.6
        ? "moderate"
        : dominantSignal[1] >= analyses.length * 0.4
          ? "weak"
          : "divided";

  const allSignals = Object.keys(signalCounts);
  const keyDisagreements: string[] = [];
  if (allSignals.length > 1) {
    keyDisagreements.push(
      `Analysts disagree: ${allSignals.map((s) => `${s} (${signalCounts[s]})`).join(", ")}`
    );
  }

  const viewPoints = analyses.map((a) => a.summary).join(" ");
  const synthesizedView = `Consensus among ${analyses.length} investors: ${dominantSignal[0].toUpperCase()} with ${avgConfidence}% average confidence. Agreement level: ${agreement}. ${viewPoints.slice(0, 300)}...`;

  return {
    personas: analyses,
    consensus: {
      signal: dominantSignal[0],
      avgConfidence,
      agreement,
      keyDisagreements,
      synthesizedView,
    },
  };
}

export async function generateMemo(
  ticker: string,
  stockData: Record<string, unknown>,
  peerData: unknown[],
  personaAnalyses: PersonaAnalysis[]
): Promise<Record<string, string>> {
  const prompt = `You are a senior equity research analyst at a top-tier investment bank.
Generate a comprehensive investment memo for ${ticker}.

STOCK DATA: ${JSON.stringify(stockData)}
PEER DATA: ${JSON.stringify(peerData)}
ANALYST PERSPECTIVES: ${JSON.stringify(personaAnalyses)}

Generate the memo with these sections:
{
  "thesis": "Executive summary of the investment thesis (3-4 sentences)",
  "valuation": "Detailed valuation analysis including DCF summary, relative valuation, and fair value assessment",
  "peerAnalysis": "How the company compares to peers on key metrics",
  "riskAssessment": "Primary and secondary risks with mitigation strategies",
  "catalysts": "Upcoming catalysts that could move the stock",
  "recommendation": "BUY | HOLD | SELL with conviction level"
}

Respond in this exact JSON format (no markdown, no code fences):
{
  "thesis": "string",
  "valuation": "string",
  "peerAnalysis": "string",
  "riskAssessment": "string",
  "catalysts": "string",
  "recommendation": "BUY" | "HOLD" | "SELL"
}`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text || "";
  return parseJSONResponse(text) as Record<string, string>;
}

export async function generateTickerFromName(
  companyName: string
): Promise<string> {
  const prompt = `Convert this company name or description to a stock ticker symbol.
If it's an Indian company, append .NS for NSE or .BO for BSE.
If it's a US company, just return the ticker.
Company: ${companyName}
Reply with ONLY the ticker symbol, nothing else.`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return (result.text || "").trim().replace(/['"]/g, "");
}
