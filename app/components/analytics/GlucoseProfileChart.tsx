import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DataRecord } from "@/types";

interface GlucoseProfileChartProps {
    data: DataRecord[];
    timeRange: "24h" | "7d" | "30d";
}

export const GlucoseProfileChart: React.FC<GlucoseProfileChartProps> = ({ data, timeRange }) => {
    // Kontrola existence dat
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profil glykémie</CardTitle>
                    <CardDescription>Žádná data k zobrazení</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Nejsou dostupná CGM data</p>
                </CardContent>
            </Card>
        );
    }

    // Příprava dat pro graf
    const processedData = data
        .map(record => {
            const timestamp = record.Timestamp || record.Time;
            const value = record['CGM Glucose Value (mmol/l)'];
            
            // Kontrola validity hodnot
            if (!timestamp || !value) return null;
            
            const numericValue = typeof value === 'string' ? parseFloat(value) : value;
            if (isNaN(numericValue)) return null;

            return {
                timestamp,
                value: numericValue,
                hour: new Date(timestamp).getHours()
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (processedData.length === 0) {
        console.warn('No valid CGM records found:', data[0]);
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profil glykémie</CardTitle>
                    <CardDescription>Žádná platná data k zobrazení</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Data nejsou ve správném formátu</p>
                </CardContent>
            </Card>
        );
    }

    // Výpočet klouzavého průměru
    const calculateMovingAverage = (data: typeof processedData, window: number) => {
        return data.map((record, index) => {
            const start = Math.max(0, index - window);
            const end = index + 1;
            const values = data.slice(start, end).map(d => d.value);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            return {
                ...record,
                movingAverage: avg
            };
        });
    };

    const chartData = calculateMovingAverage(processedData, 6); // 30min průměr (při 5min intervalech)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil glykémie</CardTitle>
                <CardDescription>
                    Průběh glykémie s vyznačením cílového rozmezí
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(timestamp) => {
                                const date = new Date(timestamp);
                                return timeRange === "24h"
                                    ? date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
                                    : date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit' });
                            }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            domain={[0, 20]}
                            ticks={[3.9, 10]}
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
                                            <p className={`text-sm ${
                                                data.value < 3.9 ? 'text-red-600' :
                                                data.value > 10 ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                                Glykémie: {data.value.toFixed(1)} mmol/L
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Průměr: {data.movingAverage.toFixed(1)} mmol/L
                                            </p>
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
                                value: 'Hypoglykémie',
                                position: 'right',
                                fill: 'hsl(var(--destructive))',
                                fontSize: 12
                            }}
                        />
                        <ReferenceLine
                            y={10}
                            stroke="hsl(var(--warning))"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Hyperglykémie',
                                position: 'right',
                                fill: 'hsl(var(--warning))',
                                fontSize: 12
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            dot={false}
                            strokeWidth={1}
                        />
                        <Line
                            type="monotone"
                            dataKey="movingAverage"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 