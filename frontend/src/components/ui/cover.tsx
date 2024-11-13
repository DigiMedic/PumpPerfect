"use client";

import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

interface CoverProps {
  children: React.ReactNode;
}

export function Cover({ children }: CoverProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full">
        <SparklesCore
          particleColor="hsl(var(--primary))"
          minSize={0.5}
          maxSize={1.5}
          particleCount={25}
          className="opacity-50"
        />
      </div>
      <span className="relative inline-block bg-gradient-to-r from-foreground to-foreground/90 dark:from-primary-foreground dark:to-primary-foreground/90 bg-clip-text text-transparent font-bold">
        {children}
      </span>
    </div>
  );
}