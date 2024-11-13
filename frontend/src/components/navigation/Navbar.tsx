import React from 'react';
import { TopNav } from './TopNav';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopNav>
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://utfs.io/f/NyKlEsePJFL1HonJehGAgPkir8dMbloHhyK92GYzULftnpcB"
            alt="DigiHealth Analytics Logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="hidden font-bold sm:inline-block">
            DigiHealth Analytics
          </span>
        </Link>
      </TopNav>
    </header>
  );
}

export default Navbar;
