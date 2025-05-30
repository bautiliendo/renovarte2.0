import Link from "next/link";

export function Pagination({ productData, currentPage, categoryFromUrl }: { productData: { totalPages: number, currentPage: number }, currentPage: number, categoryFromUrl: string }) {
    if (productData.totalPages > 1) {
        return (
            <div className="mt-8 flex justify-center items-center space-x-2">
                {currentPage > 1 && (
                    <Link href={`/products?${categoryFromUrl ? `category=${encodeURIComponent(categoryFromUrl)}&` : ''}page=${currentPage - 1}`} className="px-4 py-2 border rounded hover:border-gray-400 transition-all duration-300">
                        Anterior
                    </Link>
                )}
                <span className="text-sm">
                    Página {productData.currentPage} de {productData.totalPages}
                </span>
                {currentPage < productData.totalPages && (
                    <Link href={`/products?${categoryFromUrl ? `category=${encodeURIComponent(categoryFromUrl)}&` : ''}page=${currentPage + 1}`} className="px-4 py-2 border rounded hover:border-gray-400 transition-all duration-300">
                        Siguiente
                    </Link>
                )}
            </div>
        )
    }
}