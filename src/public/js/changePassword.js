document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
        const response = await fetch("/changepassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword }),
        });

        if (response.ok) {
            Swal.fire({
                title: "Contraseña actualizada",
                text: "La contraseña se ha cambiado exitosamente",
                icon: "success",
                timer: 3000, // Mostrar el mensaje por 3 segundos
                showConfirmButton: false,
            }).then(() => {
                window.location.href = "/login"; // Redireccionar al login después de cerrar la alerta
            });
        } else {
            const data = await response.json();
            Swal.fire({
                title: "Error",
                text: data.message || "No se pudo cambiar la contraseña",
                icon: "error",
            });
        }
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
            icon: "error",
        });
    }
});