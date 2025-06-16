<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

// Simulaciones de datos
const tipos = [
  { value: 'cuenta', label: 'Cuenta' },
  { value: 'credito', label: 'Crédito' },
  { value: 'accion', label: 'Opción General' }
]

const data = {
  cuenta: [
    { value: 'CUENTA_001', label: 'Cuenta Ahorro' },
    { value: 'CUENTA_002', label: 'Cuenta Nómina' }
  ],
  credito: [
    { value: 'CREDITO_001', label: 'Crédito Vehicular' },
    { value: 'CREDITO_002', label: 'Crédito Hipotecario' }
  ],
  accion: [
    { value: 'ver-saldo', label: 'Ver Saldo' },
    { value: 'transferir', label: 'Transferir' }
  ]
}

// Estado interno local
const tipoSeleccionado = ref('')
const referenciaSeleccionada = ref('')

// Computa opciones secundarias según tipo
const opcionesSecundarias = computed(() => {
  return tipoSeleccionado.value ? data[tipoSeleccionado.value] : []
})

// Emitir cuando cambia cualquiera
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
