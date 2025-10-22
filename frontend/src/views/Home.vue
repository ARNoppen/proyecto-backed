<template>
  <div class="home-page">
    <h1>Bienvenido al Proyecto Ecommerce</h1>
    <p>Desde acá podés acceder a los distintos endpoints:</p>

    <div class="links">

      <router-link to="/realtimeproducts">
        <button class="primary">⚡ Cargar productos en tiempo real</button>
      </router-link>

      <router-link to="/products">
        <button class="primary">🛍️ Ver productos</button>
      </router-link>

      <router-link to="/cart">
        <button class="primary">🛒 Ver carrito</button>
      </router-link>

      <router-link to="/login">
        <button class="secondary">🔑 Iniciar sesión</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home-page {
  text-align: center;
  margin-top: 40px;
}
.links {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}
.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
}
.secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
}
</style>