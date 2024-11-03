import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Clock, Target } from 'lucide-react';

interface StatisticsSummaryProps {
    avgGlucose: number;
    timeInRange: number;
    totalHypos: number;
    hypoAfterBolus: number;
}

export const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({
    avgGlucose,
    timeInRange,
    totalHypos,
    hypoAfterBolus
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Průměrná glykémie
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgGlucose.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                        mmol/L
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
                    <div className="text-2xl font-bold">{timeInRange.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        3.9 - 10.0 mmol/L
                    </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Hypoglykémie
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalHypos}</div>
                    <p className="text-xs text-muted-foreground">
                        celkový počet událostí
                    </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Po bolusu
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{hypoAfterBolus}</div>
                    <p className="text-xs text-muted-foreground">
                        hypo do 2h po bolusu
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}; 