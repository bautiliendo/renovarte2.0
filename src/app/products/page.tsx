import { getCatalog } from '@/actions/productActions';
import ProductListItem from '@/components/ProductListItem';

export default async function ProductsPage() {
  console.log('Renderizando página de productos...');
  const products = await getCatalog();

  if (!products) {
    console.log('No se pudieron cargar los productos.');
    return <div style={{ padding: '20px' }}>Error al cargar los productos desde la API. Verifica la consola del servidor.</div>;
  }

  if (products.length === 0) {
    console.log('La API devolvió 0 productos.');
    return <div style={{ padding: '20px' }}>No se encontraron productos.</div>;
  }

  console.log(`Mostrando ${products.length} productos.`);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Catálogo de Productos</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {products.map((product) => (
          <ProductListItem key={product.item_id} product={product} />
        ))}
      </div>
    </div>
  );
}