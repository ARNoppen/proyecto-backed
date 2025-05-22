<template>
    <div id="login-app">
        <h1>Iniciar Sesión</h1>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <form @submit.prevent="login">
            <label>Email:</label>
            <input type="email" v-model="form.email" />

            <label>Contraseña:</label>
            <input type="password" v-model="form.password" />

            <button type="submit">Iniciar Sesión</button>
            <router-link to="/register"><button type="button">Registrarse</button></router-link>
            <router-link to="/changepassword"><button type="button">¿Olvidaste tu contraseña?</button></router-link>
        </form>
    </div>
</template>

<script>
    import Swal from 'sweetalert2';

    export default {
        name: "LoginView",
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                },
                errorMsg: "",
            };
        },
        methods: {
            async login() {
                if (!this.form.email || !this.form.password) {
                    this.errorMsg = "Todos los campos son obligatorios.";
                    return;
                }

                this.errorMsg = "";

                try {
                    const response = await fetch("/api/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(this.form),
                    });

                    const result = await response.json();

                    if (result.success) {
                    Swal.fire({
                        title: 'Login exitoso',
                        text: result.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(() => {
                        this.$router.push("/products");
                    });

                    } else {
                        Swal.fire("Error", result.message, "error");    
                    }
                } catch (error) {
                    console.error("Error al loguear:", error);
                    Swal.fire("Error", "Ocurrió un error al intentar iniciar sesión.", "error");
                }
            },
        },
    };
</script>

<style scoped>
.error-msg {
  color: red;
  font-size: 0.9em;
  margin-bottom: 10px;
}
</style>