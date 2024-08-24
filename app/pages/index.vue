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
        class="cursor-pointer uppercase hover:scale-105"
        @click="router.push(tab.route)"
      >
        {{ tab.label }}
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

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
