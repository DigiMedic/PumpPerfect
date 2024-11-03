import { DataRecord } from "@/types";

export interface HypoEvent {
    timestamp: string;
    glucoseValue: number;
    relatedBolus?: {
        timestamp: string;
        amount: number;
    };
}

export interface HourlyMedian {
    hour: number;
    median: number;
    count: number;
}

export interface AnalyticsResult {
    avgGlucose: number;
    hypoEvents: HypoEvent[];
    timeInRange: number;
    hourlyBasalMedian: HourlyMedian[];
    hourlyBolusMedian: HourlyMedian[];
    hypoAfterBolus: number;
    totalHypos: number;
}

export const analyzeData = (data: {
    cgm: DataRecord[];
    basal: DataRecord[];
    bolus: DataRecord[];
}): AnalyticsResult => {
    // Implementace analytických funkcí
    return {
        avgGlucose: 0,
        hypoEvents: [],
        timeInRange: 0,
        hourlyBasalMedian: [],
        hourlyBolusMedian: [],
        hypoAfterBolus: 0,
        totalHypos: 0
    };
}; 