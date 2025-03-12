import ProductDAO from "../dao/mongo/ProductDAO.js";

export default class ProductManager {
    constructor() {
        this.productDAO = new ProductDAO();
    }

    async getAllProducts(query = {}, options = {}) {
        try {
            return await this.productDAO.getAllProducts(query, options);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion getAllProducts:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await this.productDAO.getProductById(id);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion getProductById:", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            return await this.productDAO.addProduct(product);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion addProduct:", error);
            throw error;
        }
    }

    async updateProduct(id, updateFields) {
        try {
            return await this.productDAO.updateProduct(id, updateFields);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion updateProduct:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.productDAO.deleteProduct(id);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion deleteProduct:", error);
            throw error;
        }
    }
}