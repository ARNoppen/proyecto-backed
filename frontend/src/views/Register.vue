<template>
  <div id="register-app">
    <h1>Registrarse</h1>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <form @submit.prevent="register">
      <label>Nombre:</label>
      <input type="text" v-model="form.first_name" />

      <label>Apellido:</label>
      <input type="text" v-model="form.last_name" />

      <label>Email:</label>
      <input type="email" v-model="form.email" />

      <label>Contraseña:</label>
      <input type="password" v-model="form.password" />

      <label>Edad:</label>
      <input type="number" v-model="form.age" />

      <button type="submit">Registrarse</button>
      <router-link to="/login"><button type="button">Volver al login</button></router-link>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "RegisterView",
  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        age: "",
      },
      errorMsg: "",
    };
  },
  methods: {
    async register() {
      if (
        !this.form.first_name || !this.form.email || !this.form.password || !this.form.age){
        this.errorMsg = "Todos los campos marcados son obligatorios.";
        return;
      }

      this.errorMsg = "";

      try {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.form),
        });

        const result = await response.json();

        if (result.success) {
          Swal.fire({
            title: '¡Registrado!',
            text: result.message,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            this.$router.push("/login");
          });
        } else {
            Swal.fire("Error", result.message, "error");
        }
      } catch (error) {
          console.error("Error al registrar:", error);
          Swal.fire("Error", "Ocurrió un error inesperado.", "error");
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