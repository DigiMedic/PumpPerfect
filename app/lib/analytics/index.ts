import { ProcessedData, AnalyticsResult } from "@/types";
import { calculatePumpUsage } from "./calculatePumpUsage";

export const analyzeData = async (data: ProcessedData): Promise<AnalyticsResult> => {
    console.log('Analyzing data:', data);

    try {
        // Základní validace dat
        if (!data.cgm || !data.basal || !data.bolus) {
            throw new Error('Chybí požadovaná data pro analýzu');
        }

        // Výpočet základních metrik
        const avgGlucose = calculateAverageGlucose(data.cgm);
        const glucoseMetrics = calculateGlucoseMetrics(data.cgm);
        const timeInRange = calculateTimeInRange(data.cgm);
        const hourlyBasalMedian = calculateHourlyMedian(data.basal);
        const hourlyBolusMedian = calculateHourlyMedian(data.bolus);
        const { hypoEvents, hypoAfterBolus, totalHypos } = analyzeHypoglycemia(data);
        const insulinSensitivity = calculateInsulinSensitivity(data);
        const pumpUsage = calculatePumpUsage(data);

        return {
            avgGlucose,
            glucoseMetrics,
            hypoEvents,
            timeInRange,
            hourlyBasalMedian,
            hourlyBolusMedian,
            hypoAfterBolus,
            totalHypos,
            dailyPatterns: {
                basal: hourlyBasalMedian,
                bolus: hourlyBolusMedian
            },
            insulinSensitivity,
            pumpUsage
        };
    } catch (error) {
        console.error('Error in analyzeData:', error);
        throw error;
    }
};

// Pomocné funkce pro výpočty... 