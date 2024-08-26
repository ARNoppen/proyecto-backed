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
    }
});

//POST
router.post("/", async (req,res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart)
    } catch (error) {
        console.log(error);
    }
})

//POST
router.post("/:cid/product/:pid", async (req,res) =>{
    try {
        const cartId = req.params.cid
        const productId = req.params.pid;
        const productToCart = await cartManager.addProductToCart(cartId,productId);
            if (productToCart) {
                res.json(cartManager.carts)
            }else{
                res.status(404).json({error: "No fue posible agregar al carrito"});
            }
    } catch (error) {
        console.log(error);
    }
})



export default router;