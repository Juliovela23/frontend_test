<template>
  <div
    ref="cardRef"
    class="w-[300px] h-[180px] rounded-xl shadow-md text-white p-4 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300"
    :style="{ backgroundColor: colorFondo }"
    @mousemove="onCardMouseMove"
    @mouseleave="resetPupila"
  >
    <div class="flex justify-between items-start">
      <div>
        <!-- ✅ Skeleton para título -->
        <p class="font-semibold text-lg">
          <Skeleton v-if="!card" class="h-4 w-[120px]" />
          <span v-else>{{ card.tituloPersonalizado }}</span>
        </p>

        <!-- ✅ Skeleton para noCuenta -->
        <p class="text-sm opacity-90">
          <Skeleton v-if="!account" class="h-4 w-[120px]" />
          <span v-else>{{ account?.noCuenta ?? '---' }}</span>
        </p>

        <!-- ✅ Skeleton para nombreCuenta -->
        <p class="text-sm opacity-90">
          <Skeleton v-if="!account" class="h-4 w-[150px]" />
          <span v-else>{{ account?.nombreCuenta ?? '---' }}</span>
        </p>
      </div>

      <div class="flex items-center gap-1">
        <div
          class="bg-yellow-400 text-black px-2 py-1 rounded font-semibold text-sm min-w-[90px] text-center transition-all duration-300"
          :class="{ 'blur-sm select-none': oculto }"
        >
          <template v-if="!account">
            <Skeleton class="h-4 w-[60px]" />
          </template>
          <template v-else>
            {{ oculto ? 'Q ••••••' : `Q ${tweened.number.toFixed(2)}` }}
          </template>
        </div>

        <!-- ✅ Ojo animado como está -->
        <div>
          <svg
            v-if="oculto"
            xmlns="http://www.w3.org/2000/svg"
            @click="handleMostrarSaldo"
            class="w-8 h-8 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            style="background: transparent"
          >
            <ellipse cx="12" cy="12" rx="10" ry="7" stroke="white" fill="#111827" />
            <circle :cx="pupilaX" :cy="pupilaY" :r="radio" fill="#fff" stroke="#000" stroke-width="1" />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            @click="handleOcultarSaldo"
            class="w-8 h-8 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            style="background: transparent"
          >
            <path d="M4 12 Q12 16 20 12" stroke="white" stroke-width="2.5" fill="none" />
            <path d="M4 12 Q12 8 20 12" stroke="#888" stroke-width="1" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>

    <div class="mt-4 flex justify-between gap-2">
      <button class="bg-cyan-400 text-white px-3 py-1 rounded w-full" @click="handleTransferencia" :disabled="!account">
        Transferencia
      </button>
      <button class="bg-pink-500 text-white px-3 py-1 rounded w-full" @click="handleHistorial" :disabled="!account">
        Historial
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
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
      name: 'DashboardTransferencias',
      query: { cuentaId: props.account.id }
    })
  }
}

function handleHistorial() {
  if (props.account?.id) {
    router.push({
      name: 'DashboardEstadoCuenta',
      query: { cuentaId: props.account.id }
    })
  }
}

const oculto = ref(true)
const cardRef = ref(null)
const pupilaX = ref(12)
const pupilaY = ref(12)
const radio = 3

function onCardMouseMove(e) {
  if (!oculto.value) return
  const cardRect = cardRef.value.getBoundingClientRect()
  const ojoCenter = {
    x: cardRect.left + cardRect.width - 32,
    y: cardRect.top + 28
  }
  const x = e.clientX - ojoCenter.x
  const y = e.clientY - ojoCenter.y
  const distancia = Math.min(Math.sqrt(x * x + y * y), 4)
  const angulo = Math.atan2(y, x)
  pupilaX.value = 12 + Math.cos(angulo) * distancia
  pupilaY.value = 12 + Math.sin(angulo) * distancia
}

function resetPupila() {
  pupilaX.value = 12
  pupilaY.value = 12
}

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
