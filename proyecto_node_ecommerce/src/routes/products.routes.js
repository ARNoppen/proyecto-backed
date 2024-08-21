import { response, Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "../service/ProductManager.js";

const router = Router();
const productManager = new ProductManager();


//Practicando middelware a nivel router 
router.use(function(req,res,next){
    console.log("Practicando Middleware a nivel de Router ");
    console.log("Horario: ", Date().toLocaleString());
        
    //para salir del middleware
    next()
})

/*declaramos el Endpoint (ruta)
router.get(("/prueba"), (req,res)=>{
    res.send({status: "succes", msg:"probando JSON"});
});
*/



//GET
router.get("/", async (req,res)=>{
    try {            // usamos operador ternario "?" si "req.query.limit" es true se va a ejecutar lo que sigue. si es false se va a ejecutar lo que sigue despues de : en este caso colocamos undefined
        const limit = req.query.limit ? parseInt(req.query.limit): undefined;

        const products = await productManager.getAllProducts(limit)

        res.json(products)


    } catch (error) {
        console.log(error);
        
    }
    
});




//GET
router.get("/:pid", async (req,res)=>{
    try { 
        const productId = parseInt(req.params.pid)

        const product = await productManager.getProductById(productId)

    if(product){
        res.json(product)
    }else{
        res.status(404).json({error: "Producto no encontrado"});
    }
        

    } catch (error) {
        console.log(error);
        
    }
    
});





//POST  
router.post("/", async (req,res)=>{
    try {                                                       //thumbnails es la url de la imagen del producto
        const { title, description, code, price, stock, category, thumbnails } = req.body;  
        if(!title || !description || !code || !price || !stock || !category){
            return res.status(404).json({ error: "Todos los campos son obligatorios a excepción de thumbnails"});
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });

        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
    }

});




//PUT
router.put("/:pid", async (req,res)=>{
    try {
        const productId = req.params.pid
        const updateProduct = await productManager.updateProduct(productId, req.body);
        if(updateProduct){
            res.json(updateProduct)
        }else{
            res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        console.log(error);
    }
})




//DELETE
router.delete("/:pid", async (req,res)=>{
    try {
        const productId = req.params.pid;
        const deleteProduct = await productManager.deleteProduct(productId)
        if(deleteProduct){
            res.json(deleteProduct)
        }else{
            res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        console.log(error);
    }
})





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
    return res.status(400).send({status:"error", msg:"valores incompletos fila 135"});
}

products.push(prod);
console.log(prod);

res.send({status:"succes", msg:"producto creado"}); 

});



export default router;
