import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart-container";
import { CustomTooltip } from "./CustomTooltip";

interface GlucoseChartProps {
    data: any[];
    title?: string;
    description?: string;
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ 
    data, 
    title = "Kontinuální monitoring glukózy",
    description = "Průběh glykémie za vybrané období"
}) => {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ cgm: { color: "hsl(var(--chart-1))" } }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}; 