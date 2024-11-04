export interface DataRecord {
    Time?: string;
    Timestamp?: string;
    'Insulin Delivered (U)'?: string | number;
    'CGM Glucose Value (mmol/l)'?: string | number;
    Rate?: string | number;
}

export interface ChartProps {
    data: DataRecord[];
    title?: string;
    description?: string;
}

export type TimeRange = "24h" | "7d" | "30d";
export type ChartType = "line" | "area" | "scatter";

export interface ProcessedData {
    basal: DataRecord[];
    bolus: DataRecord[];
    insulin: DataRecord[];
    alarms: DataRecord[];
    bg: DataRecord[];
    cgm: DataRecord[];
}

export interface TimeSeriesDataPoint {
    time: string;
    value: number;
}

export interface ChartData {
    data: TimeSeriesDataPoint[];
    config: {
        color: string;
        label: string;
        threshold?: number;
    };
} 