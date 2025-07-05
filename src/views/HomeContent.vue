<template>
  <div class="flex-1 p-4 pt-0 space-y-4">
    <!-- Loader -->
    <div v-if="loading">
      <!-- 🌀 Spinner clásico -->
      <div v-if="loaderType === 'spinner'" class="flex items-center justify-center min-h-[200px] w-full">
        <svg class="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A8 8 0 104 12z" />
        </svg>
        <span class="ml-4 text-lg text-cyan-800">Cargando tarjetas...</span>
      </div>

      <!-- ✅ Skeleton Cards usando shadcn-vue -->
      <div v-else-if="loaderType === 'skeleton'"
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 my-8">
        <div  v-for="n in 4" :key="n" class="w-[300px] h-[180px] rounded-xl shadow-md p-4 flex flex-col justify-between">
          <div class="space-y-2">
            <Skeleton class="h-4 w-[150px]" />
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-4 w-[120px]" />
          </div>
          <div class="flex justify-between gap-2 mt-4">
            <Skeleton class="h-8 w-[100px] rounded" />
            <Skeleton class="h-8 w-[100px] rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Cards y contenido -->
    <div v-else>
      <draggable v-model="cards" item-key="id" handle=".drag-handle" animation="250" ghost-class="opacity-40"
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" @end="actualizarOrden">
        <template #item="{ element }">
          <div  v-if="element.activo" class="drag-handle cursor-move">
            <SmartCard :card="element" :info="infoCards[element.referenciaId]" :colorFondo="element.colorFondo" />
          </div>
        </template>
      </draggable>

      <br />
      <SheetForm @created="fetchCards" />
      <div class="flex justify-end mt-4">
        <button @click="router.push('/dashboard/admin-accesos')" role="button" aria-label="Administrar accesos directos"
          class="inline-flex items-center gap-2 px-4 py-2 border border-[#15385c] text-[#15385c] rounded-full transition hover:bg-[#15385c] hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Administrar accesos directos
        </button>
      </div>


    </div>


    <!-- Noticias al final -->
    <NoticiasCard class="w-full max-w-screen-lg mx-auto mt-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import draggable from 'vuedraggable'
import SmartCard from '@/components/cards/SmartCard.vue'
import SheetForm from '../components/cards/SheetForm.vue'
import NoticiasCard from '../components/NoticiasCard.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'vue-router'
const router = useRouter()

function irAdminAccesos() {
  router.push({ name: 'AdminAccesos' })
}

const { toast } = useToast()

// Loader
const loaderType = ref<'spinner' | 'skeleton'>('skeleton')
const loading = ref(false)
const error = ref('')
const cards = ref<any[]>([])
const infoCards = ref<Record<string, any>>({})

// 🗂️ Obtener info específica según tipo
async function obtenerDatosCard(card) {
  const token = localStorage.getItem('token')
  try {
    if (card.tipo === 'cuenta' && card.referenciaId) {
      const { data } = await axios.get(
        `https://interappapi.onrender.com/api/cuentas/buscar-cuenta?numCuenta=${encodeURIComponent(card.referenciaId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return data
    }
    if (card.tipo === 'credito' && card.referenciaId) {
      const { data } = await axios.get(
        `https://interappapi.onrender.com/api/creditos/buscar-credito?codigo=${encodeURIComponent(card.referenciaId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return data
    }
    return null
  } catch (e) {
    return null
  }
}

// 📥 Fetch general
async function fetchCards() {
  try {
    loading.value = true
    error.value = ''
    const token = localStorage.getItem('token')
    const { data } = await axios.get('https://interappapi.onrender.com/api/shortcuts', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Normaliza tipo a minúscula
    data.forEach(card => {
      card.tipo = card.tipo?.toLowerCase() || ''
    })

    const infos = await Promise.all(
      data.map(async (card) => {
        let info = null
        if (card.tipo === 'cuenta' || card.tipo === 'credito') {
          info = await obtenerDatosCard(card)
        }
        return { key: card.referenciaId, info }
      })
    )

    cards.value = data
    infoCards.value = {}
    for (const { key, info } of infos) {
      if (key) infoCards.value[key] = info
    }
  } catch (e) {
    error.value = 'No se pudieron cargar tus accesos directos'
    cards.value = []
    infoCards.value = {}
  } finally {
    loading.value = false
  }
}

// 🔃 Reordenar
async function actualizarOrden() {
  cards.value.forEach((card, index) => {
    card.orden = index
  })

  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'https://interappapi.onrender.com/api/shortcuts/reordenar',
      cards.value.map(c => ({ id: c.id, orden: c.orden })),
      { headers: { Authorization: `Bearer ${token}` } }
    )

    toast({
      title: '✅ Orden actualizado',
      description: 'Tus tarjetas fueron reordenadas exitosamente.',
      variant: 'success'
    })
  } catch (e) {
    toast({
      title: 'Error al guardar orden',
      description: 'Ocurrió un problema al actualizar el orden de tus tarjetas.',
      variant: 'destructive'
    })
    console.error('Error al actualizar orden:', e)
  }
}

onMounted(fetchCards)
</script>
