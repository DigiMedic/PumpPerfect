import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { HourlyMedian } from '@/lib/analytics';

interface DailyProfileProps {
    basalData: HourlyMedian[];
    bolusData: HourlyMedian[];
}

export const DailyProfile: React.FC<DailyProfileProps> = ({ basalData, bolusData }) => {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Denní profil inzulínu</CardTitle>
                <CardDescription>Mediány dávek v průběhu dne</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickFormatter={(hour) => `${hour}:00`}
                            domain={[0, 23]}
                            type="number"
                        />
                        <YAxis yAxisId="basal" orientation="left" />
                        <YAxis yAxisId="bolus" orientation="right" />
                        
                        <Line
                            yAxisId="basal"
                            data={basalData}
                            type="stepAfter"
                            dataKey="median"
                            name="Bazál"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            yAxisId="bolus"
                            data={bolusData}
                            type="monotone"
                            dataKey="median"
                            name="Bolus"
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={2}
                            dot={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 