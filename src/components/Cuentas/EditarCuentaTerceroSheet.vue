<!-- components/Cuentas/EditarCuentaTerceroSheet.vue -->
<template>
  <Sheet v-model:open="abierto">
    <SheetContent side="bottom" class="p-6 space-y-4">
      <SheetHeader>
        <SheetTitle class="text-[#15385c]">Editar cuenta</SheetTitle>
        <SheetDescription>Actualiza los datos de la cuenta seleccionada.</SheetDescription>
      </SheetHeader>

      <div class="space-y-3">
        <div>
          <Label class="text-sm">Alias</Label>
          <Input v-model="cuenta.aliasCuenta" />
          <p v-if="errores.alias" class="text-xs text-red-500 mt-1">Alias requerido.</p>
        </div>

        <div>
          <Label class="text-sm">Razón agregada</Label>
          <Input v-model="cuenta.razonAgregada" />
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="cuenta.estado" :true-value="1" :false-value="0" id="estado-cuenta" />
          <Label for="estado-cuenta">Cuenta activa</Label>
        </div>
      </div>

      <SheetFooter>
        <Button @click="guardar" :disabled="guardando">
          <span v-if="guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          <span>Guardar cambios</span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
  <CustomToast ref="toastRef" />

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import CustomToast from '@/components/Generales/CustomToast.vue'
const toastRef = ref()
const abierto = ref(false)
const cuenta = ref({ aliasCuenta: '', razonAgregada: '', estado: 1, id: null })
const errores = ref({ alias: false })
const guardando = ref(false)
const emit = defineEmits(['update:modelValue', 'guardado'])

const props = defineProps<{
  modelValue: boolean
  cuentaEditar: any
}>()



function showToast(tipo: string, titulo: string, mensaje: string) {
  toastRef.value?.mostrarToast({
    tipo,
    titulo,
    mensaje
  })
}
// Sincronizar apertura del Sheet con modelValue
watch(
  () => [props.modelValue, props.cuentaEditar],
  ([abiertoAhora, cuentaActual]) => {
    abierto.value = abiertoAhora

    if (abiertoAhora && cuentaActual) {
      // Forzar una copia limpia de los datos
      cuenta.value = {
        id: cuentaActual.id,
        aliasCuenta: cuentaActual.aliasCuenta ?? '',
        razonAgregada: cuentaActual.razonAgregada ?? '',
        estado: cuentaActual.estado ?? 1
      }
      errores.value = { alias: false }
    }
  },
  { immediate: true }
)


const guardar = async () => {
  // Validación
  errores.value.alias = !cuenta.value.aliasCuenta?.trim()
  if (errores.value.alias) return

  if (!cuenta.value.id) {
    alert('ID de cuenta no válido.')
    return
  }

  guardando.value = true

  try {
    await axios.put(
      `https://interappapi.onrender.com/api/cuentas-terceros/${cuenta.value.id}`,
      {
        aliasCuenta: cuenta.value.aliasCuenta,
        razonAgregada: cuenta.value.razonAgregada,
        estado: cuenta.value.estado
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    showToast('Succes', 'Exito', 'Su cuenta ha sido actualizada correctamente.')

    // Emitir al padre para refrescar datos
    emit('guardado', { ...cuenta.value })

    // Cerrar modal
    abierto.value = false
  } catch (err) {
    console.error(err)
    alert('Error al guardar cambios.')
  } finally {
    guardando.value = false
  }
}
</script>
