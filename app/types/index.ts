export interface DataRecord {
    Time?: string;
    Timestamp?: string;
    'Insulin Delivered (U)'?: string | number;
    'CGM Glucose Value (mmol/l)'?: string | number;
    Rate?: string | number;
}

export interface ProcessedData {
    basal: BasalRecord[];
    bolus: BolusRecord[];
    cgm: CGMRecord[];
    insulin?: InsulinRecord[];
    alarms?: AlarmRecord[];
    bg?: BGRecord[];
}

export interface BasalRecord {
    Timestamp?: string;
    Time?: string;
    Rate: number;
}

export interface BolusRecord {
    Timestamp?: string;
    Time?: string;
    'Insulin Delivered (U)': number;
}

export interface CGMRecord {
    Timestamp?: string;
    Time?: string;
    'CGM Glucose Value (mmol/l)': number;
}

export interface InsulinRecord {
    Timestamp?: string;
    Time?: string;
    'Total Daily Insulin (U)': number;
}

export interface AlarmRecord {
    Timestamp?: string;
    Time?: string;
    Type: string;
    Description?: string;
}

export interface BGRecord {
    Timestamp?: string;
    Time?: string;
    Value: number;
}

export interface GlucoseMetrics {
    average: number;
    median: number;
    std: number;
    cv: number;
    timeInRange: number;
    timeBelow: number;
    timeAbove: number;
    gmi: number;
    hypoEvents: number;
}

export interface HourlyMedian {
    hour: number;
    median: number;
    count: number;
}

export interface HypoEvent {
    timestamp: string;
    glucoseValue: number;
    duration: number;
    relatedBolus?: {
        timestamp: string;
        amount: number;
        timeDiff: number;
    };
}

export interface AnalyticsResult {
    avgGlucose: number;
    glucoseMetrics: GlucoseMetrics;
    hypoEvents: HypoEvent[];
    timeInRange: number;
    hourlyBasalMedian: HourlyMedian[];
    hourlyBolusMedian: HourlyMedian[];
    hypoAfterBolus: number;
    totalHypos: number;
    dailyPatterns: {
        basal: HourlyMedian[];
        bolus: HourlyMedian[];
    };
    insulinSensitivity: InsulinSensitivity[];
}

export type TimeRange = "24h" | "7d" | "30d";
export type ChartType = "line" | "area" | "scatter";

export const isValidProcessedData = (data: any): data is ProcessedData => {
    if (!data || typeof data !== 'object') return false;
    
    // Kontrola povinných polí
    if (!Array.isArray(data.basal) || !Array.isArray(data.bolus) || !Array.isArray(data.cgm)) {
        return false;
    }

    // Kontrola formátu záznamů
    const hasValidBasal = data.basal.every((record: any) => 
        (record.Timestamp || record.Time) && 
        typeof record.Rate === 'number'
    );

    const hasValidBolus = data.bolus.every((record: any) => 
        (record.Timestamp || record.Time) && 
        typeof record['Insulin Delivered (U)'] === 'number'
    );

    const hasValidCGM = data.cgm.every((record: any) => 
        (record.Timestamp || record.Time) && 
        typeof record['CGM Glucose Value (mmol/l)'] === 'number'
    );

    return hasValidBasal && hasValidBolus && hasValidCGM;
};