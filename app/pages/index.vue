<template>
  <div class="space-y-4">
    <p>Test your Warframe Knowledge!</p>
    <div class="flex flex-col gap-4">
      <UCard
        v-for="tab of tabs"
        :key="tab.label"
        :ui="{
          rounded: false,
        }"
        class="cursor-pointer uppercase hover:scale-105"
        @click="navigateTo(tab.route)"
      >
        <div class="flex flex-row items-center gap-8">
          <NuxtImg :src="tab.source" :alt="tab.label" class="h-16" />
          <div>
            <p class="text-xl font-semibold">
              {{ tab.label }}
            </p>
            <p>{{ tab.description }}</p>
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
    description: "Guess the Warframe",
  },
  {
    label: "Ability",
    route: "/ability",
    source: "/PassiveAbilityIcon.png",
    description: "Guess the Warframe Ability",
  },
];
</script>
