import { ProcessedData, AnalyticsResult, GlucoseMetrics, DailyPattern } from "@/types";

const calculateGlucoseMetrics = (cgmData: ProcessedData['cgm']): GlucoseMetrics => {
    const values = cgmData
        .map(d => parseFloat(String(d['CGM Glucose Value (mmol/l)'])))
        .filter(v => !isNaN(v));

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );

    return {
        average: mean,
        median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
        std: std,
        cv: (std / mean) * 100,
        timeInRange: values.filter(v => v >= 3.9 && v <= 10.0).length / values.length * 100,
        timeBelow: values.filter(v => v < 3.9).length / values.length * 100,
        timeAbove: values.filter(v => v > 10.0).length / values.length * 100,
        gmi: 3.31 + (0.02392 * mean * 18),
        hypoEvents: values.filter(v => v < 3.9).length
    };
};

const calculateDailyPatterns = (data: DataRecord[], valueKey: string): DailyPattern[] => {
    const hourlyData: { [hour: number]: number[] } = {};
    
    data.forEach(record => {
        const hour = new Date(record.Timestamp || record.Time || '').getHours();
        const value = parseFloat(String(record[valueKey]));
        
        if (!isNaN(value)) {
            if (!hourlyData[hour]) hourlyData[hour] = [];
            hourlyData[hour].push(value);
        }
    });

    return Object.entries(hourlyData).map(([hour, values]) => ({
        hour: parseInt(hour),
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
        std: Math.sqrt(
            values.reduce((a, b) => 
                a + Math.pow(b - values.reduce((x, y) => x + y, 0) / values.length, 2), 
                0
            ) / values.length
        ),
        count: values.length
    }));
};

export const analyzeData = (data: ProcessedData): AnalyticsResult => {
    const glucoseMetrics = calculateGlucoseMetrics(data.cgm);
    
    return {
        avgGlucose: glucoseMetrics.average,
        glucoseMetrics,
        hypoEvents: [], // Implementováno v Python backendu
        timeInRange: glucoseMetrics.timeInRange,
        hourlyBasalMedian: [],
        hourlyBolusMedian: [],
        hypoAfterBolus: 0,
        totalHypos: glucoseMetrics.hypoEvents,
        dailyPatterns: {
            basal: calculateDailyPatterns(data.basal, 'Rate'),
            bolus: calculateDailyPatterns(data.bolus, 'Insulin Delivered (U)')
        },
        insulinSensitivity: [] // Implementováno v Python backendu
    };
}; 