import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Scatter, ComposedChart } from 'recharts';
import { chartConfig } from '@/components/ui/charts/config';

interface DayDetailChartProps {
  data: Array<{
    time: string;
    glucose: number;
    bolus?: number;
    basal?: number;
    isMeal?: boolean;
  }>;
  date: string;
}

export const DayDetailChart = ({ data, date }: DayDetailChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailní přehled dne {new Date(date).toLocaleDateString()}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis 
                dataKey="time" 
                scale="time" 
                type="category" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
              />
              <YAxis yAxisId="glucose" domain={[0, 20]} />
              <YAxis yAxisId="insulin" orientation="right" domain={[0, 10]} />
              
              {/* Glukóza */}
              <Line
                type="monotone"
                dataKey="glucose"
                stroke={chartConfig.colors.events.hypo}
                yAxisId="glucose"
                dot={false}
              />

              {/* Bolusy */}
              <Scatter
                dataKey="bolus"
                fill={chartConfig.colors.events.bolus}
                yAxisId="insulin"
              />

              {/* Bazál */}
              <Line
                type="step"
                dataKey="basal"
                stroke={chartConfig.colors.events.basal}
                yAxisId="insulin"
                dot={false}
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

              {/* Hypoglykemická hranice */}
              <ReferenceLine
                y={3.9}
                stroke={chartConfig.colors.events.hypo}
                strokeDasharray="3 3"
                yAxisId="glucose"
              />

              <Tooltip />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 