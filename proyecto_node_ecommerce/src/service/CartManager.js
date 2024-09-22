import { cartModel } from "../models/cart.model.js";
import ProductManager from "./ProductManager.js";

const productManagerToCarrito = new ProductManager();


export default class CartManager{
    constructor(){
    }


    //metodos

    async getCart(id){
        return await cartModel.findById(id).populate('products.product').exec();
    }

    async addCart(){
        const newCart = new cartModel({ products: [] });
        await newCart.save();
        return newCart;
    }   

    async addProductToCart(cartId, productId){
            //para acceder a la propiedad product necesitamos encontrar el carrito especifico (lo cual le indicamos por id)
            const cart = await cartModel.findById(cartId);
            //console.log("Este es el id de mi carrito correcto: ",cart);
            if (!cart){
                console.log("Carrito no encontrado");
                return null;
            }
            // confirmarmos que exista el producto en nuestro products.json (para que no puedan ingresar un id que no exista)

                //confirmamos que exista el producto en nuestro array product dentro del carrito (para que se sume en quantity si es que existe)
                const existingProduct = cart.products.find(elem => elem.product.toString() === productId);
                if (existingProduct) {
                    existingProduct.quantity++;
                }else{
                    //si no existe lo sumamos al carrito
                    cart.products.push({
                        product : productId,
                        quantity : 1
                    })
                }
                await cart.save();
                return cart;
        }
};