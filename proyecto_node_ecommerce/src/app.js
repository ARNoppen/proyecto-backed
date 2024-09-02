//hacemos el import de las librerías
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
//import de nuestros otros directorios que ya exportamos
import productsRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import __dirname from "./utils.js";
import viewRouter from "./routes/views.routes.js";

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
app.use("/",viewRouter)




// escucha el puerto que configuramos
                //este callback es solo para mostrar por consola que se está corriendo el puerto
const httpServer = app.listen((PORT), ()=>{
    console.log("Servidor corriendo en puerto",PORT );  
})

//Abrimos canal de comunicació del lado del server
const socketServer = new Server(httpServer)



const message = [];
socketServer.on("connection", socket => {
//toda la logica referida a socket va acá adentro
    
    //esto va a ver cualquier usuario que se conecte
    socketServer.emit("messageLogs", message)


    socket.on("message",data => {
        message.push(data)
        
        socketServer.emit("messageLogs", message)
    })


    //hacemos broadcast del usuario que se conectó
    socket.on("userConnect", data =>{
        console.log(data);

        socket.broadcast.emit("userConnect", data.user )
    } )


    socket.on("closeProduct", data => {
        if(data.close === "closed"){
            socket.disconnect()
        }
    })
})