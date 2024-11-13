"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  BarChart2,
  Settings,
  Calendar,
  FileText,
  PieChart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Přehled", icon: Home, href: "/dashboard" },
  { name: "Analýzy", icon: BarChart2, href: "/dashboard/analytics" },
  { name: "Reporty", icon: FileText, href: "/dashboard/reports" },
  { name: "Kalendář", icon: Calendar, href: "/dashboard/calendar" },
  { name: "Statistiky", icon: PieChart, href: "/dashboard/statistics" },
  { name: "Komunita", icon: Users, href: "/dashboard/community" },
  { name: "Nastavení", icon: Settings, href: "/dashboard/settings" },
];

interface SideNavProps {
  className?: string;
}

export function SideNav({ className }: SideNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("py-4", className)}>
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold tracking-tight">PumpPerfect</h2>
      </div>
      
      <div className="space-y-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SideNav;
