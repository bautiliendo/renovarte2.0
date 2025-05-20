import { getProductById } from '@/actions/productActions';
import { ProductClientView } from '@/components/ProductClientView';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const parametros = await params;
  const productId = parametros.id;
  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className="container mx-auto min-h-[500px] p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Producto no encontrado</h1>
        <p className="text-gray-500">El producto que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return <ProductClientView product={product} />;
}
