import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import axios from 'axios'
import App from './App.vue'
import { useSessionExpiredToast } from './composables/useSessionExpiredToast'
//import { createToast } from '@/components/ui/toast/use-toast'

const app = createApp(App)
//app.use(createToast())

app.use(router)
/**
axios.interceptors.response.use(
  response => response,
  error => {
    // Si la respuesta es 401, es que el token caducó o es inválido
    if (error.response && error.response.status === 401) {
      // Limpia token y datos de usuario
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Opcional: muestra mensaje al usuario
      alert('Tu sesión ha caducado. Por favor inicia sesión de nuevo.')
      // Redirige al login
      router.push('/login')
    }
    // Sigue lanzando el error para que otros catchs lo reciban
    return Promise.reject(error)
  }
) */
app.mount('#app')


