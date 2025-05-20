import { getProductsFromDB } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';
import { DISPLAY_CATEGORIES_FOR_UI } from '@/config/categories.config';
import { IProduct } from '@/models/Product';
import Link from 'next/link';
import CategoryFilter from '@/components/CategoryFilter';

export const revalidate = 3600; // Revalidar la página cada hora

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const parametros = await searchParams;

  const selectedCategory = parametros?.category;
  const currentPage = Number(parametros?.page) || 1;
  const productsPerPage = 12;

  console.log(
    `ProductsPage: Fetching products. Category: ${selectedCategory}, Page: ${currentPage}`
  );


  let productData: {
    products: IProduct[];
    totalProducts: number;
    currentPage: number;
    totalPages: number;
  } | null = null;

  try {
    productData = await getProductsFromDB({
      category: selectedCategory,
      page: currentPage,
      limit: productsPerPage,
    });

    console.log(`ProductsPage: Datos recibidos de getProductsFromDB. Total productos en DB: ${productData?.totalProducts}, Productos recibidos: ${productData?.products?.length}`);

    if (!productData || !productData.products) {
      console.error("ProductsPage: Error - No se recibieron productos o productData es nulo.");
      return (
        <div className="p-4">
          <h1>Error de Carga</h1>
          <p>Disculpas, hubo un error al cargar los productos.</p>
        </div>
      );
    }

    if (productData.products.length === 0) {
      console.log("ProductsPage: No se encontraron productos en la DB.");
      return (
        <div className="p-4 text-center">
          <h1>Catálogo Vacío</h1>
          <p>No se encontraron productos en la base de datos.</p>
        </div>
      );
    }

  } catch (error) {
    console.error("ProductsPage: Error general al obtener productos:", error);
    return (
      <div className="p-4">
        <h1>Error de Conexión</h1>
        <p>Ocurrió un error al intentar conectar con la base de datos o al procesar los productos.</p>
        <pre>{error instanceof Error ? error.message : JSON.stringify(error)}</pre>
      </div>
    );
  }

  // If productData is null after try-catch (e.g. initial state or unhandled error path)
  if (!productData) {
    return (
      <div className="p-4">
        <h1>Error Inesperado</h1>
        <p>No se pudieron cargar los datos de los productos.</p>
      </div>
    );
  }

  // If no products found for the given filters
  if (productData.products.length === 0 && productData.totalProducts === 0 && selectedCategory) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">
          Catálogo: {selectedCategory || "Todos los Productos"}
        </h1>
        {/* Category Links */}
        <CategoryFilter
          allCategories={DISPLAY_CATEGORIES_FOR_UI}
          selectedCategory={selectedCategory}
          basePath="/products"
        />
        <p className="text-center">
          No se encontraron productos en la categoría &quot;{selectedCategory}&quot;.
        </p>
      </div>
    );
  }


  return (
    <div className="p-4">

      {/* Category Links */}
      <CategoryFilter
        allCategories={DISPLAY_CATEGORIES_FOR_UI}
        selectedCategory={selectedCategory}
        basePath="/products"
      />
      <h1 className="mb-4 text-2xl font-semibold">
        Catálogo: {selectedCategory || "Todos los Productos"}
      </h1>

      {productData.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productData.products.map((product: IProduct) => (
            <ProductListItem key={product._id.toString()} product={product} />
          ))}
        </div>
      ) : (
        <p>
          No hay productos que coincidan con los filtros seleccionados.
        </p>
      )}

      {/* Basic Pagination (Example) */}
      {productData.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          {currentPage > 1 && (
            <Link href={`/products?${selectedCategory ? `category=${encodeURIComponent(selectedCategory)}&` : ''}page=${currentPage - 1}`} className="px-4 py-2 border rounded hover:bg-gray-100">
              Anterior
            </Link>
          )}
          <span className="text-sm">
            Página {productData.currentPage} de {productData.totalPages}
          </span>
          {currentPage < productData.totalPages && (
            <Link href={`/products?${selectedCategory ? `category=${encodeURIComponent(selectedCategory)}&` : ''}page=${currentPage + 1}`} className="px-4 py-2 border rounded hover:bg-gray-100">
              Siguiente
            </Link>
          )}
        </div>
      )}
    </div>
  );
}