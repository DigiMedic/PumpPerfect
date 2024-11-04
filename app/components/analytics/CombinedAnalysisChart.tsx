import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, 
         CartesianGrid, Tooltip, Legend, Scatter, ReferenceLine } from 'recharts';
import { chartConfig } from '@/components/ui/charts/config';

interface CombinedAnalysisChartProps {
    data: Array<{
        time: string;
        glucose: number;
        basalRate?: number;
        bolusAmount?: number;
        isHypo?: boolean;
        isMeal?: boolean;
    }>;
    title?: string;
    description?: string;
}

export const CombinedAnalysisChart: React.FC<CombinedAnalysisChartProps> = ({
    data,
    title = "Analýza glykémie a inzulínu",
    description = "Detailní přehled glykémie, bazálních a bolusových dávek"
}) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload) return null;
        
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border">
                <p className="font-bold">{new Date(label).toLocaleTimeString('cs-CZ')}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value?.toFixed(1)} 
                        {entry.dataKey === 'glucose' ? ' mmol/L' : ' U'}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        
                        {/* Časová osa */}
                        <XAxis 
                            dataKey="time" 
                            scale="time"
                            type="category"
                            tickFormatter={(time) => new Date(time).toLocaleTimeString('cs-CZ', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        />

                        {/* Osa pro glykémii */}
                        <YAxis 
                            yAxisId="glucose"
                            domain={[0, 20]}
                            label={{ 
                                value: 'Glykémie (mmol/L)', 
                                angle: -90, 
                                position: 'insideLeft' 
                            }}
                        />

                        {/* Osa pro inzulín */}
                        <YAxis 
                            yAxisId="insulin"
                            orientation="right"
                            domain={[0, 10]}
                            label={{ 
                                value: 'Inzulín (U)', 
                                angle: 90, 
                                position: 'insideRight' 
                            }}
                        />

                        {/* Referenční čáry pro rozsahy */}
                        <ReferenceLine 
                            y={3.9} 
                            yAxisId="glucose"
                            stroke={chartConfig.colors.events.hypo}
                            strokeDasharray="3 3"
                            label={{ value: 'Hypo', position: 'right' }}
                        />
                        <ReferenceLine 
                            y={10} 
                            yAxisId="glucose"
                            stroke={chartConfig.colors.events.warning}
                            strokeDasharray="3 3"
                            label={{ value: 'Hyper', position: 'right' }}
                        />

                        {/* Glykémie */}
                        <Line
                            type="monotone"
                            dataKey="glucose"
                            stroke={chartConfig.colors.events.hypo}
                            yAxisId="glucose"
                            dot={false}
                            name="Glykémie"
                        />

                        {/* Bazální dávky */}
                        <Line
                            type="step"
                            dataKey="basalRate"
                            stroke={chartConfig.colors.events.basal}
                            strokeDasharray="3 3"
                            yAxisId="insulin"
                            name="Bazál"
                        />

                        {/* Bolusy */}
                        <Scatter
                            dataKey="bolusAmount"
                            fill={chartConfig.colors.events.bolus}
                            yAxisId="insulin"
                            name="Bolus"
                        />

                        {/* Jídla */}
                        {data.filter(d => d.isMeal).map((meal, index) => (
                            <ReferenceLine
                                key={index}
                                x={meal.time}
                                stroke={chartConfig.colors.events.meal}
                                strokeDasharray="3 3"
                            />
                        ))}

                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 