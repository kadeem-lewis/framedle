<script setup lang="ts">
useSeoMeta({
  title: null,
});

defineOgImageComponent("Framedle");

const { cards } = useModeCards();
</script>
<template>
  <div class="space-y-4">
    <p
      class="font-roboto p-1 text-center text-lg font-semibold uppercase md:text-xl"
    >
      Test your Warframe Knowledge
    </p>
    <div class="flex flex-col gap-4">
      <UiAppModeCard
        v-for="card of cards"
        :key="card.label"
        :card="card"
        :show-stats="true"
      />
    </div>
  </div>
</template>
