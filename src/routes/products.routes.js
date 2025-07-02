import { response, Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "../service/ProductManager.js";
import { productModel } from "../dao/models/product.model.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.js";
// Importamos la instancia de Socket.io desde `app.js`
import { socketServer } from "../app.js"; 
const router = Router();
// Router para las vistas de productos
const viewsRouter = Router();

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


// GET: productos con paginado, sort y filtro
router.get("/", authMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const sort = req.query.sort ? req.query.sort.toLowerCase() : null;
    const query = req.query.query ? { type: req.query.query } : {};

    const options = {
      limit,
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
      success: true,
      payload: products,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink
    });

  } catch (error) {
    console.error("Error en GET /api/products:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// GET: producto individual
router.get("/:pid", authMiddleware, async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.json({ success: true, payload: product });
  } catch (error) {
    console.error("Error en GET /api/products/:pid:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// POST: crear producto
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ success: false, error: "Faltan campos obligatorios" });
    }

    const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
    res.status(201).json({ success: true, payload: newProduct });

  } catch (error) {
    console.error("Error en POST /api/products:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// PUT: actualizar producto
router.put("/:pid", adminMiddleware, async (req, res) => {
  try {
    const productId = req.params.pid;
    const updateFields = req.body;

    const updatedProduct = await productManager.updateProduct(productId, updateFields);
    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    socketServer.emit("productUpdated", { productId, updatedProduct });
    res.json({ success: true, message: "Producto actualizado correctamente" });

  } catch (error) {
    console.error("Error en PUT /api/products/:pid:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// DELETE: eliminar producto
router.delete("/:pid",  authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productId = req.params.pid;
    const deleted = await productManager.deleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    res.json({ success: true, payload: deleted });
  } catch (error) {
    console.error("Error en DELETE /api/products/:pid:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

export default router;