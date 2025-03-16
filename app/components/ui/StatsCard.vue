<template>
  <div
    class="flex flex-col items-center text-center font-semibold uppercase ring-1 ring-(--ui-primary)"
  >
    <p class="py-0.5">{{ props.value }}</p>
    <p class="w-full bg-(--ui-primary) py-0.5">{{ props.label }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number | string;
}>();
</script>
