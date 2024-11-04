import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { AnalyticsDashboard } from "./analytics/AnalyticsDashboard";
import { ProcessedData, TimeRange, ChartType, AnalyticsResult } from "@/types";
import { analyzeData } from "@/lib/analytics";
import { toast } from "@/components/ui/use-toast";
import { CHART_TYPES, TIME_RANGES } from "@/lib/constants";

interface PythonDataProps {
    data: ProcessedData;
    onReset?: () => void;
}

export const PythonData: React.FC<PythonDataProps> = ({ data, onReset }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>("24h");
    const [chartType, setChartType] = useState<ChartType>("line");
    const [showDetails, setShowDetails] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
    const [filteredData, setFilteredData] = useState<ProcessedData>(data);

    useEffect(() => {
        console.log('Initial data received:', {
            basal: data?.basal?.length,
            bolus: data?.bolus?.length,
            cgm: data?.cgm?.length,
            sampleData: {
                basal: data?.basal?.[0],
                bolus: data?.bolus?.[0],
                cgm: data?.cgm?.[0]
            }
        });

        if (data) {
            try {
                const results = analyzeData(data);
                console.log('Analysis results:', results);
                setAnalytics(results);
                setFilteredData(data);
            } catch (error) {
                console.error('Error analyzing data:', error);
                toast({
                    title: "Chyba analýzy",
                    description: "Nepodařilo se analyzovat data",
                    variant: "destructive"
                });
            }
        }
    }, [data]);

    useEffect(() => {
        if (filteredData) {
            try {
                const results = analyzeData(filteredData);
                setAnalytics(results);
            } catch (error) {
                console.error('Error analyzing filtered data:', error);
                toast({
                    title: "Chyba analýzy",
                    description: "Nepodařilo se analyzovat filtrovaná data",
                    variant: "destructive"
                });
            }
        }
    }, [filteredData, timeRange]);

    const handleTimeRangeChange = (value: TimeRange) => {
        setTimeRange(value);
        // Filtrování dat podle časového rozsahu
        const now = new Date();
        let startDate = new Date();

        switch (value) {
            case "24h":
                startDate.setHours(startDate.getHours() - 24);
                break;
            case "7d":
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(startDate.getDate() - 30);
                break;
        }

        try {
            const filtered = {
                ...data,
                basal: data.basal.filter(record => {
                    const date = new Date(record.Timestamp || record.Time || '');
                    return date >= startDate && date <= now;
                }),
                bolus: data.bolus.filter(record => {
                    const date = new Date(record.Timestamp || record.Time || '');
                    return date >= startDate && date <= now;
                }),
                cgm: data.cgm.filter(record => {
                    const date = new Date(record.Timestamp || record.Time || '');
                    return date >= startDate && date <= now;
                })
            };

            setFilteredData(filtered);
        } catch (error) {
            console.error('Error filtering data:', error);
            toast({
                title: "Chyba filtrace",
                description: "Nepodařilo se filtrovat data podle času",
                variant: "destructive"
            });
        }
    };

    const handleChartTypeChange = (value: ChartType) => {
        setChartType(value);
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Tabs value={timeRange} onValueChange={handleTimeRangeChange}>
                        <TabsList>
                            {Object.entries(TIME_RANGES).map(([key, label]) => (
                                <TabsTrigger key={key} value={key}>
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                    
                    <Select value={chartType} onValueChange={handleChartTypeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Typ grafu">
                                {CHART_TYPES[chartType]}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(CHART_TYPES).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-sm"
                    >
                        {showDetails ? "Skrýt" : "Zobrazit"} detaily
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                    </Button>
                    
                    {onReset && (
                        <Button
                            onClick={onReset}
                            className="text-sm"
                        >
                            Nahrát nová data
                        </Button>
                    )}
                </div>
            </div>

            <AnalyticsDashboard 
                data={analytics}
                timeRange={timeRange}
                rawData={filteredData}
                showDetails={showDetails}
                chartType={chartType}
            />
        </div>
    );
};

export default PythonData;