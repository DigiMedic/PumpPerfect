import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { HourlyMedian } from "@/types";

interface DailyProfileProps {
    basalData: HourlyMedian[];
    bolusData: HourlyMedian[];
}

export const DailyProfile: React.FC<DailyProfileProps> = ({ basalData, bolusData }) => {
    const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

    return (
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                        dataKey="hour"
                        tickFormatter={formatHour}
                        domain={[0, 23]}
                        type="number"
                        tickCount={24}
                        className="text-sm"
                    />
                    <YAxis 
                        yAxisId="basal"
                        orientation="left"
                        tickLine={false}
                        axisLine={false}
                        className="text-sm"
                        label={{ 
                            value: 'Bazál (U/h)', 
                            angle: -90, 
                            position: 'insideLeft',
                            className: "text-sm fill-muted-foreground"
                        }}
                    />
                    <YAxis 
                        yAxisId="bolus"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        className="text-sm"
                        label={{ 
                            value: 'Bolus (U)', 
                            angle: 90, 
                            position: 'insideRight',
                            className: "text-sm fill-muted-foreground"
                        }}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <p className="text-sm font-medium">
                                        {formatHour(payload[0].payload.hour)}
                                    </p>
                                    <div className="mt-1 space-y-1">
                                        {payload.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div 
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {entry.name === 'basal' ? 'Bazál: ' : 'Bolus: '}
                                                    {entry.value.toFixed(2)} U
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <Line
                        yAxisId="basal"
                        data={basalData}
                        type="stepAfter"
                        dataKey="median"
                        name="basal"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        yAxisId="bolus"
                        data={bolusData}
                        type="monotone"
                        dataKey="median"
                        name="bolus"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        dot={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}; 