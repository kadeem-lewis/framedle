<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
import party from "party-js";

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

const gameOverCards = useTemplateRef("gameOverCards");

onMounted(() => {
  nextTick(() => {
    gameOverCards.value?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    if (currentGameState.value === GameStatus.WON) {
      party.confetti(gameOverCards.value!);
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

const runtimeConfig = useRuntimeConfig();

const numberOfTries = computed(() => {
  const currentMode = mode.value;
  if (currentMode && isLegacyMode(currentMode)) {
    return DEFAULT_ATTEMPTS - attempts.value[currentMode];
  }
  return null;
});

function useGameOverMessage() {
  if (!hasWon.value) {
    return {
      title: "Mission Failed",
      subtitle: "It appears you need more practice, Tenno.",
    };
  }
  if (numberOfTries.value === DEFAULT_ATTEMPTS) {
    return {
      title: " Mission Complete",
      subtitle: "The odds were against us, Tenno - but we did it.",
    };
  }

  return {
    title: "Mission Complete",
    subtitle: "Excellent work, Tenno.",
  };
}

const { title: gameOverTitle, subtitle: gameOverSubtitle } =
  useGameOverMessage();
</script>
<template>
  <div ref="gameOverCards" class="flex flex-col gap-4">
    <UCard
      v-if="mode && isLegacyMode(mode)"
      :class="[
        'border',
        {
          'border-correct-border-subtle bg-correct-base': hasWon,
          'border-incorrect-border-subtle bg-incorrect-base': !hasWon,
        },
      ]"
    >
      <template #title>
        <p class="font-roboto text-2xl font-bold uppercase">
          {{ gameOverTitle }}
        </p>
      </template>
      <template #description>
        <p class="font-roboto text-lg font-semibold uppercase">
          {{ gameOverSubtitle }}
        </p>
      </template>
      <div class="flex flex-col items-center gap-2">
        <div class="flex flex-col items-center gap-2">
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
              v-if="correctWarframe?.image"
              provider="imagekit"
              :src="correctWarframe.image"
              :alt="correctWarframe.name"
              height="76"
              width="76"
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
          :correct-ability="itemToGuess[mode] as AbilityName"
        />
        <p>
          Number of tries:
          <span class="font-semibold">{{ numberOfTries }}</span>
        </p>
        <UButton
          v-if="!$route.path.includes('unlimited')"
          icon="i-heroicons-chart-bar-solid"
          variant="tenno"
          class="font-semibold"
          @click="handleStatsClick"
          >Stats</UButton
        >
        <UButton
          v-if="$route.path.includes('unlimited')"
          variant="tenno"
          class="font-semibold"
          size="xl"
          @click="resetCurrentGame"
          >New Game</UButton
        >

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
      </div>
    </UCard>
    <UCard>
      <div class="my-2 flex flex-col gap-2">
        <p class="text-center font-semibold uppercase">Share your Results</p>
        <ShareOptions />
      </div>
    </UCard>
    <UCard>
      <div class="flex flex-col items-center gap-2">
        <p class="text-center">
          Your support helps keep the game running and goes to the development
          of new features!
        </p>
        <NuxtLink :href="runtimeConfig.public.kofiUrl" target="_blank" external
          ><NuxtImg
            height="40"
            width="200"
            format="avif"
            class="border-0 transition-transform hover:scale-105 hover:brightness-105 dark:hover:brightness-75"
            src="/badges/KofiSupportBadgeBlue.png"
            alt="Support me on Ko-fi.com"
        /></NuxtLink>
      </div>
    </UCard>
    <UCard v-if="isDaily">
      <div class="flex flex-col gap-2">
        <NextGameCountdown :target-date="startOfTomorrow()" />
        <template v-if="isPastDay && differentMode">
          <USeparator />
          <div class="flex w-full flex-col gap-4">
            <p class="text-center font-roboto text-xl font-semibold uppercase">
              Next Mode:
            </p>
            <NuxtLink :to="differentMode.route">
              <UiAppModeCard :card="differentMode" />
            </NuxtLink>
          </div>
        </template>
      </div>
    </UCard>
  </div>
</template>
