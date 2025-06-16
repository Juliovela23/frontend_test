<template>
  <div
    class="w-[96vw] max-w-screen-xl mx-auto mt-8 bg-[#034882] rounded-2xl shadow-md px-12 py-6
           border-[3px] border-cyan-400 flex flex-col"
  >
    <div class="flex items-center mb-2">
      <svg class="w-6 h-6 mr-2 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor"/>
        <rect x="7" y="9" width="10" height="2" rx="1" fill="#b3b3b3"/>
        <rect x="7" y="13" width="7" height="2" rx="1" fill="#b3b3b3"/>
      </svg>
      <span class="text-white font-semibold text-lg">Noticias</span>
    </div>
    <ul>
      <li v-for="(n, i) in noticias" :key="n.id" class="flex items-start mb-3 last:mb-0">
        <span
          class="block w-1 h-7 mt-1 mr-3 rounded bg-yellow-400"
          v-if="i === 0"
        ></span>
        <span
          class="block w-1 h-7 mt-1 mr-3 rounded bg-cyan-400"
          v-else-if="i === 1"
        ></span>
        <span
          class="block w-1 h-7 mt-1 mr-3 rounded bg-white/40"
          v-else
        ></span>
        <div>
          <div class="font-bold text-white text-base leading-tight">{{ n.titulo }}</div>
          <div class="text-white text-sm leading-tight">{{ n.descripcion }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// Noticias ficticias de prueba
const noticias = ref([
  {
    id: 1,
    titulo: "Mantenimiento programado",
    descripcion: "La plataforma estará fuera de servicio el 5 de junio de 1:00am a 3:00am.",
    tipo: "alerta"
  },
  {
    id: 2,
    titulo: "Evento por el día del padre",
    descripcion: "Se invita a todos los asociados a un evento organizado por Intercop para los padres.",
    tipo: "evento"
  },
  {
    id: 3,
    titulo: "Otras noticias",
    descripcion: "Noticias x",
    tipo: "info"
  }
])
</script>
