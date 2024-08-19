import { response, Router } from "express";
import { uploader } from "../utils.js";


const router = Router();



//Practicando middelware a nivel router 
router.use(function(req,res,next){
    console.log("Practicando Middleware a nivel de Router ");
    console.log("Horario: ", Date().toLocaleString());
        
    //para salir del middleware
    next()
})

//declaramos el Endpoint (ruta)
router.get(("/prueba"), (req,res)=>{
    res.send({status: "succes", msg:"probando JSON"});
});


let products = [];

//GET
router.get("/", (req,res)=>{
    res.send(products);
});

//POST  
router.post("/", (req,res)=>{
    let product = req.body;
    console.log(product);

    if(!product.nombre || !product.categoria || !product.precio){
        return res.status(400).send({status:"error", msg:"valores incompletos"});
    }

    products.push(product);
    console.log(products);

    return res.send({status:"succes", msg:"producto creado"}); 
});

//PUT


//DELETE



//practicando Multer
router.post('/profile', uploader.single('file'), (req,res)=>{
if(!req.file){
    return response.status(400).send({status: "error", msg: "no se adjunto archivo"});
}

console.log(req.file);

let prod = req.body;
prod.image = req.file.path;


//validación
if(!prod.nombre || !prod.categoria || !prod.precio){
    return res.status(400).send({status:"error", msg:"valores incompletos"});
}

products.push(prod);
console.log(prod);

res.send({status:"succes", msg:"producto creado"}); 

});



export default router;
