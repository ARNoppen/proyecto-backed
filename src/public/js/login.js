document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // prevenir el comportamiento por defecto del formulario

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: "Éxito",
                text: result.message,
                icon: "success",
                timer: 2000, // La alerta se cerrará automáticamente en 2 segundos
                showConfirmButton: true, // Asegura que haya botón de confirmación
                allowOutsideClick: true, // Permite cerrar al hacer clic fuera
                willClose: () => {
                    window.location.href = "/products"; // Redirigir cuando la alerta se cierre
                }
            });
        } else {
            Swal.fire("Error", result.message, "error");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
});