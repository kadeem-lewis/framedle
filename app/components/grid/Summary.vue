<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
const { generateGridGameMatrix } = useShareText();
const { currentDailyGridData } = storeToRefs(useDailiesStore());
const gridGameStore = useGridGameStore();
const { rarityScore } = storeToRefs(gridGameStore);
const { MAX_GRID_ATTEMPTS } = gridGameStore;
const { stats } = storeToRefs(useStatsStore());

const { openDialog, closeDialog } = useDialog();

function handleStatsClick() {
  openDialog(dialogOptions.STATS);
}

const feedbackGrid = computed(() => generateGridGameMatrix());

const gameCompleted = computed(() => {
  if (!currentDailyGridData.value) return false;
  return Object.values(currentDailyGridData.value.gridState).every(
    (cell) => cell.value,
  );
});
</script>
<template>
  <div class="flex flex-col gap-2">
    <p class="text-center text-lg font-semibold uppercase">
      Framedle Grid #{{ currentDailyGridData?.day }}
    </p>
    <div class="mx-auto grid w-fit grid-cols-3 gap-2">
      <template v-for="(row, i) in feedbackGrid" :key="i">
        <div
          v-for="(value, j) in row"
          :key="j"
          class="flex size-16 items-center justify-center rounded-lg"
          :class="{
            'bg-success': value === 1,
            'bg-accented': value === 0,
            'bg-info': value === 2,
          }"
        >
          <span v-if="value === 2" class="text-center text-sm font-bold"
            >EXTRA</span
          >
        </div>
      </template>
    </div>
    <p class="flex flex-col items-center gap-1">
      <span class="font-semibold uppercase">Uniqueness</span>
      <span>
        {{ rarityScore }}
      </span>
    </p>
    <UCard v-if="currentDailyGridData?.isOvertime && !gameCompleted">
      <template #title>
        <div class="flex gap-2">
          <UBadge class="rounded-none font-semibold uppercase">New</UBadge>
          <p class="font-semibold uppercase">Keep Guessing: Try Last Gasp</p>
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <p>
          <span class="font-semibold">Complete your grid</span>, no matter how
          many guesses it takes.
        </p>
        <p>
          <span class="font-semibold"
            >Only your first {{ MAX_GRID_ATTEMPTS }} attempts</span
          >
          count towards your score and stats.
        </p>
        <div class="flex justify-center gap-2">
          <UButton
            variant="tenno"
            trailing-icon="i-mdi-play-circle"
            @click="closeDialog"
            >Keep Guessing</UButton
          >
          <UButton
            variant="tenno"
            trailing-icon="i-heroicons-calendar-solid"
            :to="{
              name: 'archive',
              query: { mode: 'grid' },
            }"
          >
            Play Past Days
          </UButton>
        </div>
      </div>
    </UCard>
    <div class="flex flex-col items-center gap-2">
      <p class="text-center font-semibold uppercase">Your Stats</p>
      <div class="flex justify-center gap-2">
        <UBadge size="xl" variant="outline" class="rounded-none"
          >Games Played:{{ stats.grid.plays }}</UBadge
        >
        <UBadge
          size="xl"
          variant="outline"
          icon="my-icon-flame"
          class="rounded-none"
          >Streak:{{ stats.grid.streak }}</UBadge
        >
      </div>
      <UButton
        icon="i-heroicons-chart-bar-solid"
        variant="tenno"
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
