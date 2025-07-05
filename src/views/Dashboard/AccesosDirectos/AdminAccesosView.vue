<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Encabezado -->
    <h1 class="text-3xl font-bold text-[#15385c] mb-2">
      Administrar accesos directos
    </h1>
    <p class="text-gray-500 mb-6 text-sm">
      Organiza, edita o elimina tus accesos directos fácilmente.
    </p>

    <!-- Skeleton loader -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 4" :key="n"
        class="flex justify-between items-center p-4 border border-gray-200 rounded-xl shadow animate-pulse bg-white">
        <div class="flex items-center gap-3">
          <Skeleton class="h-5 w-5 rounded-full" />
          <div class="space-y-1">
            <Skeleton class="h-4 w-32 rounded" />
            <Skeleton class="h-3 w-20 rounded" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Skeleton class="h-8 w-16 rounded" />
          <Skeleton class="h-8 w-16 rounded" />
          <Skeleton class="h-8 w-20 rounded" />
        </div>
      </div>
    </div>

    <!-- Lista draggable -->
    <draggable v-else v-model="tarjetas" item-key="id" @end="guardarOrden" class="space-y-4">
      <template #item="{ element }">
        <div
          class="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center gap-3">
            <!-- Icono drag -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 cursor-move" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01M8 8h.01M12 8h.01M16 8h.01" />
            </svg>

            <div>
              <p class="font-semibold text-[#15385c]">{{ element.tituloPersonalizado }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ element.tipo }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <label class="inline-flex items-center gap-1 text-sm text-gray-600">
              <NeonToggle v-model="element.activo" @change="guardarCambio(element)" />

              Activo
            </label>

            <button
              class="px-3 py-1 text-sm text-white bg-[#15385c] rounded-md hover:bg-[#0e2c47] transition"
              @click="abrirEditar(element)">
              Editar
            </button>

            <button
              class="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
              @click="eliminarCard(element)">
              Eliminar
            </button>
          </div>
        </div>
      </template>
    </draggable>

    <!-- Botón agregar -->
    <button class="mt-6 inline-block px-4 py-2 bg-[#15385c] text-white rounded-md hover:bg-[#0e2c47] transition"
      @click="abrirCrear">
      + Agregar acceso directo
    </button>

    <!-- Modal -->
    <CustomAccesoModal v-if="modalVisible" :tarjeta="tarjetaSeleccionada" @cerrar="cerrarModal"
      @guardado="refrescar" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import axios from 'axios'
import CustomAccesoModal from '@/components/cards/CustomAccesoModal.vue'
import Swal from 'sweetalert2'
import { Skeleton } from '@/components/ui/skeleton'
import NeonToggle from '@/components/Dashboard/NeonToggle.vue'
// Estado
const tarjetas = ref([])
const loading = ref(false)
const modalVisible = ref(false)
const tarjetaSeleccionada = ref(null)

// Obtener tarjetas con loader
async function cargarTarjetas() {
  loading.value = true
  const token = localStorage.getItem('token')
  const { data } = await axios.get('https://interappapi.onrender.com/api/shortcuts', {
    headers: { Authorization: `Bearer ${token}` }
  })
  tarjetas.value = data.sort((a, b) => a.orden - b.orden)
  loading.value = false
}

function abrirCrear() {
  tarjetaSeleccionada.value = null
  modalVisible.value = true
}

function abrirEditar(card) {
  tarjetaSeleccionada.value = { ...card }
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
}

async function eliminarCard(card) {
  const result = await Swal.fire({
    title: '¿Eliminar acceso?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (result.isConfirmed) {
    const token = localStorage.getItem('token')
    await axios.delete(`https://interappapi.onrender.com/api/shortcuts/${card.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    cargarTarjetas()
    Swal.fire('Eliminado', 'El acceso ha sido eliminado.', 'success')
  }
}

async function guardarCambio(card) {
  const token = localStorage.getItem('token')
  await axios.patch(
    `https://interappapi.onrender.com/api/shortcuts/${card.id}/toggle-activo`,
    JSON.stringify(card.activo),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )
  Swal.fire({
    icon: 'success',
    title: 'Cambio guardado',
    text: `El acceso directo "${card.tituloPersonalizado}" ha sido ${card.activo ? 'activado' : 'desactivado'}.`
  })
}

async function guardarOrden() {
  const token = localStorage.getItem('token')
  const payload = tarjetas.value.map((card, index) => ({
    id: card.id,
    orden: index + 1
  }))
  await axios.post(`https://interappapi.onrender.com/api/shortcuts/reordenar`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

function refrescar() {
  cerrarModal()
  cargarTarjetas()
}

onMounted(() => {
  cargarTarjetas()
})
</script>

<style scoped>
/* Puedes personalizar más aquí si quieres */
</style>
