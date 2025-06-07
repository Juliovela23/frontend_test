<template>
  <!-- 🟦 Este es el fondo que debe ocupar toda la pantalla -->
  <div class="min-h-screen w-screen flex items-center justify-center bg-[#002C5F] px-4">
    <!-- 🧊 Caja blanca -->
    <div class="bg-white w-full max-w-md rounded-xl shadow-xl p-6 sm:p-8 space-y-6">

      <!-- Logo -->
      <div class="mx-auto h-20 w-20 sm:h-24 sm:w-24">
        <img src="../image/logo.png" alt="Logo" class="w-full h-full object-contain" />
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-900">¡Bienvenido!</h2>
      <p class="text-sm text-center text-gray-500">Inicia sesión para continuar</p>

      <!-- Formulario -->
      <form @submit.prevent="login" class="space-y-4">
       <!-- Usuario -->
        <div>
          <label class="block text-sm font-medium text-gray-800 mb-1">DPI / Usuario</label>
          <div class="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#00AEEF] shadow-sm">
            <div class="bg-[#002C5F] p-3 flex items-center justify-center">
              <i class="fas fa-user text-white text-base"></i>
            </div>
            <input
              v-model="email"
              type="text"
              placeholder="DPI/usuario"
              class="w-full px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-800 mb-1">Contraseña</label>
          <div class="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#00AEEF] shadow-sm">
            <div class="bg-[#002C5F] p-3 flex items-center justify-center">
              <i class="fas fa-key text-white text-base"></i>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="Contraseña"
              class="w-full px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>


        <!-- Error -->
        <p v-if="error" class="text-red-500 text-sm text-center -mt-2">{{ error }}</p>

        <!-- Recuérdame y olvidé -->
        <div class="flex items-center justify-between text-sm text-gray-600">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="form-checkbox text-primary" />
            <span>Recuérdame</span>
          </label>
          <a href="#" class="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center px-4 py-2 rounded-md text-white font-medium transition 
         bg-[#00AEEF] hover:bg-[#008cc9] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Iniciar sesión</span>
          <span v-else class="animate-pulse">Cargando...</span>
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
//import {Botton, Button} from '../components/ui/button'
import { useLogin } from '@/composables/useLogin.js'
const { email, password, error, loading, login } = useLogin()
</script>
