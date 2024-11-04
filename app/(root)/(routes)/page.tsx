'use client';

import Dashboard from "@/app/components/Dashboard";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export default function Home() {
  return (
    <PageContainer>
      <PageHeader
        heading="DigiHealth Analytics"
        text="Komplexní analýza dat z inzulínové pumpy a CGM"
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
  );
}
