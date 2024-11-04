import React from 'react';
import { GlucoseProfileChart } from './GlucoseProfileChart';
import { GlucoseDistributionChart } from './GlucoseDistributionChart';
import { DailyInsulinChart } from './DailyInsulinChart';
import { HypoglycemiaChart } from './HypoglycemiaChart';
import { InsulinSensitivityChart } from './InsulinSensitivityChart';
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target, AlertTriangle, TrendingUp } from "lucide-react";
import { AnalyticsResult, TimeRange, ProcessedData } from "@/types";

interface AnalyticsDashboardProps {
    data: AnalyticsResult;
    timeRange: TimeRange;
    rawData: ProcessedData;
    showDetails: boolean;
    chartType: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
    data,
    timeRange,
    rawData,
    showDetails,
    chartType
}) => {
    if (!data || !rawData) {
        return (
            <Card>
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">
                        Nejsou dostupná žádná data pro analýzu
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Kontrola existence všech potřebných metrik
    if (!data.glucoseMetrics || !data.timeInRange || !data.hourlyBasalMedian) {
        console.error('Missing required metrics:', data);
        return (
            <Card>
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">
                        Chybí potřebné metriky pro analýzu
                    </p>
                </CardContent>
            </Card>
        );
    }

    console.log('Analytics Dashboard Data:', {
        rawData,
        processedData: data,
        timeRange
    });

    return (
        <div className="space-y-8">
            {/* Statistické karty */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Průměrná glykémie
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.glucoseMetrics.average.toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            mmol/L (GMI: {data.glucoseMetrics.gmi.toFixed(1)}%)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Čas v cílovém rozmezí
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.timeInRange.toFixed(1)}%
                        </div>
                        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${data.timeInRange}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Variabilita glukózy
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.glucoseMetrics.cv.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Koeficient variace (cíl: {'<'}36%)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Hypoglykémie
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.totalHypos}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {data.hypoAfterBolus} po bolusu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Hlavní grafy */}
            <div className="grid gap-4 md:grid-cols-2">
                <Section title="Průběh glykémie" description="Kontinuální monitoring glukózy">
                    <GlucoseProfileChart data={rawData.cgm} timeRange={timeRange} />
                </Section>

                <Section title="Distribuce glykémií" description="Rozložení hodnot glukózy">
                    <GlucoseDistributionChart data={rawData.cgm} />
                </Section>
            </div>

            {/* Inzulínové grafy */}
            <div className="grid gap-4 md:grid-cols-2">
                <Section title="Denní profil inzulínu" description="Bazální a bolusové dávky">
                    <DailyInsulinChart 
                        basalData={data.hourlyBasalMedian}
                        bolusData={data.hourlyBolusMedian}
                    />
                </Section>

                <Section title="Citlivost na inzulín" description="Analýza účinku bolusových dávek">
                    <InsulinSensitivityChart data={data.insulinSensitivity} />
                </Section>
            </div>

            {/* Hypoglykémie */}
            <Section title="Analýza hypoglykémií" description="Výskyt a souvislosti s bolusy">
                <div className="grid gap-4 md:grid-cols-2">
                    <HypoglycemiaChart events={data.hypoEvents} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Souhrn hypoglykémií</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Celkový počet</span>
                                    <span className="font-bold">{data.totalHypos}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Po bolusu</span>
                                    <span className="font-bold">{data.hypoAfterBolus}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>% času pod cílem</span>
                                    <span className="font-bold">
                                        {data.glucoseMetrics.timeBelow.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Section>
        </div>
    );
}; 