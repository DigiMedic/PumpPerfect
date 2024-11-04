import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip } from 'recharts';
import { chartConfig } from '@/components/ui/charts/config';

interface RiskHeatmapProps {
  data: Array<{
    date: string;
    score: number;
    details: {
      hypos: number;
      manualAdjustments: number;
      delayedBoluses: number;
    };
  }>;
  onDayClick: (date: string) => void;
}

export const RiskHeatmap = ({ data, onDayClick }: RiskHeatmapProps) => {
  const getColor = (score: number) => {
    if (score < chartConfig.thresholds.riskScore.low) return chartConfig.colors.risk.low;
    if (score < chartConfig.thresholds.riskScore.medium) return chartConfig.colors.risk.medium;
    return chartConfig.colors.risk.high;
  };

  // Organizace dat do týdnů pro heatmapu
  const weeks = data.reduce((acc, day) => {
    const date = new Date(day.date);
    const weekNum = Math.floor(date.getDate() / 7);
    if (!acc[weekNum]) acc[weekNum] = [];
    acc[weekNum].push({
      ...day,
      color: getColor(day.score)
    });
    return acc;
  }, {} as Record<number, any[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rizikové skóre - měsíční přehled</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {Object.values(weeks).map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-1 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="aspect-square rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: day.color }}
                  onClick={() => onDayClick(day.date)}
                  role="button"
                  tabIndex={0}
                >
                  <Tooltip
                    content={
                      <div className="bg-white p-2 rounded shadow">
                        <p className="font-bold">{new Date(day.date).toLocaleDateString()}</p>
                        <p>Skóre: {day.score.toFixed(1)}</p>
                        <p>Hypoglykémie: {day.details.hypos}</p>
                        <p>Manuální úpravy: {day.details.manualAdjustments}</p>
                        <p>Opožděné bolusy: {day.details.delayedBoluses}</p>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 