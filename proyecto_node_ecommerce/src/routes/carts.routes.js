import { Router } from "express";   
// multer import { uploader } from "../utils.js";
import CartManager from "../service/CartManager.js";

const router = Router();
const cartManager = new CartManager();

//GET
router.get("/:cid", async (req,res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCart(cartId)
        if(cart) {
            res.json(cart)
        }else{
            res.status(404).json({error: "Carrito no encontrado"});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error interno del servidor (carts.routes.js)" });
    }
});



//POST agregar carrito 
router.post("/", async (req,res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear carrito (carts.routes.js)" });
    }
})

//POST agregar producto al carrito 
router.post("/:cid/product/:pid", async (req,res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const productToCart = await cartManager.addProductToCart(cartId,productId);
            if (productToCart) {
                res.json(productToCart)
            }else{
                res.status(404).json({error: "No fue posible agregar al carrito (cart.routes.js)"});
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al agregar producto al carrito (carts.routes.js)" });
    }
})



//PUT actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req,res) => {
    try {
        const cartId = req.params.cid
        const updateCart = await cartManager.updateCart(cartId, req.body)
        if (updateCart) {
            res.json(updateCart)
        }else{
            res.status(404).json({error: "No fue posible actualizar carrito"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar los productos ingresados al carrito (carts.routes.js)" });
    }
})

//PUT actualizar solo el quantity del producto pasado por req.body
router.put("/:cid/products/:pid", async (req,res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        let {quantity} = req.body;
        quantity = parseInt(quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "El campo quantity debe ser un número mayor que 0." });
        }
        const newQuantity = await cartManager.updateQuantityOfProduct(cartId, productId, quantity)
        if (newQuantity) {
            res.json(newQuantity)
        }else{
            res.status(404).json({error: "Carrito o producto no encontrado"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar la cantidad de productos ingresados al carrito (carts.routes.js)" });
    }
})



//DELETE eliminar todos los productos del carrito
router.delete("/:cid", async (req,res) => {
    try {
        const cartId = req.params.cid;
        const deleteAllProduct = await cartManager.deleteAllProduct(cartId)
        if (deleteAllProduct) {
            res.json(deleteAllProduct)
        }else{
            res.status(404).json({error: "No fue posible eliminar todos los productos del carrito (cart.routes.js)"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar todos los producto del carrito (carts.routes.js)" });
    }
})

//DELETE eliminar del carrito, producto especifico por ID
router.delete("/:cid/product/:pid", async (req,res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const deleteProductToCart = await cartManager.deleteProduct(cartId,productId)
        if (deleteProductToCart) {
            res.json(deleteProductToCart)
        }else{
            res.status(404).json({error: "No fue posible eliminar producto del carrito (cart.routes.js)"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar producto del carrito (carts.routes.js)" });
    }
});

export default router;