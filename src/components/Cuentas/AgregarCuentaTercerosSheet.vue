<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import axios from 'axios'
import CustomToast from '../Generales/CustomToast.vue'
import Swal from 'sweetalert2'

const form = ref({
    numeroCuenta: '',
    alias: '',
    motivo: '',
    canalEnvio: '',
    token: '',
})

const toastRef = ref()
const emit = defineEmits(['cuenta-agregada'])

const cuentaVerificada = ref(false)
const datosCuenta = ref<any>(null)
const tokenSolicitado = ref(false)
const loadingVerifica = ref(false)
const loadingToken = ref(false)
const loadingAgregar = ref(false)
const errorMsg = ref('')

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

function showToast(tipo: string, titulo: string, mensaje: string) {
    toastRef.value?.mostrarToast({
        tipo,
        titulo,
        mensaje
    })
}

async function verificarCuenta() {
    errorMsg.value = ''
    loadingVerifica.value = true
    datosCuenta.value = null
    cuentaVerificada.value = false
    try {
        const { data } = await axios.get(
            'https://interappapi.onrender.com/api/cuentas/buscar-cuenta',
            {
                headers: getAuthHeaders(),
                params: { numCuenta: form.value.numeroCuenta }
            }
        )
        datosCuenta.value = {
            nombre: data.nombreCuenta,
            tipo: data.tipoCuentaNombre,
            numero: data.noCuenta
        }
        cuentaVerificada.value = true
        localStorage.setItem('cuentaPendienteTercero', JSON.stringify({
            noCuenta: data.noCuenta,
            aliasCuenta: data.nombreCuenta || 'Cuenta temporal'
        }))
        emit('cuenta-agregada', {
            noCuenta: form.value.numeroCuenta,
            aliasCuenta: form.value.alias || datosCuenta.value.nombre || 'Cuenta temporal'
        })

    } catch (e) {
       
        errorMsg.value = e.response?.status === 404
      ? 'No se encontró la cuenta, revisa el número e inténtalo de nuevo.'
      : 'Hubo un error inesperado.'

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMsg.value,
      confirmButtonText: 'Cerrar',
    })
    } finally {
        loadingVerifica.value = false
    }
}

async function solicitarToken() {
    errorMsg.value = ''
    if (!form.value.canalEnvio) {
        errorMsg.value = 'Selecciona un canal para recibir el token.'
        return
    }
    if (form.value.canalEnvio == "SMS") {
        showToast('error', '¡Atención!', 'Esto aún está en implementación.')
        return
    }

    loadingToken.value = true

    try {
        const response = await axios.post('https://interappapi.onrender.com/api/cuentas/solicitar-codigo-validacion', {
            tipoSolicitud: 'AgregarCuentaTercero',
            enviadoPor: form.value.canalEnvio
        }, {
            headers: getAuthHeaders()
        })

        showToast('success', '✅ Éxito', response.data.message || 'El código fue enviado a su correo.')
        
        tokenSolicitado.value = true
    } catch (e) {
        showToast('error', '❌ Error', 'No se pudo enviar el token.')
    } finally {
        loadingToken.value = false
    }
}

async function agregarCuenta() {
    errorMsg.value = ''

    if (!form.value.token || !form.value.numeroCuenta || !form.value.alias || !form.value.motivo) {
        errorMsg.value = 'Completa todos los campos requeridos.'
        return
    }

    loadingAgregar.value = true

    try {
        const response = await fetch('https://interappapi.onrender.com/api/cuentas-terceros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                noCuenta: form.value.numeroCuenta,
                aliasCuenta: form.value.alias,
                razonAgregada: form.value.motivo,
                codigoVerificacion: form.value.token
            })
        })

        const data = await response.json()

        if (!response.ok) {
            showToast('error', '❌ Error', data.mensaje || 'Error al agregar cuenta.')
            return
        }

        showToast('success', '✅ Éxito', data.mensaje || 'Cuenta agregada correctamente.')

        form.value = { numeroCuenta: '', alias: '', motivo: '', canalEnvio: '', token: '' }
        cuentaVerificada.value = false
        tokenSolicitado.value = false
        datosCuenta.value = null

    } catch (err) {
        showToast('error', '❌ Error', err.message)
    } finally {
        loadingAgregar.value = false
    }
}

