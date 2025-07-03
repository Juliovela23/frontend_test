<template>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
  <div class="flex flex-col items-center min-h-screen pt-8 pb-12 bg-[#f5f7fa]">
    <!-- Contenedor centrado -->
    <div class="w-full max-w-6xl px-4">
      <!-- Formulario de filtros -->
      <div class="bg-[#e7eef6] rounded-2xl shadow p-6 md:p-8 w-full mb-8 border border-[#d1e4f8]">
        <h2 class="text-2xl font-semibold text-center text-[#15385c] mb-6">
          Estado de cuenta
        </h2>

        <!-- Primera fila: Cuenta, Reporte y Tipo de movimiento -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Cuenta -->
          <div>
            <label class="font-medium text-[#15385c] text-sm">Seleccionar cuenta</label>
            <select v-model="cuentaSeleccionada"
              class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:ring-2 focus:ring-[#01a7e4]">
              <option value="">Seleccione una cuenta</option>
              <option v-for="c in cuentas" :key="c.id" :value="c.id">
                {{ c.noCuenta + ' - ' + c.nombreCuenta }}
              </option>
            </select>
          </div>

          <!-- Tipo Reporte -->
          <div>
            <label class="font-medium text-[#15385c] text-sm">Tipo de Reporte</label>
            <select v-model="tipoReporte"
              class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:ring-2 focus:ring-[#01a7e4]">
              <option value="ultimos">Últimos movimientos</option>
              <option value="rango">Rango de fechas</option>
            </select>
          </div>

          <!-- Tipo de Movimiento -->
          <div>
            <label class="font-medium text-[#15385c] text-sm">Tipo de movimiento</label>
            <select v-model="filtroTipo"
              class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:ring-2 focus:ring-[#01a7e4]">
              <option value="">Todos</option>
              <option value="credito">Crédito</option>
              <option value="debito">Débito</option>
            </select>
          </div>
        </div>

        <!-- Segunda fila: Fechas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="font-medium text-[#15385c] text-sm">Desde</label>
            <input v-model="fechaDesde" type="date"
              class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:ring-2 focus:ring-[#01a7e4]" />
          </div>
          <div>
            <label class="font-medium text-[#15385c] text-sm">Hasta</label>
            <input v-model="fechaHasta" type="date"
              class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white text-[#15385c] text-sm focus:ring-2 focus:ring-[#01a7e4]" />
          </div>
        </div>

        <!-- Botón Generar -->
        <div class="flex justify-center">
          <button
            class="bg-[#01a7e4] hover:bg-[#008fbe] text-white font-semibold py-2 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
            @click="generarEstado">
            <span class="material-icons-outlined text-base">receipt_long</span>
            Generar estado
          </button>
        </div>
      </div>

      <!-- Input búsqueda -->
      <div
        class="flex items-center bg-white border border-[#b6d6ff] rounded-xl px-3 py-2 mb-4 w-full max-w-lg mx-auto shadow-sm">
        <span class="material-icons-outlined text-[#15385c] mr-2 text-base">search</span>
        <input v-model="busqueda" type="text" placeholder="Buscar por fecha, tipo, descripción o monto..."
          class="flex-1 outline-none bg-transparent text-sm text-[#15385c] placeholder:text-[#94a3b8]" />
      </div>

      <!-- Tabla -->
      <div class="overflow-x-auto rounded-xl border border-[#15385c]/20 shadow-md">
        <table class="w-full table-auto text-sm md:text-base min-w-[600px]">
          <thead class="bg-[#15385c] text-white">
            <tr>
              <th class="px-4 py-3 text-left font-semibold w-[15%]">Fecha</th>
              <th class="px-4 py-3 text-left font-semibold w-[15%]">Tipo</th>
              <th class="px-4 py-3 text-left font-semibold w-[55%]">Descripción</th>
              <th class="px-4 py-3 text-right font-semibold w-[15%]">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in movimientosFiltrados" :key="m.id"
              class="border-b last:border-b-0 hover:bg-[#f1f5f9] transition-all">
              <td class="px-4 py-3 text-gray-700">{{ new Date(m.fechaMovimiento).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-gray-800">{{ m.tipo }}</td>
              <td class="px-4 py-3 text-gray-600">{{ m.descripcion }}</td>
              <td class="px-4 py-3 text-right font-semibold"
                :class="m.tipo.toLowerCase() === 'débito' || m.tipo.toLowerCase() === 'debito' ? 'text-red-600' : 'text-green-600'">
                {{ m.tipo.toLowerCase() === 'débito' || m.tipo.toLowerCase() === 'debito' ? '- Q' : '+ Q' }}{{
                  m.monto.toFixed(2) }}
              </td>
            </tr>
            <tr v-if="movimientos.length === 0">
              <td colspan="4" class="p-4 text-center text-gray-400">Sin movimientos.</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="flex justify-center mt-4 gap-2 text-[#15385c] font-semibold">
          <button @click="paginaActual--" :disabled="paginaActual === 1"
            class="px-3 py-1 rounded border bg-white shadow hover:bg-[#e7eef6] disabled:opacity-40">
            ← Anterior
          </button>
          <span class="px-2 py-1">Página {{ paginaActual }} de {{ totalPaginas }}</span>
          <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
            class="px-3 py-1 rounded border bg-white shadow hover:bg-[#e7eef6] disabled:opacity-40">
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
const route = useRoute()
const cuentas = ref([])
const cuentaSeleccionada = ref('')
const tipoReporte = ref('ultimos')
const filtroTipo = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')
const mostrarEstado = ref(false)
const cuentaInfoRaw = ref({ nombre: '', numero: '' })
const movimientos = ref([])
const movimientosFiltrados = ref([]) // Resultado paginado
const paginaActual = ref(1)
const movimientosPorPagina = 5
const busqueda = ref('')
const totalPaginas = computed(() =>
  Math.ceil(movimientos.value.length / movimientosPorPagina)
)

const paginarMovimientos = () => {
  const inicio = (paginaActual.value - 1) * movimientosPorPagina
  const fin = inicio + movimientosPorPagina
  movimientosFiltrados.value = movimientos.value.slice(inicio, fin)
}

const tipoReporteLabel = computed(() =>
  tipoReporte.value === 'ultimos' ? 'Últimos movimientos' : 'Rango de fechas'
)

const cuentaInfo = computed(() =>
  cuentas.value.find(c => c.id == cuentaSeleccionada.value) || {}
)

const generarEstado = async () => {
  if (!cuentaSeleccionada.value) return alert('Selecciona una cuenta')

  const params = { tipo: tipoReporte.value }
  if (tipoReporte.value === 'rango') {
    if (!fechaDesde.value || !fechaHasta.value) return alert('Selecciona ambas fechas')
    params.desde = fechaDesde.value
    params.hasta = fechaHasta.value
  }

  try {
    console.log('Generando movimientos para cuenta:', cuentaSeleccionada.value, 'con params:', params)
    const res = await axios.get(
      `https://interappapi.onrender.com/api/cuentas/cuenta/${cuentaSeleccionada.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params
      }
    )
    console.log('Movimientos obtenidos:', res.data)
    movimientos.value = res.data
    mostrarEstado.value = true
  } catch (err) {
    console.error('Error al generar movimientos:', err)
    alert('Ocurrió un error al generar el estado de cuenta.')
  }
}


const obtenerEstadoCuenta = async (idCuenta) => {
  try {
    const res = await axios.get(
      `https://interappapi.onrender.com/api/cuentas/cuenta/${idCuenta}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    cuentaInfoRaw.value = res.data
  } catch (err) {
    console.error('Error al obtener estado de cuenta:', err)
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('https://interappapi.onrender.com/api/cuentas/mis-cuentas', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    cuentas.value = res.data
    if (route.query.cuentaId) {
      cuentaSeleccionada.value = route.query.cuentaId
    }
  } catch (err) {
    console.error('Error al cargar cuentas:', err)
    alert('No se pudieron cargar las cuentas del usuario.')
  }
})

watch(cuentaSeleccionada, (nuevaId) => {
  if (nuevaId) obtenerEstadoCuenta(nuevaId)
  else cuentaInfoRaw.value = { nombre: '', numero: '' }
})
watch([movimientos, paginaActual], paginarMovimientos)

watch([busqueda, filtroTipo, movimientos], () => {
  const texto = busqueda.value.toLowerCase()
  const tipoSeleccionado = filtroTipo.value.toLowerCase()

  const filtrados = movimientos.value.filter(m => {
    const fecha = new Date(m.fechaMovimiento).toLocaleDateString()
    const tipo = m.tipo?.toLowerCase()
    const descripcion = m.descripcion?.toLowerCase()
    const monto = m.monto?.toFixed(2).toString()

    // Filtro por texto
    const coincideTexto = (
      fecha.includes(texto) ||
      tipo.includes(texto) ||
      descripcion.includes(texto) ||
      monto.includes(texto)
    )

    // Filtro por tipo de movimiento
    const coincideTipo = tipoSeleccionado
      ? tipo === tipoSeleccionado
      : true

    return coincideTexto && coincideTipo
  })

  paginaActual.value = 1
  movimientosFiltrados.value = filtrados.slice(0, movimientosPorPagina)
})


</script>
