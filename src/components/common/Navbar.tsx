"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container flex flex-col md:flex-row md:h-16 items-center justify-between py-2 md:py-0">
        {/* Logo + Desktop Nav */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start mb-2 md:mb-0">
          <div className="flex items-center">
            {/* Mobile: Hamburger menu */}
            <div className="md:hidden mr-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                  <nav className="grid gap-6 px-2 py-6">
                    <Link href="/products" className="hover:text-foreground/80">
                      Productos
                    </Link>
                    <Link href="/buy" className=" hover:text-foreground/80">
                      Comprar
                    </Link>
                    <Link href="/business" className="hover:text-foreground/80">
                      Empresa
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">Renovarte</span>
            </Link>
          </div>

          {/* Mobile: Cart */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              className="p-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <ShoppingCart className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Cart</span>
            </Button>
          </div>
        </div>

        {/* Searchbar */}
        <div className="w-full md:w-auto mb-2 md:mb-0 md:ml-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar productos..." className="pl-8 md:w-[300px] lg:w-[400px]" />
          </div>
        </div>

        {/* Desktop Nav Links + Cart */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground">
              Productos
            </Link>
            <Link href="/buy" className="hidden lg:flex transition-colors hover:text-foreground/80 text-foreground">
              Comprar
            </Link>
            <Link href="/business" className="transition-colors hover:text-foreground/80 text-foreground">
              Empresa
            </Link>
          </nav>
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
          </Button>
        </div>
      </div>
    </header>
  )
}
