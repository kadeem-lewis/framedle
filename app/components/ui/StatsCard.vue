<template>
  <div
    class="ring-primary flex flex-col items-center text-center font-semibold uppercase ring-1"
  >
    <p class="py-0.5">{{ props.value }}</p>
    <p class="bg-primary w-full py-0.5">{{ props.label }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number | string;
}>();
</script>
