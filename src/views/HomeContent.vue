<template>
  <div class="flex-1 p-4 pt-0 space-y-4">
    <!-- Loader -->
    <div v-if="loading">
      <div v-if="loaderType === 'spinner'" class="flex items-center justify-center min-h-[200px] w-full">
        <svg class="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A8 8 0 104 12z" />
        </svg>
        <span class="ml-4 text-lg text-cyan-800">Cargando tarjetas...</span>
      </div>
      <div v-else-if="loaderType === 'skeleton'"
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 my-8">
        <div v-for="n in 3" :key="n" class="bg-gray-200 rounded-xl shadow-md h-[180px] w-[300px] animate-pulse"></div>
      </div>
    </div>

    <!-- Cards y contenido -->
    <div v-else>
      <draggable v-model="cards" item-key="id" handle=".drag-handle" animation="250" ghost-class="opacity-40"
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" @end="actualizarOrden">
        <template #item="{ element }">
          <div class="drag-handle cursor-move">
            <AccountCard :card="element" :account="infoCards[element.referenciaId] ?? null"
              :colorFondo="element.colorFondo" />
          </div>
        </template>
      </draggable>
      <br>
      <SheetForm @created="fetchCards" />
    </div>

    <NoticiasCard class="w-full max-w-screen-lg mx-auto mt-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AccountCard from '../components/cards/AccountCard.vue'
import SheetForm from '../components/cards/SheetForm.vue'
import NoticiasCard from '../components/NoticiasCard.vue'
import draggable from 'vuedraggable'
import axios from 'axios'
import { useToast } from '@/components/ui/toast'
const { toast } = useToast()
const loaderType = ref<'spinner' | 'skeleton'>('spinner')
const loading = ref(false)
const error = ref('')
const cards = ref<any[]>([])
const infoCards = ref<Record<string, any>>({})

async function obtenerDatosCard(card: any) {
  const token = localStorage.getItem('token')
  try {
    if (card.tipo?.toLowerCase() === 'cuenta') {
      const { data } = await axios.get(
        `https://interappapi.onrender.com/api/cuentas/buscar-cuenta?numCuenta=${encodeURIComponent(card.referenciaId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return data
    }
    return null
  } catch (e) {
    return null
  }
}

async function fetchCards() {
  try {
    loading.value = true
    error.value = ''
    const token = localStorage.getItem('token')
    const { data } = await axios.get('https://interappapi.onrender.com/api/shortcuts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const infos = await Promise.all(
      data.map(async (card: any) => {
        let info = null
        if (card.tipo?.toLowerCase() === 'cuenta') {
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

async function actualizarOrden() {
  cards.value.forEach((card, index) => {
    card.orden = index
  })

  try {
    const token = localStorage.getItem('token')
    await axios.post('https://interappapi.onrender.com/api/shortcuts/reordenar',
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

const usaCarrusel = computed(() => cards.value.length > 8)
</script>
