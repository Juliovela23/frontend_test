<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import axios from 'axios'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
const { toast } = useToast()

const form = ref({
    numeroCuenta: '',
    motivo: '',
    canalEnvio: '',
    token: '',
})

// Estados de UI
const cuentaVerificada = ref(false)
const datosCuenta = ref<any>(null)
const esperandoToken = ref(false)
const tokenSolicitado = ref(false)
const loadingVerifica = ref(false)
const loadingToken = ref(false)
const loadingAgregar = ref(false)
const errorMsg = ref('')
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})
async function verificarCuenta() {
    errorMsg.value = ''
    loadingVerifica.value = true
    datosCuenta.value = null
    cuentaVerificada.value = false
    try {
        // Tu endpoint real (ajusta la URL base si lo necesitas)
        const { data } = await axios.get(
            'https://interappapi.onrender.com/api/cuentas/buscar-cuenta',
            {
                headers: getAuthHeaders(),
                params: { numCuenta: form.value.numeroCuenta }
            }
        )
        // data = CuentaDto
        datosCuenta.value = {
            nombre: data.nombreCuenta,
            tipo: data.tipoCuentaNombre,
            numero: data.noCuenta
        }
        cuentaVerificada.value = true
    } catch (e) {
        errorMsg.value = e.response?.status === 404
            ? 'No se encontró la cuenta, revisa el número e inténtalo de nuevo.'
            : 'Hubo un error inesperado.'
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
        toast({
                title: '¡Atencion!',
                description: 'Esto esta aun en implementacion.',
                variant: 'destructive',
            })
        //alert('El envío de token por SMS se implementará pronto.')
        return
    } else {
        loadingToken.value = true

        try {
            // El backend toma userId del JWT, así que solo mandamos estos dos campos
            const response = await axios.post('https://interappapi.onrender.com/api/cuentas/solicitar-codigo-validacion', {
                tipoSolicitud: 'AgregarCuenta',             // Puedes parametrizarlo si gustas
                enviadoPor: form.value.canalEnvio           // Debe ser 'email' o 'sms' según opción
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            toast({
                title: '¡Éxito!',
                description: response.data.message || 'El código fue enviado a su correo.',
                variant: 'success'
            })
            tokenSolicitado.value = true
        } catch (e) {
            errorMsg.value = 'No se pudo enviar el token. Intente nuevamente.'
        } finally {
            loadingToken.value = false
        }
    }

}

async function agregarCuenta() {
    errorMsg.value = ''
    if (!form.value.token) {
        errorMsg.value = 'Ingresa el token recibido.'
        return
    }
    loadingAgregar.value = true
    // Aquí deberías validar el token y guardar la cuenta
    await new Promise(r => setTimeout(r, 900))
    loadingAgregar.value = false
    alert('¡Cuenta de terceros agregada!')
}

const canales = [
    { value: 'correo', label: 'Correo electrónico' },
    { value: 'sms', label: 'SMS' },
]
</script>

<template>
     <Toaster />
    <Sheet>
        <SheetTrigger as-child>
            <button type="button"
                class="bg-[#f754a5] hover:bg-[#db2883] text-white text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1 shadow transition">
                <span class="text-base">＋</span> Agregar cuenta
            </button>
        </SheetTrigger>
        <SheetContent>
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
