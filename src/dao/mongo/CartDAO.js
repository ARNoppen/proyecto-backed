import { cartModel } from "../models/cart.model.js";

export default class CartDAO {
    async getCartById(cartId) {
        try {
            console.log("Buscando carrito con ID:", cartId);
            const cart = await cartModel.findById(cartId).populate("products.product").exec();
            if (!cart) {
                console.log("Carrito no encontrado para el ID:", cartId);
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error en CartDAO mirar funcion getCartById:", error);
            throw error;
        }
    }

    async addCart(userId) {
        try {
            const newCart = new cartModel({ userId, products: [] });
            return await newCart.save();
        } catch (error) {
            console.error("Error en CartDAO mirar funcion addCart:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            return await cart.save();
        } catch (error) {
            console.error("Error en CartDAO mirar funcion addProductToCart:", error);
            throw error;
        }
    }

    async updateCart(cartId, updateFields) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { $set: { products: updateFields } }, { new: true }).exec();
        } catch (error) {
            console.error("Error en CartDAO mirar funcion updateCart:", error);
            throw error;
        }
    }

    async updateQuantityOfProduct(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) return null;

            cart.products[productIndex].quantity = newQuantity;
            return await cart.save();
        } catch (error) {
            console.error("Error en CartDAO mirar funcion updateQuantityOfProduct:", error);
            throw error;
        }
    }

    async deleteAllProducts(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            cart.products = [];
            return await cart.save();
        } catch (error) {
            console.error("Error en CartDAO mirar funcion deleteAllProducts:", error);
            throw error;
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            return await cart.save();
        } catch (error) {
            console.error("Error en CartDAO mirar funcion deleteProduct:", error);
            throw error;
        }
    }
}