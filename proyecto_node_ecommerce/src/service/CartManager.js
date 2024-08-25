import { json } from "express";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const carritosFilePath = path.resolve("data", "carts.json");


export default class CartManager{
    constructor(){
        this.carts = [],
        this.init()
    }

    async init() {
        try {
            const data = await fs.readFile(carritosFilePath, "utf-8");
            this.carts = JSON.parse(data)
        } catch (error) {
            this.carts = []
        }
    }


    //metodos

    saveToFile(){
        fs.writeFile(carritosFilePath, JSON.stringify(this.carts, null, 2));
    }

    
    getCart(id){
        return this.carts.find(elem => elem.id == id)
    }

    addCart(){
        const newCart = {
            id: uuid(),
            product: []
        };
        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }   






};