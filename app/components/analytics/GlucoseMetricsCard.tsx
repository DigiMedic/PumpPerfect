import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target, AlertTriangle, TrendingUp } from "lucide-react";
import { GlucoseMetrics } from "@/types";

interface GlucoseMetricsCardProps {
    metrics: GlucoseMetrics;
}

export const GlucoseMetricsCard: React.FC<GlucoseMetricsCardProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Průměrná glykémie
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.average.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                        mmol/L (GMI: {metrics.gmi.toFixed(1)}%)
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
                    <div className="text-2xl font-bold">{metrics.timeInRange.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        3.9 - 10.0 mmol/L
                    </p>
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
                    <div className="text-2xl font-bold">{metrics.cv.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        CV (cíl: {'<'}36%)
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
                    <div className="text-2xl font-bold">{metrics.timeBelow.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        času pod 3.9 mmol/L
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}; 