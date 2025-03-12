// Repository: es una capa intermedia que convierte los datos en objetos más útiles para la aplicación. También puede implementar caché, 
// optimización de consultas, etc.import ProductDAO from "../dao/mongo/ProductDAO.js";

import ProductDAO from "../dao/mongo/ProductDAO.js";

export default class ProductRepository {
    constructor() {
        this.productDAO = new ProductDAO();
    }

    async getAllProducts(query = {}, options = {}) {
        return await this.productDAO.getAllProducts(query, options);
    }

    async getProductById(id) {
        return await this.productDAO.getProductById(id);
    }

    async addProduct(product) {
        return await this.productDAO.addProduct(product);
    }

    async updateProduct(id, updateFields) {
        return await this.productDAO.updateProduct(id, updateFields);
    }

    async deleteProduct(id) {
        return await this.productDAO.deleteProduct(id);
    }
}