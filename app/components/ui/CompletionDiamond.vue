<script setup lang="ts">
const { isFilled } = defineProps<{
  isFilled: boolean;
}>();
</script>
<template>
  <div class="size-4 rotate-45 border-2 border-primary">
    <div v-if="isFilled" class="absolute inset-0 m-auto size-2 bg-primary" />
  </div>
</template>
<style scoped></style>
