<template>
  <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 space-y-6">
    <h2 class="text-2xl font-bold text-center text-[#15385c] mb-4">
      Transferencia Programada
    </h2>

    <!-- 1. Selección tipo de transferencia -->
    <div class="mb-4 flex gap-3 justify-center">
      <button v-for="tipo in tiposTransferencia" :key="tipo.value" @click="tipoSeleccionado = tipo.value" :class="[
        'px-4 py-2 rounded-full border font-semibold transition text-sm',
        tipoSeleccionado === tipo.value
          ? 'bg-[#01a7e4] border-[#01a7e4] text-white'
          : 'bg-gray-100 border-gray-200 text-[#15385c] hover:bg-cyan-50'
      ]">
        {{ tipo.label }}
      </button>
    </div>

    <!-- 2. Cuenta origen -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">Cuenta origen</label>
      <select v-model="origen" class="w-full rounded-lg border px-4 py-2">
        <option disabled value="">Selecciona cuenta</option>
        <option v-for="cta in cuentas" :key="cta.id" :value="cta">
          {{ cta.nombreCuenta ?? 'Cuenta' }} ({{ cta.noCuenta }}) - Saldo Q{{ cta.saldoCuenta?.toFixed(2) ?? '0.00' }}
        </option>
      </select>
      <div v-if="origen && monto && monto > origen.saldoCuenta"
        class="mt-1 text-red-600 text-xs font-semibold flex items-center gap-1">
        <span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        Saldo insuficiente
      </div>
    </div>

    <!-- 3. Cuenta destino -->
    <div v-if="tipoSeleccionado === 'propia'">
      <label class="block font-semibold mb-1 text-[#15385c]">Cuenta destino</label>
      <select v-model="destino" class="w-full rounded-lg border px-4 py-2">
        <option disabled value="">Selecciona cuenta propia</option>
        <option v-for="cta in cuentas.filter(c => c.noCuenta !== origen?.noCuenta)" :key="cta.id" :value="cta">
          {{ cta.nombreCuenta ?? 'Cuenta' }} ({{ cta.noCuenta }})
        </option>
      </select>
    </div>

    <div v-if="tipoSeleccionado === 'terceros'">
      <label class="block font-semibold mb-1 text-[#15385c]">Cuenta de terceros</label>
      <select v-model="destino" class="w-full rounded-lg border px-4 py-2">
        <option disabled value="">Selecciona cuenta de tercero</option>
        <option v-for="cta in cuentasTerceros" :key="cta.id" :value="cta">
          {{ cta.aliasCuenta ?? cta.nombre }} ({{ cta.noCuenta }})
        </option>
      </select>
    </div>

    <!-- 4. Monto -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">Monto a transferir</label>
      <input type="number" min="1" class="w-full rounded-lg border px-4 py-2" placeholder="Q 0.00"
        v-model.number="monto" />
    </div>

    <!-- 5. Fecha y hora -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block font-semibold mb-1 text-[#15385c]">Fecha de ejecución</label>
        <input type="date" class="w-full rounded-lg border px-4 py-2" v-model="fecha" />
      </div>
      <div>
        <label class="block font-semibold mb-1 text-[#15385c]">Hora</label>
        <input type="time" class="w-full rounded-lg border px-4 py-2" v-model="hora" />
      </div>
    </div>

    <!-- 6. Periodicidad -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">Periodicidad</label>
      <select v-model="periodicidad" class="w-full rounded-lg border px-4 py-2">
        <option value="once">Única vez</option>
        <option value="semanal">Semanal</option>
        <option value="quincenal">Quincenal</option>
        <option value="mensual">Mensual</option>
        <option value="personalizada">Personalizada</option>
      </select>
    </div>

    <!-- 7. Notificar -->
    <div class="flex items-center gap-2">
      <input type="checkbox" v-model="notificar" id="notificar" class="accent-[#01a7e4]" />
      <label for="notificar" class="text-sm text-[#15385c] font-medium cursor-pointer">Notificarme antes de
        ejecutar</label>
    </div>

    <!-- 8. Nota -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">Nota/Descripción (opcional)</label>
      <textarea v-model="nota" rows="2" class="w-full rounded-lg border px-4 py-2 resize-none"
        placeholder="Ej: Pago programado, ahorro mensual, etc."></textarea>
    </div>

    <!-- 9. Simulación -->
    <div v-if="monto && periodicidad !== 'once'" class="bg-[#e7f8fd] rounded-lg p-3 text-[#15385c] text-sm mb-1">
      <span class="font-semibold">Simulación:</span>
      <span>
        En un año se transferirán
        <b>
          {{
            periodicidad === 'mensual'
              ? 12
              : periodicidad === 'quincenal'
                ? 24
                : periodicidad === 'semanal'
                  ? 52
                  : 0
          }}</b>
        veces. Total:
        <b>Q {{
          (
            periodicidad === 'mensual'
              ? monto * 12
              : periodicidad === 'quincenal'
                ? monto * 24
                : periodicidad === 'semanal'
                  ? monto * 52
                  : 0
          ).toFixed(2)
        }}</b>
      </span>
    </div>

    <!-- 10. Token -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">Canal para enviar token</label>
      <select v-model="tokenEnvio" class="w-full rounded-lg border px-4 py-2 mb-2">
        <option disabled value="">Seleccione canal</option>
        <option value="email">Correo</option>
        <option value="sms">SMS</option>
      </select>

      <button @click="solicitarToken" :disabled="solicitando || !tokenEnvio"
        class="w-full bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-2 rounded-lg shadow transition mb-2">
        <span v-if="solicitando"
          class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent inline-block"></span>
        <span v-else>📨 Solicitar token</span>
      </button>
    </div>

    <div v-if="tokenSolicitado">
      <label class="block font-semibold mb-1 text-[#15385c]">Token de validación</label>
      <div class="flex gap-2">
        <input v-model="token" class="flex-1 rounded-lg border px-4 py-2" placeholder="Ingresa el token" />
        <button @click="validarToken" :disabled="validando || tokenValidado"
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg shadow">
          <span v-if="validando"
            class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent inline-block"></span>
          <span v-else>Validar</span>
        </button>
      </div>
    </div>

    <!-- 11. Botón -->
    <button
      class="w-full bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-3 rounded-lg text-lg shadow transition mt-2"
      @click="abrirConfirmacion" :disabled="!puedeProgramar || !tokenValidado">
      Programar transferencia
    </button>

    <!-- Modal confirmación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40">
      <div class="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg">
        <h3 class="text-xl font-bold mb-4 text-[#15385c]">¿Confirmar programación?</h3>
        <div class="space-y-2 text-[#15385c]">
          <div><b>Tipo:</b> {{ tipoSeleccionadoLabel }}</div>
          <div><b>De:</b> {{ origen?.nombreCuenta }} ({{ origen?.noCuenta }})</div>
          <div><b>Para:</b> {{ destino?.nombreCuenta ?? destino?.aliasCuenta }} ({{ destino?.noCuenta }})</div>
          <div><b>Monto:</b> Q{{ monto?.toFixed(2) }}</div>
          <div><b>Fecha:</b> {{ fecha }} <span v-if="hora">({{ hora }})</span></div>
          <div><b>Periodicidad:</b> {{ mostrarPeriodicidad }}</div>
          <div v-if="nota"><b>Nota:</b> {{ nota }}</div>
          <div v-if="notificar"><b>Se notificará antes de ejecutar.</b></div>
        </div>
        <div class="flex gap-4 mt-5">
          <button @click="confirmarTransferencia"
            class="flex-1 bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-2 rounded-lg transition">
            Confirmar
          </button>
          <button @click="showModal = false"
            class="flex-1 border border-[#01a7e4] text-[#01a7e4] font-bold py-2 rounded-lg transition">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const tiposTransferencia = [
  { value: 'propia', label: 'Propia' },
  { value: 'terceros', label: 'Terceros' }
]

const tipoSeleccionado = ref('propia')
const origen = ref('')
const destino = ref('')
const monto = ref(null)
const fecha = ref('')
const hora = ref('')
const periodicidad = ref('once')
const notificar = ref(false)
const nota = ref('')
const showModal = ref(false)
const tokenEnvio = ref('')
const token = ref('')
const tokenSolicitado = ref(false)
const solicitando = ref(false)
const tokenValidado = ref(false)
const validando = ref(false)
const validacionId = ref(null)

const cuentas = ref([])
const cuentasTerceros = ref([])

const puedeProgramar = computed(() => {
  if (!origen.value || !monto.value || !fecha.value || !periodicidad.value) return false
  if (tipoSeleccionado.value === 'propia' && !destino.value) return false
  if (tipoSeleccionado.value === 'terceros' && !destino.value) return false
  return true
})

const mostrarPeriodicidad = computed(() => {
  switch (periodicidad.value) {
    case 'once': return 'Única vez'
    case 'semanal': return 'Semanal'
    case 'quincenal': return 'Quincenal'
    case 'mensual': return 'Mensual'
    default: return 'Personalizada'
  }
})

const tipoSeleccionadoLabel = computed(() => {
  const tipo = tiposTransferencia.find(t => t.value === tipoSeleccionado.value)
  return tipo ? tipo.label : ''
})

async function solicitarToken() {
  if (!tokenEnvio.value) return alert('Selecciona un canal para enviar el token.')
  solicitando.value = true
  try {
    await axios.post('https://interappapi.onrender.com/api/cuentas/solicitar-codigo-validacion', {
      tipoSolicitud: tipoSeleccionado.value === 'propia' ? 'Transferencia propia' : 'Transferencia terceros',
      enviadoPor: tokenEnvio.value
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    Swal.fire({ icon: 'success', title: 'Token solicitado', text: `El token ha sido enviado por ${tokenEnvio.value}.` })
    tokenSolicitado.value = true
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al solicitar el token.' })
  } finally {
    solicitando.value = false
  }
}

async function validarToken() {
  if (!token.value) return alert('Ingresa el token.')
  validando.value = true
  try {
    const res = await axios.post('https://interappapi.onrender.com/api/auth/verificar-codigo-reciclable', {
      codigo: token.value,
      tipoSolicitud: tipoSeleccionado.value === 'propia' ? 'Transferencia propia' : 'Transferencia terceros'
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    validacionId.value = res.data.idValidacion
    tokenValidado.value = true
    console.log('ID de validación:', validacionId.value)
    Swal.fire({ icon: 'success', title: 'Token verificado', text: 'Token correcto.' })
  } catch (err) {
    tokenValidado.value = false
    Swal.fire({ icon: 'error', title: 'Error de validación', text: err.response?.data?.message || 'Token inválido.' })
  } finally {
    validando.value = false
  }
}

function abrirConfirmacion() {
  showModal.value = true
}

async function confirmarTransferencia() {
  showModal.value = false
  const payload = {
    cuentaOrigen: origen.value.noCuenta,
    cuentaDestinoManual: tipoSeleccionado.value === 'propia' ? destino.value.noCuenta : null,
    cuentaTerceroId: tipoSeleccionado.value === 'terceros' ? destino.value.id : null,
    monto: monto.value,
    descripcion: nota.value,
    fechaProgramada: new Date(`${fecha.value}T${hora.value || '00:00:00'}`),
    frecuencia: mostrarPeriodicidad.value,
    ValidacionId: validacionId.value,
    notificarAntes: notificar.value // ✅ Aquí va tu checkbox
  }


  try {
    const res = await axios.post('https://interappapi.onrender.com/api/transferencias-programadas', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    Swal.fire({ icon: 'success', title: 'Transferencia programada', text: 'Tu transferencia se programó correctamente.' })
    window.location.reload()

  } catch (err) {
    console.error(err)
    Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al programar la transferencia.' })
  }
}

async function cargarCuentas() {
  try {
    const res1 = await axios.get('https://interappapi.onrender.com/api/cuentas/mis-cuentas', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    cuentas.value = res1.data

    const res2 = await axios.get('https://interappapi.onrender.com/api/cuentas-terceros/terceros-user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    cuentasTerceros.value = res2.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  cargarCuentas()
})
</script>
