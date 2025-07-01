import express from "express";
import bcrypt from "bcrypt";
import ProductManager from "../service/ProductManager.js";
import UserManager from "../service/UserManager.js";
import CartManager from "../service/CartManager.js";
import passport from "../config/passport.config.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import TicketManager from "../service/TicketManager.js";
import { formatDateTime } from "../utils.js";
import __dirname from "../utils.js";

const router = express.Router()
const productManager = new ProductManager(); 
const userManager = new UserManager();
const cartManager = new CartManager();
const ticketManager = new TicketManager();





router.get("/products", authMiddleware, async (req,res)=>{
    try{
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);
        const user = req.session.user;
        const userCartId = user && user.cartId;

        res.render("products",{
            products: products,
            style: "index.css",
            cid: userCartId
        });
    }catch(error){
        console.log("Error en views.router al obtener los productos",error);
    }
});

// ruta para obtener un producto individual
router.get("/products/:pid", authMiddleware, async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productManager.getProductById(productId);
      
      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }
  
      res.render("product", {
        product: product,
        user: req.session.user,  // Pasamos el usuario a la vista
        style: "index.css",
      });
    } catch (error) {
      console.log("Error al obtener producto individual:", error);
    }
  });

// ruta para obtener un carrito específico
router.get("/carts/:cid", authMiddleware, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCart(cartId);

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render("cart", {
            cart: cart,
            style: "index.css"
        });
    } catch (error) {
        console.log("Error al obtener carrito:", error);
    }
});

router.get("/realtimeproducts", authMiddleware, adminMiddleware, (req, res) => {
    res.render("realTimeProducts", {
        style: "index.css",
        user: req.session.user
    });
});


// ruta para obtener un ticket específico
router.get("/ticket/:tid", async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const ticket = await ticketManager.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).send("Ticket no encontrado");
        }

        const formattedDateTime = formatDateTime(ticket.purchase_datetime);

        res.render("ticket", {
            ticket: {
                ...ticket._doc,
                purchase_datetime: formattedDateTime
            },
            style: "index.css"
        });
    } catch (error) {
        console.error("Error al obtener el ticket:", error);
        res.status(500).send("Error interno del servidor al obtener el ticket");
    }
});


export default router;