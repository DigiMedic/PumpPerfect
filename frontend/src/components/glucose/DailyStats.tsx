import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlucoseDataPoint } from "@/types/analytics";
import { calculateDailyStats } from "@/lib/glucose";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DailyStatsProps {
  data: GlucoseDataPoint[];
  className?: string;
}

export function DailyStats({ data, className }: DailyStatsProps) {
  const stats = calculateDailyStats(data);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Denní statistiky</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[0, 15]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {stats.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                >
                  <span className="text-sm">{insight.description}</span>
                  <span className="text-sm font-medium">{insight.value}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
} 