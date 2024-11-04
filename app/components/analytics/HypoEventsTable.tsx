import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock } from "lucide-react";
import { HypoEvent } from "@/types";

interface HypoEventsTableProps {
    events: HypoEvent[];
}

export const HypoEventsTable: React.FC<HypoEventsTableProps> = ({ events }) => {
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (start: string, end: string) => {
        const duration = new Date(end).getTime() - new Date(start).getTime();
        const minutes = Math.floor(duration / (1000 * 60));
        return `${minutes} min`;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle>Hypoglykemické události</CardTitle>
                </div>
                <CardDescription>
                    {events.filter(e => e.relatedBolus).length} z {events.length} událostí souvisí s bolusem
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Čas</TableHead>
                            <TableHead>Glykémie</TableHead>
                            <TableHead>Předchozí bolus</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event, index) => (
                            <TableRow key={index} className={event.glucoseValue < 3.0 ? 'bg-red-50' : ''}>
                                <TableCell>{formatTime(event.timestamp)}</TableCell>
                                <TableCell>
                                    <span className={`font-medium ${
                                        event.glucoseValue < 3.0 ? 'text-red-600' : 'text-orange-600'
                                    }`}>
                                        {event.glucoseValue.toFixed(1)} mmol/L
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {event.relatedBolus ? (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-sm">
                                                <div>{event.relatedBolus.amount.toFixed(1)} U</div>
                                                <div className="text-muted-foreground">
                                                    před {formatDuration(event.relatedBolus.timestamp, event.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}; 