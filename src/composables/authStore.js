// src/composables/authStore.js
import { ref } from 'vue'

export const token = ref(localStorage.getItem('token') || null)
export const isAuthenticated = ref(!!token.value)
export const user = ref(JSON.parse(localStorage.getItem('user')) || null)
