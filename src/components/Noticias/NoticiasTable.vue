<template>
  <table class="w-full text-left border border-gray-200">
    <thead class="bg-[#034882] text-white">
      <tr>
        <th class="px-4 py-2">Título</th>
        <th class="px-4 py-2">Descripción</th>
        <th class="px-4 py-2">Tipo</th>
        <th class="px-4 py-2">Acciones</th>
      </tr>
    </thead>

    <tbody v-if="loading">
      <tr v-for="i in 5" :key="i" class="border-b">
        <td class="px-4 py-2"><Skeleton class="h-4 w-[150px]" /></td>
        <td class="px-4 py-2"><Skeleton class="h-4 w-[300px]" /></td>
        <td class="px-4 py-2"><Skeleton class="h-4 w-[100px]" /></td>
        <td class="px-4 py-2 flex gap-2">
          <Skeleton class="h-4 w-[60px]" />
          <Skeleton class="h-4 w-[60px]" />
        </td>
      </tr>
    </tbody>

    <tbody v-else>
      <tr v-for="n in noticias" :key="n.id" class="border-b">
        <td class="px-4 py-2">{{ n.titulo }}</td>
        <td class="px-4 py-2">{{ n.descripcion }}</td>
        <td class="px-4 py-2">{{ n.tipo }}</td>
        <td class="px-4 py-2 flex gap-2">
          <button
            @click="$emit('editar', n)"
            class="text-cyan-600 underline text-sm"
          >✏️ Editar</button>
          <button
            @click="$emit('eliminar', n.id)"
            class="text-red-500 underline"
          >Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { defineProps, defineEmits, ref, watchEffect } from 'vue'

const props = defineProps<{ noticias: any[] }>()
defineEmits(['editar', 'eliminar'])

// Estado de loading dinámico: true mientras noticias vacías
const loading = ref(true)

watchEffect(() => {
  loading.value = props.noticias.length === 0
})
</script>
