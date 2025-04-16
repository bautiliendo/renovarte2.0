import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import Container from "@/components/ui/Container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Renovarte - Tienda de Electrodomésticos y Tecnología",
  description: "Encontrá todos los electrodomésticos, celulares y productos informáticos para renovar tu casa.",
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
