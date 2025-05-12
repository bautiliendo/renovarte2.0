import { getProductsFromDB } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';
import { isImageAccessible } from '@/utils/isImageAccesible';
import { IProduct } from '@/models/Product';

export default async function ProductsPage() {
  console.log("ProductsPage: Intentando obtener todos los productos de la DB...");

  let productData: { products: IProduct[]; totalProducts: number; currentPage: number; totalPages: number; } | null = null;

  try {
    productData = await getProductsFromDB({ limit: 2000 }); 

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
          {productData.totalProducts > 0 && 
            <p className="text-sm text-gray-500">(Se esperaba un total de {productData.totalProducts} productos según la base de datos)</p>
          }
        </div>
      );
    }

    // productData.products.length > 0, so we can proceed with image checks

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

  if (!productData) {
    // This fallback should ideally not be reached if try-catch is comprehensive
    return (
      <div className="p-4">
        <h1>Error Inesperado</h1>
        <p>No se pudieron cargar los datos de los productos por una razón desconocida.</p>
      </div>
    );
  }

  // Re-introduce image accessibility checks
  // console.log(`ProductsPage: Verificando imágenes para ${productData.products.length} productos...`);
  const productChecks = await Promise.all(
    productData.products.map(async (product: IProduct) => {
      const imageUrl = product.url_imagenes?.[0]?.url;
      const isAccessible = imageUrl ? await isImageAccessible(imageUrl) : false;
      if (!isAccessible && imageUrl) {
        // console.warn(`ProductsPage: Imagen no accesible o inválida para producto ${product._id}: ${imageUrl}`);
      }
      return { product, isAccessible };
    })
  );

  const displayableProducts = productChecks
    .filter((check: { product: IProduct; isAccessible: boolean }) => check.isAccessible)
    .map((check: { product: IProduct; isAccessible: boolean }) => check.product)
    .sort((a: IProduct, b: IProduct) => (a.item_desc_0 || '').localeCompare(b.item_desc_0 || ''));
  
  console.log(`ProductsPage: ${displayableProducts.length} productos tienen imágenes accesibles y se mostrarán.`);

  if (displayableProducts.length === 0) {
    // This means products were fetched, but none had accessible images
    return (
        <div className="p-4 text-center">
            <p className="mb-4">Se encontraron {productData.totalProducts} productos, pero ninguno tiene una imagen principal válida o accesible en este momento.</p>
            <p className="text-sm text-gray-500">Por favor, verifica las URLs de las imágenes de los productos.</p>
        </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Catálogo de Productos</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayableProducts.map((product: IProduct) => (
          <ProductListItem key={product._id.toString()} product={product} />
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Mostrando {displayableProducts.length} de {productData.totalProducts} productos encontrados (filtrados por imagen principal accesible).
      </div>
    </div>
  );
}