<!-- src/components/cards/CreditoCard.vue -->
<template>
  <div class="w-[300px] h-[180px] rounded-xl shadow-md p-4 flex flex-col justify-between" :style="{ backgroundColor: colorFondo }">
    <div class="flex justify-between items-center">
      <div>
        <p class="font-semibold text-lg mb-1">{{ card?.tituloPersonalizado || 'Crédito' }}</p>
        <p class="text-xs font-bold">Código: {{ credito?.codigo ?? '---' }}</p>
        <p class="text-pink-700 text-xs font-semibold">Desembolsado: Q {{ credito?.desembolsado?.toFixed(2) ?? '--' }}</p>
      </div>
      <div>
        <span class="bg-white/80 text-cyan-900 text-xs px-3 py-1 rounded-full font-bold">
          {{ credito?.estado ?? '---' }}
        </span>
      </div>
    </div>
    <div class="flex justify-between mt-2 text-xs">
      <div>
        Interés<br />
        <span class="font-bold">Q {{ credito?.interes ?? '--' }}</span>
      </div>
      <div>
        Próximo pago<br />
        <span class="font-bold">{{ credito?.proximoPago ?? '--' }}</span>
      </div>
      <div>
        Cuotas<br />
        <span class="font-bold">{{ credito?.cuotas ?? '--' }}</span>
      </div>
    </div>
    <button class="bg-cyan-400 text-white px-3 py-1 rounded mt-3 w-full" @click="verDetalle">
      Ver detalle
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  card: Object,
  credito: Object,
  colorFondo: String
})
function verDetalle() {
  // Aquí navegas o abres modal de detalle de crédito
  alert(`Ver detalle del crédito: ${props.credito?.codigo ?? ''}`)
}
</script>
