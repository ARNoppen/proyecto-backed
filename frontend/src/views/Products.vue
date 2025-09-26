<template>
  <div class="products-page">
    <div class="header-buttons">
      <!-- Botón para mostrar carrito -->
      <router-link to="/cart">
        <button class="primary">🛒 Mostrar carrito</button>
      </router-link>

    </div>

    <h1>Estos son los productos creados hasta el momento:</h1>

    <ul class="product-list">
      <li v-for="product in products" :key="product._id">
        <b>{{ product.user.first_name }} {{ product.user.last_name }}</b> creó el siguiente producto: <br>
        Título: {{ product.title }} <br>
        Descripción: {{ product.description }} <br>
        Código: {{ product.code }} <br>
        Precio: ${{ product.price }} <br>
        Stock: {{ product.stock }} <br>
        Categoría: {{ product.category }} <br><br>

        <button @click="addToCart(product._id)">Agregar al carrito</button>
        <router-link :to="`/products/${product._id}`">
          <button>Abrir producto completo</button>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ProductsView",
  data() {
    return {
      products: [],
    };
  },
  async mounted() {
    await this.loadProducts();
  },
  methods: {
    async loadProducts() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (res.ok) {
          this.products = json.payload;
        } else {
          Swal.fire("Error", json.error || "No se pudieron cargar los productos", "error");
        }
      } catch (e) {
        console.error("Error cargando productos:", e);
      }
    },
    async addToCart(productId) {
      try {
        const res = await fetch(`/api/carts/${this.$root.user.cartId}/product/${productId}`, {
          method: "POST",
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok) {
          Swal.fire("Éxito", "Producto agregado al carrito", "success");
        } else {
          Swal.fire("Error", json.error || "No se pudo agregar al carrito", "error");
        }
      } catch (e) {
        console.error("Error al agregar producto al carrito:", e);
      }
    },
  },
};
</script>

<style scoped>
.header-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
}
.secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
}
</style>