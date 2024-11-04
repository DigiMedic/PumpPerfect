import { ChartWrapper } from './ChartWrapper';

interface BaseChartProps {
    data: any[];
    height?: number;
}

export const BaseChart: React.FC<BaseChartProps> = ({ data, height }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Nejsou dostupná data pro zobrazení</p>
            </div>
        );
    }

    return (
        <ChartWrapper height={height}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        </ChartWrapper>
    );
}; 