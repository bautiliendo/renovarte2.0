import { getProductsFromDB } from "@/actions/productActions";
import BenefitsBanner from "@/components/BenefitsBanner";
import ClientTypedComponent from "@/components/ClientTypedComponent"
import ProductHorizontalSection from "@/components/ProductHorizontalSection";
import Image from "next/image"

export const revalidate = 3600; // Revalidar cada hora

export default async function Home() {
  try {
    // Obtener productos en paralelo
    const [featured, newItems] = await Promise.all([
      getProductsFromDB({
        category: 'Celulares Libres',
        limit: 8
      }),
      getProductsFromDB({
        category: 'Television',
        page: 2,
        limit: 8
      })
    ])

    return (
      <div className="space-y-0">
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
                    <ClientTypedComponent />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center border-2 border-gray-700 rounded-lg">
                <Image src="/promocion.png" alt="Banner" width={1000} height={1000} />
              </div>
            </div>
          </div>

        </section>
        <div className="flex flex-col gap-10 pb-10">
          <ProductHorizontalSection
            title="Destacados"
            products={featured.products || []}
            viewAllLink="/products?category=Celulares Libres"
            viewAllText="Ver más"
        />

        <ProductHorizontalSection
          title="Television"
          products={newItems.products || []}
          viewAllLink={`/products?category=Television`}
            viewAllText="Ver más"
          />

          <BenefitsBanner />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading homepage:', error)
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl text-white">Error cargando productos</h1>
        <p className="text-gray-300">Por favor, intenta recargar la página.</p>
      </div>
    )
  }
}