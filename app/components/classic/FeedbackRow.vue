<template>
  <div class="contents">
    <UiFeedbackTile field-label="Warframe" :field-value="guessedWarframe.name">
      <NuxtImg
        format="webp"
        :src="`https://cdn.warframestat.us/img/${guessedWarframe.imageName}`"
        :alt="guessedWarframe.name"
        preload
        placeholder
        class="h-16"
      />
    </UiFeedbackTile>

    <UiFeedbackTile
      :is-correct="guessedWarframe.sex === correctWarframe.sex"
      field-label="Sex"
      :field-value="guessedWarframe.sex"
    >
      {{ guessedWarframe.sex }}
    </UiFeedbackTile>
    <UiFeedbackTile
      v-bind="
        getNumericComparisonProps(
          guessedWarframe.health,
          correctWarframe.health,
          'Health',
        )
      "
    >
      {{ guessedWarframe.health }}
    </UiFeedbackTile>
    <UiFeedbackTile
      v-bind="
        getNumericComparisonProps(
          guessedWarframe.shield,
          correctWarframe.shield,
          'Shield',
        )
      "
    >
      {{ guessedWarframe.shield }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :is-correct="guessedWarframe.progenitor === correctWarframe.progenitor"
      field-label="Element"
      :field-value="guessedWarframe.progenitor"
    >
      <NuxtImg
        format="webp"
        :src="`/elements/${guessedWarframe.progenitor}.png`"
        :alt="guessedWarframe.progenitor"
        class="h-10"
        preload
      />
    </UiFeedbackTile>
    <UiFeedbackTile
      v-bind="
        getNumericComparisonProps(
          parseReleaseDate(guessedWarframe.releaseDate),
          parseReleaseDate(correctWarframe.releaseDate),
          'Release Date',
        )
      "
    >
      {{ parseReleaseDate(guessedWarframe.releaseDate) }}
    </UiFeedbackTile>
  </div>
</template>

<script setup lang="ts">
import type { Warframe } from "#shared/schemas/warframe";

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
  return {
    isCorrect: false,
    difference: correct - guessed,
  };
};

const getNumericComparisonProps = (
  guessed: number,
  correct: number,
  fieldLabel: string,
) => {
  const comparison = compareNumeric(guessed, correct);

  return {
    isCorrect: comparison.isCorrect,
    fieldLabel,
    fieldValue: guessed,
    ...(comparison.isCorrect === false && {
      difference: comparison.difference,
    }),
  };
};
</script>
