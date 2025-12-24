<script setup lang="ts">
definePageMeta({
  layout: "game",
  validate: validateRoute,
});

useSeoMeta({
  title: "Classic",
});

const { t } = useI18n();

const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());
const { DEFAULT_ATTEMPTS, initializeUnlimitedGame } = useGameStore();
const { isLoadingDailies } = storeToRefs(useDailiesStore());

const { mode, isDaily } = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());
const route = useRoute("classic-path");

await callOnce(
  "classic-setup",
  () => {
    if (!mode.value) return;
    initializeUnlimitedGame(mode.value, route.query.x as string | undefined);
  },
  {
    mode: "navigation",
  },
);

const { resetStreak } = useStatsStore();

onBeforeMount(() => {
  resetStreak("classic");
});

const feedbackLabels = [
  t("classic.feedback.name"),
  t("classic.feedback.sex"),
  "variant",
  "playstyle",
  t("classic.feedback.base_health"),
  t("classic.feedback.base_shield"),
  t("classic.feedback.progenitor_element"),
  t("classic.feedback.release_year"),
];

const tooltipMap = {
  sex: "Male, Female or Non-binary",
  "release year": "Any year between 2012 and today",
  "base health": "The health of the Warframe at level 0",
  "base shield": "The shields of the Warframe at level 0",
  "progenitor element": "Impact, Heat, Cold, etc...",
  playstyle: "Damage, Stealth, Support, Survival, etc...",
  variant: "Standard, Prime or Umbra",
};

const { makeGuess } = useGuess();
</script>
<template>
  <div
    v-if="mode === 'classic' || mode === 'classicUnlimited'"
    class="flex flex-col gap-4"
  >
    <UiAppSpinner v-if="isLoadingDailies" />
    <div v-else>
      <div v-if="itemToGuess[mode]" class="space-y-4">
        <RemainingGuesses />
        <UCard class="divide-y-0">
          <template #header>
            <p
              class="text-primary-600 font-roboto dark:text-primary text-2xl font-bold uppercase"
            >
              {{ t("classic.title") }}
            </p>
            <p
              v-if="attempts[mode] === DEFAULT_ATTEMPTS"
              class="font-semibold uppercase"
            >
              {{ t("classic.subtitle") }}
            </p>
          </template>
          <WarframeSearch
            v-if="!isGameOver"
            :items="warframeNames"
            :disabled-items="guessedItems[mode]"
            @submit="makeGuess($event, mode)"
          />
        </UCard>
        <GlobalStats v-if="isDaily" />
        <template v-if="guessedItems[mode].length">
          <div class="space-y-4 overflow-x-auto md:overflow-x-visible">
            <div
              class="grid w-[190%] grid-cols-8 gap-1 border border-neutral-200 bg-white/75 py-0.5 text-sm uppercase md:-ml-[45%] md:text-base dark:border-neutral-800 dark:bg-neutral-900/75"
            >
              <UTooltip
                v-for="label of feedbackLabels"
                :key="label"
                :disabled="label === 'name'"
                :content="{
                  side: 'top',
                }"
                :delay-duration="0"
                :ui="{
                  content: 'text-md rounded-none py-2 px-3',
                }"
                :text="tooltipMap[label as keyof typeof tooltipMap]"
              >
                <p
                  class="font-roboto self-center justify-self-center text-center font-medium"
                >
                  {{ label }}
                </p>
              </UTooltip>
            </div>
            <div
              class="grid w-[190%] grid-cols-8 gap-1 text-sm capitalize md:-ml-[45%] md:text-base"
            >
              <ClassicFeedbackRow
                v-for="warframe of [...guessedItems[mode]].reverse()"
                :key="warframe"
                :guessed-warframe="getWarframe(warframe)"
                :correct-warframe="getWarframe(itemToGuess[mode]!)"
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
        <template v-if="isGameOver">
          <GameOverNavigation v-if="!mode.includes('Unlimited')" />
          <GameOver />
        </template>
      </div>
      <ModeUnavailable v-else />
    </div>
  </div>
</template>
