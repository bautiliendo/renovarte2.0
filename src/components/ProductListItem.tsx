'use client';

import Image from 'next/image'; // Re-importar Image
import Link from 'next/link'; // Import Link
import { useState } from 'react'; // Import useState
import type { Product } from '@/actions/productActions';

// Simple slugify function
function slugify(text: string): string {
  if (!text) return ''; // Handle cases where text might be undefined or null
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // separate accent from letter
    .replace(/[\u0300-\u036f]/g, '') // remove all accents
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const imageUrl = product.url_imagenes?.[0]?.url;
  const productSlug = slugify(product.item_desc_0);
  const [imageError, setImageError] = useState(false); // State to track image loading error

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <li
      key={product.item_id}
      className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-md m-0 flex flex-col hover:shadow-lg transition-shadow duration-150 ease-in-out"
    >
      <Link href={`/products/${productSlug}`} className="flex flex-col h-full">
        {/* Contenedor de la Imagen */}
        <div className="relative w-full pt-[100%] bg-gray-100"> {/* Added bg-gray-100 here for consistent placeholder background */}
          {/* Mostrar imagen si hay URL y no hay error, placeholder si no */}
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl} // Usar URL original
              alt={product.item_desc_0 || 'Imagen del producto'}
              fill
              className="object-contain p-[10px]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" // Ajustar sizes según el layout de grid
              priority={false}
              onError={handleImageError} // Add onError handler
            />
          ) : (
            // Placeholder visible if no URL or if imageError is true
            <div className="absolute inset-0 flex h-full w-full items-center justify-center">
              <span className="text-sm text-gray-500">Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Contenedor del Texto - Removed flex-grow from here, handled by Link parent */}
        <div className="p-4 flex-grow"> {/* Added flex-grow here */}
          <h2 className="mt-0 text-base font-semibold text-gray-600 min-h-[40px] overflow-hidden text-ellipsis line-clamp-2"> {/* Assuming @tailwindcss/line-clamp */}
            {product.item_desc_0}
          </h2>
          <p className="my-1 text-sm text-gray-600">
            <strong>Marca:</strong> {product.marca}
          </p><p className="my-1 text-sm text-gray-600">
            <strong>Categoria:</strong> {product.categoria}
          </p>
          {/* <p className="mt-2 text-lg font-bold text-gray-600">
            ${product.precioNeto_USD.toFixed(2)} <span className="text-sm font-normal">USD</span>
          </p> */}
        </div>

        {/* Botón de Cotización (Outside the main text flex-grow to stick to bottom) */}
        <div className="px-4 pb-4 pt-2 mt-auto"> {/* Added mt-auto */}
          {/* Placeholder if button is removed/commented */}
        </div>
      </Link>
    </li>
  );
} 