// src/composables/useAuth.js
import axios from 'axios'
import { token, isAuthenticated } from './authStore'

export function useAuth() {
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isAuthenticated.value = true
  }
  const getUser = () => user.value

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('token')
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('user')
  }

  const getToken = () => token.value

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      const tkn = token.value
      await axios.post('https://interappapi-epdqhjbmepckfgda.canadacentral-01.azurewebsites.net/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${tkn}`
        }
      })

      clearToken()
      localStorage.clear()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return {
    isAuthenticated,
    setToken,
    clearToken,
    getToken,
    getUser,
    logout,
    setUser
  }
}
