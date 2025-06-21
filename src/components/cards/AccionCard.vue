<template>
  <div
    class="w-[300px] h-[180px] rounded-xl shadow-md border-2 p-4 flex flex-col justify-between transition-transform duration-200 hover:scale-105 group"
    :style="{ backgroundColor: colorFondo || '#30c6dd', borderColor: colorBorde }"
  >
    <!-- LABEL ARRIBA -->
    <div class="flex justify-center mb-1">
      <span
        class="px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow text-white"
        :style="{ backgroundColor: colorLabel }"
      >
        {{ card?.accionLabel?.toUpperCase() || 'ACCIÓN RÁPIDA' }}
      </span>
    </div>
    <!-- CONTENIDO CENTRAL (icono+titulo) -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center shadow-xl mb-1"
        :style="{ background: colorCircle, boxShadow: glowShadow }"
      >
        <i :class="iconClass" class="text-2xl text-white drop-shadow" />
      </div>
      <div class="text-white text-base font-bold text-center leading-tight drop-shadow">
        {{ card?.tituloPersonalizado ?? 'Acción rápida' }}
      </div>
    </div>
    <!-- BOTÓN ABAJO, más compacto -->
    <div class="flex justify-center mt-1">
      <button
        class="w-full text-base font-bold text-white bg-cyan-500 px-3 py-1.5 rounded-lg shadow transition-all duration-150 hover:bg-cyan-600"
        @click="accionRapida"
      >
        <i v-if="card?.accionIcon" :class="card.accionIcon" class="mr-2"></i>
        {{ card?.accionLabel || 'Ir' }}
      </button>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'

const props = defineProps({
    card: Object,
    colorFondo: String
})

// Mapeo de color para cada acción
const colores = {
    transferencias: { circle: '#06b6d4', label: '#0891b2', border: '#06b6d4', glow: '0 0 18px 4px #06b6d477' },
    creditos: { circle: '#fbbf24', label: '#f59e42', border: '#fbbf24', glow: '0 0 18px 4px #fbbf2477' },
    cuentas: { circle: '#10b981', label: '#059669', border: '#10b981', glow: '0 0 18px 4px #10b98177' },
    servicios: { circle: '#f472b6', label: '#be185d', border: '#f472b6', glow: '0 0 18px 4px #f472b677' },
    estados: { circle: '#818cf8', label: '#4f46e5', border: '#818cf8', glow: '0 0 18px 4px #818cf877' },
    default: { circle: '#334155', label: '#64748b', border: '#ffe066', glow: '0 0 18px 4px #64748b77' }
}

// Elegir color según la acción (por key, en minúsculas)
const colorKey = computed(() => {
    return props.card?.accion?.toLowerCase() || 'default'
})
const colorCircle = computed(() => colores[colorKey.value]?.circle || colores.default.circle)
const colorLabel = computed(() => colores[colorKey.value]?.label || colores.default.label)
const colorBorde = computed(() => colores[colorKey.value]?.border || colores.default.border)
const glowShadow = computed(() => colores[colorKey.value]?.glow || colores.default.glow)

// Íconos para cada acción
const iconosAccion = {
    transferencias: 'fas fa-exchange-alt',
    creditos: 'fas fa-piggy-bank',
    cuentas: 'fas fa-wallet',
    servicios: 'fas fa-bolt',
    estados: 'fas fa-file-invoice-dollar',
    default: 'fas fa-bolt'
}
const iconClass = computed(() => {
    if (props.card?.icono) {
        // Si no incluye el prefijo, agrégalo
        return props.card.icono.startsWith('fa-') ? `fas ${props.card.icono}` : props.card.icono
    }
    if (!props.card?.accion) return iconosAccion.default
    const key = props.card.accion.toLowerCase()
    return iconosAccion[key] || iconosAccion.default
})


function accionRapida() {
    // Si es navegación interna
    if (props.card?.referenciaId) {
        window.location.href = props.card.referenciaId
    } else {
        alert(`Acción rápida: ${props.card?.accion ?? ''}`)
    }
}
</script>
