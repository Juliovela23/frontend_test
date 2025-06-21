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
    if (error.response && error.response.status === 401) {
      // Leer mensaje que manda tu API (ajusta la propiedad según cómo venga tu backend)
      const mensaje = error.response.data?.message || error.response.data?.error || ''
      if (
        mensaje.toLowerCase().includes('token') ||
        mensaje.toLowerCase().includes('expirad') ||
        mensaje.toLowerCase().includes('expired') ||
        mensaje.toLowerCase().includes('invalid')
      ) {
        // Solo aquí limpiar y sacar
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Muestra un toast aquí si tienes uno custom
        alert('Tu sesión ha caducado. Por favor inicia sesión de nuevo.')
        router.push('/login')
      } else {
        // Aquí puedes mostrar un toast de error normal
        // Ejemplo: toast({ title: 'Acceso denegado', description: mensaje, variant: 'destructive' })
      }
    }
    return Promise.reject(error)
  }
)

app.mount('#app')


