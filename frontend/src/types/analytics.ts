export interface AnalyticsResult {
  averageGlucose: number;
  timeInRange: number;
  glucoseData: GlucoseDataPoint[];
  insulinData: InsulinDataPoint[];
  glucoseMetrics: GlucoseMetrics;
  hourlyBasalMedian: HourlyMedian[];
  hourlyBolusMedian: HourlyMedian[];
  insulinSensitivity: InsulinSensitivity[];
  hypoEvents: HypoEvent[];
  totalHypos: number;
  hypoAfterBolus: number;
  batteryLevel?: number;
  activeInsulin?: number;
  pumpUsage?: PumpUsage;
}

export interface GlucoseDataPoint {
  timestamp: string;
  value: number;
  trend?: string;
}

export interface InsulinDataPoint {
  timestamp: string;
  value: number;
  type: 'bolus' | 'basal';
}

export interface HypoEvent {
  startTime: string;
  endTime: string;
  duration: number;
  lowestValue: number;
}

export type TimeRange = '24h' | '7d' | '14d' | '30d' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface GlucoseMetrics {
  average: number;
  timeInRange: number;
  timeBelow: number;
  timeAbove: number;
  cv: number;
  standardDeviation: number;
  gmi: number;
}

export interface HourlyMedian {
  hour: number;
  median: number;
  q1: number;
  q3: number;
  count: number;
}

export interface InsulinSensitivity {
  time: string;
  insulin_amount: number;
  glucose_drop: number;
  sensitivity: number;
  confidence: number;
}

export interface PumpUsage {
  totalTime: number;
  activeTime: number;
  suspendedTime: number;
  utilizationRate: number;
  dailyRiskScores?: DailyRiskScore[];
}

export interface DailyRiskScore {
  date: string;
  score: number;
  hypos: number;
  manualAdjustments: number;
  delayedBoluses: number;
  details?: string[];
}
