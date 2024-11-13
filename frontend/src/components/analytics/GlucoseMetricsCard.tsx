import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Target, AlertTriangle, TrendingUp } from "lucide-react";
import { GlucoseMetrics } from "@/types";

interface GlucoseMetricsCardProps {
    metrics: GlucoseMetrics;
}

export const GlucoseMetricsCard: React.FC<GlucoseMetricsCardProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Průměrná glykémie
                            </p>
                            <p className="text-3xl font-bold">{metrics.average.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">mmol/L</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">GMI</p>
                            <p className="text-sm text-muted-foreground">{metrics.gmi.toFixed(1)}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Čas v cílovém rozmezí
                        </p>
                        <p className="text-3xl font-bold">{metrics.timeInRange.toFixed(1)}%</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>3.9 - 10.0 mmol/L</span>
                            <span>{(24 * metrics.timeInRange / 100).toFixed(1)}h/den</span>
                        </div>
                    </div>
                    <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${metrics.timeInRange}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Variabilita glukózy
                        </p>
                        <p className="text-3xl font-bold">{metrics.cv.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                            CV (cíl: {'<'}36%)
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm">Stabilita:</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                            <div 
                                className={`h-full rounded-full ${
                                    metrics.cv <= 36 ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(100, (metrics.cv / 36) * 100)}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Hypoglykémie
                        </p>
                        <p className="text-3xl font-bold">{metrics.timeBelow.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                            času pod 3.9 mmol/L
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm">
                            <span>Počet událostí:</span>
                            <span className="font-medium">{metrics.hypoEvents}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Čas pod cílem:</span>
                            <span>{(24 * metrics.timeBelow / 100).toFixed(1)}h/den</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 