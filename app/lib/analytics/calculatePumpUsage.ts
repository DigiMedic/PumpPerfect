import { ProcessedData, PumpUsageData, DetailedDayData, DailyRiskScore } from '@/types';

interface MealTimeWindow {
    start: number;
    end: number;
    name: string;
}

const MEAL_TIMES: MealTimeWindow[] = [
    { start: 6, end: 9, name: 'snídaně' },
    { start: 11, end: 14, name: 'oběd' },
    { start: 17, end: 20, name: 'večeře' }
];

const RISK_WEIGHTS = {
    missedMeal: 2,
    basalInterruption: 2,
    delayedBolus: 2,
    insulinStacking: 3,
    hypo: 3,
    hypoAfterBolus: 4
};

const THRESHOLDS = {
    hypo: 3.9,
    hyper: 10.0,
    maxBasalChanges: 2,
    bolusDelay: 30,
    hypoWindow: 120,
    stackingWindow: 240
};

const sortDataByDate = (data: ProcessedData): ProcessedData => {
    return {
        ...data,
        cgm: [...data.cgm].sort((a, b) => {
            const timeA = new Date(a.Timestamp || a.Time || '').getTime();
            const timeB = new Date(b.Timestamp || b.Time || '').getTime();
            return timeA - timeB;
        }),
        bolus: [...data.bolus].sort((a, b) => {
            const timeA = new Date(a.Timestamp || a.Time || '').getTime();
            const timeB = new Date(b.Timestamp || b.Time || '').getTime();
            return timeA - timeB;
        }),
        basal: [...data.basal].sort((a, b) => {
            const timeA = new Date(a.Timestamp || a.Time || '').getTime();
            const timeB = new Date(b.Timestamp || b.Time || '').getTime();
            return timeA - timeB;
        })
    };
};

const getAllDates = (data: ProcessedData): string[] => {
    const dates = new Set<string>();
    
    data.cgm.forEach(record => {
        const date = new Date(record.Timestamp || record.Time || '').toISOString().split('T')[0];
        dates.add(date);
    });

    return Array.from(dates).sort();
};

const initializeDailyScore = (scores: { [key: string]: DailyRiskScore }, date: string) => {
    scores[date] = {
        date,
        score: 0,
        manualAdjustments: 0,
        hypos: 0,
        delayedBoluses: 0
    };
};

const prepareDetailedData = (data: ProcessedData): DetailedDayData[] => {
    const detailedData: DetailedDayData[] = [];
    
    // Seřadíme CGM data podle času
    const sortedCGM = [...data.cgm].sort((a, b) => {
        const timeA = new Date(a.Timestamp || a.Time || '').getTime();
        const timeB = new Date(b.Timestamp || b.Time || '').getTime();
        return timeA - timeB;
    });

    // Pro každý CGM záznam najdeme odpovídající bolus a bazál
    sortedCGM.forEach(cgmRecord => {
        const timestamp = cgmRecord.Timestamp || cgmRecord.Time || '';
        const cgmTime = new Date(timestamp).getTime();

        // Najdeme nejbližší bolus
        const nearestBolus = data.bolus.find(bolus => {
            const bolusTime = new Date(bolus.Timestamp || bolus.Time || '').getTime();
            return Math.abs(bolusTime - cgmTime) < 5 * 60 * 1000; // 5 minut tolerance
        });

        // Najdeme aktuální bazální dávku
        const currentBasal = data.basal.find(basal => {
            const basalTime = new Date(basal.Timestamp || basal.Time || '').getTime();
            return Math.abs(basalTime - cgmTime) < 30 * 60 * 1000; // 30 minut tolerance
        });

        // Kontrola, zda je čas v době jídla
        const hour = new Date(timestamp).getHours();
        const isMealTime = MEAL_TIMES.some(meal => 
            hour >= meal.start && hour <= meal.end
        );

        detailedData.push({
            timestamp,
            glucoseValue: cgmRecord['CGM Glucose Value (mmol/l)'],
            bolusAmount: nearestBolus ? nearestBolus['Insulin Delivered (U)'] : undefined,
            basalRate: currentBasal ? currentBasal.Rate : undefined,
            mealTime: isMealTime,
            isHypo: cgmRecord['CGM Glucose Value (mmol/l)'] < 3.9
        });
    });

    return detailedData;
};

