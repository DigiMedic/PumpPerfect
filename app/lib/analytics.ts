import { ProcessedData, AnalyticsResult, GlucoseMetrics } from "@/types";

// Helper funkce pro výpočet glukózových metrik
const calculateGlucoseMetrics = (cgmData: ProcessedData['cgm']): GlucoseMetrics => {
    if (!cgmData || cgmData.length === 0) {
        console.warn('No CGM data available');
        return {
            average: 0,
            median: 0,
            std: 0,
            cv: 0,
            timeInRange: 0,
            timeBelow: 0,
            timeAbove: 0,
            gmi: 0,
            hypoEvents: 0
        };
    }

    // Extrahujeme hodnoty glukózy
    const values = cgmData
        .map(record => {
            const value = record['CGM Glucose Value (mmol/l)'];
            return typeof value === 'string' ? parseFloat(value) : value;
        })
        .filter((value): value is number => !isNaN(value) && value !== null);

    if (values.length === 0) {
        console.warn('No valid glucose values found');
        return {
            average: 0,
            median: 0,
            std: 0,
            cv: 0,
            timeInRange: 0,
            timeBelow: 0,
            timeAbove: 0,
            gmi: 0,
            hypoEvents: 0
        };
    }

    // Výpočet statistik
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(values.length / 2)];
    
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(variance);

    const inRange = values.filter(v => v >= 3.9 && v <= 10.0).length;
    const below = values.filter(v => v < 3.9).length;
    const above = values.filter(v => v > 10.0).length;

    return {
        average: mean,
        median: median,
        std: std,
        cv: (std / mean) * 100,
        timeInRange: (inRange / values.length) * 100,
        timeBelow: (below / values.length) * 100,
        timeAbove: (above / values.length) * 100,
        gmi: 3.31 + (0.02392 * mean * 18),
        hypoEvents: below
    };
};

// Helper funkce pro výpočet hodinových mediánů
const calculateHourlyMedians = (data: any[], valueKey: string) => {
    if (!data || data.length === 0) return [];

    const hourlyData: { [key: number]: number[] } = {};
    
    data.forEach(record => {
        const timestamp = record.Timestamp || record.Time;
        if (!timestamp) return;

        try {
            const hour = new Date(timestamp).getHours();
            const value = typeof record[valueKey] === 'string' 
                ? parseFloat(record[valueKey]) 
                : record[valueKey];

            if (!isNaN(value)) {
                if (!hourlyData[hour]) {
                    hourlyData[hour] = [];
                }
                hourlyData[hour].push(value);
            }
        } catch (error) {
            console.error('Error processing record:', error);
        }
    });

    return Object.entries(hourlyData)
        .map(([hour, values]) => ({
            hour: parseInt(hour),
            median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
            count: values.length
        }))
        .sort((a, b) => a.hour - b.hour);
};

// Hlavní funkce pro analýzu dat
export const analyzeData = (data: ProcessedData): AnalyticsResult => {
    console.log('Analyzing data:', {
        basalCount: data.basal?.length,
        bolusCount: data.bolus?.length,
        cgmCount: data.cgm?.length
    });

    const glucoseMetrics = calculateGlucoseMetrics(data.cgm);
    const hourlyBasal = calculateHourlyMedians(data.basal, 'Rate');
    const hourlyBolus = calculateHourlyMedians(data.bolus, 'Insulin Delivered (U)');

    return {
        avgGlucose: glucoseMetrics.average,
        glucoseMetrics,
        hypoEvents: [],  // Implementováno později
        timeInRange: glucoseMetrics.timeInRange,
        hourlyBasalMedian: hourlyBasal,
        hourlyBolusMedian: hourlyBolus,
        hypoAfterBolus: 0,  // Implementováno později
        totalHypos: glucoseMetrics.hypoEvents,
        dailyPatterns: {
            basal: hourlyBasal,
            bolus: hourlyBolus
        },
        insulinSensitivity: []  // Implementováno později
    };
};