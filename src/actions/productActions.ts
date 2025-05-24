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
