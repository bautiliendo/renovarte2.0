import { INTERNAL_MAIN_CATEGORIES } from "@/config/categories.config";
import { isValidImageUrl } from "@/helpers/isValidImageUrl";
import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/models/Product";
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

//  Server Action para sincronizar productos desde la API externa a MongoDB
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
    const bulkUpdateOps: import("mongoose").AnyBulkWriteOperation<IProduct>[] = [];

    for (const apiProduct of relevantApiProducts) {
      processedCount++;
      try {
        const validImageUrls: { url: string }[] = [];
        if (apiProduct.url_imagenes && apiProduct.url_imagenes.length > 0) {
          const imageValidationPromises = apiProduct.url_imagenes.map(async (img) => {
            const isValid = await isValidImageUrl(img.url);
            return { url: img.url, isValid };
          });
          const validationResults = await Promise.allSettled(imageValidationPromises);

          validationResults.forEach(result => {
            if (result.status === 'fulfilled' && result.value.isValid) {
              validImageUrls.push({ url: result.value.url });
            } else {
              let failedUrlDetail = 'unknown_url (error during validation)';
              let errorMessage = 'Image validation failed or an error occurred.';
              if (result.status === 'fulfilled' && !result.value.isValid) {
                failedUrlDetail = result.value.url;
                errorMessage = 'Image reported as invalid by isValidImageUrl.';
              } else if (result.status === 'rejected') {
                errorMessage = `Error during image validation: ${result.reason}`;
              }
              console.log(`Sincronización: Problem with image for product ${apiProduct.item_id}. URL Hint: ${failedUrlDetail}. Message: ${errorMessage}`);
            }
          });
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
          url_imagenes: validImageUrls,
          isActive: validImageUrls.length > 0,
        };

        if (validImageUrls.length === 0) {
             console.log(`Sincronización: Producto ${apiProduct.item_id} (${apiProduct.item_desc_0}) marcado como inactivo debido a la falta de imágenes válidas.`);
        }

        // Preparar la operación para bulkWrite en lugar de ejecutarla inmediatamente
        bulkUpdateOps.push({
          updateOne: {
            filter: { api_item_id: apiProduct.item_id, source: "api" },
            update: { $set: productToStore },
            upsert: true,
          },
        });

      } catch (productError) {
        console.error(
          `Sincronización: Error preparando operación para producto con api_item_id: ${apiProduct.item_id}`,
          productError
        );
        errors.push({
          context: `Preparing op for product api_item_id: ${apiProduct.item_id}`,
          message:
            productError instanceof Error
              ? productError.message
              : String(productError),
        });
      }
    }

    // Ejecutar operaciones de creación/actualización en lote
    if (bulkUpdateOps.length > 0) {
      try {
        const bulkResult = await Product.bulkWrite(bulkUpdateOps, { ordered: false });
        createdCount = bulkResult.upsertedCount;
        updatedCount = bulkResult.modifiedCount;
        console.log(
          `Sincronización: BulkWrite para creación/actualización completado. Creados: ${bulkResult.upsertedCount}, Actualizados: ${bulkResult.modifiedCount}, Emparejados: ${bulkResult.matchedCount}.`
        );
      } catch (bulkError) {
        console.error("Sincronización: Error durante Product.bulkWrite (creación/actualización):", bulkError);
        errors.push({
          context: "BulkWrite Operation (create/update)",
          message: bulkError instanceof Error ? bulkError.message : String(bulkError),
        });
        // Dependiendo de la criticidad, podrías decidir si continuar o retornar error aquí
      }
    }

    // OPERACIONES DE ELIMINACIÓN SECUENCIALES (como estaban antes)
    const localApiProductIds = await Product.find({ source: "api" }, 'api_item_id').lean();
    
    for (const localProduct of localApiProductIds) {
      if (localProduct.api_item_id && !apiProductIds.has(localProduct.api_item_id)) {
        try {
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
         if (localApiProductIds.length === 0 && relevantApiProducts.length === 0) { 
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