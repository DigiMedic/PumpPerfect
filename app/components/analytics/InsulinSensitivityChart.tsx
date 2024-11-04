import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface InsulinSensitivityData {
    time: string;
    insulin_amount: number;
    glucose_drop: number;
    sensitivity: number;
}

interface InsulinSensitivityChartProps {
    data: InsulinSensitivityData[];
}

export const InsulinSensitivityChart: React.FC<InsulinSensitivityChartProps> = ({ data }) => {
    // Výpočet průměrné citlivosti
    const avgSensitivity = data.reduce((sum, item) => sum + item.sensitivity, 0) / data.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Citlivost na inzulín</CardTitle>
                <CardDescription>
                    Vztah mezi dávkou inzulínu a poklesem glykémie
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="insulin_amount"
                            type="number"
                            name="Dávka inzulínu"
                            label={{ value: 'Dávka inzulínu (U)', position: 'bottom' }}
                        />
                        <YAxis
                            dataKey="glucose_drop"
                            name="Pokles glykémie"
                            label={{ value: 'Pokles glykémie (mmol/L)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload as InsulinSensitivityData;
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                <span className="font-medium">Dávka: </span>
                                                {data.insulin_amount.toFixed(1)} U
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Pokles: </span>
                                                {data.glucose_drop.toFixed(1)} mmol/L
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Citlivost: </span>
                                                {data.sensitivity.toFixed(1)} mmol/L/U
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(data.time).toLocaleString('cs-CZ')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <ReferenceLine
                            y={0}
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="3 3"
                        />
                        <Scatter
                            data={data}
                            fill="hsl(var(--primary))"
                            fillOpacity={0.6}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-muted-foreground text-center">
                    Průměrná citlivost: {avgSensitivity.toFixed(1)} mmol/L/U
                </div>
            </CardContent>
        </Card>
    );
}; 