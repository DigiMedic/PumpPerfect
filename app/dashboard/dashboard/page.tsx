'use client';

import Dashboard from "@/components/Dashboard";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <PageContainer>
          <PageHeader
            heading="DigiMedic Analytics"
            text="Analýza dat z inzulínové pumpy"
          >
            <p className="text-sm text-muted-foreground">
              Nahrajte CSV soubory z vaší inzulínové pumpy pro detailní analýzu a vizualizaci dat.
              Podporované formáty: basal_data.csv, bolus_data.csv, cgm_data.csv
            </p>
          </PageHeader>
          <div className="grid gap-4">
            <Dashboard />
          </div>
        </PageContainer>
      </main>
    </div>
  );
} 