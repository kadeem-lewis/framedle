<script setup lang="ts">
definePageMeta({
  layout: "game",
  validate: validateRoute,
});

useSeoMeta({
  title: "Ability",
});

const { t } = useI18n();

const { itemToGuess, guessedItems } = storeToRefs(useGameStore());
const { initializeUnlimitedGame } = useGameStore();
const { mode, isDaily } = useGameMode();
const route = useRoute("ability-path");
const { isGameOver } = storeToRefs(useGameStateStore());
const { resetStreak } = useStatsStore();
const { isLoadingDailies } = storeToRefs(useDailiesStore());

await callOnce(
  "ability-setup",
  () => {
    if (!mode.value) return;
    initializeUnlimitedGame(mode.value, route.query.x as string | undefined);
  },
  {
    mode: "navigation",
  },
);

onBeforeMount(() => {
  resetStreak("ability");
});

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
        <div v-if="itemToGuess[mode]" class="space-y-4">
          <RemainingGuesses />
          <UCard class="divide-y-0">
            <template #header>
              <p
                class="text-primary-600 font-roboto dark:text-primary text-xl font-bold uppercase"
              >
                {{ t("ability.title") }}
              </p>
              <p class="font-semibold uppercase">Each try reveals a tile</p>
            </template>
            <AbilityImageToGuess
              @loading="handleImageLoading"
              @loaded="handleImageLoaded"
            />
            <template #footer>
              <WarframeSearch
                v-if="!isGameOver"
                :items="vanillaWarframes"
                :disabled-items="guessedItems[mode]"
                @submit="makeGuess($event, mode)"
              />
            </template>
          </UCard>
          <GlobalStats v-if="isDaily" />
          <AbilityFeedbackArea v-if="!isGameOver" />
          <template v-else>
            <GameOverNavigation v-if="!mode.includes('Unlimited')" />
            <GameOver />
          </template>
        </div>
        <ModeUnavailable v-else />
      </div>
    </div>
  </div>
</template>
