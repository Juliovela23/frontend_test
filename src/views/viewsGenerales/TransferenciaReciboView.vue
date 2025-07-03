<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg border relative p-6">
      <!-- Toggle -->
      <!-- Mostrar switch solo si ya cargó transferencia -->
      <div v-if="transferencia" class="flex items-center gap-2 justify-end">
        <label class="switch">
          <input type="checkbox" v-model="mostrarDatos" />
          <span class="slider"></span>
        </label>
        <span class="text-sm text-gray-700 font-medium">Ver datos personales</span>
      </div>

      <!-- Encabezado -->
      <div class="text-center border-b pb-3">
        <h1 class="text-xl font-bold text-[#005531]">Comprobante de transferencia</h1>
        <p class="text-xs text-gray-500">Transferencia realizada exitosamente</p>
      </div>

      <div v-if="transferencia" class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">N° de referencia:</span>
          <span class="font-medium text-[#15385c]">{{ transferencia.noTransferencia }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Fecha y hora:</span>
          <span class="text-gray-800">{{ new Date(transferencia.fecha).toLocaleString() }}</span>
        </div>

        <!-- Cuenta de débito -->
        <div>
          <p class="text-gray-500 text-sm">Cuenta de débito:</p>
          <p class="text-gray-800 text-right text-sm">
            {{ mostrarDatos
              ? transferencia.nombreUsuarioOrigen + " / " + transferencia.tipo_cuentaOrigen + " / " +
              transferencia.cuentaOrigen
              : '***' + transferencia.cuentaOrigen?.slice(-4) }}
          </p>
        </div>

        <!-- Cuenta a acreditar -->
        <div>
          <p class="text-gray-500 text-sm">Cuenta a acreditar:</p>
          <p class="text-gray-800 text-right text-sm">
            {{ mostrarDatos
              ? transferencia.nombreUsuarioDestino + " / " + transferencia.tipo_cuentaDestino + " / " +
              transferencia.cuentaDestino
              : '***' + transferencia.cuentaDestino?.slice(-4) }}
          </p>
        </div>


        <div class="flex justify-between">
          <span class="text-gray-500">Monto debitado:</span>
          <span class="font-semibold text-red-600">-Q{{ transferencia.monto.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Monto acreditado:</span>
          <span class="font-semibold text-green-600">Q{{ transferencia.monto.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Descripción:</span>
          <span class="text-gray-800">{{ transferencia.descripcion || 'Sin descripción' }}</span>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 mt-6">Cargando transferencia...</div>

      <!-- Footer -->
      <div class="border-t mt-6 pt-2 text-xs text-center text-gray-400">
        <p>InterApp™ | Transacción segura</p>
        <p v-if="mostrarDatos"></p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
const route = useRoute()
const transferenciaId = route.params.id as string

const transferencia = ref<any>(null)
const mostrarDatos = ref(false) // ✅ <-- esta es la variable faltante

onMounted(async () => {
  try {
    const res = await axios.get(`https://interappapi.onrender.com/api/transferencias/recibo/${transferenciaId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    transferencia.value = res.data
  } catch (err) {
    Swal.fire({
  icon: "error",
  title: "Ha ocurrido un error.",
  text: "Error al obtener la transferencia. Por favor, inténtalo de nuevo más tarde."+err,
  footer: '<a href="#">Why do I have this issue?</a>'
});
    //console.error('Error al obtener transferencia:', err)
  }
})
</script>
<style scoped>
.switch {
  font-size: 14px;
  position: relative;
  display: inline-block;
  width: 2.6em;
  height: 1.4em;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #9fccfa;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.4em;
  width: 1.4em;
  inset: 0;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.switch input:checked+.slider {
  background: #0974f1;
}

.switch input:checked+.slider:before {
  transform: translateX(1.2em);
}
</style>