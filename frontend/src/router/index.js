import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import ChangePassword from '../views/ChangePassword.vue';
import Products from '../views/Products.vue';
import ProductDetail from '../views/ProductDetail.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/changepassword', component: ChangePassword},
  { path: '/products', component: Products },
  { path: '/products/:pid', component: ProductDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
