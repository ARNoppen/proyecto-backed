import express from "express";
import ProductManager from "../service/ProductManager.js";

const router = express.Router()
const productManager = new ProductManager(); 



router.get("/products", async (req,res)=>{

    try{
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);

        res.render("home",{
            products: products,
            style: "index.css"
        });
    }catch(error){
        console.log("Error en views.router al obtener los productos",error);
        
    }

})

router.get("/realtimeproducts",(req,res)=>{
    res.render("realTimeProducts")
})

export default router;
