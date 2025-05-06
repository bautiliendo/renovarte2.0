'use server';
// import dbConnect from '@/lib/dbConnect';
// import Product, { IProduct } from '@/models/Product';
// import mongoose from 'mongoose';

// // --- Opción 2: Obtener todos los productos ) ---
// export async function getAllProducts(): Promise<IProduct[]> {
//     try {
//         await dbConnect();
//         const products = await Product.find({}).lean();

//         const mappedProducts = products.map(product => ({
//             ...product,
//             _id: product._id.toString(),
//         })) as IProduct[];
        
//         return mappedProducts;
//     } catch (error) {
//         console.error('Error detallado al buscar productos:', error);
//         throw new Error('Error al buscar todos los productos.');
//     }
// }

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
export interface Product {
  item_id: number;
  codigo: string;
  ean: string;
  partNumber: string;
  item_desc_0: string;
  item_desc_1?: string; // Opcional si puede no venir
  item_desc_2?: string; // Opcional si puede no venir
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
  // Añadir otros campos si existen
}

const CATALOG_URL = 'https://api.gruponucleosa.com/API_V1/GetCatalog';

// Server Action para obtener el catálogo de productos
export async function getCatalog(): Promise<Product[] | null> {

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
    const data: Product[] = await response.json(); // Asume que la respuesta es un array de productos

    return data;

  } catch (error) {
    console.error('Error durante la obtención del catálogo:', error);
    return null;
  }
}
