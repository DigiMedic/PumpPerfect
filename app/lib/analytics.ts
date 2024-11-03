import { DataRecord } from "@/types/data";

export interface TimeSeriesDataPoint {
    time: string;
    value: number;
}

export interface HourlyMedian {
    hour: number;
    median: number;
    count: number;
}

export interface HypoEvent {
    timestamp: string;
    glucoseValue: number;
    relatedBolus?: {
        timestamp: string;
        amount: number;
    };
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

export const calculateHourlyMedians = (data: DataRecord[], valueKey: string): HourlyMedian[] => {
    const hourlyData: { [hour: number]: number[] } = {};
    
    data.forEach(record => {
        const date = new Date(record.Time || record.Timestamp || '');
        const hour = date.getHours();
        const value = parseFloat(String(record[valueKey] || '0'));
        
        if (!isNaN(value)) {
            if (!hourlyData[hour]) hourlyData[hour] = [];
            hourlyData[hour].push(value);
        }
    });

    return Object.entries(hourlyData).map(([hour, values]) => ({
        hour: parseInt(hour),
        median: calculateMedian(values),
        count: values.length
    })).sort((a, b) => a.hour - b.hour);
};

export const calculateMedian = (values: number[]): number => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
};

export const identifyHypoEvents = (
    cgmData: DataRecord[],
    bolusData: DataRecord[],
    threshold: number = 3.9
): HypoEvent[] => {
    const hypoEvents: HypoEvent[] = [];
    
    cgmData.forEach(record => {
        const glucoseValue = parseFloat(String(record['CGM Glucose Value (mmol/l)'] || '0'));
        const timestamp = record.Time || record.Timestamp || '';
        
        if (glucoseValue < threshold) {
            const event: HypoEvent = {
                timestamp,
                glucoseValue
            };
            
            // Hledání souvisejícího bolusu (2 hodiny před hypoglykémií)
            const hypoTime = new Date(timestamp);
            const twoHoursBefore = new Date(hypoTime.getTime() - 2 * 60 * 60 * 1000);
            
            const relatedBolus = bolusData.find(bolus => {
                const bolusTime = new Date(bolus.Time || bolus.Timestamp || '');
                return bolusTime >= twoHoursBefore && bolusTime <= hypoTime;
            });
            
            if (relatedBolus) {
                event.relatedBolus = {
                    timestamp: relatedBolus.Time || relatedBolus.Timestamp || '',
                    amount: parseFloat(String(relatedBolus['Insulin Delivered (U)'] || '0'))
                };
            }
            
            hypoEvents.push(event);
        }
    });
    
    return hypoEvents;
};

export const calculateTimeInRange = (
    cgmData: DataRecord[],
    lowerBound: number = 3.9,
    upperBound: number = 10.0
): number => {
    const values = cgmData.map(record => 
        parseFloat(String(record['CGM Glucose Value (mmol/l)'] || '0'))
    ).filter(value => !isNaN(value));

    if (!values.length) return 0;

    const inRange = values.filter(value => value >= lowerBound && value <= upperBound);
    return (inRange.length / values.length) * 100;
};

export const analyzeData = (data: {
    cgm: DataRecord[];
    basal: DataRecord[];
    bolus: DataRecord[];
}): AnalyticsResult => {
    const hypoEvents = identifyHypoEvents(data.cgm, data.bolus);
    const hourlyBasalMedian = calculateHourlyMedians(data.basal, 'Rate');
    const hourlyBolusMedian = calculateHourlyMedians(data.bolus, 'Insulin Delivered (U)');
    
    const cgmValues = data.cgm.map(record => 
        parseFloat(String(record['CGM Glucose Value (mmol/l)'] || '0'))
    ).filter(value => !isNaN(value));

    return {
        avgGlucose: cgmValues.reduce((a, b) => a + b, 0) / cgmValues.length,
        hypoEvents,
        timeInRange: calculateTimeInRange(data.cgm),
        hourlyBasalMedian,
        hourlyBolusMedian,
        hypoAfterBolus: hypoEvents.filter(event => event.relatedBolus).length,
        totalHypos: hypoEvents.length
    };
}; 