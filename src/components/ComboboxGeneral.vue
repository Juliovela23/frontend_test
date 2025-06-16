<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  items: { value: string; label: string }[],
  modelValue: string | null,
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])
const search = ref('')
const isOpen = ref(false)
const filtered = ref<{ value: string; label: string }[]>([])

watch(() => props.items, () => {
  filtered.value = props.items
}, { immediate: true })

watch(search, (val) => {
  filtered.value = props.items.filter(item =>
    item.label.toLowerCase().includes(val.toLowerCase())
  )
})

function select(item: { value: string; label: string }) {
  emit('update:modelValue', item.value)
  isOpen.value = false
  search.value = item.label
}

onMounted(() => {
  const selected = props.items.find(i => i.value === props.modelValue)
  if (selected) search.value = selected.label
})
</script>

<template>
  <div class="relative w-full max-w-sm">
    <input
      type="text"
      v-model="search"
      :placeholder="placeholder ?? 'Selecciona una opción'"
      class="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring"
      @focus="isOpen = true"
    />
    <ul
      v-if="isOpen && filtered.length > 0"
      class="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto mt-1"
    >
      <li
        v-for="item in filtered"
        :key="item.value"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        @click="select(item)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div
      v-else-if="isOpen && filtered.length === 0"
      class="absolute z-10 w-full bg-white border rounded shadow mt-1 px-3 py-2 text-gray-500"
    >
      No se encontraron resultados.
    </div>
  </div>
</template>

<style scoped>
input {
  transition: border 0.2s ease;
}
</style>
