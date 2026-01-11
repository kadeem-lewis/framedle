<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { defu } from "defu";

const route = useRoute();
const { stats } = storeToRefs(useStatsStore());
const { DEFAULT_ATTEMPTS } = useGameStore();
const { isDaily, gameType } = useGameMode();

const legacyStats = computed<LegacyModeStats | null>(() => {
  if (route.name === "ability-path") return stats.value.ability;
  if (route.name === "classic-path") return stats.value.classic;
  return null;
});

const gridStats = computed(() => stats.value.grid);

const activeStats = computed(() => {
  if (gameType.value === "grid") return gridStats.value;
  return legacyStats.value || { plays: 0, streak: 0, maxStreak: 0 };
});

const winPercentage = computed(() => {
  if (!legacyStats.value || !legacyStats.value.plays) return 0;
  return ((legacyStats.value.wins / legacyStats.value.plays) * 100).toFixed(2);
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
        formatter: (val: number) => (val === 0 ? "" : val),
        offsetX: -10,
      },
    },
    baseOptions.value,
  );
});

const series = computed(() => [
  {
    name: "Guesses",
    data: legacyStats.value?.guesses || [],
  },
]);

const isOpen = ref(false);

const { handleStatsShare, statsCopied } = useShareText();
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
      <UiStatsCard
        label="Played"
        :value="activeStats.plays"
        :class="[gameType === 'grid' ? 'col-span-3' : 'col-span-2']"
      />
      <template v-if="legacyStats && isDaily">
        <UiStatsCard
          label="Wins"
          :value="legacyStats.wins"
          class="col-span-2"
        />
        <UiStatsCard label="Win %" :value="winPercentage" class="col-span-2" />
      </template>
      <UiStatsCard
        v-if="gameType === 'grid'"
        label="Average Score"
        :value="gridStats.averageScore"
        class="col-span-3"
      />
      <UiStatsCard
        label="Current Streak"
        :value="activeStats.streak"
        class="col-span-3"
      />
      <UiStatsCard
        label="Longest Streak"
        :value="activeStats.maxStreak"
        class="col-span-3"
      />
    </div>
    <div class="space-y-4">
      <template v-if="gameType === 'ability' || gameType === 'classic'">
        <p class="font-semibold uppercase">Guess Distribution</p>
        <apexchart
          ref="chart"
          type="bar"
          :options="chartOptions"
          :series="series"
        />
      </template>
      <p class="font-semibold uppercase">Scores Distribution</p>
      <ScoresDistributionChart
        v-if="gameType === 'grid'"
        :scores="gridStats.scoreDistribution"
      />
    </div>
    <div class="flex justify-center gap-4">
      <UButton
        variant="outline"
        size="lg"
        class="uppercase"
        @click="handleStatsShare"
      >
        <span v-if="!statsCopied" class="flex items-center gap-1">
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
