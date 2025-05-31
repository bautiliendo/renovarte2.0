import { ShieldCheck, BadgeCheck, ThumbsUp } from "lucide-react"

export default function BenefitsBanner() {
  return (
    <section className="">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Compra Segura */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-[#00E599]/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#00E599]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Compra 100% segura</h3>
              <p className="text-sm text-gray-400">Más de 7 años de experiencia respaldan nuestro compromiso</p>
            </div>
          </div>

          {/* Garantía */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-[#00E599]/10 rounded-full flex items-center justify-center">
              <BadgeCheck className="w-7 h-7 text-[#00E599]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Calidad garantizada</h3>
              <p className="text-sm text-gray-400">Nuestros productos cuentan con garantía oficial</p>
            </div>
          </div>

          {/* Confianza */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-[#00E599]/10 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-7 h-7 text-[#00E599]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Confianza comprobada</h3>
              <p className="text-sm text-gray-400">Elegidos por sindicatos, mutuales y empresas líderes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
