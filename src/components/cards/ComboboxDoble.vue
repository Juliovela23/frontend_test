<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const tipos = [
  { value: 'cuenta', label: 'Cuenta' },
  { value: 'credito', label: 'Crédito' },
  { value: 'accion', label: 'Opción General' }
]

// Estado
const tipoSeleccionado = ref('')
const referenciaSeleccionada = ref('')
const opcionesSecundarias = ref<any[]>([])

// Datos estáticos para tipos distintos a cuenta
const opcionesFijas = {
  credito: [
    { value: 'CREDITO_001', label: 'Crédito Vehicular' },
    { value: 'CREDITO_002', label: 'Crédito Hipotecario' }
  ],
  accion: [
    { value: 'ver-saldo', label: 'Ver Saldo' },
    { value: 'transferir', label: 'Transferir' }
  ]
}

// Cargar cuentas desde la API
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

// Reaccionar cuando cambia el tipo
watch(tipoSeleccionado, async (nuevoTipo) => {
  referenciaSeleccionada.value = ''
  if (nuevoTipo === 'cuenta') {
    await cargarCuentas()
  } else {
    opcionesSecundarias.value = opcionesFijas[nuevoTipo] ?? []
  }
})

// Emitir cuando cambie tipo o referencia
watch([tipoSeleccionado, referenciaSeleccionada], () => {
  emit('update:modelValue', {
    tipo: tipoSeleccionado.value,
    referenciaId: referenciaSeleccionada.value
  })
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium block mb-1">Tipo</label>
      <select v-model="tipoSeleccionado" class="w-full border rounded px-3 py-2">
        <option disabled value="">Seleccione tipo...</option>
        <option v-for="tipo in tipos" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
      </select>
    </div>

    <div v-if="opcionesSecundarias.length">
      <label class="text-sm font-medium block mb-1">Referencia</label>
      <select v-model="referenciaSeleccionada" class="w-full border rounded px-3 py-2">
        <option disabled value="">Seleccione una opción...</option>
        <option v-for="item in opcionesSecundarias" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
  </div>
</template>
