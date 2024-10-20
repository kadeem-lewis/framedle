<template>
  <div v-if="mode" class="flex flex-col gap-4">
    <ModeSwitch />
    <ModeUnavailable v-if="!itemToGuess[mode]" />
    <div v-else class="space-y-4">
      <RemainingGuesses />

      <UCard
        :ui="{
          divide: 'divide-y-0',
        }"
      >
        <template #header>
          <p class="text-primary text-xl font-bold uppercase">
            {{ t("ability.title") }}
          </p>
        </template>
        <AbilityImageToGuess />
        <template #footer>
          <WarframeSearch v-if="!isGameOver[mode]" :items="vanillaWarframes" />
        </template>
      </UCard>

      <AbilityFeedbackArea v-if="!isGameOver[mode]" />
      <GameOver v-if="isGameOver[mode]" />
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { isYesterday, isToday } from "date-fns";

definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Ability",
});

defineOgImageComponent("Frame", {
  title: "Framedle | Ability",
});

const { t } = useI18n();

const { itemToGuess, mode, isGameOver, vanillaWarframes, stats } =
  storeToRefs(useGameStore());
const { abilityInit } = useGameStore();

await callOnce("ability-setup", abilityInit);

// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

const route = useRoute();

onBeforeMount(() => {
  const lastPlayedDate = stats.value.ability.lastPlayedDate;
  if (
    lastPlayedDate &&
    !isToday(lastPlayedDate) &&
    !isYesterday(lastPlayedDate)
  ) {
    stats.value.ability.streak = 0;
  }
});

watch(
  () => route.query.mode,
  () => {
    if (route.query.mode === "unlimited") {
      mode.value = "abilityUnlimited";
    }
    if (!route.query.mode) {
      mode.value = "ability";
    }
  },
  { immediate: true },
);
</script>
