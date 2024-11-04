import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area } from 'recharts';
import { ChartContainer } from "../ui/chart-container";
import { CustomTooltip } from "./CustomTooltip";
import { DataRecord } from "@/types";

interface GlucoseChartProps {
    data: DataRecord[];
    timeRange: "24h" | "7d" | "30d";
    chartType: "line" | "area" | "scatter";
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({
    data,
    timeRange,
    chartType
}) => {
    const processedData = data.map(record => ({
        time: record.Time || record.Timestamp,
        value: parseFloat(String(record['CGM Glucose Value (mmol/l)'] || 0))
    }));

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Kontinuální monitoring glukózy</CardTitle>
                <CardDescription>Průběh glykémie za vybrané období</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ cgm: { color: "hsl(var(--chart-1))" } }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={processedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    try {
                                        return new Date(value).toLocaleTimeString('cs-CZ', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });
                                    } catch (e) {
                                        return value;
                                    }
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 20]}
                                ticks={[3.9, 10.0]}
                            />
                            <CustomTooltip type="cgm" />
                            {chartType === 'area' ? (
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--chart-1))"
                                    fill="hsl(var(--chart-1))"
                                    fillOpacity={0.2}
                                />
                            ) : (
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--chart-1))"
                                    strokeWidth={2}
                                    dot={chartType === 'scatter'}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}; 