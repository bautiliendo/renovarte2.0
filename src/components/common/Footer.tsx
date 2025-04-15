import { Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row md:justify-between md:items-start gap-12 text-center md:text-left">

        {/* Columna 1: Logo + Descripción */}
        <div className="md:w-1/4 mx-auto md:mx-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
            Renovarte
          </h2>
          <p className="text-sm text-gray-600 mt-2">
          Tienda de electrodomésticos, celulares y productos informáticos para renovar tu casa.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#hero" className="">Inicio</a></li>
            <li><Link href="/products" className="">Productos</Link></li>
            <li><Link href="/buy" className="">Comprar</Link></li>
            <li><Link href="/business" className="">Empresa</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:juanbautistaliendo1@gmail.com" className="">juanbautista.................</a></li>
            <li>Tel: <a href="tel:+549.........." className="">+54 9 ... ... ....</a></li>
          </ul>
        </div>

        {/* Columna 4: Redes sociales */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Seguinos</h3>
          <div className="flex justify-center md:justify-start gap-4 ">
            <a href="#" aria-label="Instagram" className="">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="WhatsApp" className="">
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Renovarte. Todos los derechos reservados.
      </div>
    </footer>
  )
}
