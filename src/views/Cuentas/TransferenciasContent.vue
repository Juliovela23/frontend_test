<template>
  <div class="flex justify-center w-full pt-6">
    <div
      class="bg-[#e7eef6] rounded-2xl p-8 shadow-xl w-full max-w-xl min-w-[320px] sm:max-w-2xl flex flex-col items-center">
      <h2 class="text-xl sm:text-2xl font-bold text-[#15385c] mb-4 text-center">Realizar una transferencia</h2>
      <form @submit.prevent="realizarTransferencia" class="w-full flex flex-col gap-4">

        <!-- Tipo -->
        <div>
          <span class="font-semibold text-[#15385c]">Tipo de transferencia</span>
          <div class="flex gap-6 mt-2">
            <label class="inline-flex items-center gap-2">
              <input type="radio" v-model="tipo" value="propia" class="accent-[#01a7e4]" /> Propia
            </label>
            <label class="inline-flex items-center gap-2">
              <input type="radio" v-model="tipo" value="terceros" class="accent-[#01a7e4]" /> Terceros
            </label>
          </div>
        </div>

        <!-- Cuenta de origen -->
        <div>
          <div class="flex items-center justify-between">
            <label class="font-semibold text-[#15385c]">Cuenta de origen</label>
            <span class="text-xs text-[#15385c] opacity-80">
              Fondos disponibles: Q {{ saldoDisponible.toFixed(2) }}
            </span>
          </div>
          <select v-model="cuentaSeleccionada"
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]">
            <option value="">Selecciona una cuenta</option>
            <option v-for="c in cuentas" :key="c.id" :value="c">
              {{ c.nombreCuenta }} - {{ c.tipoCuentaNombre }} - {{ c.noCuenta }}
            </option>
          </select>

          <!-- Campo oculto que guarda solo el número de cuenta -->
          <input type="hidden" v-model="cuentaOrigen" />
        </div>

        <!-- Cuenta destino -->
        <div v-if="tipo === 'propia'">
          <label class="font-semibold text-[#15385c]">Cuenta destino (Propia)</label>
          <select class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            v-model="cuentaDestino">
            <option value="">Selecciona una cuenta</option>
            <option v-for="c in cuentas" :key="c.id" :value="c.id">
              {{ c.nombreCuenta }} - {{ c.tipoCuentaNombre }} - {{ c.noCuenta }}

            </option>
          </select>
        </div>
        <!-- Cuenta destino para terceros con Listbox -->
        <div v-else>
          <div class="flex items-center gap-2 mb-1">
            <label class="font-semibold text-[#15385c] mb-0">Cuenta destino (Tercero)</label>
            <AgregarCuentaTercerosSheet @cuenta-agregada="agregarCuentaPendienteYSeleccionar" />
          </div>

          <Listbox v-model="cuentaTerceroSeleccionada">
            <div class="relative">
              <ListboxButton
                class="relative w-full cursor-default rounded-xl border border-[#b6d6ff] bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-[#01a7e4] sm:text-sm">
                <span class="block truncate">
                  {{
                    cuentasTerceros.find(c => c.noCuenta === cuentaTerceroSeleccionada)?.aliasCuenta
                      ? cuentasTerceros.find(c => c.noCuenta === cuentaTerceroSeleccionada)?.aliasCuenta + ' / ' +
                      cuentaTerceroSeleccionada
                      : cuentaTerceroSeleccionada === 'manual'
                        ? 'Cuenta manual'
                        : 'Selecciona una cuenta'
                  }}
                </span>
              </ListboxButton>

              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                <ListboxOption v-for="c in cuentasDisponiblesTerceros" :key="c.id" :value="c.noCuenta"
                  class="group flex justify-between items-center cursor-pointer select-none px-4 py-2 hover:bg-[#eef7ff] transition">
                  <div class="text-[#15385c]">
                    <p class="font-semibold">{{ c.aliasCuenta }}</p>
                    <p class="text-xs text-gray-500">No. {{ c.noCuenta }}</p>
                  </div>
                  <button v-if="!c.id?.toString().startsWith('temp')" type="button" @click.stop="abrirSheetCuenta(c)"
                    class="text-xs bg-[#ff9800] hover:bg-[#e68900] text-white rounded px-2 py-1 shadow-sm">
                    Actualizar
                  </button>
                  <span v-else class="text-xs bg-yellow-500 text-white rounded px-2 py-1 shadow-sm cursor-default">
                    Pendiente
                  </span>
                </ListboxOption>


                <ListboxOption value="manual"
                  class="cursor-pointer px-4 py-2 text-[#15385c] hover:bg-[#eef7ff] text-sm">
                  ➕ Ingresar una cuenta manualmente
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>

          <input v-if="cuentaTerceroSeleccionada === 'manual'" v-model="cuentaTerceroManual" type="text"
            placeholder="Escriba la cuenta destino"
            class="w-full mt-2 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]" />
        </div>



        <!-- Monto -->
        <div>
          <label class="font-semibold text-[#15385c]">Monto a transferir</label>
          <input type="number" min="0" step="0.01"
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            placeholder="Q 0.00" v-model="monto" />
        </div>

        <!-- Descripción -->
        <div>
          <label class="font-semibold text-[#15385c]">Descripción transferencia (opcional)</label>
          <textarea
            class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4] min-h-[44px]"
            placeholder="Motivo o referencia de la transferencia" v-model="descripcion" />
        </div>

        <!-- Token envío -->
        <div>
          <label class="font-semibold text-[#15385c]">Token de validación</label>
          <select class="w-full mt-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
            v-model="tokenEnvio" :disabled="tokenSolicitado">
            <option value="">Seleccione una opción para envío de token</option>
            <option value="email">Correo</option>
            <option value="sms">SMS</option>
          </select>
        </div>

        <!-- Botón solicitar token -->
        <button type="button" @click="solicitarToken" :disabled="solicitando || !tokenEnvio"
          class="w-full bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-3 rounded-xl shadow transition text-lg flex items-center justify-center gap-2 mt-2">
          <span v-if="solicitando"
            class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
          <span v-else>📨 Solicitar token</span>
        </button>

        <!-- Token, validación y transferencia estilizado -->
        <div v-if="tokenSolicitado">
          <label class="font-semibold text-[#15385c]">Token de validación</label>
          <div class="flex gap-2 mt-1 items-center">
            <input type="text"
              class="flex-1 p-2 rounded-xl border border-[#b6d6ff] bg-white focus:ring-2 focus:ring-[#01a7e4]"
              placeholder="Código" v-model="token" :disabled="tokenValidado" />
            <button type="button" @click="validarToken" :disabled="validando || tokenValidado"
              class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-2 rounded-xl shadow">
              <span v-if="validando"
                class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent inline-block"></span>
              <span v-else>Validar</span>
            </button>
          </div>

          <!-- Botón transferencia -->
          <button type="submit" :disabled="!tokenValidado || cargandoTransferencia"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition text-lg flex items-center justify-center gap-2 mt-4">
            <span v-if="cargandoTransferencia"
              class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
            <span v-else>Realizar transferencia</span>
          </button>
        </div>

      </form>
    </div>
  </div>
  <EditarCuentaTerceroSheet v-model="sheetEditarAbierto" :cuentaEditar="cuentaSeleccionadaEditar"
    @guardado="cargarCuentasTerceros" />

  <CustomToast ref="toastRef" />
