import { SideNav } from "@/components/navigation/SideNav";
import { TopNav } from "@/components/navigation/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav className="hidden lg:block w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
      
      <div className="flex-1 flex flex-col">
        <TopNav className="border-b h-14" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
