<script setup lang="ts">
import type { NuxtError } from "#app";
const { error } = defineProps<{ error: NuxtError }>();

definePageMeta({
  layout: "default",
});
</script>
<template>
  <UContainer class="flex min-h-dvh items-center justify-center">
    <div
      v-if="error.statusCode === 404"
      class="flex flex-col items-center justify-center gap-2"
    >
      <h1 class="text-4xl font-bold">404</h1>
      <p>The page you are looking for does not exist.</p>
      <UButton variant="outline" size="lg" to="/">Go Back Home</UButton>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-2">
      <h1 class="text-2xl font-bold">An unknown error occurred</h1>
      <UButton variant="outline" size="lg" to="/">Go Back Home</UButton>
    </div>
  </UContainer>
</template>
