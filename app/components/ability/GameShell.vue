<script setup lang="ts">
const { gameState } = defineProps<{
  gameState: {
    itemToGuess: AbilityName;
    guessedItems: WarframeName[];
    attempts: number;
    selectedMinigameAbility: string;
  };
}>();
const { mode, isDaily } = useGameMode();

const { isGameOver } = storeToRefs(useGameStateStore());
const { isLoadingDailies } = storeToRefs(useDailiesStore());

useSubmission();

// Loading state for the image
const isImageLoading = ref(false);
const showLoadingSpinner = ref(false);
let loadingTimeout: NodeJS.Timeout;

// Handle loading state changes
function handleImageLoading() {
  isImageLoading.value = true;
  // Only show spinner after 150ms delay (adjust as needed)
  loadingTimeout = setTimeout(() => {
    if (isImageLoading.value) {
      showLoadingSpinner.value = true;
    }
  }, 150);
}

function handleImageLoaded(success: boolean) {
  isImageLoading.value = false;
  showLoadingSpinner.value = false;
  clearTimeout(loadingTimeout);

  if (!success) {
    console.error("Failed to load image");
  }
}

onUnmounted(() => {
  clearTimeout(loadingTimeout);
});

const isLoading = computed(() => {
  return showLoadingSpinner.value || isLoadingDailies.value;
});

const { makeGuess } = useGuess();
</script>
<template>
  <div>
    <UiAppSpinner v-if="isLoading" />
    <div v-show="!isLoading">
      <div
        v-if="mode === 'ability' || mode === 'abilityUnlimited'"
        class="flex flex-col gap-4"
      >
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
              @loading="handleImageLoading"
              @loaded="handleImageLoaded"
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
          <GameOver v-else :game-state="gameState" />
        </div>
      </div>
    </div>
  </div>
</template>
