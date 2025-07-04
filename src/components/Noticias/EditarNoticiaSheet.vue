<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Sheet, SheetContent, SheetFooter, SheetHeader,
  SheetTitle, SheetDescription, SheetTrigger
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import CustomToast from '@/components/Generales/CustomToast.vue'

const props = defineProps<{ noticiaEditar: any }>()
const emit = defineEmits(['guardado'])

const abierto = ref(false)
const guardando = ref(false)
const toastRef = ref()

const form = ref({
  id: null,
  titulo: '',
  descripcion: '',
  tipo: ''
})

const errores = ref({ titulo: false })

function showToast(tipo: string, titulo: string, mensaje: string) {
  toastRef.value?.mostrarToast({ tipo, titulo, mensaje })
}

// ✅ Usa watch sobre `noticiaEditar` para asegurar sincronía
watch(
  () => props.noticiaEditar,
  (nueva) => {
    if (abierto.value && nueva) {
      form.value = {
        id: nueva.id,
        titulo: nueva.titulo,
        descripcion: nueva.descripcion,
        tipo: nueva.tipo
      }
      errores.value = { titulo: false }
    }
  },
  { immediate: true, deep: true }
)

function onOpenChange(open: boolean) {
  abierto.value = open
  if (open && props.noticiaEditar) {
    form.value = {
      id: props.noticiaEditar.id,
      titulo: props.noticiaEditar.titulo,
      descripcion: props.noticiaEditar.descripcion,
      tipo: props.noticiaEditar.tipo
    }
    errores.value = { titulo: false }
  }
}

const cerrar = () => {
  abierto.value = false
}

const guardar = async () => {
  errores.value.titulo = !form.value.titulo?.trim()
  if (errores.value.titulo) return

  guardando.value = true

  try {
    await axios.put(
      `https://interappapi.onrender.com/api/noticias/${form.value.id}`,
      {
        titulo: form.value.titulo,
        descripcion: form.value.descripcion,
        tipo: form.value.tipo
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    showToast('Success', '✅ Éxito', 'La noticia ha sido actualizada correctamente.')
    emit('guardado')
    cerrar()
  } catch (err) {
    console.error(err)
    showToast('Error', '❌ Error', 'No se pudo actualizar la noticia.')
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <CustomToast ref="toastRef" />

  <Sheet :open="abierto" @update:open="onOpenChange">
    <SheetTrigger as-child>
      <button type="button" class="text-cyan-600 underline text-sm">
        ✏️ Editar
      </button>
    </SheetTrigger>

    <SheetContent side="bottom" class="p-6 space-y-4">
      <SheetHeader>
        <SheetTitle class="text-[#15385c]">Editar noticia</SheetTitle>
        <SheetDescription>Modifica los datos de la noticia seleccionada.</SheetDescription>
      </SheetHeader>

      <div class="space-y-3">
        <div>
          <Label class="text-sm">Título</Label>
          <Input v-model="form.titulo" />
          <p v-if="errores.titulo" class="text-xs text-red-500 mt-1">Título requerido.</p>
        </div>

        <div>
          <Label class="text-sm">Descripción</Label>
          <Input v-model="form.descripcion" />
        </div>

        <div>
          <Label class="text-sm">Tipo</Label>
          <select v-model="form.tipo" class="border rounded w-full px-3 py-2">
            <option value="">Selecciona un tipo</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="evento">Evento</option>
            <option value="otras">Otras</option>
          </select>
        </div>
      </div>

      <SheetFooter class="flex justify-end">
        <Button @click="cerrar" type="button" variant="ghost" class="mr-2" :disabled="guardando">
          Cancelar
        </Button>
        <Button @click="guardar" :disabled="guardando">
          <span v-if="guardando"
            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          <span>Guardar cambios</span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
