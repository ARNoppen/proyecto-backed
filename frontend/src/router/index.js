import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import ChangePassword from '../views/ChangePassword.vue';
import Products from '../views/Products.vue';
import Product from '../views/Product.vue';
import Cart from '../views/Cart.vue';
import AccessDenied from '../views/AccessDenied.vue';
import Ticket from '../views/Ticket.vue';
import RealTimeProducts from '../views/RealTimeProducts.vue';

const routes = [
  // Rutas para las vistas
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/changepassword', component: ChangePassword },
  { path: '/products', component: Products },
  { path: '/products/:pid', component: Product },
  { path: '/cart', component: Cart }, 
  { path: '/tickets/:tid', component: Ticket },
  { path: '/access-denied', component: AccessDenied },
  { path: '/realtimeproducts', component: RealTimeProducts }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
  