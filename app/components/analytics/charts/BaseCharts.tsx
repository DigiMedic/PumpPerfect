import { ChartWrapper } from './ChartWrapper';
import { LineChart, Line, BarChart, Bar, ComposedChart, Area, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { chartConfig } from '@/components/ui/charts/config';

interface ChartProps {
    data: any[];
    height?: number;
    title?: string;
    description?: string;
    xKey?: string;
    yKey?: string;
    className?: string;
}

export const LineChartComponent: React.FC<ChartProps> = ({ 
    data, 
    height,
    title,
    description,
    xKey = "time",
    yKey = "value",
    className
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Nejsou dostupná data pro zobrazení</p>
            </div>
        );
    }

    return (
        <ChartWrapper 
            height={height} 
            title={title}
            description={description}
            className={className}
        >
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey={yKey} 
                    stroke={chartConfig.colors.events.basal}
                    dot={false}
                />
            </LineChart>
        </ChartWrapper>
    );
};

export const BarChartComponent: React.FC<ChartProps> = ({
    data,
    height,
    title,
    description,
    xKey = "category",
    yKey = "value",
    className
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Nejsou dostupná data pro zobrazení</p>
            </div>
        );
    }

    return (
        <ChartWrapper 
            height={height}
            title={title}
            description={description}
            className={className}
        >
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                    dataKey={yKey} 
                    fill={chartConfig.colors.events.bolus}
                />
            </BarChart>
        </ChartWrapper>
    );
};

export const ComposedChartComponent: React.FC<ChartProps & {
    lineKeys?: string[];
    barKeys?: string[];
    areaKeys?: string[];
}> = ({
    data,
    height,
    title,
    description,
    xKey = "time",
    lineKeys = [],
    barKeys = [],
    areaKeys = [],
    className
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Nejsou dostupná data pro zobrazení</p>
            </div>
        );
    }

    return (
        <ChartWrapper 
            height={height}
            title={title}
            description={description}
            className={className}
        >
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {lineKeys.map((key, index) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={Object.values(chartConfig.colors.events)[index]}
                        dot={false}
                    />
                ))}
                {barKeys.map((key, index) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={Object.values(chartConfig.colors.events)[index]}
                    />
                ))}
                {areaKeys.map((key, index) => (
                    <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        fill={Object.values(chartConfig.colors.events)[index]}
                        stroke={Object.values(chartConfig.colors.events)[index]}
                    />
                ))}
            </ComposedChart>
        </ChartWrapper>
    );
}; 