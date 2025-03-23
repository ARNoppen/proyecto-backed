import { Router } from "express";   
// multer import { uploader } from "../utils.js";
import CartManager from "../service/CartManager.js";
import { socketServer } from "../app.js";
import ProductManager from "../service/ProductManager.js";
import TicketManager from "../service/TicketManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();
const ticketManager = new TicketManager();

//GET
router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCart(cartId);
        
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.render("cart", { cart }); //  Asegurarse de pasar "cart" al template
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor (carts.routes.js)" });
    }
});



//POST agregar carrito 
router.post("/", async (req,res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear carrito (carts.routes.js)" });
    }
})

//POST agregar producto al carrito 
router.post("/:cid/product/:pid", async (req,res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const productToCart = await cartManager.addProductToCart(cartId,productId);
            if (productToCart) {
                res.json(productToCart)
            }else{
                res.status(404).json({error: "No fue posible agregar al carrito (cart.routes.js)"});
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al agregar producto al carrito (carts.routes.js)" });
    }
})

//POST realizar compra 
router.post("/:cid/purchase", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const user = req.session.user;

        const cart = await cartManager.getCart(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        let total = 0;
        const productosFallidos = [];
        const productosComprados = [];

        for (const item of cart.products) {
            const product = await productManager.getProductById(item.product._id);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productManager.updateProduct(product._id, { stock: product.stock });
                total += product.price * item.quantity;
                productosComprados.push(item);
            } else {
                productosFallidos.push(item);
            }
        }

        if (productosComprados.length === 0) {
            return res.status(400).json({
                error: "No se pudo completar la compra. Todos los productos están sin stock",
                productosFallidos,
            });
        }

        const ticket = await ticketManager.createTicket({
            amount: total,
            purchaser: user.email,
        });

        // Filtramos el carrito dejando solo los que no se pudieron comprar
        await cartManager.updateCart(cartId, productosFallidos);

        // Redireccionamos directamente a la vista del ticket
        return res.redirect(`/ticket/${ticket._id}`);

    } catch (error) {
        console.error("Error al procesar compra:", error);
        res.status(500).json({ error: "Error interno al procesar la compra" });
    }
});


//PUT actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req,res) => {
    try {
        const cartId = req.params.cid
        const updateCart = await cartManager.updateCart(cartId, req.body)
        if (updateCart) {
            res.json(updateCart)
        }else{
            res.status(404).json({error: "No fue posible actualizar carrito"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar los productos ingresados al carrito (carts.routes.js)" });
    }
})

//PUT actualizar solo el quantity del producto pasado por req.body
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        let { quantity } = req.body;

        quantity = parseInt(quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser mayor que 0." });
        }

        const updatedCart = await cartManager.updateQuantityOfProduct(cid, pid, quantity);

        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" });
        }

        // 🔥 Emitimos un evento para actualizar la UI en tiempo real
        socketServer.emit("cartUpdated");
        res.json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error("Error al actualizar cantidad en MongoDB:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



//DELETE eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const deleteAllProduct = await cartManager.deleteAllProducts(cartId);

        if (!deleteAllProduct) {
            return res.status(404).json({ error: "No fue posible eliminar todos los productos del carrito." });
        }

        // 🔥 Emitimos `cartUpdated` para actualizar la UI en tiempo real
        socketServer.emit("cartUpdated");

        res.json(deleteAllProduct);
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

//DELETE eliminar del carrito, producto especifico por ID
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.deleteProduct(cid, pid);

        if (!updatedCart) {
            return res.status(404).json({ error: "No fue posible eliminar el producto del carrito." });
        }

        // 🔥 Emitimos `cartUpdated` para que el frontend recargue la página
        socketServer.emit("cartUpdated");

        res.json(updatedCart);
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

export default router;