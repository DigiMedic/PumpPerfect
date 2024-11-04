"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: number;
  text?: string;
  showProgress?: boolean;
  progress?: number;
}

export function Loading({ 
  className, 
  size = 24, 
  text = "Načítání...", 
  showProgress = false,
  progress = 0
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className="relative">
        <Loader2 
          className="animate-spin" 
          size={size}
          style={{
            animationDuration: '1s',
            animationTimingFunction: 'linear'
          }}
        />
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium">{progress}%</span>
          </div>
        )}
      </div>
      {text && (
        <p className="text-sm text-muted-foreground">
          {text}
          {showProgress && ` (${progress}%)`}
        </p>
      )}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
} 