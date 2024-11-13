import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlucoseDataPoint } from "@/types/analytics";
import { calculateStats } from "@/lib/glucose";

interface GlucoseStatsProps {
  data: GlucoseDataPoint[];
  className?: string;
}

export function GlucoseStats({ data, className }: GlucoseStatsProps) {
  const stats = calculateStats(data);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Průměrná glykémie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.average.toFixed(1)} mmol/L
          </div>
          <p className="text-xs text-muted-foreground">
            GMI: {stats.gmi.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Čas v rozmezí
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.timeInRange.toFixed(0)}%
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${stats.timeInRange}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Variabilita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.cv.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            CV (cíl: {'<'}36%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Hypoglykémie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.hypos}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.timeBelow.toFixed(1)}% času pod cílem
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 