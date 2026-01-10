<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { defu } from "defu";
const { averageScores } = defineProps<{
  averageScores: {
    [key: string]: number;
  };
}>();

const chart = useTemplateRef("chart");
const { baseOptions } = useChartConfig(chart);

const chartOptions = computed<ApexOptions>(() => {
  return defu(
    {
      xaxis: {
        categories: Object.keys(averageScores),
        labels: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top",
          },
          borderRadius: 3,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        offsetY: -16,
        formatter: (value: number) => {
          if (value === 0) return "";
          if (value > 1000) return Math.floor(value / 1000).toFixed(1) + "k";
          return value;
        },
      },
    },
    baseOptions.value,
  );
});

const series = [
  {
    name: "Average Scores",
    data: Object.values(averageScores),
  },
];
</script>
<template>
  <div>
    <div class="flex items-center justify-between px-2 py-1">
      <p class="font-semibold uppercase">Scores</p>
      <UButton
        variant="ghost"
        color="neutral"
        icon="i-heroicons-x-mark-solid"
      />
    </div>
    <USeparator />
    <apexchart
      ref="chart"
      type="bar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
