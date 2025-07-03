<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-[#15385c]">
      Historial de Transferencias
    </h1>

    <!-- Barra de filtros -->
    <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6">
      <!-- Búsqueda -->
      <Input v-model="filtroBusqueda" placeholder="Buscar por número, descripción, cuenta, fecha o monto"
        class="w-full md:max-w-sm" />


      <!-- Selector de cuentas -->
      <select v-model="cuentaSeleccionada"
        class="p-2 rounded-xl border border-[#b6d6ff] text-sm text-[#15385c] bg-white focus:ring-2 focus:ring-[#01a7e4]">
        <option value="">Todas las cuentas</option>
        <option v-for="cuenta in cuentas" :key="cuenta.id" :value="cuenta.id">
          {{ cuenta.noCuenta }} - {{ cuenta.nombreCuenta }}
        </option>
      </select>

      <!-- Botón buscar -->
      <Button class="bg-[#01a7e4] hover:bg-[#008fbe] text-white font-semibold px-5 py-2 rounded-xl shadow transition"
        @click="buscarTransferencias">
        Buscar
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-[#15385c] font-semibold">
      <span class="animate-pulse">Cargando transferencias...</span>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="transferenciasFiltradas.length === 0" class="text-center py-10 text-[#15385c] font-semibold">
      No se encontraron transferencias.
    </div>

    <!-- Tarjetas de transferencias en grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="t in transferenciasPaginadas" :key="t.noTransferencia"
        class="rounded-xl border border-[#d1e4f8] shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all">

        <div class="mb-4">
          <p class="text-sm font-semibold text-[#15385c] mb-1">
            Transferencia #{{ t.noTransferencia }}
          </p>
          <p class="text-xs text-gray-500">
            Cuenta destino: ****{{ t.cuentaDestino?.slice(-4) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ t.tipoTransferencia }} - {{ formatDate(t.fechaTransferencia) }}
          </p>
        </div>

        <div class="flex flex-col">
          <p class="font-bold mb-2" :class="t.monto >= 0 ? 'text-green-600' : 'text-red-600'">
            Q{{ t.monto.toFixed(2) }}
          </p>
          <Button variant="outline" size="sm" class="w-full" @click="verRecibo(t.id)">
            Ver recibo
          </Button>
        </div>
      </div>
    </div>

    <!-- Controles de paginación -->
    <div v-if="totalPaginas > 1" class="flex justify-center items-center gap-4 mt-6 text-[#15385c] font-semibold">

      <button @click="paginaActual--" :disabled="paginaActual === 1"
        class="px-4 py-2 rounded border bg-white shadow hover:bg-[#e7eef6] disabled:opacity-40">
        ← Anterior
      </button>

      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>

      <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
        class="px-4 py-2 rounded border bg-white shadow hover:bg-[#e7eef6] disabled:opacity-40">
        Siguiente →
      </button>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const transferencias = ref([])
const filtroBusqueda = ref('')
const loading = ref(false)
const cuentas = ref([])
const cuentaSeleccionada = ref('')
const router = useRouter()

// Paginación
const paginaActual = ref(1)
const transferenciasPorPagina = 9

const totalPaginas = computed(() =>
  Math.ceil(transferenciasFiltradas.value.length / transferenciasPorPagina)
)

const transferenciasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * transferenciasPorPagina
  return transferenciasFiltradas.value.slice(inicio, inicio + transferenciasPorPagina)
})

// Filtro en memoria
const transferenciasFiltradas = computed(() => {
  const texto = filtroBusqueda.value.trim().toLowerCase()

  if (!texto) return transferencias.value

  return transferencias.value.filter(t => {
    const numero = t.noTransferencia?.toLowerCase() || ''
    const descripcion = t.descripcion?.toLowerCase() || ''
    const cuenta = t.cuentaDestino?.slice(-4) || ''
    const fecha = new Date(t.fechaTransferencia).toLocaleDateString('es-GT')
    const monto = t.monto?.toFixed(2).toString() || ''

    return (
      numero.includes(texto) ||
      descripcion.includes(texto) ||
      cuenta.includes(texto) ||
      fecha.includes(texto) ||
      monto.includes(texto)
    )
  })
})


// Buscar + reset página
const buscarTransferencias = () => {
  paginaActual.value = 1
  cargarTransferencias()
}

const cargarTransferencias = async () => {
  loading.value = true
  try {
    const params = {}
    if (cuentaSeleccionada.value) {
      params.cuentaId = cuentaSeleccionada.value
    }

    const response = await axios.get(
      'https://interappapi.onrender.com/api/transferencias/mis-transferencias',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params
      }
    )

    transferencias.value = response.data
  } catch (error) {
    console.error('Error al cargar transferencias:', error)
  } finally {
    loading.value = false
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
  } catch (err) {
    console.error('Error al cargar cuentas:', err)
    alert('No se pudieron cargar las cuentas del usuario.')
  }

  await cargarTransferencias()
})

const formatDate = (fecha) =>
  new Date(fecha).toLocaleString('es-GT', {
    dateStyle: 'short',
    timeStyle: 'short'
  })

const verRecibo = (id) => {
  router.push(`/dashboard/transferencia-recibo/${id}`)
}
</script>


<style scoped></style>
