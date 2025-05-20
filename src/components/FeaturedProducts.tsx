'use client'
import { ArrowRight } from "lucide-react";
import { formatProductTitle } from "@/helpers/formatProductTitle";
import Link from "next/link";
import type { IProduct } from "@/models/Product";
import { slugify } from "@/utils/slungify";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getFeaturedProducts } from "@/actions/productActions";

export default function FeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);
    
    
    
    return (
        <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredProducts.length > 0 && (
                <>
                    {/* Featured product card */}
                    <div className="col-span-1 sm:col-span-2 overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-transform hover:scale-[1.02]">
                        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">Destacado</div>
                        <Link href={`/products/${slugify(featuredProducts[0].item_desc_0)}`}>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative w-full sm:w-48 h-48 overflow-hidden rounded-lg bg-white/5">
                                    <Image
                                        src={featuredProducts[0].url_imagenes[0]?.url || "/placeholder.svg"}
                                        alt={featuredProducts[0].item_desc_0}
                                        fill
                                        className="object-contain p-4"
                                        sizes="(max-width: 768px) 100vw, 192px"
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-white mb-2">{formatProductTitle(featuredProducts[0].item_desc_0)}</h3>
                                    <p className="text-sm text-gray-300 mb-4">
                                        {featuredProducts[0].item_desc_1 || "¡Descubrí este producto destacado!"}
                                    </p>
                                    <div className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300">
                                        Ver detalles
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Secondary product cards */}
                    {featuredProducts.slice(1).map((product, index) => (
                        <Link key={product._id.toString()} href={`/products/${slugify(product.item_desc_0)}`}>
                            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-transform hover:scale-[1.02] h-full">
                                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">
                                    {index === 0 ? "Nuevo" : "Oferta"}
                                </div>
                                <div className="relative w-full h-48 overflow-hidden rounded-lg bg-white/5 mb-4">
                                    <Image
                                        src={product.url_imagenes[0]?.url || "/placeholder.svg"}
                                        alt={product.item_desc_0}
                                        fill
                                        className="object-contain p-4"
                                        sizes="(max-width: 768px) 100vw, 192px"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{formatProductTitle(product.item_desc_0)}</h3>
                                <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                                    {product.item_desc_1 || "¡Descubrí este producto!"}
                                </p>
                                <div className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300">
                                    Ver detalles
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </>
            )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-emerald-500/30 blur-xl" />
        <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-emerald-500/30 blur-xl" />
    </div>
    )
}