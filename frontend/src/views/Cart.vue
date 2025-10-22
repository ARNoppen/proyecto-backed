<template>
  <div class="cart-page">
    <h1>Tu carrito</h1>

    <div v-if="loading" class="loading">Cargando carrito...</div>

    <div v-else>
      <template v-if="cart && cart.products && cart.products.length">
        <ul class="cart-list">
          <li
            v-for="item in cart.products"
            :key="item.product._id"
            class="cart-item"
          >
            <div class="info">
              <h3 class="title">{{ item.product.title }}</h3>
              <p class="meta"><b>Precio:</b> ${{ item.product.price }}</p>

              <div class="qty-row">
                <b>Cantidad:</b>
                <div class="qty-controls">
                  <button class="btn ghost" @click="updateQuantity(item.product._id, -1)">➖</button>
                  <span class="qty">{{ item.quantity }}</span>
                  <button class="btn ghost" @click="updateQuantity(item.product._id, 1)">➕</button>
                </div>
              </div>

              <p class="subtotal">
                <b>Subtotal:</b>
                ${{ (Number(item.product.price) * Number(item.quantity)).toFixed(2) }}
              </p>
            </div>

            <div class="actions">
              <button class="btn danger" @click="removeFromCart(item.product._id)">Eliminar</button>
            </div>
          </li>
        </ul>

        <div class="summary">
          <div class="summary-line">
            <span>Total</span>
            <span class="total-amount">${{ totalAmount.toFixed(2) }}</span>
          </div>

          <div class="summary-actions">
            <button class="btn danger" @click="deleteAllProducts">Vaciar carrito</button>
            <button class="btn primary" @click="finishPurchase">Finalizar compra</button>
            <!-- RouterLink estilizado como botón -->
            <router-link class="btn primary" to="/products">Seguir comprando</router-link>
          </div>
        </div>
      </template>

      <div v-else class="empty">
        <p>Tu carrito está vacío.</p>
        <router-link class="btn primary" to="/products">Volver a productos</router-link>
      </div>
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
  computed: {
    totalAmount() {
      if (!this.cart || !this.cart.products) return 0;
      return this.cart.products.reduce((acc, it) => {
        const price = Number(it.product?.price) || 0;
        const qty = Number(it.quantity) || 0;
        return acc + price * qty;
      }, 0);
    },
  },
  async mounted() {
    const ok = await this.loadCurrentUser();
    if (!ok) return;
    await this.loadCart();
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
        this.user = json.payload;
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
        if (updatedCart && updatedCart._id === this.user.cartId) {
          this.cart = updatedCart;
        } else {
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
  max-width: 880px;
  margin: 0 auto;
}

.loading { color: #6b7280; }

.cart-list { list-style: none; margin: 0; padding: 0; }

.cart-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px;
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.04);
}

.title { margin: 0 0 6px; font-size: 1.05rem; color: #111827; }
.meta { color: #374151; margin: 0 0 8px; }

.qty-row { display: flex; align-items: center; gap: 8px; color: #374151; }
.qty-controls { display: inline-flex; align-items: center; gap: 8px; margin-left: 6px; }
.qty { min-width: 24px; text-align: center; }

.subtotal { margin: 8px 0 0; font-weight: 600; color: #111827; }

.actions { display: flex; gap: 8px; }

.summary {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.summary-line { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 12px; }
.total-amount { font-weight: 700; }

.summary-actions { display: flex; gap: 12px; flex-wrap: wrap; }

.empty { text-align: center; margin-top: 16px; }

/* Buttons */
.btn {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #111827;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
.btn:hover { filter: brightness(1.03); }
.btn.primary { background: #2563eb; border-color: #2563eb; color: #fff; }
.btn.danger  { background: #dc2626; border-color: #dc2626; color: #fff; }
.btn.ghost   { background: #fff; }
</style>