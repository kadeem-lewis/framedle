<script setup lang="ts">
import { startOfTomorrow } from "date-fns";

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Framedle` : "Framedle";
  },
});

const { getDailies } = useDailiesStore();
const visibility = useDocumentVisibility();
const { isFinished } = useTimeUntil(startOfTomorrow());

onMounted(() => {
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

const { showBackground } = storeToRefs(useSettingsStore());
</script>
<template>
  <NuxtPwaManifest />
  <TheBackground v-if="showBackground" />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
