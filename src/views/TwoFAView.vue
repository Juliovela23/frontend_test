<template>
  <div class="min-h-screen flex items-center justify-center bg-[#002C5F] px-4">
    <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md space-y-6 text-center">
      <img src="../image/logo.png" alt="Logo" class="h-20 w-20 mx-auto object-contain" />

      <div>
        <h2 class="text-xl font-bold text-gray-900">Verificación de dos pasos</h2>
        <p class="text-sm text-gray-600">Ingresa el código enviado a tu correo</p>
        <p v-if="mensaje" class="text-green-600 text-sm mt-1">{{ mensaje }}</p>
      </div>

      <form @submit.prevent="verificar" class="flex flex-col items-center space-y-4">
        <!-- ✅ PIN INPUT COMPONENT DE SHADCN-VUE -->
                <PinInput
                    id="pin-input"
                    v-model="code"
                    placeholder="○"
                    @complete="handleComplete"
                >
                <PinInputGroup class="gap-1">
                    <PinInputSlot
                    v-for="(id, index) in 8"
                    :key="id"
                    :index="index"
                />
                </PinInputGroup>
            </PinInput>

        <p v-if="error" class="text-red-500 text-sm text-center -mt-2">{{ error }}</p>

        <button
          type="submit"
          class="w-full bg-[#00AEEF] text-white py-2 rounded hover:bg-[#0090cc] transition"
        >
          Verificar
        </button>

        <p class="text-sm text-gray-500 mt-2">
          ¿No recibiste el código?
          <a
            href="#"
            @click.prevent="reenviarCodigo"
            class="text-blue-600 hover:underline font-medium"
            :class="{ 'opacity-50 pointer-events-none': reenviando }"
          >
            Reenviar
          </a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/composables/useAuth'
// ✅ IMPORTACIÓN CORRECTA DE PIN INPUTS
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from '@/components/ui/pin-input'

const { toast } = useToast()
const reenviando = ref(false)
const router = useRouter()
const error = ref('')
const mensaje = ref('')
const email = localStorage.getItem('email2FA')
const code = ref('')
const inputs = ref(Array(8).fill(''))

onMounted(() => {
  mensaje.value = `Se ha enviado un código de verificación a ${email || 'tu correo'}.`
})
const handleComplete = async (value) => {
  code.value = value
  await verificar()
}
const verificar = async () => {
  if (code.value.length !== 8) {
    error.value = 'Por favor, ingresa el código completo.'
    return
  }

  try {
    const response = await axios.post('https://interappapi-epdqhjbmepckfgda.canadacentral-01.azurewebsites.net/api/auth/verificar-codigo', {
      email,
      code: code
    })

    const { token, nombre, dpi, email: correo, refreshToken } = response.data

    setToken(token)
    setUser({ nombre, dpi, email: correo })
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.removeItem('email2FA')

    router.push('/dashboard')
  } catch (err) {
    error.value = 'Código inválido o expirado.'
  }
}


const reenviarCodigo = async () => {
  if (reenviando.value) return

  try {
    reenviando.value = true
    await axios.post('https://interappapi-epdqhjbmepckfgda.canadacentral-01.azurewebsites.net/api/auth/reenviar-codigo', { email })
    toast({ title: 'Código reenviado', description: 'Revisa tu correo.', variant: 'success' })
  } catch (err) {
    toast({ title: 'Error', description: 'No se pudo reenviar el código.', variant: 'destructive' })
  } finally {
    setTimeout(() => { reenviando.value = false }, 3000)
  }
}
</script>
