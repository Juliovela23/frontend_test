<template>
  <div class="flex justify-center items-center min-h-[70vh] bg-[#f6fafd]">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md border-t-4 border-[#01a7e4] px-6 py-6">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg sm:text-xl font-bold text-[#15385c]">Pago Automático de Crédito</h2>
        <!-- Switch Activo -->
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <span class="text-xs font-semibold text-[#01a7e4]">{{ activo ? "Activo" : "Inactivo" }}</span>
          <input type="checkbox" v-model="activo" class="sr-only">
          <span
            :class="[
              'relative w-10 h-5 flex items-center rounded-full transition',
              activo ? 'bg-[#01a7e4]' : 'bg-gray-300'
            ]"
          >
            <span
              :class="[
                'absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                activo ? 'translate-x-5' : 'translate-x-0'
              ]"
            ></span>
          </span>
        </label>
      </div>
      <form class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-[#15385c] mb-1">Seleccionar crédito</label>
          <select v-model="credito" class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-[#01a7e4]">
            <option disabled value="">-- Selecciona tu crédito --</option>
            <option v-for="c in creditos" :key="c.id" :value="c">
              {{ c.nombre }} ({{ c.numero }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-[#15385c] mb-1">Debitar automáticamente de:</label>
          <select v-model="cuenta" class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-[#01a7e4]">
            <option disabled value="">-- Selecciona una cuenta --</option>
            <option v-for="cta in cuentas" :key="cta.numero" :value="cta">
              {{ cta.nombre }} ({{ cta.numero }})
            </option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 bg-[#01a7e4] hover:bg-[#008fbe] text-white font-semibold text-sm py-2 rounded-lg flex items-center justify-center gap-2 shadow"
            @click="guardar"
            :disabled="!activo"
          >
            <span class="i-lucide-save w-4 h-4"></span> Guardar
          </button>
          <button
            type="button"
            class="flex-1 bg-[#f754a5] hover:bg-[#db2883] text-white font-semibold text-sm py-2 rounded-lg flex items-center justify-center gap-2 shadow"
            @click="consultar"
          >
            <span class="i-lucide-search w-4 h-4"></span> Consultar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activo = ref(true)
const credito = ref('')
const cuenta = ref('')
const creditos = [
  { id: 1, nombre: 'Hipotecario', numero: '100-123456-7' },
  { id: 2, nombre: 'Vehículo', numero: '200-654321-0' }
]
const cuentas = [
  { nombre: 'Cuenta Principal', numero: '001-234567-8' },
  { nombre: 'Ahorro', numero: '003-001000-7' }
]
function guardar() { /* ... */ }
function consultar() { /* ... */ }
</script>
