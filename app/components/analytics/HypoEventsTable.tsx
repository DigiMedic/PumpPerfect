import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HypoEvent } from "@/types";
import { AlertTriangle } from "lucide-react";

interface HypoEventsTableProps {
    events: HypoEvent[];
}

export const HypoEventsTable: React.FC<HypoEventsTableProps> = ({ events }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle>Hypoglykemické události</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div key={index} className="rounded-lg border p-4 bg-red-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-red-700">
                                        {event.glucoseValue.toFixed(1)} mmol/L
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(event.timestamp).toLocaleString('cs-CZ')}
                                    </p>
                                </div>
                                {event.relatedBolus && (
                                    <div className="text-sm">
                                        <p className="font-medium">Předcházející bolus</p>
                                        <p className="text-muted-foreground">
                                            {event.relatedBolus.amount} U v {' '}
                                            {new Date(event.relatedBolus.timestamp).toLocaleTimeString('cs-CZ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}; 