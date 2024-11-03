import React from 'react';

interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    type?: string;
}

export const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label, type }) => {
    if (!active || !payload?.length) return null;

    const value = payload[0].value as number;
    const isGlucose = type === 'cgm';
    const isHypo = isGlucose && value < 3.9;

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
                        {value.toFixed(1)} {isGlucose ? 'mmol/l' : 'U'}
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