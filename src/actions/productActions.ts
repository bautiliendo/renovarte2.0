"use server";
import { DISPLAY_MAIN_CATEGORIES } from "@/config/categories.config";
import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/models/Product";
import mongoose from "mongoose";

interface GetProductsParams {
  category?: string;
  subcategory?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export async function getProductsFromDB(
  params: GetProductsParams = {}
): Promise<{
  products: IProduct[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}> {
  const { category, query, page = 1, limit = 12 } = params;

  try {
    await dbConnect();

    const filter: mongoose.FilterQuery<IProduct> = {
      isActive: true,
    };

    if (category) {
      if (category === "Otros") {
        filter.category = { $nin: DISPLAY_MAIN_CATEGORIES };
      } else {
        filter.category = category;
      }
    }

    if (query && query.trim() !== "") {
      const searchRegex = new RegExp(query.trim(), "i");
      filter.$or = [
        { item_desc_0: { $regex: searchRegex } },
        { marca: { $regex: searchRegex } },
        { codigo: { $regex: searchRegex } },
        { partNumber: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ];
    }

    const skip = (page - 1) * limit;

    const [productsFromDB, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort({ item_desc_0: 1 })
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

    return {
      ...product,
      _id: product._id.toString(),
      url_imagenes: product.url_imagenes
        ? product.url_imagenes.map((img) => ({ url: img.url }))
        : [],
    } as IProduct;
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error);
    return null;
  }
}
