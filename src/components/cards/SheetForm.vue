<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import ComboboxDoble from '../cards/ComboboxDoble.vue'
import Swal from 'sweetalert2'
// === FORM STATE ===
const form = ref({
    tipo: 'cuenta',
    referenciaId: '',
    accion: '',
    orden: 0,
    tituloPersonalizado: '',
    icono: '',
    colorFondo: '#0055ff',
    activo: true,
})

const props = defineProps({
    onCardCreated: {
        type: Function,
        required: false
    }
})

const loading = ref(false)

// === CAMPOS CONDICIONALES ===
const esCuentaOCredito = computed(() =>
    form.value.tipo === 'cuenta' || form.value.tipo === 'credito'
)
const esAccion = computed(() =>
    form.value.tipo === 'accion'
)

// Opciones de acciones predeterminadas
const accionesDisponibles = [
    { value: 'cuentas', label: 'Cuentas', icon: 'wallet' },
    { value: 'transferencias', label: 'Transferencias', icon: 'transfer' },
    { value: 'historial-transferencias', label: 'Historial de transferencias', icon: 'history' },
    { value: 'creditos', label: 'Créditos', icon: 'credit-card' },
    { value: 'servicios', label: 'Servicios', icon: 'bolt' },
    { value: 'estados-cuenta', label: 'Estados de cuenta', icon: 'file-invoice' },
    //{ value: 'reportes', label: 'Reportes', icon: 'chart-bar' },
    { value: 'notificaciones', label: 'Notificaciones', icon: 'bell' },
    //{ value: 'ajustes', label: 'Ajustes', icon: 'cog' },
    //{ value: 'programadas', label: 'Programadas', icon: 'calendar' },
]

// === FUNCION GUARDAR ===
async function guardarTarjeta() {
    if (!form.value.tipo || !form.value.tituloPersonalizado) {
        alert('El campo "Tipo" y "Título personalizado" son obligatorios')
        return
    }

    try {
        loading.value = true
        const token = localStorage.getItem('token')

        // 🔑 Lógica específica por tipo
        if (esCuentaOCredito.value) {
            form.value.accion = null
            form.value.icono = form.value.tipo === 'cuenta' ? 'wallet' : 'credit-card'
        }
        if (esAccion.value) {
            const accionSeleccionada = accionesDisponibles.find(a => a.value === form.value.accion)
            form.value.referenciaId = 'accion_general'
            form.value.icono = accionSeleccionada?.icon || 'bolt'
        }

        // 🔢 Obtener el orden automáticamente del backend
        const countResp = await axios.get(
            'https://interappapi.onrender.com/api/shortcuts/count',
            { headers: { Authorization: `Bearer ${token}` } }
        )
        form.value.orden = countResp.data + 1

        const dataToSend = {
            tipo: form.value.tipo,
            referenciaId: form.value.referenciaId,
            accion: form.value.accion,
            orden: form.value.orden,
            tituloPersonalizado: form.value.tituloPersonalizado,
            icono: form.value.icono,
            colorFondo: form.value.colorFondo,
            activo: form.value.activo
        }

        await axios.post(
            'https://interappapi.onrender.com/api/shortcuts',
            dataToSend,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        Swal.fire({
            icon: 'success',
            title: 'Tarjeta creada',
            text: 'La tarjeta se ha creado exitosamente.'
        }).then(() => {
            window.location.reload()
        })

        // Limpiar
        form.value = {
            tipo: 'cuenta',
            referenciaId: '',
            accion: '',
            orden: 0,
            tituloPersonalizado: '',
            icono: '',
            colorFondo: '#0055ff',
            activo: true,
        }

        if (props.onCardCreated) props.onCardCreated()

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Error al crear tarjeta',
            text: e.response?.data?.message || 'Ocurrió un error al crear la tarjeta.'
        })
        //alert('Ocurrió un error al crear la tarjeta')
    } finally {
        loading.value = false
    }
}
</script>


<template>
    <Sheet>
        <SheetTrigger as-child>
            <div class="w-[280px] min-h-[180px] rounded-xl border-2 border-dashed border-cyan-400 flex items-center justify-center cursor-pointer
        hover:-translate-y-2 hover:shadow-cyan-400/30 hover:bg-cyan-50/20 transition-all duration-300 shadow-md">
                <span class="text-5xl font-bold text-cyan-400">+</span>
            </div>
        </SheetTrigger>

        <SheetContent>
            <SheetHeader>
                <SheetTitle>Agregar Tarjeta</SheetTitle>
                <SheetDescription>
                    Completa los siguientes campos para crear un acceso directo personalizado.
                </SheetDescription>
            </SheetHeader>

            <div class="grid gap-4 py-4">

                <!-- Selector de TIPO SIEMPRE visible -->
                <div>
                    <Label for="tipo">Tipo *</Label>
                    <select id="tipo" v-model="form.tipo" class="w-full p-2 border rounded">
                        <option disabled value="">Selecciona un tipo</option>
                        <option value="cuenta">Cuenta</option>
                        <option value="credito">Crédito</option>
                        <option value="accion">Opción general</option>
                    </select>
                </div>

                <!-- ComboboxDoble solo para cuenta/credito -->
                <ComboboxDoble v-if="esCuentaOCredito" v-model="form.referenciaId" :tipo="form.tipo" />

                <!-- Acción solo para tipo 'accion' -->
                <div v-if="esAccion">
                    <Label for="accion">Acción</Label>
                    <select id="accion" v-model="form.accion" class="w-full p-2 border rounded">
                        <option disabled value="">Selecciona una acción</option>
                        <option v-for="accion in accionesDisponibles" :key="accion.value" :value="accion.value">
                            {{ accion.label }}
                        </option>
                    </select>
                </div>

                <!-- Título siempre -->
                <div>
                    <Label for="titulo">Título personalizado *</Label>
                    <Input id="titulo" v-model="form.tituloPersonalizado" placeholder="Mi cuenta ahorro..." />
                </div>

                <!-- Color fondo -->
                <div>
                    <Label for="color">Color de fondo</Label>
                    <Input id="color" type="color" v-model="form.colorFondo" class="h-10 w-20 p-0 cursor-pointer" />
                </div>

                <!-- Activo -->
                <div>
                    <label class="inline-flex items-center gap-2">
                        <input type="checkbox" v-model="form.activo" />
                        <span class="text-sm">Activo</span>
                    </label>
                </div>

            </div>

            <SheetFooter>
                <SheetClose as-child>
                    <Button type="button" @click="guardarTarjeta" class="w-full" :disabled="loading">
                        {{ loading ? 'Guardando...' : 'Guardar Tarjeta' }}
                    </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
