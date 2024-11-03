import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronDown } from "lucide-react";
import { ChartTooltip } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart-container";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlucoseChart } from "./analytics/GlucoseChart";
import { StatisticsGrid } from "./analytics/StatisticsGrid";
import { calculateHourlyMedians, identifyHypoglycemicEvents } from "@/lib/analytics";

interface TimeSeriesDataPoint {
    time: string;
    value: number;
}

interface DataRecord {
    Time?: string;
    Timestamp?: string;
    'Insulin Delivered (U)'?: string | number;
    'CGM Glucose Value (mmol/l)'?: string | number;
}

interface PythonDataProps {
    data: {
        basal: Record<string, unknown>[];
        bolus: Record<string, unknown>[];
        insulin: Record<string, unknown>[];
        alarms: Record<string, unknown>[];
        bg: Record<string, unknown>[];
        cgm: Record<string, unknown>[];
    };
}

const chartConfig = {
    cgm: {
        label: "Glykémie",
        color: "hsl(var(--chart-1))",
        threshold: 3.9 // hypoglykemický práh v mmol/L
    }
};

const timeRanges = {
    "24h": "24 hodin",
    "7d": "7 dní",
    "30d": "30 dní"
} as const;

const chartTypes = {
    "line": "Spojnicový",
    "area": "Plošný",
    "scatter": "Bodový"
} as const;

