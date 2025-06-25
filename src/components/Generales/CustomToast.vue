<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg px-4 py-3 rounded-xl flex items-center gap-3"
      :class="toastColor"
    >
      <span class="text-xl">{{ icon }}</span>
      <div>
        <p class="font-semibold" :class="textColor">{{ titulo }}</p>
        <p class="text-sm text-gray-700">{{ mensaje }}</p>
      </div>
      <button class="ml-auto text-gray-500" @click="visible = false">✕</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const visible = ref(false)
const tipo = ref('')
const titulo = ref('')
const mensaje = ref('')

const icon = computed(() => {
  switch (tipo.value) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'info': return 'ℹ️'
    case 'warning': return '⚠️'
    default: return '🔔'
  }
})

const toastColor = computed(() => {
  switch (tipo.value) {
    case 'success': return 'border-l-4 border-green-500 bg-green-100'
    case 'error': return 'border-l-4 border-red-500 bg-red-100'
    case 'info': return 'border-l-4 border-blue-500 bg-blue-100'
    case 'warning': return 'border-l-4 border-yellow-500 bg-yellow-100'
    default: return 'border-l-4 border-gray-300 bg-gray-100'
  }
})

const textColor = computed(() => {
  switch (tipo.value) {
    case 'success': return 'text-green-700'
    case 'error': return 'text-red-700'
    case 'info': return 'text-blue-700'
    case 'warning': return 'text-yellow-700'
    default: return 'text-gray-700'
  }
})

function mostrarToast({ tipo: t, titulo: ti, mensaje: m }) {
  tipo.value = t
  titulo.value = ti
  mensaje.value = m
  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, 3500)
}

defineExpose({ mostrarToast })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
