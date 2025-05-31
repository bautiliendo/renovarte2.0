import Image from 'next/image';
import Link from 'next/link';
import type { IProduct } from '@/models/Product';

interface ProductCardHorizontalProps {
    product: IProduct;
}

export default function ProductCardHorizontal({ product }: ProductCardHorizontalProps) {
    const imageUrl = product.url_imagenes?.[0]?.url;

    return (
        <Link href={`/products/${product._id.toString()}`}>
            <div className="w-64 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 backdrop-blur-sm">
                {/* Imagen del producto */}
                <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.item_desc_0 || 'Imagen del producto'}
                            fill
                            className="object-contain p-2"
                            sizes="256px"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                            <span className="text-gray-400">Sin imagen</span>
                        </div>
                    )}
                </div>

                {/* Contenido del producto */}
                <div className="p-4">
                    <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
                        {product.item_desc_0}
                    </h3>

                    <div className="space-y-1 text-xs text-gray-300">
                        {product.marca && (
                            <p><span className="text-gray-400">Marca:</span> {product.marca}</p>
                        )}
                        <p><span className="text-gray-400">Categoría:</span> {product.category}</p>
                    </div>

                    <div className="mt-3 text-emerald-400 text-sm font-medium">
                        Ver detalles →
                    </div>
                </div>
            </div>
        </Link>
    );
}