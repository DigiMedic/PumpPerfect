import React from 'react';

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number | null | undefined;
        name: string;
        color: string;
    }>;
    label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    // Debug log
    console.log('Tooltip payload:', payload);

    const formatValue = (value: number | null | undefined, name: string) => {
        if (typeof value !== 'number') {
            console.log(`Invalid value for ${name}:`, value);
            return '-';
        }
        try {
            return value.toFixed(1);
        } catch (error) {
            console.error(`Error formatting value for ${name}:`, error);
            return '-';
        }
    };

    return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
            <p className="font-medium">
                {label ? new Date(label).toLocaleTimeString('cs-CZ') : '-'}
            </p>
            {payload.map((entry, index) => {
                // Debug log pro každý entry
                console.log(`Entry ${index}:`, entry);
                
                return (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {formatValue(entry.value, entry.name)} {entry.name === 'Glykémie' ? 'mmol/L' : 'U'}
                    </p>
                );
            })}
        </div>
    );
}; 