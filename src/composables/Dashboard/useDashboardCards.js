import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'https://interappapi.onrender.com/api/shortcuts'
export function useDashboardCards() {
  const cards = ref([])
  const loading = ref(false)
  const error = ref('')

  // Obtener todas las tarjetas del usuario autenticado
  async function fetchCards() {
    loading.value = true
    error.value = ''
    try {
      
      const token = localStorage.getItem('token')
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cards.value = data
    } catch (e) {
      error.value = 'No se pudieron cargar las tarjetas'
    } finally {
      loading.value = false
    }
  }

  // Crear nueva tarjeta
  async function createCard(cardData) {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      await axios.post(API_URL, cardData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchCards()
    } catch (e) {
      error.value = 'No se pudo crear la tarjeta'
    } finally {
      loading.value = false
    }
  }

  // Actualizar tarjeta
  async function updateCard(id, cardData) {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/${id}`, cardData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchCards()
    } catch (e) {
      error.value = 'No se pudo actualizar la tarjeta'
    } finally {
      loading.value = false
    }
  }

  // Eliminar tarjeta
  async function deleteCard(id) {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchCards()
    } catch (e) {
      error.value = 'No se pudo eliminar la tarjeta'
    } finally {
      loading.value = false
    }
  }

  return { cards, loading, error, fetchCards, createCard, updateCard, deleteCard }
}
