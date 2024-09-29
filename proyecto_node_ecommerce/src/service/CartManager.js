import { cartModel } from "./models/cart.model.js";
import ProductManager from "./ProductManager.js";

const productManagerToCarrito = new ProductManager();


export default class CartManager{
    constructor(){
    }


    //metodos

    async getCart(id){
        return await cartModel.findById(id).populate("products.product").exec();
    }

    async addCart(){
        try {
            const newCart = new cartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al agregar carrito nuevo: ", error);
            throw error;
        }
    }   

    async addProductToCart(cartId, productId){
        try {
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
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }

    async updateCart(cartId, updateFields){
        try {
            return await cartModel.findByIdAndUpdate(
                cartId,
                { $set: { products: updateFields } }, // usar $set para reemplazar el array de productos
                { new: true }
            ).exec();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async updateQuantityOfProduct(cartId, productId, newQuantity){
        try {
            const updateQuantity = await cartModel.findOneAndUpdate(
                { _id: cartId, "products._id": productId },
                { $set: { "products.$.quantity": newQuantity } },
                { new: true } 
            )
            if (!updateQuantity) {
                console.log("Carrito o producto no encontrado");
                return null;
            }
            console.log("Cantidad actualizada:", updateQuantity);
            return updateQuantity;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error);
            throw error;
        }
    }


    async deleteAllProduct(cartId){
        try {
            const cart = await cartModel.findById(cartId)
            if (!cartId) {
                console.log("Carrito no encontrado");
                return null;
            }
            cart.products.splice(0,cart.products.length);
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar TODOS los producto:", error);
            throw error;
        }
    }


    async deleteProduct(cartId, productId){
        try {
            const cart = await cartModel.findById(cartId)
            if (!cartId) {
                console.log("Carrito no encontrado");
                return null;
            }
            const existingProduct = cart.products.findIndex(elem => elem._id.toString() === productId); // confirmamos que el producto exista
            
            if (existingProduct !== -1) {
                cart.products.splice(existingProduct, 1); 
                await cart.save();
                return cart;
            }else{
                console.log("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al eliminar un producto del carrito:", error);
            throw error;
        }

    }
};