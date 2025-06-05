import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Bloquea rutas privadas si las tienes
    },
    sitemap: 'https://renovarte.com.ar/sitemap.xml',
  }
} 