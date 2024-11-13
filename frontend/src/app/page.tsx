"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Cover } from '@/components/ui/cover';
import DotPattern from '@/components/ui/dot-pattern';

export default function HomePage() {
  return (
    <>
      <DotPattern
        width={16}
        height={16}
        cx={1}
        cy={1}
        cr={0.7}
      />
      <div className="relative flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto max-w-3xl relative z-10 fade-in">
          <div className="flex justify-center mb-12 animate-float">
            <Image
              src="https://utfs.io/f/NyKlEsePJFL1QGbvVz7Gka27SZUIDXRTlMdFuNr34vhfBnCL"
              alt="PumpPerfect Logo"
              width={70}
              height={70}
              priority
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              PumpPerfect
            </span>
            <span className="block mt-2">
              <Cover>Analýza dat</Cover> z inzulínové pumpy
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-prose mx-auto">
            Komplexní nástroj pro analýzu dat z inzulínové pumpy a CGM senzoru. 
            Získejte přehledné vizualizace a reporty pro lepší kontrolu diabetu.
          </p>
          <div className="mt-10">
            <Link href="/dashboard/dashboard">
              <Button 
                size="lg" 
                className="font-semibold px-8 py-6 text-lg hover:scale-105 transition-transform"
              >
                Začít analýzu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
