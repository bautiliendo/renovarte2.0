import { ShoppingCart, MessageCircle, Search, CreditCard, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ComprarPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">¿Cómo Comprar o Consultar?</h1>

        <div className="grid gap-12">
          {/* Introducción */}
          <section className="grid gap-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              En nuestro e-commerce, puedes añadir productos a tu carrito y coordinar una compra o simplemente consultar
              detalles y precio de un producto a través de WhatsApp.
            </p>
          </section>

          {/* Pasos para comprar */}
          <section className="grid gap-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Proceso de compra</h2>

            <div className="grid gap-8">
              {/* Paso 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#00E599]/20 flex items-center justify-center">
                  <Search className="h-6 w-6 text-[#00E599]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Paso 1</h3>
                  <p className="text-gray-300">Explora nuestros productos y añade los que te interesen al carrito.</p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#00E599]/20 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-[#00E599]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Paso 2</h3>
                  <p className="text-gray-300">Dirígete a tu carrito.</p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#00E599]/20 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-[#00E599]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Paso 3</h3>
                  <p className="text-gray-300">
                    En el carrito, encontrarás un botón con el logo de WhatsApp y el texto &quot;Consultar&quot;.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#00E599]/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-[#00E599]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Paso 4</h3>
                  <p className="text-gray-300">
                    Completa el formulario, y serás redirigido automáticamente a una conversación en WhatsApp con
                    nuestro equipo. El mensaje incluirá tus datos ingresados y la descripción de los productos que hayas
                    seleccionado.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#111827] p-8 rounded-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Es fácil y rápido!</h2>
              <p className="text-gray-300">Si tienes alguna duda, no dudes en contactarnos.</p>
            </div>
            <Link href="/productos">
              <Button className="bg-[#00E599] hover:bg-[#00C080] text-black font-medium px-6 py-6 h-auto">
                Ver Productos
              </Button>
            </Link>
          </section>

          {/* Preguntas frecuentes */}
          <section className="grid gap-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-[#00E599]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Preguntas frecuentes</h2>
            </div>

            <div className="grid gap-6">
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-2">¿Cómo puedo pagar mi compra?</h3>
                <p className="text-gray-300">
                  Ofrecemos múltiples métodos de pago que coordinaremos contigo a través de WhatsApp, incluyendo
                  transferencia bancaria, efectivo y descuento directo para afiliados de sindicatos y mutuales con
                  convenio.
                </p>
              </div>

              <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-2">¿Realizan envíos?</h3>
                <p className="text-gray-300">
                  Sí, realizamos envíos a toda la ciudad de Córdoba y alrededores. Los detalles de envío y costos serán
                  coordinados durante la conversación por WhatsApp.
                </p>
              </div>

              <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-2">¿Puedo consultar sin compromiso de compra?</h3>
                <p className="text-gray-300">
                  ¡Por supuesto! Puedes utilizar el sistema de carrito y WhatsApp simplemente para consultar precios,
                  disponibilidad o cualquier duda sobre nuestros productos sin compromiso alguno.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
