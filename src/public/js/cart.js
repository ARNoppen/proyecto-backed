const socket = io();

// 🔥 Función para obtener el Cart ID desde el div oculto
function getCartId() {
    return document.getElementById("cart-container").getAttribute("data-cart-id");
}

async function updateQuantity(productId, cartId, change) {
    if (!cartId || cartId === "undefined") {
        cartId = getCartId(); // Obtenerlo de la página si no se pasó bien
    }

    const quantityElement = document.getElementById(`qty-${productId}`);
    let currentQuantity = parseInt(quantityElement.innerText);
    let newQuantity = currentQuantity + change;

    // Evita que la cantidad baje de 1
    if (newQuantity < 1) {
        Swal.fire("Error", "La cantidad debe ser mayor que 1.", "error");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity })
        });

        const result = await response.json();
        if (response.ok) {
            quantityElement.innerText = newQuantity;
        } else {
            Swal.fire("Error", result.error, "error");
        }
    } catch (error) {
        console.error("Error al actualizar la cantidad en MongoDB:", error);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
}

async function removeFromCart(productId) {
    const cartId = getCartId();
    if (!cartId) {
        Swal.fire("Error", "No se pudo identificar el carrito.", "error");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "DELETE"
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire("Producto eliminado", "Se eliminó el producto del carrito.", "success");
            socket.emit("cartUpdated");
            setTimeout(() => location.reload(), 1000);
        } else {
            Swal.fire("Error", result.error || "Error desconocido", "error");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire("Error", "Hubo un problema al eliminar el producto.", "error");
    }
}

async function deleteAllProducts() {
    const cartId = getCartId();
    if (!cartId) {
        Swal.fire("Error", "No se pudo identificar el carrito.", "error");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: "DELETE"
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire("Carrito vaciado", "Todos los productos han sido eliminados.", "success");
            socket.emit("cartUpdated");
            setTimeout(() => location.reload(), 1000);
        } else {
            Swal.fire("Error", result.error, "error");
        }
    } catch (error) {
        console.error("Error al vaciar carrito:", error);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
}

// Manejador de respuesta para la eliminación de todos los productos del carrito
socket.on("cartUpdated", () => {
    Swal.fire("Carrito actualizado", "Los cambios se han guardado correctamente.", "success");
    setTimeout(() => location.reload(), 1000);
});

socket.on("cartError", (errorMessage) => {
    Swal.fire("Error", errorMessage, "error");
});