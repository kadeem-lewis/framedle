<script setup lang="ts">
const { variant } = defineProps<{
  variant: Result | "neutral";
}>();
</script>
<template>
  <div
    class="absolute -top-1 right-px size-4 stroke-2 font-semibold text-white"
  >
    <UIcon v-if="variant === 'correct'" name="i-mdi-check" />
    <UIcon v-else-if="variant === 'partial'" name="i-mdi-tilde" />
  </div>
</template>
