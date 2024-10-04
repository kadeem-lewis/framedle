<template>
  <div class="space-y-4">
    <p class="text-xl font-semibold uppercase">Test your Warframe Knowledge!</p>
    <div class="flex flex-col gap-4">
      <UCard
        v-for="tab of tabs"
        :key="tab.label"
        :ui="{
          rounded: false,
        }"
        class="border-primary group relative cursor-pointer border uppercase transition-all hover:bg-opacity-100"
        @click="navigateTo(tab.route)"
      >
        <div
          :style="{ backgroundImage: `url(${tab.background})` }"
          class="absolute inset-0 z-0 bg-cover brightness-50 group-hover:brightness-75"
        />
        <div
          class="relative z-10 flex flex-row items-center gap-8 text-white dark:text-black"
        >
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
const tabs = [
  {
    label: "Classic",
    route: "/classic",
    source: "/warframe.png",
    background: "/backgrounds/fortuna.jpg",
    description: "Guess the Warframe",
  },
  {
    label: "Ability",
    route: "/ability",
    source: "/PassiveAbilityIcon.png",
    background: "/backgrounds/helminth.jpg",
    description: "Guess the Ability",
  },
];
</script>
<style scoped></style>
