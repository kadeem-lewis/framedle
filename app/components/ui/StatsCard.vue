<script setup lang="ts">
const { label, value } = defineProps<{
  label: string;
  value: number | string | null;
}>();
</script>
<template>
  <div
    class="ring-primary flex flex-col items-center text-center font-semibold uppercase ring-1"
  >
    <p class="py-0.5">{{ value ?? "—" }}</p>
    <p class="bg-primary text-highlighted w-full py-0.5">{{ label }}</p>
  </div>
</template>
