<template>
  <div id="change-password-app">
    <h1>Recuperar contraseña</h1>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <form @submit.prevent="changePassword">
      <label>Email:</label>
      <input type="email" v-model="form.email" />

      <label>Nueva contraseña:</label>
      <input type="password" v-model="form.newPassword" />

      <button type="submit">Cambiar Contraseña</button>
      <router-link to="/login"><button type="button">Volver al login</button></router-link>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "ChangePasswordView",
  data() {
    return {
      form: {
        email: "",
        newPassword: "",
      },
      errorMsg: ""
    };
  },
  methods: {
    async changePassword() {
      if (!this.form.email || !this.form.newPassword) {
        this.errorMsg = "Todos los campos son obligatorios.";
        return;
      }

      this.errorMsg = "";

      try {
        const response = await fetch("/api/users/changepassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            title: "Contraseña actualizada",
            text: "La contraseña se ha cambiado exitosamente",
            icon: "success",
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            this.$router.push("/login");
          });
        } else {
          Swal.fire("Error", result.message || "No se pudo cambiar la contraseña", "error");
        }
      } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        Swal.fire("Error", "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.", "error");
      }
    }
  }
};
</script>

<style scoped>
.error-msg {
  color: red;
  font-size: 0.9em;
  margin-bottom: 10px;
}
</style>