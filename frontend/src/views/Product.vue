<template>
  <div v-if="product" class="product-detail">
    <h1>{{ product.title }}</h1>

    <p><b>Descripción:</b> {{ product.description }}</p>
    <p><b>Código:</b> {{ product.code }}</p>
    <p><b>Precio:</b> ${{ product.price }}</p>
    <p><b>Stock:</b> {{ product.stock }}</p>
    <p><b>Categoría:</b> {{ product.category }}</p>

    <div v-if="userRole === 'admin'">
      <button v-if="!showForm" @click="showForm = true">Editar Artículo</button>

      <form v-else @submit.prevent="updateProduct">
        <label><b>Título:</b></label>
        <input type="text" v-model="editProduct.title" />

        <label><b>Descripción:</b></label>
        <textarea v-model="editProduct.description"></textarea>

        <label><b>Código:</b></label>
        <input type="text" v-model="editProduct.code" />

        <label><b>Precio:</b></label>
        <input type="number" v-model="editProduct.price" />

        <label><b>Stock:</b></label>
        <input type="number" v-model="editProduct.stock" />

        <label><b>Categoría:</b></label>
        <input type="text" v-model="editProduct.category" />

        <button type="submit">Guardar cambios</button>
        <button type="button" @click="cancelEdit">Cancelar</button>
      </form>
    </div>

    <button @click="addToCart(product._id)">Agregar al carrito</button>
    <router-link to="/products">
      <button>Volver</button>
    </router-link>
  </div>

  <div v-else>
    <p>Cargando producto...</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

export default {
  name: 'Product',
  data() {
    return {
      product: null,
      editProduct: null,
      showForm: false,
      socket: null,
      userRole: null, // Puede venir del store o de una llamada a /api/sessions/current
    };
  },
  async mounted() {
    await this.loadProduct();
    await this.getUserRole();
    this.initSocket();
  },
  methods: {
    async getUserRole() {
      try {
        const response = await fetch('/api/users/current');
        const result = await response.json();
        if (result.success) {
          this.userRole = result.payload.role;
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      }
    },
    async loadProduct() {
      try {
        const pid = this.$route.params.pid;
        const response = await fetch(`/api/products/${pid}`);
        const result = await response.json();
        if (result.success) {
          this.product = result.payload;
          this.editProduct = { ...result.payload };
        } else {
          Swal.fire('Error', 'Producto no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        Swal.fire('Error', 'No se pudo obtener el producto', 'error');
      }
    },
    initSocket() {
      this.socket = io();
      this.socket.on('cartUpdated', message => {
        Swal.fire('Producto agregado', message, 'success');
      });
      this.socket.on('cartError', errorMessage => {
        Swal.fire('Error', errorMessage, 'error');
      });
      this.socket.on('productUpdated', data => {
        const currentId = this.$route.params.pid;
        if (data.productId === currentId) {
          this.product = data.updatedProduct;
          Swal.fire('Producto actualizado en otra pestaña', '', 'info');
        }
      });
    },
    addToCart(productId) {
      if (this.socket) {
        this.socket.emit('addToCart', { productId });
      }
    },
    async updateProduct() {
      try {
        const pid = this.$route.params.pid;
        const response = await fetch(`/api/products/${pid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editProduct),
        });

        const result = await response.json();
        if (response.ok) {
          this.product = { ...this.editProduct };
          this.showForm = false;
          Swal.fire('Producto actualizado', 'Los cambios fueron guardados', 'success');
        } else {
          Swal.fire('Error', result.error, 'error');
        }
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
      }
    },
    cancelEdit() {
      this.editProduct = { ...this.product };
      this.showForm = false;
    }
  }
};
</script>

<style scoped>
.product-detail {
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 20px;
}

form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>