<script setup lang="ts">
const { guessedWarframe, correctWarframe } = defineProps<{
  guessedWarframe: Warframe;
  correctWarframe: Warframe;
}>();
const { checkGuess } = useGuess();
</script>
<template>
  <div class="contents">
    <UiFeedbackTile
      field-label="Warframe"
      :field-value="guessedWarframe.name"
      :show-visual-assist="true"
    >
      <NuxtImg
        format="avif"
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
      :show-visual-assist="true"
    >
      {{ guessedWarframe.sex }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="checkGuess(correctWarframe.variant, guessedWarframe.variant)"
      field-label="Variant"
      :field-value="guessedWarframe.variant"
      :show-visual-assist="true"
    >
      {{ guessedWarframe.variant }}
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
      :show-visual-assist="true"
    >
      {{ [...guessedWarframe.playstyle].join(", ") }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="checkGuess(correctWarframe.health, guessedWarframe.health)"
      field-label="Health"
      :field-value="guessedWarframe.health"
      :show-visual-assist="true"
    >
      {{ guessedWarframe.health }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="checkGuess(correctWarframe.shield, guessedWarframe.shield)"
      field-label="Shield"
      :field-value="guessedWarframe.shield"
      :show-visual-assist="true"
    >
      {{ guessedWarframe.shield }}
    </UiFeedbackTile>
    <UiFeedbackTile
      :variant="
        checkGuess(correctWarframe.progenitor, guessedWarframe.progenitor)
      "
      field-label="Element"
      :field-value="guessedWarframe.progenitor"
      :show-visual-assist="true"
    >
      <div class="flex flex-col items-center gap-1">
        <NuxtImg
          format="avif"
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
          parseReleaseDate(correctWarframe.releaseDate),
          parseReleaseDate(guessedWarframe.releaseDate),
        )
      "
      field-label="Release Date"
      :field-value="parseReleaseDate(guessedWarframe.releaseDate)"
      :show-visual-assist="true"
    >
      {{ parseReleaseDate(guessedWarframe.releaseDate) }}
    </UiFeedbackTile>
  </div>
</template>
