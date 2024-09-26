import { productModel } from "./models/product.model.js";


export default class ProductManager {
    constructor(){
        
    }


    //metodos
    
    async getAllProducts(limit) {
        try {
            const query = {};
            const options = limit ? { limit: parseInt(limit) } : {};
            return await productModel.find(query, null, options).exec();
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productModel.findById(id).exec();
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }   

    async addProduct(product) {
        try {
            const newProduct = new productModel(product);
            return await newProduct.save();
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updateFields) {
        try {
            return await productModel.findByIdAndUpdate(id, updateFields, { new: true }).exec();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await productModel.findByIdAndDelete(id).exec();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
};