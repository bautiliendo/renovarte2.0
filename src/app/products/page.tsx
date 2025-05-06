import { getCatalog } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';
import { isImageAccessible } from '@/utils/isImageAccesible';


export default async function ProductsPage() {
  const initialProducts = await getCatalog();

  if (!initialProducts) {
    return <div className="p-4">Disculpas, hubo un error al cargar los productos</div>;
  }

  if (initialProducts.length === 0) {
    return <div className="p-4">No se encontraron productos disponibles inicialmente.</div>;
  }

  // Filtrar productos verificando la accesibilidad de la primera imagen
  const productChecks = await Promise.all(
    initialProducts.map(async (product) => {
      // Asumimos que la primera imagen es la principal, o usamos una lógica específica si es necesario
      const imageUrl = product.url_imagenes?.[0]?.url;
      const isAccessible = await isImageAccessible(imageUrl);
      return { product, isAccessible };
    })
  );

  const products = productChecks
    .filter(check => check.isAccessible) // Mantenemos solo los productos con imagen accesible
    .map(check => check.product)
    .sort((a,b) => a.item_desc_0.localeCompare(b.item_desc_0)); 

  if (products.length === 0) {
    return <div className="p-4">No se encontraron productos con imágenes válidas disponibles.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductListItem key={product.item_id} product={product} />
        ))}
      </div>
    </div>
  );
}