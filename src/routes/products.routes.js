import { response, Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "../service/ProductManager.js";
import { productModel } from "../dao/models/product.model.js";
import { adminMiddleware } from "../middleware/auth.js";
// Importamos la instancia de Socket.io desde `app.js`
import { socketServer } from "../app.js"; 
const router = Router();
const productManager = new ProductManager();


//Practicando middelware a nivel router 
/*
router.use(function(req,res,next){
    console.log("Practicando Middleware a nivel de Router ");
    console.log("Horario: ", Date().toLocaleString());
        
    //para salir del middleware
    next()
})
*/


//GET con limit, page, sort y query
router.get("/", async (req,res)=>{
    try {            // usamos operador ternario "?" si "req.query.limit" es true se va a ejecutar lo que sigue. si es false lo que va despues de : en este caso colocamos undefined
        const limit = req.query.limit ? parseInt(req.query.limit): 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const sort = req.query.sort ? req.query.sort.toLowerCase() : null;
        const query = req.query.query ? { type: req.query.query } : {};

        // Opciones de paginación
        const options = {
            limit: limit,
            skip: (page - 1) * limit,
        };

        if (sort) {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        const totalProducts = await productModel.countDocuments(query);
        const products = await productManager.getAllProducts(query, options);
        const totalPages = Math.ceil(totalProducts / limit);

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${req.query.query || ''}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${req.query.query || ''}` : null;
        
        res.json({
            status: "success",
            payload: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor (GET products.routes.js)" });
    }
});

//GET por ID
router.get("/:pid", async (req,res)=>{
    try { 
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId)
        if(product){
            res.json(product)
        }else{
            res.status(404).json({error: "Producto no encontrado"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor (GET por ID products.routes.js)" });
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
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor (POST products.routes.js)" });
    }

});



//PUT
router.put("/:pid", adminMiddleware, async (req, res) => {
    try {
        const productId = req.params.pid;
        const updateFields = req.body;

        const updatedProduct = await productManager.updateProduct(productId, updateFields);
        
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Emitimos un evento de actualización para todos los clientes conectados
        socketServer.emit("productUpdated", { productId, updatedProduct });

        res.json({ success: true, message: "Producto actualizado correctamente" });
    } catch (error) {
        console.log("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



//DELETE
router.delete("/:pid", async (req,res)=>{
    try {
        const productId = req.params.pid;
        const deleteProduct = await productManager.deleteProduct(productId)
        console.log("Este es mi producto a eliminar",deleteProduct)
        if(deleteProduct){
            res.json(deleteProduct)
        }else{
            res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor (DELETE products.routes.js)" });
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
