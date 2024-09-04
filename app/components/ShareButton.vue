<template>
  <div>
    <UButton
      class="font-semibold uppercase"
      variant="outline"
      size="xl"
      :ui="{
        rounded: false,
      }"
      @click="handleShareClick"
    >
      {{ !copied ? "Share" : "Copied" }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { Warframe } from "~~/schemas/warframe";

const emojis: {
  incorrect: string;
  correct: string;
  lower: string;
  higher: string;
  unused: string;
} = {
  incorrect: "🟥",
  correct: "🟩",
  lower: "🔽",
  higher: "🔼",
  unused: "◻️",
};

const { mode, guessedItems, itemToGuess, attempts } =
  storeToRefs(useGameStore());
const { defaultAttempts } = useGameStore();

const route = useRoute();
const { copy, copied } = useClipboard();

const emojiFeedback = ref<string[]>([]);

//TODO: This is temporarily copied over but it should be in a composable or util
const hasWon = computed(() => {
  if (!mode.value) return;
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return (
      attempts.value[mode.value] >= 0 &&
      guessedItems.value[mode.value].some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value[mode.value]?.belongsTo,
      )
    );
  }
  if (mode.value === "classic" || mode.value === "classicUnlimited") {
    return (
      attempts.value[mode.value] >= 0 &&
      guessedItems.value[mode.value].some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value[mode.value]?.name,
      )
    );
  }
  return false;
});

const { encode } = useEncoder();

function handleShareClick() {
  const currentMode = mode.value;
  if (!currentMode) return;
  if (currentMode === "ability" || currentMode === "abilityUnlimited") {
    guessedItems.value[currentMode].forEach((guessedItem) => {
      if (guessedItem.name === itemToGuess.value[currentMode]?.belongsTo) {
        emojiFeedback.value.push(emojis.correct);
      } else {
        emojiFeedback.value.push(emojis.incorrect);
      }
    });
    emojiFeedback.value = emojiFeedback.value.concat(
      new Array(attempts.value[currentMode]).fill(emojis.unused),
    );
  }
  if (currentMode === "classic" || currentMode === "classicUnlimited") {
    const correctItem = itemToGuess.value[currentMode];
    guessedItems.value[currentMode].forEach((guessedItem) => {
      if (correctItem) {
        emojiFeedback.value.push(
          generateClassicEmojiFeedback(correctItem, guessedItem),
        );
      }
    });
  }

  //! As more game modes are added, this will need to be updated
  const emojiGrid =
    route.name === "classic"
      ? emojiFeedback.value.join("\n")
      : emojiFeedback.value.join(" ");

  const attemptsUsed = defaultAttempts - attempts.value[currentMode];

  const topText = route.query.mode
    ? hasWon.value
      ? `I solved a Framedle in ${attemptsUsed} out of ${defaultAttempts} turns.`
      : `I couldn't solve this Framedle in ${defaultAttempts} turns.`
    : `Framedle ${currentMode} ${hasWon.value ? attemptsUsed : "X"}/${defaultAttempts}`;

  const grid = `
${topText}

${emojiGrid}
${
  route.query.mode
    ? `See how you do on the same challenge I played:
${window.location.href}&x=${itemToGuess.value[currentMode] && encode(itemToGuess.value[currentMode].name)}`
    : window.location.href
}
  `;
  copy(grid);
  emojiFeedback.value = [];
}

function generateClassicEmojiFeedback(
  correctItem: Warframe,
  guessedItem: Warframe,
) {
  const gridRow: string[] = [];

  if (correctItem.sex !== guessedItem.sex) {
    gridRow.push(emojis.incorrect);
  } else {
    gridRow.push(emojis.correct);
  }

  if (correctItem.health !== guessedItem.health) {
    gridRow.push(
      correctItem.health > guessedItem.health ? emojis.higher : emojis.lower,
    );
  } else {
    gridRow.push(emojis.correct);
  }
  if (correctItem.shield !== guessedItem.shield) {
    gridRow.push(
      correctItem.shield > guessedItem.shield ? emojis.higher : emojis.lower,
    );
  } else {
    gridRow.push(emojis.correct);
  }
  if (correctItem.progenitor !== guessedItem.progenitor) {
    gridRow.push(emojis.incorrect);
  } else {
    gridRow.push(emojis.correct);
  }
  if (correctItem.releaseDate !== guessedItem.releaseDate) {
    gridRow.push(
      correctItem.releaseDate > guessedItem.releaseDate
        ? emojis.higher
        : emojis.lower,
    );
  } else {
    gridRow.push(emojis.correct);
  }
  return gridRow.join("");
}

function useCheckGuess(
  correctProperty: string | number,
  guessedProperty: string | number,
) {
  if (
    typeof correctProperty === "string" &&
    typeof guessedProperty === "string"
  ) {
    const isCorrect = correctProperty === guessedProperty;
    return {
      isCorrect,
      difference: 0,
    };
  }
  if (
    typeof correctProperty === "number" &&
    typeof guessedProperty === "number"
  ) {
    const isCorrect = correctProperty === guessedProperty;
    return {
      isCorrect,
      difference: correctProperty - guessedProperty,
    };
  }
  return {
    isCorrect: false,
    difference: 0,
  };
}
</script>
