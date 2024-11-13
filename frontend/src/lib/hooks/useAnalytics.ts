import { useState, useEffect, useCallback } from 'react';
import { 
  TimeRange, 
  DateRange, 
  UseAnalyticsState,
  ProcessedData,
  AnalyticsResult,
  AnalyticsError 
} from '@/types/analytics';
import { api } from '@/lib/api/client';

const initialState: UseAnalyticsState = {
  data: null,
  rawData: null,
  isLoading: false,
  error: null,
  timeRange: '24h',
  progress: 0
};

const processDataToAnalyticsResult = (data: ProcessedData): AnalyticsResult => {
  return {
    averageGlucose: data.averageGlucose,
    timeInRange: data.timeInRange,
    hypoEvents: data.hypoEvents,
    glucoseData: data.glucoseData,
    dailyInsulin: data.insulinData,
    pumpStatus: data.pumpStatus,
    sessionId: data.sessionId
  };
};

export const useAnalytics = () => {
  const [state, setState] = useState<UseAnalyticsState>(initialState);

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get('/analytics/latest');
      
      if (!response.data) {
        throw new Error('No data available');
      }

      const processedData = response.data as ProcessedData;
      const analyticsResult = processDataToAnalyticsResult(processedData);

      setState(prev => ({
        ...prev,
        data: analyticsResult,
        rawData: processedData,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        data: null,
        rawData: null,
        isLoading: false,
        error: {
          message: error instanceof Error ? error.message : 'An error occurred',
          code: 'FETCH_ERROR'
        }
      }));
    }
  }, []);

  const setTimeRange = useCallback((range: TimeRange | DateRange) => {
    setState(prev => ({ ...prev, timeRange: range as TimeRange }));
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData, state.timeRange]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refreshData,
    setTimeRange
  };
};

export default useAnalytics;
