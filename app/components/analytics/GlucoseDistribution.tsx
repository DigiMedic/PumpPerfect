import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity } from "lucide-react";

interface GlucoseDistributionProps {
    data: {
        value: number;
        frequency: number;
    }[];
}

export const GlucoseDistribution = ({ data }: GlucoseDistributionProps) => {
    const inRange = data.filter(d => d.value >= 3.9 && d.value <= 10.0)
        .reduce((sum, item) => sum + item.frequency, 0);
    const total = data.reduce((sum, item) => sum + item.frequency, 0);
    const timeInRange = ((inRange / total) * 100).toFixed(1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribuce glykémie</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Čas v cílovém rozmezí: {timeInRange}%
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="value"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="frequency"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 