export const calculatePumpUsage = (data: ProcessedData): PumpUsageData => {
    // Kontrola vstupních dat
    if (!data || !data.cgm || !data.bolus || !data.basal) {
        console.error('Invalid input data:', data);
        throw new Error('Neplatná vstupní data pro analýzu');
    }

    try {
        const sortedData = sortDataByDate(data);
        console.log('Sorted data:', sortedData); // Debug log

        const dailyAnalysis = analyzeDailyPatterns(sortedData);
        console.log('Daily analysis:', dailyAnalysis); // Debug log

        const detailedData = prepareDetailedData(sortedData);
        console.log('Detailed data:', detailedData); // Debug log

        return {
            dailyRiskScores: dailyAnalysis,
            detailedData
        };
    } catch (error) {
        console.error('Error in calculatePumpUsage:', error);
        throw error;
    }
};

const analyzeDailyPatterns = (data: ProcessedData): DailyRiskScore[] => {
    const dailyScores: { [key: string]: DailyRiskScore } = {};
    
    // Inicializace skóre pro každý den
    const dates = getAllDates(data);
    dates.forEach(date => {
        dailyScores[date] = {
            date,
            score: 0,
            manualAdjustments: 0,
            hypos: 0,
            delayedBoluses: 0,
            details: {
                hypoAfterBolus: 0,
                basalChanges: 0,
                insulinStacking: 0
            }
        };
    });

    // Analýza pro každý den
    dates.forEach(date => {
        // 1. Kontrola bazálních změn
        const basalChanges = countBasalChanges(data.basal, date);
        if (basalChanges > THRESHOLDS.maxBasalChanges) {
            dailyScores[date].manualAdjustments = basalChanges;
            dailyScores[date].score += basalChanges * RISK_WEIGHTS.basalInterruption;
            dailyScores[date].details.basalChanges = basalChanges;
        }

        // 2. Kontrola hypoglykémií po bolusech
        data.bolus.forEach(bolus => {
            const bolusDate = new Date(bolus.Timestamp || bolus.Time || '').toISOString().split('T')[0];
            if (bolusDate === date && detectHypoAfterBolus(bolus, data.cgm, date)) {
                dailyScores[date].hypos++;
                dailyScores[date].score += RISK_WEIGHTS.hypoAfterBolus;
                dailyScores[date].details.hypoAfterBolus++;
            }
        });

        // 3. Kontrola opožděných bolusů
        MEAL_TIMES.forEach(mealTime => {
            const mealDateTime = new Date(date);
            mealDateTime.setHours(mealTime.start);
            if (detectDelayedBolus(mealDateTime, data.bolus)) {
                dailyScores[date].delayedBoluses++;
                dailyScores[date].score += RISK_WEIGHTS.delayedBolus;
            }
        });
    });

    return Object.values(dailyScores);
};

const detectHypoAfterBolus = (
    bolus: BolusRecord,
    cgmData: CGMRecord[],
    date: string
): boolean => {
    const bolusTime = new Date(bolus.Timestamp || bolus.Time || '');
    const endWindow = new Date(bolusTime.getTime() + THRESHOLDS.hypoWindow * 60 * 1000);

    return cgmData.some(record => {
        const recordTime = new Date(record.Timestamp || record.Time || '');
        return recordTime >= bolusTime &&
               recordTime <= endWindow &&
               record['CGM Glucose Value (mmol/l)'] < THRESHOLDS.hypo;
    });
};

const detectDelayedBolus = (
    mealTime: Date,
    bolusData: BolusRecord[]
): boolean => {
    return !bolusData.some(bolus => {
        const bolusTime = new Date(bolus.Timestamp || bolus.Time || '');
        const timeDiff = (bolusTime.getTime() - mealTime.getTime()) / (1000 * 60);
        return Math.abs(timeDiff) <= THRESHOLDS.bolusDelay;
    });
};

const countBasalChanges = (
    basalData: BasalRecord[],
    date: string
): number => {
    let changes = 0;
    let lastRate: number | null = null;

    basalData.forEach(record => {
        const recordDate = new Date(record.Timestamp || record.Time || '').toISOString().split('T')[0];
        if (recordDate === date && lastRate !== null && record.Rate !== lastRate) {
            changes++;
        }
        lastRate = record.Rate;
    });

    return changes;
};

// Pomocné funkce zůstávají stejné... 