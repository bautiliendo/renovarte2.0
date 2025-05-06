import { getProductsFromDB, IProduct } from '@/actions/productActions';
// import ProductListItem from '@/components/ProductListItem'; // Comentado
// import { isImageAccessible } from '@/utils/isImageAccesible'; // Comentado
// import Link from 'next/link'; // Comentado

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    subcategory?: string;
    q?: string;
    page?: string;
  };
}

/* // Comentado - Componente de paginación
function PaginationControls({ currentPage, totalPages, searchParams }: { currentPage: number; totalPages: number; searchParams?: ProductsPageProps['searchParams'] }) {
  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set('page', pageNumber.toString());
    return `/products?${params.toString()}`;
  };

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="mt-8 flex justify-center items-center space-x-4">
      {prevPage && (
        <Link href={createPageURL(prevPage)} className="px-4 py-2 border rounded hover:bg-gray-100">
          Anterior
        </Link>
      )}
      <span>
        Página {currentPage} de {totalPages}
      </span>
      {nextPage && (
        <Link href={createPageURL(nextPage)} className="px-4 py-2 border rounded hover:bg-gray-100">
          Siguiente
        </Link>
      )}
    </div>
  );
}
*/

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  console.log("ProductsPage: Intentando obtener productos de la DB...");

  try {
    // Llamada muy simple a getProductsFromDB sin filtros específicos para probar la conexión
    const productData = await getProductsFromDB({
      // page: 1, // Puedes omitir para que use valores por defecto de la función
      // limit: 5, // Puedes omitir para que use valores por defecto de la función
    }); 

    console.log("ProductsPage: Datos recibidos de getProductsFromDB:", productData);

    if (!productData || !productData.products) {
      console.error("ProductsPage: Error - No se recibieron productos o productData es nulo.");
      return (
        <div className="p-4">
          <h1>Prueba de Conexión a DB</h1>
          <p>Disculpas, hubo un error al cargar los productos o la estructura no es la esperada.</p>
          <pre>{JSON.stringify(productData, null, 2)}</pre>
        </div>
      );
    }

    if (productData.products.length === 0) {
      console.log("ProductsPage: No se encontraron productos en la DB.");
      return (
        <div className="p-4">
          <h1>Prueba de Conexión a DB</h1>
          <p>No se encontraron productos en la base de datos.</p>
          <p>Total de productos según la DB (puede ser 0 si la colección está vacía o el filtro no coincide): {productData.totalProducts}</p>
        </div>
      );
    }

    console.log(`ProductsPage: Se encontraron ${productData.products.length} productos.`);
    
    // Simplemente mostramos los datos crudos para verificar
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Prueba de Conexión y Datos de Productos</h1>
        <p>Conexión exitosa. Productos encontrados: {productData.products.length}</p>
        <p>Total de productos en la DB (según conteo con filtros actuales): {productData.totalProducts}</p>
        <h2 className="mt-4 mb-2 text-xl">Datos Crudos de Productos:</h2>
        <pre className="bg-black p-4 rounded overflow-x-auto">
          {JSON.stringify(productData.products, null, 2)}
        </pre>
        {/* <h2 className="mt-4 mb-2 text-xl">Datos Crudos de Paginación:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify({ totalProducts: productData.totalProducts, totalPages: productData.totalPages, currentPage: productData.currentPage }, null, 2)}
        </pre> */}
      </div>
    );

  } catch (error) {
    console.error("ProductsPage: Error general al obtener productos:", error);
    return (
      <div className="p-4">
        <h1>Prueba de Conexión a DB - ERROR</h1>
        <p>Ocurrió un error al intentar conectar con la base de datos o al procesar los productos.</p>
        <pre>{error instanceof Error ? error.message : JSON.stringify(error)}</pre>
      </div>
    );
  }

/* // Comentado - Lógica de verificación de imágenes y renderizado complejo
  const productChecks = await Promise.all(
    productData.products.map(async (product) => {
      const imageUrl = product.url_imagenes?.[0]?.url;
      const isAccessible = imageUrl ? await isImageAccessible(imageUrl) : false;
      return { product, isAccessible };
    })
  );

  const displayableProducts = productChecks
    .filter(check => check.isAccessible)
    .map(check => check.product)
    .sort((a,b) => (a.item_desc_0 || '').localeCompare(b.item_desc_0 || ''));

  if (displayableProducts.length === 0) {
    if (productData.totalProducts > 0) {
        return (
            <div className="p-4 text-center">
                <p className="mb-4">Se encontraron {productData.totalProducts} productos que coinciden con tu búsqueda, pero ninguno tiene una imagen principal válida en este momento.</p>
                <PaginationControls currentPage={productData.currentPage} totalPages={productData.totalPages} searchParams={searchParams} />
            </div>
        );
    }
    return <div className="p-4 text-center">No se encontraron productos que coincidan con tus criterios o no tienen imágenes válidas.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Catálogo de Productos</h1>
      {searchParams?.q && <p className="mb-4 text-lg">Resultados para: <span className="font-semibold">"{searchParams.q}"</span></p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayableProducts.map((product) => (
          <ProductListItem key={product._id.toString()} product={product} />
        ))}
      </div>

      <PaginationControls
        currentPage={productData.currentPage}
        totalPages={productData.totalPages}
        searchParams={searchParams}
      />
       <div className="mt-4 text-center text-sm text-gray-600">
        Mostrando {displayableProducts.length} de un total de {productData.totalProducts} productos que coinciden con los filtros.
      </div>
    </div>
  );
*/
}