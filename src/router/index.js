import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import TwoFAView from '@/views/TwoFAView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuth } from '@/composables/useAuth'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/2fa', name: '2FA', component: TwoFAView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// ✅ Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // ✅ Lectura directa
  const publicRoutes = ['/login', '/2fa']
  const goingToPublic = publicRoutes.includes(to.path)

  if (!token && !goingToPublic) {
    return next('/login')
  }

  if (token && to.path === '/login') {
    return next('/dashboard')
  }

  if (token && to.path === '/2fa') {
    return next('/dashboard')
  }

  next()
})


export default router
