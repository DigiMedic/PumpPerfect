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
}

export interface DetailedDayData {
    timestamp: string;
    glucoseValue: number;
    bolusAmount?: number;
    basalRate?: number;
    mealTime?: boolean;
    isHypo?: boolean;
} 