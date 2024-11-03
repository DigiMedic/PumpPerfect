import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { StatisticsGrid } from "./analytics/StatisticsGrid";
import { DailyProfile } from "./analytics/DailyProfile";
import { HypoEventsTable } from "./analytics/HypoEventsTable";
import { GlucoseMetricsCard } from "./analytics/GlucoseMetricsCard";
import { InsulinSensitivityChart } from "./analytics/InsulinSensitivityChart";
import { ProcessedData, TimeRange, ChartType, AnalyticsResult } from "@/types";
import { analyzeData } from "@/lib/analytics";

interface PythonDataProps {
    data: ProcessedData;
}

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

export const PythonData: React.FC<PythonDataProps> = ({ data }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>("24h");
    const [chartType, setChartType] = useState<ChartType>("line");
    const [showDetails, setShowDetails] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            console.log("Processing data:", data); // Debug log
            const results = analyzeData(data);
            console.log("Analysis results:", results); // Debug log
            setAnalytics(results);
        }
    }, [data]);

    const handleTimeRangeChange = (value: string) => {
        if (isTimeRange(value)) {
            setTimeRange(value);
        }
    };

    const handleChartTypeChange = (value: string) => {
        if (isChartType(value)) {
            setChartType(value);
        }
    };

    // Type guards
    const isTimeRange = (value: string): value is TimeRange => {
        return Object.keys(timeRanges).includes(value);
    };

    const isChartType = (value: string): value is ChartType => {
        return Object.keys(chartTypes).includes(value);
    };

    if (!analytics) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="py-10">
                        <p className="text-center text-muted-foreground">
                            Načítání analýzy...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <GlucoseMetricsCard metrics={analytics.glucoseMetrics} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Tabs value={timeRange} onValueChange={handleTimeRangeChange}>
                        <TabsList>
                            {Object.entries(timeRanges).map(([key, label]) => (
                                <TabsTrigger key={key} value={key}>
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                    
                    <Select value={chartType} onValueChange={handleChartTypeChange}>
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
                <DailyProfile 
                    basalData={analytics.hourlyBasalMedian}
                    bolusData={analytics.hourlyBolusMedian}
                />
                
                <InsulinSensitivityChart 
                    data={analytics.insulinSensitivity}
                />
            </div>

            {showDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <HypoEventsTable events={analytics.hypoEvents} />
                    <StatisticsGrid statistics={analytics} />
                </div>
            )}
        </div>
    );
};

export default PythonData;