import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
         CartesianGrid, Tooltip, Legend, Bar, BarChart, Cell } from 'recharts';
import { AlertTriangle, Activity, AlertCircle, Clock, Settings, Zap } from 'lucide-react';
import { PumpUsageData } from '@/types';
import { CustomTooltip } from './CustomTooltip';

interface PumpUsageAnalysisProps {
    data?: PumpUsageData;
}

const getRiskLevel = (score: number) => {
    if (score < 5) return { text: 'Nízké', color: 'text-green-500' };
    if (score < 10) return { text: 'Střední', color: 'text-yellow-500' };
    return { text: 'Vysoké', color: 'text-red-500' };
};

const getBarColor = (score: number) => {
    if (score < 5) return 'hsl(142, 76%, 36%)'; // Zelená
    if (score < 10) return 'hsl(48, 96%, 53%)'; // Žlutá
    return 'hsl(0, 84%, 60%)'; // Červená
};

export const PumpUsageAnalysis: React.FC<PumpUsageAnalysisProps> = ({ data }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    if (!data?.dailyRiskScores?.length) {
        return <ErrorCard message="Nejsou dostupná data pro analýzu" />;
    }

    const chartData = data.dailyRiskScores.map(day => ({
        date: new Date(day.date).toLocaleDateString('cs-CZ'),
        score: day.score,
        hypos: day.hypos,
        manualAdjustments: day.manualAdjustments,
        delayedBoluses: day.delayedBoluses,
        details: day.details
    }));

    const stats = {
        totalHypos: data.dailyRiskScores.reduce((sum, day) => sum + day.hypos, 0),
        totalManualAdjustments: data.dailyRiskScores.reduce((sum, day) => sum + day.manualAdjustments, 0),
        totalDelayedBoluses: data.dailyRiskScores.reduce((sum, day) => sum + day.delayedBoluses, 0),
        averageScore: data.dailyRiskScores.reduce((sum, day) => sum + day.score, 0) / data.dailyRiskScores.length,
        maxScore: Math.max(...data.dailyRiskScores.map(day => day.score))
    };

    const riskLevel = getRiskLevel(stats.averageScore);

    return (
        <div className="space-y-6">
            {/* Hlavní shrnutí */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Souhrnné hodnocení používání pumpy
                    </CardTitle>
                    <CardDescription>
                        Celkové vyhodnocení na základě analyzovaných dat
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">Průměrné rizikové skóre:</span>
                            <span className={`text-2xl font-bold ${riskLevel.color}`}>
                                {stats.averageScore.toFixed(1)} ({riskLevel.text})
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                <span>Hypoglykémie: {stats.totalHypos}×</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-blue-500" />
                                <span>Úpravy bazálu: {stats.totalManualAdjustments}×</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-red-500" />
                                <span>Opožděné bolusy: {stats.totalDelayedBoluses}×</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Graf denního rizikového skóre */}
            <Card>
                <CardHeader>
                    <CardTitle>Vývoj rizikového skóre v čase</CardTitle>
                    <CardDescription>
                        Denní přehled problematického používání pumpy
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-4 rounded-lg shadow-lg border">
                                            <p className="font-bold">{label}</p>
                                            <p>Rizikové skóre: {data.score.toFixed(1)}</p>
                                            <p>Hypoglykémie: {data.hypos}</p>
                                            <p>Úpravy bazálu: {data.manualAdjustments}</p>
                                            <p>Opožděné bolusy: {data.delayedBoluses}</p>
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="score" name="Rizikové skóre">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Detailní statistiky */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Nejvyšší denní skóre"
                    value={stats.maxScore.toFixed(1)}
                    icon={Zap}
                    description="Nejproblematičtější den"
                />
                <StatCard
                    title="Průměr hypoglykémií"
                    value={(stats.totalHypos / data.dailyRiskScores.length).toFixed(1)}
                    icon={AlertTriangle}
                    description="Na den"
                />
                <StatCard
                    title="Průměr úprav bazálu"
                    value={(stats.totalManualAdjustments / data.dailyRiskScores.length).toFixed(1)}
                    icon={Settings}
                    description="Na den"
                />
                <StatCard
                    title="Průměr opožděných bolusů"
                    value={(stats.totalDelayedBoluses / data.dailyRiskScores.length).toFixed(1)}
                    icon={Clock}
                    description="Na den"
                />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, description }: {
    title: string;
    value: string;
    icon: any;
    description: string;
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const ErrorCard = ({ message }: { message: string }) => (
    <Card>
        <CardHeader>
            <CardTitle>Analýza používání pumpy</CardTitle>
            <CardDescription>
                Detekce potenciálně problematického používání
            </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-5 w-5" />
                <p>{message}</p>
            </div>
        </CardContent>
    </Card>
); 