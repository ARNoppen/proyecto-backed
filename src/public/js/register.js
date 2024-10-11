document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // prevenir el comportamiento por defecto del formulario

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        age: formData.get("age"),
    };

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire("Registrado", result.message, "success");
            setTimeout(() => {
                window.location.href = "/login"; // redirigir después de mostrar el mensaje de éxito
            }, 3000);
        } else {
            Swal.fire("Error", result.message, "error");
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        Swal.fire("Error, El mail ya está en uso, favor intentar con otro");
    }
});