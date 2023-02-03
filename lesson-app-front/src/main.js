import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'
const options = {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
}

createApp(App).use(store).use(router).use(Toast, options).mount('#app')
