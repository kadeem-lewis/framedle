<template>
  <UCard
    class="group hover:bg-opacity-100 relative cursor-pointer border border-(--ui-primary) uppercase transition-all"
    @click="navigateTo(tab.route)"
  >
    <div
      :style="{ backgroundImage: `url(${tab.background})` }"
      class="absolute inset-0 z-0 bg-cover contrast-[.85] group-hover:contrast-100 dark:brightness-50 dark:contrast-100 group-hover:dark:brightness-75"
    />
    <div class="relative z-10 flex flex-row items-center gap-8 text-white">
      <NuxtImg
        format="webp"
        :src="tab.source"
        :alt="tab.label"
        preload
        class="h-12 group-hover:scale-110"
      />
      <div class="font-roboto brightness-90 group-hover:brightness-100">
        <p class="text-xl font-bold">
          {{ tab.label }}
        </p>
        <p class="font-semibold">{{ tab.description }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { tab } = defineProps<{
  tab: {
    label: string;
    route: string;
    source: string;
    background: string;
    description: string;
  };
}>();
</script>
