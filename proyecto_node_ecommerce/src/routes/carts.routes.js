import { Router } from "express";   
// multer import { uploader } from "../utils.js";
import CartManager from "../service/CartManager.js";

const router = Router();
const cartManager = new CartManager();

//GET
router.get("/:cid", async (req,res)=>{
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
router.post("/:cid/product/:pid", async (req,res) =>{
    try {
        const cartId = req.params.cid
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



export default router;