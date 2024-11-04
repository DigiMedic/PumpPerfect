"use client"

import * as React from "react"
import { ChartComponentProps } from "recharts/types/chart/generateCategoricalChart"
import { TooltipProps } from "recharts/types/component/Tooltip"
import { LegendProps } from "recharts/types/component/Legend"
import { cn } from "@/lib/utils"

export interface ChartTooltipProps<TData extends object> extends Partial<TooltipProps<any, any>> {
  className?: string
  components?: {
    header?: React.ComponentType<any>
    footer?: React.ComponentType<any>
  }
}

export const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  ChartTooltipProps<any>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background p-2 shadow-md",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 px-2 py-1.5", className)}
    {...props}
  >
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-primary" />
      <span className="text-sm font-medium">{props.children}</span>
    </div>
  </div>
))
ChartTooltipContent.displayName = "ChartTooltipContent"

export interface ChartLegendProps extends Partial<LegendProps> {
  className?: string
}

export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  ChartLegendProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4", className)}
    {...props}
  />
))
ChartLegend.displayName = "ChartLegend"

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    <div className="h-2 w-2 rounded-full bg-primary" />
    <span className="text-sm font-medium">{props.children}</span>
  </div>
))
ChartLegendContent.displayName = "ChartLegendContent" 