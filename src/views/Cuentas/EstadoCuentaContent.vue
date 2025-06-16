<template>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
  <div class="flex flex-col items-center min-h-screen pt-8 pb-12 bg-[#f5f7fa]">
    <!-- Filtros arriba -->
    <div
      class="bg-[#e7eef6] rounded-2xl shadow p-6 md:p-8 w-full max-w-2xl mb-8 border border-[#d1e4f8]"
    >
      <h2 class="text-2xl font-semibold text-center text-[#15385c] mb-4">
        Estado de cuenta
      </h2>
      <div class="grid md:grid-cols-2 gap-4 mb-2">
        <div>
          <label class="font-medium text-[#15385c] text-sm">Seleccionar cuenta</label>
          <select v-model="cuentaSeleccionada" class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:outline-[#15385c]">
            <option value="">Seleccione una cuenta</option>
            <option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="font-medium text-[#15385c] text-sm">Tipo de Reporte</label>
          <select v-model="tipoReporte" class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:outline-[#15385c]">
            <option value="ultimos">Últimos movimientos</option>
            <option value="rango">Rango de fechas</option>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="font-medium text-[#15385c] text-sm">Desde</label>
          <input v-model="fechaDesde" type="date" class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm" />
        </div>
        <div>
          <label class="font-medium text-[#15385c] text-sm">Hasta</label>
          <input v-model="fechaHasta" type="date" class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm" />
        </div>
      </div>
      <div class="flex justify-center mt-2">
        <button
          class="bg-[#01a7e4] hover:bg-[#008fbe] text-white font-semibold py-2 px-8 rounded-xl shadow transition flex items-center gap-2"
          @click="generarEstado"
        >
          <span class="material-icons-outlined text-base">receipt_long</span>
          Generar estado
        </button>
      </div>
    </div>

    <!-- Estado y tabla -->
    <div
      v-if="mostrarEstado"
      class="w-full max-w-5xl rounded-2xl shadow-lg border-2 border-[#ffd900] bg-white pt-3 pb-6 px-4 md:px-8 mb-4"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2 md:gap-0">
        <div class="text-[#15385c] text-sm md:text-base">
          <div class="font-semibold inline">Cuenta No:</div>
          <span class="font-normal ml-1">{{ cuentaInfo.numero }}</span>
          <br />
          <div class="font-semibold inline">Tipo de reporte:</div>
          <span class="font-normal ml-1">{{ tipoReporteLabel }}</span>
        </div>
        <div class="flex gap-2 mt-2 md:mt-0">
          <button class="bg-[#01a7e4] hover:bg-[#008fbe] text-white px-4 py-2 rounded font-semibold flex items-center gap-1 shadow transition">
            <span class="material-icons-outlined text-base">print</span> Imprimir
          </button>
          <button class="bg-[#ffd900] hover:bg-[#ffbb00] text-[#15385c] px-4 py-2 rounded font-semibold flex items-center gap-1 shadow transition">
            <span class="material-icons-outlined text-base">file_download</span> Exportar
          </button>
        </div>
      </div>
      <div class="overflow-x-auto rounded-xl border border-[#15385c]/20">
        <table class="min-w-full text-sm">
          <thead class="bg-[#15385c] text-white">
            <tr>
              <th class="p-2 text-left font-semibold">Fecha</th>
              <th class="p-2 text-left font-semibold">Pago</th>
              <th class="p-2 text-left font-semibold">Num Comp</th>
              <th class="p-2 text-left font-semibold">Referencia</th>
              <th class="p-2 text-right font-semibold">Monto</th>
              <th class="p-2 text-right font-semibold">Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in movimientos"
              :key="m.id"
              class="border-b last:border-b-0 hover:bg-[#e7eef6]/50 transition"
            >
              <td class="p-2">{{ m.fecha }}</td>
              <td class="p-2">{{ m.pago }}</td>
              <td class="p-2">{{ m.numComp }}</td>
              <td class="p-2">{{ m.referencia }}</td>
              <td class="p-2 text-right">Q {{ m.monto.toFixed(2) }}</td>
              <td class="p-2 text-right">Q {{ m.saldo.toFixed(2) }}</td>
            </tr>
            <tr v-if="movimientos.length === 0">
              <td colspan="6" class="p-2 text-center text-gray-400">Sin movimientos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cuentas = ref([
  { id: 'c1', nombre: 'Cuenta corriente No. 0000000-00', numero: '000-000000-00' },
  { id: 'c2', nombre: 'Cuenta ahorro No. 1111111-11', numero: '111-111111-11' },
])
const cuentaSeleccionada = ref('')
const tipoReporte = ref('ultimos')
const fechaDesde = ref('')
const fechaHasta = ref('')
const mostrarEstado = ref(false)

const movimientosFicticios = [
  {
    id: 1, fecha: '16/04/2025', pago: 'EFE', numComp: '43303',
    referencia: 'DEPÓSITO DE APERTURA', monto: 25.0, saldo: 25.0
  }
]

const cuentaInfo = computed(() => {
  const c = cuentas.value.find(x => x.id === cuentaSeleccionada.value)
  return c || { nombre: '', numero: '' }
})

const tipoReporteLabel = computed(() =>
  tipoReporte.value === 'ultimos' ? 'Último movimiento' : 'Rango de fechas'
)

const movimientos = ref([])

function generarEstado() {
  if (!cuentaSeleccionada.value) {
    alert('Selecciona una cuenta')
    return
  }
  
  movimientos.value = movimientosFicticios 
  mostrarEstado.value = true
}
</script>

