"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useState } from "react";
import { ContactModal } from "@/components/ContactModal";

const routes = [
  {
    href: "/",
    label: "Domů",
    active: (pathname: string) => pathname === "/",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    active: (pathname: string) => pathname.startsWith("/dashboard"),
  },
  {
    href: "/about",
    label: "O projektu",
    active: (pathname: string) => pathname === "/about",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative w-[160px] h-[160px]">
            <Image
              src="https://utfs.io/f/NyKlEsePJFL1HonJehGAgPkir8dMbloHhyK92GYzULftnpcB"
              alt="DigiMedic logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm transition-colors hover:text-primary",
                route.active(pathname)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={() => setIsContactModalOpen(true)}>
            Kontakt
          </Button>
          <ContactModal 
            isOpen={isContactModalOpen} 
            onClose={() => setIsContactModalOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
}