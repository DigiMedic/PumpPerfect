import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HypoEvent } from "@/types";

interface HypoglycemiaChartProps {
    events: HypoEvent[];
}

export const HypoglycemiaChart: React.FC<HypoglycemiaChartProps> = ({ events }) => {
    // Příprava dat pro graf
    const chartData = events.map(event => {
        const date = new Date(event.timestamp);
        return {
            hour: date.getHours() + date.getMinutes() / 60,
            value: event.glucoseValue,
            hasBolusRelation: !!event.relatedBolus,
            bolusAmount: event.relatedBolus?.amount || 0,
            timestamp: event.timestamp
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rozložení hypoglykémií</CardTitle>
                <CardDescription>
                    Výskyt hypoglykémií během dne a jejich vztah k bolusům
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="hour"
                            type="number"
                            domain={[0, 24]}
                            tickFormatter={(hour) => `${Math.floor(hour)}:00`}
                            name="Čas"
                            label={{ value: 'Hodina dne', position: 'bottom' }}
                        />
                        <YAxis
                            dataKey="value"
                            name="Glykémie"
                            domain={[0, 4]}
                            label={{ value: 'Glykémie (mmol/L)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {new Date(data.timestamp).toLocaleString('cs-CZ')}
                                            </p>
                                            <p className="text-sm text-red-600">
                                                Glykémie: {data.value.toFixed(1)} mmol/L
                                            </p>
                                            {data.hasBolusRelation && (
                                                <p className="text-sm text-muted-foreground">
                                                    Předcházející bolus: {data.bolusAmount.toFixed(1)} U
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <ReferenceLine
                            y={3.9}
                            stroke="hsl(var(--destructive))"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Hranice hypoglykémie (3.9 mmol/L)',
                                position: 'right',
                                fill: 'hsl(var(--destructive))',
                                fontSize: 12
                            }}
                        />
                        <Scatter
                            name="Hypoglykémie bez bolusu"
                            data={chartData.filter(d => !d.hasBolusRelation)}
                            fill="hsl(var(--destructive))"
                            fillOpacity={0.6}
                        />
                        <Scatter
                            name="Hypoglykémie po bolusu"
                            data={chartData.filter(d => d.hasBolusRelation)}
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.6}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 