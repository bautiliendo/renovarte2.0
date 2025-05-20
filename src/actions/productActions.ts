"use server";
import { INTERNAL_MAIN_CATEGORIES } from "@/config/categories.config";
import { COMBINED_CATEGORIES_MAP } from "@/config/categories.config";
import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/models/Product";
import mongoose from "mongoose";

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
): Promise<{
  products: IProduct[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}> {
  const {
    category,
    // subcategory,
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

    // New Category Logic
    if (category) {
      if (category === "Otros") {
        // For "Otros", find products NOT IN any of the internal main categories
        filter.category = { $nin: INTERNAL_MAIN_CATEGORIES };
      } else if (COMBINED_CATEGORIES_MAP[category] && COMBINED_CATEGORIES_MAP[category].length > 0) {
        // For combined categories (like "Componentes y Periféricos" or "Electrodomesticos")
        // We need to include products matching the display category name itself (if it's a DB category)
        // AND any of its mapped internal DB categories.
        const categoriesToSearch = new Set<string>([category, ...COMBINED_CATEGORIES_MAP[category]]);
        filter.category = { $in: Array.from(categoriesToSearch) };
      } else {
        // For a direct main category not in the map (e.g., "Notebooks", "Computadoras")
        filter.category = category;
      }
    }

    // if (subcategory) {
    //   filter.subcategory = subcategory;
    // }

    if (query && query.trim() !== "") {
      const searchRegex = new RegExp(query.trim(), "i"); // 'i' para case-insensitive
      filter.$or = [
        { item_desc_0: { $regex: searchRegex } },
        { marca: { $regex: searchRegex } },
        { codigo: { $regex: searchRegex } },
        { partNumber: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        // { subcategory: { $regex: searchRegex } },
      ];
    }

    const skip = (page - 1) * limit;

    const [productsFromDB, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Product.countDocuments(filter).exec(),
    ]);

    const products = productsFromDB.map((product) => ({
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
    console.error("Error fetching products from DB:", error);
    throw new Error("Error al buscar productos en la base de datos.");
  }
}

// Function to get specific featured products
export async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await dbConnect();

    const featuredDescriptions = [
      "NOTEBOOK LENOVO IP SLIM 3 15IAH8 I5-12450H 8GB 512SSD 156 FHD W11H (83ER0022AR) ARCTIC GREY",
      "TV LED 4K 43 PHILIPS 43PUD740877 - UHD SMART NETFLIX USB HDMI",
      "CELULAR XIAOMI REDMI NOTE 13 256GB-8GB MIDNIGHT BLACK DUAL NANO SIM (MZB0GA1AR)",
    ];

    const products = await Product.find({
      item_desc_0: { $in: featuredDescriptions },
      isActive: true,
    }).lean();

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    })) as IProduct[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Error al buscar productos destacados.");
  }
}

// URL del endpoint de autenticación
const authUrl = "https://api.gruponucleosa.com/Authentication/Login";

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
    console.error(
      "Error: Faltan variables de entorno para la autenticación (GRUPO_NUCLEO_ID, GRUPO_NUCLEO_USERNAME, GRUPO_NUCLEO_PASSWORD)"
    );
    return null;
  }

  // Convertir ID a número
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    console.error("Error: GRUPO_NUCLEO_ID no es un número válido.");
    return null;
  }

  const credentials: ApiCredentials = {
    id,
    username,
    password,
  };

  try {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials), // Convierte el objeto a JSON string
    });

    // Verificar si la respuesta de la red fue exitosa
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error en la solicitud de autenticación: ${response.status} ${response.statusText}`
      );
      console.error(`Respuesta del servidor: ${errorBody}`);
      return null;
    }

    const accessToken = await response.text();

    return accessToken;
  } catch (error) {
    console.error(
      "Error durante la obtención del token de autenticación:",
      error
    );
    return null;
  }
}

// Interfaz actualizada según el ejemplo de respuesta de la API
export interface ProductApi {
  // Renombrada para evitar conflicto con el modelo Product
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

const CATALOG_URL = "https://api.gruponucleosa.com/API_V1/GetCatalog";

// Server Action para obtener el catálogo de productos DE LA API EXTERNA
export async function getCatalog(): Promise<ProductApi[] | null> {
  // 1. Obtener el token de autenticación
  const token = await getAuthToken();

  if (!token) {
    console.error(
      "No se pudo obtener el token para la solicitud del catálogo."
    );
    return null;
  }

  try {
    // 2. Realizar la solicitud GET al catálogo con el token
    const response = await fetch(CATALOG_URL, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      // cache: 'no-store' // Descomentar si quieres forzar explícitamente que no se cachee
    });

    // 3. Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error al obtener el catálogo: ${response.status} ${response.statusText}`
      );
      console.error(`Respuesta del servidor: ${errorBody}`);
      return null;
    }

    // 4. Parsear la respuesta JSON
    const data: ProductApi[] = await response.json(); // Asume que la respuesta es un array de productos

    return data;
  } catch (error) {
    console.error("Error durante la obtención del catálogo:", error);
    return null;
  }
}

// Interface para detallar los errores durante la sincronización
interface ErrorInfo {
  context?: string; // e.g., "Product ID: 12345" or "General Sync"
  message: string; // El mensaje de error
}

