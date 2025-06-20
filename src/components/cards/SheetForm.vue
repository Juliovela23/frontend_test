<script setup lang="ts">
import { ref } from 'vue'
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

const form = ref({
    tipo: 'cuenta', // obligatoria
    referenciaId: '',
    accion: '',
    orden: 0,
    tituloPersonalizado: '',
    icono: '',
    colorFondo: '#0055ff',
    activo: true, // por defecto true
})

// Recibe como prop una función para refrescar las cards después de crear una nueva
const props = defineProps({
    onCardCreated: {
        type: Function,
        required: false
    }
})

const loading = ref(false)

async function guardarTarjeta() {
    // Validación rápida
    if (!form.value.tipo || !form.value.tituloPersonalizado) {
        alert('El campo "Tipo" y "Título personalizado" son obligatorios')
        return
    }
    try {
        loading.value = true
        const token = localStorage.getItem('token')
        // Crea el DTO (puedes limpiar aquí lo que envías)
        const dataToSend = {
            tipo: form.value.tipo,
            referenciaId: form.value.referenciaId || null,
            accion: form.value.accion || null,
            orden: Number(form.value.orden) || 0,
            tituloPersonalizado: form.value.tituloPersonalizado,
            icono: form.value.icono || null,
            colorFondo: form.value.colorFondo,
            activo: form.value.activo
        }
        await axios.post(
            'https://interappapi.onrender.com/api/shortcuts',
            dataToSend,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        // Limpia el form
        form.value = {
            tipo: 'cuenta',
            referenciaId: '',
            accion: '',
            orden: 0,
            tituloPersonalizado: '',
            icono: '',
            colorFondo: '#0055ff',
            activo: true
        }
        // Refresca las cards en el padre si existe la función
        if (props.onCardCreated) props.onCardCreated()
    } catch (e) {
        alert('Ocurrió un error al crear la tarjeta')
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
                <div>
                    <Label hidden for="tipo">Tipo *</Label>
                    <Input type="hidden" id="tipo" v-model="form.tipo" placeholder="cuenta / credito / accion" />
                </div>
                <!-- Aquí tu combobox doble si lo necesitas -->
                <ComboboxDoble v-model="form" />
                <div>
                    <Label for="titulo">Título personalizado *</Label>
                    <Input id="titulo" v-model="form.tituloPersonalizado" placeholder="Mi cuenta ahorro..." />
                </div>
                <div>
                    <Label for="referencia">Referencia ID</Label>
                    <Input id="referencia" v-model="form.referenciaId" placeholder="CUENTA_008" />
                </div>
                <div>
                    <Label for="accion">Acción (opcional)</Label>
                    <Input id="accion" v-model="form.accion" placeholder="ver-saldo / pagar..." />
                </div>
                <div>
                    <Label for="icono">Ícono</Label>
                    <Input id="icono" v-model="form.icono" placeholder="wallet / credit-card / bolt..." />
                </div>
                <div>
                    <Label for="color">Color de fondo</Label>
                    <Input id="color" type="color" v-model="form.colorFondo" class="h-10 w-20 p-0 cursor-pointer" />
                </div>
                <div>
                    <Label for="orden">Orden</Label>
                    <Input id="orden" type="number" v-model="form.orden" min="0" />
                </div>
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
