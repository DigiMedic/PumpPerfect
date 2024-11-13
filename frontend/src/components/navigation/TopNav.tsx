"use client"

import React from 'react';
import { cn } from "@/lib/utils";

interface TopNavProps {
  children?: React.ReactNode;
  className?: string;
}

export function TopNav({ children, className }: TopNavProps) {
  return (
    <nav className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-14 items-center justify-between">
        {children}
      </div>
    </nav>
  );
}
