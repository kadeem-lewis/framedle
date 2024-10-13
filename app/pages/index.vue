<template>
  <div class="space-y-4">
    <p
      class="border border-gray-200 bg-gray-100/75 p-1 text-center text-lg font-semibold uppercase md:text-xl dark:border-gray-600/75 dark:bg-gray-800"
    >
      Test your Warframe Knowledge!
    </p>
    <div class="flex flex-col gap-4">
      <UCard
        v-for="tab of tabs"
        :key="tab.label"
        :ui="{
          rounded: 'rounded-none',
        }"
        class="border-primary group relative cursor-pointer border uppercase transition-all hover:bg-opacity-100"
        @click="navigateTo(tab.route)"
      >
        <div
          :style="{ backgroundImage: `url(${tab.background})` }"
          class="absolute inset-0 z-0 bg-cover contrast-75 group-hover:contrast-100 dark:brightness-50 dark:contrast-100 group-hover:dark:brightness-75"
        />
        <div class="relative z-10 flex flex-row items-center gap-8 text-white">
          <NuxtImg
            format="webp"
            :src="tab.source"
            :alt="tab.label"
            class="h-16 group-hover:scale-110"
          />
          <div class="brightness-90 group-hover:brightness-100">
            <p class="text-xl font-bold">
              {{ tab.label }}
            </p>
            <p class="font-semibold">{{ tab.description }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const img = useImage();

const tabs = [
  {
    label: "Classic",
    route: "/classic",
    source: "/warframe.png",
    background: img("/backgrounds/fortuna.jpg", { format: "webp" }),
    description: "Guess the Warframe",
  },
  {
    label: "Ability",
    route: "/ability",
    source: "/PassiveAbilityIcon.png",
    background: img("/backgrounds/helminth.jpg", { format: "webp" }),
    description: "Guess the Ability",
  },
];
</script>
