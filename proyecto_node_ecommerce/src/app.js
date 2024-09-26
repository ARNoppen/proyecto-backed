//hacemos el import de las librerías
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
//import de nuestros otros directorios que ya exportamos
import productsRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import __dirname from "./utils.js";
import viewRouter from "./routes/views.routes.js";
import userRouter from "./routes/users.routes.js";

import { productModel } from "./service/models/product.model.js";

import ProductManager from "./service/ProductManager.js";
import UserManager from "./service/UserManager.js";

const productManager = new ProductManager();
const userManager = new UserManager();

//----declaramos express----
const app = express();
const PORT = process.env.PORT || 8080;

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



//-------inicializamos el motor de plantilla----------
app.engine("handlebars",handlebars.engine());
//indicamos en que parte del proyecto estarán las vistas (Usar rutas absolutas)
app.set("views",__dirname+"/views/");
//para indicarle que el motor que inicializamos arriba es el que equeremos usar
app.set("view engine","handlebars");





//----------Endpoints (Rutas) que tenemos configuradas en nuestro proyecto---------
app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/", viewRouter)
app.use("/api/users", userRouter)




// escucha el puerto que configuramos
                //este callback es solo para mostrar por consola que se está corriendo el puerto
const httpServer = app.listen((PORT), ()=>{
    console.log("Servidor corriendo en puerto",PORT );  
})

//Abrimos canal de comunicació del lado del server
const socketServer = new Server(httpServer)








//--------------------------------- WEB SOCKET ---------------------------------

socketServer.on("connection", socket => {
//toda la logica referida a socket va acá adentro
    
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


    socket.on("products",async data => {
        try {
            const newProduct = {
                user: data.user,
                title: data.title,
                description: data.description,
                code: data.code,
                price: data.price,
                stock: data.stock,
                category: data.category
            };
            
            // guarda el producto en MongoDB
            await productManager.addProduct(newProduct);

            // envia la lista actualizada de productos a todos los clientes
            const products = await productManager.getAllProducts();
            socketServer.emit('productLogs', products);
        } catch (error) {
            console.log("Error al agregar producto (app.js):", error);
        }
    });


    //hacemos broadcast del usuario que se conectó
    socket.on("userConnect", async userData =>{
        try {
            console.log("(app.js) websocket Usuario: ",userData);
            await userManager.addUser(userData) //guardar el nuevo usuario en la base de datos
            socket.broadcast.emit("userConnect", userData.user ) //notificar a otros usuarios
        } catch (error) {
            console.error("(app.js) Error al registrar el usuario:", error);
        }
    } )

    socket.on("deleteProduct", async id =>{
        try {
            await productManager.deleteProduct(id);
            const products = await productManager.getAllProducts();
            socketServer.emit('productLogs', products); // Envia la lista actualizada
        } catch (error) {
            console.error("Error al eliminar producto (app.js):", error);
        }
    } )

    socket.on("closeProduct", data => {
        if(data.close === "closed"){
            socket.disconnect()
        }
    })
})








//------------------------- Conectamos app con Mongo Atlas (base de datos en la nube) ------------------- 

const uriDB = "mongodb+srv://aranuo23:AsZL0y3ZeDGLLV85@clusterproyecto.85xgv.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProyecto";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(uriDB)
        console.log("Conectado con exito a Mongo Atlas usando Mongoose");
        
        
    } catch (error) {
        console.log("No se pudo conectar a la Base de Datos usando Mongoose: ",error);
        process.exit();
    }
}

connectMongoDB()