"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ReactTyped } from "react-typed"
import { useEffect, useState } from "react"
import { getFeaturedProducts } from "@/actions/productActions"
import { IProduct } from "@/models/Product"
import { slugify } from "@/utils/slungify"

// Helper function to format product titles
const formatProductTitle = (title: string): string => {
  // Split the title into parts
  const parts = title.split(' ');
  
  // For TV products
  if (title.toLowerCase().includes('tv')) {
    return parts.slice(0, 4).join(' '); // Take first 4 words for TVs
  }
  
  // For Notebooks
  if (title.toLowerCase().includes('notebook')) {
    return parts.slice(0, 5).join(' '); // Take first 3 words for notebooks
  }
  
  // For Phones
  if (title.toLowerCase().includes('celular')) {
    return parts.slice(0, 5).join(' '); // Take first 4 words for phones
  }
  
  // Default case: take first 3 words
  return parts.slice(0, 3).join(' ');
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

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

          {/* Featured products */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.length > 0 && (
                <>
                  {/* Featured product card */}
                  <div className="col-span-1 sm:col-span-2 overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-transform hover:scale-[1.02]">
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">Destacado</div>
                    <Link href={`/products/${slugify(featuredProducts[0].item_desc_0)}`}>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-full sm:w-48 h-48 overflow-hidden rounded-lg bg-white/5">
                          <Image
                            src={featuredProducts[0].url_imagenes[0]?.url || "/placeholder.svg"}
                            alt={featuredProducts[0].item_desc_0}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-xl font-bold text-white mb-2">{formatProductTitle(featuredProducts[0].item_desc_0)}</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            {featuredProducts[0].item_desc_1 || "¡Descubrí este producto destacado!"}
                          </p>
                          <div className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300">
                            Ver detalles
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Secondary product cards */}
                  {featuredProducts.slice(1).map((product, index) => (
                    <Link key={product._id.toString()} href={`/products/${slugify(product.item_desc_0)}`}>
                      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-transform hover:scale-[1.02] h-full">
                        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">
                          {index === 0 ? "Nuevo" : "Oferta"}
                        </div>
                        <div className="relative w-full h-48 overflow-hidden rounded-lg bg-white/5 mb-4">
                          <Image
                            src={product.url_imagenes[0]?.url || "/placeholder.svg"}
                            alt={product.item_desc_0}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{formatProductTitle(product.item_desc_0)}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                          {product.item_desc_1 || "¡Descubrí este producto!"}
                        </p>
                        <div className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300">
                          Ver detalles
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
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