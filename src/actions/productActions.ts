"use server";
import { INTERNAL_MAIN_CATEGORIES } from "@/config/categories.config";
import { COMBINED_CATEGORIES_MAP } from "@/config/categories.config";
import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/models/Product";
import mongoose from "mongoose";
import { isValidImageUrl } from "@/helpers/isValidImageUrl";

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
      } else if (
        COMBINED_CATEGORIES_MAP[category] &&
        COMBINED_CATEGORIES_MAP[category].length > 0
      ) {
        // For combined categories (like "Componentes y Periféricos" or "Electrodomesticos")
        // We need to include products matching the display category name itself (if it's a DB category)
        // AND any of its mapped internal DB categories.
        const categoriesToSearch = new Set<string>([
          category,
          ...COMBINED_CATEGORIES_MAP[category],
        ]);
        filter.category = { $in: Array.from(categoriesToSearch) };
      } else {
        // For a direct main category not in the map (e.g., "Notebooks", "Computadoras")
        filter.category = category;
      }
    }

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

export async function getProductById(id: string): Promise<IProduct | null> {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`getProductById: Invalid ID format: ${id}`);
      return null;
    }

    const product = await Product.findById(id).lean().exec();

    if (!product) {
      return null;
    }

    // Asegurarse de que _id es un string, y otros campos necesarios como url_imagenes
    return {
      ...product,
      _id: product._id.toString(),
      // Mapear otros campos si es necesario para consistencia con IProduct
      // Por ejemplo, si lean() no transforma ObjectId en nested arrays/objects
      url_imagenes: product.url_imagenes
        ? product.url_imagenes.map((img) => ({ url: img.url }))
        : [],
    } as IProduct;
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error);
    // No lanzar el error directamente para que la página pueda manejar el caso de producto no encontrado.
    // Podrías lanzar un error si prefieres que Next.js maneje esto con una error.tsx boundary.
    return null;
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
  deletedCount: number;
  errors: ErrorInfo[];
}> {
  console.log("Iniciando sincronización de productos desde la API externa...");
  await dbConnect();

  let processedCount = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;
  const errors: ErrorInfo[] = [];

  try {
    const apiProductsFromCatalog: ProductApi[] | null = await getCatalog();

    if (!apiProductsFromCatalog) {
      console.error(
        "Error en la sincronización: No se pudieron obtener productos de la API."
      );
      return {
        success: false,
        message: "Error al obtener productos de la API externa.",
        processedCount,
        createdCount,
        updatedCount,
        deletedCount,
        errors,
      };
    }

    console.log(
      `Sincronización: Se obtuvieron ${apiProductsFromCatalog.length} productos de la API.`
    );

    // Filtrar productos por categorías relevantes
    const relevantApiProducts = apiProductsFromCatalog.filter(p =>
      INTERNAL_MAIN_CATEGORIES.includes(p.categoria)
    );

    console.log(
      `Sincronización: Después de filtrar por categorías relevantes, ${relevantApiProducts.length} productos de ${apiProductsFromCatalog.length} serán procesados.`
    );


    if (relevantApiProducts.length === 0 && apiProductsFromCatalog.length > 0) {
      console.log("Sincronización: Ninguno de los productos obtenidos de la API pertenece a las categorías relevantes configuradas. Se procederá a verificar si hay productos locales para eliminar según este filtro.");
    } else if (relevantApiProducts.length === 0) {
      console.log("Sincronización: La API externa no devolvió productos o ninguno pertenece a categorías relevantes. Se procederá a verificar si hay productos locales para eliminar.");
    }


    const apiProductIds = new Set(relevantApiProducts.map(p => p.item_id));

    for (const apiProduct of relevantApiProducts) {
      processedCount++;
      try {
        const validImageUrls: { url: string }[] = [];
        if (apiProduct.url_imagenes && apiProduct.url_imagenes.length > 0) {
          // Sequentially validate images to avoid overwhelming the network or target server
          for (const img of apiProduct.url_imagenes) {
            if (await isValidImageUrl(img.url)) {
              validImageUrls.push(img);
            } else {
              console.log(`Sincronización: URL de imagen inválida o no accesible para producto ${apiProduct.item_id}: ${img.url}`);
              // Optional: Add to errors array if you want to report these per-image failures
              // errors.push({
              //   context: `Product api_item_id: ${apiProduct.item_id}, Image URL: ${img.url}`,
              //   message: "Invalid or inaccessible image URL",
              // });
            }
          }
        }

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
          category: apiProduct.categoria,
          subcategory: apiProduct.subcategoria,
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
          url_imagenes: validImageUrls, // Use the validated list
          isActive: validImageUrls.length > 0, // Set isActive based on valid images
        };

        // If there are no valid images and the product was previously active (or we assume active by default from API)
        // this will effectively deactivate it.
        if (validImageUrls.length === 0) {
             console.log(`Sincronización: Producto ${apiProduct.item_id} (${apiProduct.item_desc_0}) marcado como inactivo debido a la falta de imágenes válidas.`);
        }


        const result = await Product.updateOne(
          { api_item_id: apiProduct.item_id, source: "api" },
          { $set: productToStore },
          { upsert: true }
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

    const localApiProductIds = await Product.find({ source: "api" }, 'api_item_id').lean();
    
    for (const localProduct of localApiProductIds) {
      if (localProduct.api_item_id && !apiProductIds.has(localProduct.api_item_id)) {
        try {
          // Antes de eliminar, verificar si el producto local pertenece a una categoría que AHORA es irrelevante.
          // Esta verificación es implícita: si no está en apiProductIds (que se basa en relevantApiProducts),
          // o bien ya no viene de la API, o bien su categoría ya no es relevante.
          const deleteResult = await Product.deleteOne({ api_item_id: localProduct.api_item_id, source: "api" });
          if (deleteResult.deletedCount > 0) {
            deletedCount++;
            console.log(`Sincronización: Producto ELIMINADO de la DB con api_item_id: ${localProduct.api_item_id} (ya no en API o categoría no relevante)`);
          }
        } catch (deleteError) {
          console.error(
            `Sincronización: Error eliminando producto con api_item_id: ${localProduct.api_item_id}`,
            deleteError
          );
          errors.push({
            context: `Deleting product api_item_id: ${localProduct.api_item_id}`,
            message:
              deleteError instanceof Error
                ? deleteError.message
                : String(deleteError),
          });
        }
      }
    }
    
    if (relevantApiProducts.length === 0 && localApiProductIds.length > 0 && deletedCount === 0 && createdCount === 0 && updatedCount === 0) {
         // Esta condición evalúa si no hubo operaciones pero aún hay productos locales.
         // Si relevantApiProducts es 0, apiProductIds estará vacío.
         // Esto significa que cualquier localApiProduct que sea 'source: api' será eliminado por el bucle anterior.
         // Si después de ese bucle, deletedCount sigue siendo 0, significa que los productos locales no eran 'source: api' o algo más falló.
         // O que no había productos locales 'source: api' para empezar.

         // Considerar el caso: API devuelve 0 productos relevantes. Productos locales existen.
         // El bucle anterior debería haberlos eliminado si eran 'source: api'.
         // Si no los eliminó, este log podría ser confuso.

         if (localApiProductIds.length === 0 && relevantApiProducts.length === 0) { // Cambiado de apiProducts a relevantApiProducts
             console.log("Sincronización: No hay productos relevantes en la API ni productos de origen API en la base de datos local.");
              return {
                success: true,
                message: "La API externa no devolvió productos relevantes y no hay productos de origen API en la base de datos local para sincronizar o eliminar.",
                processedCount,
                createdCount,
                updatedCount,
                deletedCount,
                errors,
            };
        }
    }

    const summaryMessage = `Sincronización completada. Productos procesados: ${processedCount}. Creados: ${createdCount}. Actualizados: ${updatedCount}. Eliminados: ${deletedCount}. Errores: ${errors.length}.`;
    console.log(summaryMessage);
    return {
      success: true,
      message: summaryMessage,
      processedCount,
      createdCount,
      updatedCount,
      deletedCount,
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
      deletedCount,
      errors,
    };
  }
}
