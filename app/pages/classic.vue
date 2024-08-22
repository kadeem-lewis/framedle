<template>
  <div class="flex flex-col gap-4">
    <UTabs v-model="selectedTab" :items="tabs">
      <template #item="{ item }">
        <div v-if="item.label === 'Unlimited'">
          <RemainingGuesses />
          <div
            class="grid grid-cols-6 gap-2 capitalize md:-ml-[15%] md:w-[130%]"
          >
            <p
              v-for="label of [
                'name',
                'sex',
                'health',
                'shield',
                'progenitor',
                'release year',
              ]"
              :key="label"
              class="justify-self-center"
            >
              {{ label }}
            </p>
            <ClassicFeedbackRow
              v-for="warframe of guessedItems[mode]"
              :key="warframe.name"
              :guessed-warframe="warframe"
              :correct-warframe="itemToGuess[mode]"
            />
          </div>
        </div>
        <div v-if="item.label === 'Daily'">Coming Soon</div>
      </template>
    </UTabs>
    <WarframeSearch
      v-if="!isGameOver[mode]"
      :items="warframes"
      comparison-field="name"
    />
    <GameOver />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { itemToGuess, mode, guessedItems, isGameOver, warframes } =
  storeToRefs(useGameStore());
const { classicInit } = useGameStore();

await callOnce(classicInit);

// probably use zod to make sure that the data and all available

// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

const router = useRouter();
const route = useRoute();

const tabs = [{ label: "Daily" }, { label: "Unlimited" }];

const selectedTab = ref(route.query.mode ? 1 : 0);

watch(
  selectedTab,
  (value) => {
    if (tabs[value]?.label === "Unlimited") {
      mode.value = "classicUnlimited";
      router.replace({ query: { mode: "unlimited" } });
    } else if (tabs[value]?.label === "Daily") {
      mode.value = "classic";
      router.replace(route.path);
    }
  },
  {
    immediate: true,
  },
);
</script>
