'use client'; 

import Image from 'next/image'; // Re-importar Image
import type { Product } from '@/actions/productActions'; 

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  // Usar la URL directamente de la API, sin reemplazar
  const imageUrl = product.url_imagenes?.[0]?.url;

  return (
    <li 
      key={product.item_id} 
      style={{
        // Estilos de tarjeta
        border: '1px solid #e2e8f0', 
        borderRadius: '0.375rem', 
        overflow: 'hidden', 
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
        margin: '0', // El gap de la cuadrícula manejará el espacio
        display: 'flex', 
        flexDirection: 'column', 
      }}
    >
      {/* Contenedor de la Imagen */} 
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%' /* Aspect ratio 1:1 */ }}>
        {/* Mostrar imagen si hay URL, placeholder si no */}
        {imageUrl ? (
          <Image 
            src={imageUrl} // Usar URL original
            alt={product.item_desc_0 || 'Imagen del producto'}
            fill 
            style={{ objectFit: 'contain', padding: '10px' }} 
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" // Ajustar sizes según el layout de grid
            onError={() => { 
              // onError simplificado: solo loguear
            //   console.error(`Error al cargar imagen (onError): ${imageUrl}`);
            }}
            priority={false}
          />
        ) : (
          // Placeholder básico si no hay URL
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Imagen no disponible</span>
          </div>
        )}
      </div>
      
      {/* Contenedor del Texto */} 
      <div style={{ padding: '1rem', flexGrow: 1 /* Permitir que el texto crezca si es necesario */ }}> 
         <h2 style={{ marginTop: 0, color: '#4b5563',fontSize: '1rem', fontWeight: 600, minHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          NOMBRE: {product.partNumber}
         </h2> 
         <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0.25rem 0' }}>
           <strong>Marca:</strong> {product.marca}
         </p>
         <p style={{ fontSize: '1.125rem', color: '#4b5563',fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
           ${product.precioNeto_USD.toFixed(2)} <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>USD</span>
         </p> 
         <p style={{ fontSize: '0.8rem', color: product.stock_caba > 0 ? '#10b981' : '#ef4444', margin: '0.25rem 0 0 0' }}>
           Stock CABA: {product.stock_caba > 0 ? `${product.stock_caba} unidades` : 'Agotado'}
         </p>

      </div>
      {/* Aquí podrías añadir un botón "Añadir al carrito", etc. */}
       <div style={{ padding: '0 1rem 1rem 1rem' }}>
         {/* Espacio para botones o acciones futuras */}
       </div>
    </li>
  );
} 