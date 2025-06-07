<template>
  <div class="min-h-screen bg-[#002C5F] flex items-center justify-center px-4">
    <Transition
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="show"
        class="bg-white w-full max-w-xl rounded-xl shadow-2xl p-8 text-center space-y-4"
      >
        <!-- Título -->
        <h1 class="text-2xl font-bold text-blue-800">¡Bienvenido, {{ user?.nombre || 'Usuario' }}! 👋</h1>
        <p class="text-gray-600">Correo: </p>
        <p class="text-gray-500 text-sm">DPI: </p>

        <!-- Acciones -->
        <div class="pt-4">
          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js'

const { getUser, logout } = useAuth()
const user = ref(getUser())  // <- esto carga los datos
const show = ref(false)
console.log('Usuario:', user) 

onMounted(() => {
  show.value = true
})
</script>

