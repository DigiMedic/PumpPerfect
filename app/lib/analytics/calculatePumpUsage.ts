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
    
    // Získání všech unikátních dat ze všech zdrojů
    const dates = new Set<string>();
    [...data.cgm, ...data.bolus, ...data.basal].forEach(record => {
        const date = new Date(record.Timestamp || record.Time || '').toISOString().split('T')[0];
        dates.add(date);
    });

    // Inicializace skóre pro každý den
    Array.from(dates).sort().forEach(date => {
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
    Object.keys(dailyScores).forEach(date => {
        const dayData = {
            cgm: data.cgm.filter(r => new Date(r.Timestamp || r.Time || '').toISOString().split('T')[0] === date),
            bolus: data.bolus.filter(r => new Date(r.Timestamp || r.Time || '').toISOString().split('T')[0] === date),
            basal: data.basal.filter(r => new Date(r.Timestamp || r.Time || '').toISOString().split('T')[0] === date)
        };

        // Analýza hypoglykémií
        dayData.cgm.forEach(record => {
            if (record['CGM Glucose Value (mmol/l)'] < THRESHOLDS.hypo) {
                dailyScores[date].hypos++;
                dailyScores[date].score += RISK_WEIGHTS.hypo;
            }
        });

        // Analýza bazálních změn
        let lastBasalRate: number | null = null;
        dayData.basal.forEach(record => {
            if (lastBasalRate !== null && record.Rate !== lastBasalRate) {
                dailyScores[date].manualAdjustments++;
                if (dailyScores[date].manualAdjustments > THRESHOLDS.maxBasalChanges) {
                    dailyScores[date].score += RISK_WEIGHTS.basalInterruption;
                }
            }
            lastBasalRate = record.Rate;
        });

        // Analýza bolusů
        MEAL_TIMES.forEach(mealTime => {
            const mealTimeStart = new Date(date);
            mealTimeStart.setHours(mealTime.start, 0, 0, 0);
            const mealTimeEnd = new Date(date);
            mealTimeEnd.setHours(mealTime.end, 0, 0, 0);

            const bolusesInMealTime = dayData.bolus.filter(bolus => {
                const bolusTime = new Date(bolus.Timestamp || bolus.Time || '');
                return bolusTime >= mealTimeStart && bolusTime <= mealTimeEnd;
            });

            if (bolusesInMealTime.length === 0) {
                dailyScores[date].delayedBoluses++;
                dailyScores[date].score += RISK_WEIGHTS.missedMeal;
            }
        });

        // Analýza stacking inzulínu
        dayData.bolus.forEach((bolus, index) => {
            const bolusTime = new Date(bolus.Timestamp || bolus.Time || '');
            const subsequentBoluses = dayData.bolus.slice(index + 1).filter(nextBolus => {
                const nextTime = new Date(nextBolus.Timestamp || nextBolus.Time || '');
                const timeDiff = (nextTime.getTime() - bolusTime.getTime()) / (1000 * 60);
                return timeDiff <= THRESHOLDS.stackingWindow;
            });

            if (subsequentBoluses.length > 0) {
                dailyScores[date].score += RISK_WEIGHTS.insulinStacking;
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