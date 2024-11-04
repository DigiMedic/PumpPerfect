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
    <html lang="cs">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
