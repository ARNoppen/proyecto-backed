import { Router } from "express";   
import CartManager from "../service/CartManager.js";
import ProductManager from "../service/ProductManager.js";

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
            res.status(404).json({error: "Producto no encontrado"});
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


export default router;