<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
import party from "party-js";
import type { Ability } from "#shared/schemas/warframe";

const { itemToGuess, guessedItems, attempts, correctWarframe, answer } =
  storeToRefs(useGameStore());
const { resetCurrentGame, DEFAULT_ATTEMPTS } = useGameStore();

const { mode, isDaily, isLegacyMode } = useGameMode();

const showGuesses = ref(false);

const { hasWon, currentGameState } = storeToRefs(useGameStateStore());

const { openDialog } = useDialog();

function handleStatsClick() {
  openDialog(dialogOptions.STATS);
}

const gameOverCard = useTemplateRef("gameOverCard");

onMounted(() => {
  nextTick(() => {
    gameOverCard.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (currentGameState.value === GameStatus.WON) {
      party.confetti(gameOverCard.value!);
    }
  });
});

const route = useRoute();
const isPastDay = computed(() => {
  if (route.name === "ability-path" || route.name === "classic-path") {
    const day = Number(route.params.path?.at(-1));
    if (isValidDayNumber(day)) return false;
    return true;
  }
  return false;
});

const { activeCards } = useModeCards();

const differentMode = computed(() => {
  if (!mode.value) return;
  return activeCards.value.find((card) => card.route !== route.path);
});
</script>
<template>
  <div ref="gameOverCard">
    <UCard
      v-if="mode && isLegacyMode(mode)"
      :class="[
        'border-2',
        { 'border-success': hasWon, 'border-error': !hasWon },
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <p class="font-roboto text-2xl font-bold uppercase">
          {{ hasWon ? "You Win!" : "You Lost!" }}
        </p>

        <div class="space-y-2 text-center">
          <p class="uppercase">The answer was:</p>
          <span class="text-xl font-bold uppercase">
            {{ answer }}
          </span>
          <UiFeedbackTile
            field-label="Warframe"
            :field-value="`${correctWarframe}`"
            tooltip-disabled
          >
            <NuxtImg
              :src="`https://cdn.warframestat.us/img/${correctWarframe?.imageName}`"
              :alt="`${correctWarframe}`"
              format="webp"
              height="64"
            />
          </UiFeedbackTile>
        </div>
        <AbilityGameOverMiniGame
          v-if="
            correctWarframe &&
            (mode === 'ability' || mode === 'abilityUnlimited') &&
            itemToGuess[mode]
          "
          :correct-warframe="correctWarframe"
          :correct-ability="itemToGuess[mode] as Ability"
        />
        <p>
          Number of tries:
          <span class="font-semibold">{{
            DEFAULT_ATTEMPTS - attempts[mode]
          }}</span>
        </p>
        <UButton
          v-if="!$route.path.includes('unlimited')"
          icon="i-heroicons-chart-bar-solid"
          variant="outline"
          class="font-semibold uppercase"
          @click="handleStatsClick"
          >Stats</UButton
        >
        <UButton
          v-if="$route.path.includes('unlimited')"
          variant="outline"
          class="font-semibold uppercase"
          size="xl"
          @click="resetCurrentGame"
          >New Game</UButton
        >
        <div class="my-2 flex flex-col gap-2">
          <p class="font-semibold uppercase">Share your Results</p>
          <ShareOptions />
        </div>
        <div v-if="mode === 'ability' || mode === 'abilityUnlimited'">
          <UButton variant="link" @click="showGuesses = !showGuesses"
            >{{ showGuesses ? "Hide" : "Show" }} guesses</UButton
          >
          <ul v-if="showGuesses">
            <li
              v-for="guessedItem in guessedItems[mode]"
              :key="guessedItem"
              class="flex gap-2"
            >
              <p>{{ guessedItem === answer ? "✅" : "❌" }}</p>
              <p class="font-semibold uppercase">
                {{ guessedItem }}
              </p>
            </li>
          </ul>
        </div>
        <template v-if="isDaily">
          <NextGameCountdown :target-date="startOfTomorrow()" />
          <template v-if="isPastDay && differentMode">
            <USeparator />
            <div class="space-y-4">
              <p
                class="font-roboto text-center text-xl font-semibold uppercase"
              >
                Next Mode:
              </p>
              <UiAppModeCard :card="differentMode" />
            </div>
          </template>
        </template>
      </div>
    </UCard>
  </div>
</template>
