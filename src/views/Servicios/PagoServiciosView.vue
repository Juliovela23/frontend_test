<template>
  <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 space-y-6">

    <h2 class="text-2xl font-bold text-center text-[#15385c] mb-4">Pago de Servicios</h2>

    <!-- 1. Selector de servicio -->
    <div>
      <label class="block font-semibold mb-1 text-[#15385c]">¿Qué servicio deseas pagar?</label>
      <div class="flex gap-3">
        <button
          v-for="serv in servicios"
          :key="serv.id"
          @click="seleccionarServicio(serv)"
          :class="[
            'rounded-lg px-5 py-3 text-center font-semibold transition flex-1 flex flex-col items-center justify-center gap-1 border',
            servicio?.id === serv.id
              ? 'bg-[#e7f8fd] border-[#01a7e4] text-[#01a7e4]'
              : 'bg-gray-50 border-gray-200 text-[#15385c] hover:bg-cyan-50'
          ]"
        >
          <span class="text-2xl">{{ serv.icon }}</span>
          {{ serv.nombre }}
        </button>
      </div>
    </div>

    <!-- 2. Favoritos (si hay) -->
    <div v-if="favoritosPorServicio.length" class="mb-2">
      <div class="text-xs text-[#15385c] font-semibold mb-1">Tus empresas favoritas:</div>
      <div class="flex gap-4">
        <button
          v-for="emp in favoritosPorServicio"
          :key="emp.id"
          @click="seleccionarEmpresa(emp)"
          class="flex flex-col items-center focus:outline-none"
        >
          <img :src="emp.logo" class="w-10 h-10 object-contain rounded-full border-2 border-[#01a7e4] shadow mb-1" />
          <span class="text-xs font-medium text-[#15385c]">{{ emp.nombre }}</span>
        </button>
      </div>
    </div>

    <!-- 3. Empresas (con logos) -->
    <div v-if="servicio" class="mb-2">
      <label class="block font-semibold mb-1 text-[#15385c]">Selecciona la empresa</label>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="emp in empresasFiltradas"
          :key="emp.id"
          @click="seleccionarEmpresa(emp)"
          :class="[
            'rounded-xl border-2 p-3 flex flex-col items-center gap-2 focus:outline-none transition',
            empresa?.id === emp.id ? 'border-[#01a7e4] bg-cyan-50' : 'border-gray-200 bg-gray-50 hover:bg-cyan-50'
          ]"
        >
          <img :src="emp.logo" class="w-14 h-14 object-contain rounded-lg shadow" />
          <span class="text-[13px] font-semibold text-[#15385c]">{{ emp.nombre }}</span>
        </button>
      </div>
    </div>

    <!-- 4. Formulario de referencia y monto -->
    <div v-if="empresa">
      <!-- Logo seleccionado arriba -->
      <div class="flex items-center gap-3 mb-2">
        <img :src="empresa.logo" class="w-8 h-8 object-contain rounded-lg border" />
        <div>
          <span class="text-sm font-bold text-[#15385c]">{{ empresa.nombre }}</span>
        </div>
      </div>
      <div class="mb-2">
        <label class="block font-semibold mb-1 text-[#15385c]">
          {{ empresa.referencia }}
        </label>
        <input
          class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#01a7e4] outline-none"
          v-model="referencia"
          :placeholder="'Ingrese ' + empresa.referencia"
        />
      </div>
      <div class="mb-2">
        <label class="block font-semibold mb-1 text-[#15385c]">Monto a pagar</label>
        <input
          type="number"
          min="1"
          class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#01a7e4] outline-none"
          placeholder="Q 0.00"
          v-model.number="monto"
        />
      </div>
      <div class="mb-2">
        <label class="block font-semibold mb-1 text-[#15385c]">Cuenta a debitar</label>
        <select
          class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#01a7e4] outline-none"
          v-model="cuenta"
        >
          <option disabled value="">Seleccione una cuenta</option>
          <option v-for="cta in cuentas" :key="cta.numero" :value="cta">
            {{ cta.nombre }} ({{ cta.numero }})
          </option>
        </select>
      </div>
    </div>

    <!-- Resumen -->
    <div v-if="empresa && cuenta && monto && referencia" class="bg-[#e7f8fd] p-4 rounded-lg mt-2 text-[#15385c]">
      <div class="font-semibold">Resumen:</div>
      <div>Servicio: <b>{{ servicio?.nombre }}</b></div>
      <div>Empresa: <b>{{ empresa?.nombre }}</b></div>
      <div>Referencia: <b>{{ referencia }}</b></div>
      <div>Monto: <b>Q {{ monto?.toFixed(2) }}</b></div>
      <div>Cuenta: <b>{{ cuenta?.nombre }} ({{ cuenta?.numero }})</b></div>
    </div>

    <!-- Botón de pagar -->
    <button
      v-if="empresa && cuenta && monto && referencia"
      class="w-full bg-[#01a7e4] hover:bg-[#008fbe] text-white font-bold py-3 rounded-lg text-lg shadow transition mt-2"
      @click="pagar"
    >
      Pagar servicio
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Datos DEMO (ajusta los logos a los tuyos)
const servicios = [
  { id: 'luz', nombre: 'Luz', icon: '💡' },
  { id: 'agua', nombre: 'Agua', icon: '🚰' },
  { id: 'internet', nombre: 'Internet', icon: '🌐' },
  { id: 'telefono', nombre: 'Teléfono', icon: '☎️' },
]

