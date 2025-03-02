const socket = io();

function deleteAllProducts(cartId) {
    console.log(`Se eliminaron todos los productos del carrito con ID: ${cartId}`);
    socket.emit('deleteAllProducts', { cartId });
}

// Manejador de respuesta para la eliminación de todos los productos del carrito
socket.on('cartUpdated', (message) => {
    Swal.fire('Productos eliminados', message, 'success');
    setTimeout(() => location.reload(), 1000);
});
socket.on('cartError', (errorMessage) => {
    Swal.fire('Error', errorMessage, 'error');
});