<template>
  <div class="space-y-4">
    <div class="grid grid-cols-6 gap-4">
      <UiStatsCard label="Played" :value="modeStats.plays" class="col-span-2" />
      <UiStatsCard label="Wins" :value="modeStats.wins" class="col-span-2" />
      <UiStatsCard label="Win %" :value="winPercentage" class="col-span-2" />
      <UiStatsCard
        label="Current Streak"
        :value="modeStats.streak"
        class="col-span-3"
      />
      <UiStatsCard
        label="Longest Streak"
        :value="modeStats.maxStreak"
        class="col-span-3"
      />
    </div>
    <div class="space-y-4">
      <p class="font-semibold uppercase">Guess Distribution</p>
      <VisXYContainer :data="data">
        <VisStackedBar
          bar-min-height1-px
          :x="x"
          :y="y"
          :orientation="Orientation.Horizontal"
        />
        <VisAxis
          :grid-line="false"
          :domain-line="false"
          type="y"
          :tick-values="[1, 2, 3, 4, 5, 6]"
          :x="x"
          :y="y"
        />
        <VisAxis
          :grid-line="false"
          :domain-line="false"
          type="x"
          :x="x"
          :y="y"
        />
      </VisXYContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VisXYContainer, VisStackedBar, VisAxis } from "@unovis/vue";
import { Orientation } from "@unovis/ts";

const route = useRoute();
const { stats } = storeToRefs(useGameStore());

const modeStats = computed(() => {
  if (route.name === "ability") {
    return stats.value.ability;
  }
  if (route.name === "classic") {
    return stats.value.classic;
  }
  return {
    plays: 0,
    wins: 0,
    streak: 0,
    guesses: [0, 0, 0, 0, 0, 0],
    maxStreak: 0,
  };
});

const winPercentage = computed(() => {
  return modeStats.value.plays
    ? ((modeStats.value.wins / modeStats.value.plays) * 100).toFixed(2)
    : 0;
});

const data = computed(() => {
  return modeStats.value.guesses.map((guess, index) => ({
    x: index + 1,
    y: guess,
  }));
});

type DataRecord = { x: number; y: number };

const x = (d: DataRecord) => d.x;
const y = (d: DataRecord) => d.y;
</script>
