async function finishPurchase(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: "POST"
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.json();
            Swal.fire("Alerta", result.message || "No se pudo finalizar la compra por falta de stock", "warning");
        }
    } catch (error) {
        console.error("Error al finalizar compra:", error);
        Swal.fire("Error", "Ocurrió un error al procesar tu compra", "error");
    }
}