// Nueva Server Action para sincronizar productos desde la API externa a MongoDB
export async function syncProductsFromApi(): Promise<{
  success: boolean;
  message: string;
  processedCount: number;
  createdCount: number;
  updatedCount: number;
  errors: ErrorInfo[]; // Usar el tipo específico aquí
}> {
  console.log("Iniciando sincronización de productos desde la API externa...");
  await dbConnect();

  let processedCount = 0;
  let createdCount = 0;
  let updatedCount = 0;
  const errors: ErrorInfo[] = []; // Usar el tipo específico aquí

  try {
    // 1. Obtener todos los productos de la API externa
    const apiProducts: ProductApi[] | null = await getCatalog();

    if (!apiProducts) {
      console.error(
        "Error en la sincronización: No se pudieron obtener productos de la API."
      );
      return {
        success: false,
        message: "Error al obtener productos de la API externa.",
        processedCount,
        createdCount,
        updatedCount,
        errors,
      };
    }

    if (apiProducts.length === 0) {
      console.log("Sincronización: La API externa no devolvió productos.");
      return {
        success: true,
        message:
          "La API externa no devolvió productos. No hay nada que sincronizar.",
        processedCount,
        createdCount,
        updatedCount,
        errors,
      };
    }

    console.log(
      `Sincronización: Se obtuvieron ${apiProducts.length} productos de la API.`
    );

    // 2. Iterar sobre los productos de la API y sincronizarlos con MongoDB
    for (const apiProduct of apiProducts) {
      processedCount++;
      try {
        // Mapear el producto de la API a la estructura de IProduct
        // Asegúrate de que los campos coincidan con tu ProductSchema
        const productToStore: Partial<IProduct> = {
          api_item_id: apiProduct.item_id,
          source: "api",
          codigo: apiProduct.codigo,
          ean: apiProduct.ean,
          partNumber: apiProduct.partNumber,
          item_desc_0: apiProduct.item_desc_0,
          item_desc_1: apiProduct.item_desc_1,
          item_desc_2: apiProduct.item_desc_2,
          marca: apiProduct.marca,
          category: apiProduct.categoria, // Asegúrate que estos nombres de campo coincidan con tu IProduct
          subcategory: apiProduct.subcategoria, // Asegúrate que estos nombres de campo coincidan con tu IProduct
          peso_gr: apiProduct.peso_gr,
          alto_cm: apiProduct.alto_cm,
          ancho_cm: apiProduct.ancho_cm,
          largo_cm: apiProduct.largo_cm,
          volumen_cm3: apiProduct.volumen_cm3,
          precioNeto_USD: apiProduct.precioNeto_USD,
          impuestos: apiProduct.impuestos?.map((imp) => ({
            imp_desc: imp.imp_desc,
            imp_porcentaje: imp.imp_porcentaje,
          })),
          stock_mdp: apiProduct.stock_mdp,
          stock_caba: apiProduct.stock_caba,
          url_imagenes: apiProduct.url_imagenes?.map((img) => ({
            url: img.url,
          })),
          isActive: true, // Por defecto, los productos de la API se marcan como activos
          // description: apiProduct.item_desc_0, // O alguna otra descripción si quieres
        };

        // Utilizar 'upsert' para crear o actualizar el producto basado en api_item_id
        // 'upsert' significa: si el documento con el filtro existe, actualízalo; si no, créalo.
        const result = await Product.updateOne(
          { api_item_id: apiProduct.item_id }, // Filtro para encontrar el producto
          { $set: productToStore }, // Datos para establecer/actualizar
          { upsert: true } // Opción de upsert
        );

        if (result.upsertedCount > 0) {
          createdCount++;
          console.log(
            `Sincronización: Producto CREADO con api_item_id: ${apiProduct.item_id}`
          );
        } else if (result.modifiedCount > 0) {
          updatedCount++;
          console.log(
            `Sincronización: Producto ACTUALIZADO con api_item_id: ${apiProduct.item_id}`
          );
        } else if (result.matchedCount > 0) {
          // Coincidió pero no se modificó (los datos eran idénticos)
          console.log(
            `Sincronización: Producto con api_item_id: ${apiProduct.item_id} ya estaba actualizado.`
          );
        }
      } catch (productError) {
        console.error(
          `Sincronización: Error procesando producto con api_item_id: ${apiProduct.item_id}`,
          productError
        );
        errors.push({
          context: `Product api_item_id: ${apiProduct.item_id}`,
          message:
            productError instanceof Error
              ? productError.message
              : String(productError),
        });
      }
    }

    const summaryMessage = `Sincronización completada. Productos procesados: ${processedCount}. Creados: ${createdCount}. Actualizados: ${updatedCount}. Errores: ${errors.length}.`;
    console.log(summaryMessage);
    return {
      success: true,
      message: summaryMessage,
      processedCount,
      createdCount,
      updatedCount,
      errors,
    };
  } catch (error) {
    console.error(
      "Error general durante la sincronización de productos:",
      error
    );
    errors.push({
      context: "General Synchronization Error",
      message: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message: "Error general durante la sincronización.",
      processedCount,
      createdCount,
      updatedCount,
      errors,
    };
  }
}

