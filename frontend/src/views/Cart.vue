<template>
  <div class="cart-page">
    <h1>Estos son los productos en tu carrito!</h1>

    <div v-if="loading">Cargando carrito...</div>

    <div v-else>
      <template v-if="cart && cart.products && cart.products.length">
        <ul class="cart-list">
          <li
            v-for="item in cart.products"
            :key="item.product._id"
            class="cart-item"
          >
            <div class="info">
              <b>Artículo:</b> {{ item.product.title }} /
              <b>Precio:</b> ${{ item.product.price }} /
              <b>Cantidad:</b>
              <span class="qty">{{ item.quantity }}</span>
            </div>

            <div class="actions">
              <button @click="updateQuantity(item.product._id, -1)">➖</button>
              <button @click="updateQuantity(item.product._id, 1)">➕</button>
              <button class="danger" @click="removeFromCart(item.product._id)">
                Eliminar
              </button>
            </div>
          </li>
        </ul>

        <div class="footer-actions">
          <button class="danger" @click="deleteAllProducts">Vaciar carrito</button>
          <button class="primary" @click="finishPurchase">Finalizar compra</button>
        </div>
      </template>

      <p v-else>Tu carrito está vacío.</p>
        <router-link to="/products">
          <button class="primary">Volver a productos</button>
        </router-link>  
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export default {
  name: "CartView",
  data() {
    return {
      loading: true,
      cart: null,
      user: null,
      socket: null,
    };
  },
  async mounted() {
    // 1) Traigo sesión para conocer el cartId del usuario
    const ok = await this.loadCurrentUser();
    if (!ok) return;

    // 2) Cargo el carrito (JSON)
    await this.loadCart();

    // 3) Conecto sockets (opcional pero útil)
    this.initSocket();
  },
  methods: {
    async loadCurrentUser() {
      try {
        const res = await fetch("/api/users/current", { credentials: "include" });
        const json = await res.json();
        if (!json.success) {
          this.$router.push("/login");
          return false;
        }
        this.user = json.payload; // { first_name, ..., cartId }
        return true;
      } catch (e) {
        console.error("Error chequeando sesión:", e);
        this.$router.push("/login");
        return false;
      }
    },

    async loadCart() {
      this.loading = true;
      try {
        const res = await fetch(`/api/carts/${this.user.cartId}`, { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          this.cart = json.payload;
        } else {
          Swal.fire("Error", json.error || "No se pudo cargar el carrito", "error");
        }
      } catch (e) {
        console.error("Error cargando carrito:", e);
        Swal.fire("Error", "Ocurrió un error al cargar el carrito", "error");
      } finally {
        this.loading = false;
      }
    },

    initSocket() {
      this.socket = io({ withCredentials: true });

      this.socket.on("cartUpdated", (updatedCart) => {
        // si tu server emite el carrito directamente, podés usarlo:
        if (updatedCart && updatedCart._id === this.user.cartId) {
          this.cart = updatedCart;
        } else {
          // o recargar desde API
          this.loadCart();
        }
        Swal.fire("Carrito actualizado", "", "success");
      });

      this.socket.on("cartError", (msg) => {
        Swal.fire("Error", msg, "error");
      });
    },

    async updateQuantity(productId, change) {
      try {
        // Busco el item actual para calcular nueva cantidad
        const item = this.cart.products.find(p => p.product._id === productId);
        if (!item) return;
        const newQty = item.quantity + change;
        if (newQty < 1) {
          Swal.fire("Error", "La cantidad debe ser mayor que 0.", "error");
          return;
        }

        const res = await fetch(`/api/carts/${this.user.cartId}/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: newQty }),
        });
        const json = await res.json();

        if (res.ok && json.success) {
          // Actualizo en memoria para que se note rápido
          item.quantity = newQty;
        } else {
          Swal.fire("Error", json.error || "No se pudo actualizar la cantidad", "error");
        }
      } catch (e) {
        console.error("Error al actualizar cantidad:", e);
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      }
    },

    async removeFromCart(productId) {
      try {
        const res = await fetch(`/api/carts/${this.user.cartId}/product/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok) {
          Swal.fire("Producto eliminado", "", "success");
          // refresco el carrito
          this.loadCart();
        } else {
          Swal.fire("Error", json.error || "No se pudo eliminar el producto", "error");
        }
      } catch (e) {
        console.error("Error al eliminar producto:", e);
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      }
    },

    async deleteAllProducts() {
      try {
        const res = await fetch(`/api/carts/${this.user.cartId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok) {
          Swal.fire("Carrito vaciado", "", "success");
          this.loadCart();
        } else {
          Swal.fire("Error", json.error || "No se pudo vaciar el carrito", "error");
        }
      } catch (e) {
        console.error("Error al vaciar carrito:", e);
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      }
    },

    async finishPurchase() {
      try {
        const res = await fetch(`/api/carts/${this.user.cartId}/purchase`, {
          method: "POST",
          credentials: "include",
        });

        const json = await res.json();

        if (res.ok && json.success) {
          // 👇 Navegación con Vue Router al Ticket.vue
          this.$router.push(`/tickets/${json.ticketId}`);
        } else {
          Swal.fire("Error", json.error || "No se pudo finalizar la compra", "error");
        }
      } catch (e) {
        console.error("Error al finalizar compra:", e);
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      } 
    },
  },
};
</script>

<style scoped>
.cart-page {
  padding: 20px;
}
.cart-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.cart-item {
  padding: 12px 0;
  border-bottom: 1px solid #ccc;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
}
.actions button { margin-right: 8px; }
.qty { margin: 0 6px; }
.primary { background: #2563eb; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; }
.danger { background: #dc2626; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; }
.footer-actions { margin-top: 16px; display: flex; gap: 12px; }
</style>