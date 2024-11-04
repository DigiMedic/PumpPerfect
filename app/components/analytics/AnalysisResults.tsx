import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlucoseMetricsCard } from "./GlucoseMetricsCard";
import { DailyProfile } from "./DailyProfile";
import { HypoEventsTable } from "./HypoEventsTable";
import { InsulinSensitivityChart } from "./InsulinSensitivityChart";
import { AnalyticsResult } from "@/types";

interface AnalysisResultsProps {
    data: AnalyticsResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            {/* Základní metriky */}
            <GlucoseMetricsCard metrics={data.glucoseMetrics} />

            {/* Záložky s různými pohledy */}
            <Tabs defaultValue="daily" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="daily">Denní profil</TabsTrigger>
                    <TabsTrigger value="insulin">Inzulín</TabsTrigger>
                    <TabsTrigger value="hypo">Hypoglykémie</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Denní profil</CardTitle>
                            <CardDescription>
                                Průběh glykémie a dávkování inzulínu během dne
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DailyProfile 
                                basalData={data.hourlyBasalMedian}
                                bolusData={data.hourlyBolusMedian}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insulin" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Citlivost na inzulín</CardTitle>
                            <CardDescription>
                                Analýza účinku bolusových dávek na glykémii
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InsulinSensitivityChart 
                                data={data.insulinSensitivity}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hypo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hypoglykemické události</CardTitle>
                            <CardDescription>
                                Přehled a analýza hypoglykémií
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HypoEventsTable 
                                events={data.hypoEvents}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Statistický souhrn */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistický souhrn</CardTitle>
                    <CardDescription>
                        Souhrnné statistiky za sledované období
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-medium mb-2">Glykémie</h4>
                        <dl className="space-y-1">
                            <div className="flex justify-between">
                                <dt>Průměr</dt>
                                <dd>{data.glucoseMetrics.average.toFixed(1)} mmol/L</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Čas v cíli</dt>
                                <dd>{data.glucoseMetrics.timeInRange.toFixed(1)}%</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Variabilita (CV)</dt>
                                <dd>{data.glucoseMetrics.cv.toFixed(1)}%</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Inzulín</h4>
                        <dl className="space-y-1">
                            <div className="flex justify-between">
                                <dt>Průměrný bazál</dt>
                                <dd>{(data.hourlyBasalMedian.reduce((acc, curr) => acc + curr.median, 0) / 24).toFixed(2)} U/h</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Průměrný bolus</dt>
                                <dd>{(data.hourlyBolusMedian.reduce((acc, curr) => acc + curr.median, 0) / 24).toFixed(2)} U</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Hypoglykémie</h4>
                        <dl className="space-y-1">
                            <div className="flex justify-between">
                                <dt>Celkem</dt>
                                <dd>{data.totalHypos}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Po bolusu</dt>
                                <dd>{data.hypoAfterBolus}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>% času pod cílem</dt>
                                <dd>{data.glucoseMetrics.timeBelow.toFixed(1)}%</dd>
                            </div>
                        </dl>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 