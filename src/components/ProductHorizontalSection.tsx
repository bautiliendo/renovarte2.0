import Link from 'next/link';
import ProductCardHorizontal from '@/components/ProductCardHorizontal';
import type { IProduct } from '@/models/Product';
import { ChevronRight } from 'lucide-react';

interface ProductHorizontalSectionProps {
  title: string;
  products: IProduct[];
  viewAllLink?: string;
  viewAllText?: string;
}

export default function ProductHorizontalSection({ 
  title, 
  products, 
  viewAllLink = "/products",
  viewAllText = "Ver todos"
}: ProductHorizontalSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header de la sección */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            {title}
          </h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              {viewAllText}
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Scroll horizontal de productos */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {products.map((product) => (
              <div key={product._id.toString()} className="flex-none snap-start">
                <ProductCardHorizontal product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}