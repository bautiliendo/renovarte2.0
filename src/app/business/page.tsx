import { Building, Award, Users, Target } from "lucide-react"

export default function EmpresaPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="">
        <div className="grid gap-12">
          {/* Acerca de nosotros */}
          <section className="grid gap-6">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-[#00E599]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Acerca de nosotros</h2>
            </div>
            <div className="grid gap-6 text-gray-300 leading-relaxed">
              <p>
                En nuestra empresa, con sede en Córdoba, nos enorgullecemos de contar con una trayectoria de 7 años en
                el mercado de ventas corporativas, destacándonos por nuestro compromiso con la calidad y la satisfacción
                de nuestros clientes. Desde nuestros inicios, hemos trabajado arduamente para consolidarnos como líderes
                en el sector, ofreciendo productos y servicios que cumplen con los más altos estándares de excelencia.
              </p>
              <p>
                En agosto de 2017, dimos un paso significativo al expandir nuestras operaciones para incluir la venta a
                afiliados de sindicatos y mutuales. Este avance nos permitió llegar a una mayor cantidad de personas,
                ofreciendo facilidades de pago mediante el sistema de descuento directo a través del recibo de sueldo.
                De esta manera, buscamos proporcionar una experiencia de compra accesible y conveniente para todos
                nuestros clientes.
              </p>
            </div>
          </section>

          {/* Convenios */}
          <section className="grid gap-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[#00E599]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Nuestros convenios</h2>
            </div>
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-6">
                Estamos orgullosos de contar con convenios establecidos con importantes entidades, que nos permiten
                brindar beneficios exclusivos y adaptados a las necesidades de los afiliados.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#00E599]/10 flex items-center justify-center mb-3">
                    <span className="text-[#00E599] font-bold">HPUC</span>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Hospital Privado Universitario de Córdoba</p>
                </div>
                <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#00E599]/10 flex items-center justify-center mb-3">
                    <span className="text-[#00E599] font-bold">UPCN</span>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Unión del Personal Civil de la Nación</p>
                </div>
                <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#00E599]/10 flex items-center justify-center mb-3">
                    <span className="text-[#00E599] font-bold">3 ABRIL</span>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Mutual 3 de Abril</p>
                </div>
              </div>
            </div>
          </section>

          {/* Nuestra misión */}
          <section className="grid gap-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-[#00E599]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Nuestra misión</h2>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00E599] to-transparent"></div>
              <div className="pl-6 text-gray-300 leading-relaxed">
                <p className="mb-4">
                  Nuestra misión es continuar creciendo y mejorando, siempre enfocados en ofrecer un servicio de
                  calidad, con atención personalizada y soluciones adaptadas a las necesidades de cada cliente.
                </p>
                <p>
                  Nos esforzamos por ser una empresa de referencia en el ámbito de ventas corporativas y retail,
                  marcando la diferencia a través de nuestra dedicación y profesionalismo. Agradecemos la confianza
                  depositada en nosotros y seguimos trabajando con entusiasmo para mantener y superar sus expectativas,
                  consolidándonos como su mejor opción en el mercado.
                </p>
              </div>
            </div>
          </section>

          {/* Trayectoria */}
          <section className="grid gap-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-[#00E599]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Nuestra trayectoria</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E599]/10 rounded-bl-full"></div>
                <h3 className="text-xl font-bold text-white mb-3">7 años</h3>
                <p className="text-gray-300 relative z-10">
                  De experiencia en el mercado de ventas corporativas, brindando productos de calidad y servicio
                  excepcional a nuestros clientes.
                </p>
              </div>
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E599]/10 rounded-bl-full"></div>
                <h3 className="text-xl font-bold text-white mb-3">Desde 2017</h3>
                <p className="text-gray-300 relative z-10">
                  Expandimos nuestras operaciones para incluir ventas a afiliados de sindicatos y mutuales, ofreciendo
                  facilidades de pago mediante descuento directo.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
