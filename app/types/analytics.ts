export interface PumpUsageData {
    dailyRiskScores: DailyRiskScore[];
    detailedData?: DetailedDayData[];
}

export interface DailyRiskScore {
    date: string;
    score: number;
    manualAdjustments: number;
    hypos: number;
    delayedBoluses: number;
    details: {
        hypoAfterBolus: number;
        basalChanges: number;
        insulinStacking: number;
    };
}

export interface DetailedDayData {
    timestamp: string;
    glucoseValue: number;
    bolusAmount?: number;
    basalRate?: number;
    mealTime?: boolean;
    isHypo?: boolean;
}

export interface DetailedAnalysis {
  dailyStats: {
    date: string;
    hypos: number;
    hypers: number;
    meanGlucose: number;
    timeInRange: number;
    totalInsulin: number;
    basalTotal: number;
    bolusTotal: number;
  }[];
  riskFactors: {
    hypoRisk: number;
    hyperRisk: number;
    variabilityRisk: number;
    totalRisk: number;
  };
  recommendations: string[];
} 