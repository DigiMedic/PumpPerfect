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
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 0.7,
  className,
}: DotPatternProps) {
  return (
    <svg
      className={cn(
        "fixed inset-0 -z-10 h-screen w-screen",
        "[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]",
        "stroke-gray-900/[0.15] dark:stroke-gray-50/[0.15]",
        className
      )}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle 
            cx={cx} 
            cy={cy} 
            r={cr} 
            className="fill-current text-gray-900/[0.15] dark:text-gray-50/[0.15]"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth="0"
        fill="url(#dot-pattern)"
      />
    </svg>
  );
} 