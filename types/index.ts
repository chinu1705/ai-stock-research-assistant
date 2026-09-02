export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  pb?: number;
  dividendYield?: number;
  beta?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  currency: string;
  exchange: string;
  sector?: string;
  industry?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface PeerData {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  pe?: number;
  marketCap?: number;
}

export interface AIAnalysis {
  confidenceScore: number;
  sentiment: string;
  riskLevel: string;
  summary: string;
  keyCatalyst: string;
  bullCase: string[];
  bearCase: string[];
  technicalSignal: string;
  priceTarget: number;
  volatilityNote: string;
}

export interface PersonaAnalysis {
  name: string;
  philosophy: string;
  signal: string;
  confidence: number;
  summary: string;
  bullCase: string[];
  bearCase: string[];
  keyMetrics: Record<string, number>;
}

export interface DebateResult {
  ticker: string;
  debateId: string;
  personas: PersonaAnalysis[];
  consensus: {
    signal: string;
    avgConfidence: number;
    agreement: string;
    keyDisagreements: string[];
    synthesizedView: string;
  };
}

export interface ValuationResult {
  ticker: string;
  dcf: {
    fairValuePerShare: number;
    currentPrice: number;
    marginOfSafety: string;
    signal: string;
    assumptions: DCFAssumptions;
    sensitivityTable: number[][];
    projectionYears: ProjectionYear[];
  };
  relativeValuation: {
    peers: PeerValuation[];
    averagePe: number;
    impliedValue: number;
    premium: string;
  };
  consensus: {
    dcfValue: number;
    relativeValue: number;
    blended: number;
    recommendation: string;
  };
  derivedAssumptions: {
    revenueGrowth: number | null;
    operatingMargin: number | null;
    capexPercent: number | null;
    beta: number | null;
    discountRate: number | null;
    freeCashFlow: number;
    totalRevenue: number | null;
    sharesOutstanding: number;
  };
}

export interface DCFAssumptions {
  revenueGrowthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  marginExpansion: number;
  capexPercent: number;
  operatingMargin: number;
}

export interface ProjectionYear {
  year: number;
  revenue: number;
  fcf: number;
}

export interface PeerValuation {
  ticker: string;
  name: string;
  pe: number;
  pb: number;
  evEbitda: number;
}

export interface EarningsEvent {
  reportDate: string;
  quarter: string;
  year: number;
  epsEstimate?: number;
  epsActual?: number;
  surprise?: number;
  revenueEstimate?: number;
  revenueActual?: number;
  priceMovement?: number;
}

export interface OpportunityScore {
  ticker: string;
  name: string;
  overallScore: number;
  valueScore: number;
  growthScore: number;
  momentumScore: number;
  qualityScore: number;
  safetyScore: number;
  reason: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
}

export interface InvestmentMemoData {
  title: string;
  thesis: string;
  valuation: string;
  peerAnalysis: string;
  riskAssessment: string;
  catalysts: string;
  recommendation: string;
  targetPrice?: number;
  timeHorizon: string;
  confidence: number;
  personas: string;
}

export interface Persona {
  id: string;
  name: string;
  philosophy: string;
  focusAreas: string[];
  weightFactors: Record<string, number>;
  avatar: string;
}
