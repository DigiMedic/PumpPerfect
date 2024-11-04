import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MarketingLayout } from '@/components/layouts/marketing-layout';
import { Cover } from '@/components/ui/cover';
import DotPattern from '@/components/ui/dot-pattern';

export default function HomePage() {
  return (
    <MarketingLayout>
      <div className="relative flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-40 text-center">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className="opacity-20"
        />
        <div className="mx-auto max-w-3xl relative z-10">
          <div className="flex justify-center mb-12">
            <Image
              src="https://utfs.io/f/NyKlEsePJFL1QGbvVz7Gka27SZUIDXRTlMdFuNr34vhfBnCL"
              alt="PumpPerfect Logo"
              width={70}
              height={70}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">PumpPerfect</span>
            <span className="block text-primary mt-2">
              <Cover>Analýza dat</Cover> z inzulínové pumpy
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-prose mx-auto">
            Komplexní nástroj pro analýzu dat z inzulínové pumpy a CGM senzoru. 
            Získejte přehledné vizualizace a reporty pro lepší kontrolu diabetu.
          </p>
          <div className="mt-10">
            <Link href="/dashboard/dashboard">
              <Button size="lg" className="font-semibold">
                Začít analýzu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 