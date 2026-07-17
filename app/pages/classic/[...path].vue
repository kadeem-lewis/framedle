<script setup lang="ts">
definePageMeta({
  layout: "game",
  validate: validateRoute,
});

const { isUnlimited } = useGameMode();

const { DEFAULT_ATTEMPTS, initializeUnlimitedGame } = useGameStore();

useSeoMeta({
  title: () => (isUnlimited.value ? "Classic Unlimited" : "Classic Daily"),
  ogTitle: () => (isUnlimited.value ? "Classic Unlimited" : "Classic Daily"),
  description: () =>
    `Guess the Warframe in ${DEFAULT_ATTEMPTS} tries. Each try reveals more information about the Warframe.`,
  ogDescription: () =>
    `Guess the Warframe in ${DEFAULT_ATTEMPTS} tries. Each try reveals more information about the Warframe.`,
});

const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());
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

const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("classic");
});

useSubmission();

const labelMap = {
  warframe: "The name and image of the Warframe you guessed",
  sex: "Male, Female or Non-binary",
  variant: "Standard, Prime or Umbra",
  playstyle: "Damage, Stealth, Support, Survival, etc...",
  "base health": "The health of the Warframe at level 0",
  "base shield": "The shields of the Warframe at level 0",
  "progenitor element": "Impact, Heat, Cold, etc...",
  "release year": "Any year between 2012 and today",
};

const headerText = computed(() => {
  if (isDaily.value) {
    return "Guess Today's Warframe";
  }
  return "Guess the Warframe";
});

const { makeGuess } = useGuess();
</script>
<template>
  <div
    v-if="mode === 'classic' || mode === 'classicUnlimited'"
    class="flex flex-col gap-4"
  >
    <UiAppSpinner v-if="isLoadingDailies" />
    <div v-else>
      <div v-if="itemToGuess[mode]" class="flex flex-col gap-4">
        <RemainingGuesses />
        <UCard class="divide-y-0">
          <template #title>
            <h1
              class="font-roboto text-xl font-bold text-primary-600 uppercase dark:text-primary"
            >
              {{ headerText }}
            </h1>
          </template>
          <template v-if="attempts[mode] === DEFAULT_ATTEMPTS" #description>
            <p class="text-base font-medium text-default uppercase">
              Take a guess to get started
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
        <template v-if="itemToGuess[mode]">
          <ClassicSummaryRow
            :correct-warframe="getWarframe(itemToGuess[mode]!)"
            :guessed-items="guessedItems[mode]"
          />
        </template>
        <div class="flex flex-col gap-4 overflow-x-auto md:overflow-x-visible">
          <UFieldGroup
            class="grid w-[190%] grid-cols-8 text-sm uppercase md:ml-[-45%] md:text-base"
          >
            <UPopover
              v-for="(text, label) of labelMap"
              :key="label"
              mode="hover"
              enable-touch
              :content="{
                side: 'top',
              }"
              :ui="{
                content: 'text-md rounded-none px-3 py-2',
              }"
            >
              <UButton
                variant="outline"
                color="neutral"
                class="flex justify-center font-roboto text-sm uppercase"
              >
                {{ label }}
              </UButton>
              <template #content>
                {{ text }}
              </template>
            </UPopover>
          </UFieldGroup>
          <div
            v-if="itemToGuess[mode] && guessedItems[mode].length"
            class="grid w-[190%] grid-cols-8 gap-1 text-sm capitalize md:ml-[-45%] md:text-base"
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
          Scroll horizontally to see more
          <UIcon name="i-heroicons-arrow-long-right" class="size-5" />
        </div>
        <template v-if="isGameOver">
          <GameOverNavigation v-if="!mode.includes('Unlimited')" />
          <GameOver />
        </template>
      </div>
      <ModeUnavailable v-else />
    </div>
  </div>
</template>
