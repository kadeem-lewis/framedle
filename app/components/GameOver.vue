<template>
  <div ref="gameOverCard">
    <UCard
      v-if="mode"
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
          <span class="text-xl font-bold capitalize">
            {{ answer }}
          </span>
          <UiFeedbackTile
            field-label="Warframe"
            :field-value="correctWarframe?.name"
          >
            <NuxtImg
              :src="`https://cdn.warframestat.us/img/${correctWarframe?.imageName}`"
              :alt="correctWarframe?.name"
              format="webp"
              height="64"
            />
          </UiFeedbackTile>
        </div>
        <p>
          Number of tries:
          <span class="font-semibold">{{
            defaultAttempts - attempts[mode]
          }}</span>
        </p>
        <UButton
          v-if="!$route.query.mode"
          icon="i-heroicons-chart-bar-solid"
          variant="outline"
          class="font-semibold uppercase"
          @click="handleStatsClick"
          >Stats</UButton
        >
        <UButton
          v-if="$route.query.mode"
          variant="outline"
          class="font-semibold uppercase"
          size="xl"
          @click="resetGame"
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
              :key="guessedItem.name"
              class="flex gap-2"
            >
              <p>{{ guessedItem.name === answer ? "✅" : "❌" }}</p>
              <p class="font-semibold uppercase">
                {{ guessedItem.name }}
              </p>
            </li>
          </ul>
        </div>
        <template v-if="!$route.query.mode">
          <div class="flex gap-2 text-xl">
            <p>New Game in:</p>
            <span class="flex items-center gap-1">
              <UIcon name="i-mdi-circle-slice-2" class="size-5" />
              <NextGameCountdown :target-date="startOfTomorrow()" />
            </span>
          </div>
          <USeparator />
          <div class="space-y-4">
            <p class="font-roboto text-center text-xl font-semibold uppercase">
              Next Mode:
            </p>
            <ModeCard :tab="tabs.find((tab) => tab.route !== $route.path)!" />
          </div>
        </template>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
import party from "party-js";

const { itemToGuess, guessedItems, attempts, warframes } =
  storeToRefs(useGameStore());
const { resetGame, defaultAttempts } = useGameStore();

const mode = useGameMode();

const img = useImage();

const tabs = [
  {
    label: "Classic",
    route: "/classic",
    source: "/warframe.png",
    background: img("/backgrounds/fortuna.jpg", { format: "webp" }),
    description: "Guess the Warframe",
  },
  {
    label: "Ability",
    route: "/ability",
    source: "/PassiveAbilityIcon.png",
    background: img("/backgrounds/helminth.jpg", { format: "webp" }),
    description: "Guess the Ability",
  },
];

const correctWarframe = computed(() => {
  const gameMode = mode.value as keyof typeof itemToGuess.value;
  if (!gameMode) throw createError("Mode is not set");
  if (gameMode === "ability" || gameMode === "abilityUnlimited") {
    return warframes.value.find(
      (warframe) => warframe.name === itemToGuess.value[gameMode]?.belongsTo,
    );
  }
  return itemToGuess.value[gameMode];
});

const showGuesses = ref(false);

const { hasWon, isGameOver, currentGameState } =
  storeToRefs(useGameStateStore());

const answer = computed(() => {
  if (!mode.value) throw createError("Mode is not set");
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return itemToGuess.value[mode.value]?.belongsTo;
  } else {
    return itemToGuess.value[mode.value]?.name;
  }
});

const { openDialog } = useDialog();

function handleStatsClick() {
  openDialog(dialogOptions.STATS);
}

const gameOverCard = useTemplateRef("gameOverCard");

watchEffect(() => {
  if (mode.value && isGameOver.value) {
    gameOverCard.value?.scrollIntoView({ behavior: "smooth" });
  }
});

const { updateStatsOnGameOver } = useStatsStore();
const { proxy } = useScriptUmamiAnalytics();
watchEffect(() => {
  if (mode.value && currentGameState.value === GameStatus.WON) {
    updateStatsOnGameOver();
    proxy.track("completed game", { mode: mode.value });
  }
});

watchEffect(() => {
  if (currentGameState.value === GameStatus.WON && gameOverCard.value) {
    party.confetti(gameOverCard.value);
  }
});
</script>
