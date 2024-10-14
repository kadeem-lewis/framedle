<template>
  <div ref="gameOverCard">
    <UCard
      v-if="mode"
      :class="[
        'border-2',
        { 'border-green-500': hasWon, 'border-red-500': !hasWon },
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <p class="text-2xl font-bold uppercase">
          {{ hasWon ? "You Win!" : "You Lost!" }}
        </p>

        <div class="space-y-2 text-center">
          <p class="uppercase">The answer was:</p>
          <span class="text-xl font-bold capitalize">
            {{ answer }}
          </span>
          <UiFeedbackTile>
            <NuxtImg
              :src="`https://cdn.warframestat.us/img/${correctWarframe?.imageName}`"
              :alt="correctWarframe?.name"
              format="webp"
              class="h-16"
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
              <p>{{ isCorrectGuess(guessedItem.name) ? "✅" : "❌" }}</p>
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
          <div>
            <UDivider />
            <p class="text-center text-xl font-semibold uppercase">
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
import {
  format,
  startOfDay,
  startOfTomorrow,
  startOfYesterday,
} from "date-fns";
const {
  itemToGuess,
  mode,
  guessedItems,
  attempts,
  isGameOver,
  stats,
  currentDailyDate,
  warframes,
} = storeToRefs(useGameStore());
const { resetGame, defaultAttempts } = useGameStore();

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
  if (!mode.value) throw new Error("Mode is not set");
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return warframes.value.find(
      (warframe) => warframe.name === itemToGuess.value[mode.value]?.belongsTo,
    );
  }
  return itemToGuess.value[mode.value];
});

const showGuesses = ref(false);

const isCorrectGuess = computed(() => (guess: string) => {
  if (!mode.value) return;
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    if (itemToGuess.value[mode.value]?.belongsTo === guess) {
      return true;
    }
  }
  return false;
});

const { hasWon } = useGameState();

const answer = computed(() => {
  if (!mode.value) return;
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return itemToGuess.value[mode.value]?.belongsTo;
  } else {
    return itemToGuess.value[mode.value]?.name;
  }
});

const isOpen = useState("isOpen");
const selectedOption = useState("selectedOption");

function handleStatsClick() {
  isOpen.value = true;
  selectedOption.value = "stats";
}

const gameOverCard = useTemplateRef("gameOverCard");

watchEffect(() => {
  if (isGameOver.value[mode.value]) {
    gameOverCard.value?.scrollIntoView({ behavior: "smooth" });
  }
});

watch(
  isGameOver,
  (newValue) => {
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    if (
      (mode.value === "ability" || mode.value === "classic") &&
      newValue[mode.value] &&
      currentDailyDate.value === today &&
      stats.value[mode.value].lastPlayedDate !== today
    ) {
      const currentStats = stats.value[mode.value];
      currentStats.plays++;
      currentStats.lastPlayedDate = today;

      if (hasWon.value) {
        currentStats.wins++;
        const attemptsUsed = defaultAttempts - attempts.value[mode.value];
        // @ts-expect-error I need to figure out how to properly type this fixed length array to prevent such as error
        currentStats.guesses[attemptsUsed - 1]++;
        const lastCorrectDate = currentStats.lastCorrectDate;

        if (!lastCorrectDate) {
          currentStats.streak = 1;
        } else if (
          lastCorrectDate === format(startOfYesterday(), "yyyy-MM-dd")
        ) {
          currentStats.streak++;
        } else {
          currentStats.streak = 1;
        }

        currentStats.maxStreak = Math.max(
          currentStats.maxStreak,
          currentStats.streak,
        );
        currentStats.lastCorrectDate = today;
      } else {
        currentStats.streak = 0;
      }
    }
  },
  { immediate: true },
);
</script>
