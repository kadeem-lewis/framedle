<template>
  <div
    v-if="mode === 'classic' || mode === 'classicUnlimited'"
    class="flex flex-col gap-4"
  >
    <ModeUnavailable v-if="!itemToGuess[mode]" />
    <div v-else class="space-y-4">
      <RemainingGuesses />
      <UCard
        :ui="{
          divide: 'divide-y-0',
        }"
      >
        <template #header>
          <p
            class="text-primary-600 dark:text-primary font-roboto text-2xl font-bold uppercase"
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
            class="grid w-[150%] grid-cols-6 gap-1 border border-gray-200 bg-white/75 py-0.5 uppercase md:-ml-[25%] dark:border-gray-800 dark:bg-gray-900/75"
          >
            <p
              v-for="label of [
                t('classic.feedback.name'),
                t('classic.feedback.sex'),
                t('classic.feedback.base_health'),
                t('classic.feedback.base_shield'),
                t('classic.feedback.progenitor_element'),
                t('classic.feedback.release_year'),
              ]"
              :key="label"
              class="self-center justify-self-center text-center font-roboto font-semibold"
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
          class="flex items-center justify-center gap-1 font-semibold text-gray-800 md:hidden dark:text-gray-400"
        >
          <UIcon name="i-heroicons-arrow-long-left" class="size-5" />
          {{ t("classic.scroll_hint") }}
          <UIcon name="i-heroicons-arrow-long-right" class="size-5" />
        </div>
      </template>
      <GameOver v-if="isGameOver[mode]" />
    </div>
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

const { updateStreak } = useStatsStore();

onBeforeMount(() => {
  updateStreak("classic");
});
</script>
