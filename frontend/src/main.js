import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import './style.css';

createApp(App)
  .use(router) // usa el router 
  .mount('#app') // "monta" la aplicación en el elemento con id "app"