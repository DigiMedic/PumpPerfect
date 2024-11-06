import Image from "next/image"
import Link from "next/link"
import { Facebook, Github, Linkedin } from "lucide-react"
import Balancer from "react-wrap-balancer"
import { Button } from "./ui/button"
import { NewsletterForm } from '@/components/NewsletterForm'

export function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <a 
              href="https://www.digimedic.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <span className="sr-only">DigiMedic</span>
              <Image
                src="https://utfs.io/f/NyKlEsePJFL1HonJehGAgPkir8dMbloHhyK92GYzULftnpcB"
                alt="DigiMedic Logo"
                width={200}
                height={45}
                className="transition-all hover:opacity-75"
              />
            </a>
            <p className="max-w-xl text-muted-foreground">
              <Balancer>
                DigiMedic vytváří digitální páteř pro české zdravotnictví. Naše
                řešení propojují zdravotnická zařízení, optimalizují procesy a
                zlepšují péči o pacienty.
              </Balancer>
            </p>
            <nav className="flex flex-col gap-2">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary"
              >
                Zásady ochrany soukromí
              </Link>
              <Link
                href="/cookie-policy"
                className="text-muted-foreground hover:text-primary"
              >
                Zásady používání cookies
              </Link>
            </nav>
          </div>
          
          <div className="flex flex-col justify-between items-end">
            <div className="w-[400px]">
              <h3 className="font-semibold mb-2">Odebírejte naše novinky</h3>
              <NewsletterForm />
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="hover:text-primary h-12 w-12"
              >
                <a
                  href="https://github.com/DigiMedic"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-7 w-7" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:text-primary h-12 w-12"
              >
                <a
                  href="https://www.linkedin.com/company/digimedi-cz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-7 w-7" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:text-primary h-12 w-12"
              >
                <a
                  href="https://www.facebook.com/profile.php?id=61556880800899"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-7 w-7" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 flex flex-col justify-between gap-6 pt-6 md:flex-row md:items-center md:gap-2">
          <p className="mx-auto text-center text-muted-foreground">
            © DigiMedic. Všechna práva vyhrazena. 2024-současnost.
          </p>
        </div>
      </div>
    </footer>
  )
} 