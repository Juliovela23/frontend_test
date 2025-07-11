import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast'
import { Button } from '../components/ui/button'
import { Input } from '@/components/ui/input/index'
import { Label } from '@/components/ui/label/index'


export function useLogin() {
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const mensaje = ref('')
  const correo = ref('')
  const router = useRouter()
  const { toast } = useToast()

  const login = async () => {
    loading.value = true // 👈 activar loading
    try {
      error.value = ''
      mensaje.value = ''
      correo.value = ''

      const response = await axios.post(
        'https://interappapi.onrender.com/api/auth/login',
        {
          dpi: email.value,
          password: password.value
        }
      )

      const result = response.data

      mensaje.value = result.mensaje || 'Código enviado.'
      correo.value = result.correo || email.value

      localStorage.setItem('email2FA', correo.value)

      toast({
        title: 'Éxito',
        description: mensaje.value,
        variant: 'success'
      })

      // Espera 1 segundo antes de redirigir (opcional, para mostrar overlay)
      setTimeout(() => router.push('/2fa'), 4000)
    } catch (err) {
      console.error('Error en login:', err)

      if (err.response?.status === 400 && typeof err.response.data === 'string') {
        toast({
          title: 'Aviso',
          description: err.response.data,
          variant: 'default'
        })
      } else {
        error.value =
          err.response?.data?.message ||
          err.response?.data?.title ||
          'Credenciales incorrectas'

        toast({
          title: 'Error',
          description: error.value,
          variant: 'destructive'
        })
      }
    } finally {
      loading.value = false 
    }
  }

  return {
    email,
    password,
    error,
    mensaje,
    correo,
    loading,
    login
  }

}
