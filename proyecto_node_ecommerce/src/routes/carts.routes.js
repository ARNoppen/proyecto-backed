import { Router } from "express";   
import CartManager from "../service/CartManager.js";

const router = Router();
const cartManager = new CartManager();



//GET
router.get("/", (req,res)=>{
    res.send("En desarrollo");
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