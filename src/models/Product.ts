import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Interfaz para el objeto dentro de url_imagenes
interface IImage {
  url: string;
  // podrías añadir más campos aquí si la API los devuelve o los necesitas, 
  // ej: isPrimary, altText
}

// Interfaz para el objeto dentro de impuestos (si la API los devuelve y los quieres guardar)
interface IImpuesto {
  imp_desc: string;
  imp_porcentaje: number;
}

export interface IProduct extends Document {
  // _id es añadido por Mongoose y es el ObjectId único del documento en MongoDB
  _id: mongoose.Types.ObjectId | string; 

  api_item_id?: number; // ID original de la API externa, opcional si el producto es manual
  source: 'api' | 'manual'; // Indica si el producto viene de la API o fue añadido manualmente

  codigo?: string; 
  ean?: string;
  partNumber?: string;
  item_desc_0: string; // Descripción principal, puede actuar como el título. Requerido.
  item_desc_1?: string; // Descripción secundaria
  item_desc_2?: string; // Descripción terciaria
  marca?: string;
  category: string; // Categoría principal. Requerido.
  subcategory?: string; 

  peso_gr?: number;
  alto_cm?: number;
  ancho_cm?: number;
  largo_cm?: number;
  volumen_cm3?: number;

  precioNeto_USD?: number;
  impuestos?: IImpuesto[]; 
  stock_mdp?: number;
  stock_caba?: number;
  url_imagenes: IImage[]; // Array de imágenes. Requerido (puede ser vacío).

  isActive?: boolean; // Para marcar si el producto está activo/disponible

  description?: string; // Campo de descripción general que tenías, puede ser para notas adicionales o productos manuales

  // Timestamps (createdAt, updatedAt) se añaden automáticamente por Mongoose
  createdAt?: Date;
  updatedAt?: Date;
}

// Sub-esquema para las imágenes
const ImageSchema: Schema<IImage> = new Schema({
  url: { type: String, required: true }
}, { _id: false }); // _id: false si no necesitas IDs individuales para cada imagen en el array

// Sub-esquema para los impuestos
const ImpuestoSchema: Schema<IImpuesto> = new Schema({
  imp_desc: { type: String, required: true },
  imp_porcentaje: { type: Number, required: true }
}, { _id: false });

// Esquema principal del Producto
const ProductSchema: Schema<IProduct> = new Schema({
  api_item_id: { 
    type: Number, 
    unique: true, // Debe ser único si existe
    sparse: true // Permite múltiples documentos sin este campo (para source: 'manual')
  },
  source: { 
    type: String, 
    enum: ['api', 'manual'], 
    required: true, 
    default: 'manual' 
  },

  codigo: { type: String, trim: true },
  ean: { type: String, trim: true },
  partNumber: { type: String, trim: true },
  item_desc_0: { type: String, required: [true, 'La descripción principal (item_desc_0) es obligatoria.'], trim: true },
  item_desc_1: { type: String, trim: true },
  item_desc_2: { type: String, trim: true },
  marca: { type: String, trim: true, index: true },
  category: { type: String, required: [true, 'La categoría es obligatoria.'], trim: true, index: true },
  subcategory: { type: String, trim: true, index: true },

  peso_gr: { type: Number },
  alto_cm: { type: Number },
  ancho_cm: { type: Number },
  largo_cm: { type: Number },
  volumen_cm3: { type: Number },

  precioNeto_USD: { type: Number },
  impuestos: [ImpuestoSchema], // Array de subdocumentos de impuestos
  stock_mdp: { type: Number, default: 0 },
  stock_caba: { type: Number, default: 0 },
  url_imagenes: { type: [ImageSchema], required: true, default: [] }, // Siempre un array

  isActive: { type: Boolean, default: true, index: true },

  description: { type: String, trim: true }, // Tu campo de descripción original

}, {
  timestamps: true // Añade automáticamente createdAt y updatedAt
});

// Índices para mejorar el rendimiento de las búsquedas y filtros
// ProductSchema.index({ item_desc_0: 'text', marca: 'text', codigo: 'text' }); // Para búsqueda de texto con operador $text
// Ya hemos añadido index:true a category, subcategory, marca, isActive, api_item_id (unique es un tipo de índice)

// Evitar recompilar el modelo en hot-reloads de Next.js
const Product: Model<IProduct> = models.Product || mongoose.model<IProduct>('Product', ProductSchema, 'products');
// El tercer argumento 'products' es el nombre explícito de la colección en MongoDB.

export default Product;