import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, 
         BarChart, Bar, Cell } from 'recharts';
import { AlertTriangle, AlertCircle, Clock, Settings, Activity } from 'lucide-react';
import { chartConfig } from '@/components/ui/charts/config';

interface PumpMisuseAnalysisProps {
  data: {
    dailyScores: Array<{
      date: string;
      score: number;
      manualAdjustments: number;
      hyposAfterBolus: number;
      delayedBoluses: number;
      details: {
        adjustmentTimes: string[];
        hypoEvents: Array<{
          time: string;
          glucose: number;
          bolusTime: string;
        }>;
        delayedBolusEvents: Array<{
          mealTime: string;
          bolusTime: string;
          delay: number;
        }>;
      };
    }>;
  };
}

export const PumpMisuseAnalysis = ({ data }: PumpMisuseAnalysisProps) => {
  const totalDays = data.dailyScores.length;
  const problemDays = data.dailyScores.filter(day => day.score > 6).length;
  const riskPercentage = (problemDays / totalDays) * 100;

  return (
    <div className="space-y-6">
      {/* Hlavní shrnutí */}
      <Alert variant={riskPercentage > 30 ? "destructive" : "default"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analýza používání pumpy</AlertTitle>
        <AlertDescription>
          {riskPercentage > 30 
            ? "Detekováno významné množství problémů v používání pumpy."
            : "Zjištěny menší odchylky v používání pumpy."}
        </AlertDescription>
      </Alert>

      {/* Detailní analýza */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="adjustments">Úpravy bazálu</TabsTrigger>
          <TabsTrigger value="hypos">Hypoglykémie</TabsTrigger>
          <TabsTrigger value="boluses">Opožděné bolusy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Souhrnné statistiky</CardTitle>
              <CardDescription>
                Přehled hlavních ukazatelů problematického používání
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Problémové dny"
                  value={`${problemDays} z ${totalDays}`}
                  description="Dny s rizikovým skóre > 6"
                  icon={AlertTriangle}
                  trend={riskPercentage}
                />
                <StatCard
                  title="Průměr úprav bazálu"
                  value={(data.dailyScores.reduce((sum, day) => sum + day.manualAdjustments, 0) / totalDays).toFixed(1)}
                  description="Úprav na den"
                  icon={Settings}
                />
                <StatCard
                  title="Opožděné bolusy"
                  value={(data.dailyScores.reduce((sum, day) => sum + day.delayedBoluses, 0) / totalDays).toFixed(1)}
                  description="Průměrně za den"
                  icon={Clock}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ... další TabsContent pro ostatní záložky ... */}
      </Tabs>

      {/* Heatmapa rizikových dnů */}
      <Card>
        <CardHeader>
          <CardTitle>Rizikové dny</CardTitle>
          <CardDescription>
            Přehled dnů s problematickým používáním pumpy
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dailyScores}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('cs-CZ')} 
              />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  const day = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border">
                      <p className="font-bold">{new Date(day.date).toLocaleDateString('cs-CZ')}</p>
                      <p>Rizikové skóre: {day.score}</p>
                      <p>Úpravy bazálu: {day.manualAdjustments}×</p>
                      <p>Hypoglykémie: {day.hyposAfterBolus}×</p>
                      <p>Opožděné bolusy: {day.delayedBoluses}×</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="score">
                {data.dailyScores.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.score > 6 ? chartConfig.colors.risk.high : chartConfig.colors.risk.low}
                  />
                ))}
              </Bar>
              <ReferenceLine y={6} stroke={chartConfig.colors.risk.medium} strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}; 