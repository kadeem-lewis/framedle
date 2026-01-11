<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
const { mode } = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());
const { generateGridGameMatrix } = useShareText();
const { currentDailyGridData } = storeToRefs(useDailiesStore());
const { rarityScore } = storeToRefs(useGridGameStore());
const { stats } = storeToRefs(useStatsStore());

watchEffect(() => {
  if (mode.value && isGameOver.value) {
    console.log("You did stuff!");
  }
});

const { openDialog } = useDialog();

function handleStatsClick() {
  openDialog(dialogOptions.STATS);
}

const feedbackGrid = computed(() => generateGridGameMatrix());
</script>
<template>
  <div class="space-y-2">
    <p class="text-center text-lg font-semibold uppercase">
      Framedle Grid #{{ currentDailyGridData?.day }}
    </p>
    <div class="mx-auto grid w-fit grid-cols-3 gap-2">
      <template v-for="(row, i) in feedbackGrid" :key="i">
        <div
          v-for="(value, j) in row"
          :key="j"
          class="size-16 rounded-lg"
          :class="{
            'bg-success': value === 1,
            'bg-accented': value === 0,
          }"
        />
      </template>
    </div>
    <p class="flex flex-col items-center gap-1">
      <span class="font-semibold uppercase">Uniqueness</span>
      <span>
        {{ rarityScore }}
      </span>
    </p>
    <USeparator />
    <div class="flex flex-col items-center gap-2">
      <p class="text-center font-semibold uppercase">Your Stats</p>
      <div class="flex justify-center gap-2">
        <UBadge size="xl" variant="outline"
          >Games Played:{{ stats.grid.plays }}</UBadge
        >
        <UBadge size="xl" variant="outline" icon="my-icon-flame"
          >Streak:{{ stats.grid.streak }}</UBadge
        >
      </div>
      <UButton
        icon="i-heroicons-chart-bar-solid"
        variant="outline"
        class="font-semibold uppercase"
        @click="handleStatsClick"
        >View All Stats</UButton
      >
    </div>
    <USeparator />
    <div class="flex flex-col items-center gap-2">
      <p class="font-semibold uppercase">Share Your Grid</p>
      <ShareOptions />
    </div>
    <USeparator />
    <div>
      <NextGameCountdown :target-date="startOfTomorrow()" />
    </div>
  </div>
</template>
