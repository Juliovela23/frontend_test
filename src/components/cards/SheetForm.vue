<script setup lang="ts">
import { ref } from 'vue'
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

const form = ref({
    tipo: 'cuenta',
    referenciaId: '',
    accion: '',
    tituloPersonalizado: '',
    icono: '',
    colorFondo: '#0055ff',
})

function guardarTarjeta() {
    if (!form.value.tituloPersonalizado || !form.value.referenciaId) {
        alert('Título y Referencia ID son obligatorios')
        return
    }
    console.log('Guardando tarjeta:', form.value)
}
import ComboboxDoble from '../cards/ComboboxDoble.vue'

const rotando = ref(false)

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
                    <Label for="titulo">Título personalizado</Label>
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
                    <Label for="icono">Seleccione una opcion</Label>

                    <ComboboxDoble v-model="form" />
                </div>
                <div>
                    <Label for="color">Color de fondo</Label>
                    <Input id="color" type="color" v-model="form.colorFondo" class="h-10 w-20 p-0 cursor-pointer" />
                </div>
            </div>

            <SheetFooter>
                <SheetClose as-child>
                    <Button type="button" @click="guardarTarjeta" class="w-full">
                        Guardar Tarjeta
                    </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
