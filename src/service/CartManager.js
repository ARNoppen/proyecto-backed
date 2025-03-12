import CartDAO from "../dao/mongo/CartDAO.js";

export default class CartManager {
    constructor() {
        this.cartDAO = new CartDAO();
    }

    async getCart(id) {
        try {
            return await this.cartDAO.getCartById(id);
        } catch (error) {
            console.error("Error en CartManager mirar funcion getCart:", error);
            throw error;
        }
    }

    async addCart(userId) {
        try {
            return await this.cartDAO.addCart(userId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion addCart:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            return await this.cartDAO.addProductToCart(cartId, productId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion addProductToCart:", error);
            throw error;
        }
    }

    async updateCart(cartId, updateFields) {
        try {
            return await this.cartDAO.updateCart(cartId, updateFields);
        } catch (error) {
            console.error("Error en CartManager mirar funcion updateCart:", error);
            throw error;
        }
    }

    async updateQuantityOfProduct(cartId, productId, newQuantity) {
        try {
            return await this.cartDAO.updateQuantityOfProduct(cartId, productId, newQuantity);
        } catch (error) {
            console.error("Error en CartManager mirar funcion updateQuantityOfProduct:", error);
            throw error;
        }
    }

    async deleteAllProduct(cartId) {
        try {
            return await this.cartDAO.deleteAllProducts(cartId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion deleteAllProduct:", error);
            throw error;
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            return await this.cartDAO.deleteProduct(cartId, productId);
        } catch (error) {
            console.error("Error en CartManager mirar funcion deleteProduct:", error);
            throw error;
        }
    }
}