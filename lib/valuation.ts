import { DCFAssumptions, ProjectionYear, ValuationResult } from "@/types";

export function calculateDCF(params: {
  currentPrice: number;
  freeCashFlow: number;
  totalRevenue?: number;
  sharesOutstanding?: number;
  revenueGrowthRate?: number;
  terminalGrowthRate?: number;
  discountRate?: number;
  marginExpansion?: number;
  capexPercent?: number;
  operatingMargin?: number;
}): {
  fairValuePerShare: number;
  assumptions: DCFAssumptions;
  projectionYears: ProjectionYear[];
  sensitivityTable: number[][];
} {
  const {
    currentPrice,
    freeCashFlow,
    totalRevenue,
    sharesOutstanding = 1e9,
    revenueGrowthRate = 0.08,
    terminalGrowthRate = 0.03,
    discountRate = 0.1,
    marginExpansion = 0.005,
    capexPercent = 0.05,
    operatingMargin = 0.25,
  } = params;

  const projectionYears: ProjectionYear[] = [];
  let revenue = totalRevenue && totalRevenue > 0
    ? totalRevenue
    : freeCashFlow / Math.max(operatingMargin - capexPercent, 0.01);

  for (let year = 1; year <= 5; year++) {
    revenue = revenue * (1 + revenueGrowthRate);
    const operatingIncome = revenue * (operatingMargin + marginExpansion * year);
    const yearFcf = operatingIncome * 0.8;
    projectionYears.push({
      year,
      revenue: Math.round(revenue),
      fcf: Math.round(yearFcf),
    });
  }

  let totalPV = 0;
  for (let i = 0; i < projectionYears.length; i++) {
    totalPV += projectionYears[i].fcf / Math.pow(1 + discountRate, i + 1);
  }

  const terminalValue =
    (projectionYears[4].fcf * (1 + terminalGrowthRate)) /
    (discountRate - terminalGrowthRate);
  const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, 5);

  const enterpriseValue = totalPV + pvTerminalValue;
  const fairValuePerShare = enterpriseValue / sharesOutstanding;

  const assumptions: DCFAssumptions = {
    revenueGrowthRate,
    terminalGrowthRate,
    discountRate,
    marginExpansion,
    capexPercent,
    operatingMargin,
  };

  const sensitivityTable = generateSensitivityTable(
    freeCashFlow,
    revenueGrowthRate,
    discountRate,
    terminalGrowthRate,
    totalRevenue,
    sharesOutstanding,
    operatingMargin,
    capexPercent
  );

  return { fairValuePerShare, assumptions, projectionYears, sensitivityTable };
}

function generateSensitivityTable(
  fcf: number,
  baseGrowth: number,
  baseDiscount: number,
  baseTerminal: number,
  totalRevenue?: number,
  sharesOutstanding: number = 1e9,
  operatingMargin: number = 0.25,
  capexPercent: number = 0.05
): number[][] {
  const growthRates = [-0.02, -0.01, 0, 0.01, 0.02].map(
    (d) => baseGrowth + d
  );
  const discountRates = [-0.01, -0.005, 0, 0.005, 0.01].map(
    (d) => baseDiscount + d
  );

  return discountRates.map((dr) =>
    growthRates.map((gr) => {
      let rev = totalRevenue && totalRevenue > 0
        ? totalRevenue
        : fcf / Math.max(operatingMargin - capexPercent, 0.01);
      let pv = 0;
      for (let y = 1; y <= 5; y++) {
        rev *= 1 + gr;
        pv += (rev * operatingMargin * 0.8) / Math.pow(1 + dr, y);
      }
      const termFcf = rev * operatingMargin * 0.8;
      const termValue = (termFcf * (1 + baseTerminal)) / (dr - baseTerminal);
      const ev = pv + termValue / Math.pow(1 + dr, 5);
      return Math.round(ev / sharesOutstanding);
    })
  );
}

export function getValuationSignal(
  fairValue: number,
  currentPrice: number
): string {
  const margin = (fairValue - currentPrice) / currentPrice;
  if (margin > 0.2) return "undervalued";
  if (margin > 0.05) return "slightly_undervalued";
  if (margin < -0.2) return "overvalued";
  if (margin < -0.05) return "slightly_overvalued";
  return "fairly_valued";
}
