import mongoose from "mongoose";

const cartCollection = "carritos";

//definir el esquema del producto
const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "productos" },
        quantity: { type: Number, default: 1 }
    }]
},
{
    versionKey: false //Deshabilita el parametro "__v"
});

export const cartModel = mongoose.model(cartCollection, cartSchema);