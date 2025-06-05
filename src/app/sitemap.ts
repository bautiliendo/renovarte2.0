import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://renovarte.com.ar'
  
  // Páginas estáticas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/business`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Categorías principales (basadas en tu configuración)
  const categories = [
    'Celulares Libres',
    'Notebooks',
    'Television',
    'Electrodomesticos',
    'Climatizacion',
    'Bazar'
  ]

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/products?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Aquí podrías agregar productos dinámicos si tienes una base de datos
  // const productPages = await getProductsFromDB().then(products => 
  //   products.map(product => ({
  //     url: `${baseUrl}/products/${product.id}`,
  //     lastModified: new Date(product.updatedAt),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.7,
  //   }))
  // )

  return [
    ...staticPages,
    ...categoryPages,
    // ...productPages, // Descomenta cuando tengas productos dinámicos
  ]
} 