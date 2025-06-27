<template>
  <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 space-y-6">
    <h2 class="text-2xl font-bold text-center text-[#15385c] mb-4">Transferencia Programada</h2>

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
      <!-- Badge de advertencia -->
      <div v-if="origen && monto && monto > origen.saldo"
        class="mt-1 text-red-600 text-xs font-semibold flex items-center gap-1">
        <span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        Saldo insuficiente
      </div>
    </div>

    <!-- 3. Cuenta destino dinámica -->
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

    <div v-if="tipoSeleccionado === 'ach'">
      <label class="block font-semibold mb-1 text-[#15385c]">Banco destino</label>
      <select v-model="banco" class="w-full rounded-lg border px-4 py-2 mb-2">
        <option disabled value="">Selecciona banco</option>
        <option v-for="b in bancos" :key="b" :value="b">{{ b }}</option>
      </select>
      <label class="block font-semibold mb-1 text-[#15385c]">No. cuenta destino</label>
      <input v-model="destinoAch" class="w-full rounded-lg border px-4 py-2 mb-2" placeholder="Número de cuenta" />
      <label class="block font-semibold mb-1 text-[#15385c]">Nombre beneficiario</label>
      <input v-model="nombreAch" class="w-full rounded-lg border px-4 py-2" placeholder="Nombre completo" />
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

    <!-- 7. Notificarme antes de ejecutar -->
    <div class="flex items-center gap-2">
      <input type="checkbox" v-model="notificar" id="notificar" class="accent-[#01a7e4]" />
      <label for="notificar" class="text-sm text-[#15385c] font-medium cursor-pointer">Notificarme antes de
        ejecutar</label>
    </div>

    <!-- 8. Nota/Descripción -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">Nota/Descripción (opcional)</label>
      <textarea v-model="nota" rows="2" class="w-full rounded-lg border px-4 py-2 resize-none"
        placeholder="Ej: Pago programado, ahorro mensual, etc."></textarea>
    </div>

    <!-- 9. Simulación de montos periódicos -->
    <div v-if="monto && periodicidad !== 'once'" class="bg-[#e7f8fd] rounded-lg p-3 text-[#15385c] text-sm mb-1">
      <span class="font-semibold">Simulación:</span>
      <span>
        En un año se transferirán <b>
          {{
            periodicidad === 'mensual'
              ? 12
              : periodicidad === 'quincenal'
                ? 24
                : periodicidad === 'semanal'
                  ? 52
                  : 0
          }}</b>
        veces. Total: <b>Q {{
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

    <!-- 10. Resumen y modal de confirmación -->
    <button
      class="w-full bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-3 rounded-lg text-lg shadow transition mt-2"
      @click="abrirConfirmacion" :disabled="!puedeProgramar">
      Programar transferencia
    </button>

    <!-- Modal de confirmación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40">
      <div class="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg">
        <h3 class="text-xl font-bold mb-4 text-[#15385c]">¿Confirmar programación?</h3>
        <div class="space-y-2 text-[#15385c]">
          <div><b>Tipo:</b> {{ tipoSeleccionadoLabel }}</div>
          <div><b>De:</b> {{ origen?.nombre }} ({{ origen?.numero }})</div>
          <div v-if="tipoSeleccionado === 'ach'">
            <b>Banco:</b> {{ banco }}<br />
            <b>Cuenta destino:</b> {{ destinoAch }}<br />
            <b>Beneficiario:</b> {{ nombreAch }}
          </div>
          <div v-else>
            <b>Para:</b> {{ destino?.nombre }} ({{ destino?.numero }})
          </div>
          <div><b>Monto:</b> Q{{ monto?.toFixed(2) }}</div>
          <div><b>Fecha:</b> {{ fecha }} <span v-if="hora">({{ hora }})</span></div>
          <div><b>Periodicidad:</b> {{ mostrarPeriodicidad }}</div>
          <div v-if="nota"><b>Nota:</b> {{ nota }}</div>
          <div v-if="notificar"><b>Se notificará antes de ejecutar.</b></div>
        </div>
        <div class="flex gap-4 mt-5">
          <button @click="confirmarTransferencia"
            class="flex-1 bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-2 rounded-lg transition">Confirmar</button>
          <button @click="showModal = false"
            class="flex-1 border border-[#01a7e4] text-[#01a7e4] font-bold py-2 rounded-lg transition">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
const tiposTransferencia = [
  { value: 'propia', label: 'Propia' },
  { value: 'terceros', label: 'Terceros' },
  { value: 'ach', label: 'ACH' }
]


const bancos = ['Banrural', 'BI', 'G&T Continental', 'BAC', 'Bantrab']

const tipoSeleccionado = ref('propia')
const origen = ref('')
const destino = ref('')
const banco = ref('')
const destinoAch = ref('')
const nombreAch = ref('')
const monto = ref(null)
const fecha = ref('')
const hora = ref('')
const periodicidad = ref('once')
const notificar = ref(false)
const nota = ref('')
const showModal = ref(false)

const puedeProgramar = computed(() => {
  if (!origen.value || !monto.value || !fecha.value || !periodicidad.value) return false
  if (tipoSeleccionado.value === 'propia' && !destino.value) return true
  if (tipoSeleccionado.value === 'terceros' && !destino.value) return false
  if (tipoSeleccionado.value === 'ach' && (!banco.value || !destinoAch.value || !nombreAch.value)) return false
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
});
const cuentas = ref([])
const cuentasTerceros = ref([])

const cargarCuentasPropias = async () => {
  try {
    const res = await axios.get('https://interappapi.onrender.com/api/cuentas/mis-cuentas', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    cuentas.value = res.data
    console.log('Cuentas propias cargadas:', cuentas.value)
  } catch (error) {
    console.error('Error al cargar cuentas propias:', error)
  }
}

const cargarCuentasTerceros = async () => {
  try {
    const res = await axios.get('https://interappapi.onrender.com/api/cuentas-terceros/terceros-user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    console.log('Cuentas de terceros:', res.data)
    cuentasTerceros.value = res.data
  } catch (error) {
    console.error('Error al cargar cuentas de terceros:', error)
  }
}

const tipoSeleccionadoLabel = computed(() => {
  const tipo = tiposTransferencia.find(t => t.value === tipoSeleccionado.value)
  return tipo ? tipo.label : ''
})
async function confirmarTransferencia() {
  showModal.value = false

  const payload = {
  cuentaOrigen: origen.value.noCuenta, // ✅ Este es obligatorio
  cuentaDestinoManual: tipoSeleccionado.value === 'propia' ? destino.value.noCuenta : null, // ✅ opcional
  cuentaTerceroId: tipoSeleccionado.value === 'terceros' ? destino.value.id : null,
  monto: monto.value,
  descripcion: nota.value,
  fechaProgramada: new Date(`${fecha.value}T${hora.value || '00:00:00'}`),
  frecuencia: mostrarPeriodicidad.value
}

  try {
    const response = await axios.post('https://interappapi.onrender.com/api/transferencias-programadas', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Transferencia creada:', response.data)
    // Mostrar toast o redirigir
  } catch (error) {
    console.error('Error al crear transferencia:', error)
    // Mostrar toast de error
  }
}
function abrirConfirmacion() {
  showModal.value = true
}
onMounted(() => {
  cargarCuentasPropias()
  cargarCuentasTerceros()
})
</script>
