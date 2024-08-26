import { json } from "express";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import ProductManager from "./ProductManager.js";
import { error, log } from "console";

const carritosFilePath = path.resolve("data", "carts.json");
const productManagerToCarrito = new ProductManager();


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

    addProductToCart(cartId, productId){
            //para acceder a la propiedad product necesitamos encontrar el carrito especifico (lo cual le indicamos por id)
            const cart = this.carts.find(cart => cart.id == cartId);
            //console.log("Este es el id de mi carrito correcto: ",cart);
            if (!cart){
                throw new error("Carrito no encontrado")
            }

            const existingProduct = cart.product.find(elem => elem.product == productId);
            
            if (existingProduct) {
                existingProduct.quantity++;
            }else{
                cart.product.push({
                    product : productId,
                    quantity : 1
                })
            }
            this.saveToFile();
            return cart;
        }
};