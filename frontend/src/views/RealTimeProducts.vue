<template>
  <div class="rtp">
    <div class="top-links">
      <router-link to="/"><button class="secondary">🏠 Inicio</button></router-link>
      <router-link to="/products"><button class="primary">🛍️ Productos</button></router-link>
    </div>

    <h1>Bienvenido: <span>{{ user ? (user.first_name + " " + user.last_name) : "..." }}</span></h1>

    <section class="form">
      <h2>Para ingresar un artículo completá el formulario:</h2>
      <form @submit.prevent="submitProduct" id="productBox">
        <label>Título</label>
        <input v-model.trim="form.title" type="text" placeholder="Título">

        <label>Descripción</label>
        <input v-model.trim="form.description" type="text" placeholder="Descripción">

        <label>Código</label>
        <input v-model.trim="form.code" type="text" placeholder="Código">

        <label>Precio</label>
        <input v-model.number="form.price" type="number" placeholder="Precio">

        <label>Stock</label>
        <input v-model.number="form.stock" type="number" placeholder="Stock">

        <label>Categoría</label>
        <input v-model.trim="form.category" type="text" placeholder="Categoría">

        <button class="primary" type="submit">Crear producto</button>
      </form>
    </section>

    <section class="list">
      <h2>Productos en tiempo real</h2>

      <p v-if="!products.length">No hay productos ingresados.</p>

      <ul v-else class="products">
        <li v-for="p in products" :key="p._id" class="item">
          <div class="info">
            <b>{{ p.user?.first_name }} {{ p.user?.last_name }}</b> creó:
            <div>Título: {{ p.title }}</div>
            <div>Descripción: {{ p.description }}</div>
            <div>Código: {{ p.code }}</div>
            <div>Precio: {{ p.price }}</div>
            <div>Stock: {{ p.stock }}</div>
            <div>Categoría: {{ p.category }}</div>
          </div>

          <div v-if="isAdmin" class="actions">
            <button @click="goEdit(p._id)">Actualizar Art.</button>
            <button class="danger" @click="deleteProduct(p._id)">Eliminar</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export default {
  name: "RealTimeProducts",
  data() {
    return {
      user: null,
      socket: null,
      products: [],
      form: {
        title: "",
        description: "",
        code: "",
        price: null,
        stock: null,
        category: "",
      },
    };
  },
  computed: {
    isAdmin() {
      return this.user && this.user.role === "admin";
    },
  },
  async mounted() {
    // 1) Verifico sesión (para tener el user)
    const ok = await this.loadCurrentUser();
    if (!ok) return this.$router.push("/login");

    // 2) Conecto sockets
    this.initSocket();
  },
  methods: {
    async loadCurrentUser() {
      try {
        const res = await fetch("/api/users/current", { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          this.user = json.payload;
          return true;
        }
        return false;
      } catch (e) {
        console.error("Error obteniendo sesión:", e);
        return false;
      }
    },

    initSocket() {
      this.socket = io({ withCredentials: true });

      // te manda el usuario (por si lo querés usar para saludo)
      this.socket.on("userData", (u) => {
        // preferimos la de /current, pero esto te mantiene sincronizado
        this.user = this.user || u;
      });

      // lista completa de productos para render en tiempo real
      this.socket.on("productLogs", (data) => {
        this.products = Array.isArray(data) ? data : [];
      });
    },

    async submitProduct() {
      const { title, description, code, price, stock, category } = this.form;
      if (!title || !description || !code || !price || !stock || !category) {
        Swal.fire("Alerta", "Debes completar todos los campos", "warning");
        return;
      }

      const payload = {
        user: this.user, // el server ya lo usa como venías haciendo
        title,
        description,
        code,
        price: Number(price),
        stock: Number(stock),
        category,
      };

      this.socket.emit("products", payload);
      // limpio formulario
      this.form = { title: "", description: "", code: "", price: null, stock: null, category: "" };
      Swal.fire("OK", "Producto enviado", "success");
    },

    goEdit(productId) {
      this.$router.push(`/products/${productId}`);
    },

    deleteProduct(id) {
      this.socket.emit("deleteProduct", id);
      // feedback visual; el server volverá a emitir productLogs con la lista actualizada
      Swal.fire({
        toast: true, position: "top-end", timer: 2000, showConfirmButton: false,
        icon: "success", title: "Solicitud de eliminación enviada",
      });
    },
  },
};
</script>

<style scoped>
.rtp { max-width: 900px; margin: 0 auto; padding: 16px; }
.top-links { display: flex; gap: 12px; margin-bottom: 16px; }
.form { margin-bottom: 28px; }
form { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
form input { padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
.products { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.item { border: 1px solid #ddd; border-radius: 8px; padding: 12px; display: grid; grid-template-columns: 1fr auto; gap: 12px; }
.actions button { margin-right: 8px; }
.primary { background: #2563eb; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; }
.secondary { background: #6b7280; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; }
.danger { background: #dc2626; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; }
</style>