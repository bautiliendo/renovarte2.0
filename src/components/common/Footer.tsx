'use client'
import { Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


export default function Footer() {

  const handleWhatsapp = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const mensaje = "Hola! Me contacto desde su página web para realizar una consulta"
    const numeroTel = '5493512399026';
    const whatsappLink = `https://wa.me/${numeroTel}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappLink, '_blank')
  }

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
            <li><Link href="/" className="">Inicio</Link></li>
            <li><Link href="/products" className="">Productos</Link></li>
            <li><Link href="/buy" className="">Comprar</Link></li>
            <li><Link href="/business" className="">Empresa</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <button onClick={handleWhatsapp} className='hover:text-green-600 underline'>+54 9 351 239 9026</button>
          </ul>
        </div>

        {/* Columna 4: Redes sociales */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Seguinos</h3>
          <div className="flex justify-center md:justify-start gap-4 ">
            <a href='https://www.instagram.com/renovartecba/' target="_blank" rel="noopener noreferrer">
              <li className=' hover:text-rose-400 hover:underline list-none'><Instagram size={20} /></li>
            </a>
            <a href='https://www.facebook.com/renovartecba/' target="_blank" rel="noopener noreferrer">
              <li className=' hover:text-blue-500 hover:underline list-none'> <Facebook size={20} /></li>
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
