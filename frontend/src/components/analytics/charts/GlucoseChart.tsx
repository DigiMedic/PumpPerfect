import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  TooltipProps
} from 'recharts';
import { GlucoseDataPoint, TimeRange } from '@/types/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GlucoseChartProps {
  data: GlucoseDataPoint[];
  timeRange?: TimeRange;
}

interface ChartDataPoint {
  time: string;
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">{`Time: ${label}`}</p>
        <p className="font-medium text-blue-600 dark:text-blue-400">
          {`Glucose: ${payload[0].value} mg/dL`}
        </p>
      </div>
    );
  }
  return null;
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString([], { 
    hour: '2-digit',
    minute: '2-digit',
    hour12: false 
  });
};

export const GlucoseChart = ({ data, ...props }: GlucoseChartProps) => {
  const chartData = useMemo(() => {
    return data.map((point): ChartDataPoint => ({
      time: formatDate(point.timestamp),
      value: point.value
    }));
  }, [data]);

  const targetRange = {
    min: 70,  // Lower target range
    max: 180  // Upper target range
  };

  return (
    <Card className="p-4 h-[400px]">
      <CardHeader className="px-2 pt-0">
        <CardTitle className="text-base font-medium">Glukózový profil</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#374151"
            />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              axisLine={{ stroke: '#374151' }}
              domain={[0, 'auto']}
              ticks={[0, 70, 180, 250, 300]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Target range reference */}
            <Area
              dataKey="value"
              type="monotone"
              yAxisId={0}
              fill="#10B981"
              fillOpacity={0.1}
              stroke="none"
              data={[
                { time: chartData[0]?.time, value: targetRange.max },
                { time: chartData[chartData.length - 1]?.time, value: targetRange.max }
              ]}
            />
            <Area
              dataKey="value"
              type="monotone"
              yAxisId={0}
              fill="#10B981"
              fillOpacity={0.1}
              stroke="none"
              data={[
                { time: chartData[0]?.time, value: targetRange.min },
                { time: chartData[chartData.length - 1]?.time, value: targetRange.min }
              ]}
            />
            {/* Glucose values */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fill="url(#colorValue)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
