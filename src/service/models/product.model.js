import mongoose from "mongoose";

const productCollection = "productos";

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    user: {
        first_name: String,
        last_name: String,
        email: String,
        password: String,
        age: Number
    },
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: Array,
    status: { type: Boolean, default: true }
},
{
    versionKey: false //Deshabilita el parametro "__v" 
});

export const productModel = mongoose.model(productCollection, productSchema);
