<template>
  <div class="products-page">
    <div class="header-buttons">
      <router-link to="/">
        <button class="secondary">🏠 Volver al Home</button>
      </router-link>

      <router-link to="/realtimeproducts">
        <button class="primary">⚡ Cargar productos en tiempo real</button>
      </router-link>

      <router-link to="/cart">
        <button class="primary">🛒 Mostrar carrito</button>
      </router-link>
    </div>

    <h1>Estos son los productos creados hasta el momento:</h1>

    <ul class="product-grid">
      <li v-for="product in products" :key="product._id" class="product-card">
        <div class="product-header">
          <span class="creator">
            <b>{{ product.user.first_name }} {{ product.user.last_name }}</b>
          </span>
        </div>

        <div class="product-body">
          <div class="row"><span class="label">Título:</span> <span class="value">{{ product.title }}</span></div>
          <div class="row desc"><span class="label">Descripción:</span> <span class="value">{{ product.description }}</span></div>
          <div class="row"><span class="label">Código:</span> <span class="value">{{ product.code }}</span></div>
          <div class="row"><span class="label">Precio:</span> <span class="value">${{ product.price }}</span></div>
          <div class="row"><span class="label">Stock:</span> <span class="value">{{ product.stock }}</span></div>
          <div class="row"><span class="label">Categoría:</span> <span class="value">{{ product.category }}</span></div>
        </div>

        <div class="product-actions">
          <button class="primary" @click="addToCart(product._id)">Agregar al carrito</button>
          <router-link :to="`/products/${product._id}`">
            <button class="secondary">Abrir producto completo</button>
          </router-link>
        </div>
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
      user: null,
      loadingUser: true,
    };
  },
  async mounted() {
    const ok = await this.loadCurrentUser();
    if (!ok) return this.$router.push("/login");
    await this.loadProducts();
  },
  methods: {
    async loadCurrentUser() {
      try {
        const res = await fetch("/api/users/current", { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          this.user = json.payload; // { cartId, ... }
          this.loadingUser = false;
          return true;
        }
        return false;
      } catch (e) {
        console.error("Error chequeando sesión:", e);
        return false;
      }
    },

    async loadProducts() {
      try {
        const res = await fetch("/api/products", { credentials: "include" });
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
        if (!this.user?.cartId) {
          Swal.fire("Sesión requerida", "Iniciá sesión para agregar al carrito", "warning");
          return this.$router.push("/login");
        }

        const res = await fetch(`/api/carts/${this.user.cartId}/product/${productId}`, {
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
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      }
    },
  },
};
</script>

<style scoped>
/* Header */
.header-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

/* Grid */
.product-grid {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* Card */
.product-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.05);
}

.product-header .creator {
  font-size: 0.95rem;
  color: #374151;
}

.product-body .row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
  margin: 6px 0;
  align-items: start;
}

.product-body .row.desc .value {
  white-space: pre-line;
}

.label {
  color: #6b7280;
  font-weight: 600;
}

.value {
  color: #111827;
}

/* Actions */
.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}

/* Buttons */
.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.primary:hover { filter: brightness(1.05); }
.secondary:hover { filter: brightness(1.05); }
</style>