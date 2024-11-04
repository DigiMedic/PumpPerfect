import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigiHealth Analytics | Analýza dat z inzulínové pumpy",
  description: "Komplexní analýza a vizualizace dat z inzulínových pump a CGM systémů",
  keywords: ["diabetes", "analýza dat", "inzulínová pumpa", "CGM", "glykémie"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background antialiased"
      )}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
              <div className="flex items-center gap-4">
                <a className="flex items-center space-x-2" href="/">
                  <span className="font-bold">DigiHealth Analytics</span>
                </a>
              </div>
              <nav className="flex items-center gap-4">
                <a
                  href="https://github.com/yourusername/digihealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="container py-6">
              {children}
            </div>
          </main>

          <footer className="border-t py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
              <p className="text-center text-sm text-muted-foreground">
                © 2024 DigiHealth Analytics. Všechna práva vyhrazena.
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
