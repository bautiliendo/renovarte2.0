'use client'

import { ReactTyped } from "react-typed"

export default function ClientTypedComponent() {
  return (
    <ReactTyped
      className='text-lg lg:text-3xl font-bold text-[#00df9a]'
      strings={['3 ABRIL', 'UPCN', 'Empleados hospital privado']}
      typeSpeed={70}
      backSpeed={70}
      loop
    />
  )
}