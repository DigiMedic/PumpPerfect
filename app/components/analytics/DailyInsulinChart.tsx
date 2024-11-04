import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyMedian } from "@/types";

interface DailyInsulinChartProps {
    basalData: HourlyMedian[];
    bolusData: HourlyMedian[];
}

export const DailyInsulinChart: React.FC<DailyInsulinChartProps> = ({
    basalData,
    bolusData
}) => {
    // Kombinace dat pro graf
    const combinedData = Array.from({ length: 24 }, (_, hour) => {
        const basalPoint = basalData.find(d => d.hour === hour) || { median: 0, count: 0 };
        const bolusPoint = bolusData.find(d => d.hour === hour) || { median: 0, count: 0 };
        
        return {
            hour,
            basal: basalPoint.median,
            bolus: bolusPoint.median,
            basalCount: basalPoint.count,
            bolusCount: bolusPoint.count
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Denní profil inzulínu</CardTitle>
                <CardDescription>
                    Průměrné dávky inzulínu během dne
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={combinedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <defs>
                            <linearGradient id="basalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="bolusGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickFormatter={(hour) => `${hour}:00`}
                            domain={[0, 23]}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            label={{ value: 'Bazál (U/h)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Bolus (U)', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <p className="font-medium">{`${data.hour}:00`}</p>
                                        <div className="mt-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
                                                <span className="text-sm">
                                                    Bazál: {data.basal.toFixed(2)} U/h
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
                                                <span className="text-sm">
                                                    Bolus: {data.bolus.toFixed(2)} U
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="basal"
                            stroke="hsl(var(--chart-1))"
                            fill="url(#basalGradient)"
                            name="Bazál"
                        />
                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="bolus"
                            stroke="hsl(var(--chart-2))"
                            fill="url(#bolusGradient)"
                            name="Bolus"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 