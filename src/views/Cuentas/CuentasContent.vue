<template>
  <div class="w-full max-w-5xl mx-auto bg-[#e7eef6] rounded-2xl p-4 md:p-6 mt-8">
    <div class="text-center text-lg font-semibold text-[#15385c] mb-2">Cuentas propias</div>

    <div v-if="loading" class="w-full text-center py-12 text-[#15385c] font-semibold">
      Cargando cuentas...
    </div>
    <div v-else-if="error" class="w-full text-center py-12 text-red-500">
      {{ error }}
    </div>
    <div v-else class="flex flex-col md:flex-row gap-6 md:gap-10 items-start justify-center w-full">
      <!-- Lista lateral -->
      <aside class="flex flex-col gap-3 min-w-[220px] max-w-[270px] w-full md:w-[250px]">
        <button v-for="cuenta in cuentas" :key="cuenta.id" @click="seleccionarCuenta(cuenta)" :class="[ 
          'rounded-lg px-4 py-4 text-left font-medium shadow transition-all border-2 duration-200 flex items-center gap-3 group', 
          cuentaSeleccionada?.id === cuenta.id
            ? 'bg-[#0a2540] text-white border-[#0a2540] scale-[1.04] shadow-lg'
            : 'bg-white text-[#0a2540] border-transparent hover:border-[#b6d6ff] hover:scale-[1.02] hover:shadow-md'
        ]">
          <span
            class="w-9 h-9 rounded-full flex items-center justify-center bg-[#01a7e4] text-white text-xl font-bold transition-all duration-300 group-hover:bg-[#0a2540]">
            <svg v-if="cuenta.tipoCuentaNombre?.toLowerCase().includes('ahorro')" class="w-5 h-5" fill="none"
              stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="3" />
              <path d="M9 9h6v6H9z" />
            </svg>
          </span>
          <span class="min-w-0">
            <span class="block text-base font-bold truncate max-w-[130px]">{{ cuenta.nombreCuenta || '--' }}</span>
            <span class="block text-xs opacity-70 mt-0.5 truncate max-w-[120px]">{{ cuenta.noCuenta }}</span>
          </span>
        </button>
      </aside>

      <!-- Detalle de cuenta -->
      <section class="flex-1 flex justify-center w-full">
        <transition name="fade-scale" mode="out-in">
          <div v-if="cuentaSeleccionada" :key="cuentaSeleccionada.id"
            class="w-full max-w-xl bg-white rounded-xl shadow-xl p-8 flex flex-col items-center animate__animated animate__fadeIn">
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8">
              <div>
                <div class="text-[#15385c] text-sm font-semibold">Tipo de cuenta</div>
                <div class="text-gray-600 text-sm mb-2">{{ cuentaSeleccionada.tipoCuentaNombre }}</div>

                <div class="text-[#15385c] text-sm font-semibold">No. cuenta</div>
                <div class="text-gray-600 text-sm mb-2">{{ cuentaSeleccionada.noCuenta }}</div>

                <div class="text-[#15385c] text-sm font-semibold">Fecha última transfe</div>
                <div class="text-gray-600 text-sm">
                  {{ formatearFecha(cuentaSeleccionada.ultimasTransferencias?.[0]?.fecha) || 'Sin transferencias' }}
                </div>

                <div class="text-[#15385c] text-sm font-semibold">Monto última transfe</div>
                <div class="text-gray-600 text-sm">
                  Q {{
                    cuentaSeleccionada.ultimasTransferencias?.[0]?.monto != null
                      ? cuentaSeleccionada.ultimasTransferencias[0].monto.toFixed(2)
                      : 'Sin transferencias'
                  }}
                </div>
              </div>

              <div>
                <div class="text-[#15385c] text-sm font-semibold">Nombre de la cuenta</div>
                <div class="text-gray-600 text-sm mb-2">{{ cuentaSeleccionada.nombreCuenta || '--' }}</div>

                <div class="text-[#15385c] text-sm font-semibold">Saldo disponible</div>
                <div class="text-gray-600 text-sm mb-2">
                  Q {{ cuentaSeleccionada.saldoCuenta?.toFixed(2) }}
                </div>

                <div class="text-[#15385c] text-sm font-semibold">Tipo última transfe</div>
                <div class="text-gray-600 text-sm">
                  {{ cuentaSeleccionada.ultimasTransferencias?.[0]?.tipo || 'Sin transferencias' }}
                </div>
              </div>
            </div>

            <div class="flex gap-8 w-full justify-center mt-2">
              <button @click="handleTransferencia"
                class="bg-[#01a7e4] hover:bg-[#008fbe] active:scale-95 text-white font-bold py-2 px-8 rounded-lg shadow transition-all duration-200">
                Transferencia
              </button>
              <button @click="handleHistorial"
                class="bg-[#f754a5] hover:bg-[#db2883] active:scale-95 text-white font-bold py-2 px-8 rounded-lg shadow transition-all duration-200">
                Historial
              </button>
            </div>
          </div>
          <div v-else key="empty"
            class="w-full max-w-xl min-h-[170px] bg-white rounded-xl shadow-xl p-8 flex flex-col items-center justify-center">
            <div class="text-gray-500 text-center text-base">Selecciona una cuenta</div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const cuentas = ref([])
const loading = ref(false)
const error = ref('')
const router = useRouter()

const cuentaSeleccionada = ref(null)

async function fetchCuentasConUltimaTransferencia() {
  try {
    loading.value = true
    error.value = ''

    const token = localStorage.getItem('token')

    const res = await axios.get('https://interappapi.onrender.com/api/cuentas/Cuentas-transferencia', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    cuentas.value = res.data
    console.log('Cuentas cargadas:', cuentas.value)
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar cuentas',
      text: e.response?.data?.message || 'Ocurrió un error al cargar las cuentas.'
    })
    cuentas.value = []
  } finally {
    loading.value = false
  }
}

function seleccionarCuenta(cuenta) {
  cuentaSeleccionada.value = cuenta
}

function handleTransferencia() {
  if (cuentaSeleccionada.value?.id) {
    router.push({
      name: 'DashboardTransferencias',
      query: { cuentaId: cuentaSeleccionada.value.id }
    })
  }
}

function handleHistorial() {
  if (cuentaSeleccionada.value?.id) {
    router.push({
      name: 'DashboardEstadoCuenta',
      query: { cuentaId: cuentaSeleccionada.value.id }
    })
  }
}

// Función para formatear la fecha
function formatearFecha(fecha) {
  if (!fecha) return ''
  const opciones: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(fecha).toLocaleString('es-ES', opciones);
}


onMounted(() => {
  fetchCuentasConUltimaTransferencia()
})
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
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
</style>
