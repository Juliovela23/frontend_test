<template>
  <div class="p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-[#034882] mb-6">Panel Administrativo de Noticias</h1>

    <AgregarNoticiaSheet @guardado="refrescarNoticias" />


    <!-- Tabla -->
    <NoticiasTable
      :noticias="noticias"
      @editar="abrirFormulario"
      @eliminar="eliminarNoticia"
    />

    <!-- Formulario para editar -->
    <NoticiasForm
      v-if="mostrarFormulario"
      :noticia="noticiaSeleccionada"
      @cerrar="cerrarFormulario"
      @guardado="refrescarNoticias"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NoticiasTable from '@/components/Noticias/NoticiasTable.vue'
import NoticiasForm from '@/components/Noticias/NoticiasForm.vue'
import AgregarNoticiaSheet from '@/components/Noticias/AgregarNoticiaSheet.vue'

// Estado del modal para agregar noticia
const showAgregarNoticia = ref(false)

interface Noticia {
  id: number
  titulo: string
  descripcion: string
  tipo: string
  fechaPublicacion: string
}

const noticias = ref<Noticia[]>([])
const mostrarFormulario = ref(false)
const noticiaSeleccionada = ref<Noticia | null>(null)

const cargarNoticias = async () => {
  const { data } = await axios.get('https://interappapi.onrender.com/api/noticias')
  noticias.value = data
}

const abrirFormulario = (noticia: Noticia | null = null) => {
  noticiaSeleccionada.value = noticia
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  noticiaSeleccionada.value = null
}

// 🔑 Aquí NO cierres showAgregarNoticia — el Sheet lo hace solo
const refrescarNoticias = () => {
  cerrarFormulario()
  cargarNoticias()
}

const eliminarNoticia = async (id: number) => {
  if (!confirm('¿Seguro de eliminar?')) return
  await axios.delete(`https://interappapi.onrender.com/api/noticias/${id}`)
  cargarNoticias()
}

onMounted(cargarNoticias)
</script>
