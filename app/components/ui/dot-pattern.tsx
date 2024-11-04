"use client";

import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
}

export default function DotPattern({
  width = 20,
  height = 20,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
}: DotPatternProps) {
  return (
    <svg
      className={cn(
        "absolute inset-0 h-full w-full fill-neutral-200 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
        className
      )}
    >
      <pattern
        id="dotPattern"
        x="0"
        y="0"
        width={width}
        height={height}
        patternUnits="userSpaceOnUse"
      >
        <circle cx={cx} cy={cy} r={cr} />
      </pattern>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  );
} 