<template>
  <Teleport to="body">
    <div class="overlay" @click.self="cerrar">
      <div class="modal">
        <form class="form" @submit.prevent="handleSubmit">
          <!-- Banner decorativo -->
          <div class="banner"></div>

          <label class="title">{{ isEditMode ? 'Editar Acceso Directo' : 'Nuevo Acceso Directo' }}</label>
          <p class="description">
            Completa la información para {{ isEditMode ? 'editar' : 'crear' }} tu acceso directo.
          </p>

          <!-- Tipo -->
          <div class="field">
            <label>Tipo *</label>
            <select v-model="form.tipo" class="input">
              <option value="cuenta">Cuenta</option>
              <option value="credito">Crédito</option>
              <option value="accion">Opción general</option>
            </select>
          </div>

          <!-- Combobox -->
          <ComboboxDoble v-if="esCuentaOCredito" v-model="form.referenciaId" :tipo="form.tipo" />

          <!-- Acción -->
          <div v-if="esAccion" class="field">
            <label>Acción</label>
            <select v-model="form.accion" class="input">
              <option v-for="accion in accionesDisponibles" :key="accion.value" :value="accion.value">
                {{ accion.label }}
              </option>
            </select>
          </div>

          <!-- Título -->
          <div class="field">
            <label>Título *</label>
            <input v-model="form.tituloPersonalizado" class="input" />
          </div>

          <!-- Color -->
          <div class="field">
            <label>Color</label>
            <input type="color" v-model="form.colorFondo" class="input h-10 w-20 p-0 cursor-pointer" />
          </div>

          <!-- Activo -->
          <div class="field">
            <label><input type="checkbox" v-model="form.activo" /> Activo</label>
          </div>

          <!-- Footer -->
          <div class="modal--footer">
            <button type="submit" class="upgrade-btn">
              {{ isEditMode ? 'Guardar Cambios' : 'Crear Acceso' }}
            </button>
            <button type="button" class="cancel-btn" @click="cerrar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ComboboxDoble from './ComboboxDoble.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
// === Props ===
const props = defineProps({
  tarjeta: Object
})
const emit = defineEmits(['cerrar', 'guardado'])

// === Form state ===
const form = ref({
  tipo: 'cuenta',
  referenciaId: '',
  accion: '',
  tituloPersonalizado: '',
  colorFondo: '#15385c',
  activo: true
})

const isEditMode = computed(() => !!props.tarjeta)

watch(() => props.tarjeta, (val) => {
  if (val) {
    form.value = {
      tipo: val.tipo,
      referenciaId: val.referenciaId || '',
      accion: val.accion || '',
      tituloPersonalizado: val.tituloPersonalizado,
      colorFondo: val.colorFondo,
      activo: !!val.activo
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const esCuentaOCredito = computed(() => form.value.tipo === 'cuenta' || form.value.tipo === 'credito')
const esAccion = computed(() => form.value.tipo === 'accion')

const accionesDisponibles = [
  { value: 'cuentas', label: 'Cuentas', icon: 'wallet' },
    { value: 'transferencias', label: 'Transferencias', icon: 'transfer' },
    { value: 'historial-transferencias', label: 'Historial de transferencias', icon: 'history' },
    { value: 'creditos', label: 'Créditos', icon: 'credit-card' },
    { value: 'servicios', label: 'Servicios', icon: 'bolt' },
    { value: 'estados-cuenta', label: 'Estados de cuenta', icon: 'file-invoice' },
    //{ value: 'reportes', label: 'Reportes', icon: 'chart-bar' },
    { value: 'notificaciones', label: 'Notificaciones', icon: 'bell' },
    //{ value: 'ajustes', label: 'Ajustes', icon: 'cog' },
    //{ value: 'programadas', label: 'Programadas', icon: 'calendar' },
]

function resetForm() {
  form.value = {
    tipo: 'cuenta',
    referenciaId: '',
    accion: '',
    tituloPersonalizado: '',
    colorFondo: '#15385c',
    activo: true
  }
}

async function handleSubmit() {
  const token = localStorage.getItem('token')
  try {
    if (isEditMode.value) {
      // PATCH
      await axios.patch(`https://interappapi.onrender.com/api/shortcuts/${props.tarjeta.id}`, {
        tipo: form.value.tipo,
        referenciaId: form.value.referenciaId,
        accion: form.value.accion,
        tituloPersonalizado: form.value.tituloPersonalizado,
        colorFondo: form.value.colorFondo,
        activo: form.value.activo,
        orden: props.tarjeta.orden // si lo usas en tu modelo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      Swal.fire({
        icon: 'success',
        title: 'Acceso actualizado',
        text: `El acceso "${form.value.tituloPersonalizado}" ha sido actualizado.`
      })

    } else {
      // POST
      const countResp = await axios.get(
        'https://interappapi.onrender.com/api/shortcuts/count',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const orden = countResp.data + 1
      await axios.post(
        'https://interappapi.onrender.com/api/shortcuts',
        {
          tipo: form.value.tipo,
          referenciaId: form.value.referenciaId,
          accion: form.value.accion,
          orden,
          tituloPersonalizado: form.value.tituloPersonalizado,
          icono: form.value.tipo === 'cuenta' ? 'wallet' : (form.value.tipo === 'credito' ? 'credit-card' : 'bolt'),
          colorFondo: form.value.colorFondo,
          activo: form.value.activo
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      Swal.fire({
        icon: 'success',
        title: 'Acceso creado',
        text: `El acceso "${form.value.tituloPersonalizado}" ha sido creado.`
      })
    }

    emit('guardado')
    cerrar()
  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: error.response?.data?.message || 'Ocurrió un error al guardar el acceso.'
    })
    //alert('Error al guardar')
  }
}

function cerrar() {
  resetForm()
  emit('cerrar')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: 450px;
  background: linear-gradient(180deg, #e7eef6 0%, #ffffff 30.21%);
  border-radius: 16px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.title {
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: #15385c;
  margin-bottom: 10px;
}

.description {
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.field label {
  font-size: 12px;
  color: #15385c;
  margin-bottom: 4px;
}

.input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal--footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.upgrade-btn {
  background: #15385c;
  color: #fff;
  padding: 10px 30px;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background: #f2f2f2;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
}

.upgrade-btn:hover {
  background: #0e2c47;
}
</style>
