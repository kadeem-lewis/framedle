<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

const route = useRoute();
const { stats } = storeToRefs(useStatsStore());
const { defaultAttempts } = useGameStore();

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

const colorMode = useColorMode();

const chartOptions: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: Array.from({ length: defaultAttempts }, (_, i) => i + 1),
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: "top",
      },
      borderRadius: 3,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: -10,
    style: {
      colors: [colorMode.value === "dark" ? "#fff" : "#000"],
    },
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  colors: [colorMode.value === "dark" ? "#fbbf24" : "#f59e0b"],
};

const series = [
  {
    name: "Guesses",
    data: modeStats.value.guesses,
  },
];

const isOpen = ref(false);

const { handleStatsShare, copied } = useShare();
const { resetStats } = useStatsStore();
</script>
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
      <apexchart type="bar" :options="chartOptions" :series="series" />
    </div>
    <div class="flex justify-center gap-4">
      <UButton
        variant="outline"
        size="lg"
        class="uppercase"
        @click="handleStatsShare"
      >
        <span v-if="!copied" class="flex items-center gap-1">
          <UIcon name="i-heroicons-share-solid" class="size-5" />
          Share
        </span>
        <span v-else>Copied</span>
      </UButton>
      <UPopover
        v-model:open="isOpen"
        :content="{ side: 'top' }"
        arrow
        class="rounded-none"
      >
        <UButton variant="outline" size="lg" class="uppercase">Reset</UButton>
        <template #content>
          <div class="flex flex-col gap-1 px-3 py-2">
            <p class="font-semibold">
              Are you sure you want to clear your stats?
            </p>
            <div class="flex justify-end gap-2">
              <UButton class="uppercase" @click="isOpen = false"
                >Cancel</UButton
              >
              <UButton color="error" class="uppercase" @click="resetStats"
                >Delete</UButton
              >
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>
