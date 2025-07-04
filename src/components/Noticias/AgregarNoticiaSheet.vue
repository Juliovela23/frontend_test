<template>
  <CustomToast ref="toastRef" />

  <Sheet>
    <!-- Botón trigger: abre el sheet -->
    <SheetTrigger as-child>
      <button type="button"
        class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-1 shadow">
        ＋ Nueva Noticia
      </button>
    </SheetTrigger>

    <!-- Contenido del sheet -->
    <SheetContent side="bottom" class="p-6 space-y-4">
      <SheetHeader>
        <SheetTitle class="text-[#15385c]">Agregar noticia</SheetTitle>
        <SheetDescription>Llena los datos para crear una nueva noticia.</SheetDescription>
      </SheetHeader>

      <div class="space-y-3">
        <div>
          <Label class="text-sm">Título</Label>
          <Input v-model="noticia.titulo" />
          <p v-if="errores.titulo" class="text-xs text-red-500 mt-1">Título requerido.</p>
        </div>

        <div>
          <Label class="text-sm">Descripción</Label>
          <Input v-model="noticia.descripcion" />
        </div>

        <div>
          <Label class="text-sm">Tipo</Label>
          <select v-model="noticia.tipo" class="border rounded w-full px-3 py-2">
            <option value="">Selecciona un tipo</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="evento">Evento</option>
            <option value="otras">Otras</option>
          </select>
        </div>
      </div>

      <SheetFooter class="flex justify-end">
        <Button
          @click="cerrar"
          type="button"
          variant="ghost"
          class="mr-2"
          :disabled="guardando"
        >
          Cancelar
        </Button>
        <Button @click="guardar" :disabled="guardando">
          <span v-if="guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          <span>Guardar noticia</span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import CustomToast from '@/components/Generales/CustomToast.vue'
import Swal from 'sweetalert2'
// Estado interno del sheet
const abierto = ref(false)
const toastRef = ref()
const emit = defineEmits(['guardado'])

const noticia = ref({ titulo: '', descripcion: '', tipo: '' })
const errores = ref({ titulo: false })
const guardando = ref(false)

function showToast(tipo: string, titulo: string, mensaje: string) {
  toastRef.value?.mostrarToast({ tipo, titulo, mensaje })
}

const cerrar = () => {
  abierto.value = false
  noticia.value = { titulo: '', descripcion: '', tipo: '' }
  errores.value = { titulo: false }
}

const guardar = async () => {
  errores.value.titulo = !noticia.value.titulo?.trim()
  if (errores.value.titulo) return

  guardando.value = true

  try {
    await axios.post(
      `https://interappapi.onrender.com/api/noticias`,
      {
        titulo: noticia.value.titulo,
        descripcion: noticia.value.descripcion,
        tipo: noticia.value.tipo,
        fechaPublicacion: new Date().toISOString()
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'La noticia ha sido creada correctamente.',
      confirmButtonText: 'Aceptar'
    })
    //showToast('Success', '✅ Éxito', 'La noticia ha sido creada correctamente.')
    emit('guardado')
    cerrar()
  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la noticia.',
      confirmButtonText: 'Aceptar'
    })
    //showToast('Error', '❌ Error', 'No se pudo guardar la noticia.')
  } finally {
    guardando.value = false
  }
}
</script>
