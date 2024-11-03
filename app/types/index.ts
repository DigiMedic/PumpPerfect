export interface DataRecord {
    Time?: string;
    Timestamp?: string;
    'Insulin Delivered (U)'?: string | number;
    'CGM Glucose Value (mmol/l)'?: string | number;
    Rate?: string | number;
}

export interface ProcessedData {
    basal: DataRecord[];
    bolus: DataRecord[];
    insulin: DataRecord[];
    alarms: DataRecord[];
    bg: DataRecord[];
    cgm: DataRecord[];
}

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

export interface GlucoseMetrics {
    average: number;
    median: number;
    std: number;
    cv: number;  // Koeficient variace
    timeInRange: number;
    timeBelow: number;
    timeAbove: number;
    gmi: number;  // Glucose Management Indicator
    hypoEvents: number;
}

export interface DailyPattern {
    hour: number;
    mean: number;
    median: number;
    std: number;
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
    glucoseMetrics: GlucoseMetrics;
    dailyPatterns: {
        basal: DailyPattern[];
        bolus: DailyPattern[];
    };
    insulinSensitivity: {
        time: string;
        insulin_amount: number;
        glucose_drop: number;
        sensitivity: number;
    }[];
}

export type TimeRange = "24h" | "7d" | "30d";
export type ChartType = "line" | "area" | "scatter";

// Export typu pro server response
export type { ServerResponse } from '@/components/Dashboard';