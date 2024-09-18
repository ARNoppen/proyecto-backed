import mongoose from 'mongoose';

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [String],
    status: { type: Boolean, default: true }
});

export const productModel = mongoose.model('Producto', productSchema);
