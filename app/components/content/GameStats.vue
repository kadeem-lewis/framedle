<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { defu } from "defu";

const route = useRoute();
const { stats } = storeToRefs(useStatsStore());
const { DEFAULT_ATTEMPTS } = useGameStore();

const modeStats = computed(() => {
  if (route.name === "ability-path") {
    return stats.value.ability;
  }
  if (route.name === "classic-path") {
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

const chart = useTemplateRef("chart");
const { baseOptions } = useChartConfig(chart);

const chartOptions = computed<ApexOptions>(() => {
  return defu(
    {
      xaxis: {
        categories: Array.from({ length: DEFAULT_ATTEMPTS }, (_, i) => i + 1),
        labels: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        textAnchor: "start",
        offsetX: -10,
      },
    },
    baseOptions.value,
  );
});

const series = [
  {
    name: "Guesses",
    data: modeStats.value.guesses,
  },
];

const isOpen = ref(false);

const { handleStatsShare, copied } = useShare();
const { resetStats } = useStatsStore();

function handleResetStats() {
  resetStats();
  isOpen.value = false;
}

const { migrateGameStats, shouldShowMigrationBanner } = useMigration();
const hasMigrationBeenPerformed = ref(
  shouldShowMigrationBanner.value === false,
);
const toast = useToast();

function handleMigrationClick() {
  const result = migrateGameStats();

  if (result.success) {
    toast.add({
      title: "Success!",
      description: result.message,
      color: "success",
    });
    hasMigrationBeenPerformed.value = true;
  } else {
    toast.add({ title: "Oops!", description: result.message, color: "error" });
  }
}
</script>
<template>
  <div class="space-y-4">
    <UBanner
      v-if="shouldShowMigrationBanner && !hasMigrationBeenPerformed"
      title="Game stats have been reset"
    >
      <template #actions>
        <UButton
          class="uppercase"
          color="neutral"
          @click="handleMigrationClick"
        >
          Migrate old stats
        </UButton>
      </template>
    </UBanner>
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
      <apexchart
        ref="chart"
        type="bar"
        :options="chartOptions"
        :series="series"
      />
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
      <UiConfirmPopup
        title="Are you sure you want to clear your stats?"
        success-label="Delete"
        cancel-label="Cancel"
        @confirm="handleResetStats"
      >
        <UButton variant="outline" size="lg" class="uppercase">Reset</UButton>
      </UiConfirmPopup>
    </div>
  </div>
</template>
