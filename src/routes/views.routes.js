import express from "express";
import bcrypt from "bcrypt";
import ProductManager from "../service/ProductManager.js";
import UserManager from "../service/UserManager.js";
import CartManager from "../service/CartManager.js";
import passport from "../config/passport.config.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import TicketManager from "../service/TicketManager.js";
import { formatDateTime } from "../utils.js";

const router = express.Router()
const productManager = new ProductManager(); 
const userManager = new UserManager();
const cartManager = new CartManager();
const ticketManager = new TicketManager();


router.get("/login", (req, res) => {
    res.render("login", {
        style: "index.css"
    });
});

router.post("/login", (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: info.message });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(401).json({ success: false, message: err.message });
            }
            // guarda la información del usuario en la sesión
            req.session.user = user;
            console.log("Sesión después de iniciar sesión:", req.session);
            return res.json({ success: true, message: "Inicio de sesión exitoso" });
        });
    })(req, res, next);
});

router.get("/register", (req, res) => {
    res.render("register", {
        style: "index.css" 
    });
}); 

router.post("/register", async (req, res, next) => {
    passport.authenticate("register", async (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ success: false, message: info.message });
        }

        try {
            const newCart = await cartManager.addCart(user._id); // usa el userId del usuario recién creado
            user.cartId = newCart._id;
            await user.save();

            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ success: true, message: "Usuario registrado y carrito creado exitosamente" });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al crear el carrito para el usuario", error: error.message });
        }
    })(req, res, next);
});


router.get("/changepassword", (req, res) => {
    res.render("changePassword", {
        style: "index.css"
    });
});

router.post("/changepassword", async (req, res) => {
    const { email, newPassword } = req.body;
    
    try {
        const user = await userManager.getUserByEmail(email);

        if (user) {
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

            // Actualizamos solo la contraseña del usuario
            await userManager.updateUser(user._id, { password: hashedPassword });

            res.redirect("/products");
        } else {
            res.status(401).send("Email no encontrado");
        }
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).send("Error al cambiar la contraseña");
    }
});



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