import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlucoseDataPoint } from "@/types/analytics";
import { calculateTrends } from "@/lib/glucose";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface GlucoseTrendsProps {
  data: GlucoseDataPoint[];
  className?: string;
}

export function GlucoseTrends({ data, className }: GlucoseTrendsProps) {
  const trends = calculateTrends(data);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Trendy glykémie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Stoupající trend</p>
                <p className="text-xs text-muted-foreground">
                  {trends.rising}% času
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Klesající trend</p>
                <p className="text-xs text-muted-foreground">
                  {trends.falling}% času
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Stabilní</p>
                <p className="text-xs text-muted-foreground">
                  {trends.stable}% času
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Denní vzorce</h4>
            <div className="grid gap-2">
              {trends.patterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm">{pattern.description}</p>
                  <p className="text-sm font-medium">{pattern.frequency}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 