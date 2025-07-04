<template>
  <div
    class="w-[96vw] max-w-screen-xl mx-auto mt-8 bg-[#034882] rounded-2xl shadow-md px-12 py-6
           border-[3px] border-cyan-400 flex flex-col"
  >
    <!-- Encabezado -->
    <div class="flex items-center mb-2">
      <svg class="w-6 h-6 mr-2 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
        <rect x="7" y="9" width="10" height="2" rx="1" fill="#b3b3b3" />
        <rect x="7" y="13" width="7" height="2" rx="1" fill="#b3b3b3" />
      </svg>
      <span class="text-white font-semibold text-lg">Noticias</span>
    </div>

    <!-- Loader con Skeleton -->
    <ul v-if="loading">
      <li v-for="n in 3" :key="n" class="flex items-start mb-3 last:mb-0">
        <span class="block w-1 h-7 mt-1 mr-3 rounded bg-white/30"></span>
        <div class="flex flex-col gap-1">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-3 w-[300px]" />
        </div>
      </li>
    </ul>

    <!-- Lista de noticias -->
    <ul v-else-if="noticias.length">
      <li v-for="n in noticias" :key="n.id" class="flex items-start mb-3 last:mb-0">
        <span
          class="block w-1 h-7 mt-1 mr-3 rounded"
          :class="tipoColor(n.tipo)"
        ></span>
        <div>
          <div class="font-bold text-white text-base leading-tight">{{ n.titulo }}</div>
          <div class="text-white text-sm leading-tight">{{ n.descripcion }}</div>
        </div>
      </li>
    </ul>

    <!-- Si no hay noticias -->
    <div v-else class="text-white/80 text-sm">
      No hay noticias por mostrar.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'

interface Noticia {
  id: number
  titulo: string
  descripcion: string
  fechaPublicacion: string
  tipo: string
}

const noticias = ref<Noticia[]>([])
const loading = ref(true)

/**
 * Devuelve la clase de color según el tipo
 */
const tipoColor = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case 'mantenimiento':
    case 'alerta':
      return 'bg-yellow-400'
    case 'evento':
      return 'bg-cyan-400'
    default:
      return 'bg-white/40'
  }
}

const cargarNoticias = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('https://interappapi.onrender.com/api/noticias')
    noticias.value = data
      .sort((a: Noticia, b: Noticia) =>
        new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
      )
      .slice(0, 5)
  } catch (error) {
    console.error('Error cargando noticias:', error)
  } finally {
    loading.value = false
  }
}

onMounted(cargarNoticias)
</script>