</template>


<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import AgregarCuentaTercerosSheet from '@/components/Cuentas/AgregarCuentaTercerosSheet.vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import CustomToast from '@/components/Generales/CustomToast.vue'
import EditarCuentaTerceroSheet from '@/components/Cuentas/EditarCuentaTerceroSheet.vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const route = useRoute()
const tipo = ref('propia')
const cuentaOrigen = ref('')
const cuentaDestino = ref('')
const cuentaTerceroSeleccionada = ref('')
const cuentaTerceroManual = ref('')
const cuentasPendientes = ref<any[]>([])
const monto = ref('')
const descripcion = ref('')
const tokenEnvio = ref('')
const token = ref('')
const tokenSolicitado = ref(false)
const solicitando = ref(false)
const tokenValidado = ref(false)
const validando = ref(false)
const toastRef = ref()
const cargandoTransferencia = ref(false)
const validacionId = ref(null)
const cuentaSeleccionada = ref(null)
const router = useRouter()

watch(cuentaSeleccionada, (nuevaCuenta) => {
  cuentaOrigen.value = nuevaCuenta?.noCuenta?.toString() ?? ''
})

const showToast = (tipo: string, titulo: string, mensaje: string) => {
  toastRef.value?.mostrarToast({ tipo, titulo, mensaje })
}
function agregarCuentaPendienteYSeleccionar(cuenta: any) {
  if (!cuentasPendientes.value.some(c => c.noCuenta === cuenta.noCuenta)) {
    cuentasPendientes.value.push({
      id: 'pendiente-' + Date.now(),
      ...cuenta
    })
  }

  cuentaTerceroSeleccionada.value = cuenta.noCuenta
}

