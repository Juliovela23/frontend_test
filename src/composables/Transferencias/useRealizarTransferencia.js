import { ref } from 'vue'

export function useRealizarTransferencia() {
  const tipo = ref<'propia' | 'terceros'>('propia')
  const cuentaOrigen = ref('')
  const cuentaDestino = ref('')
  const cuentaTercero = ref('')
  const cuentas = ref([
    { id: 1, nombre: 'Cuenta corriente No. 0000' },
    { id: 2, nombre: 'Cuenta ahorro No. 1111' }
  ])
  const monto = ref('')
  const descripcion = ref('')
  const tokenEnvio = ref('')
  const token = ref('')

  function agregarCuentaTercero() {
    alert('Funcionalidad para agregar cuenta de terceros (puedes abrir un modal aquí)');
  }

  return {
    tipo,
    cuentaOrigen,
    cuentaDestino,
    cuentaTercero,
    cuentas,
    monto,
    descripcion,
    tokenEnvio,
    token,
    agregarCuentaTercero
  }
}
