<script setup lang="ts">
import { warframes } from "#shared/data/warframes";
import { sexes, variant, progenitorElements } from "#shared/schemas/warframe";

// TODO: See if there is a more elegant solution to fixing asserting that correctWarframe is not undefined and having to spread certain readonly arrays

const { guessedItems, correctWarframe } = storeToRefs(useGameStore());
const { mode } = useGameMode();

const items = computed(() => {
  if (!mode.value) return [];
  if (mode.value === "classicUnlimited")
    return guessedItems.value.classicUnlimited.map((guess) => warframes[guess]);
  return guessedItems.value.classic.map((guess) => warframes[guess]);
});

const sexFeedback = computed(() =>
  useFeedback(sexes, items, "sex", correctWarframe.value!.sex),
);

const variantFeedback = computed(() =>
  useFeedback(variant, items, "variant", correctWarframe.value!.variant),
);

const progenitorFeedback = computed(() =>
  useFeedback(
    progenitorElements,
    items,
    "progenitor",
    correctWarframe.value!.progenitor,
  ),
);

const playstyleFeedback = computed(() =>
  useMultipleFeedback(items, [...correctWarframe.value!.playstyle]),
);

const healthFeedback = computed(() =>
  useRangeFeedback(items, "health", correctWarframe.value!.health),
);
const shieldFeedback = computed(() =>
  useRangeFeedback(items, "shield", correctWarframe.value!.shield),
);
const releaseDateFeedback = computed(() =>
  useRangeFeedback(
    items,
    "releaseDate",
    parseReleaseDate(correctWarframe.value!.releaseDate),
    2012,
    new Date().getFullYear(),
  ),
);

function useFeedback(
  options: readonly string[],
  items: MaybeRef<Warframe[]>,
  valueField: "sex" | "variant" | "progenitor",
  correctValue: string,
): { state: "correct" | "incorrect"; value?: string } {
  const values = toValue(items);
  const optionsSet = new Set(options);
  values.forEach((value) => optionsSet.delete(value[valueField]));
  const correctValueGuessed = values.some(
    (value) => correctValue === value[valueField],
  );
  if (optionsSet.size === 1 || correctValueGuessed)
    return { state: "correct", value: correctValue };
  return { state: "incorrect" };
}

const { checkGuess } = useGuess();

function useMultipleFeedback(
  items: MaybeRef<Warframe[]>,
  correctValues: string[],
): { state: Result; value?: string } {
  const values = toValue(items);
  const partialGroups: string[][] = [];
  const incorrectValues = new Set<string>();
  let hasPartial = false;

  for (const value of values) {
    const state = checkGuess(correctValues, [...value.playstyle]);
    if (state === "correct") {
      return { state: "correct", value: correctValues.join(", ") };
    }

    if (state === "partial") {
      partialGroups.push([...value.playstyle]);
      hasPartial = true;
      continue;
    }

    value.playstyle.forEach((playstyle) => incorrectValues.add(playstyle));
  }

  const confirmedValues = new Set<string>();

  for (const group of partialGroups) {
    if (group.length === 1 && group[0]) {
      // If there is only one value in the group then it is guaranteed to be present if the state was partial.
      confirmedValues.add(group[0]);
      continue;
    }

    const survivors = group.filter((value) => !incorrectValues.has(value));

    if (survivors.length === 1 && survivors[0]) {
      // If there is only one survivor then that refines a partial group to a correct value.
      confirmedValues.add(survivors[0]);
    }
  }
  if (hasPartial) {
    if (confirmedValues.size === 0) {
      return { state: "partial" };
    }
    if (confirmedValues.size === correctValues.length) {
      return { state: "correct", value: correctValues.join(", ") };
    }
    return {
      state: "partial",
      value: `${[...confirmedValues].join(", ")} \n+ more`,
    };
  }

  return { state: "incorrect" };
}

function useRangeFeedback(
  items: MaybeRef<Warframe[]>,
  valueField: "health" | "shield" | "releaseDate",
  correctValue: number,
  minDefault = -Infinity,
  maxDefault = Infinity,
):
  | { state: "correct"; value: number }
  | { state: "incorrect"; min: number | "???"; max: number | "???" } {
  const values = toValue(items);
  let min = minDefault;
  let max = maxDefault;

  for (const value of values) {
    const currentValue =
      valueField === "releaseDate"
        ? parseReleaseDate(value.releaseDate)
        : value[valueField];
    if (currentValue === correctValue) {
      return { state: "correct", value: correctValue };
    } else if (currentValue < correctValue) {
      min = Math.max(min, currentValue);
    } else if (currentValue > correctValue) {
      max = Math.min(max, currentValue);
    }
  }

  return {
    state: "incorrect",
    min: min === -Infinity ? "???" : min,
    max: max === Infinity ? "???" : max,
  };
}
</script>
<template>
  <div class="grid w-[190%] grid-cols-8 gap-1 md:ml-[-45%]">
    <UiFeedbackTile field-label="Summary" tooltip-disabled
      >Summary</UiFeedbackTile
    >
    <UiFeedbackTile
      field-label="Sex"
      :variant="sexFeedback.state"
      tooltip-disabled
      >{{ sexFeedback.value }}</UiFeedbackTile
    >
    <UiFeedbackTile
      field-label="Variant"
      :variant="variantFeedback.state"
      tooltip-disabled
    >
      {{ variantFeedback.value }}
    </UiFeedbackTile>
    <UiFeedbackTile
      field-label="Playstyle"
      :variant="playstyleFeedback.state"
      tooltip-disabled
      >{{ playstyleFeedback.value }}</UiFeedbackTile
    >
    <UiFeedbackTile
      field-label="Health"
      :variant="healthFeedback.state"
      tooltip-disabled
    >
      <span v-if="healthFeedback.state === 'incorrect'">
        {{ healthFeedback.min }} - {{ healthFeedback.max }}
      </span>
      <span v-else>{{ healthFeedback.value }}</span>
    </UiFeedbackTile>
    <UiFeedbackTile
      field-label="Shields"
      :variant="shieldFeedback.state"
      tooltip-disabled
    >
      <span v-if="shieldFeedback.state === 'incorrect'">
        {{ shieldFeedback.min }} - {{ shieldFeedback.max }}
      </span>
      <span v-else>{{ shieldFeedback.value }}</span>
    </UiFeedbackTile>
    <UiFeedbackTile
      field-label="Progenitor"
      :variant="progenitorFeedback.state"
      tooltip-disabled
    >
      <div
        v-if="progenitorFeedback.state === 'correct'"
        class="flex flex-col items-center gap-1"
      >
        <NuxtImg
          format="avif"
          :src="`/elements/${progenitorFeedback.value}.png`"
          :alt="progenitorFeedback.value"
          height="36"
          width="36"
          preload
        />
        <p class="text-sm">{{ progenitorFeedback.value }}</p>
      </div></UiFeedbackTile
    >
    <UiFeedbackTile
      field-label="Release Date"
      :variant="releaseDateFeedback.state"
      tooltip-disabled
    >
      <span v-if="releaseDateFeedback.state === 'incorrect'">
        {{ releaseDateFeedback.min }} - {{ releaseDateFeedback.max }}
      </span>
      <span v-else>{{ releaseDateFeedback.value }}</span>
    </UiFeedbackTile>
  </div>
</template>
