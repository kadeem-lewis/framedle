<template>
  <div v-if="mode && itemToGuess[mode]" class="flex flex-col gap-4">
    <UTabs v-model="selectedTab" :items="tabs"> </UTabs>
    <div v-if="mode">
      <RemainingGuesses />
      <div>
        <NuxtImg
          :src="`https://cdn.warframestat.us/img/${itemToGuess[mode]?.imageName}`"
          alt="Warframe to guess"
          :class="[
            'h-16',
            {
              'blur-sm': (attempts[mode] = 6),
              invert: attempts[mode] >= 5,
              'rotate-45': attempts[mode] >= 4,
            },
          ]"
        />
      </div>
      <div class="flex flex-col capitalize md:-ml-[15%] md:w-[130%]">
        <p class="justify-self-center">Warframe</p>
        <UiTile
          v-for="warframe of guessedItems[mode]"
          :key="warframe.name"
          :is-correct="warframe.name === itemToGuess[mode]?.belongsTo"
        >
          {{ warframe.name }}
        </UiTile>
      </div>
    </div>
    <WarframeSearch
      v-if="!isGameOver[mode]"
      :items="vanillaWarframes"
      comparison-field="belongsTo"
    />
    <GameOver />
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const {
  itemToGuess,
  mode,
  guessedItems,
  attempts,
  isGameOver,
  vanillaWarframes,
} = storeToRefs(useGameStore());
const { abilityInit } = useGameStore();

await callOnce(abilityInit);

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
      mode.value = "abilityUnlimited";
      router.replace({ query: { mode: "unlimited" } });
    } else if (tabs[value]?.label === "Daily") {
      mode.value = "ability";
      router.replace(route.path);
    }
  },
  {
    immediate: true,
  },
);
</script>
