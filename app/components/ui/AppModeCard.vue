<script setup lang="ts">
const { card, showStats = false } = defineProps<{
  card: {
    label: string;
    route: string;
    source: string;
    background: string;
    description: string;
    streak: number;
  };
  showStats?: boolean;
}>();
</script>
<template>
  <UCard
    class="group hover:bg-opacity-100 border-primary relative cursor-pointer border uppercase shadow shadow-black transition-all"
    @click="navigateTo(card.route)"
  >
    <div
      :style="{ backgroundImage: `url(${card.background})` }"
      class="absolute inset-0 z-0 bg-cover contrast-[.85] group-hover:contrast-100 dark:brightness-50 dark:contrast-100 group-hover:dark:brightness-75"
    />
    <span
      v-if="card.label === 'Grid'"
      class="absolute top-0 left-0 bg-red-700 px-2 py-1 text-xs font-bold text-white uppercase dark:bg-red-600"
      >new!</span
    >
    <div class="relative z-10 flex flex-row items-center gap-8 text-white">
      <NuxtImg
        format="avif"
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
    <ClientOnly>
      <div v-if="showStats && card.streak > 0" class="absolute top-2 right-2">
        <span class="relative inline-block">
          <UIcon
            name="my-icon:flame"
            class="inline-block size-9 text-amber-500 dark:text-amber-600"
          />
          <span
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 align-middle font-bold text-white"
          >
            {{ card.streak }}
          </span>
        </span>
      </div>
    </ClientOnly>
  </UCard>
</template>
