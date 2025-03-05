<script setup lang="ts">
useSeoMeta({
  title: "Framedle",
  ogTitle: "Framedle",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Framedle` : "Framedle";
  },
  description:
    "Use your Warframe knowledge to figure out the mystery Warframe in as few guesses as possible! A new puzzle is available each day.",
  ogDescription:
    "Use your Warframe knowledge to figure out the mystery Warframe in as few guesses as possible! A new puzzle is available each day.",
});
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UModals />
  </div>
</template>
