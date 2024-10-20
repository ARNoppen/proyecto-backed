//configuración del socket del lado del cliente
const socket = io();

function addToCart(productId) {
    console.log(`Se agregó al carrito el producto con ID: ${productId}`);
    socket.emit('addToCart', { productId });
}

// Manejador de respuesta para la adición al carrito
socket.on('cartUpdated', (message) => {
    Swal.fire('Producto agregado', message, 'success');
});
socket.on('cartError', (errorMessage) => {
    Swal.fire('Error', errorMessage, 'error');
});