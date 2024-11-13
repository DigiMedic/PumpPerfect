import { ProcessedData, PumpUsageData } from "@/types";

export function calculatePumpUsage(data: ProcessedData[]): PumpUsageData {
    if (!data?.length) {
        return {
            totalTime: 0,
            activeTime: 0,
            suspendedTime: 0,
            utilizationRate: 0,
            dailyRiskScores: []
        };
    }

    // Výpočet celkového času
    const startTime = new Date(data[0].timestamp).getTime();
    const endTime = new Date(data[data.length - 1].timestamp).getTime();
    const totalTime = (endTime - startTime) / (1000 * 60 * 60); // v hodinách

    // Výpočet aktivního času (kdy byla pumpa aktivní - měla bazál nebo bolus)
    const activeTimePoints = data.filter(point => point.basal > 0 || point.bolus > 0);
    const activeTime = activeTimePoints.length * 5 / 60; // předpokládáme 5-minutové intervaly

    // Výpočet času pozastavení
    const suspendedTime = totalTime - activeTime;

    // Výpočet míry využití
    const utilizationRate = (activeTime / totalTime) * 100;

    // Analýza denních rizik
    const dailyRiskScores = analyzeDailyRisks(data);

    return {
        totalTime,
        activeTime,
        suspendedTime,
        utilizationRate,
        dailyRiskScores
    };
}

function analyzeDailyRisks(data: ProcessedData[]) {
    // Seskupení dat podle dnů
    const dailyData = groupByDay(data);
    
    return Object.entries(dailyData).map(([date, dayData]) => {
        // Počet hypoglykémií (glykémie < 3.9)
        const hypos = dayData.filter(point => point.cgm !== undefined && point.cgm < 3.9).length;
        
        // Počet manuálních úprav bazálu (změny v bazálu)
        const basalChanges = countBasalChanges(dayData);
        
        // Počet opožděných bolusů (bolus při vysoké glykémii)
        const delayedBoluses = countDelayedBoluses(dayData);
        
        // Výpočet rizikového skóre
        const score = calculateRiskScore(hypos, basalChanges, delayedBoluses);
        
        return {
            date,
            score,
            hypos,
            manualAdjustments: basalChanges,
            delayedBoluses,
            details: generateRiskDetails(hypos, basalChanges, delayedBoluses)
        };
    });
}

function groupByDay(data: ProcessedData[]) {
    return data.reduce((acc, point) => {
        const date = new Date(point.timestamp).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(point);
        return acc;
    }, {} as Record<string, ProcessedData[]>);
}

function countBasalChanges(dayData: ProcessedData[]) {
    let changes = 0;
    for (let i = 1; i < dayData.length; i++) {
        if (dayData[i].basal !== dayData[i-1].basal) {
            changes++;
        }
    }
    return changes;
}

function countDelayedBoluses(dayData: ProcessedData[]) {
    let delayed = 0;
    for (let i = 0; i < dayData.length; i++) {
        if (dayData[i].bolus && dayData[i].cgm && dayData[i].cgm > 10) {
            delayed++;
        }
    }
    return delayed;
}

function calculateRiskScore(hypos: number, basalChanges: number, delayedBoluses: number): number {
    // Váhy pro různé faktory rizika
    const HYPO_WEIGHT = 2;
    const BASAL_CHANGE_WEIGHT = 0.5;
    const DELAYED_BOLUS_WEIGHT = 1;
    
    return (
        hypos * HYPO_WEIGHT +
        basalChanges * BASAL_CHANGE_WEIGHT +
        delayedBoluses * DELAYED_BOLUS_WEIGHT
    );
}

function generateRiskDetails(hypos: number, basalChanges: number, delayedBoluses: number): string[] {
    const details: string[] = [];
    
    if (hypos > 0) {
        details.push(`${hypos} hypoglykemických událostí`);
    }
    if (basalChanges > 5) {
        details.push(`${basalChanges} manuálních úprav bazálu`);
    }
    if (delayedBoluses > 0) {
        details.push(`${delayedBoluses} opožděných bolusů`);
    }
    
    return details;
} 