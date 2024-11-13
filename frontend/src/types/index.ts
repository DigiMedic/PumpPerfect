export * from './analytics';

export interface ProcessedData {
  timestamp: string;
  cgm?: number;
  bg?: number;
  basal?: number;
  bolus?: number;
  carbs?: number;
}

export type TimeRange = '24h' | '7d' | '14d' | '30d' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ChartConfig {
  timeRange: TimeRange;
  dateRange?: DateRange;
  showBasal?: boolean;
  showBolus?: boolean;
  showCarbs?: boolean;
}

export interface InsulinSensitivityData {
  time: string;
  insulin_amount: number;
  glucose_drop: number;
  sensitivity: number;
  confidence: number;
}

export interface PumpUsageData {
  totalTime: number;
  activeTime: number;
  suspendedTime: number;
  utilizationRate: number;
  dailyRiskScores?: Array<{
    date: string;
    score: number;
    hypos: number;
    manualAdjustments: number;
    delayedBoluses: number;
    details?: string[];
  }>;
}

export interface AnalyticsDashboardProps {
  data: AnalyticsResult;
  timeRange: TimeRange;
  rawData: ProcessedData[];
  showDetails?: boolean;
  chartType?: 'line' | 'area';
} 