<template>
<div class="flex-1 p-4 pt-0 space-y-4">


        <!-- ✅ Carrusel (sin el botón “+” dentro) -->
        <Carousel v-if="usaCarrusel" class="w-full max-w-screen-lg mx-auto" :opts="{ align: 'start' }">
          <CarouselContent class="px-4 pr-4 gap-4">
            <CarouselItem v-for="card in cards" :key="card.id" class="shrink-0 grow-0 basis-[300px]">
              <AccountCard :card="card" :account="cuentasSimuladas[card.referenciaId]" :colorFondo="card.colorFondo" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <!-- ✅ Botón Agregar SIEMPRE visible si hay más de 6 -->

        <div v-if="usaCarrusel" class="w-full max-w-screen-lg mx-auto flex justify-start">
          <SheetForm>
          </SheetForm>

        </div>
        <!-- ✅ Grid normal si son 6 o menos (botón incluido al final) -->
         
        <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          
          <AccountCard v-for="card in cards" :key="card.id" :card="card" :account="cuentasSimuladas[card.referenciaId]"
            :colorFondo="card.colorFondo" />
          <!-- Botón “+” dentro del grid -->
          <SheetForm>
          </SheetForm>
        </div>
      </div>

      <NoticiasCard class="w-full max-w-screen-lg mx-auto mt-4" />
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import AccountCard from '../components/cards/AccountCard.vue';
import SheetForm from '../components/cards/SheetForm.vue';
import NoticiasCard from '../components/NoticiasCard.vue';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useAuth } from '@/composables/useAuth.js';const cards = [
  { id: '1', tipo: 'cuenta', referenciaId: 'CUENTA_001', tituloPersonalizado: 'Mi Cuenta Principal', icono: 'wallet', colorFondo: '#0055ff', orden: 1 },
  { id: '2', tipo: 'cuenta', referenciaId: 'CUENTA_002', tituloPersonalizado: 'Cuenta Jubilacion', icono: 'wallet', colorFondo: '#002244', orden: 2 },
  { id: '3', tipo: 'cuenta', referenciaId: 'CUENTA_003', tituloPersonalizado: 'Cuenta Mujer cooperativista', icono: 'wallet', colorFondo: '#ff4fa1', orden: 3 },
  { id: '4', tipo: 'cuenta', referenciaId: 'CUENTA_004', tituloPersonalizado: 'Cuenta de Ahorro', icono: 'wallet', colorFondo: '#6b21a8', orden: 4 },
  { id: '5', tipo: 'cuenta', referenciaId: 'CUENTA_005', tituloPersonalizado: 'Mi Segunda Cuenta', icono: 'wallet', colorFondo: '#0f766e', orden: 5 },
  { id: '6', tipo: 'cuenta', referenciaId: 'CUENTA_006', tituloPersonalizado: 'Mi Tercer Ahorro', icono: 'wallet', colorFondo: '#b45309', orden: 6 },
  { id: '7', tipo: 'cuenta', referenciaId: 'CUENTA_007', tituloPersonalizado: 'Cuenta Opcional', icono: 'wallet', colorFondo: '#334155', orden: 7 },
  { id: '8', tipo: 'cuenta', referenciaId: 'CUENTA_007', tituloPersonalizado: 'Cuenta Opcional', icono: 'wallet', colorFondo: '#334155', orden: 8 },
  




]

const cuentasSimuladas = {
  CUENTA_001: { numeroCuenta: '001-234567-8', nombre: 'Nombre cuenta', saldo: 15000.55 },
  CUENTA_002: { numeroCuenta: '000-000000-0', nombre: 'Nombre cuenta', saldo: 25000.00 },
  CUENTA_003: { numeroCuenta: '000-000000-0', nombre: 'Nombre cuenta', saldo: 25000.00 },
  CUENTA_004: { numeroCuenta: '003-001000-7', nombre: 'Mi ahorro', saldo: 18500.75 },
  CUENTA_005: { numeroCuenta: '004-982398-3', nombre: 'Cuenta secundaria', saldo: 8200.00 },
  CUENTA_006: { numeroCuenta: '005-442222-1', nombre: 'Fondo personal', saldo: 42000.00 },
  CUENTA_007: { numeroCuenta: '006-654321-9', nombre: 'Inversion joven', saldo: 11000.50 }
}

const usaCarrusel = computed(() => cards.length > 8)

function abrirModalAgregar() {
  console.log('Abrir modal para agregar tarjeta o acceso directo')
}
</script>