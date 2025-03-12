// Manager: Aplica reglas de negocio y decide qué hacer con los datos procesados por el Repository antes de enviarlos al controlador.

import ProductRepository from "../repositories/ProductRepository.js";

export default class ProductManager {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(query = {}, options = {}) {
        try {
            return await this.productRepository.getAllProducts(query, options);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion getAllProducts:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await this.productRepository.getProductById(id);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion getProductById:", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            return await this.productRepository.addProduct(product);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion addProduct:", error);
            throw error;
        }
    }

    async updateProduct(id, updateFields) {
        try {
            return await this.productRepository.updateProduct(id, updateFields);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion updateProduct:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.productRepository.deleteProduct(id);
        } catch (error) {
            console.error("Error en ProductManager mirar funcion deleteProduct:", error);
            throw error;
        }
    }
}