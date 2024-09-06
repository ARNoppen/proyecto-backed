import express from "express";
import products from "../app.js"

const router = express.Router()


router.get("/products", (req,res)=>{

    res.render("home",{
        products: products,
        style: "index.css"
    })
})

router.get("/realtimeproducts",(req,res)=>{
    res.render("realTimeProducts")
})

export default router;
