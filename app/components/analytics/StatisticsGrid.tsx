import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Statistics {
    avgGlucose: number;
    hypoEvents: number;
    timeInRange: number;
    medianBasal: number;
    medianBolus: number;
    hypoAfterBolus: number;
}

interface StatisticsGridProps {
    statistics: Statistics;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ statistics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Průměrná glykémie</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{statistics.avgGlucose} mmol/L</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Hypoglykemické události</CardTitle>
                    <CardDescription>Celkem / Po bolusu</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">
                        {statistics.hypoEvents} / {statistics.hypoAfterBolus}
                    </p>
                </CardContent>
            </Card>
            
            {/* ... další statistiky ... */}
        </div>
    );
}; 