<template>
  <div class="flex-1 p-4 pt-0 space-y-4">
    <!-- Loader: se muestra hasta que TODO está listo -->
    <div v-if="loading">
      <div v-if="loaderType === 'spinner'" class="flex items-center justify-center min-h-[200px] w-full">
        <svg class="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A8 8 0 104 12z"/>
        </svg>
        <span class="ml-4 text-lg text-cyan-800">Cargando tarjetas...</span>
      </div>
      <div v-else-if="loaderType === 'skeleton'" class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 my-8">
        <div v-for="n in 3" :key="n" class="bg-gray-200 rounded-xl shadow-md h-[180px] w-[300px] animate-pulse"></div>
      </div>
    </div>

    <!-- Cards y contenido solo si !loading -->
    <div v-else>
      <Carousel v-if="usaCarrusel" class="w-full max-w-screen-lg mx-auto" :opts="{ align: 'start' }">
        <CarouselContent class="px-4 pr-4 gap-4">
          <CarouselItem v-for="card in cards" :key="card.id" class="shrink-0 grow-0 basis-[300px]">
            <AccountCard
              :card="card"
              :account="infoCards[card.referenciaId] ?? null"
              :colorFondo="card.colorFondo"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div v-if="usaCarrusel" class="w-full max-w-screen-lg mx-auto flex justify-start">
        <SheetForm @created="fetchCards"/>
      </div>
      <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <AccountCard
          v-for="card in cards"
          :key="card.id"
          :card="card"
          :account="infoCards[card.referenciaId] ?? null"
          :colorFondo="card.colorFondo"
        />
        <SheetForm @created="fetchCards"/>
      </div>
    </div>
    <NoticiasCard class="w-full max-w-screen-lg mx-auto mt-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import axios from 'axios';

const loaderType = ref<'spinner' | 'skeleton'>('spinner');
const loading = ref(false);
const error = ref('');
const cards = ref<any[]>([]);
const infoCards = ref<Record<string, any>>({}); // Mapea referenciaId → data real

// Trae datos de cuenta por referenciaId
async function obtenerDatosCard(card: any) {
  const token = localStorage.getItem('token');
  try {
    if (card.tipo?.toLowerCase() === 'cuenta') {
      //console.log('Obteniendo datos de card:', encodeURIComponent(card.referenciaId));

      const { data } = await axios.get(
        `https://interappapi.onrender.com/api/cuentas/buscar-cuenta?numCuenta=${encodeURIComponent(card.referenciaId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Datos de cuenta:', data);
      return data;
    }
    // Si luego tienes crédito, agregar aquí
    return null;
  } catch (e) {
    return null;
  }
}

async function fetchCards() {
  try {
    loading.value = true;
    error.value = '';
    const token = localStorage.getItem('token');
    const { data } = await axios.get('https://interappapi.onrender.com/api/shortcuts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Cards obtenidas:', cards.value);
    // Busca la info real de cada card (en paralelo)
    const infos = await Promise.all(
      data.map(async (card: any) => {
        let info = null;
        if (card.tipo?.toLowerCase() === 'cuenta') {
          info = await obtenerDatosCard(card);
          
        }
        // Otros tipos en el futuro aquí
        return { key: card.referenciaId, info };
      })
    );
    console.log('Infos obtenidas:', infos);
    cards.value = data;

    // Mapear infoCards
    infoCards.value = {};
    for (const { key, info } of infos) {
      if (key) infoCards.value[key] = info;
    }
    console.log('infoCards.keys:', Object.keys(infoCards.value));
    console.log('referenciaId en cards:', cards.value.map(c => c.referenciaId));
  } catch (e) {
    error.value = 'No se pudieron cargar tus accesos directos';
    cards.value = [];
    infoCards.value = {};
  } finally {
    loading.value = false;
  }
}


onMounted(fetchCards);

const usaCarrusel = computed(() => cards.value.length > 8);
</script>
