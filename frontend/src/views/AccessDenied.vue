<template>
  <div class="access-denied">
    <h1>Acceso Denegado</h1>
    <p>{{ message }}</p>
    <router-link to="/"><button>Volver al inicio 🔙</button></router-link>
  </div>
</template>

<script>
export default {
  name: 'AccessDenied',
  props: {
    message: {
      type: String,
      default: 'No tenés permisos para acceder a esta sección.'
    }
  }
}
</script>

<style scoped>
.access-denied {
  padding: 20px;
  text-align: center;
}
</style>