// Manager: Aplica reglas de negocio y decide qué hacer con los datos procesados por el Repository antes de enviarlos al controlador.


import CartRepository from "../repositories/CartRepository.js";

export default class CartManager {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    async getCart(cartId) {
        try {
            return await this.cartRepository.getCart(cartId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion getCart:", error);
            throw error;
        }
    }

    async addCart(userId) {
        try {
            return await this.cartRepository.addCart(userId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion addCart:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            return await this.cartRepository.addProductToCart(cartId, productId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion addProductToCart:", error);
            throw error;
        }
    }

    async updateCart(cartId, updateFields) {
        try {
            return await this.cartRepository.updateCart(cartId, updateFields);
        } catch (error) {
            console.error("Error en CartManager mirar funcion updateCart:", error);
            throw error;
        }
    }

    async updateQuantityOfProduct(cartId, productId, newQuantity) {
        try {
            return await this.cartRepository.updateQuantityOfProduct(cartId, productId, newQuantity);
        } catch (error) {
            console.error("Error en CartManager mirar funcion updateQuantityOfProduct:", error);
            throw error;
        }
    }

    async deleteAllProducts(cartId) {
        try {
            return await this.cartRepository.deleteAllProducts(cartId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion deleteAllProducts:", error);
            throw error;
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            return await this.cartRepository.deleteProduct(cartId, productId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion deleteProduct:", error);
            throw error;
        }
    }
}