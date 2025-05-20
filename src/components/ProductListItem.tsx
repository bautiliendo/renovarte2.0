
import Image from 'next/image';
import Link from 'next/link';
import type { IProduct } from '@/models/Product';
import { slugify } from '@/utils/slungify';
import { ArrowRight } from 'lucide-react';

interface ProductListItemProps {
  product: IProduct;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const imageUrl = product.url_imagenes?.[0]?.url;
  const productSlug = slugify(product.item_desc_0);


  return (
    <li
      key={product._id.toString()}
      className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-md m-0 flex flex-col hover:shadow-lg transition-shadow duration-150 ease-in-out"
    >
      <Link href={`/products/${productSlug}`} className="flex flex-col h-full">
        <div className="relative w-full pt-[100%] bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.item_desc_0 || 'Imagen del producto'}
              fill
              className="object-contain p-[10px]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex h-full w-full items-center justify-center">
              <span className="text-sm text-gray-500">Imagen no disponible</span>
            </div>
          )}
        </div>


        <div className="p-4 flex-grow">
          <h2 className="mt-0 text-base font-semibold text-gray-600 min-h-[40px] overflow-hidden text-ellipsis line-clamp-2"> {/* Assuming @tailwindcss/line-clamp */}
            {product.item_desc_0}
          </h2>
          <p className="my-1 text-sm text-gray-600">
            <strong>Marca:</strong> {product.marca}
          </p><p className="my-1 text-sm text-gray-600">
            <strong>Categoria:</strong> {product.category}
          </p>
          <div className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300">
            Ver detalles
            <ArrowRight className="ml-1 h-4 w-4 " />
          </div>
        </div>
      </Link>
    </li>
  );
} 