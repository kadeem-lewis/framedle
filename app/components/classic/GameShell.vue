<script setup lang="ts">
const { gameState, header } = defineProps<{
  gameState: {
    itemToGuess: WarframeName;
    guessedItems: WarframeName[];
    attempts: number;
  };
  header: string;
}>();

const { isDaily, mode } = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());

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

const { makeGuess } = useGuess();

const { showClassicSummary } = storeToRefs(useSettingsStore());
</script>
<template>
  <div>
    <div v-if="mode">
      <div v-if="gameState.itemToGuess" class="flex flex-col gap-4">
        <GameNavigation />
        <RemainingGuesses :attempts="gameState.attempts" />
        <UCard class="divide-y-0">
          <template #title>
            <h1
              class="font-roboto text-xl font-semibold text-primary-600 uppercase dark:text-primary"
            >
              {{ header }}
            </h1>
          </template>
          <template v-if="gameState.attempts === DEFAULT_ATTEMPTS" #description>
            <p class="text-base text-default uppercase">
              Take a guess to get started
            </p>
          </template>
          <WarframeSearch
            v-if="!isGameOver"
            :items="warframeNames"
            :disabled-items="gameState.guessedItems"
            @submit="makeGuess($event, mode)"
          />
        </UCard>
        <GlobalStats v-if="isDaily" />
        <div class="flex flex-col gap-4 overflow-x-auto md:overflow-x-visible">
          <ClassicSummaryRow
            v-if="showClassicSummary"
            :correct-warframe="getWarframe(gameState.itemToGuess)"
            :guessed-items="gameState.guessedItems"
          />
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
            v-if="gameState.guessedItems.length"
            class="grid w-[190%] grid-cols-8 gap-1 text-sm capitalize md:ml-[-45%] md:text-base"
          >
            <ClassicFeedbackRow
              v-for="warframe of [...gameState.guessedItems].reverse()"
              :key="warframe"
              :guessed-warframe="getWarframe(warframe)"
              :correct-warframe="getWarframe(gameState.itemToGuess)"
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
        <GameOver v-if="isGameOver" :game-state="gameState" />
      </div>
      <ModeUnavailable v-else />
    </div>
  </div>
</template>
