<script setup lang="ts">
const { guessedWarframe, correctWarframe } = defineProps<{
  guessedWarframe: Warframe;
  correctWarframe: Warframe;
}>();
const { checkGuess } = useGuess();

const feedbackTiles = computed(() => [
  {
    label: "Sex",
    value: guessedWarframe.sex,
    variant: checkGuess(correctWarframe.sex, guessedWarframe.sex),
    display: guessedWarframe.sex,
  },
  {
    label: "Variant",
    value: guessedWarframe.variant,
    variant: checkGuess(correctWarframe.variant, guessedWarframe.variant),
    display: guessedWarframe.variant,
  },
  {
    label: "Playstyle",
    value: [...guessedWarframe.playstyle],
    variant: checkGuess(
      [...correctWarframe.playstyle],
      [...guessedWarframe.playstyle],
    ),
    display: [...guessedWarframe.playstyle].join(", "),
    class: { "text-sm": guessedWarframe.playstyle.length >= 3 },
  },
  {
    label: "Health",
    value: guessedWarframe.health,
    variant: checkGuess(correctWarframe.health, guessedWarframe.health),
    display: guessedWarframe.health,
  },
  {
    label: "Shield",
    value: guessedWarframe.shield,
    variant: checkGuess(correctWarframe.shield, guessedWarframe.shield),
    display: guessedWarframe.shield,
  },
  {
    label: "Element",
    value: guessedWarframe.progenitor,
    variant: checkGuess(correctWarframe.progenitor, guessedWarframe.progenitor),
    display: guessedWarframe.progenitor,
  },
  {
    label: "Release Date",
    value: parseReleaseDate(guessedWarframe.releaseDate),
    variant: checkGuess(
      parseReleaseDate(correctWarframe.releaseDate),
      parseReleaseDate(guessedWarframe.releaseDate),
    ),
    display: parseReleaseDate(guessedWarframe.releaseDate),
  },
]);
</script>
<template>
  <div class="contents">
    <UiFeedbackTile
      field-label="Warframe"
      :field-value="guessedWarframe.name"
      :show-visual-assist="true"
      tooltip-disabled
    >
      <NuxtImg
        provider="imagekit"
        :src="guessedWarframe.image"
        :alt="guessedWarframe.name"
        preload
        placeholder
        height="76"
        width="76"
      />
      <UBadge
        :label="guessedWarframe.name"
        variant="subtle"
        color="neutral"
        :ui="{
          label: 'whitespace-normal',
        }"
        class="absolute bottom-0 flex w-full justify-center rounded-none px-1 py-0.5 text-center break-normal text-default opacity-90 ring-0"
      />
    </UiFeedbackTile>
    <UiFeedbackTile
      v-for="tile of feedbackTiles"
      :key="tile.label"
      :variant="tile.variant"
      :field-label="tile.label"
      :field-value="tile.value"
      :show-visual-assist="true"
      :class="tile.class"
    >
      <div
        v-if="tile.label === 'Element'"
        class="flex flex-col items-center gap-1"
      >
        <NuxtImg
          :src="`/elements/${tile.value}.png`"
          :alt="`${tile.value} element`"
          preload
          height="36"
          width="36"
        />
        <p class="text-sm">{{ tile.display }}</p>
      </div>
      <template v-else>
        {{ tile.display }}
      </template>
    </UiFeedbackTile>
  </div>
</template>
