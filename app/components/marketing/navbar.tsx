import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <div className="fixed top-0 w-full h-24 px-4 border-b border-white/10 bg-transparent backdrop-blur-sm flex items-center z-50">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="https://utfs.io/f/NyKlEsePJFL1HonJehGAgPkir8dMbloHhyK92GYzULftnpcB"
            alt="DigiMedic Logo"
            width={140}
            height={140}
            className="object-contain"
          />
        </Link>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between">
          <Button size="lg" variant="ghost" className="text-neutral-800 hover:text-neutral-900 font-semibold" asChild>
            <Link href="/docs">
              Dokumentace
            </Link>
          </Button>
          <Button size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800 font-semibold" asChild>
            <Link href="/dashboard/dashboard">
              Začít analýzu
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 