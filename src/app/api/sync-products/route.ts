import { syncProductsFromApi } from "@/actions/apiActions";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const authToken = (req.headers.get('authorization') || '').split('Bearer ').at(1);
  
    if (authToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
  
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
