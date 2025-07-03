<template>
  <div ref="cardRef"
    class="w-[300px] h-[180px] rounded-xl shadow-md text-white p-4 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300"
    :style="{ backgroundColor: colorFondo }" @mousemove="onCardMouseMove" @mouseleave="resetPupila">
    <div class="flex justify-between items-start">
      <div>
        <p class="font-semibold text-lg">{{ card?.tituloPersonalizado }}</p>
        <p class="text-sm opacity-90">{{ account?.noCuenta ?? '---' }}</p>
        <p class="text-sm opacity-90">{{ account?.nombreCuenta ?? '---' }}</p>
      </div>
      <div class="flex items-center gap-1">
        <div
          class="bg-yellow-400 text-black px-2 py-1 rounded font-semibold text-sm min-w-[90px] text-center transition-all duration-300"
          :class="{ 'blur-sm select-none': oculto }">
          {{ oculto ? 'Q ••••••' : `Q ${tweened.number.toFixed(2)}` }}
        </div>
        <div>
          <!-- OJO ANIMADO cuando el saldo está oculto -->
          <svg v-if="oculto" xmlns="http://www.w3.org/2000/svg" @click="handleMostrarSaldo"
            class="w-8 h-8 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="background: transparent">
            <ellipse cx="12" cy="12" rx="10" ry="7" stroke="white" fill="#111827" />
            <circle :cx="pupilaX" :cy="pupilaY" :r="radio" fill="#fff" stroke="#000" stroke-width="1" />
          </svg>

          <!-- OJO CERRADO cuando el saldo está visible -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" @click="handleOcultarSaldo"
            class="w-8 h-8 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="background: transparent">
            <!-- Ojo cerrado: solo una curva suave -->
            <path d="M4 12 Q12 16 20 12" stroke="white" stroke-width="2.5" fill="none" />
            <path d="M4 12 Q12 8 20 12" stroke="#888" stroke-width="1" fill="none" opacity="0.5" />
          </svg>
        </div>


      </div>
    </div>

    <div class="mt-4 flex justify-between gap-2">
      <button class="bg-cyan-400 text-white px-3 py-1 rounded w-full" @click="handleTransferencia">
        Transferencia
      </button>
      <button class="bg-pink-500 text-white px-3 py-1 rounded w-full" @click="handleHistorial">
        Historial
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
const props = defineProps({
  card: Object,
  account: Object,
  colorFondo: String
})
const router = useRouter()
const number = ref(0)
const tweened = reactive({
  number: 0
})
watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
function handleTransferencia() {
  if (props.account?.id) {
    router.push({
      name: 'DashboardTransferencias', // 👈 Usa el name de tu ruta hija
      query: { cuentaId: props.account.id }
    })
  }
}

function handleHistorial() {
  if (props.account?.id) {
    router.push({
      name: 'DashboardEstadoCuenta', // 👈 Usa el name de tu ruta hija
      query: { cuentaId: props.account.id }
    })
  }
}

const oculto = ref(true)

// Ref para el card
const cardRef = ref(null)

// Lógica para ojo animado
const pupilaX = ref(12)
const pupilaY = ref(12)
const radio = 3

function onCardMouseMove(e) {
  if (!oculto.value) return; // Solo animar cuando está oculto

  // Obtenemos el bounding del card
  const cardRect = cardRef.value.getBoundingClientRect()

  // Coordenadas del ojo DENTRO DEL CARD (ajusta si mueves el ojo de lugar)
  // El SVG del ojo está al final de la fila, así que busca su centro:
  // Por ejemplo, si el ojo está a 270px (card ancho - margen derecho - 24px de svg), puedes ajustar:
  // Pero para simplificar, obtenemos el SVG del ojo:
  const ojoCenter = {
    x: cardRect.left + cardRect.width - 32, // 32px del borde derecho (ajusta si cambias tamaño del SVG)
    y: cardRect.top + 28                   // 28px desde arriba (ajusta según layout)
  }

  // Ahora, posición del mouse relativo al centro del ojo
  const x = e.clientX - ojoCenter.x
  const y = e.clientY - ojoCenter.y

  // Limita el rango de la pupila (dentro del SVG)
  const distancia = Math.min(Math.sqrt(x * x + y * y), 4)
  const angulo = Math.atan2(y, x)
  pupilaX.value = 12 + Math.cos(angulo) * distancia
  pupilaY.value = 12 + Math.sin(angulo) * distancia
}

function resetPupila() {
  pupilaX.value = 12
  pupilaY.value = 12
}

const parpadeando = ref(false)



function handleMostrarSaldo() {
  oculto.value = false
  number.value = props.account?.saldoCuenta ?? 0 
  resetPupila()
}

function handleOcultarSaldo() {
  oculto.value = true
  number.value = 0
}




</script>
