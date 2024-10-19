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
            Swal.fire("Éxito", result.message, "success");
            setTimeout(() => {
                window.location.href = "/products"; // redirigir después de mostrar el mensaje de éxito
            }, 3000);
        } else {
            Swal.fire("Error", result.message, "error");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
});