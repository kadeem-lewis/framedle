<template>
  <div>
    <!-- I can probably just have one grid for the entire feedback area -->
    <div class="grid grid-cols-6 gap-1 md:-ml-[15%] md:w-[130%]">
      <UiTile>
        {{ guessedWarframe.name }}
      </UiTile>

      <UiTile :is-correct="guessedWarframe.sex === correctWarframe.sex">
        {{ guessedWarframe.sex }}
      </UiTile>
      <UiTile
        :is-correct="
          compareNumeric(guessedWarframe.health, correctWarframe.health)
            .isCorrect
        "
        v-bind="{
          ...(compareNumeric(
            guessedWarframe.health,
            correctWarframe.health,
          ) && {
            difference: compareNumeric(
              guessedWarframe.health,
              correctWarframe.health,
            ).difference,
          }),
        }"
      >
        {{ guessedWarframe.health }}
      </UiTile>
      <UiTile
        :is-correct="
          compareNumeric(guessedWarframe.shield, correctWarframe.shield)
            .isCorrect
        "
        v-bind="{
          ...(compareNumeric(
            guessedWarframe.shield,
            correctWarframe.shield,
          ) && {
            difference: compareNumeric(
              guessedWarframe.shield,
              correctWarframe.shield,
            ).difference,
          }),
        }"
      >
        {{ guessedWarframe.shield }}
      </UiTile>
      <UiTile
        :is-correct="guessedWarframe.progenitor === correctWarframe.progenitor"
      >
        {{ guessedWarframe.progenitor }}
      </UiTile>
      <UiTile
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
      </UiTile>
    </div>
  </div>
</template>

<script setup lang="ts">
// this can receive a guessed item as a prop and then handle the majority of the logic
defineProps<{
  guessedWarframe: { [key: string]: string | number };
  correctWarframe: { [key: string]: string | number };
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
