<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold mb-4 text-[#15385c]">Historial de Transferencias</h1>

    <div class="mb-4 flex gap-4 items-center">
      <Input v-model="filtroBusqueda" placeholder="Buscar por número o descripción" class="max-w-sm" />
      <Button @click="cargarTransferencias">Buscar</Button>
    </div>

    <div v-if="loading" class="text-center py-10 text-[#15385c]">Cargando transferencias...</div>

    <div v-else-if="transferencias.length === 0" class="text-center py-10 text-gray-500">
      No se encontraron transferencias.
    </div>

    <div v-else class="space-y-4">
      <Card v-for="t in transferencias" :key="t.noTransferencia">
        <CardContent class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium text-[#15385c]">Transferencia #{{ t.noTransferencia }}</p>
            <p class="text-xs text-gray-500">Cuenta destino: ****{{ t.cuentaDestino?.slice(-4) }}</p>
            <p class="text-xs text-gray-400">{{ t.tipoTransferencia }} - {{ formatDate(t.fechaTransferencia) }}</p>
          </div>
          <div class="text-right">
            <p class="text-green-600 font-semibold">Q{{ t.monto.toFixed(2) }}</p>
            <Button variant="outline" @click="verRecibo(t.id)">Ver recibo</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const transferencias = ref([])
const filtroBusqueda = ref('')
const loading = ref(false)
const router = useRouter()

const cargarTransferencias = async () => {
  loading.value = true
  try {
    const response = await axios.get('https://interappapi.onrender.com/api/transferencias/mis-transferencias', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Transferencias cargadas:', response.data)
    transferencias.value = response.data.filter(t =>
      t.noTransferencia.includes(filtroBusqueda.value) ||
      (t.descripcion ?? '').toLowerCase().includes(filtroBusqueda.value.toLowerCase())
    )
  } catch (error) {
    console.error('Error al cargar transferencias:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (fecha) => new Date(fecha).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' })

const verRecibo = (id) => {
  router.push(`/dashboard/transferencia-recibo/${id}`)
}

onMounted(cargarTransferencias)
</script>

<style scoped>
</style>
