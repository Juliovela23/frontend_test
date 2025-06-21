<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import NotificationBell from '../components/Dashboard/NotificationBell.vue'

import AppSidebar from '../components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const { getUser } = useAuth()
const user = ref(getUser())
const show = ref(false)

onMounted(() => {
  show.value = true
})


const fechaHora = ref('')
function formatoFechaHora(date: Date) {
  // Formato: martes, 11 jun 2025, 15:23:18
  return date.toLocaleString('es-GT', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  // Inicializar fechaHora
  fechaHora.value = formatoFechaHora(new Date())
  // Actualizar cada segundo
  setInterval(() => {
    fechaHora.value = formatoFechaHora(new Date())
  }, 1000)
})

const { isAuthenticated, logout } = useAuth()
</script>

<template>

  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <!-- Fecha y hora actual -->
              <div class="w-full max-w-screen-lg mx-auto flex justify-end mb-0 mt-2 select-none">
                <span
                  class="flex items-center gap-2 text-xs sm:text-sm text-gray-100 font-mono bg-[#063266] rounded-xl px-4 py-1 shadow-md border border-cyan-400/70">
                  <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" />
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-linecap="round" />
                  </svg>
                  {{ fechaHora }}
                </span>
              </div>

            </BreadcrumbItem>
            <!-- <BreadcrumbSeparator class="hidden md:block" />-->
            <BreadcrumbItem>


            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="fixed top-4 right-4 z-50">
          <NotificationBell />
        </div>

      </header>

      <!-- Contenido principal de la página -->
      <div class="flex-1 p-4 pt-0 space-y-4">
        <router-view />
      </div>

    </SidebarInset>
  </SidebarProvider>
</template>
