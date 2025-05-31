"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { NavbarContent } from "./NavbarContent"

export function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container flex flex-col md:flex-row md:h-16 items-center justify-between py-2 md:py-0">
          <Link href="/" className="items-center space-x-2 my-2">
            <Image src="/Renovartelogo(1).png" alt="Renovarte" width={140} height={140} />
          </Link>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  )
}