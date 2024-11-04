import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area } from 'recharts';
import { TrendingUp } from "lucide-react";

interface GlucoseAnalysisProps {
    data: {
        time: string;
        cgm: number;
        bg?: number;
    }[];
}

export const GlucoseAnalysis = ({ data }: GlucoseAnalysisProps) => {
    const calculateTrend = () => {
        if (data.length < 2) return 0;
        const first = data[0].cgm;
        const last = data[data.length - 1].cgm;
        return ((last - first) / first * 100).toFixed(1);
    };

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Analýza glukózy</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trend: {calculateTrend()}% za sledované období
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleTimeString('cs-CZ', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 20]}
                            ticks={[3.9, 10.0]} // Cílové rozmezí
                        />
                        <Area
                            type="monotone"
                            dataKey="cgm"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.2}
                            name="CGM"
                        />
                        {data.some(d => d.bg !== undefined) && (
                            <Line
                                type="monotone"
                                dataKey="bg"
                                stroke="hsl(var(--chart-2))"
                                dot={true}
                                name="BG"
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 