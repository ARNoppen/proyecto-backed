import { Router } from "express";
const router = Router();

let carts = []

//GET
router.get("/", (req,res)=>{
    res.send(carts);
});

//POST  
router.post("/", (req,res)=>{
    let cart = req.body;
    console.log(cart);

    if(!cart.producto){
        return res.status(400).send({status:"error", msg:"valores incompletos"});
    }

    carts.push(cart);
    console.log(cart);

    return res.send({status:"succes", msg:"carrito creado"}); 
});




export default router;