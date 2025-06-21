<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Todas tus notificaciones</h1>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <select v-model="filtros.tipo" class="border rounded px-3 py-2">
        <option value="">Todos los tipos</option>
        <option value="Notificacion">Notificaciones</option>
        <option value="Solicitud">Solicitudes</option>
      </select>

      <input type="date" v-model="filtros.desde" class="border rounded px-3 py-2" />
      <input type="date" v-model="filtros.hasta" class="border rounded px-3 py-2" />

      <input
        v-model="filtros.buscar"
        type="text"
        placeholder="Buscar por texto..."
        class="border rounded px-3 py-2"
      />
    </div>

    <div v-if="notificaciones.length === 0" class="text-gray-500 text-center py-8">
      No tienes notificaciones por el momento.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="n in notificaciones"
        :key="n.id"
        class="p-4 rounded-lg shadow border transition"
        :class="[tipoConfig[n.tipo]?.fondo ?? 'bg-white']"
      >
        <div class="flex items-start gap-4">
          <component
            :is="tipoConfig[n.tipo]?.icon"
            class="w-6 h-6 mt-1"
            :class="tipoConfig[n.tipo]?.color"
          />
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">{{ n.titulo }}</h2>
              <span class="text-xs text-gray-400">{{ new Date(n.fecha).toLocaleString() }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ n.mensaje }}</p>

            <div v-if="n.tipo === 'Solicitud'" class="mt-3">
              <div v-if="n.estado === 0" class="flex gap-2">
                <button @click="responderSolicitud(n.id, 1)" class="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600">
                  Aprobar
                </button>
                <button @click="responderSolicitud(n.id, 2)" class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                  Denegar
                </button>
              </div>
              <p v-else class="text-sm italic mt-1 text-gray-500">
                Estado: {{ n.estado === 1 ? 'Aprobada' : 'Denegada' }}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Paginación -->
    <div class="flex justify-center items-center gap-2 mt-6" v-if="totalPaginas > 1">
      <button
        @click="paginaActual--"
        :disabled="paginaActual <= 1"
        class="px-3 py-1 rounded border text-sm hover:bg-gray-100 disabled:opacity-50"
      >
        Anterior
      </button>

      <span class="text-sm">Página {{ paginaActual }} de {{ totalPaginas }}</span>

      <button
        @click="paginaActual++"
        :disabled="paginaActual >= totalPaginas"
        class="px-3 py-1 rounded border text-sm hover:bg-gray-100 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import {
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/solid'

const notificaciones = ref([])
const paginaActual = ref(1)
const totalPaginas = ref(1)

const filtros = ref({
  tipo: '',
  desde: '',
  hasta: '',
  buscar: ''
})

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

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const cargarNotificaciones = async () => {
  try {
    const { data } = await axios.get('https://interappapi.onrender.com/api/notificaciones/todas', {
      headers: getAuthHeaders(),
      params: {
        page: paginaActual.value,
        tipo: filtros.value.tipo,
        desde: filtros.value.desde || null,
        hasta: filtros.value.hasta || null,
        buscar: filtros.value.buscar || null
      }
    })
    notificaciones.value = data.datos
    totalPaginas.value = data.totalPaginas
  } catch (err) {
    console.error('Error al cargar notificaciones:', err)
  }
}

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
    console.error('Error al responder solicitud:', err)
  }
}

watch([paginaActual, filtros], cargarNotificaciones, { deep: true })
onMounted(cargarNotificaciones)
</script>
