<template>
  <div class="flex justify-center w-full pt-6">
    <div
      class="bg-[#e7eef6] rounded-2xl p-8 shadow-xl w-full max-w-xl min-w-[320px] sm:max-w-2xl flex flex-col items-center"
    >
      <h2 class="text-xl sm:text-2xl font-bold text-[#15385c] mb-4 text-center">
        Realizar una transferencia
      </h2>
      <form class="w-full flex flex-col gap-4">
        <!-- Tipo de transferencia -->
        <div>
          <span class="font-semibold text-[#15385c]">Tipo de transferencia</span>
          <div class="flex gap-6 mt-2">
            <label class="inline-flex items-center gap-2">
              <input type="radio" v-model="tipo" value="propia" class="accent-[#01a7e4]" />
              Propia
            </label>
            <label class="inline-flex items-center gap-2">
              <input type="radio" v-model="tipo" value="terceros" class="accent-[#01a7e4]" />
              Terceros
            </label>
          </div>
        </div>

        <!-- Cuenta de origen -->
        <div>
          <div class="flex items-center justify-between">
            <label class="font-semibold text-[#15385c]">Cuenta de origen</label>
            <span class="text-xs text-[#15385c] opacity-80">Fondos disponibles</span>
          </div>
          <select
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            v-model="cuentaOrigen"
          >
            <option value="">Selecciona una cuenta</option>
            <option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <!-- Cuenta destino -->
        <div v-if="tipo === 'propia'">
          <label class="font-semibold text-[#15385c]">Cuenta destino (Propia)</label>
          <select
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            v-model="cuentaDestino"
          >
            <option value="">Selecciona una cuenta</option>
            <option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <div v-else>
          <div class="flex items-center gap-2 mb-1">
            <label class="font-semibold text-[#15385c] mb-0">Cuenta destino (Tercero)</label>
            <AgregarCuentaTercerosSheet />
          </div>

          <select
            v-model="cuentaTerceroSeleccionada"
            class="w-full p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
          >
            <option value="">Selecciona una cuenta</option>
            <option v-for="c in cuentasTerceros" :key="c.id" :value="c.noCuenta">
              {{ c.aliasCuenta }} - {{ c.noCuenta }}
            </option>
            <option value="manual">Ingresar una cuenta manualmente</option>
          </select>

          <input
            v-if="cuentaTerceroSeleccionada === 'manual'"
            v-model="cuentaTerceroManual"
            type="text"
            placeholder="Escriba la cuenta destino"
            class="w-full mt-2 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
          />
        </div>

        <!-- Monto -->
        <div>
          <label class="font-semibold text-[#15385c]">Monto a transferir</label>
          <input
            type="number"
            min="0"
            step="0.01"
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            placeholder="Q 0.00"
            v-model="monto"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="font-semibold text-[#15385c]">Descripción transferencia (opcional)</label>
          <textarea
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4] min-h-[44px]"
            placeholder="Motivo o referencia de la transferencia"
            v-model="descripcion"
          />
        </div>

        <!-- Token de validación -->
        <div>
          <label class="font-semibold text-[#15385c]">Token de validación</label>
          <select
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            v-model="tokenEnvio"
          >
            <option value="">Seleccione una opción para envío de token</option>
            <option value="email">Correo</option>
            <option value="sms">SMS</option>
          </select>
        </div>

        <!-- Input token -->
        <div>
          <input
            type="text"
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            placeholder="Introduzca el token de validación"
            v-model="token"
          />
        </div>

        <!-- Botón -->
        <button
          type="button"
          class="w-full bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-3 rounded-xl shadow transition text-lg flex items-center justify-center gap-2 mt-2"
        >
          <span class="inline-block">↓</span> solicitar token
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import AgregarCuentaTercerosSheet from '@/components/Cuentas/AgregarCuentaTercerosSheet.vue'

const tipo = ref('propia')
const cuentaOrigen = ref('')
const cuentaDestino = ref('')
const cuentaTerceroSeleccionada = ref('')
const cuentaTerceroManual = ref('')
const monto = ref('')
const descripcion = ref('')
const tokenEnvio = ref('')
const token = ref('')

const cuentas = ref([
  { id: 1, nombre: 'Cuenta corriente No. 0000' },
  { id: 2, nombre: 'Cuenta ahorro No. 1111' }
])

const cuentasTerceros = ref([])

const cargarCuentasTerceros = async () => {
  try {
    const res = await axios.get('https://interappapi.onrender.com/api/terceros-user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Cuentas de terceros:', res.data)
    cuentasTerceros.value = res.data
  } catch (error) {
    console.error('Error al cargar cuentas de terceros:', error)
  }
}

onMounted(() => {
  cargarCuentasTerceros()
})

const cuentaTercero = computed(() =>
  cuentaTerceroSeleccionada.value === 'manual'
    ? cuentaTerceroManual.value
    : cuentaTerceroSeleccionada.value
)
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 250ms ease;
  transform-origin: top right;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
