import { json } from "express";
import { Product } from "../models/product.model.js";


export default class ProductManager {
    constructor(){
        this.init()
    }

    async init() {
        try {
            console.log("ProductManager conectado a la base de datos");
            
        } catch (error) {
            console.log("Error al conectar con la base de datos (ProductManager)", error);
            
        }
    }

    //metodos
    
    async getAllProducts(limit) {
        try {
            const query = {};
            const options = limit ? { limit: parseInt(limit) } : {};
            return await Product.find(query, null, options).exec();
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id).exec();
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }   

    async addProduct(product) {
        try {
            const newProduct = new Product(product);
            return await newProduct.save();
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updateFields) {
        try {
            return await Product.findByIdAndUpdate(id, updateFields, { new: true }).exec();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await Product.findByIdAndDelete(id).exec();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
};