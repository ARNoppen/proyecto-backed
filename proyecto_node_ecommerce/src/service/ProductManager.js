import { json } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const productosFilePath = path.resolve("data", "products.json");

export default class ProductManager {
    constructor(){
        this.products = []
        this.init()
    }

    async init() {
        try {
            const data = await fs.readFile(productosFilePath, "utf-8");
            this.products = JSON.parse(data)
        } catch (error) {
            this.products = []
        }
    }

    //metodos
    saveToFile(){
        fs.writeFile(productosFilePath, JSON.stringify(this.products, null, 2));
    }

    getAllProducts(limit){
        if(limit){
            return  this.products.slice(0,limit)
        }
        return this.products
    }

    getProductById(id){
        return this.products.find((filtrar) => filtrar.id === id)
    }

    addProduct(product){
        const newProduct = {
            id: uuid(),
            ...product,
            status: true
        };
        this.products.push(newProduct);
        this.saveToFile();
        return newProduct;
    }

    updateProduct(id, updateFields){
        const productIndex = this.products.findIndex((product) => product.id === id)
        if(productIndex < 0 ){
            return null
        }
        const updateProduct = {
            ...this.products[productIndex],
            ...updateFields,
            id: this.products[productIndex].id //aseeguramos que el indice no se actualice
        }
        this.products[productIndex] = updateProduct
        this.saveToFile(); 
        return updateProduct;
    }

    deleteProduct(id){
        const productIndex = this.products.findIndex((product) => product.id === id)
        if(productIndex < 0 ){
            return null
        }

        const deleteProduct = this.products.splice(productIndex, 1);
        this.saveToFile();
        
        return deleteProduct[0];
    }
}