<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">
        {{ noticia.id ? 'Editar Noticia' : 'Nueva Noticia' }}
      </h2>

      <form @submit.prevent="guardar">
        <input v-model="form.titulo" placeholder="Título" class="border rounded w-full mb-2 px-3 py-2" />
        <textarea v-model="form.descripcion" placeholder="Descripción" class="border rounded w-full mb-2 px-3 py-2"></textarea>
        <select v-model="form.tipo" class="border rounded w-full mb-4 px-3 py-2">
          <option value="">Seleccionar tipo</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="evento">Evento</option>
          <option value="otras">Otras</option>
        </select>

        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('cerrar')" class="px-4 py-2 text-gray-600 underline">Cancelar</button>
          <button type="submit" class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2';

const props = defineProps<{
  noticia: any
}>()
const emit = defineEmits(['cerrar', 'guardado'])

const form = reactive({
  id: 0,
  titulo: '',
  descripcion: '',
  tipo: ''
})

watch(
  () => props.noticia,
  (n) => {
    if (n) {
      form.id = n.id
      form.titulo = n.titulo
      form.descripcion = n.descripcion
      form.tipo = n.tipo
    } else {
      form.id = 0
      form.titulo = ''
      form.descripcion = ''
      form.tipo = ''
    }
  },
  { immediate: true }
)

const guardar = async () => {
  if (form.id) {
    await axios.put(`https://interappapi.onrender.com/api/noticias/${form.id}`, form)
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'La noticia ha sido actualizada correctamente.',
      confirmButtonText: 'Aceptar'
    })
  } else {
    await axios.post('https://interappapi.onrender.com/api/noticias', { ...form, fechaPublicacion: new Date().toISOString() })
    
  }
  emit('guardado')
}
</script>
