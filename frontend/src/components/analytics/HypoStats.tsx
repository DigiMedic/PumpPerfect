import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { HypoEvent } from '@/lib/analytics';

interface HypoStatsProps {
    events: HypoEvent[];
    totalEvents: number;
    afterBolus: number;
}

export const HypoStats: React.FC<HypoStatsProps> = ({
    events,
    totalEvents,
    afterBolus
}) => {
    const percentageAfterBolus = ((afterBolus / totalEvents) * 100).toFixed(1);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle>Hypoglykémie</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Celkový počet</span>
                        <span className="font-bold">{totalEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Po bolusu ({percentageAfterBolus}%)</span>
                        <span className="font-bold">{afterBolus}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Bez souvislosti s bolusem</span>
                        <span className="font-bold">{totalEvents - afterBolus}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 