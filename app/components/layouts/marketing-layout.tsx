import { MarketingNavbar } from "@/components/marketing/navbar";

export function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 