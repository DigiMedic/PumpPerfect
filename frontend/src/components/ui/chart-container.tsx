import React from 'react';

interface ChartContainerProps {
    children: React.ReactNode;
    config?: Record<string, { color: string }>;
    className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
    children, 
    config = {}, 
    className = '' 
}) => {
    return (
        <div 
            className={`chart-container relative w-full ${className}`}
            style={{
                '--chart-config': JSON.stringify(config)
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
};
