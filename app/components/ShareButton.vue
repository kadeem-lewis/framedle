<template>
  <div>
    <UButton @click="handleShareClick"> Share </UButton>
  </div>
</template>

<script setup lang="ts">
const emojis: {
  incorrect: string;
  correct: string;
  lower: string;
  higher: string;
} = {
  incorrect: "🟥",
  correct: "🟩",
  lower: "🔽",
  higher: "🔼",
};

const { mode, guessedItems, itemToGuess } = storeToRefs(useGameStore());

const emojiFeedback = ref<string[]>([]);

(() => {
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    guessedItems.value[mode.value].forEach((guessedItem) => {
      if (guessedItem.name === itemToGuess.value[mode.value!]?.belongsTo) {
        emojiFeedback.value.push(emojis.correct);
      } else {
        emojiFeedback.value.push(emojis.incorrect);
      }
    });
  }
})();

function handleShareClick() {
  createEmojiGrid();
}

function createEmojiGrid() {}
</script>
