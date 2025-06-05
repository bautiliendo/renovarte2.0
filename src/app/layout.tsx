import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import Container from "@/components/ui/Container"
import CategoryFilter from "@/components/CategoryFilter"
import { DISPLAY_MAIN_CATEGORIES } from '@/config/categories.config'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Renovarte - Tienda de Electrodomésticos y Tecnología",
  description: "Encontrá todos los electrodomésticos, celulares y productos informáticos para renovar tu casa.",
  keywords: "electrodomésticos, celulares, tecnología, informática, renovarte, tienda online",
  authors: [{ name: "Renovarte" }],
  creator: "Renovarte",
  publisher: "Renovarte",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://renovarte.com.ar'), // Cambia por tu dominio real
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Renovarte - Tienda de Electrodomésticos y Tecnología",
    description: "Encontrá todos los electrodomésticos, celulares y productos informáticos para renovar tu casa.",
    url: 'https://renovarte.com.ar', // Cambia por tu dominio real
    siteName: 'Renovarte',
    images: [
      {
        url: '/Renovartelogo.png',
        width: 1200,
        height: 630,
        alt: 'Renovarte - Logo',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/R_circular.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/Renovartelogo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/Renovartelogo.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* Background pattern elements */}
          <div className="fixed inset-0 z-[-1] overflow-hidden">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[150px]" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
          </div>
          <Navbar />
          <CategoryFilter
            allCategories={DISPLAY_MAIN_CATEGORIES}
            basePath="/products"
          />
          <main className="relative">
            <Container>
              {children}
            </Container>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
