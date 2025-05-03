import React from 'react'
import Image from 'next/image';
import { getCatalog, type Product } from '@/actions/productActions';

// Simple slugify function (duplicate for now, ideally move to utils)
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface ProductDetailPageProps {
  params: {
    slug: string; // Changed from id to slug
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // No need to parse ID anymore
  const parametros = await params;
  const requestedSlug = parametros.slug;

  console.log(`Fetching product details for slug: ${requestedSlug}...`);

  // Fetch all products
  const allProducts = await getCatalog();

  // Find the product matching the slug
  let product: Product | undefined = undefined;
  if (allProducts) {
    product = allProducts.find(p => slugify(p.item_desc_0) === requestedSlug);
  }

  if (!product) {
    console.log(`Producto con slug ${requestedSlug} no encontrado.`);
    return <div className="p-4 text-center text-gray-600 min-h-[500px]">Producto no encontrado.</div>;
  }

  console.log(`Mostrando detalles para: ${product.item_desc_0}`);
  const primaryImageUrl = product.url_imagenes?.[0]?.url;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white m-8 border border-gray-200 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative aspect-square border rounded-md overflow-hidden bg-gray-100">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={product.item_desc_0 || 'Imagen del producto'}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority // Prioritize loading the main product image
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">Imagen no disponible</span>
            </div>
          )}
          {/* Optional: Thumbnail gallery for multiple images */}
          {product.url_imagenes && product.url_imagenes.length > 1 && (
            <div className="absolute bottom-2 left-2 right-2 flex space-x-2 justify-center">
              {product.url_imagenes.map((img, index) => (
                <div key={index} className="w-12 h-12 border rounded overflow-hidden relative cursor-pointer hover:border-blue-500">
                   <Image src={img.url} alt={`Thumbnail ${index + 1}`} fill className="object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{product.item_desc_0}</h1>

          <div className="mb-4">
            <span className="text-gray-700 font-semibold">Marca:</span>
            <span className="ml-2 text-gray-600">{product.marca}</span>
          </div>
          <div className="mb-4">
            <span className="text-gray-700 font-semibold">Categoría:</span>
            <span className="ml-2 text-gray-600">{product.categoria} {product.subcategoria ? `> ${product.subcategoria}` : ''}</span>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock_caba > 0 ? (
              <p className="text-lg text-green-600 font-semibold">
                Stock Disponible ({product.stock_caba} unidades)
              </p>
            ) : (
              <span className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded">
                Sin Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.item_desc_2 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Descripción</h2>
              <p className="text-gray-600 whitespace-pre-line">{product.item_desc_2}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-auto pt-4"> {/* Pushes button to the bottom */}
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 ease-in-out"
            >
              Consultar cotización
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Add other sections like Specifications (Weight, Dimensions), Related Products, etc. */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Especificaciones</h2>
        <ul>
          <li>Peso: {product.peso_gr} gr</li>
          <li>Dimensiones: {product.alto_cm}cm x {product.ancho_cm}cm x {product.largo_cm}cm</li>
        </ul>
      </div>
    </div>
  );
}
