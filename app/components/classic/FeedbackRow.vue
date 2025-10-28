<script setup lang="ts">
defineProps<{
  guessedWarframe: Warframe;
  correctWarframe: Warframe;
}>();
const { checkGuess } = useGuess();
</script>
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
      :variant="checkGuess(correctWarframe.sex, guessedWarframe.sex)"
      field-label="Sex"
      :field-value="guessedWarframe.sex"
    >
      {{ guessedWarframe.sex }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="checkGuess(correctWarframe.variant, guessedWarframe.variant)"
      field-label="Variant"
      :field-value="guessedWarframe.variant"
    >
      {{ guessedWarframe.variant }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="checkGuess(correctWarframe.health, guessedWarframe.health)"
      field-label="Health"
      :field-value="guessedWarframe.health"
    >
      {{ guessedWarframe.health }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="checkGuess(correctWarframe.shield, guessedWarframe.shield)"
      field-label="Shield"
      :field-value="guessedWarframe.shield"
    >
      {{ guessedWarframe.shield }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="
        checkGuess(correctWarframe.progenitor, guessedWarframe.progenitor)
      "
      field-label="Element"
      :field-value="guessedWarframe.progenitor"
    >
      <div class="flex flex-col items-center gap-1">
        <NuxtImg
          format="webp"
          :src="`/elements/${guessedWarframe.progenitor}.png`"
          :alt="guessedWarframe.progenitor"
          class="h-10"
          preload
        />
      </div>
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="
        checkGuess(
          [...correctWarframe.playstyle],
          [...guessedWarframe.playstyle],
        )
      "
      field-label="Playstyle"
      :field-value="[...guessedWarframe.playstyle]"
    >
      {{ [...guessedWarframe.playstyle].join(", ") }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="
        checkGuess(
          parseReleaseDate(correctWarframe.releaseDate),
          parseReleaseDate(guessedWarframe.releaseDate),
        )
      "
      field-label="Release Date"
      :field-value="parseReleaseDate(guessedWarframe.releaseDate)"
    >
      {{ parseReleaseDate(guessedWarframe.releaseDate) }}
    </UiFeedbackTile>
  </div>
</template>
