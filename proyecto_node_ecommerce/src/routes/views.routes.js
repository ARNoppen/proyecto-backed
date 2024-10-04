import express from "express";
import ProductManager from "../service/ProductManager.js";
import UserManager from "../service/UserManager.js";

const router = express.Router()
const productManager = new ProductManager(); 
const userManager = new UserManager();



router.get("/login", (req, res) => {
    res.render("login", {
        style: "index.css"
    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userManager.getUserByEmail(email);

    if (user && user.password === password) {
        req.session.user = user;  // Guardamos al usuario en la sesión
        res.redirect("/products");
    } else {
        res.status(401).send("Usuario o contraseña incorrectos");
    }
});

router.get("/register", (req, res) => {
    res.render("register", {
        style: "index.css" });
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    
    // Aquí podrías agregar la lógica para guardar al usuario en la base de datos
    // Asegúrate de manejar el hash de la contraseña y otros pasos necesarios de seguridad

    try {
        await userManager.addUser({ first_name, last_name, email, password, age });
        res.redirect("/login"); // Redirige al login después de registrarse
    } catch (error) {
        console.log("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar usuario");
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

        res.render("home",{
            products: products,
            style: "index.css"
        });
    }catch(error){
        console.log("Error en views.router al obtener los productos",error);
    }
});


// Ruta para obtener un producto individual
router.get("/products/:pid", async (req, res) => {
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


// Ruta para obtener un carrito específico
router.get("/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

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
