import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChartWrapperProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    height?: number | string;
    width?: number | string;
    className?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
    children,
    title,
    description,
    height = 400,
    width = "100%",
    className
}) => {
    return (
        <Card className={className}>
            {(title || description) && (
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent>
                <div style={{ height, width, minHeight: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}; 