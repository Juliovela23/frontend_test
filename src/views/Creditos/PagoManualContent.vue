<template>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">

  <div class="flex justify-center w-full pt-6">
  
    <div class="bg-[#e7eef6] rounded-2xl p-8 shadow-xl w-full max-w-xl min-w-[320px] sm:max-w-2xl flex flex-col items-center">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-[#15385c] mb-5 tracking-tight">
        Pago Manual de Crédito
      </h2>
      <!-- Formulario principal -->
      <form class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-semibold text-[#15385c]">Código de crédito</label>
            <select class="w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none">
              <option>Préstamo Hipotecario</option>
              <option>Crédito Personal</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold text-[#15385c]">Saldo capital</label>
            <input type="text" disabled value="Q 70,000.00"
              class="w-full rounded-lg border px-3 py-1.5 text-sm bg-gray-50" />
          </div>
          <div>
            <label class="text-xs font-semibold text-[#15385c]">Interés corriente</label>
            <input type="text" disabled value="Q 440.88"
              class="w-full rounded-lg border px-3 py-1.5 text-sm bg-gray-50" />
          </div>
          <div>
            <label class="text-xs font-semibold text-[#15385c]">Interés Moratorio</label>
            <input type="text" disabled value="Q 0.00"
              class="w-full rounded-lg border px-3 py-1.5 text-sm bg-gray-50" />
          </div>
          <div>
            <label class="text-xs font-semibold text-[#15385c]">Siguiente cuota</label>
            <input type="text" disabled value="21/07/2025"
              class="w-full rounded-lg border px-3 py-1.5 text-sm bg-gray-50" />
          </div>
          <div>
            <label class="text-xs font-semibold text-[#15385c]">Monto sig. cuota</label>
            <input type="text" disabled value="Q 2,500.00"
              class="w-full rounded-lg border px-3 py-1.5 text-sm bg-gray-50" />
          </div>
        </div>
        <!-- Total a pagar -->
        <div>
          <label class="text-xs font-semibold text-[#15385c]">Total a pagar</label>
          <div class="w-full rounded-lg border bg-yellow-100 px-3 py-2 text-base font-bold text-right text-[#8a6d1c]">
            Q 440.88
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-[#15385c]">Seleccionar cuenta</label>
          <select class="w-full rounded-lg border px-3 py-1.5 text-sm">
            <option>Cuenta 001-234567-8</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-[#15385c]">Pagar</label>
          <select class="w-full rounded-lg border px-3 py-1.5 text-sm">
            <option>Total Actual</option>
            <option>Solo intereses</option>
            <option>Solo capital</option>
          </select>
        </div>
        
        <button type="button" class="w-full rounded-lg bg-[#01a7e4] text-white font-bold py-2 hover:bg-[#008fbe] transition text-base">
          Validar pago
        </button>
        <div>
          <label class="text-xs font-semibold text-[#15385c]">Token de validación</label>
          <select class="w-full rounded-lg border px-3 py-1.5 text-sm mb-2">
            <option>Seleccione una opción para envío de token</option>
          </select>
          <input type="text" class="w-full rounded-lg border px-3 py-1.5 text-sm" placeholder="Ingrese el token..." />
        </div>
        <button type="button" class="w-full rounded-lg bg-[#01a7e4] text-white font-bold py-2 hover:bg-[#008fbe] transition flex items-center justify-center gap-2 text-base">
          <span class="material-icons text-base"></span>
          solicitar token
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const credito = ref('Préstamo Hipotecario')
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 rounded border border-[#b6d6ff] bg-white text-sm focus:outline-[#01a7e4] transition;
}
</style>
