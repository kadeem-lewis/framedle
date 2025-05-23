<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Ability",
});

defineOgImageComponent("Framedle");

const { t } = useI18n();

const { itemToGuess, vanillaWarframes } = storeToRefs(useGameStore());
const { abilityInit } = useGameStore();
const mode = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());
const { resetStreak } = useStatsStore();

await callOnce("ability-setup", abilityInit, {
  mode: "navigation",
});

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
</script>
<template>
  <div>
    <UiAppSpinner v-if="showLoadingSpinner" />
    <div v-show="!showLoadingSpinner">
      <div v-if="mode" class="flex flex-col gap-4">
        <div v-if="itemToGuess[mode]" class="space-y-4">
          <RemainingGuesses />
          <UCard class="divide-y-0">
            <template #header>
              <p
                class="text-primary-600 font-roboto text-xl font-bold uppercase dark:text-(--ui-primary)"
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
              <WarframeSearch v-if="!isGameOver" :items="vanillaWarframes" />
            </template>
          </UCard>

          <AbilityFeedbackArea v-if="!isGameOver" />
          <GameOver v-if="isGameOver" />
        </div>
        <ModeUnavailable v-else />
      </div>
    </div>
  </div>
</template>
