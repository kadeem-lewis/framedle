<script setup lang="ts">
import type { Ability } from "#shared/schemas/warframe";
import { format } from "date-fns";

const { correctWarframe, correctAbility } = defineProps<{
  correctWarframe: Warframe;
  correctAbility: Ability;
}>();

const { selectedMinigameAbility } = storeToRefs(useGameStore());
const { currentDay } = storeToRefs(useDailiesStore());
const { mode } = useGameMode();

function handleAbilityClick(ability: string) {
  if (mode.value === "ability") {
    if (selectedMinigameAbility.value.ability) return;
    db.progress
      .where({
        mode: "ability",
        ...(currentDay.value
          ? { day: currentDay.value }
          : { date: format(new Date(), "yyyy-MM-dd") }),
      })
      .modify({
        selectedMinigameAbility: ability,
      })
      .catch((e) => {
        console.error("Failed to update daily state", e);
      });
  }
  if (mode.value === "abilityUnlimited") {
    if (selectedMinigameAbility.value.abilityUnlimited) return;
    selectedMinigameAbility.value.abilityUnlimited = ability;
  }
}

const hasSelected = computed(() => {
  if (mode.value !== "ability" && mode.value !== "abilityUnlimited") return;
  return !!selectedMinigameAbility.value[mode.value];
});
const isCorrectAnswer = (ability: string) => ability === correctAbility.name;
const isUserSelection = (ability: string) => {
  if (mode.value !== "ability" && mode.value !== "abilityUnlimited")
    return false;
  return selectedMinigameAbility.value[mode.value] === ability;
};
const userWasCorrect = computed(() => {
  if (mode.value !== "ability" && mode.value !== "abilityUnlimited") return;
  return (
    hasSelected.value &&
    selectedMinigameAbility.value[mode.value] === correctAbility.name
  );
});

// I save the selected item to the store and maybe some key for checking if it was previous completed if I don't want to show the animation again
const abilityNames = computed(() =>
  correctWarframe.abilities.map((ability) => ability.name),
);
</script>
<template>
  <div
    v-if="mode === 'ability' || mode === 'abilityUnlimited'"
    class="flex flex-col gap-2"
  >
    <div class="text-center font-semibold uppercase">
      <p>Bonus</p>
      <p>Guess the ability name</p>
    </div>
    <NuxtImg
      v-if="correctAbility"
      :src="`https://cdn.warframestat.us/img/${correctAbility.imageName}`"
      alt="ability image"
      format="webp"
      height="96"
      class="mx-auto mb-2 h-24 w-24 object-cover ring invert dark:invert-0"
    />
    <div class="flex flex-col gap-2">
      <ul class="flex flex-col gap-2">
        <li
          v-for="ability in abilityNames"
          :key="ability"
          class="cursor-pointer border px-2 py-1"
          :class="{
            'bg-success':
              hasSelected &&
              ((isUserSelection(ability) && isCorrectAnswer(ability)) || // User picked correct
                (!userWasCorrect && isCorrectAnswer(ability))), // Show correct answer if user was wrong
            'bg-error':
              hasSelected &&
              isUserSelection(ability) &&
              !isCorrectAnswer(ability), // User picked wrong
          }"
          @click="handleAbilityClick(ability)"
        >
          {{ ability }}
        </li>
      </ul>
      <div
        v-if="
          selectedMinigameAbility[mode] && selectedMinigameAbility[mode] !== ''
        "
        class="text-center font-medium uppercase"
      >
        <p
          v-if="selectedMinigameAbility[mode] === correctAbility.name"
          class="text-success"
        >
          You got it!
        </p>
        <p v-else class="text-error">Better Luck Next Time</p>
      </div>
    </div>
  </div>
</template>
