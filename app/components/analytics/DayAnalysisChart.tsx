import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Scatter } from 'recharts';
import { chartConfig } from '@/components/ui/charts/config';

interface DayAnalysisChartProps {
  data: Array<{
    time: string;
    glucose: number;
    bolus?: number;
    basal?: number;
    isMeal?: boolean;
    isHypo?: boolean;
    isWarning?: boolean;
  }>;
  date: string;
}

export const DayAnalysisChart = ({ data, date }: DayAnalysisChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detailní analýza dne {new Date(date).toLocaleDateString('cs-CZ')}</CardTitle>
        <CardDescription>
          Průběh glykémie, inzulínu a detekované problémy
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {/* Osy */}
            <XAxis 
              dataKey="time" 
              scale="time" 
              type="category" 
              tickFormatter={(time) => new Date(time).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })} 
            />
            <YAxis 
              yAxisId="glucose" 
              domain={[0, 20]} 
              label={{ value: 'Glykémie (mmol/L)', angle: -90, position: 'insideLeft' }} 
            />
            <YAxis 
              yAxisId="insulin" 
              orientation="right" 
              domain={[0, 10]} 
              label={{ value: 'Inzulín (U)', angle: 90, position: 'insideRight' }} 
            />
            
            {/* Referenční čáry */}
            <ReferenceLine 
              y={chartConfig.thresholds.glucose.hypo} 
              yAxisId="glucose" 
              stroke={chartConfig.colors.events.hypo} 
              strokeDasharray="3 3" 
              label="Hypo" 
            />
            <ReferenceLine 
              y={chartConfig.thresholds.glucose.hyper} 
              yAxisId="glucose" 
              stroke={chartConfig.colors.events.warning} 
              strokeDasharray="3 3" 
              label="Hyper" 
            />

            {/* Data */}
            <Line
              type="monotone"
              dataKey="glucose"
              stroke={chartConfig.colors.events.hypo}
              yAxisId="glucose"
              dot={false}
              name="Glykémie"
            />
            <Bar
              dataKey="bolus"
              fill={chartConfig.colors.events.bolus}
              yAxisId="insulin"
              name="Bolus"
            />
            <Line
              type="step"
              dataKey="basal"
              stroke={chartConfig.colors.events.basal}
              yAxisId="insulin"
              name="Bazál"
            />
            
            {/* Události */}
            <Scatter
              dataKey="isHypo"
              fill={chartConfig.colors.events.hypo}
              yAxisId="glucose"
              name="Hypoglykémie"
            />
            <Scatter
              dataKey="isWarning"
              fill={chartConfig.colors.events.warning}
              yAxisId="glucose"
              name="Varování"
            />

            <Tooltip 
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="font-bold">{new Date(label).toLocaleTimeString('cs-CZ')}</p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value?.toFixed(1)} {entry.unit}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 