import { getCatalog } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';

export default async function ProductsPage() {
  console.log('Renderizando página de productos...');
  const products = await getCatalog();

  if (!products) {
    console.log('No se pudieron cargar los productos.');
    return <div className="p-4">Error al cargar los productos desde la API. Verifica la consola del servidor.</div>;
  }

  if (products.length === 0) {
    console.log('La API devolvió 0 productos.');
    return <div className="p-4">No se encontraron productos.</div>;
  }

  console.log(`Mostrando ${products.length} productos.`);

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