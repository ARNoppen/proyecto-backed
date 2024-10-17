import express from "express";
import bcrypt from "bcrypt";
import ProductManager from "../service/ProductManager.js";
import UserManager from "../service/UserManager.js";
import CartManager from "../service/CartManager.js";

const router = express.Router()
const productManager = new ProductManager(); 
const userManager = new UserManager();
const cartManager = new CartManager();



router.get("/login", (req, res) => {
    res.render("login", {
        style: "index.css"
    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userManager.getUserByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;  // guardamos al usuario en la sesión
        res.redirect("/products");
    } else {
        res.status(401).send("Usuario o contraseña incorrectos");
    }
});

router.get("/register", (req, res) => {
    res.render("register", {
        style: "index.css" 
    });
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        // crea un nuevo usuario primero
        const newUser = await userManager.addUser({ 
            first_name, 
            last_name, 
            email, 
            password, 
            age
        });

        // crea un nuevo carrito solo si el usuario no tiene uno
        const newCart = await cartManager.addCart(newUser._id);
        newUser.cartId = newCart._id;
        await newUser.save();

        res.json({ success: true, message: "Usuario registrado exitosamente" });
        
    } catch (error) {
        console.log("Error al registrar el usuario:", error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "El email ya está en uso. Favor intentar con otro." });
        }
        res.status(500).json({ success: false, message: "Error al registrar usuario" });
    }
});


//middleware para proteger /products y /realTimeProducts
function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}
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

        res.render("product", {
            product: product,
            style: "index.css"
        });
    } catch (error) {
        console.log("Error al obtener producto individual:", error);
    }
});

// ruta para obtener un carrito específico
router.get("/carts/:cid", authMiddleware, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

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

router.get("/realtimeproducts", authMiddleware, (req, res) => {
    res.render("realTimeProducts", {
        style: "index.css",
        user: req.session.user
    });
});




export default router;
