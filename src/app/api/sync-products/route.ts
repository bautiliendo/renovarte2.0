import { syncProductsFromApi } from '@/actions/productActions';
import { NextResponse } from 'next/server';

export async function GET() { // O POST si prefieres y lo proteges adecuadamente
  console.log('/api/sync-products: Recibida solicitud de sincronización.');
  try {
    const result = await syncProductsFromApi();
    if (result.success) {
      return NextResponse.json({ message: 'Sincronización iniciada y completada.', details: result });
    } else {
      return NextResponse.json({ message: 'Sincronización falló.', details: result }, { status: 500 });
    }
  } catch (error) {
    console.error('/api/sync-products: Error crítico durante la sincronización:', error);
    return NextResponse.json({ message: 'Error crítico al intentar sincronizar.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
