'use server';
import dbConnect from '@/lib/dbConnect';
import Product, { IProduct } from '@/models/Product';
import mongoose from 'mongoose';

// --- Opción 2: Obtener todos los productos ) ---
export async function getAllProducts(): Promise<IProduct[]> {
    try {
        await dbConnect();
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean(); // Ejemplo: solo activos y ordenados

        const mappedProducts = products.map(product => ({
            ...product,
            _id: product._id.toString(),
        })) as IProduct[];
        
        return mappedProducts;
    } catch (error) {
        console.error('Error detallado al buscar productos:', error);
        throw new Error('Error al buscar todos los productos.');
    }
}

// Interfaz para los parámetros de búsqueda y filtro
interface GetProductsParams {
  category?: string;
  subcategory?: string;
  query?: string; // Para el término de búsqueda
  page?: number;
  limit?: number;
  // Podrías añadir más: sortBy, sortOrder, etc.
}

// Nueva función para obtener productos de la base de datos con filtros y búsqueda
export async function getProductsFromDB(
  params: GetProductsParams = {}
): Promise<{ products: IProduct[]; totalProducts: number; totalPages: number; currentPage: number }> {
  const {
    category,
    subcategory,
    query,
    page = 1,
    limit = 12, // O un valor por defecto que prefieras para tu grid
  } = params;

  try {
    await dbConnect();

    // Construye el objeto de filtro dinámicamente
    const filter: mongoose.FilterQuery<IProduct> = {
      isActive: true, // Por defecto, solo productos activos
    };

    if (category) {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (query && query.trim() !== '') {
      const searchRegex = new RegExp(query.trim(), 'i'); // 'i' para case-insensitive
      filter.$or = [
        { item_desc_0: { $regex: searchRegex } },
        { marca: { $regex: searchRegex } },
        { codigo: { $regex: searchRegex } },
        { partNumber: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { subcategory: { $regex: searchRegex } },
        // Considera añadir más campos a la búsqueda si es relevante
      ];
      // Si configuras un índice de texto en tu modelo ProductSchema (ej: ProductSchema.index({ item_desc_0: 'text', marca: 'text' ...}) )
      // podrías usar una búsqueda de texto más optimizada:
      // filter.$text = { $search: query.trim() };
      // Y el sort podría ser por relevancia: .sort({ score: { $meta: "textScore" } })
    }
    
    const skip = (page - 1) * limit;

    // Ejecutar la consulta de productos y la de conteo en paralelo
    const [productsFromDB, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 }) // Ejemplo: ordenar por más nuevos primero (o por relevancia si usas $text)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Product.countDocuments(filter).exec(),
    ]);

    // Mapear para asegurar que _id es string
    const products = productsFromDB.map(product => ({
      ...product,
      _id: product._id.toString(),
    })) as IProduct[];

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      totalProducts,
      totalPages,
      currentPage: page,
    };

  } catch (error) {
    console.error('Error fetching products from DB:', error);
    throw new Error('Error al buscar productos en la base de datos.');
  }
}

// URL del endpoint de autenticación
const authUrl = 'https://api.gruponucleosa.com/Authentication/Login';

// Tipado para las credenciales esperadas
interface ApiCredentials {
  id: number;
  username: string;
  password?: string; // Password puede ser opcional si la API lo permite
}

// Función para obtener el token de autenticación
export async function getAuthToken(): Promise<string | null> {
  const idString = process.env.GRUPO_NUCLEO_ID;
  const username = process.env.GRUPO_NUCLEO_USERNAME;
  const password = process.env.GRUPO_NUCLEO_PASSWORD;

  // Validar que las variables de entorno necesarias existen
  if (!idString || !username || !password) {
    console.error('Error: Faltan variables de entorno para la autenticación (GRUPO_NUCLEO_ID, GRUPO_NUCLEO_USERNAME, GRUPO_NUCLEO_PASSWORD)');
    return null;
  }

  // Convertir ID a número
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    console.error('Error: GRUPO_NUCLEO_ID no es un número válido.');
    return null;
  }

  const credentials: ApiCredentials = {
    id,
    username,
    password
  };

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials) // Convierte el objeto a JSON string
    });

    // Verificar si la respuesta de la red fue exitosa
    if (!response.ok) {
      const errorBody = await response.text(); 
      console.error(`Error en la solicitud de autenticación: ${response.status} ${response.statusText}`);
      console.error(`Respuesta del servidor: ${errorBody}`);
      return null;
    }

    const accessToken = await response.text();

    return accessToken;

  } catch (error) {
    console.error("Error durante la obtención del token de autenticación:", error);
    return null; 
  }
}

// Interfaz actualizada según el ejemplo de respuesta de la API
export interface ProductApi { // Renombrada para evitar conflicto con el modelo Product
  item_id: number;
  codigo: string;
  ean: string;
  partNumber: string;
  item_desc_0: string;
  item_desc_1?: string; 
  item_desc_2?: string; 
  marca: string;
  categoria: string;
  subcategoria: string;
  peso_gr: number;
  alto_cm: number;
  ancho_cm: number;
  largo_cm: number;
  volumen_cm3: number;
  precioNeto_USD: number;
  impuestos: { imp_desc: string; imp_porcentaje: number }[];
  stock_mdp: number;
  stock_caba: number;
  url_imagenes: { url: string }[];
}

const CATALOG_URL = 'https://api.gruponucleosa.com/API_V1/GetCatalog';

// Server Action para obtener el catálogo de productos DE LA API EXTERNA
export async function getCatalog(): Promise<ProductApi[] | null> {

  // 1. Obtener el token de autenticación
  const token = await getAuthToken();

  if (!token) {
    console.error('No se pudo obtener el token para la solicitud del catálogo.');
    return null;
  }

  try {
    // 2. Realizar la solicitud GET al catálogo con el token
    const response = await fetch(CATALOG_URL, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`
      },
      // cache: 'no-store' // Descomentar si quieres forzar explícitamente que no se cachee
    });

    // 3. Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error al obtener el catálogo: ${response.status} ${response.statusText}`);
      console.error(`Respuesta del servidor: ${errorBody}`);
      return null;
    }

    // 4. Parsear la respuesta JSON
    const data: ProductApi[] = await response.json(); // Asume que la respuesta es un array de productos

    return data;

  } catch (error) {
    console.error('Error durante la obtención del catálogo:', error);
    return null;
  }
}
