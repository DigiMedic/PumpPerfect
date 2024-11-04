import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { HourlyMedian } from '@/lib/analytics';

interface HourlyMedianChartProps {
    data: HourlyMedian[];
    title: string;
    description?: string;
    color?: string;
    unit?: string;
}

export const HourlyMedianChart: React.FC<HourlyMedianChartProps> = ({
    data,
    title,
    description,
    color = "hsl(var(--chart-2))",
    unit = "U/h"
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload as HourlyMedian;
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Medián
                                                </span>
                                                <span className="font-bold">
                                                    {data.median.toFixed(2)} {unit}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Počet měření
                                                </span>
                                                <span className="font-bold">
                                                    {data.count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Line
                            type="stepAfter"
                            dataKey="median"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 