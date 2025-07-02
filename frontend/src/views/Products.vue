<template>
  <div id="products-app">
    <h1>Lista de productos</h1>
    <ul v-if="products.length">
      <li v-for="product in products" :key="product._id" class="product-item">
        <p><b>{{ product.title }}</b></p>
        <p>{{ product.description }}</p>
        <p>Precio: {{ product.price }}</p>
        <button @click="addProductToCart(product._id)">Agregar al carrito</button>
        <router-link :to="`/products/${product._id}`">
          <button type="button">Ver detalle</button>
        </router-link>
      </li>
    </ul>
    <p v-else>No hay productos disponibles</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

export default {
  name: 'ProductsView',
  data() {
    return {
      products: [],
      socket: null,
    };
  },
  async mounted() {
    await this.loadProducts();
    this.initSocket();
  },
  methods: {
    async loadProducts() {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();
        this.products = result.payload || [];
      } catch (error) {
        console.error('Error al obtener productos:', error);
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
    },
    addProductToCart(productId) {
      if (this.socket) {
        this.socket.emit('addToCart', { productId });
      }
    },
  },
};
</script>

<style scoped>
.product-item {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>