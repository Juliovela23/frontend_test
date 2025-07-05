<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'

// Props: recibe tipo actual y el valor de referenciaId
const props = defineProps<{
  tipo: string
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

// === Estado ===
const referenciaSeleccionada = ref(props.modelValue)
const opcionesSecundarias = ref<any[]>([])

const opcionesFijas = {
  credito: [
    { value: 'CREDITO_001', label: 'Crédito Vehicular' },
    { value: 'CREDITO_002', label: 'Crédito Hipotecario' }
  ]
}

// 🔑 Sincroniza cuando el padre cambie
watch(() => props.modelValue, (val) => {
  referenciaSeleccionada.value = val || ''
})

// Emitir hacia el padre cuando cambia localmente
watch(referenciaSeleccionada, () => {
  emit('update:modelValue', referenciaSeleccionada.value)
})

// === Cargar cuentas dinámicas ===
async function cargarCuentas() {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get('https://interappapi.onrender.com/api/cuentas/mis-cuentas', {
      headers: { Authorization: `Bearer ${token}` }
    })

    opcionesSecundarias.value = data.map((cuenta: any) => ({
      value: cuenta.noCuenta,
      label: `${cuenta.noCuenta} - ${cuenta.nombreCuenta}`
    }))
  } catch (error) {
    console.error('Error al cargar cuentas:', error)
    opcionesSecundarias.value = []
  }
}

// === Reaccionar cuando cambia tipo ===
watch(() => props.tipo, async (nuevoTipo) => {
  // 👉 Guarda valor anterior para no perderlo
  const valorAnterior = referenciaSeleccionada.value || props.modelValue || ''
  referenciaSeleccionada.value = ''

  if (nuevoTipo === 'cuenta') {
    await cargarCuentas()
  } else if (nuevoTipo === 'credito') {
    opcionesSecundarias.value = opcionesFijas.credito
  } else {
    opcionesSecundarias.value = []
  }

  // ✅ Reasigna si el valor existe en opciones
  if (opcionesSecundarias.value.find(o => o.value === valorAnterior)) {
    referenciaSeleccionada.value = valorAnterior
  }
}, { immediate: true })
</script>

<template>
  <div v-if="opcionesSecundarias.length" class="space-y-4">
    <div>
      <label class="text-sm font-medium block mb-1">Referencia</label>
      <select v-model="referenciaSeleccionada" class="w-full border rounded px-3 py-2">
        <option disabled value="">Seleccione una opción...</option>
        <option v-for="item in opcionesSecundarias" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
  </div>
</template>
