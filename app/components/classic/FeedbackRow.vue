<template>
  <!-- I can probably just have one grid for the entire feedback area -->
  <div class="contents">
    <UiFeedbackTile :is-correct="guessedWarframe.name === correctWarframe.name">
      <UTooltip :text="guessedWarframe.name">
        <NuxtImg
          :src="`https://cdn.warframestat.us/img/${guessedWarframe.imageName}`"
          :alt="guessedWarframe.name"
          placeholder
          class="h-16"
        />
      </UTooltip>
    </UiFeedbackTile>

    <UiFeedbackTile :is-correct="guessedWarframe.sex === correctWarframe.sex">
      {{ guessedWarframe.sex }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :is-correct="
        compareNumeric(guessedWarframe.health, correctWarframe.health).isCorrect
      "
      v-bind="{
        ...(compareNumeric(guessedWarframe.health, correctWarframe.health) && {
          difference: compareNumeric(
            guessedWarframe.health,
            correctWarframe.health,
          ).difference,
        }),
      }"
    >
      {{ guessedWarframe.health }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :is-correct="
        compareNumeric(guessedWarframe.shield, correctWarframe.shield).isCorrect
      "
      v-bind="{
        ...(compareNumeric(guessedWarframe.shield, correctWarframe.shield) && {
          difference: compareNumeric(
            guessedWarframe.shield,
            correctWarframe.shield,
          ).difference,
        }),
      }"
    >
      {{ guessedWarframe.shield }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :is-correct="guessedWarframe.progenitor === correctWarframe.progenitor"
    >
      <UTooltip :text="guessedWarframe.progenitor">
        <NuxtImg
          :src="`/elements/${guessedWarframe.progenitor}.png`"
          class="h-10"
        />
      </UTooltip>
    </UiFeedbackTile>
    <UiFeedbackTile
      :is-correct="
        compareNumeric(
          parseReleaseDate(guessedWarframe.releaseDate),
          parseReleaseDate(correctWarframe.releaseDate),
        ).isCorrect
      "
      v-bind="{
        ...(compareNumeric(
          parseReleaseDate(guessedWarframe.releaseDate),
          parseReleaseDate(correctWarframe.releaseDate),
        ) && {
          difference: compareNumeric(
            parseReleaseDate(guessedWarframe.releaseDate),
            parseReleaseDate(correctWarframe.releaseDate),
          ).difference,
        }),
      }"
    >
      {{ guessedWarframe.releaseDate.split("-")[0] }}
    </UiFeedbackTile>
  </div>
</template>

<script setup lang="ts">
import type { Warframe } from "~~/schemas/warframe";

// this can receive a guessed item as a prop and then handle the majority of the logic
defineProps<{
  guessedWarframe: Warframe;
  correctWarframe: Warframe;
}>();

const parseReleaseDate = (releaseDate: string) => {
  return Number(releaseDate.split("-")[0]);
};

const compareNumeric = (guessed: number, correct: number) => {
  if (guessed === correct) return { isCorrect: true };
  return guessed > correct
    ? { isCorrect: false, difference: correct - guessed }
    : { isCorrect: false, difference: correct - guessed };
};
</script>
