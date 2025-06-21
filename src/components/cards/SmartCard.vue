<!-- components/cards/ShortcutCard.vue -->
<template>
  <AccountCard
    v-if="card.tipo === 'cuenta'"
    :card="card"
    :account="info"
    :colorFondo="card.colorFondo"
  />
  <CreditoCard
    v-else-if="card.tipo === 'credito'"
    :card="card"
    :credito="info"
    :colorFondo="card.colorFondo"
  />
  <AccionCard
    v-else-if="card.tipo === 'accion'"
    :card="card"
    :colorFondo="card.colorFondo"
  />
  <div v-else class="w-[300px] h-[180px] flex items-center justify-center bg-gray-200 rounded-xl text-gray-500">
    Tarjeta no soportada
  </div>
</template>

<script setup>
import AccountCard from './AccountCard.vue'
import CreditoCard from './CreditoCard.vue'
import AccionCard from './AccionCard.vue'

const props = defineProps({
  card: Object,
  info: Object // Para cuenta o crédito (detalle real de la entidad)
})
</script>
