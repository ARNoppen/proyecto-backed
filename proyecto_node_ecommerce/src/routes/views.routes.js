import express from "express";
const router = express.Router()


router.get("/products", (req,res)=>{

    res.render("home",{
        style: "index.css"
    })
})

router.get("/realtimeproducts",(req,res)=>{
    res.render("realTimeProducts")
})

export default router;
