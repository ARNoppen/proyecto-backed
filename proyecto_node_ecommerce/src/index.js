//hacemos el import de las librerías
import express from "express";
//import de nuestros otros directorios que exportamos
import productsRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import __dirname from "./utils.js";

//declaramos express
const app = express();
 


//colocamos middleware a nivel aplicación (sirve para mostrarle predeterminadamente como va a trabajar en el código)
//prepara la configuración del servidor para trabajar con archivos JSON
app.use(express.json());
app.use(express.urlencoded({ extended : true }));



//Practicando middelware a nivel Aplicación
app.use(function(req,res,next){
    console.log("Practicando Middleware a nivel de Aplicación   ");
    console.log("Horario: ", Date().toLocaleString());
        
    //para salir del middleware
    next()
})




//le indicamos al servidor que el directorio public es publico
//console.log(__dirname);
app.use(express.static(__dirname + "/public"))



//Endpoints (Rutas) que tenemos configuradas en nuestro proyecto
app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)

const PORT   = 8080;





// escucha el puerto que configuramos
                //este callback es solo para mostrar por consola que se está corriendo el puerto
app.listen((PORT), ()=>{
    console.log("Servidor corriendo en puerto",PORT );  
})