const CustomTooltip = ({ active, payload, label, type }: any) => {
    if (!active || !payload?.length) return null;
    const value = payload[0].value as number;
    const isGlucose = type === 'cgm';
    const isHypo = isGlucose && value < chartConfig.cgm.threshold;
    
    return (
        <div className={`rounded-lg border p-2 shadow-sm ${
            isHypo ? 'bg-red-50 border-red-200' : 'bg-background'
        }`}>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {isGlucose ? 'Glykémie' : 'Dávka inzulínu'}
                    </span>
                    <span className={`font-bold ${isHypo ? 'text-red-600' : ''}`}>
                        {value} {isGlucose ? 'mmol/l' : 'U'}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Čas
                    </span>
                    <span className="font-bold">
                        {new Date(label).toLocaleString('cs-CZ')}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface HourlyMedian {
    hour: number;
    median: number;
}

interface HypoEvent {
    timestamp: string;
    glucoseValue: number;
    relatedBolus?: {
        timestamp: string;
        amount: number;
    };
}

interface Statistics {
    avgGlucose: number;
    hypoEvents: HypoEvent[];
    timeInRange: number;
    hourlyBasalMedian: HourlyMedian[];
    hourlyBolusMedian: HourlyMedian[];
    hypoAfterBolus: number;
    totalHypos: number;
}

const PythonData: React.FC<PythonDataProps> = ({ data }) => {
    const [timeRange, setTimeRange] = useState<keyof typeof timeRanges>("24h");
    const [chartType, setChartType] = useState<keyof typeof chartTypes>("line");
    const [showDetails, setShowDetails] = useState(true);
    const [processedData, setProcessedData] = useState<TimeSeriesDataPoint[]>([]);
    const [statistics, setStatistics] = useState<Statistics>({
        avgGlucose: 0,
        hypoEvents: [],
        timeInRange: 0,
        hourlyBasalMedian: [],
        hourlyBolusMedian: [],
        hypoAfterBolus: 0,
        totalHypos: 0
    });

    useEffect(() => {
        if (data?.cgm) {
            const processed = prepareTimeSeriesData(data.cgm as DataRecord[]);
            setProcessedData(processed);
            calculateStatistics(processed);
        }
    }, [data]);

    const calculateStatistics = (data: TimeSeriesDataPoint[]) => {
        if (!data.length) return;

        const values = data.map(d => d.value);
        const avgGlucose = values.reduce((a, b) => a + b, 0) / values.length;
        const hypoEvents = values.filter(v => v < chartConfig.cgm.threshold).length;
        const timeInRange = (values.filter(v => v >= 3.9 && v <= 10.0).length / values.length) * 100;

        const basalValues = prepareTimeSeriesData(data.basal as DataRecord[]).map(d => d.value);
        const bolusValues = prepareTimeSeriesData(data.bolus as DataRecord[]).map(d => d.value);
        
        const medianBasal = basalValues.sort((a, b) => a - b)[Math.floor(basalValues.length / 2)] || 0;
        const medianBolus = bolusValues.sort((a, b) => a - b)[Math.floor(bolusValues.length / 2)] || 0;

        const hypoAfterBolus = calculateHypoAfterBolus(data.bolus as DataRecord[], data.cgm as DataRecord[]);

        setStatistics({
            avgGlucose: Number(avgGlucose.toFixed(1)),
            hypoEvents,
            timeInRange: Number(timeInRange.toFixed(1)),
            medianBasal: Number(medianBasal.toFixed(2)),
            medianBolus: Number(medianBolus.toFixed(2)),
            hypoAfterBolus,
            totalHypos: hypoEvents
        });
    };

    const calculateHypoAfterBolus = (bolusData: DataRecord[], cgmData: DataRecord[]): number => {
        let hypoCount = 0;
        
        bolusData.forEach(bolus => {
            const bolusTime = new Date(bolus.Time || bolus.Timestamp || '');
            const twoHoursLater = new Date(bolusTime.getTime() + 2 * 60 * 60 * 1000);
            
            const relevantCgmData = cgmData.filter(cgm => {
                const cgmTime = new Date(cgm.Time || cgm.Timestamp || '');
                return cgmTime >= bolusTime && cgmTime <= twoHoursLater;
            });

            const hasHypo = relevantCgmData.some(cgm => {
                const value = parseFloat(String(cgm['CGM Glucose Value (mmol/l)'] || 0));
                return value < chartConfig.cgm.threshold;
            });

            if (hasHypo) hypoCount++;
        });

        return hypoCount;
    };

    const prepareTimeSeriesData = (data: DataRecord[]): TimeSeriesDataPoint[] => {
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            return [];
        }

        return data.map(item => {
            console.log("Processing record:", item);
            
            const time = item.Time || item.Timestamp || '';
            const rawValue = item['CGM Glucose Value (mmol/l)'] || item['Insulin Delivered (U)'] || '0';
            const value = parseFloat(String(rawValue));
            
            console.log("Processed values:", { time, value });
            
            return { time, value };
        }).filter(item => !isNaN(item.value));
    };

    const filterDataByTimeRange = (data: TimeSeriesDataPoint[]) => {
        if (!data.length) return [];
        
        const now = new Date();
        const ranges = {
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
            "30d": 30 * 24 * 60 * 60 * 1000
        };

        const filteredData = data.filter(point => {
            const pointDate = new Date(point.time);
            return now.getTime() - pointDate.getTime() <= ranges[timeRange];
        });

        console.log("Filtered data:", filteredData);
        return filteredData;
    };

    const chartData = filterDataByTimeRange(processedData);
    console.log("Final chart data:", chartData);

    if (!data || !data.cgm || !Array.isArray(data.cgm) || data.cgm.length === 0) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Kontinuální monitoring glukózy</CardTitle>
                    <CardDescription>Žádná data k zobrazení</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Rozšířené statistiky */}
            <StatisticsGrid statistics={statistics} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as keyof typeof timeRanges)}>
                        <TabsList>
                            {Object.entries(timeRanges).map(([key, label]) => (
                                <TabsTrigger key={key} value={key}>
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                    
                    <Select value={chartType} onValueChange={(v) => setChartType(v as keyof typeof chartTypes)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Typ grafu" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(chartTypes).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "Skrýt" : "Zobrazit"} detaily
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlucoseChart data={chartData} />

                {showDetails && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Bazální dávky</CardTitle>
                                <CardDescription>
                                    Průběh bazálního inzulínu
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart 
                                        data={prepareTimeSeriesData(data.basal as DataRecord[])}
                                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                                        <XAxis 
                                            dataKey="time"
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                            className="text-sm text-muted-foreground"
                                        />
                                        <YAxis 
                                            tickLine={false}
                                            axisLine={false}
                                            dx={-10}
                                            className="text-sm text-muted-foreground"
                                        />
                                        <ChartTooltip content={(props) => <CustomTooltip {...props} type="basal" />} />
                                        <Line 
                                            type="stepAfter"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Bolusové dávky</CardTitle>
                                <CardDescription>
                                    Historie bolusových dávek
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart 
                                        data={prepareTimeSeriesData(data.bolus as DataRecord[])}
                                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                                        <XAxis 
                                            dataKey="time"
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                            className="text-sm text-muted-foreground"
                                        />
                                        <YAxis 
                                            tickLine={false}
                                            axisLine={false}
                                            dx={-10}
                                            className="text-sm text-muted-foreground"
                                        />
                                        <ChartTooltip content={(props) => <CustomTooltip {...props} type="bolus" />} />
                                        <Line 
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={true}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default PythonData;