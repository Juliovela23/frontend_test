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

// Estados del formulario
const form = ref({
    tipoCuenta: '',       // "Cuenta corriente No. 0000"
    alias: '',            // Alias para la cuenta
    numeroCuenta: '',     // No. de cuenta
    descripcion: '',      // Descripción (opcional)
    tokenEnvio: '',       // Opción para envío de token
    tokenValidacion: '',  // Token de validación
    validar: false,       // Checkbox de validar cuenta
})

function guardarCuentaTerceros() {
    if (!form.value.tipoCuenta || !form.value.alias || !form.value.numeroCuenta) {
        alert('Todos los campos obligatorios deben completarse.')
        return
    }
    // Simula guardar (puedes emitir evento aquí si lo deseas)
    alert('¡Cuenta de terceros agregada!')
    console.log('Datos enviados:', form.value)
}
</script>

<template>
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

            <div class="grid gap-4 py-4">
                <!-- Seleccione tipo de cuenta -->
                <div>
                    <Label for="tipoCuenta" class="mb-1">Seleccione el tipo de cuenta</Label>
                    <select id="tipoCuenta" v-model="form.tipoCuenta"
                        class="w-full rounded-md border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                        <option value="">Seleccione...</option>
                        <option>Cuenta corriente No. 0000</option>
                        <option>Cuenta de ahorro No. 0001</option>
                        <!-- Agrega más opciones aquí -->
                    </select>
                </div>

                <!-- Alias -->
                <div>
                    <Label for="alias" class="mb-1">Escoja un alias para la cuenta</Label>
                    <Input id="alias" v-model="form.alias" placeholder="Escriba como desea que se guarde la cuenta" />
                </div>

                <!-- Número de cuenta -->
                <div>
                    <Label for="numeroCuenta" class="mb-1">No. cuenta</Label>
                    <Input id="numeroCuenta" v-model="form.numeroCuenta" placeholder="No. 0000000000" />
                </div>

                <!-- Descripción -->
                <div>
                    <Label for="descripcion" class="mb-1">Descripción de agregar cuenta (opcional)</Label>
                    <textarea id="descripcion" v-model="form.descripcion" rows="2"
                        class="w-full rounded-md border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 p-2 resize-none"
                        placeholder="Descripción o motivo por el cual realiza la transferencia"></textarea>
                </div>

                <!-- Validar cuenta -->
                <div class="flex items-center gap-2">
                    
                    <Button type="button" class="ml-auto bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-36"
                        @click="guardarCuentaTerceros">
                        Validar cuenta
                    </Button>
                </div>

                <!-- Token de validación -->
                <div>
                    <Label for="tokenEnvio" class="mb-1">Token de validación</Label>
                    <select id="tokenEnvio" v-model="form.tokenEnvio"
                        class="w-full rounded-md border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                        <option value="">Seleccione una opcion para envío de token</option>
                        <option>Email</option>
                        <option>SMS</option>
                        <!-- Más opciones aquí -->
                    </select>
                </div>
                <div>
                    <Input id="tokenValidacion" v-model="form.tokenValidacion"
                        placeholder="Introduzca el token de validación, para agregar cuenta" />
                </div>
            </div>

            <SheetFooter>
                <SheetClose as-child>
                    <Button type="button" class="w-full bg-cyan-500 hover:bg-cyan-600 font-semibold"
                        @click="guardarCuentaTerceros">
                        <span class="mr-1">🔑</span> solicitar token
                    </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
