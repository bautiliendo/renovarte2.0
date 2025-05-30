import { getProductsFromDB } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';
import { DISPLAY_CATEGORIES_FOR_UI } from '@/config/categories.config';
import { IProduct } from '@/models/Product';
import { Pagination } from '@/components/Pagination';

export const revalidate = 3600; // Revalidar la página cada hora

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {

  const params = await searchParams;
  const categoryFromUrl = params?.category;
  const currentPage = Number(params?.page) || 1;
  const productsPerPage = 12;

  // Determine the default category from the configuration
  const defaultCategoryFromConfig = DISPLAY_CATEGORIES_FOR_UI[0];
  // Determine the category to use for fetching data and for the main title
  const categoryForDataFetching = categoryFromUrl || defaultCategoryFromConfig;
  // Determine the category string for the H1 title, with a final fallback
  const categoryForTitle = categoryFromUrl || defaultCategoryFromConfig || "Productos";


  console.log(
    `ProductsPage: Fetching products. Category: ${categoryForDataFetching || 'all (if default is undefined)'}, Page: ${currentPage}`
  );


  let productData: {
    products: IProduct[];
    totalProducts: number;
    currentPage: number;
    totalPages: number;
  } | null = null;

  try {
    productData = await getProductsFromDB({
      category: categoryForDataFetching, // Use the determined category for fetching
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

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">
        Categoría: {categoryForTitle} 
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

      <Pagination productData={productData} currentPage={currentPage} categoryFromUrl={categoryFromUrl || ''} />
    </div>
  );
}