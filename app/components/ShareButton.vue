<script setup lang="ts">
const { handleShareClick, copied } = useShare();
</script>
<template>
  <UButton
    class="font-semibold uppercase"
    variant="outline"
    size="xl"
    @click="handleShareClick"
  >
    {{ !copied ? "Share" : "Copied" }}
  </UButton>
</template>
