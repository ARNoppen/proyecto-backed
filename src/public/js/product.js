//configuración del socket del lado del cliente
const socket = io();

// Función para agregar productos al carrito
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


// ---------------------- Lógica para mostrar/ocultar el formulario ----------------------
const editButton = document.getElementById("editButton");
const updateProductForm = document.getElementById("updateProductForm");
const cancelButton = document.getElementById("cancelButton");

if (editButton) {
    editButton.addEventListener("click", () => {
        updateProductForm.style.display = "block";  // Muestra el formulario
        editButton.style.display = "none";  // Oculta el botón de Editar
    });
}

if (cancelButton) {
    cancelButton.addEventListener("click", () => {
        updateProductForm.style.display = "none";  // Oculta el formulario
        editButton.style.display = "inline-block";  // Vuelve a mostrar el botón de Editar
    });
}

// ---------------------- Lógica para actualizar el producto ----------------------
if (updateProductForm) {
    updateProductForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const productId = window.location.pathname.split("/").pop(); // Obtener ID de la URL
        const updatedProduct = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            code: document.getElementById("code").value,
            price: document.getElementById("price").value,
            stock: document.getElementById("stock").value,
            category: document.getElementById("category").value,
        };

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
            });

            const result = await response.json();
            
            if (response.ok) {
                Swal.fire({
                    title: "Producto actualizado",
                    text: "Los cambios se guardaron con éxito.",
                    icon: "success",
                });
                updateProductForm.style.display = "none";  // Oculta el formulario después de guardar
                editButton.style.display = "inline-block";  // Muestra nuevamente el botón Editar
            } else {
                Swal.fire("Error", result.error, "error");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            Swal.fire("Error", "Ocurrió un error inesperado.", "error");
        }
    });
}

// Escuchamos los cambios (WebSocket) para actualizar la página en tiempo real
socket.on("productUpdated", (data) => {
    const currentProductId = window.location.pathname.split("/").pop();
    if (data.productId === currentProductId) {
        console.log("El producto fue actualizado, actualizando la vista...");

        // Actualizar los elementos de la vista sin recargar
        document.querySelector("h1").innerText = data.updatedProduct.title;
        document.querySelector("p:nth-of-type(1)").innerHTML = `<b>Descripción:</b> ${data.updatedProduct.description}`;
        document.querySelector("p:nth-of-type(2)").innerHTML = `<b>Código:</b> ${data.updatedProduct.code}`;
        document.querySelector("p:nth-of-type(3)").innerHTML = `<b>Precio:</b> $${data.updatedProduct.price}`;
        document.querySelector("p:nth-of-type(4)").innerHTML = `<b>Stock:</b> ${data.updatedProduct.stock}`;
        document.querySelector("p:nth-of-type(5)").innerHTML = `<b>Categoría:</b> ${data.updatedProduct.category}`;
    }
});