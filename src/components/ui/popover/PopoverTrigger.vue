<script setup>
import { PopoverTrigger } from "reka-ui";

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: [String, Object, Function], required: false },
});
</script>

<template>
  <PopoverTrigger v-bind="props">
    <slot />
  </PopoverTrigger>
</template>
