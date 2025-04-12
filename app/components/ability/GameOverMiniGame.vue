<script setup lang="ts">
import type { Ability, Warframe } from "#shared/schemas/warframe";

const { correctWarframe, correctAbility } = defineProps<{
  correctWarframe: Warframe;
  correctAbility: Ability;
}>();

const { selectedMinigameAbility } = storeToRefs(useGameStore());
const mode = useGameMode();

function handleAbilityClick(ability: string) {
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    if (selectedMinigameAbility.value[mode.value]) return;
    selectedMinigameAbility.value[mode.value] = ability;
  }
}

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
      :alt="correctAbility.name"
      format="webp"
      height="96"
      class="mx-auto mb-2 h-24 w-24 object-cover ring invert dark:invert-0"
    />
    <div class="flex flex-col gap-2">
      <ul class="flex flex-col gap-2">
        <li
          v-for="ability in abilityNames"
          :key="ability"
          class="cursor-pointer px-2 py-1 ring"
          :class="{
            'bg-success':
              (selectedMinigameAbility[mode] === ability &&
                selectedMinigameAbility[mode] === correctAbility.name) ||
              (selectedMinigameAbility[mode] &&
                selectedMinigameAbility[mode] !== correctAbility.name &&
                ability === correctAbility.name),
            'bg-error': selectedMinigameAbility[mode] === ability,
          }"
          @click="handleAbilityClick(ability)"
        >
          {{ ability }}
        </li>
      </ul>
      <div
        v-if="selectedMinigameAbility[mode]"
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
