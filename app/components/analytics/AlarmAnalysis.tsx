import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from "lucide-react";

interface AlarmAnalysisProps {
    data: {
        hour: number;
        count: number;
    }[];
}

export const AlarmAnalysis = ({ data }: AlarmAnalysisProps) => {
    const totalAlarms = data.reduce((sum, item) => sum + item.count, 0);
    const maxHour = data.reduce((max, item) => item.count > max.count ? item : max, data[0]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribuce alarmů</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Nejvíce alarmů: {maxHour.count} ve {maxHour.hour}:00
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}:00`}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar
                            dataKey="count"
                            fill="hsl(var(--chart-3))"
                            radius={[4, 4, 0, 0]}
                            name="Počet alarmů"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 