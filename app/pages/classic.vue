<template>
  <div class="flex flex-col gap-4">
    <UTabs v-model="selectedTab" :items="tabs">
      <template #item="{ item }">
        <div v-if="item.label === 'Unlimited'">
          <p>You have {{ attempts[mode] }} revives left.</p>
          <div class="grid grid-cols-6 capitalize md:-ml-[15%] md:w-[130%]">
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
    <ClassicCombobox v-if="!isGameOver[mode]" />
    <div v-else>
      <p>Game Over!</p>
      <p>The answer was {{ itemToGuess[mode].name }}</p>
      <p>{{ attempts[mode] > 0 ? "You Won" : "You Lost Sucka" }}</p>
      <UButton @click="resetGame">New Game</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { itemToGuess, mode, guessedItems, attempts, isGameOver } =
  storeToRefs(useGameStore());
const { classicInit, resetGame } = useGameStore();

await callOnce(classicInit);

// probably use zod to make sure that the data and all available

watch(
  () => attempts.value[mode.value],
  () => {
    if (attempts.value[mode.value] === 0) {
      isGameOver.value[mode.value] = true;
    }
  },
);

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
