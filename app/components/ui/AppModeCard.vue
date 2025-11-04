<script setup lang="ts">
const { card } = defineProps<{
  card: {
    label: string;
    route: string;
    source: string;
    background: string;
    description: string;
  };
}>();
</script>
<template>
  <UCard
    class="group hover:bg-opacity-100 border-primary relative cursor-pointer border uppercase transition-all"
    @click="navigateTo(card.route)"
  >
    <div
      :style="{ backgroundImage: `url(${card.background})` }"
      class="absolute inset-0 z-0 bg-cover contrast-[.85] group-hover:contrast-100 dark:brightness-50 dark:contrast-100 group-hover:dark:brightness-75"
    />
    <div class="relative z-10 flex flex-row items-center gap-8 text-white">
      <NuxtImg
        format="webp"
        :src="card.source"
        :alt="card.label"
        height="48"
        width="48"
        preload
        class="h-12 group-hover:scale-110"
      />
      <div class="font-roboto brightness-90 group-hover:brightness-100">
        <p class="text-xl font-bold">
          {{ card.label }}
        </p>
        <p class="font-semibold">{{ card.description }}</p>
      </div>
    </div>
  </UCard>
</template>
