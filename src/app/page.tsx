'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { redirect } from "next/navigation"
import { ReactTyped } from "react-typed"
import FeaturedProducts from "@/components/FeaturedProducts"

export default function Home() {

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 md:gap-8 lg:gap-16">
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
              <div className="inline-block rounded-lg py-2 backdrop-blur">
                <p className="text-sm font-medium text-gray-300">Beneficios exclusivos y convenios con mutuales</p>
                <ReactTyped
                  className='text-lg lg:text-3xl font-bold text-[#00df9a]'
                  strings={['3 ABRIL', 'UPCN', 'Empleados hospital privado']}
                  typeSpeed={70}
                  backSpeed={70}
                  loop
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => redirect('/buy')}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                ¿Cómo Comprar?
              </Button>
              <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-300"
                onClick={() => redirect('/products')}>
                Ver productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <FeaturedProducts />
        </div>
      </div>
    </section>
  )
}