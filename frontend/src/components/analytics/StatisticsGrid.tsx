import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsResult } from "@/types";

interface StatisticsGridProps {
    statistics: AnalyticsResult;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ statistics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Průměrná glykémie</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{statistics.avgGlucose.toFixed(1)} mmol/L</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Čas v cílovém rozmezí</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{statistics.timeInRange.toFixed(1)}%</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Hypoglykémie</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">
                        {statistics.totalHypos} ({statistics.hypoAfterBolus} po bolusu)
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}; 