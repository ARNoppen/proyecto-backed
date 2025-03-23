
//hacemos el import de las librerías
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import sharedsession from "express-socket.io-session";
import cookieParser from "cookie-parser";
//import de nuestros otros directorios que ya exportamos
import productsRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import __dirname from "./utils.js";
import viewRouter from "./routes/views.routes.js";
import userRouter from "./routes/users.routes.js";
import passport from "./config/passport.config.js";

import { productModel } from "./dao/models/product.model.js";

import ProductManager from "./service/ProductManager.js";
import UserManager from "./service/UserManager.js";
import CartManager from "./service/CartManager.js";

const productManager = new ProductManager();
const userManager = new UserManager();
const cartManager = new CartManager();

dotenv.config();

//----declaramos express----
const app = express();
const PORT = process.env.PORT || 8090;

//--------colocamos middleware a nivel aplicación (sirve para mostrarle predeterminadamente como va a trabajar en el código)------
//prepara la configuración del servidor para trabajar con archivos JSON
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
//Middelware para mostrar horario
/*
app.use(function(req,res,next){
    console.log("Practicando Middleware a nivel de Aplicación   ");
    console.log("Horario: ", Date().toLocaleString());
        
    //para salir del middleware
    next()
})
*/

//uso de archivos public, le indicamos al servidor que el directorio public es publico
app.use(express.static(__dirname+"/public/"));


//middleware para inicio de sesión
const sessionSecret = process.env.SESSION_SECRET;
const sessionMiddleware = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);
app.use(cookieParser())


app.use(passport.initialize());
app.use(passport.session());


// Configuración de Handlebars con el helper "eq"
const hbs = handlebars.create({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
  });


//-------inicializamos el motor de plantilla----------
app.engine("handlebars",hbs.engine);
//indicamos en que parte del proyecto estarán las vistas (Usar rutas absolutas)
app.set("views",__dirname+"/views/");
//para indicarle que el motor que inicializamos arriba es el que equeremos usar
app.set("view engine","handlebars");



//----------Endpoints (Rutas) que tenemos configuradas en nuestro proyecto---------
app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/api/users", userRouter)
app.use("/", viewRouter)



// escucha el puerto que configuramos
                //este callback es solo para mostrar por consola que se está corriendo el puerto
const httpServer = app.listen((PORT), ()=>{
    console.log("Servidor corriendo en puerto",PORT );  
})

//abrimos canal de comunicació del lado del server
const socketServer = new Server(httpServer)

// Compartir la sesión con socket.io
socketServer.use(sharedsession(sessionMiddleware,{
    autoSave: true
}));

// Exportamos `socketServer` para usarlo en otros archivos
export { socketServer };


//--------------------------------- WEB SOCKET ---------------------------------

socketServer.on("connection", socket => {
//toda la logica referida a socket va acá adentro
console.log("Sesión del socket al conectar:", socket.handshake.session);
    if (socket.handshake.session.user) {
        socket.emit("userData", socket.handshake.session.user);
    }
    //esto va a ver cualquier usuario que se conecte
    async function enviarProductos(){
        try {            
            //envia todos los productos al cliente conectado
            const products = await productManager.getAllProducts();
            socket.emit("productLogs", products);
        } catch (error) {
            console.log("Error en app.js al enviar productos a los usuarios conectados", error);
        }
    }
    enviarProductos();

    socket.on("products", async data => {
        try {
            const newProduct = {
                user: data.user,
                title: data.title,
                description: data.description,
                code: data.code,
                price: Number(data.price),
                stock: Number(data.stock),
                category: data.category
            };
            await productManager.addProduct(newProduct); // guarda el producto en MongoDB
            const products = await productManager.getAllProducts();
            socketServer.emit("productLogs", products); // envia la lista actualizada de productos a todos los clientes
        } catch (error) {
            console.log("Error al agregar producto (app.js):", error);
        }
    });


    //hacemos broadcast del usuario que se conectó
    socket.on("userConnect", async userData =>{
        try {
            await userManager.addUser(userData) //guardar el nuevo usuario en la base de datos
            socket.broadcast.emit("userConnect", userData.user ) //notificar a otros usuarios
        } catch (error) {
            console.error("(app.js) Error al registrar el usuario:", error);
        }
    });

    socket.on("deleteProduct", async id => {
        try {
            if (socket.handshake.session.user.role !== "admin") {
                throw new Error("No tenes permisos para eliminar este producto.");
            }
            await productManager.deleteProduct(id);
            const products = await productManager.getAllProducts();
            socketServer.emit("productLogs", products); // envía la lista actualizada de productos
        } catch (error) {
            console.error("Error al eliminar producto (app.js):", error);
        }
    });


    socket.on("addToCart", async data => {
        try {
            if (!socket.handshake.session.user) {
                throw new Error("Usuario no autenticado");
            }
            const user = socket.handshake.session.user;
            const productId = data.productId;
            
            const cart = await cartManager.addProductToCart(user.cartId, productId);
            
            socket.emit("cartUpdated", "Producto agregado al carrito exitosamente.", cart);
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error);
            socket.emit("cartError", error.message);
        }
    });

    socket.on("deleteAllProducts", async data => {
        try {
            const { cartId } = data;
            if (!cartId) {
                throw new Error("Carrito no encontrado");
            }

            const cart = await cartManager.deleteAllProduct(cartId);

            socket.emit("cartUpdated", "Productos eliminados del carrito exitosamente.", cart);
        } catch (error) {
            console.log("Error al eliminar productos del carrito:", error);
            socket.emit("cartError", error.message);
        }
    });

    // Manejador de eventos para eliminar un producto del carrito
    socket.on("removeFromCart", async ({ cartId, productId }) => {
        try {
            const updatedCart = await cartManager.deleteProduct(cartId, productId);

            if (!updatedCart) {
                socket.emit("cartError", "No fue posible eliminar el producto.");
                return;
            }

            //  Emitimos el carrito actualizado a todos los clientes conectados
            socketServer.emit("cartUpdated", updatedCart);
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            socket.emit("cartError", "Error al eliminar el producto.");
        }
    });
});








//------------------------- Conectamos app con Mongo Atlas (base de datos en la nube) ------------------- 

const uriDB = process.env.MONGODB_URI;

const connectMongoDB = async () => {
    try {
        await mongoose.connect(uriDB)
        console.log("Conectado con exito a Mongo Atlas usando Mongoose");
        
        //let productos = await productModel.find();
        //console.log(productos);
        
        let productos = await productModel.aggregate([
            //stage 1: filtramos la categoría "zapatillas"
            {
                $match: { category: "zapatillas"}
            },
            //stage 2: 
            {
                $group: { _id: "$title", totalStock: { $sum: "$stock"}
                }
            }



        ])

        console.log(productos);
        

        
    } catch (error) {
        console.log("No se pudo conectar a la Base de Datos usando Mongoose: ",error);
        process.exit(1);
    }
}

connectMongoDB()
