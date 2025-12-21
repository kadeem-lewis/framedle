<script setup lang="ts">
import { format, startOfTomorrow } from "date-fns";
import party from "party-js";
import type { Ability } from "#shared/schemas/warframe";

const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());
const { resetCurrentGame, DEFAULT_ATTEMPTS } = useGameStore();

const { mode, isDaily, isLegacyMode, isLegacyDailyMode } = useGameMode();

const correctWarframe = computed(() => {
  const gameMode = mode.value as keyof typeof itemToGuess.value;
  if (!gameMode) throw createError("Mode is not set");
  if (gameMode === "ability" || gameMode === "abilityUnlimited") {
    return getWarframe(itemToGuess.value[gameMode]!.belongsTo);
  }
  return getWarframe(itemToGuess.value[gameMode]!);
});

const showGuesses = ref(false);

const { hasWon, isGameOver, currentGameState } =
  storeToRefs(useGameStateStore());

const answer = computed(() => {
  if (!mode.value) throw createError("Mode is not set");
  if (!isLegacyMode(mode.value)) throw createError("Not a legacy mode");
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return itemToGuess.value[mode.value]?.belongsTo;
  } else {
    return itemToGuess.value[mode.value];
  }
});

const { openDialog } = useDialog();

function handleStatsClick() {
  openDialog(dialogOptions.STATS);
}

const gameOverCard = useTemplateRef("gameOverCard");

watchEffect(() => {
  if (mode.value && isGameOver.value && gameOverCard.value) {
    gameOverCard.value.scrollIntoView({ behavior: "smooth", block: "center" });
    gameOverCard.value.focus();
  }
});

const { updateStatsOnGameOver } = useStatsStore();
const { proxy } = useScriptUmamiAnalytics();
watchEffect(() => {
  if (
    mode.value &&
    (currentGameState.value === GameStatus.WON ||
      currentGameState.value === GameStatus.LOST)
  ) {
    updateStatsOnGameOver();
    proxy.track("completed game", { mode: mode.value });
  }
});

watchEffect(() => {
  if (!mode.value || !gameOverCard.value) return;
  // guessed items check is here to make sure confetti doesn't trigger prematurely
  if (
    currentGameState.value === GameStatus.WON &&
    isLegacyMode(mode.value) &&
    guessedItems.value[mode.value].length > 0
  ) {
    party.confetti(gameOverCard.value);
  }
});

const { activeDays } = storeToRefs(useDailiesStore());

watchEffect(async () => {
  if (!mode.value || !isLegacyDailyMode(mode.value)) return;

  // Only when state changes to WON or LOST (not ACTIVE or *_PREVIOUS)
  if (
    currentGameState.value === GameStatus.WON ||
    currentGameState.value === GameStatus.LOST
  ) {
    await db.progress
      .where({
        mode: mode.value,
        ...(activeDays.value[mode.value]
          ? { day: activeDays.value[mode.value] }
          : { date: format(new Date(), "yyyy-MM-dd") }),
      })
      .modify({
        state: currentGameState.value,
      })
      .catch((e) => {
        console.error("Failed to update daily state", e);
      });
  }
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
        <ShareButton />
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
