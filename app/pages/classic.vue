<template>
  <div
    v-if="mode === 'classic' || mode === 'classicUnlimited'"
    class="flex flex-col gap-4"
  >
    <div v-if="itemToGuess[mode]" class="space-y-4">
      <RemainingGuesses />
      <UCard class="divide-y-0">
        <template #header>
          <p
            class="text-primary-600 font-roboto text-2xl font-bold uppercase dark:text-(--ui-primary)"
          >
            {{ t("classic.title") }}
          </p>
          <p
            v-if="attempts[mode] === defaultAttempts"
            class="font-semibold uppercase"
          >
            {{ t("classic.subtitle") }}
          </p>
        </template>
        <WarframeSearch v-if="!isGameOver[mode]" :items="warframes" />
      </UCard>
      <template v-if="guessedItems[mode].length">
        <div class="space-y-4 overflow-x-auto md:overflow-x-visible">
          <div
            class="grid w-[150%] grid-cols-6 gap-1 border border-neutral-200 bg-white/75 py-0.5 text-sm uppercase md:-ml-[25%] md:text-base dark:border-neutral-800 dark:bg-neutral-900/75"
          >
            <p
              v-for="label of feedbackLabels"
              :key="label"
              class="font-roboto self-center justify-self-center text-center font-semibold"
            >
              {{ label }}
            </p>
          </div>
          <div class="grid w-[150%] grid-cols-6 gap-1 uppercase md:-ml-[25%]">
            <ClassicFeedbackRow
              v-for="warframe of guessedItems[mode].toReversed()"
              :key="warframe.name"
              :guessed-warframe="warframe"
              :correct-warframe="itemToGuess[mode]!"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-center gap-1 font-semibold text-neutral-800 md:hidden dark:text-neutral-400"
        >
          <UIcon name="i-heroicons-arrow-long-left" class="size-5" />
          {{ t("classic.scroll_hint") }}
          <UIcon name="i-heroicons-arrow-long-right" class="size-5" />
        </div>
      </template>
      <GameOver v-if="isGameOver[mode]" />
    </div>
    <ModeUnavailable v-else />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Classic",
});

defineOgImageComponent("Framedle");

const { t } = useI18n();

const { itemToGuess, guessedItems, warframes, attempts } =
  storeToRefs(useGameStore());
const { classicInit, defaultAttempts } = useGameStore();

const mode = useGameMode();
const { isGameOver } = useGameState();

await callOnce("classic-setup", classicInit);

const { resetStreak } = useStatsStore();

onBeforeMount(() => {
  resetStreak("classic");
});

const feedbackLabels = [
  t("classic.feedback.name"),
  t("classic.feedback.sex"),
  t("classic.feedback.base_health"),
  t("classic.feedback.base_shield"),
  t("classic.feedback.progenitor_element"),
  t("classic.feedback.release_year"),
];
</script>
