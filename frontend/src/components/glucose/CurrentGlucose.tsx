import { GlucoseDataPoint } from "@/types/analytics";
import { GlucoseAlert } from "@/components/notifications/GlucoseAlert";

interface CurrentGlucoseProps {
  data: GlucoseDataPoint;
}

export function CurrentGlucose({ data }: CurrentGlucoseProps) {
  if (!data.isValid) return null;

  return (
    <>
      <GlucoseAlert
        value={data.value}
        timestamp={data.timestamp}
        trend={data.trend}
      />
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{data.value.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">mmol/L</span>
        {data.trend && (
          <span className="text-sm">
            {data.trend === 'rising' ? '↑' : data.trend === 'falling' ? '↓' : '→'}
          </span>
        )}
      </div>
    </>
  );
} 