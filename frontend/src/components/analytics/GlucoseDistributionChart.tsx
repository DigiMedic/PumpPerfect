import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataRecord } from "@/types";

interface GlucoseDistributionChartProps {
    data: DataRecord[];
}

export const GlucoseDistributionChart: React.FC<GlucoseDistributionChartProps> = ({ data }) => {
    // Kontrola existence dat
    if (!data || !Array.isArray(data)) {
        console.warn('No data provided to GlucoseDistributionChart');
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Distribuce glykémií</CardTitle>
                    <CardDescription>Žádná data k zobrazení</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Nejsou dostupná žádná data pro zobrazení</p>
                </CardContent>
            </Card>
        );
    }

    // Příprava dat pro histogram
    const values = data
        .filter(record => record && record['CGM Glucose Value (mmol/l)']) // Kontrola existence záznamu a hodnoty
        .map(record => {
            const value = parseFloat(String(record['CGM Glucose Value (mmol/l)']));
            return isNaN(value) ? null : value;
        })
        .filter((value): value is number => value !== null);

    // Pokud nejsou žádná platná data
    if (values.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Distribuce glykémií</CardTitle>
                    <CardDescription>Žádná platná data k zobrazení</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Nejsou dostupná žádná platná data pro zobrazení</p>
                </CardContent>
            </Card>
        );
    }

    const binSize = 0.5; // Velikost intervalu (0.5 mmol/L)
    const bins = new Map<number, number>();

    // Vytvoření histogramu
    values.forEach(value => {
        const bin = Math.floor(value / binSize) * binSize;
        bins.set(bin, (bins.get(bin) || 0) + 1);
    });

    const chartData = Array.from(bins.entries())
        .map(([bin, count]) => ({
            range: bin,
            count,
            percentage: (count / values.length) * 100
        }))
        .sort((a, b) => a.range - b.range);

    // Výpočet statistik
    const inRange = values.filter(v => v >= 3.9 && v <= 10.0).length;
    const timeInRange = (inRange / values.length) * 100;
    const below = values.filter(v => v < 3.9).length;
    const above = values.filter(v => v > 10.0).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribuce glykémií</CardTitle>
                <CardDescription>
                    Čas v cílovém rozmezí: {timeInRange.toFixed(1)}%
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Pod cílem</p>
                        <p className="text-lg font-medium text-destructive">
                            {((below / values.length) * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">V cíli</p>
                        <p className="text-lg font-medium text-green-600">
                            {timeInRange.toFixed(1)}%
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Nad cílem</p>
                        <p className="text-lg font-medium text-yellow-600">
                            {((above / values.length) * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="range"
                                tickFormatter={(value) => value.toFixed(1)}
                                label={{ value: 'Glykémie (mmol/L)', position: 'bottom' }}
                            />
                            <YAxis
                                label={{ value: 'Četnost (%)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const data = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="space-y-1">
                                                <p className="font-medium">
                                                    {data.range.toFixed(1)} - {(data.range + binSize).toFixed(1)} mmol/L
                                                </p>
                                                <p className="text-sm">
                                                    Četnost: {data.count} měření
                                                </p>
                                                <p className="text-sm">
                                                    {data.percentage.toFixed(1)}% času
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Bar
                                dataKey="percentage"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}; 