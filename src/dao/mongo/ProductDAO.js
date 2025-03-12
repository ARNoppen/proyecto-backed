import { productModel } from "../models/product.model.js";

export default class ProductDAO {
    async getAllProducts(query = {}, options = {}) {
        try {
            return await productModel.find(query, null, options).exec();
        } catch (error) {
            console.error("Error en ProductDAO mirar funcion getAllProducts:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productModel.findById(id).exec();
        } catch (error) {
            console.error("Error en ProductDAO mirar funcion getProductById:", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new productModel(product);
            return await newProduct.save();
        } catch (error) {
            console.error("Error en ProductDAO mirar funcion addProduct:", error);
            throw error;
        }
    }

    async updateProduct(id, updateFields) {
        try {
            return await productModel.findByIdAndUpdate(id, updateFields, { new: true }).exec();
        } catch (error) {
            console.error("Error en ProductDAO mirar funcion updateProduct:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await productModel.findByIdAndDelete(id).exec();
        } catch (error) {
            console.error("Error en ProductDAO mirar funcion deleteProduct:", error);
            throw error;
        }
    }
}