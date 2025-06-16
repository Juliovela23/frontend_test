<template>
  <div class="w-full max-w-5xl mx-auto bg-[#e7eef6] rounded-2xl p-6 mt-8">
    <div class="text-center text-lg font-semibold text-[#15385c] mb-2">Cuentas propias</div>
    <div class="flex gap-6">
      <!-- Lista lateral -->
      <aside class="flex flex-col gap-3 w-60 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 pr-2">
        <button
          v-for="cuenta in cuentas"
          :key="cuenta.id"
          @click="seleccionarCuenta(cuenta)"
          :class="[
            'rounded-lg px-4 py-4 text-left font-medium shadow transition-all border-2 duration-200 flex items-center gap-3 group',
            cuentaSeleccionada?.id === cuenta.id
              ? 'bg-[#0a2540] text-white border-[#0a2540] scale-[1.04] shadow-lg'
              : 'bg-white text-[#0a2540] border-transparent hover:border-[#b6d6ff] hover:scale-[1.02] hover:shadow-md'
          ]"
        >
          <!-- Icono de cuenta -->
          <span
            class="w-9 h-9 rounded-full flex items-center justify-center bg-[#01a7e4] text-white text-xl font-bold transition-all duration-300 group-hover:bg-[#0a2540]"
          >
            <svg v-if="cuenta.tipo === 'Ahorro'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="3" />
              <path d="M9 9h6v6H9z" />
            </svg>
          </span>
          <span>
            <span class="block text-base font-bold">{{ cuenta.nombre }}</span>
            <span class="block text-xs opacity-70 mt-0.5">"{{ cuenta.numero }}"</span>
          </span>
        </button>
      </aside>
      <!-- Detalle de cuenta -->
      <section class="flex-1 flex justify-center">
        <transition name="fade-scale" mode="out-in">
          <div
            v-if="cuentaSeleccionada"
            :key="cuentaSeleccionada.id"
            class="w-full max-w-xl bg-white rounded-xl shadow-xl p-8 flex flex-col items-center animate__animated animate__fadeIn"
          >
            <div class="w-full grid grid-cols-2 gap-x-12 gap-y-3 mb-8">
              <div>
                <div class="text-[#15385c] text-sm font-semibold">Tipo de cuenta</div>
                <div class="text-gray-600 text-sm mb-2">{{ cuentaSeleccionada.tipo }}</div>
                <div class="text-[#15385c] text-sm font-semibold">No. cuenta</div>
                <div class="text-gray-600 text-sm mb-2">{{ cuentaSeleccionada.numero }}</div>
                <div class="text-[#15385c] text-sm font-semibold">Fecha última transfe</div>
                <div class="text-gray-600 text-sm">--/--/----</div>
              </div>
              <div>
                <div class="text-[#15385c] text-sm font-semibold">Nombre de la cuenta</div>
                <div class="text-gray-600 text-sm mb-2">{{ cuentaSeleccionada.nombre }}</div>
                <div class="text-[#15385c] text-sm font-semibold">Saldo disponible</div>
                <div class="text-gray-600 text-sm mb-2">Q {{ cuentaSeleccionada.saldo.toFixed(2) }}</div>
                <div class="text-[#15385c] text-sm font-semibold">Tipo última transfe</div>
                <div class="text-gray-600 text-sm">--</div>
              </div>
            </div>
            <div class="flex gap-8 w-full justify-center mt-2">
              <button
                class="bg-[#01a7e4] hover:bg-[#008fbe] active:scale-95 text-white font-bold py-2 px-8 rounded-lg shadow transition-all duration-200">
                Transferencia
              </button>
              <button
                class="bg-[#f754a5] hover:bg-[#db2883] active:scale-95 text-white font-bold py-2 px-8 rounded-lg shadow transition-all duration-200">
                Historial
              </button>
            </div>
          </div>
          <div
            v-else
            key="empty"
            class="w-full max-w-xl min-h-[170px] bg-white rounded-xl shadow-xl p-8 flex flex-col items-center justify-center"
          >
            <div class="text-gray-500 text-center text-base">Selecciona una cuenta</div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cuentas = ref([
  {
    id: 1,
    nombre: 'Cuenta corriente',
    numero: '001-234567-8',
    tipo: 'Corriente',
    saldo: 1500.75,
  },
  {
    id: 2,
    nombre: 'Cuenta Ahorro',
    numero: '003-001000-7',
    tipo: 'Ahorro',
    saldo: 5000.00,
  }
])

const cuentaSeleccionada = ref(null)

function seleccionarCuenta(cuenta) {
  cuentaSeleccionada.value = cuenta
}
</script>

<style scoped>
/* Animación fade-scale */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(.96);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Scrollbar bonito (opcional, requiere plugin tailwind-scrollbar) */
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thumb-blue-200 {
  scrollbar-color: #bfdbfe #e5e7eb;
}
</style>
