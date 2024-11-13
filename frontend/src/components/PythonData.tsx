'use client';

import { useEffect, useState } from "react";
import { AnalyticsDashboard } from "./analytics/AnalyticsDashboard";
import { ProcessedData, AnalyticsResult } from "@/types";
import { analyzeData } from "@/lib/analytics";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";

interface PythonDataProps {
    data: ProcessedData;
    onReset: () => void;
}

export default function PythonData({ data, onReset }: PythonDataProps) {
    const [analysisResults, setAnalysisResults] = useState<AnalyticsResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        console.log('Initial data received:', data);
        
        const processData = async () => {
            try {
                setIsLoading(true);
                const results = await analyzeData(data);
                console.log('Analysis results:', results);
                setAnalysisResults(results);
            } catch (error) {
                console.error('Error analyzing data:', error);
                toast({
                    title: "Chyba",
                    description: error instanceof Error ? error.message : "Neočekávaná chyba při analýze dat",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        processData();
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loading />
                <p className="mt-4 text-muted-foreground">Načítání analýzy...</p>
            </div>
        );
    }

    if (!analysisResults) {
        return (
            <div className="text-center">
                <p>Nepodařilo se zpracovat data pro analýzu.</p>
            </div>
        );
    }

    return (
        <AnalyticsDashboard
            data={analysisResults}
            timeRange="24h"
            rawData={data}
            showDetails={true}
            chartType="line"
        />
    );
}