<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
import { useGameSync } from "./composables/useGameSync";

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

const { getDailies } = useDailiesStore();
const visibility = useDocumentVisibility();
const { isFinished } = useTimeUntil(startOfTomorrow());

onMounted(() => {
  useGameSync();

  getDailies();
});

watch(visibility, (newVisibility, previousVisibility) => {
  if (newVisibility === "visible" && previousVisibility === "hidden") {
    getDailies();
  }
});

watch(isFinished, (newIsFinished) => {
  if (newIsFinished) {
    getDailies();
  }
});
</script>
<template>
  <NuxtPwaManifest />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
