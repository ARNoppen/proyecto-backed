//ProductsManager
const fs = require("fs").promises;
const path = require("path");

class ProductsManager{
    constructor(){
        this.filePath = path.join(__dirname, "Products.json")
    }

    //Metodos
    async create(producto) {
        try {
            let productos = [];

            //Intentamos leer el archivo
            try {
                const leerProductos = await fs.readFile(this.filePath,"utf-8");
                productos = JSON.parse(leerProductos);
            } catch (error) {
                console.log("No se pudo leer el archivo", error);
            }
            //Agregamos al array
            productos.push(producto);

            //Escribimos sobre nuestro Products.json 
            await fs.writeFile(this.filePath, JSON.stringify(productos,null,2), "utf-8");


        } catch (error) {
            console.log("Error al crear usuario", error);
        }
    }

    async uptdate() {


    }

    async read() {
        try {
            const leido = await fs.readFile (this.filePath, "utf-8");
            const productos = JSON.parse(leido);
            return productos;
        } catch (error) {
           console.log("Ocurrio un error al leer los productos Metodo Read", error); 
        } 
    }

    async delete(){
        try {
            const leer = await fs.readFile(this.filePath, "utf-8");
            const eliminar = JSON.parse(leer);
            eliminar.pop();
            await fs.writeFile(this.filePath, JSON.stringify(eliminar,null,2), "utf-8");
        } catch (error) {
            console.log("No se pudo eliminar productos (Metodo delete)", error);
        }
    }
}


module.exports = ProductsManager;