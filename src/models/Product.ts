import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
}

// Define el Schema de Mongoose
const ProductSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'El título del producto es obligatorio.'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'La URL de la imagen es obligatoria.'],
  },
  description: {
    type: String,
    required: [true, 'La descripción del producto es obligatoria.'],
  },
  category: {
    type: String,
    required: [true, 'La categoría del producto es obligatoria.'],
    trim: true,
  },
}, {
    timestamps: true
});

const Product: Model<IProduct> = models.Product || mongoose.model<IProduct>('Product', ProductSchema, 'products');

export default Product;