<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
    <div class="w-full max-w-xl rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg p-8 space-y-6 border border-gray-200">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-[#002C5F]">Comprobante de Transferencia</h1>
        <p class="text-sm text-gray-500">Detalle completo de tu transacción</p>
      </div>

      <div v-if="transferencia" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Número de transferencia</p>
            <p class="font-semibold text-[#15385c]">{{ transferencia.noTransferencia }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Fecha y hora</p>
            <p class="font-semibold">{{ new Date(transferencia.fecha).toLocaleString() }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Desde</p>
            <p class="font-medium">***{{ transferencia.cuentaOrigen?.slice(-4) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Hacia</p>
            <p class="font-medium">***{{ transferencia.cuentaDestino?.slice(-4) }}</p>
          </div>

          <div class="col-span-2">
            <p class="text-sm text-gray-500">Descripción</p>
            <p class="text-gray-700">{{ transferencia.descripcionTransferencia || 'Sin descripción' }}</p>
          </div>

          <div class="col-span-2 text-center py-4">
            <p class="text-2xl font-bold text-green-700">Q{{ transferencia.monto.toFixed(2) }}</p>
            <p class="text-sm text-gray-500">Monto transferido</p>
          </div>
        </div>

        <div class="border-t pt-4 text-sm text-center text-gray-400">
          <p>InterApp™ | Transacción segura</p>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        <p>Cargando información de la transferencia...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const route = useRoute()
const transferenciaId = route.params.id as string
const transferencia = ref<any>(null)
console.log('Transferencia ID:', transferenciaId)
onMounted(async () => {
  try {
    const res = await axios.get(`https://interappapi.onrender.com/api/transferencias/recibo/${transferenciaId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    console.log('Datos de transferencia recibidos:', res.data)
    
    transferencia.value = res.data
  } catch (err) {
    console.error('Error al obtener transferencia:', err)
  }
})


</script>