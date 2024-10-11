//configuración del socket del lado del cliente
const socket = io();

function addToCart(productId) {
    // lógica para agregar al carrito
    console.log(`Producto ${productId} agregado al carrito`);
    // acá se puede enviar la petición al servidor para agregar al carrito
}