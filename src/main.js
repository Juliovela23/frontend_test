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

axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const mensaje = error.response?.data?.mensaje || ''

    if (status === 401) {
      // Verificamos si el mensaje es específicamente el que manda el backend
      if (mensaje.toLowerCase().includes('caducado') || mensaje.toLowerCase().includes('token')) {
        // Limpiamos token y redirigimos
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Tu sesión ha caducado. Por favor, inicia sesión de nuevo.')
        router.push('/login')
      } else {
        // Otro tipo de 401 (no autenticado por otra causa)
        alert('Acceso no autorizado.')
      }
    }

    return Promise.reject(error)
  }
)


app.mount('#app')


