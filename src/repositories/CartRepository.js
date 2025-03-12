// Repository: es una capa intermedia que convierte los datos en objetos más útiles para la aplicación. También puede implementar caché, 
// optimización de consultas, etc.
import CartDAO from "../dao/mongo/CartDAO.js";

export default class CartRepository {
    constructor() {
        this.cartDAO = new CartDAO();
    }

    async getCart(cartId) {
        return await this.cartDAO.getCartById(cartId);
    }

    async addCart(userId) {
        return await this.cartDAO.addCart(userId);
    }

    async addProductToCart(cartId, productId) {
        return await this.cartDAO.addProductToCart(cartId, productId);
    }

    async updateCart(cartId, updateFields) {
        return await this.cartDAO.updateCart(cartId, updateFields);
    }

    async updateQuantityOfProduct(cartId, productId, newQuantity) {
        return await this.cartDAO.updateQuantityOfProduct(cartId, productId, newQuantity);
    }

    async deleteAllProducts(cartId) {
        return await this.cartDAO.deleteAllProducts(cartId);
    }

    async deleteProduct(cartId, productId) {
        return await this.cartDAO.deleteProduct(cartId, productId);
    }
}