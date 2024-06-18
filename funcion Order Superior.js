// Distintos metodos para recorrer, modificar, ordenar Objetos
const productoDisponible = [
    { nombre: "zapas axel", categoria: "zapatillas", precio: 70000 },
    { nombre: "nike", categoria: "zapatillas", precio: 120000 },
    { nombre: "adidas", categoria: "zapatillas", precio: 50000 },
    { nombre: "camiseta", categoria: "remeras", precio: 20000 },
    { nombre: "short", categoria: "pantalones", precio: 180000 }
];


// el forEach sirve para recorrer objeto/array
productoDisponible.forEach( (item) => {
    console.log(item.nombre);
    alert("Actualmente están disponibles los siguientes productos: (" + item.nombre + ")");

} )


//el find sirve para encontrar elementos del array/objeto por medio de comparación 
const categorias = productoDisponible.find( (filtrar) => filtrar.nombre == ("nike")) 
console.log(categorias);
alert("Ahora vamos a filtrar por categoría zapatillas usando find: " + categorias);


// el filter funciona como un find que sirve para buscar elementos y si existe lo retorna. 
categoriasFilter = productoDisponible.filter( (filtrar) => filtrar.categoria.includes ("zapa") ) 
console.log(categoriasFilter);
alert("Ahora vamos a filtrar por categoría zapatillas usando filter: " + categoriasFilter);



// el metodo some recibe una funcion que retorna true o false segun la busqueda
const encontrarCategoriaLog = productoDisponible.some ((encontrarCategoria) => encontrarCategoria.categoria == "remeras")
console.log(encontrarCategoriaLog);

// el metodo map sirve para crear un nuevo array con los elementos del array original o objeto que teníamos, según la operacion 
//que le indiquemos por parametro 
const mostrarNombres = productoDisponible.map((arrayNombres) => arrayNombres.nombre )
console.log(mostrarNombres)
alert("Ahora podemos ver los nombres del objeto " + mostrarNombres)


// el metodo Reduce sirve para simplificar el array/objeto a un solo resultado 
const precioCompra = carritoProductos.reduce((acumular, total) => acumular + total.precio, 0)
console.log(precioCompra)