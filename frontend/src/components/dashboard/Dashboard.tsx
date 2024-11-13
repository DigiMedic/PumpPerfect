"use client"

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { GlucoseChart } from '../analytics/charts/GlucoseChart';
import { TimeRange } from '@/types/analytics';
import { Activity, Battery, Droplet, Clock, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { GlucoseAlert } from "@/components/notifications/GlucoseAlert";
import { CurrentGlucose } from '../glucose/CurrentGlucose';
import { GlucoseStats } from '../glucose/GlucoseStats';
import { GlucoseTrends } from '../glucose/GlucoseTrends';
import { DailyStats } from '../glucose/DailyStats';

// Komponenta pro statistickou kartu
const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center text-xs text-green-500 mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend}
        </div>
      )}
    </CardContent>
  </Card>
);

// Komponenta pro analytický dashboard
const AnalyticsDashboard = ({ data, className }: any) => (
  <div className={className}>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Průměrná glykémie"
        value={`${data?.averageGlucose?.toFixed(1) || '--'} mmol/L`}
        icon={Activity}
        description="Za posledních 24 hodin"
      />
      <StatCard
        title="Čas v rozmezí"
        value={`${data?.timeInRange?.toFixed(1) || '--'}%`}
        icon={Clock}
        description="Cílové rozmezí 3.9-10.0 mmol/L"
      />
      <StatCard
        title="Aktivní inzulín"
        value={`${data?.activeInsulin?.toFixed(1) || '--'} U`}
        icon={Droplet}
        description="Aktuální IOB"
      />
      <StatCard
        title="Stav baterie"
        value={`${data?.batteryLevel || '--'}%`}
        icon={Battery}
        description="Zbývající kapacita"
      />
    </div>
    {data?.glucoseData?.length > 0 && (
      <div className="absolute top-4 right-4">
        <CurrentGlucose 
          data={data.glucoseData[data.glucoseData.length - 1]} 
        />
      </div>
    )}
  </div>
);

export function Dashboard() {
  const { data, isLoading, error } = useAnalytics();
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const { showError, showInfo } = useNotifications();
  const [hasShownError, setHasShownError] = useState(false);
  const [hasShownInfo, setHasShownInfo] = useState(false);

  // Zobrazení chyby pouze jednou při načtení nebo změně error stavu
  useEffect(() => {
    if (error && !hasShownError) {
      showError("Nepodařilo se načíst data");
      setHasShownError(true);
    }
  }, [error, hasShownError, showError]);

  // Zobrazení info pouze jednou při načtení nebo změně dat
  useEffect(() => {
    if (data?.glucoseData?.length === 0 && !hasShownInfo) {
      showInfo("Žádná data k zobrazení pro vybrané období");
      setHasShownInfo(true);
    }
  }, [data, hasShownInfo, showInfo]);

  // Reset stavů při změně timeRange
  useEffect(() => {
    setHasShownError(false);
    setHasShownInfo(false);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Progress value={33} className="w-40" />
          <p className="text-muted-foreground">Načítání dat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Chyba při načítání dat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="analytics">Analýza</TabsTrigger>
            <TabsTrigger value="reports">Reporty</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setTimeRange('24h')}>24h</Button>
            <Button variant="outline" size="sm" onClick={() => setTimeRange('7d')}>7d</Button>
            <Button variant="outline" size="sm" onClick={() => setTimeRange('30d')}>30d</Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsDashboard 
            data={data}
            className="rounded-lg border bg-card shadow-sm p-6"
          />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Průběh glykémie</CardTitle>
                <CardDescription>Kontinuální monitoring glukózy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <GlucoseChart data={data?.glucoseData || []} timeRange={timeRange} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <GlucoseStats data={data?.glucoseData || []} />
          <div className="grid gap-6 md:grid-cols-2">
            <GlucoseTrends data={data?.glucoseData || []} />
            <DailyStats data={data?.glucoseData || []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
