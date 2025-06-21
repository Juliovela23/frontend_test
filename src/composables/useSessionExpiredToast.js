import { h } from 'vue'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

export function useSessionExpiredToast(router) {
  const { toast } = useToast()

  function showSessionExpired() {
    toast({
      title: 'Uh oh! Something went wrong.',
      description: 'Tu sesión ha caducado. Por favor inicia sesión de nuevo.',
      variant: 'destructive',
      action: h(ToastAction, {
        altText: 'Try again',
        onClick: () => router.push('/login')
      }, {
        default: () => 'Try again'
      }),
    })
  }

  return { showSessionExpired }
}
