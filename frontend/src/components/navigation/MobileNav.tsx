"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { SideNav } from "./SideNav"
import { useState } from "react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Otevřít menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SideNav className="border-none" />
      </SheetContent>
    </Sheet>
  )
} 