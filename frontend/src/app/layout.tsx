import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "DigiHealth Analytics",
  description: "Komplexní nástroj pro analýzu dat z inzulínové pumpy a CGM senzoru",
  keywords: ["diabetes", "analýza dat", "inzulínová pumpa", "CGM", "glykémie"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="digihealth-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <main className="fade-in container mx-auto px-6 py-12 sm:px-8 lg:px-12">
                {children}
              </main>
            </div>
            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
