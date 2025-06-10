<template>
  
  <div class="min-h-screen w-screen flex items-center justify-center bg-[#002C5F]">
    <div class="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Panel Izquierdo: Login -->
      <div class="w-full md:w-1/2 p-8 sm:p-10 space-y-6">
        <div class="flex justify-center mb-4">
          <img src="../image/logo.png" alt="Logo" class="h-16 w-16 object-contain" />
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-900">Bienvenido</h2>
        <p class="text-sm text-center text-gray-500">Por favor inicie sesion</p>

        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">DPI/Usuario</label>
            <input
              v-model="email"
              type="input"
              placeholder="Ingrese su DPI o Usuario"
              class="mt-1 w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-[#002C5F] outline-none"
            />
          </div>

          <div>
            <div class="flex justify-between items-center">
              <label class="block text-sm font-medium text-gray-700">Contraseña</label>
              <a href="#" class="text-sm text-[#002C5F] hover:underline">Olvido su contraseña?</a>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="mt-1 w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-[#002C5F] outline-none"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm text-center -mt-2">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-2 rounded-md text-white bg-[#002C5F] hover:bg-[#001e42] text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Iniciar sesion</span>
            <span v-else class="animate-pulse">Loading...</span>
          </button>
        </form>

        <!-- <p class="text-sm text-center text-gray-600">
          Don't have an account?
          <a href="#" class="text-[#002C5F] hover:underline">Sign up</a>
        </p>-->
      </div> 


          <div class="hidden md:block md:w-1/2 flex items-center justify-center bg-gradient-animated rounded-r-xl">
            <div class="text-center text-[#002C5F] p-10">
              <img
                src="../image/LogoInterAPP.png"
                alt="InterApp Logo"
                class="w-40 h-40 object-contain mx-auto mb-4"
              />
              
              <p class="text-lg font-semibold mt-4">Gestiona de forma inteligente</p>
              <p class="text-sm mt-2">Transferencias, créditos, pagos, todo en un solo lugar.</p>
            </div>
          </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLogin } from '@/composables/useLogin.js'

const { email, password, error, loading, login } = useLogin()
</script>

