import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigiHealth Analytics",
  description: "...",
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
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        inter.className
      )}>
        <Navbar />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
