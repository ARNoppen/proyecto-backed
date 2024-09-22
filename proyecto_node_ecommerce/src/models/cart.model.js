import mongoose from "mongoose";

//definir el esquema del producto
const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }]
})

export const cartModel = mongoose.model('Cart', cartSchema);