const empresas = [
  { id: 'eegsa', nombre: 'EEGSA', logo: '/img/eegsa-logo.png', servicio: 'luz', referencia: 'NIS' },
  { id: 'energuate', nombre: 'Energuate', logo: '/img/energuate-logo.png', servicio: 'luz', referencia: 'No. Contrato' },
  { id: 'empagua', nombre: 'Empagua', logo: '/img/empagua-logo.png', servicio: 'agua', referencia: 'No. Suministro' },
  { id: 'tigo', nombre: 'Tigo', logo: '/img/tigo-logo.png', servicio: 'internet', referencia: 'Número de Cliente' },
  { id: 'claro', nombre: 'Claro', logo: '/img/claro-logo.png', servicio: 'internet', referencia: 'Teléfono' },
  { id: 'telefonica', nombre: 'Telefonica', logo: '/img/telefonica-logo.png', servicio: 'telefono', referencia: 'Número Telefónico' },
]

const cuentas = [
  { nombre: 'Cuenta Principal', numero: '001-234567-8' },
  { nombre: 'Cuenta Ahorro', numero: '003-001000-7' }
]

const servicio = ref(null)
const empresa = ref(null)
const cuenta = ref('')
const referencia = ref('')
const monto = ref(null)

// Favoritos demo: los 2 más usados por el usuario
const favoritos = ref(['eegsa', 'tigo'])

const favoritosPorServicio = computed(() =>
  empresas.filter(e => favoritos.value.includes(e.id) && (!servicio.value || e.servicio === servicio.value.id))
)
const empresasFiltradas = computed(() =>
  empresas.filter(e => servicio.value && e.servicio === servicio.value.id)
)

function seleccionarServicio(serv) {
  servicio.value = serv
  empresa.value = null
  referencia.value = ''
  monto.value = null
  cuenta.value = ''
}
function seleccionarEmpresa(emp) {
  empresa.value = emp
  referencia.value = ''
  monto.value = null
  cuenta.value = ''
}

// Demo de pago/favoritos
function pagar() {
  // Guardar en favoritos (máx 4)
  if (!favoritos.value.includes(empresa.value.id)) {
    favoritos.value.unshift(empresa.value.id)
    if (favoritos.value.length > 4) favoritos.value.pop()
  }
  alert('Pago realizado correctamente.')
}
</script>
