<template>
  <div class="space-y-4">
    <p>Daily Guess a Warframe</p>
    <div class="flex flex-col gap-4">
      <UCard
        v-for="tab of tabs"
        :key="tab.label"
        :ui="{
          rounded: false,
        }"
        class="uppercase hover:scale-105"
      >
        <NuxtLink :to="tab.route">
          {{ tab.label }}
        </NuxtLink>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const tabs = [
  {
    label: "Classic",
    route: "/classic",
  },
  {
    label: "Ability",
    route: "/ability",
  },
];
</script>