const sheetEditarAbierto = ref(false)
const cuentaSeleccionadaEditar = ref<any>(null)

const abrirSheetCuenta = (cuenta: any) => {
  cuentaSeleccionadaEditar.value = cuenta
  sheetEditarAbierto.value = true
}

const solicitarToken = async () => {
  if (!tokenEnvio.value) return alert('Selecciona un canal para enviar el token.')
  const tipoSolicitud = tipo.value === 'propia' ? 'Transferencia propia' : 'Transferencia de terceros'
  solicitando.value = true
  try {
    await axios.post('https://interappapi.onrender.com/api/cuentas/solicitar-codigo-validacion', {
      tipoSolicitud,
      enviadoPor: tokenEnvio.value
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    tokenSolicitado.value = true
  } catch (err) {
    alert('Error al solicitar el token.')
    console.error(err)
  } finally {
    solicitando.value = false
  }
}

const validarToken = async () => {
  if (!token.value) return alert('Ingrese el token.')
  validando.value = true
  try {
    const res = await axios.post('https://interappapi.onrender.com/api/auth/verificar-codigo-reciclable', {
      codigo: token.value,
      tipoSolicitud: tipo.value === 'propia' ? 'Transferencia propia' : 'Transferencia de terceros'
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    validacionId.value = res.data.idValidacion
    tokenValidado.value = true
    alert('Token verificado correctamente.')
  } catch (err) {
    tokenValidado.value = false
    alert('Token inválido o expirado.')
    console.error(err)
  } finally {
    validando.value = false
  }
}

const cuentas = ref([])
const cuentasTerceros = ref([])

const cargarCuentasPropias = async () => {
  try {
    const res = await axios.get('https://interappapi.onrender.com/api/cuentas/mis-cuentas', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    cuentas.value = res.data
  } catch (error) {
    console.error('Error al cargar cuentas propias:', error)
  }
}

const cargarCuentasTerceros = async () => {
  try {
    const res = await axios.get('https://interappapi.onrender.com/api/cuentas-terceros/terceros-user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    cuentasTerceros.value = res.data
  } catch (error) {
    console.error('Error al cargar cuentas de terceros:', error)
  }
}

onMounted(() => {
  cargarCuentasPropias()
  cargarCuentasTerceros()
  const pendiente = localStorage.getItem('cuentaPendienteTercero')
  if (pendiente) {
    const parsed = JSON.parse(pendiente)
    cuentasPendientes.value.push(parsed)
    cuentaTerceroSeleccionada.value = parsed.noCuenta
  }
  watch(cuentas, () => {
    if (route.query.cuentaId && cuentas.value.length) {
      const encontrada = cuentas.value.find(c => c.id == route.query.cuentaId)
      if (encontrada) {
        cuentaSeleccionada.value = encontrada
      }
    }
  })
})

const saldoDisponible = computed(() => {
  const cuenta = cuentas.value.find(c => c.noCuenta === cuentaOrigen.value)
  return cuenta?.saldoCuenta ?? 0
})

const cuentaTercero = computed(() =>
  cuentaTerceroSeleccionada.value === 'manual' ? cuentaTerceroManual.value : cuentaTerceroSeleccionada.value
)

const cuentasDisponiblesTerceros = computed(() => {
  const pendientesFiltradas = cuentasPendientes.value.filter(p =>
    !cuentasTerceros.value.some(t => t.noCuenta === p.noCuenta)
  )
  return [...cuentasTerceros.value, ...pendientesFiltradas]
})
watch([cuentaTerceroSeleccionada, cuentaTerceroManual], () => {
  if (
    cuentaTerceroSeleccionada.value === 'manual' &&
    cuentaTerceroManual.value &&
    !cuentasPendientes.value.some(c => c.noCuenta === cuentaTerceroManual.value)
  ) {
    cuentasPendientes.value.push({
      id: 'pendiente-' + Date.now(),
      noCuenta: cuentaTerceroManual.value,
      aliasCuenta: 'Cuenta temporal'
    })
  }
})
const realizarTransferencia = async () => {
  if (!cuentaOrigen.value) return showToast('error', 'Validación', 'Selecciona una cuenta de origen.')
  const destino = tipo.value === 'propia' ? cuentaDestino.value : cuentaTercero.value
  if (!destino) return showToast('error', 'Validación', 'Selecciona o ingresa una cuenta destino.')

  if (tipo.value === 'propia' && cuentaOrigen.value === cuentaDestino.value) {
    return showToast('error', 'Validación', 'La cuenta de origen y destino no pueden ser la misma.')
  }

  if (!monto.value || parseFloat(monto.value) <= 0) {
    return showToast('error', 'Validación', 'Ingresa un monto válido.')
  }

  if (parseFloat(monto.value) > saldoDisponible.value) {
    return showToast('error', 'Validación', 'El monto excede el saldo disponible.')
  }

  if (!tokenValidado.value) return showToast('error', 'Validación', 'Debes validar el token antes de continuar.')
  if (!validacionId.value) return showToast('error', 'Validación', 'No se obtuvo ID de validación del token.')

  cargandoTransferencia.value = true
  try {
    if (tipo.value === 'terceros') {
      cuentasPendientes.value = cuentasPendientes.value.filter(
        c => c.noCuenta !== cuentaTercero.value
      )
    }
    const payload = {
      tipoTransferencia: tipo.value,
      cuentaOrigen: cuentaOrigen.value,
      cuentaDestino: destino,
      monto: parseFloat(monto.value),
      descripcionTransferencia: descripcion.value,
      idValidacion: validacionId.value
    }
    const res = await axios.post('https://interappapi.onrender.com/api/transferencias/realizar', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    showToast('success', 'Éxito', res.data.message || 'Transferencia realizada con éxito.')
    const idTransferencia = res.data.transferenciaId
    router.push(`/dashboard/transferencia-recibo/${idTransferencia}`)
    if (tipo.value === 'terceros' && cuentaTerceroSeleccionada.value === 'manual' && cuentaTerceroManual.value) {
      cuentasPendientes.value.push({
        id: 'temp-' + Date.now(),
        aliasCuenta: 'Pendiente aprobación',
        noCuenta: cuentaTerceroManual.value
      })
    }

    cuentaOrigen.value = ''
    cuentaDestino.value = ''
    cuentaTerceroSeleccionada.value = ''
    cuentaTerceroManual.value = ''
    monto.value = ''
    descripcion.value = ''
    token.value = ''
    tokenValidado.value = false
    tokenSolicitado.value = false
    cuentasPendientes.value = cuentasPendientes.value.filter(
      c => c.noCuenta !== cuentaTercero.value
    )
    localStorage.removeItem('cuentaPendienteTercero')
    cuentasPendientes.value = cuentasPendientes.value.filter(c => c.noCuenta !== destino)
  } catch (error: any) {
    const mensaje = error?.response?.data?.message || 'Ocurrió un error al procesar la transferencia.'
    showToast('error', 'Error', mensaje)
    console.error(error)
  } finally {
    cargandoTransferencia.value = false
  }
}
</script>
