<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/solid'
import axios from 'axios'

// Config visual por tipo
const tipoConfig = {
  Notificacion: {
    icon: InformationCircleIcon,
    color: 'text-blue-500',
    fondo: 'bg-blue-50'
  },
  Solicitud: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-500',
    fondo: 'bg-yellow-50'
  }
}

// Helper para obtener token actualizado
const getAuthHeaders = () => ({
    
  Authorization: `Bearer ${localStorage.getItem('token')}`
})
const token = localStorage.getItem('token')

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const notificaciones = ref([])

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

// Llamada a: GET /api/notificaciones
const cargarNotificaciones = async () => {
  try {
    const { data } = await axios.get('https://interappapi.onrender.com/api/notificaciones', {
      headers: getAuthHeaders()
    })
    notificaciones.value = data
  } catch (err) {
    console.error('Error al cargar notificaciones:', err)
  }
}

// PUT /api/notificaciones/leida/{id}
const marcarLeida = async (id) => {
  try {
    await axios.put(
      `https://interappapi.onrender.com/api/notificaciones/leida/${id}`,
      {}, // payload vacío
      { headers: getAuthHeaders() }
    )
    const n = notificaciones.value.find(n => n.id === id)
    if (n) n.leida = true
  } catch (err) {
    console.error('Error al marcar como leída:', err)
  }
}

// PUT /api/notificaciones/leertodas
const marcarTodas = async () => {
  try {
    await axios.put('https://interappapi.onrender.com/api/notificaciones/leertodas', {},
      { headers: getAuthHeaders() }
    )
    notificaciones.value.forEach(n => n.leida = true)
  } catch (err) {
    console.error('Error al marcar todas:', err)
  }
}

// PUT /api/notificaciones/estado
const responderSolicitud = async (id, estado) => {
  try {
    await axios.put(
      'https://interappapi.onrender.com/api/notificaciones/estado',
      { id, estado },
      { headers: getAuthHeaders() }
    )
    const n = notificaciones.value.find(n => n.id === id)
    if (n) n.estado = estado
  } catch (err) {
    console.error('Error al actualizar solicitud:', err)
  }
}

const unreadCount = computed(() => notificaciones.value.filter(n => !n.leida).length)

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  cargarNotificaciones()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


<template>
  <div ref="dropdownRef" class="relative">
    <!-- Botón campana -->
    <button @click="toggleDropdown" class="relative focus:outline-none transition-colors duration-300">
      <svg :class="['w-7 h-7', dropdownOpen ? 'text-cyan-400' : 'text-[#002C5F]']" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span v-if="unreadCount > 0"
        class="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <transition name="fade-slide">
      <div v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-96 bg-white/80 backdrop-blur-md shadow-xl rounded-xl z-50 overflow-hidden border border-gray-200">
        <div class="p-4 font-semibold border-b text-gray-700">Notificaciones</div>

        <ul class="max-h-96 overflow-y-auto">
          <li v-for="n in notificaciones" :key="n.id" class="px-4 py-3 transition rounded-md cursor-pointer"
            :class="[tipoConfig[n.tipo]?.fondo ?? 'bg-white', n.leida ? 'opacity-60 hover:opacity-80' : 'hover:brightness-95']"
            @click="marcarLeida(n.id)">
            <div class="flex items-start gap-3">
              <component :is="tipoConfig[n.tipo]?.icon" class="w-5 h-5 mt-1"
                :class="[tipoConfig[n.tipo]?.color, !n.leida && 'animate-pulse']" />

              <div class="flex-1">
                <p :class="['text-sm', n.leida ? 'text-gray-700 font-medium' : 'text-blue-900 font-semibold']">
                  {{ n.titulo }}
                </p>
                <p class="text-xs text-gray-500">{{ n.mensaje }}</p>
                <p class="text-[10px] text-right text-gray-400 mt-1">
                  {{ new Date(n.fecha).toLocaleString() }}
                </p>

                <!-- Botones si es solicitud pendiente -->
                <div v-if="n.tipo === 'Solicitud' && n.estado === 0" class="mt-2 flex gap-2">
                  <button @click.stop="responderSolicitud(n.id, 1)"
                    class="px-2 py-1 text-xs text-white bg-green-500 hover:bg-green-600 rounded">Aprobar</button>
                  <button @click.stop="responderSolicitud(n.id, 2)"
                    class="px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded">Denegar</button>
                </div>

                <p v-else-if="n.tipo === 'Solicitud'" class="text-xs italic mt-1 text-gray-600">
                  Estado: {{ n.estado === 1 ? 'Aprobada' : n.estado === 2 ? 'Denegada' : 'Pendiente' }}
                </p>
              </div>
            </div>
          </li>
        </ul>

        <button @click="marcarTodas"
          class="w-full text-sm text-blue-600 hover:bg-gray-50 transition py-2 border-t">Marcar todas como leídas</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 250ms ease;
  transform-origin: top right;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
