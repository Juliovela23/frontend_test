<script setup>
import { ref } from "vue";

const pupilaX = ref(12); // Centro inicial (SVG 24x24)
const pupilaY = ref(12);
const radio = 3;

// Cuando el mouse se mueve sobre el ojo:
function moverPupila(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left; // posición dentro del SVG
  const y = e.clientY - rect.top;
  // Centro del ojo: 12,12 (SVG 24x24), limitamos movimiento de la pupila
  const dx = x - 12;
  const dy = y - 12;
  const distancia = Math.min(Math.sqrt(dx * dx + dy * dy), 4); // Máx 4px
  const angulo = Math.atan2(dy, dx);
  pupilaX.value = 12 + Math.cos(angulo) * distancia;
  pupilaY.value = 12 + Math.sin(angulo) * distancia;
}

// Al salir, vuelve la pupila al centro
function resetPupila() {
  pupilaX.value = 12;
  pupilaY.value = 12;
}
</script>

<template>
  <svg
    class="w-12 h-12 cursor-pointer transition-transform hover:scale-110"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    @mousemove="moverPupila"
    @mouseleave="resetPupila"
    style="background: transparent"
  >
    <!-- Contorno del ojo -->
    <ellipse cx="12" cy="12" rx="10" ry="7" stroke="white" fill="#111827" />
    <!-- Pupila que sigue el cursor -->
    <circle
      :cx="pupilaX"
      :cy="pupilaY"
      :r="radio"
      fill="#fff"
      stroke="#000"
      stroke-width="1"
    />
  </svg>
</template>
