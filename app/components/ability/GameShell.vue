<script setup lang="ts">
const { gameState, isLoading: isDataLoading } = defineProps<{
  gameState: {
    itemToGuess: AbilityName | null;
    guessedItems: WarframeName[];
    attempts: number;
    selectedMinigameAbility: string;
  };
  isLoading: boolean;
}>();
const { mode, isDaily } = useGameMode();

const { isGameOver } = storeToRefs(useGameStateStore());

useSubmission();

const { makeGuess } = useGuess();

const { gameState: state } = storeToRefs(useGameStateStore());

const shouldShowGameOverAnimations = refAutoReset(false, 1000);
watch(
  state,
  (newVal, oldVal) => {
    if (newVal === GameStatus.WON && oldVal === GameStatus.ACTIVE) {
      shouldShowGameOverAnimations.value = true;
    }
  },
  { immediate: true },
);
</script>
<template>
  <div>
    <UiAppSpinner v-if="isDataLoading || !gameState.itemToGuess" />
    <div v-else-if="mode" class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <GameNavigation v-if="isDaily" />
        <RemainingGuesses :attempts="gameState.attempts" />
        <UCard class="divide-y-0">
          <template #header>
            <h1
              class="font-roboto text-xl font-semibold text-primary-600 uppercase dark:text-primary"
            >
              Which Warframe has this ability?
            </h1>
            <p class="font-semibold uppercase">Each try reveals a tile</p>
          </template>
          <AbilityImageToGuess
            :item-to-guess="gameState.itemToGuess"
            :attempts="gameState.attempts"
          />
          <template #footer>
            <WarframeSearch
              v-if="!isGameOver"
              :items="vanillaWarframes"
              :disabled-items="gameState.guessedItems"
              @submit="makeGuess($event, mode)"
            />
          </template>
        </UCard>
        <GlobalStats v-if="isDaily" />
        <AbilityFeedbackArea
          v-if="!isGameOver"
          :guessed-items="gameState.guessedItems"
          :item-to-guess="gameState.itemToGuess"
        />
        <GameOver
          v-else
          :game-state="gameState"
          :should-show-animations="shouldShowGameOverAnimations"
        />
      </div>
    </div>
  </div>
</template>
