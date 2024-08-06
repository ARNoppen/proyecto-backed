//Importamos ProductsManager
const ProductsManager = require("./ProductsManager.js")

//Instanciamos la clase ProductsManager

const manager = new ProductsManager();

// Nuevo producto

const productoNuevo = {
    id : 1, 
    nombre: "Zapas axel",
    categoria: "zapatillas", 
    precio: 70000, 
    cantidad: 1
}

const ejecutar = async() => {
    await manager.create(productoNuevo);

    //await manager.delete();

    //await manager.uptdate();

    const dato = await manager.read();
    console.log(dato);

}

ejecutar();