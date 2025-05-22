import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import ChangePassword from '../views/ChangePassword.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/changepassword', component: ChangePassword},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;