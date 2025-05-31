import { getProductsFromDB } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';
import { DISPLAY_MAIN_CATEGORIES } from '@/config/categories.config';
import { IProduct } from '@/models/Product';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator, BreadcrumbLink } from '@/components/ui/breadcrumb';

export const revalidate = 3600; // Revalidar la página cada hora

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string
    query?: string
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {

  const params = await searchParams;
  const categoryFromUrl = params?.category;
  const queryFromUrl = params?.query;
  const currentPage = Number(params?.page) || 1;
  const productsPerPage = 12;

  // ← CAMBIO: Nueva lógica para manejar categoría vs búsqueda
  const defaultCategoryFromConfig = DISPLAY_MAIN_CATEGORIES[0];

  // Si hay query, no aplicar categoría por defecto (buscar en todas)
  // Si no hay query, aplicar categoría (de URL o por defecto)
  const categoryForDataFetching = queryFromUrl
    ? categoryFromUrl // Solo usar categoría si viene de URL cuando hay búsqueda
    : (categoryFromUrl || defaultCategoryFromConfig); // Comportamiento normal sin búsqueda

  // Para el título, usar lógica diferente
  const categoryForTitle = categoryFromUrl || defaultCategoryFromConfig || "Productos";

  console.log(
    `ProductsPage: Fetching products. Category: ${categoryForDataFetching || 'all categories'}, Query: ${queryFromUrl || 'none'}, Page: ${currentPage}`
  );


  let productData: {
    products: IProduct[];
    totalProducts: number;
    currentPage: number;
    totalPages: number;
  } | null = null;

  try {
    productData = await getProductsFromDB({
      category: categoryForDataFetching,
      query: queryFromUrl,
      page: currentPage,
      limit: productsPerPage,
    })

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
        {
          queryFromUrl ? (
            <p className=" font-bold mt-4 ">
              Resultados para &quot;{queryFromUrl}&quot;:
            </p>
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Categoria</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{categoryForTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )
        }
      </h1>
      {productData.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productData.products.map((product: IProduct) => (
            <ProductListItem key={product._id.toString()} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <div className="flex flex-col gap-4 items-center justify-center">
            <p className="text-2xl font-bold">
              No hay productos que coincidan con tu búsqueda.
            </p>
            <button className="bg-emerald-400 hover:bg-emerald-500 text-black px-4 py-2 rounded-md">
              <Link href="/products">Ver todos los productos</Link>
            </button>
          </div>
        </div>
      )}

      <Pagination
        productData={productData}
        currentPage={currentPage}
        categoryFromUrl={categoryFromUrl || ''}
        queryFromUrl={queryFromUrl}
      />
    </div>
  );
}