const canales = [
    { value: 'correo', label: 'Correo electrónico' },
    { value: 'sms', label: 'SMS' },
]
</script>


<template>
    <CustomToast ref="toastRef" />

    <Sheet>
        <SheetTrigger as-child>
            <button type="button"
                class="bg-[#f754a5] hover:bg-[#db2883] text-white text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1 shadow transition">
                <span class="text-base">＋</span> Agregar cuenta
            </button>
        </SheetTrigger>
        <SheetContent aria-describedby="">
            <SheetHeader>
                <SheetTitle>Añadir cuenta de terceros</SheetTitle>
            </SheetHeader>
            <div class="grid gap-6 py-6">
                <!-- 1. Número de cuenta -->
                <div>
                    <Label for="numeroCuenta" class="mb-1">Número de cuenta</Label>
                    <Input id="numeroCuenta" v-model="form.numeroCuenta" :disabled="cuentaVerificada"
                        placeholder="No. 0000000000" />
                </div>
                <!-- Botón verificar cuenta -->
                <div>
                    <Button type="button" class="w-full bg-cyan-500 hover:bg-cyan-600 font-semibold"
                        :disabled="!form.numeroCuenta || loadingVerifica || cuentaVerificada" @click="verificarCuenta">
                        {{ loadingVerifica ? 'Verificando...' : 'Verificar cuenta' }}
                    </Button>
                </div>

                <!-- Si cuenta está verificada, muestra info -->
                <div v-if="cuentaVerificada"
                    class="bg-cyan-100/70 rounded-lg p-3 shadow-inner flex flex-col gap-1 text-cyan-900">
                    <div><b>Nombre:</b> {{ datosCuenta.nombre }}</div>
                    <div><b>Tipo:</b> {{ datosCuenta.tipo }}</div>
                    <div><b>Número:</b> {{ datosCuenta.numero }}</div>
                </div>
                <!-- Alias para la cuenta -->
                <div v-if="cuentaVerificada">
                    <Label for="alias" class="mb-1">Alias para la cuenta</Label>
                    <Input id="alias" v-model="form.alias" placeholder="Ej: nombre de la persona" />
                </div>
                <!-- Motivo o razón -->
                <div v-if="cuentaVerificada">
                    <Label for="motivo" class="mb-1">Razón para usar la cuenta</Label>
                    <textarea id="motivo" v-model="form.motivo" rows="2"
                        class="w-full rounded-md border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 p-2 resize-none"
                        placeholder="¿Para qué utilizarás esta cuenta?"></textarea>
                </div>

                <!-- Canal para token -->
                <div v-if="cuentaVerificada">
                    <Label for="canalEnvio" class="mb-1">¿Cómo deseas recibir el token?</Label>
                    <select v-model="form.canalEnvio" class="w-full border rounded px-3 py-2">
                        <option disabled value="">Selecciona una opción...</option>
                        <option v-for="c in canales" :key="c.value" :value="c.value">{{ c.label }}</option>
                    </select>
                </div>
                <!-- Botón solicitar token -->
                <div v-if="cuentaVerificada && form.canalEnvio">
                    <Button type="button" class="w-full bg-yellow-400 hover:bg-yellow-500 font-semibold"
                        :disabled="loadingToken || tokenSolicitado" @click="solicitarToken">
                        {{ loadingToken ? 'Solicitando token...' : 'Solicitar token' }}
                    </Button>
                </div>
                <!-- Campo token y agregar -->
                <div v-if="tokenSolicitado">
                    <Label for="token" class="mb-1">Ingresa el token recibido</Label>
                    <Input id="token" v-model="form.token" placeholder="Token de validación" />
                </div>
                <div v-if="tokenSolicitado">
                    <Button type="button" class="w-full bg-cyan-500 hover:bg-cyan-600 font-semibold"
                        :disabled="loadingAgregar" @click="agregarCuenta">
                        {{ loadingAgregar ? 'Agregando...' : 'Agregar cuenta' }}
                    </Button>
                </div>
                <!-- Error -->
                <div v-if="errorMsg" class="text-red-500 text-sm text-center mt-2">{{ errorMsg }}</div>
            </div>
        </SheetContent>
    </Sheet>
</template>
