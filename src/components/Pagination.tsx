import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function Pagination({
    productData,
    currentPage,
    categoryFromUrl,
    queryFromUrl
}: {
    productData: { totalPages: number, currentPage: number }
    , currentPage: number
    , categoryFromUrl: string
    , queryFromUrl?: string
}) {

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams();

        if (categoryFromUrl) {
            params.set('category', categoryFromUrl);
        }

        if (queryFromUrl) {
            params.set('query', queryFromUrl);
        }

        if (page > 1) {
            params.set('page', page.toString());
        }

        const queryString = params.toString();
        return `/products${queryString ? `?${queryString}` : ''}`;
    };

    // Función para generar los números de página a mostrar
    const getPageNumbers = () => {
        const totalPages = productData.totalPages;
        const current = currentPage;
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= 7) {
            // Si hay 7 páginas o menos, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica más compleja para páginas con ellipsis
            if (current <= 4) {
                // Estamos cerca del inicio
                pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
            } else if (current >= totalPages - 3) {
                // Estamos cerca del final
                pages.push(1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Estamos en el medio
                pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', totalPages);
            }
        }

        return pages;
    };

    if (productData.totalPages > 1) {
        const pageNumbers = getPageNumbers();

        return (
            <div className="mt-8 flex justify-center">
                <ShadcnPagination>
                    <PaginationContent>
                        {/* Botón Anterior */}
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious 
                                    href={buildPageUrl(currentPage - 1)}
                                />
                            </PaginationItem>
                        )}

                        {/* Números de página */}
                        {pageNumbers.map((page, index) => (
                            <PaginationItem key={index}>
                                {page === 'ellipsis' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        href={buildPageUrl(page)}
                                        isActive={page === currentPage}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        {/* Botón Siguiente */}
                        {currentPage < productData.totalPages && (
                            <PaginationItem>
                                <PaginationNext 
                                    href={buildPageUrl(currentPage + 1)}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </ShadcnPagination>
            </div>
        );
    }

    return null;
}