import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import moment from "moment";
import "moment/locale/es.js";

//configuro rutas absolutas 
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)


export default __dirname;

//Función para formatear la fecha
export function formatDateTime(date) {
    return moment(date).locale("es").format("LLLL"); // Ej: domingo, 23 de marzo de 2024 15:30
}


//Config para Multer (indicamos donde se va a almacenar la imagen, etc.)

const storage = multer.diskStorage(
    {
        //ubicación del directorio donde voy a guardar los archivos
        destination: function(res,file,callback){
            callback(null, `${__dirname}/public/img`)
        },    
        //el nombre que quiero que tengan los archivos que voy a subir
        filename: function(res,file,callback){
            callback(null, `${Date.now()}-${file.originalname}`)
        }    
    }
);


export const uploader = multer ({
    storage,


    //si se genera algun error lo capturo
    onError:function(err,next){
        console.log(err);
        next();
    }

});

