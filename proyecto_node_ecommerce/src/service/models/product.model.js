import mongoose from "mongoose";

const productCollection = "productos";

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    user: {
        type: Object
    },
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [String],
    status: { type: Boolean, default: true }
},
{
    versionKey: false //Deshabilita el parametro "__v" 
});

export const productModel = mongoose.model(productCollection, productSchema);
