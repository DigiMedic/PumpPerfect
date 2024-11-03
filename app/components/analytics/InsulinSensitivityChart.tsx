import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface InsulinSensitivityProps {
    data: {
        time: string;
        insulin_amount: number;
        glucose_drop: number;
        sensitivity: number;
    }[];
}

export const InsulinSensitivityChart: React.FC<InsulinSensitivityProps> = ({ data }) => {
    const averageSensitivity = data.reduce((acc, curr) => acc + curr.sensitivity, 0) / data.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Citlivost na inzulín</CardTitle>
                <CardDescription>
                    Průměrný pokles: {averageSensitivity.toFixed(1)} mmol/L na 1U
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="insulin_amount" 
                            name="Dávka inzulínu"
                            unit=" U"
                        />
                        <YAxis 
                            dataKey="glucose_drop" 
                            name="Pokles glykémie"
                            unit=" mmol/L"
                        />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Dávka inzulínu
                                                </span>
                                                <span className="font-bold">
                                                    {data.insulin_amount.toFixed(1)} U
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Pokles glykémie
                                                </span>
                                                <span className="font-bold">
                                                    {data.glucose_drop.toFixed(1)} mmol/L
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Citlivost
                                                </span>
                                                <span className="font-bold">
                                                    {data.sensitivity.toFixed(1)} mmol/L/U
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Scatter 
                            data={data} 
                            fill="hsl(var(--primary))"
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 