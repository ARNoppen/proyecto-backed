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
import { io } from 'socket.io-client'
import Swal from 'sweetalert2'

export default {
  name: 'ProductsView',
  data() {
    return {
      products: [],
      socket: null,
      user: null
    }
  },
  async mounted() {
    await this.loadProducts()
    await this.checkSession()
  },
  methods: {
    async loadProducts() {
      try {
        const response = await fetch('/api/products', { credentials: 'include' })
        const result = await response.json()
        this.products = result.payload || []
      } catch (error) {
        console.error('Error al obtener productos:', error)
      }
    },

    async checkSession() {
      try {
        const response = await fetch('/api/users/current', { credentials: 'include' })
        const result = await response.json()

        if (result.success) {
          this.user = result.payload
          this.initSocket() // conectamos socket si hay sesión
        } else {
          console.warn('Usuario no logueado')
        }
      } catch (error) {
        console.error('Error verificando sesión:', error)
      }
    },

    initSocket() {
      // por el proxy de Vite para /socket.io, no pasamos URL:
      this.socket = io({
        withCredentials: true,
        transports: ['websocket']
      })

      this.socket.on('connect', () => {
        console.log('Socket conectado:', this.socket.id)
      })
      this.socket.on('connect_error', (err) => {
        console.error('Socket connect_error:', err.message)
      })
      this.socket.on('error', (err) => {
        console.error('Socket error:', err)
      })

      this.socket.on('userData', (user) => {
        console.log('Usuario autenticado por socket:', user)
      })

      this.socket.on('cartUpdated', (message, cart) => {
        Swal.fire('Producto agregado', message, 'success')
        console.log('Carrito actualizado:', cart)
      })

      this.socket.on('cartError', (errorMessage) => {
        Swal.fire('Error', errorMessage, 'error')
      })
    },

    addProductToCart(productId) {
      if (!this.user) {
        Swal.fire('Atención', 'Tenés que iniciar sesión para agregar productos', 'warning')
        return
      }

      if (this.socket && this.socket.connected) {
        console.log('Emit addToCart con:', productId)
        this.socket.emit('addToCart', { productId })
      } else {
        console.warn('Socket no conectado')
        Swal.fire('Error', 'No estás conectado al servidor', 'error')
      }
    }
  }
}
</script>

<style scoped>
.product-item {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>