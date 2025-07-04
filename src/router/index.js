import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import TwoFAView from '@/views/TwoFAView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeContent from '../views/HomeContent.vue'
import CuentasContent from '../views/Cuentas/CuentasContent.vue'
import TransferenciasContent from '../views/Cuentas/TransferenciasContent.vue'
import EstadoCuentaContent from '../views/Cuentas/EstadoCuentaContent.vue'
import PagoManualContent from '@/views/Creditos/PagoManualContent.vue'
import DetalleCredito from '@/views/Creditos/DetalleCredito.vue'
import PagoServiciosView from '@/views/Servicios/PagoServiciosView.vue'
import TransferenciasProgramadasview from '@/views/Transferencias/TransferenciasProgramadasview.vue'
import PagoAutomaticoView from '@/views/Creditos/PagoAutomaticoView.vue'
import NotificacionesView from '@/views/Dashboard/NotificacionesView.vue'
import TransferenciaReciboView from '@/views/viewsGenerales/TransferenciaReciboView.vue'
import HistorialTransferenciasView from '@/views/Transferencias/HistorialTransferenciasView.vue'
import AdminNoticiasView from '@/views/Noticias/AdminNoticiasView.vue'
import AdminAccesosView from '@/views/Dashboard/AccesosDirectos/AdminAccesosView.vue'
// ...otros imports

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/2fa', name: '2FA', component: TwoFAView },
  {
    path: '/dashboard',
    component: DashboardView,
    children: [
      { path: '', name: 'DashboardHome', component: HomeContent },
      { path: 'cuentas', name: 'DashboardCuentas', component: CuentasContent },
      { path: 'transferencias', name: 'DashboardTransferencias', component: TransferenciasContent },
      { path: 'estado-cuenta', name: 'DashboardEstadoCuenta', component: EstadoCuentaContent },
      { path: 'pago-manual', name: 'DashboardPagoManual', component: PagoManualContent },
      { path: 'detalle-credito', name: 'DashboardDetalleCredito', component: DetalleCredito },
      { path: 'pago-servicios', name: 'DashboardPagoServicios', component: PagoServiciosView },
      { path: 'transferencias-programadas', name: 'DashboardTransferenciasProgramadas', component: TransferenciasProgramadasview },
      { path: 'pago-automatico', name: 'DashboardPagoAutomatico', component: PagoAutomaticoView },
      { path: 'notificaciones', name: 'DashboardNotificaciones', component: NotificacionesView },
      { path: 'transferencia-recibo/:id', name: 'TransferenciaRecibo', component: TransferenciaReciboView, props: true },
      { path: 'historial-transferencias', name: 'DashboardHistorialTransferencias', component: () => import('@/views/Transferencias/HistorialTransferenciasView.vue') },
      {path: 'admin-noticias', name: 'AdminNoticias', component: AdminNoticiasView },
      {path: 'admin-accesos', name: 'AdminAccesos', component: AdminAccesosView },
      // ...más hijos si los necesitas
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Guard global (igual que antes)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
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
