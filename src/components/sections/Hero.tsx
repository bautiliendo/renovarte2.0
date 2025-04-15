"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20">

      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-16">
          {/* Hero content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                RENOVARTE <span className="text-emerald-400">Córdoba</span>
              </h1>

              <p className="max-w-lg text-lg text-gray-300">
                La tienda donde encontrás todos los electrodomésticos, celulares y productos informáticos para renovar
                tu casa.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-800/50 px-4 py-2 backdrop-blur">
                <p className="text-sm font-medium text-gray-300">Beneficios exclusivos y convenios con mutuales</p>
                <p className="text-2xl font-bold text-emerald-400">3 ABRIL</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                <ShoppingCart className="mr-2 h-5 w-5" />
                ¿Cómo Comprar?
              </Button>
              <Button size="lg" variant="outline" className="border-gray-700 text-black hover:bg-gray-300">
                Ver productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Featured products */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-lg transition-transform hover:scale-[1.02]">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">Destacado</div>
                <div className="flex items-center gap-4">
                  <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-white/10 p-2">
                    <Image
                      src="/placeholder.svg?height=112&width=112"
                      alt="Smart TV"
                      width={112}
                      height={112}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">TV NOBLEX FHD Android</h3>
                    <p className="mt-1 text-sm text-gray-300">
                      ¡Disfrutá de series, películas y partidos con el TV NOBLEX FHD Android!
                    </p>
                    <Link
                      href="/products/tv-noblex"
                      className="mt-2 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      Ver detalles
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-lg transition-transform hover:scale-[1.02]">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-emerald-400">Nuevo</div>
                <div className="relative h-24 w-full overflow-hidden rounded-lg bg-white/10 p-2">
                  <Image
                    src="/placeholder.svg?height=96&width=140"
                    alt="Cafetera ATMA"
                    width={140}
                    height={96}
                    className="mx-auto object-contain"
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">Cafetera ATMA Filtro</h3>
                <p className="mt-1 text-xs text-gray-300 line-clamp-2">Disfrutá del sabor auténtico</p>
              </div>

              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-lg transition-transform hover:scale-[1.02]">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-emerald-400">Oferta</div>
                <div className="relative h-24 w-full overflow-hidden rounded-lg bg-white/10 p-2">
                  <Image
                    src="/placeholder.svg?height=96&width=140"
                    alt="Samsung Galaxy A05"
                    width={140}
                    height={96}
                    className="mx-auto object-contain"
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">Samsung Galaxy A05</h3>
                <p className="mt-1 text-xs text-gray-300 line-clamp-2">Siempre conectado</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-emerald-500/30 blur-xl" />
            <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-emerald-500/30 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
